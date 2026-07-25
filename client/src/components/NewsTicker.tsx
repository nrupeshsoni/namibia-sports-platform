/**
 * Fixed top news ticker — hidden at page top, slides in after scroll threshold.
 * Marquee on motion-ok devices; static horizontal chips when reduced-motion.
 */
import { Newspaper, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export type NewsTickerItem = {
  id: number;
  title: string;
  slug: string;
  sourceName?: string | null;
  category?: string | null;
  featuredImage?: string | null;
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

function TickerThumb({ src }: { src: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      className="w-8 h-8 sm:w-9 sm:h-9 rounded object-cover shrink-0"
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

function HeadlineButton({
  article,
  onSelect,
}: {
  article: NewsTickerItem;
  onSelect: (a: NewsTickerItem) => void;
}) {
  const source = article.sourceName?.trim();
  const imageUrl = article.featuredImage?.trim() || null;
  return (
    <button
      type="button"
      onClick={() => onSelect(article)}
      className="news-ticker-item inline-flex items-center gap-2 shrink-0 min-h-[36px] px-1 text-left"
      style={{ color: "var(--chrome-fg)" }}
    >
      {imageUrl ? (
        <TickerThumb src={imageUrl} />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "#EF4444" }}
          aria-hidden
        />
      )}
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

function HeadlineSegment({
  articles,
  onSelect,
  keyPrefix,
}: {
  articles: NewsTickerItem[];
  onSelect: (a: NewsTickerItem) => void;
  keyPrefix: string;
}) {
  return (
    <div className="news-ticker-segment">
      {articles.map((article) => (
        <HeadlineButton
          key={`${keyPrefix}-${article.id}`}
          article={article}
          onSelect={onSelect}
        />
      ))}
    </div>
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
  const [paused, setPaused] = useState(false);

  if (articles.length === 0) return null;

  return (
    <div
      className={`news-ticker-bar fixed left-0 right-0 z-40 border-b ${
        visible ? "news-ticker-bar--visible" : ""
      }`}
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 4.25rem)",
      }}
      role="region"
      aria-label="Latest sports news headlines"
      aria-hidden={!visible}
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
              {articles.map((article) => (
                <HeadlineButton key={article.id} article={article} onSelect={onSelect} />
              ))}
            </div>
          ) : (
            <div className="news-ticker-marquee">
              <div
                className={`news-ticker-track${paused ? " news-ticker-track--paused" : ""}`}
              >
                <HeadlineSegment articles={articles} onSelect={onSelect} keyPrefix="a" />
                <div className="news-ticker-segment" aria-hidden>
                  {articles.map((article) => (
                    <HeadlineButton
                      key={`b-${article.id}`}
                      article={article}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex items-center justify-center min-h-[40px] min-w-[40px] shrink-0 border-l"
            style={{ borderColor: "var(--chrome-border)", color: "var(--chrome-muted)" }}
            aria-label={paused ? "Play news ticker" : "Pause news ticker"}
            aria-pressed={paused}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        )}

        <Link href="/news">
          <span
            className="flex items-center px-3 sm:px-4 text-[10px] sm:text-xs font-medium shrink-0 border-l min-h-[40px] cursor-pointer whitespace-nowrap"
            style={{
              borderColor: "var(--chrome-border)",
              color: "var(--chrome-muted)",
            }}
          >
            All news →
          </span>
        </Link>
      </div>
    </div>
  );
}
