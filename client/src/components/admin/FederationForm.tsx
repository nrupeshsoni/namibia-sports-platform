import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

export interface FederationFormData {
  id: number;
  name: string;
  abbreviation?: string | null;
  type: "federation" | "umbrella" | "ministry" | "commission";
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  president?: string | null;
  secretaryGeneral?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
}

interface Props {
  mode: "create" | "edit";
  initialData?: FederationFormData;
  onSuccess: () => void;
}

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

export function FederationForm({ mode, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    abbreviation: initialData?.abbreviation ?? "",
    type: (initialData?.type ?? "federation") as FederationFormData["type"],
    description: initialData?.description ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    website: initialData?.website ?? "",
    president: initialData?.president ?? "",
    secretaryGeneral: initialData?.secretaryGeneral ?? "",
    facebook: initialData?.facebook ?? "",
    instagram: initialData?.instagram ?? "",
    twitter: initialData?.twitter ?? "",
    youtube: initialData?.youtube ?? "",
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const createMut = trpc.federations.create.useMutation({
    onSuccess: () => { utils.federations.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.federations.update.useMutation({
    onSuccess: () => { utils.federations.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });

  const isLoading = createMut.isPending || updateMut.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Name is required"); return; }

    const payload = {
      name: form.name,
      abbreviation: form.abbreviation || undefined,
      description: form.description || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      president: form.president || undefined,
      secretaryGeneral: form.secretaryGeneral || undefined,
      facebook: form.facebook || undefined,
      instagram: form.instagram || undefined,
      twitter: form.twitter || undefined,
      youtube: form.youtube || undefined,
    };

    if (mode === "create") {
      createMut.mutate({ ...payload, type: form.type });
    } else if (initialData) {
      updateMut.mutate({ id: initialData.id, ...payload });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Name *</Label>
          <Input className={F} value={form.name} onChange={set("name")} placeholder="Full organization name" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Abbreviation</Label>
          <Input className={F} value={form.abbreviation} onChange={set("abbreviation")} placeholder="e.g. NAF" />
        </div>
      </div>

      {mode === "create" && (
        <div className="space-y-1.5">
          <Label className={L}>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as FederationFormData["type"] }))}>
            <SelectTrigger className={F}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              <SelectItem value="federation">Federation</SelectItem>
              <SelectItem value="umbrella">Umbrella Body</SelectItem>
              <SelectItem value="ministry">Ministry</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className={L}>Description</Label>
        <Textarea className={F} value={form.description} onChange={set("description")} placeholder="Brief description..." rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Email</Label>
          <Input className={F} type="email" value={form.email} onChange={set("email")} placeholder="contact@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Phone</Label>
          <Input className={F} value={form.phone} onChange={set("phone")} placeholder="+264 61 ..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Website</Label>
          <Input className={F} value={form.website} onChange={set("website")} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>President</Label>
          <Input className={F} value={form.president} onChange={set("president")} placeholder="Full name" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={L}>Secretary General</Label>
        <Input className={F} value={form.secretaryGeneral} onChange={set("secretaryGeneral")} placeholder="Full name" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Facebook URL</Label>
          <Input className={F} value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Instagram URL</Label>
          <Input className={F} value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Twitter / X URL</Label>
          <Input className={F} value={form.twitter} onChange={set("twitter")} placeholder="https://x.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>YouTube URL</Label>
          <Input className={F} value={form.youtube} onChange={set("youtube")} placeholder="https://youtube.com/..." />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {isLoading ? "Saving..." : mode === "create" ? "Create Federation" : "Save Changes"}
      </Button>
    </form>
  );
}
