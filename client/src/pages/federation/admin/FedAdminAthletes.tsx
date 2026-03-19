import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";
import { AthleteForm, type AthleteFormData } from "@/components/admin/AthleteForm";

interface FedAdminAthletesProps {
  federationId: number;
}

export default function FedAdminAthletes({ federationId }: FedAdminAthletesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; data: AthleteFormData } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; federationId: number | null } | null>(null);

  const utils = trpc.useUtils();
  const athletesQuery = trpc.athletes.list.useQuery({ federationId });
  const deleteMut = trpc.athletes.delete.useMutation({
    onSuccess: () => {
      utils.athletes.list.invalidate();
      setDeleteConfirm(null);
    },
  });

  const athletes = (athletesQuery.data ?? []) as AthleteFormData[];
  const filtered = athletes.filter((a) => {
    const name = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search athletes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setModal({ mode: "create" })}
        >
          <Plus className="h-4 w-4" /> Add Athlete
        </Button>
      </div>

      {athletesQuery.isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No athletes found.</p>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255, 255, 255, 0.06)" }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Gender</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">DOB</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02] border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <td className="px-4 py-3 text-sm text-white font-medium">{a.firstName} {a.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{a.gender ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModal({ mode: "edit", data: a })}>
                        <Edit className="h-3.5 w-3.5 text-gray-400 hover:text-blue-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteConfirm({ id: a.id, federationId: a.federationId ?? null })}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EntityModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "Add Athlete" : "Edit Athlete"}
      >
        {modal && (
          <AthleteForm
            mode={modal.mode}
            initialData={modal.mode === "edit" ? modal.data : undefined}
            onSuccess={() => setModal(null)}
            federationIdLock={modal.mode === "create" ? federationId : undefined}
          />
        )}
      </EntityModal>

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{
              background: "rgba(17,17,17,0.95)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium">Delete this athlete?</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() =>
                  deleteMut.mutate({
                    id: deleteConfirm.id,
                    federationId: deleteConfirm.federationId ?? undefined,
                  })
                }
                disabled={deleteMut.isPending}
              >
                {deleteMut.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
