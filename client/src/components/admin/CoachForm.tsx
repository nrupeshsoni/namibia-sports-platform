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

export interface CoachFormData {
  id: number;
  firstName: string;
  lastName: string;
  federationId?: number | null;
  clubId?: number | null;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  certifications?: string | null;
  specialization?: string | null;
  yearsExperience?: number | null;
  isActive?: boolean | null;
}

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  mode: "create" | "edit";
  initialData?: CoachFormData;
  onSuccess: () => void;
  federationIdLock?: number;
}

export function CoachForm({ mode, initialData, onSuccess, federationIdLock }: Props) {
  const utils = trpc.useUtils();
  const federationsQuery = trpc.federations.list.useQuery({});
  const [error, setError] = useState<string | null>(null);
  const lockedFedId = federationIdLock ?? initialData?.federationId;

  const [form, setForm] = useState({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    federationId: (lockedFedId ?? "")?.toString() ?? "",
    photoUrl: initialData?.photoUrl ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    certifications: initialData?.certifications ?? "",
    specialization: initialData?.specialization ?? "",
    yearsExperience: initialData?.yearsExperience?.toString() ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const createMut = trpc.coaches.create.useMutation({
    onSuccess: () => {
      utils.coaches.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.coaches.update.useMutation({
    onSuccess: () => {
      utils.coaches.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const fedId =
    federationIdLock ?? (form.federationId ? parseInt(form.federationId, 10) : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required");
      return;
    }
    if (!fedId) {
      setError("Federation is required");
      return;
    }
    const years = form.yearsExperience ? parseInt(form.yearsExperience, 10) : undefined;
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      photoUrl: form.photoUrl || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      certifications: form.certifications || undefined,
      specialization: form.specialization || undefined,
      yearsExperience: years && !isNaN(years) ? years : undefined,
    };
    if (mode === "create") {
      createMut.mutate({ ...payload, federationId: fedId });
    } else if (initialData) {
      updateMut.mutate({
        id: initialData.id,
        federationId: fedId,
        ...payload,
        isActive: form.isActive,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>First name *</Label>
          <Input
            className={F}
            value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>Last name *</Label>
          <Input
            className={F}
            value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
          />
        </div>
      </div>
      {!federationIdLock && (
        <div>
          <Label className={L}>Federation *</Label>
          <Select
            value={form.federationId}
            onValueChange={(v) => setForm((p) => ({ ...p, federationId: v }))}
          >
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
      {fedId != null && (
        <ImageUpload
          label="Photo"
          value={form.photoUrl || null}
          onChange={(url) => setForm((p) => ({ ...p, photoUrl: url ?? "" }))}
          federationId={fedId}
          entity="coach"
          entityId={initialData?.id ?? 0}
          variant="photo"
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Email</Label>
          <Input
            className={F}
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>Phone</Label>
          <Input
            className={F}
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <Label className={L}>Specialization</Label>
        <Input
          className={F}
          value={form.specialization}
          onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
        />
      </div>
      <div>
        <Label className={L}>Certifications</Label>
        <Textarea
          className={F}
          value={form.certifications}
          onChange={(e) => setForm((p) => ({ ...p, certifications: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Years experience</Label>
          <Input
            className={F}
            type="number"
            value={form.yearsExperience}
            onChange={(e) => setForm((p) => ({ ...p, yearsExperience: e.target.value }))}
          />
        </div>
        {mode === "edit" && (
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="coachActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: !!v }))}
            />
            <Label htmlFor="coachActive" className={L}>
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
        {mode === "create" ? "Create Coach" : "Save Changes"}
      </Button>
    </form>
  );
}
