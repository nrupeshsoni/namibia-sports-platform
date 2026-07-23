import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";
import { SchoolForm, type SchoolFormData } from "@/components/admin/SchoolForm";

export function AdminSchoolsPanel() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<
    { mode: "create" } | { mode: "edit"; data: SchoolFormData } | null
  >(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const listQuery = trpc.schools.list.useQuery({});
  const deleteMut = trpc.schools.delete.useMutation({
    onSuccess: () => {
      utils.schools.list.invalidate();
      setDeleteId(null);
    },
  });

  const items = (listQuery.data ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4" /> Add School
        </Button>
      </div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">Name</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">City</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">Region</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {listQuery.isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No schools found.</td>
              </tr>
            ) : (
              items.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-white/[0.02]"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <td className="px-4 py-3 text-sm text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{s.city ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{s.region ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() =>
                          setModal({
                            mode: "edit",
                            data: {
                              id: s.id,
                              name: s.name,
                              region: s.region,
                              city: s.city,
                              contactEmail: s.contactEmail,
                              contactPhone: s.contactPhone,
                              sportsOffered: s.sportsOffered,
                            },
                          })
                        }
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => setDeleteId(s.id)}
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
        title={modal?.mode === "create" ? "Add School" : "Edit School"}
      >
        {modal && (
          <SchoolForm
            mode={modal.mode}
            initialData={modal.mode === "edit" ? modal.data : undefined}
            onSuccess={() => setModal(null)}
          />
        )}
      </EntityModal>
      {deleteId != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setDeleteId(null)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{ background: "rgba(17,17,17,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium">Delete this school?</p>
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
