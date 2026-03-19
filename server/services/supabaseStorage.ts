/**
 * Supabase Storage service for image uploads.
 * Uses sportsplatform_* buckets per CLAUDE.md.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKETS = {
  federation: "sportsplatform_logos",
  club: "sportsplatform_images",
  event: "sportsplatform_event_posters",
  athlete: "sportsplatform_athlete_photos",
  news: "sportsplatform_news_images",
  venue: "sportsplatform_images",
} as const;

export type UploadEntity = keyof typeof BUCKETS;

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for storage uploads");
  }
  if (!_client) {
    _client = createClient(url, key);
  }
  return _client;
}

function getBucket(entity: UploadEntity): string {
  return BUCKETS[entity];
}

function buildPath(entity: UploadEntity, id: number | string, ext: string): string {
  const slug = `${entity}-${id}-${Date.now()}`;
  return `${entity}/${slug}.${ext}`;
}

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
}

export async function uploadImage(
  entity: UploadEntity,
  entityId: number | string,
  data: Buffer | Uint8Array,
  contentType: string
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(`Invalid image type: ${contentType}. Allowed: ${ALLOWED_TYPES.join(", ")}`);
  }
  if (data.length > MAX_SIZE_BYTES) {
    throw new Error(`File too large: ${(data.length / 1024 / 1024).toFixed(2)}MB. Max: 5MB`);
  }

  const ext = contentType.split("/")[1] || "jpg";
  const path = buildPath(entity, entityId, ext === "jpeg" ? "jpg" : ext);
  const bucket = getBucket(entity);
  const client = getClient();

  const { error } = await client.storage.from(bucket).upload(path, data, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
  return { url: urlData.publicUrl, path, bucket };
}
