import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

export interface EventFormData {
  id: number;
  name: string;
  slug: string;
  federationId: number;
  type?: string | null;
  posterUrl?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  location?: string | null;
  region?: string | null;
  description?: string | null;
  isPublished?: boolean | null;
}

const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Oshana", "Omusati", "Ohangwena", "Oshikoto",
  "Kavango East", "Kavango West", "Zambezi", "Kunene", "Otjozondjupa",
  "Omaheke", "Hardap", "Karas",
] as const;

const EVENT_TYPES = ["competition", "tournament", "training", "workshop", "meeting", "other"] as const;
type EventType = typeof EVENT_TYPES[number];

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toDateInput = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

interface Props {
  mode: "create" | "edit";
  initialData?: EventFormData;
  onSuccess: () => void;
  /** When set, locks federation to this ID (used by federation admin) */
  federationIdLock?: number;
}

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

export function EventForm({ mode, initialData, onSuccess, federationIdLock }: Props) {
  const utils = trpc.useUtils();
  const federationsQuery = trpc.federations.list.useQuery({});
  const [error, setError] = useState<string | null>(null);
  const lockedFedId = federationIdLock ?? initialData?.federationId;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    federationId: (lockedFedId ?? initialData?.federationId)?.toString() ?? "",
    eventType: (initialData?.type ?? "competition") as EventType,
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate),
    posterUrl: initialData?.posterUrl ?? "",
    location: initialData?.location ?? "",
    region: initialData?.region ?? "",
    description: initialData?.description ?? "",
    isPublished: initialData?.isPublished ?? false,
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const createMut = trpc.events.create.useMutation({
    onSuccess: () => { utils.events.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.events.update.useMutation({
    onSuccess: () => { utils.events.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });

  const isLoading = createMut.isPending || updateMut.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Name is required"); return; }
    const fedId = federationIdLock ?? (form.federationId ? parseInt(form.federationId, 10) : undefined);
    if (!fedId) { setError("Federation is required"); return; }
    if (!form.startDate) { setError("Start date is required"); return; }

    const slug = form.slug || toSlug(form.name);

    if (mode === "create") {
      createMut.mutate({
        name: form.name,
        slug,
        federationId: fedId as number,
        eventType: form.eventType,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        location: form.location || undefined,
        region: form.region || undefined,
        description: form.description || undefined,
      });
    } else if (initialData) {
      updateMut.mutate({
        id: initialData.id,
        federationId: initialData.federationId,
        name: form.name,
        posterUrl: form.posterUrl || undefined,
        eventType: form.eventType,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        location: form.location || undefined,
        region: form.region || undefined,
        description: form.description || undefined,
        isPublished: form.isPublished,
      });
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
            placeholder="Event name"
          />
        </div>
        {mode === "create" && (
          <div className="space-y-1.5">
            <Label className={L}>Slug</Label>
            <Input className={F} value={form.slug} onChange={set("slug")} placeholder="auto-generated" />
          </div>
        )}
        {mode === "edit" && (
          <div className="space-y-1.5">
            <Label className={L}>Type</Label>
            <Select
              value={form.eventType}
              onValueChange={(v) => setForm((p) => ({ ...p, eventType: v as EventType }))}
            >
              <SelectTrigger className={F}><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {mode === "create" && !federationIdLock && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className={L}>Federation *</Label>
            <Select
              value={form.federationId}
              onValueChange={(v) => setForm((p) => ({ ...p, federationId: v }))}
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
            <Label className={L}>Type</Label>
            <Select
              value={form.eventType}
              onValueChange={(v) => setForm((p) => ({ ...p, eventType: v as EventType }))}
            >
              <SelectTrigger className={F}><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="space-y-1.5">
          <ImageUpload
            label="Poster Image"
            entity="event"
            entityId={initialData?.id ?? 0}
            value={form.posterUrl}
            onChange={(url) => setForm((p) => ({ ...p, posterUrl: url ?? "" }))}
            variant="poster"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Start Date *</Label>
          <Input className={F} type="date" value={form.startDate} onChange={set("startDate")} />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>End Date</Label>
          <Input className={F} type="date" value={form.endDate} onChange={set("endDate")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Location</Label>
          <Input className={F} value={form.location} onChange={set("location")} placeholder="Venue or city" />
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

      <div className="space-y-1.5">
        <Label className={L}>Description</Label>
        <Textarea className={F} value={form.description} onChange={set("description")} placeholder="Event details..." rows={3} />
      </div>

      {mode === "edit" && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="evtPublished"
            checked={form.isPublished}
            onCheckedChange={(v) => setForm((p) => ({ ...p, isPublished: !!v }))}
          />
          <Label htmlFor="evtPublished" className={L}>Published</Label>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {isLoading ? "Saving..." : mode === "create" ? "Create Event" : "Save Changes"}
      </Button>
    </form>
  );
}
