/**
 * Shared news article detail modal — reused by Home ticker and /news page.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, Tag, X } from "lucide-react";
import { useState } from "react";

export type NewsArticleModalItem = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  category: string | null;
  featuredImage: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  publishedAt: string | Date | null;
};

/** Parse legacy Source footer from content body. */
function parseSourceFooter(content: string | null | undefined): {
  name: string | null;
  url: string | null;
} {
  if (!content) return { name: null, url: null };
  const m = content.match(/Source:\s*([^\n]+)\n(https?:\/\/\S+)/i);
  return {
    name: m?.[1]?.trim() || null,
    url: m?.[2]?.trim() || null,
  };
}

function formatDate(val: string | Date | null | undefined): string {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type NewsArticleModalProps = {
  article: NewsArticleModalItem;
  onClose: () => void;
};

/**
 * Full-screen overlay with article title, summary, body, and source link.
 */
export function NewsArticleModal({ article, onClose }: NewsArticleModalProps) {
  const [imageOk, setImageOk] = useState(Boolean(article.featuredImage?.trim()));
  const footer = parseSourceFooter(article.content);
  const sourceName = article.sourceName || footer.name;
  const sourceUrl = article.sourceUrl || footer.url;
  const bodyText = article.content
    ? article.content.replace(/\n*---\nSource:[\s\S]*$/i, "").trim()
    : null;
  const imageUrl = article.featuredImage?.trim() || null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto py-8 px-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-article-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "var(--glass-surface)",
            border: "1px solid var(--glass-surface-border)",
            backdropFilter: "blur(24px)",
            boxShadow: "var(--glass-shadow)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {imageOk && imageUrl && (
            <div className="w-full aspect-video relative overflow-hidden bg-black/20">
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImageOk(false)}
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                {article.category && (
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                    style={{
                      background: "rgba(239,68,68,0.2)",
                      color: "#FCA5A5",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                )}
                {article.publishedAt && (
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "var(--chrome-muted)" }}
                  >
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
                {sourceName && (
                  <span className="text-xs" style={{ color: "var(--chrome-muted)" }}>
                    via {sourceName}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "var(--chrome-muted)", background: "var(--chrome-btn-bg)" }}
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2
              id="news-article-modal-title"
              className="text-2xl font-serif mb-4 leading-snug"
              style={{ color: "var(--chrome-fg)" }}
            >
              {article.title}
            </h2>

            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 mb-4 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: "rgba(239,68,68,0.18)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239,68,68,0.35)",
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Read original{sourceName ? ` on ${sourceName}` : ""}
              </a>
            )}

            {article.summary && (
              <p
                className="text-sm leading-relaxed mb-4 pb-4"
                style={{
                  color: "var(--chrome-muted)",
                  borderBottom: "1px solid var(--chrome-border)",
                }}
              >
                {article.summary}
              </p>
            )}

            {bodyText && (
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--chrome-muted)" }}
              >
                {bodyText}
              </div>
            )}

            {!bodyText && !article.summary && (
              <p className="text-sm" style={{ color: "var(--chrome-muted)" }}>
                No content available for this article.
              </p>
            )}

            {sourceUrl && (
              <p
                className="mt-6 pt-4 text-xs"
                style={{
                  color: "var(--chrome-muted)",
                  borderTop: "1px solid var(--chrome-border)",
                }}
              >
                Full story at the original publisher.{" "}
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "#FCA5A5" }}
                >
                  Read original
                </a>
                {sourceName ? ` — ${sourceName}` : ""}.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
