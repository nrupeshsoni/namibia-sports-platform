/**
 * Lead/featured news story — image hero when available, text-first otherwise.
 */
import { Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { NewsCardArticle } from "./NewsCard";

function formatDate(val: string | Date | null | undefined): string {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type FeaturedNewsCardProps = {
  article: NewsCardArticle;
  onClick?: () => void;
};

/** Large lead story — image hero when available, otherwise text-first panel. */
export function FeaturedNewsCard({ article, onClick }: FeaturedNewsCardProps) {
  const imageUrl = article.featuredImage?.trim() || null;
  const [imageOk, setImageOk] = useState(Boolean(imageUrl));
  const hasImage = Boolean(imageUrl) && imageOk;
  const sourceLabel = article.sourceName?.trim() || null;

  if (!hasImage) {
    return (
      <div
        className={`rounded-2xl p-6 md:p-8 ${onClick ? "cursor-pointer" : ""}`}
        style={{
          background: "var(--glass-surface)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--glass-surface-border)",
          boxShadow: "var(--glass-shadow)",
        }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
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
      >
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {article.category && (
            <span
              className="px-3 py-1 rounded-lg text-xs font-medium capitalize"
              style={{
                background: "rgba(239,68,68,0.2)",
                color: "#FCA5A5",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {article.category}
            </span>
          )}
          {sourceLabel && (
            <span className="text-xs" style={{ color: "var(--chrome-muted)" }}>
              via {sourceLabel}
            </span>
          )}
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
            style={{ background: "rgba(251,191,36,0.2)", color: "#FBBF24" }}
          >
            Featured
          </span>
        </div>
        <h2
          className="text-2xl md:text-4xl font-serif mb-3 leading-tight"
          style={{ color: "var(--chrome-fg)" }}
        >
          {article.title}
        </h2>
        {article.summary && (
          <p
            className="text-sm md:text-base line-clamp-3 max-w-2xl mb-4"
            style={{ color: "var(--chrome-muted)" }}
          >
            {article.summary}
          </p>
        )}
        <div className="flex items-center gap-4 flex-wrap">
          {article.publishedAt && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--chrome-muted)" }}>
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          )}
          <span className="text-sm font-medium" style={{ color: "#EF4444" }}>
            Read More →
          </span>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: "var(--chrome-muted)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              Read original
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group ${onClick ? "cursor-pointer" : ""}`}
      style={{ border: "1px solid var(--glass-surface-border)" }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
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
    >
      <div className="w-full aspect-[21/9] min-h-[12rem] max-h-[24rem] relative overflow-hidden">
        <img
          src={imageUrl!}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageOk(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {article.category && (
            <span
              className="px-3 py-1 rounded-lg text-xs font-medium capitalize"
              style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
            >
              {article.category}
            </span>
          )}
          {sourceLabel && <span className="text-xs text-white/70">via {sourceLabel}</span>}
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
            style={{ background: "rgba(251,191,36,0.2)", color: "#FBBF24" }}
          >
            Featured
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-serif text-white mb-2 leading-tight">
          {article.title}
        </h2>
        {article.summary && (
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl">{article.summary}</p>
        )}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {article.publishedAt && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          )}
          <span className="text-sm font-medium" style={{ color: "#EF4444" }}>
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
}
