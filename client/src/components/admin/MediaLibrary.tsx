import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "./EntityModal";
import { ImageUpload } from "./ImageUpload";
import { trpc } from "@/lib/trpc";

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  /** When set, scopes library to federation entity media. */
  federationId?: number;
}

function MediaCreateForm({
  federationId,
  onSuccess,
}: {
  federationId: number;
  onSuccess: () => void;
}) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const createMut = trpc.media.create.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fileUrl) {
      setError("Upload or paste an image URL first");
      return;
    }
    createMut.mutate({
      title: title || undefined,
      fileUrl,
      type: "image",
      entityType: "federation",
      entityId: federationId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <Label className={L}>Title</Label>
        <Input
          className={F}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional caption"
        />
      </div>
      <ImageUpload
        label="Image"
        value={fileUrl}
        onChange={setFileUrl}
        federationId={federationId}
        entity="federation"
        entityId={federationId}
        variant="poster"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        Add to library
      </Button>
    </form>
  );
}

export function MediaLibrary({ federationId }: Props) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const listQuery = trpc.media.list.useQuery(
    federationId != null
      ? { entityType: "federation", entityId: federationId }
      : undefined
  );
  const utils = trpc.useUtils();
  const deleteMut = trpc.media.delete.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      setDeleteId(null);
    },
  });

  const items = (listQuery.data ?? []).filter((m) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (m.title ?? "").toLowerCase().includes(q) || m.fileUrl.toLowerCase().includes(q);
  });

  const canCreate = federationId != null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        {canCreate && (
          <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add media
          </Button>
        )}
      </div>

      {listQuery.isLoading ? (
        <p className="text-center text-gray-500 py-12">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No media found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="aspect-video bg-white/5">
                {m.type === "image" ? (
                  <img src={m.fileUrl} alt={m.title ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    {m.type}
                  </div>
                )}
              </div>
              <div className="p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{m.title || "Untitled"}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {m.entityType}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-400 shrink-0"
                  onClick={() => setDeleteId(m.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canCreate && (
        <EntityModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add media">
          <MediaCreateForm federationId={federationId!} onSuccess={() => setModalOpen(false)} />
        </EntityModal>
      )}

      {deleteId != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setDeleteId(null)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{
              background: "rgba(17,17,17,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium">Delete this media item?</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 border border-white/10" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate({ id: deleteId })}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
