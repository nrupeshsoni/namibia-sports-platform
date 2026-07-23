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
import { ImageUpload } from "./ImageUpload";
import { trpc } from "@/lib/trpc";

const PLATFORMS = ["youtube", "facebook", "twitch", "other"] as const;

export interface StreamFormData {
  id: number;
  title: string;
  platformType: string;
  streamUrl?: string | null;
  embedUrl?: string | null;
  thumbnailUrl?: string | null;
  scheduledStart?: Date | string | null;
  scheduledEnd?: Date | string | null;
  isLive?: boolean | null;
  federationId: number;
}

const toDateInput = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

interface Props {
  mode: "create" | "edit";
  federationId: number;
  initialData?: StreamFormData;
  onSuccess: () => void;
}

export function StreamForm({ mode, federationId, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    platformType: (initialData?.platformType ?? "youtube") as (typeof PLATFORMS)[number],
    streamUrl: initialData?.streamUrl ?? "",
    embedUrl: initialData?.embedUrl ?? "",
    thumbnailUrl: initialData?.thumbnailUrl ?? "",
    scheduledStart: toDateInput(initialData?.scheduledStart),
    scheduledEnd: toDateInput(initialData?.scheduledEnd),
  });

  const createMut = trpc.streams.create.useMutation({
    onSuccess: () => {
      utils.streams.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.streams.update.useMutation({
    onSuccess: () => {
      utils.streams.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    const payload = {
      title: form.title,
      platformType: form.platformType,
      streamUrl: form.streamUrl || undefined,
      embedUrl: form.embedUrl || undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      scheduledStart: form.scheduledStart ? new Date(form.scheduledStart) : undefined,
      scheduledEnd: form.scheduledEnd ? new Date(form.scheduledEnd) : undefined,
    };
    if (mode === "create") {
      createMut.mutate({ federationId, ...payload });
    } else if (initialData) {
      updateMut.mutate({ id: initialData.id, federationId, ...payload });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <Label className={L}>Title *</Label>
        <Input
          className={F}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Stream title"
        />
      </div>
      <div>
        <Label className={L}>Platform</Label>
        <Select
          value={form.platformType}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, platformType: v as (typeof PLATFORMS)[number] }))
          }
        >
          <SelectTrigger className={F}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={L}>Stream URL</Label>
        <Input
          className={F}
          value={form.streamUrl}
          onChange={(e) => setForm((p) => ({ ...p, streamUrl: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label className={L}>Embed URL</Label>
        <Input
          className={F}
          value={form.embedUrl}
          onChange={(e) => setForm((p) => ({ ...p, embedUrl: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <ImageUpload
        label="Thumbnail"
        value={form.thumbnailUrl || null}
        onChange={(url) => setForm((p) => ({ ...p, thumbnailUrl: url ?? "" }))}
        federationId={federationId}
        entity="stream"
        entityId={initialData?.id ?? 0}
        variant="poster"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Scheduled Start</Label>
          <Input
            className={F}
            type="datetime-local"
            value={form.scheduledStart}
            onChange={(e) => setForm((p) => ({ ...p, scheduledStart: e.target.value }))}
          />
        </div>
        <div>
          <Label className={L}>Scheduled End</Label>
          <Input
            className={F}
            type="datetime-local"
            value={form.scheduledEnd}
            onChange={(e) => setForm((p) => ({ ...p, scheduledEnd: e.target.value }))}
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending || updateMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {mode === "create" ? "Create Stream" : "Save Changes"}
      </Button>
    </form>
  );
}
