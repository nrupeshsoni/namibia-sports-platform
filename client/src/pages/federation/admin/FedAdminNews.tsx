import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function NewsForm({
  mode,
  federationId,
  initialData,
  onSuccess,
}: {
  mode: "create" | "edit";
  federationId: number;
  initialData?: { id: number; title: string; slug: string; content?: string | null; summary?: string | null; category?: string | null };
  onSuccess: () => void;
}) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    content: initialData?.content ?? "",
    summary: initialData?.summary ?? "",
    category: initialData?.category ?? "",
  });

  const createMut = trpc.news.create.useMutation({
    onSuccess: () => { utils.news.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.news.update.useMutation({
    onSuccess: () => { utils.news.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) { setError("Title is required"); return; }
    const slug = form.slug || toSlug(form.title);
    if (mode === "create") {
      createMut.mutate({
        federationId,
        title: form.title,
        slug,
        content: form.content || undefined,
        summary: form.summary || undefined,
        category: form.category || undefined,
      });
    } else if (initialData) {
      updateMut.mutate({
        id: initialData.id,
        federationId,
        title: form.title,
        slug,
        content: form.content || undefined,
        summary: form.summary || undefined,
        category: form.category || undefined,
      });
    }
  };

  const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
  const L = "text-sm text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <label className={L}>Title *</label>
        <Input
          className={F}
          value={form.title}
          onChange={(e) =>
            setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || toSlug(e.target.value) }))
          }
          placeholder="Article title"
        />
      </div>
      {mode === "create" && (
        <div>
          <label className={L}>Slug</label>
          <Input className={F} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="auto" />
        </div>
      )}
      <div>
        <label className={L}>Summary</label>
        <Input className={F} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Brief summary" />
      </div>
      <div>
        <label className={L}>Category</label>
        <Input className={F} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Results" />
      </div>
      <div>
        <label className={L}>Content</label>
        <textarea
          className={`${F} w-full min-h-[120px] resize-y rounded-md px-3 py-2`}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Article content..."
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {mode === "create" ? "Create Article" : "Save Changes"}
      </Button>
    </form>
  );
}

export default function FedAdminNews({ federationId }: { federationId: number }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | { edit: { id: number; title: string; slug: string; content?: string | null; summary?: string | null; category?: string | null } } | null>(null);

  const listQuery = trpc.news.list.useQuery({ federationId, includeUnpublished: true, limit: 100 });
  const publishMut = trpc.news.publish.useMutation({
    onSuccess: () => listQuery.refetch(),
  });

  const items = (listQuery.data ?? []).filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

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
        <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={() => setModal("create")}>
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
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {listQuery.isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No articles found.
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <td className="px-4 py-3 text-sm text-white font-medium">{n.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{n.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    {n.isPublished ? (
                      <Badge className="bg-green-600/20 text-green-400 text-xs border-green-600/30">Published</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Draft</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-amber-400 hover:text-amber-300"
                          onClick={() => publishMut.mutate({ id: n.id, federationId })}
                          disabled={publishMut.isPending}
                        >
                          Publish
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={() =>
                        setModal({
                          edit: {
                            id: n.id,
                            title: n.title,
                            slug: n.slug,
                            content: n.content,
                            summary: n.summary,
                            category: n.category,
                          },
                        })
                      }
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
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
        title={modal === "create" ? "Add Article" : "Edit Article"}
      >
        {modal === "create" ? (
          <NewsForm mode="create" federationId={federationId} onSuccess={() => setModal(null)} />
        ) : modal?.edit ? (
          <NewsForm
            mode="edit"
            federationId={federationId}
            initialData={modal.edit}
            onSuccess={() => setModal(null)}
          />
        ) : null}
      </EntityModal>
    </div>
  );
}
