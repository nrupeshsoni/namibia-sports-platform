import { useState } from "react";
import { Plus, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { EntityModal } from "@/components/admin/EntityModal";

const PLATFORMS = ["youtube", "facebook", "twitch", "other"] as const;

function StreamForm({
  mode,
  federationId,
  initialData,
  onSuccess,
}: {
  mode: "create" | "edit";
  federationId: number;
  initialData?: {
    id: number;
    title: string;
    platformType: string;
    streamUrl?: string | null;
    embedUrl?: string | null;
    scheduledStart?: Date | string | null;
    scheduledEnd?: Date | string | null;
  };
  onSuccess: () => void;
}) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const toDateInput = (d: Date | string | null | undefined): string => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    platformType: (initialData?.platformType ?? "youtube") as (typeof PLATFORMS)[number],
    streamUrl: initialData?.streamUrl ?? "",
    embedUrl: initialData?.embedUrl ?? "",
    scheduledStart: toDateInput(initialData?.scheduledStart),
    scheduledEnd: toDateInput(initialData?.scheduledEnd),
  });

  const createMut = trpc.streams.create.useMutation({
    onSuccess: () => { utils.streams.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.streams.update.useMutation({
    onSuccess: () => { utils.streams.list.invalidate(); onSuccess(); },
    onError: (err) => setError(err.message),
  });
  const setLiveMut = trpc.streams.setLive.useMutation({
    onSuccess: () => { utils.streams.list.invalidate(); onSuccess(); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (mode === "create") {
      createMut.mutate({
        federationId,
        title: form.title,
        platformType: form.platformType,
        streamUrl: form.streamUrl || undefined,
        embedUrl: form.embedUrl || undefined,
        scheduledStart: form.scheduledStart ? new Date(form.scheduledStart) : undefined,
        scheduledEnd: form.scheduledEnd ? new Date(form.scheduledEnd) : undefined,
      });
    } else if (initialData) {
      updateMut.mutate({
        id: initialData.id,
        federationId,
        title: form.title,
        platformType: form.platformType,
        streamUrl: form.streamUrl || undefined,
        embedUrl: form.embedUrl || undefined,
        scheduledStart: form.scheduledStart ? new Date(form.scheduledStart) : undefined,
        scheduledEnd: form.scheduledEnd ? new Date(form.scheduledEnd) : undefined,
      });
    }
  };

  const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
  const L = "text-sm text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <Label className={L}>Title *</Label>
        <Input className={F} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Stream title" />
      </div>
      <div>
        <Label className={L}>Platform</Label>
        <Select
          value={form.platformType}
          onValueChange={(v) => setForm((p) => ({ ...p, platformType: v as (typeof PLATFORMS)[number] }))}
        >
          <SelectTrigger className={F}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={L}>Stream URL</Label>
        <Input className={F} value={form.streamUrl} onChange={(e) => setForm((p) => ({ ...p, streamUrl: e.target.value }))} placeholder="https://..." />
      </div>
      <div>
        <Label className={L}>Embed URL</Label>
        <Input className={F} value={form.embedUrl} onChange={(e) => setForm((p) => ({ ...p, embedUrl: e.target.value }))} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={L}>Scheduled Start</Label>
          <Input className={F} type="datetime-local" value={form.scheduledStart} onChange={(e) => setForm((p) => ({ ...p, scheduledStart: e.target.value }))} />
        </div>
        <div>
          <Label className={L}>Scheduled End</Label>
          <Input className={F} type="datetime-local" value={form.scheduledEnd} onChange={(e) => setForm((p) => ({ ...p, scheduledEnd: e.target.value }))} />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white">
        {mode === "create" ? "Create Stream" : "Save Changes"}
      </Button>
    </form>
  );
}

export default function FedAdminStreams({ federationId }: { federationId: number }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<
    | "create"
    | {
        edit: {
          id: number;
          title: string;
          platformType: string;
          streamUrl?: string | null;
          embedUrl?: string | null;
          scheduledStart?: Date | string | null;
          scheduledEnd?: Date | string | null;
          isLive?: boolean | null;
        };
      }
    | null
  >(null);

  const listQuery = trpc.streams.list.useQuery({ federationId });
  const setLiveMut = trpc.streams.setLive.useMutation({
    onSuccess: () => listQuery.refetch(),
  });

  const items = (listQuery.data ?? []).filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search streams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={() => setModal("create")}>
          <Plus className="h-4 w-4" /> Add Stream
        </Button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Platform</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium">Scheduled</th>
              <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {listQuery.isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No streams found.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <td className="px-4 py-3 text-sm text-white font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{s.platformType ?? "—"}</td>
                  <td className="px-4 py-3">
                    {s.isLive ? (
                      <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs animate-pulse">● LIVE</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Offline</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-green-400 hover:text-green-300"
                          onClick={() => setLiveMut.mutate({ id: s.id, federationId, isLive: true })}
                          disabled={setLiveMut.isPending}
                        >
                          Go Live
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {s.scheduledStart ? new Date(s.scheduledStart).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={() =>
                        setModal({
                          edit: {
                            id: s.id,
                            title: s.title,
                            platformType: s.platformType ?? "youtube",
                            streamUrl: s.streamUrl,
                            embedUrl: s.embedUrl,
                            scheduledStart: s.scheduledStart,
                            scheduledEnd: s.scheduledEnd,
                            isLive: s.isLive,
                          },
                        })
                      }
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EntityModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "create" ? "Add Stream" : "Edit Stream"}
      >
        {modal === "create" ? (
          <StreamForm mode="create" federationId={federationId} onSuccess={() => setModal(null)} />
        ) : modal?.edit ? (
          <StreamForm
            mode="edit"
            federationId={federationId}
            initialData={modal.edit}
            onSuccess={() => setModal(null)}
          />
        ) : null}
      </EntityModal>
    </div>
  );
}
