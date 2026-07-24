import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

const ROLES = ["user", "admin", "federation_admin"] as const;
type Role = (typeof ROLES)[number];

const F = "bg-white/5 border-white/10 text-white";
const L = "text-sm text-gray-400";

interface Props {
  onSuccess: () => void;
}

/**
 * Platform-admin Add User: invite via Auth Admin when available, else promote
 * an already-registered user by email + assign role/federation.
 */
export function AddUserForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [federationId, setFederationId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const caps = trpc.users.inviteCapabilities.useQuery();
  const federationsQuery = trpc.federations.listAll.useQuery();
  const inviteMut = trpc.users.inviteOrPromote.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    inviteMut.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
      role,
      federationId:
        role === "federation_admin"
          ? federationId
            ? parseInt(federationId, 10)
            : null
          : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <p className="text-sm text-gray-400">
        {caps.data?.canCreateAuthUser
          ? "Creates an Auth user (if new) and assigns role. They can set a password via Supabase recovery or sign in after invite."
          : "User must register at /register first, then enter their email here to assign role."}
      </p>
      <div>
        <Label className={L}>Email *</Label>
        <Input
          type="email"
          required
          className={F}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="editor@federation.org.na"
        />
      </div>
      <div>
        <Label className={L}>Name</Label>
        <Input
          className={F}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional display name"
        />
      </div>
      <div>
        <Label className={L}>Role *</Label>
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
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={inviteMut.isPending}
      >
        {inviteMut.isPending ? "Saving..." : "Add / promote user"}
      </Button>
    </form>
  );
}
