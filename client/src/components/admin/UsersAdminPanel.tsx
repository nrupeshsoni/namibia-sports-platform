import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityModal } from "./EntityModal";
import { AddUserForm } from "./AddUserForm";
import { trpc } from "@/lib/trpc";

/** Assignable only — club_manager deferred until club-scoped write procedures exist */
const ROLES = ["user", "admin", "federation_admin"] as const;

type Role = (typeof ROLES)[number];

const F = "bg-white/5 border-white/10 text-white";
const L = "text-sm text-gray-400";

export function UsersAdminPanel() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<{
    id: number;
    name: string | null;
    email: string | null;
    role: Role;
    federationId: number | null;
  } | null>(null);
  const [role, setRole] = useState<Role>("user");
  const [federationId, setFederationId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const usersQuery = trpc.users.list.useQuery();
  const federationsQuery = trpc.federations.listAll.useQuery();
  const setRoleMut = trpc.users.setRole.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      setEditUser(null);
      setError(null);
    },
    onError: (err) => setError(err.message),
  });

  const items = (usersQuery.data ?? []).filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.name ?? "").toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const openEdit = (u: (typeof items)[number]) => {
    const assignable: Role = ROLES.includes(u.role as Role)
      ? (u.role as Role)
      : "user";
    setEditUser({
      id: u.id,
      name: u.name,
      email: u.email,
      role: assignable,
      federationId: u.federationId,
    });
    setRole(assignable);
    setFederationId(u.federationId?.toString() ?? "");
    setError(null);
  };

  const handleSave = () => {
    setError(null);
    setRoleMut.mutate({
      id: editUser!.id,
      role,
      federationId: role === "federation_admin"
        ? federationId
          ? parseInt(federationId, 10)
          : null
        : null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add User
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
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">Email</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">Role</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400">Federation</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {usersQuery.isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              items.map((u) => {
                const fed = (federationsQuery.data ?? []).find((f) => f.id === u.federationId);
                return (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-white/[0.02]"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <td className="px-4 py-3 text-sm text-white">{u.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{fed?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => openEdit(u)}
                      >
                        Assign role
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <EntityModal open={addOpen} onClose={() => setAddOpen(false)} title="Add User">
        <AddUserForm
          onSuccess={() => {
            utils.users.list.invalidate();
            setAddOpen(false);
          }}
        />
      </EntityModal>

      <EntityModal
        open={editUser !== null}
        onClose={() => setEditUser(null)}
        title="Assign role"
      >
        {editUser && (
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-400">
              {editUser.name ?? "User"} · {editUser.email ?? "no email"}
            </p>
            <div>
              <Label className={L}>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className={F}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {role === "federation_admin" && (
              <div>
                <Label className={L}>Federation *</Label>
                <Select value={federationId} onValueChange={setFederationId}>
                  <SelectTrigger className={F}>
                    <SelectValue placeholder="Select federation" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
                    {(federationsQuery.data ?? []).map((fed) => (
                      <SelectItem key={fed.id} value={fed.id.toString()}>
                        {fed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={setRoleMut.isPending}
              onClick={handleSave}
            >
              Save role
            </Button>
          </div>
        )}
      </EntityModal>
    </div>
  );
}
