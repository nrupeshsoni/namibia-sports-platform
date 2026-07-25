/**
 * Shared news list card — visual when featuredImage exists, text-first otherwise.
 * No large empty placeholders or giant initials.
 */
import { Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import { safeHttpsHref } from "@/lib/safeHref";

export type NewsCardArticle = {
  title: string;
  summary?: string | null;
  category?: string | null;
  featuredImage?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  publishedAt?: string | Date | null;
};

function formatDate(val: string | Date | null | undefined): string {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type NewsCardProps = {
  article: NewsCardArticle;
  /** Optional click handler (modal / navigation wrapper). */
  onClick?: () => void;
  /** Accent for category chip — emerald (Home) or red (News pages). */
  accent?: "emerald" | "red" | "blue";
  className?: string;
};

const ACCENT = {
  emerald: {
    chipBg: "rgba(16,185,129,0.2)",
    chipFg: "#6EE7B7",
    chipBorder: "rgba(16,185,129,0.35)",
    link: "#34D399",
  },
  red: {
    chipBg: "rgba(239,68,68,0.2)",
    chipFg: "#FCA5A5",
    chipBorder: "rgba(239,68,68,0.3)",
    link: "#EF4444",
  },
  blue: {
    chipBg: "rgba(59,130,246,0.25)",
    chipFg: "#93C5FD",
    chipBorder: "rgba(59,130,246,0.35)",
    link: "#60A5FA",
  },
} as const;

/**
 * Glass news card: image + body when `featuredImage` is set; compact text-first otherwise.
 */
export function NewsCard({
  article,
  onClick,
  accent = "red",
  className = "",
}: NewsCardProps) {
  const colors = ACCENT[accent];
  const imageUrl = article.featuredImage?.trim() || null;
  const [imageOk, setImageOk] = useState(Boolean(imageUrl));
  const hasImage = Boolean(imageUrl) && imageOk;
  const sourceLabel = article.sourceName?.trim() || null;
  const sourceUrl = safeHttpsHref(article.sourceUrl);

  return (
    <article
      className={`rounded-2xl overflow-hidden h-full transition-all hover:scale-[1.01] group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        background: "var(--glass-surface)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-surface-border)",
        boxShadow: "var(--glass-shadow)",
      }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {hasImage && imageUrl && (
        <div className="aspect-[16/10] relative overflow-hidden bg-black/20">
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageOk(false)}
          />
          {article.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
              style={{
                background: colors.chipBg,
                color: colors.chipFg,
                border: `1px solid ${colors.chipBorder}`,
              }}
            >
              {article.category}
            </span>
          )}
        </div>
      )}

      <div className={hasImage ? "p-5" : "p-5 md:p-6"}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {!hasImage && article.category && (
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize"
              style={{
                background: colors.chipBg,
                color: colors.chipFg,
                border: `1px solid ${colors.chipBorder}`,
              }}
            >
              {article.category}
            </span>
          )}
          {sourceLabel && (
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium"
              style={{
                background: "var(--chrome-btn-bg)",
                color: "var(--chrome-muted)",
                border: "1px solid var(--chrome-border)",
              }}
            >
              {sourceLabel}
            </span>
          )}
          {article.publishedAt && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--chrome-muted)" }}>
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          )}
        </div>

        <h3
          className={`font-serif line-clamp-2 leading-snug mb-2 ${
            hasImage ? "text-lg" : "text-lg md:text-xl"
          }`}
          style={{ color: "var(--chrome-fg)" }}
        >
          {article.title}
        </h3>

        {article.summary && (
          <p
            className={`text-sm line-clamp-2 ${hasImage ? "mb-0" : "mb-3"}`}
            style={{ color: "var(--chrome-muted)" }}
          >
            {article.summary}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-xs font-medium" style={{ color: colors.link }}>
            Read more →
          </span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs min-h-[44px] md:min-h-0"
              style={{ color: "var(--chrome-muted)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              Read original
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
