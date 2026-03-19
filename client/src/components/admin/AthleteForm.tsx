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

export interface AthleteFormData {
  id: number;
  firstName: string;
  lastName: string;
  federationId?: number | null;
  clubId?: number | null;
  dateOfBirth?: Date | string | null;
  gender?: "male" | "female" | "other" | null;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  achievements?: string | null;
  isActive?: boolean | null;
}

type Gender = "male" | "female" | "other" | "";

const toDateInput = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

interface Props {
  mode: "create" | "edit";
  initialData?: AthleteFormData;
  onSuccess: () => void;
  /** When set, locks federation to this ID (used by federation admin) */
  federationIdLock?: number;
}

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

export function AthleteForm({ mode, initialData, onSuccess, federationIdLock }: Props) {
  const utils = trpc.useUtils();
  const federationsQuery = trpc.federations.list.useQuery({});
  const [error, setError] = useState<string | null>(null);
  const lockedFedId = federationIdLock ?? initialData?.federationId;

  const [form, setForm] = useState({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    federationId: (lockedFedId ?? initialData?.federationId)?.toString() ?? "",
    gender: (initialData?.gender ?? "") as Gender,
    dateOfBirth: toDateInput(initialData?.dateOfBirth),
    photoUrl: initialData?.photoUrl ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    achievements: initialData?.achievements ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const createMut = trpc.athletes.create.useMutation({
    onSuccess: () => { utils.athletes.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.athletes.update.useMutation({
    onSuccess: () => { utils.athletes.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });

  const isLoading = createMut.isPending || updateMut.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim()) { setError("First name is required"); return; }
    if (!form.lastName.trim()) { setError("Last name is required"); return; }

    const createFedId = federationIdLock ?? (form.federationId ? parseInt(form.federationId, 10) : undefined);
    const createPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      federationId: createFedId,
      gender: (form.gender || undefined) as "male" | "female" | "other" | undefined,
      dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      achievements: form.achievements || undefined,
    };

    if (mode === "create") {
      createMut.mutate(createPayload);
    } else if (initialData) {
      if (initialData.federationId == null) {
        setError("Athletes without a federation cannot be updated here.");
        return;
      }
      updateMut.mutate({
        id: initialData.id,
        federationId: initialData.federationId,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: (form.gender || undefined) as "male" | "female" | "other" | undefined,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        achievements: form.achievements || undefined,
        photoUrl: form.photoUrl || undefined,
        isActive: form.isActive,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      {mode === "edit" && (
        <div className="space-y-1.5">
          <ImageUpload
            label="Photo"
            entity="athlete"
            entityId={initialData!.id}
            value={form.photoUrl}
            onChange={(url) => setForm((p) => ({ ...p, photoUrl: url ?? "" }))}
            variant="photo"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>First Name *</Label>
          <Input className={F} value={form.firstName} onChange={set("firstName")} placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Last Name *</Label>
          <Input className={F} value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(v) => setForm((p) => ({ ...p, gender: v as Gender }))}
          >
            <SelectTrigger className={F}><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Date of Birth</Label>
          <Input className={F} type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
        </div>
      </div>

      {!federationIdLock && (
      <div className="space-y-1.5">
        <Label className={L}>Federation</Label>
        <Select
          value={form.federationId}
          onValueChange={(v) => setForm((p) => ({ ...p, federationId: v }))}
        >
          <SelectTrigger className={F}><SelectValue placeholder="Select federation (optional)" /></SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
            {(federationsQuery.data ?? []).map((fed) => (
              <SelectItem key={fed.id} value={fed.id.toString()}>{fed.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={L}>Email</Label>
          <Input className={F} type="email" value={form.email} onChange={set("email")} placeholder="athlete@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label className={L}>Phone</Label>
          <Input className={F} value={form.phone} onChange={set("phone")} placeholder="+264 ..." />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className={L}>Achievements</Label>
        <Textarea className={F} value={form.achievements} onChange={set("achievements")} placeholder="Notable achievements, records, titles..." rows={3} />
      </div>

      {mode === "edit" && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="athleteActive"
            checked={form.isActive}
            onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: !!v }))}
          />
          <Label htmlFor="athleteActive" className={L}>Active Athlete</Label>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {isLoading ? "Saving..." : mode === "create" ? "Register Athlete" : "Save Changes"}
      </Button>
    </form>
  );
}
