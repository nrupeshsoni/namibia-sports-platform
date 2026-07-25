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
import { ImageUpload } from "./ImageUpload";
import { trpc } from "@/lib/trpc";

export interface VenueFormData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  photoUrl?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean | null;
}

const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Oshana", "Omusati", "Ohangwena", "Oshikoto",
  "Kavango East", "Kavango West", "Zambezi", "Kunene", "Otjozondjupa",
  "Omaheke", "Hardap", "Karas",
] as const;

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  mode: "create" | "edit";
  initialData?: VenueFormData;
  onSuccess: () => void;
  /** Platform admin uploads need a federation scope; use caller's or first federation. */
  uploadFederationId: number;
}

export function VenueForm({ mode, initialData, onSuccess, uploadFederationId }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    photoUrl: initialData?.photoUrl ?? "",
    address: initialData?.address ?? "",
    city: initialData?.city ?? "",
    region: initialData?.region ?? "",
    contactEmail: initialData?.contactEmail ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    capacity: initialData?.capacity?.toString() ?? "",
    latitude: initialData?.latitude?.toString() ?? "",
    longitude: initialData?.longitude?.toString() ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const createMut = trpc.venues.create.useMutation({
    onSuccess: () => {
      utils.venues.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.venues.update.useMutation({
    onSuccess: () => {
      utils.venues.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    const capacity = form.capacity ? parseInt(form.capacity, 10) : undefined;
    const latitude = form.latitude ? parseFloat(form.latitude) : undefined;
    const longitude = form.longitude ? parseFloat(form.longitude) : undefined;
    const payload = {
      name: form.name,
      description: form.description || undefined,
      photoUrl: form.photoUrl || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      region: form.region || undefined,
      latitude: latitude != null && !Number.isNaN(latitude) ? latitude : undefined,
      longitude: longitude != null && !Number.isNaN(longitude) ? longitude : undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      capacity: capacity && !isNaN(capacity) ? capacity : undefined,
    };
    if (mode === "create") {
      createMut.mutate({ ...payload, slug: form.slug || toSlug(form.name) });
    } else if (initialData) {
      updateMut.mutate({ id: initialData.id, ...payload, isActive: form.isActive });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Name *</Label>
          <Input
            className={F}
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: e.target.value,
                slug: mode === "create" ? toSlug(e.target.value) : p.slug,
              }))
            }
          />
        </div>
        <div>
          <Label className={L}>Slug</Label>
          <Input
            className={F}
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            disabled={mode === "edit"}
          />
        </div>
      </div>
      <div>
        <Label className={L}>Description</Label>
        <Textarea
          className={F}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={2}
        />
      </div>
      <ImageUpload
        label="Photo"
        value={form.photoUrl || null}
        onChange={(url) => setForm((p) => ({ ...p, photoUrl: url ?? "" }))}
        federationId={uploadFederationId}
        entity="venue"
        entityId={initialData?.id ?? 0}
        variant="photo"
      />
      <div>
        <Label className={L}>Address</Label>
        <Input
          className={F}
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>City</Label>
          <Input
            className={F}
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>Region</Label>
          <Select value={form.region} onValueChange={(v) => setForm((p) => ({ ...p, region: v }))}>
            <SelectTrigger className={F}>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              {NAMIBIA_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Email</Label>
          <Input
            className={F}
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>Phone</Label>
          <Input
            className={F}
            value={form.contactPhone}
            onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Capacity</Label>
          <Input
            className={F}
            type="number"
            value={form.capacity}
            onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
          />
        </div>
        {mode === "edit" && (
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="venueActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: !!v }))}
            />
            <Label htmlFor="venueActive" className={L}>
              Active
            </Label>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending || updateMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {mode === "create" ? "Create Venue" : "Save Changes"}
      </Button>
    </form>
  );
}
