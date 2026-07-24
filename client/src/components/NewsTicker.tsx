/**
 * Fixed top news ticker — hidden at page top, slides in after scroll threshold.
 * Marquee on motion-ok devices; static horizontal chips when reduced-motion.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export type NewsTickerItem = {
  id: number;
  title: string;
  slug: string;
  sourceName?: string | null;
  category?: string | null;
};

type NewsTickerProps = {
  articles: NewsTickerItem[];
  onSelect: (article: NewsTickerItem) => void;
  /** Show when scrollY exceeds this (px). */
  threshold?: number;
};

const DEFAULT_THRESHOLD = 160;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useScrollPast(threshold: number): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPast(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);
  return past;
}

function HeadlineButton({
  article,
  onSelect,
}: {
  article: NewsTickerItem;
  onSelect: (a: NewsTickerItem) => void;
}) {
  const source = article.sourceName?.trim();
  return (
    <button
      type="button"
      onClick={() => onSelect(article)}
      className="news-ticker-item inline-flex items-center gap-2 shrink-0 min-h-[36px] px-1 text-left"
      style={{ color: "var(--chrome-fg)" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: "#EF4444" }}
        aria-hidden
      />
      {source && (
        <span
          className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide shrink-0"
          style={{ color: "var(--chrome-muted)" }}
        >
          {source}
        </span>
      )}
      <span className="text-xs sm:text-sm font-medium truncate max-w-[70vw] sm:max-w-md">
        {article.title}
      </span>
    </button>
  );
}

/**
 * Sticky news headline bar under the Home header.
 */
export function NewsTicker({
  articles,
  onSelect,
  threshold = DEFAULT_THRESHOLD,
}: NewsTickerProps) {
  const visible = useScrollPast(threshold);
  const reducedMotion = usePrefersReducedMotion();

  if (articles.length === 0) return null;

  const track = (
    <>
      {articles.map((article) => (
        <HeadlineButton key={article.id} article={article} onSelect={onSelect} />
      ))}
    </>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="news-ticker"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
          className="fixed left-0 right-0 z-40 theme-chrome border-b"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 4.25rem)",
            paddingTop: 0,
          }}
          role="region"
          aria-label="Latest sports news headlines"
        >
          <div className="flex items-stretch min-h-[40px]">
            <div
              className="flex items-center gap-1.5 px-3 sm:px-4 shrink-0 border-r"
              style={{
                borderColor: "var(--chrome-border)",
                background: "rgba(239,68,68,0.12)",
              }}
            >
              <Newspaper className="w-3.5 h-3.5" style={{ color: "#EF4444" }} aria-hidden />
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap"
                style={{ color: "#EF4444" }}
              >
                News
              </span>
            </div>

            <div className="flex-1 min-w-0 overflow-hidden relative">
              {reducedMotion ? (
                <div className="flex items-center gap-4 overflow-x-auto px-3 py-2 scrollbar-none">
                  {track}
                </div>
              ) : (
                <div className="news-ticker-marquee group flex items-center h-full py-2">
                  <div className="news-ticker-track flex items-center gap-8 px-4">
                    {track}
                    {articles.map((article) => (
                      <HeadlineButton
                        key={`dup-${article.id}`}
                        article={article}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/news">
              <span
                className="flex items-center px-3 sm:px-4 text-[10px] sm:text-xs font-medium shrink-0 border-l min-h-[40px] cursor-pointer whitespace-nowrap"
                style={{
                  borderColor: "var(--chrome-border)",
                  color: "var(--chrome-muted)",
                }}
              >
                All →
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
