import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  entity: "federation" | "club" | "event" | "athlete" | "news" | "venue";
  entityId: number | string;
  variant?: "logo" | "poster" | "photo";
  disabled?: boolean;
}

export function ImageUpload({
  label = "Image",
  value,
  onChange,
  entity,
  entityId,
  variant = "logo",
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMut = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      setError(null);
      setUploading(false);
    },
    onError: (err) => {
      setError(err.message);
      setUploading(false);
    },
  });

  const canUpload = entityId && String(entityId) !== "0" && !disabled;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canUpload) return;

    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      const match = data.match(/^data:([^;]+);/);
      const contentType = match ? match[1] : "image/jpeg";

      uploadMut.mutate({
        entity,
        entityId,
        base64: data,
        contentType,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sizeClass = variant === "logo" ? "w-24 h-24" : variant === "poster" ? "w-40 h-24" : "w-20 h-20";

  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-400">{label}</Label>
      <div className="flex items-start gap-3">
        <div
          className={`${sizeClass} rounded-lg border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shrink-0`}
        >
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            {canUpload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </>
                )}
              </Button>
            )}
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
                onClick={() => onChange(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Input
            className="bg-white/5 border-white/10 text-white text-sm"
            placeholder="Or paste image URL"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
          />
          {!canUpload && entityId === 0 && (
            <p className="text-xs text-gray-500">Save first to upload an image</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
