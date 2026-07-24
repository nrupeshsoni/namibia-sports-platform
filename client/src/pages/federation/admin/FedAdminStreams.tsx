import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";
import { StreamForm, type StreamFormData } from "@/components/admin/StreamForm";
import { CreateFedPicker } from "@/components/admin/CreateFedPicker";

const ADMIN_LIMIT = 200;

export default function FedAdminStreams({ federationId }: { federationId?: number }) {
  const [search, setSearch] = useState("");
  const [createFedId, setCreateFedId] = useState<number | undefined>(federationId);
  const [modal, setModal] = useState<
    { mode: "create" } | { mode: "edit"; data: StreamFormData } | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; federationId: number } | null>(
    null
  );

  const utils = trpc.useUtils();
  const listQuery = trpc.streams.list.useQuery({
    ...(federationId != null ? { federationId } : {}),
    limit: ADMIN_LIMIT,
  });
  const setLiveMut = trpc.streams.setLive.useMutation({
    onSuccess: () => listQuery.refetch(),
  });
  const deleteMut = trpc.streams.delete.useMutation({
    onSuccess: () => {
      utils.streams.list.invalidate();
      setDeleteTarget(null);
    },
  });

  const items = (listQuery.data ?? []).filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const formFedId =
    modal?.mode === "edit" ? modal.data.federationId : (federationId ?? createFedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search streams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => {
            setCreateFedId(federationId);
            setModal({ mode: "create" });
          }}
        >
          <Plus className="h-4 w-4" /> Add Stream
        </Button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Platform</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Scheduled</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium" />
            </tr>
          </thead>
          <tbody>
            {listQuery.isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No streams found.</td>
              </tr>
            ) : (
              items.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-white/[0.02]"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <td className="px-4 py-3 text-sm text-white font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{s.platformType ?? "—"}</td>
                  <td className="px-4 py-3">
                    {s.isLive ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs animate-pulse">
                          ● LIVE
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-gray-400"
                          onClick={() => {
                            if (s.federationId == null) return;
                            setLiveMut.mutate({
                              id: s.id,
                              federationId: s.federationId,
                              isLive: false,
                            });
                          }}
                          disabled={setLiveMut.isPending || s.federationId == null}
                        >
                          End
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Offline</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-green-400 hover:text-green-300"
                          onClick={() => {
                            if (s.federationId == null) return;
                            setLiveMut.mutate({
                              id: s.id,
                              federationId: s.federationId,
                              isLive: true,
                            });
                          }}
                          disabled={setLiveMut.isPending || s.federationId == null}
                        >
                          Go Live
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {s.scheduledStart ? new Date(s.scheduledStart).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          if (s.federationId == null) return;
                          setModal({
                            mode: "edit",
                            data: {
                              id: s.id,
                              title: s.title,
                              platformType: s.platformType ?? "youtube",
                              streamUrl: s.streamUrl,
                              embedUrl: s.embedUrl,
                              thumbnailUrl: s.thumbnailUrl,
                              scheduledStart: s.scheduledStart,
                              scheduledEnd: s.scheduledEnd,
                              isLive: s.isLive,
                              federationId: s.federationId,
                            },
                          });
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => {
                          if (s.federationId == null) return;
                          setDeleteTarget({ id: s.id, federationId: s.federationId });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EntityModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "Add Stream" : "Edit Stream"}
      >
        {modal && (
          <div className="space-y-4">
            {modal.mode === "create" && federationId == null && (
              <CreateFedPicker value={createFedId} onChange={setCreateFedId} />
            )}
            {formFedId != null ? (
              <StreamForm
                mode={modal.mode}
                federationId={formFedId}
                initialData={modal.mode === "edit" ? modal.data : undefined}
                onSuccess={() => setModal(null)}
              />
            ) : (
              <p className="text-sm text-gray-500">Select a federation to continue.</p>
            )}
          </div>
        )}
      </EntityModal>

      {deleteTarget != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{ background: "rgba(17,17,17,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium">Delete this stream?</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 border border-white/10" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleteMut.isPending}
                onClick={() =>
                  deleteMut.mutate({
                    id: deleteTarget.id,
                    federationId: deleteTarget.federationId,
                  })
                }
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
