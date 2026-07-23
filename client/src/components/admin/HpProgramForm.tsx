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

const PROGRAM_TYPES = [
  "talent_identification",
  "training",
  "development",
  "elite",
] as const;

export interface HpProgramFormData {
  id: number;
  federationId: number;
  name: string;
  description?: string | null;
  programType: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  isActive?: boolean | null;
}

const toDateInput = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  mode: "create" | "edit";
  federationId: number;
  initialData?: HpProgramFormData;
  onSuccess: () => void;
}

export function HpProgramForm({ mode, federationId, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    programType: (initialData?.programType ?? "development") as (typeof PROGRAM_TYPES)[number],
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate),
    isActive: initialData?.isActive ?? true,
  });

  const createMut = trpc.hpPrograms.create.useMutation({
    onSuccess: () => {
      utils.hpPrograms.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.hpPrograms.update.useMutation({
    onSuccess: () => {
      utils.hpPrograms.list.invalidate();
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
    const payload = {
      name: form.name,
      description: form.description || undefined,
      programType: form.programType,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
    };
    if (mode === "create") {
      createMut.mutate({ federationId, ...payload });
    } else if (initialData) {
      updateMut.mutate({ id: initialData.id, ...payload, isActive: form.isActive });
    }
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
      <div>
        <Label className={L}>Program type</Label>
        <Select
          value={form.programType}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, programType: v as (typeof PROGRAM_TYPES)[number] }))
          }
        >
          <SelectTrigger className={F}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
            {PROGRAM_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={L}>Description</Label>
        <Textarea
          className={F}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Start date</Label>
          <Input
            className={F}
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>End date</Label>
          <Input
            className={F}
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>
      {mode === "edit" && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="hpActive"
            checked={form.isActive}
            onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: !!v }))}
          />
          <Label htmlFor="hpActive" className={L}>
            Active
          </Label>
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending || updateMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {mode === "create" ? "Create Program" : "Save Changes"}
      </Button>
    </form>
  );
}
