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

export interface SchoolFormData {
  id: number;
  name: string;
  region?: string | null;
  city?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  sportsOffered?: string[] | null;
}

const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Oshana", "Omusati", "Ohangwena", "Oshikoto",
  "Kavango East", "Kavango West", "Zambezi", "Kunene", "Otjozondjupa",
  "Omaheke", "Hardap", "Karas",
] as const;

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  mode: "create" | "edit";
  initialData?: SchoolFormData;
  onSuccess: () => void;
}

export function SchoolForm({ mode, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    region: initialData?.region ?? "",
    city: initialData?.city ?? "",
    contactEmail: initialData?.contactEmail ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    sportsOffered: (initialData?.sportsOffered ?? []).join(", "),
  });

  const createMut = trpc.schools.create.useMutation({
    onSuccess: () => {
      utils.schools.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.schools.update.useMutation({
    onSuccess: () => {
      utils.schools.list.invalidate();
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
    const sportsOffered = form.sportsOffered
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name,
      region: form.region || undefined,
      city: form.city || undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      sportsOffered: sportsOffered.length ? sportsOffered : undefined,
    };
    if (mode === "create") createMut.mutate(payload);
    else if (initialData) updateMut.mutate({ id: initialData.id, ...payload });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <Label className={L}>Name *</Label>
        <Input
          className={F}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
      <div>
        <Label className={L}>Sports offered (comma-separated)</Label>
        <Input
          className={F}
          value={form.sportsOffered}
          onChange={(e) => setForm((p) => ({ ...p, sportsOffered: e.target.value }))}
          placeholder="Football, Netball, Athletics"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending || updateMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {mode === "create" ? "Create School" : "Save Changes"}
      </Button>
    </form>
  );
}
