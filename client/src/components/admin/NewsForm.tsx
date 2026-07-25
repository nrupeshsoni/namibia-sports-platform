import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { trpc } from "@/lib/trpc";

export interface NewsFormData {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  summary?: string | null;
  category?: string | null;
  featuredImage?: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  federationId: number | null;
}

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const F = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50";
const L = "text-sm text-gray-400";

function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

interface Props {
  mode: "create" | "edit";
  federationId: number;
  initialData?: NewsFormData;
  onSuccess: () => void;
}

export function NewsForm({ mode, federationId, initialData, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    content: initialData?.content ?? "",
    summary: initialData?.summary ?? "",
    category: initialData?.category ?? "",
    featuredImage: initialData?.featuredImage ?? "",
    sourceUrl: initialData?.sourceUrl ?? "",
    sourceName: initialData?.sourceName ?? "",
  });

  const createMut = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });
  const updateMut = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.list.invalidate();
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
    const sourceUrlTrimmed = form.sourceUrl.trim();
    if (sourceUrlTrimmed && !isValidHttpsUrl(sourceUrlTrimmed)) {
      setError("Source URL must be a valid https URL");
      return;
    }
    const slug = form.slug || toSlug(form.title);
    const payload = {
      title: form.title,
      slug,
      content: form.content || undefined,
      summary: form.summary || undefined,
      category: form.category || undefined,
      featuredImage: form.featuredImage || undefined,
      sourceUrl: sourceUrlTrimmed || undefined,
      sourceName: form.sourceName.trim() || undefined,
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
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              title: e.target.value,
              slug: mode === "create" && !p.slug ? toSlug(e.target.value) : p.slug || toSlug(e.target.value),
            }))
          }
          placeholder="Article title"
        />
      </div>
      {mode === "create" && (
        <div>
          <Label className={L}>Slug</Label>
          <Input
            className={F}
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="auto"
          />
        </div>
      )}
      <div>
        <Label className={L}>Summary</Label>
        <Input
          className={F}
          value={form.summary}
          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
          placeholder="Brief summary"
        />
      </div>
      <div>
        <Label className={L}>Category</Label>
        <Input
          className={F}
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          placeholder="e.g. Results"
        />
      </div>
      <div>
        <Label className={L}>Source URL</Label>
        <Input
          className={F}
          type="url"
          value={form.sourceUrl}
          onChange={(e) => setForm((p) => ({ ...p, sourceUrl: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label className={L}>Source name</Label>
        <Input
          className={F}
          value={form.sourceName}
          onChange={(e) => setForm((p) => ({ ...p, sourceName: e.target.value }))}
          placeholder="e.g. New Era"
        />
      </div>
      <ImageUpload
        label="Featured image"
        value={form.featuredImage || null}
        onChange={(url) => setForm((p) => ({ ...p, featuredImage: url ?? "" }))}
        federationId={federationId}
        entity="news"
        entityId={initialData?.id ?? 0}
        variant="poster"
      />
      <div>
        <Label className={L}>Content</Label>
        <textarea
          className={`${F} w-full min-h-[120px] resize-y rounded-md px-3 py-2`}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Article content..."
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={createMut.isPending || updateMut.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {mode === "create" ? "Create Article" : "Save Changes"}
      </Button>
    </form>
  );
}
