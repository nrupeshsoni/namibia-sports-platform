import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

export interface ClubFormData {
  id: number;
  name: string;
  slug: string;
  federationId: number;
  description?: string | null;
  city?: string | null;
  region?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  presidentName?: string | null;
  coachName?: string | null;
  establishedYear?: number | null;
  isActive?: boolean | null;
}

const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Oshana", "Omusati", "Ohangwena", "Oshikoto",
  "Kavango East", "Kavango West", "Zambezi", "Kunene", "Otjozondjupa",
  "Omaheke", "Hardap", "Karas",
] as const;

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface Props {
  mode: "create" | "edit";
  initialData?: ClubFormData;
  onSuccess: () => void;
}

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

export function ClubForm({ mode, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const federationsQuery = trpc.federations.list.useQuery({});
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    federationId: initialData?.federationId?.toString() ?? "",
    description: initialData?.description ?? "",
    city: initialData?.city ?? "",
    region: initialData?.region ?? "",
    contactEmail: initialData?.contactEmail ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    presidentName: initialData?.presidentName ?? "",
    coachName: initialData?.coachName ?? "",
    establishedYear: initialData?.establishedYear?.toString() ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const createMut = trpc.clubs.create.useMutation({
    onSuccess: () => { utils.clubs.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.clubs.update.useMutation({
    onSuccess: () => { utils.clubs.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });

  const isLoading = createMut.isPending || updateMut.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (mode === "create" && !form.federationId) { setError("Federation is required"); return; }

    const slug = form.slug || toSlug(form.name);
    const year = form.establishedYear ? parseInt(form.establishedYear, 10) : undefined;

    const payload = {
      name: form.name,
      description: form.description || undefined,
      city: form.city || undefined,
      region: form.region || undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      presidentName: form.presidentName || undefined,
      coachName: form.coachName || undefined,
      establishedYear: year && !isNaN(year) ? year : undefined,
    };

    if (mode === "create") {
      createMut.mutate({
        ...payload,
        slug,
        federationId: parseInt(form.federationId, 10),
      });
    } else if (initialData) {
      updateMut.mutate({ id: initialData.id, ...payload, isActive: form.isActive });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Name *</Label>
          <Input
            className={F}
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({ ...p, name: e.target.value, slug: toSlug(e.target.value) }))
            }
            placeholder="Club name"
          />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Slug</Label>
          <Input className={F} value={form.slug} onChange={set("slug")} placeholder="auto-generated" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={L}>Federation {mode === "create" ? "*" : ""}</Label>
        <Select
          value={form.federationId}
          onValueChange={(v) => setForm((p) => ({ ...p, federationId: v }))}
          disabled={mode === "edit"}
        >
          <SelectTrigger className={F}><SelectValue placeholder="Select federation" /></SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
            {(federationsQuery.data ?? []).map((fed) => (
              <SelectItem key={fed.id} value={fed.id.toString()}>{fed.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className={L}>Description</Label>
        <Textarea className={F} value={form.description} onChange={set("description")} placeholder="About the club..." rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>City</Label>
          <Input className={F} value={form.city} onChange={set("city")} placeholder="e.g. Windhoek" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Region</Label>
          <Select value={form.region} onValueChange={(v) => setForm((p) => ({ ...p, region: v }))}>
            <SelectTrigger className={F}><SelectValue placeholder="Select region" /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              {NAMIBIA_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Contact Email</Label>
          <Input className={F} type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="club@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Contact Phone</Label>
          <Input className={F} value={form.contactPhone} onChange={set("contactPhone")} placeholder="+264 ..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>President Name</Label>
          <Input className={F} value={form.presidentName} onChange={set("presidentName")} placeholder="Full name" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Coach Name</Label>
          <Input className={F} value={form.coachName} onChange={set("coachName")} placeholder="Full name" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Established Year</Label>
          <Input className={F} type="number" value={form.establishedYear} onChange={set("establishedYear")} placeholder="e.g. 1995" min={1900} max={2099} />
        </div>
        {mode === "edit" && (
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="clubActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: !!v }))}
            />
            <Label htmlFor="clubActive" className={L}>Active Club</Label>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {isLoading ? "Saving..." : mode === "create" ? "Create Club" : "Save Changes"}
      </Button>
    </form>
  );
}
