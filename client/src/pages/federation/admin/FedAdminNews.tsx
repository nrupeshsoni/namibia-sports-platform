import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";
import { NewsForm, type NewsFormData } from "@/components/admin/NewsForm";
import { CreateFedPicker } from "@/components/admin/CreateFedPicker";

const ADMIN_LIMIT = 200;

export default function FedAdminNews({ federationId }: { federationId?: number }) {
  const [search, setSearch] = useState("");
  const [createFedId, setCreateFedId] = useState<number | undefined>(federationId);
  const [assignFedId, setAssignFedId] = useState<number | undefined>(undefined);
  const [modal, setModal] = useState<
    { mode: "create" } | { mode: "edit"; data: NewsFormData } | null
  >(null);
  const [publishTarget, setPublishTarget] = useState<{ id: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    federationId: number | null;
  } | null>(null);

  const utils = trpc.useUtils();
  const listQuery = trpc.news.list.useQuery({
    ...(federationId != null ? { federationId } : {}),
    includeUnpublished: true,
    limit: ADMIN_LIMIT,
  });
  const publishMut = trpc.news.publish.useMutation({
    onSuccess: () => {
      listQuery.refetch();
      setPublishTarget(null);
      setAssignFedId(undefined);
    },
  });
  const deleteMut = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      setDeleteTarget(null);
      setAssignFedId(undefined);
    },
  });

  const items = (listQuery.data ?? []).filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const isOrphan = (fedId: number | null | undefined) => fedId == null;

  const formFedId =
    modal?.mode === "edit"
      ? isOrphan(modal.data.federationId)
        ? assignFedId
        : modal.data.federationId
      : (federationId ?? createFedId);

  const publishFedId =
    publishTarget && deleteTarget == null
      ? isOrphan(
          items.find((n) => n.id === publishTarget.id)?.federationId ?? null
        )
        ? assignFedId
        : items.find((n) => n.id === publishTarget.id)?.federationId ?? undefined
      : undefined;

  const deleteFedId =
    deleteTarget != null
      ? isOrphan(deleteTarget.federationId)
        ? assignFedId ?? 0
        : deleteTarget.federationId
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => {
            setCreateFedId(federationId);
            setAssignFedId(undefined);
            setModal({ mode: "create" });
          }}
        >
          <Plus className="h-4 w-4" /> Add Article
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
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Federation</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Status</th>
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
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No articles found.</td>
              </tr>
            ) : (
              items.map((n) => (
                <tr
                  key={n.id}
                  className="border-b hover:bg-white/[0.02]"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <td className="px-4 py-3 text-sm text-white font-medium">{n.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{n.category ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {n.federationId == null ? (
                      <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/40">
                        No federation
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {n.isPublished ? (
                      <Badge variant="secondary" className="text-xs">Published</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-green-400 hover:text-green-300"
                          onClick={() => {
                            setAssignFedId(undefined);
                            if (n.federationId == null) {
                              setPublishTarget({ id: n.id });
                            } else {
                              publishMut.mutate({ id: n.id, federationId: n.federationId });
                            }
                          }}
                          disabled={publishMut.isPending}
                        >
                          Publish
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setAssignFedId(undefined);
                          setModal({
                            mode: "edit",
                            data: {
                              id: n.id,
                              title: n.title,
                              slug: n.slug,
                              content: n.content,
                              summary: n.summary,
                              category: n.category,
                              featuredImage: n.featuredImage,
                              sourceUrl: n.sourceUrl,
                              sourceName: n.sourceName,
                              federationId: n.federationId,
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
                          setAssignFedId(undefined);
                          setDeleteTarget({ id: n.id, federationId: n.federationId });
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
        onClose={() => {
          setModal(null);
          setAssignFedId(undefined);
        }}
        title={modal?.mode === "create" ? "Add Article" : "Edit Article"}
      >
        {modal && (
          <div className="space-y-4">
            {modal.mode === "create" && federationId == null && (
              <CreateFedPicker value={createFedId} onChange={setCreateFedId} />
            )}
            {modal.mode === "edit" && isOrphan(modal.data.federationId) && (
              <CreateFedPicker value={assignFedId} onChange={setAssignFedId} />
            )}
            {formFedId != null ? (
              <NewsForm
                mode={modal.mode}
                federationId={formFedId}
                initialData={modal.mode === "edit" ? modal.data : undefined}
                onSuccess={() => {
                  setModal(null);
                  setAssignFedId(undefined);
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">Select a federation to continue.</p>
            )}
          </div>
        )}
      </EntityModal>

      {publishTarget != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => {
            setPublishTarget(null);
            setAssignFedId(undefined);
          }}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 space-y-6"
            style={{ background: "rgba(17,17,17,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium text-center">Assign federation to publish</p>
            <CreateFedPicker value={assignFedId} onChange={setAssignFedId} />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 border border-white/10"
                onClick={() => {
                  setPublishTarget(null);
                  setAssignFedId(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={publishMut.isPending || publishFedId == null}
                onClick={() => {
                  if (publishFedId == null) return;
                  publishMut.mutate({ id: publishTarget.id, federationId: publishFedId });
                }}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => {
            setDeleteTarget(null);
            setAssignFedId(undefined);
          }}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{ background: "rgba(17,17,17,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium">Delete this article?</p>
            {isOrphan(deleteTarget.federationId) && federationId == null && (
              <CreateFedPicker value={assignFedId} onChange={setAssignFedId} />
            )}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 border border-white/10"
                onClick={() => {
                  setDeleteTarget(null);
                  setAssignFedId(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleteMut.isPending}
                onClick={() =>
                  deleteMut.mutate({
                    id: deleteTarget.id,
                    federationId: deleteFedId ?? 0,
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
