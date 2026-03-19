import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Radio, Eye, ExternalLink, X, Clock, Youtube, Tv } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";

type StreamItem = {
  id: number;
  title: string;
  description?: string | null;
  federationId: number | null;
  streamUrl: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  platformType: string;
  isLive: boolean;
  scheduledStart: string | null;
  viewerCount: number | null;
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-4 h-4" />,
  facebook: <Tv className="w-4 h-4" />,
  twitch: <Radio className="w-4 h-4" />,
};

function getTimeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "Starting soon";
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `in ${days}d ${hours % 24}h`;
  }
  return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
}

function EmbedModal({ stream, onClose }: { stream: StreamItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl rounded-2xl overflow-hidden"
          style={{ background: "rgba(10,10,10,0.98)", border: "1px solid rgba(255,255,255,0.12)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2">
              {stream.isLive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold uppercase tracking-wider">LIVE</span>
                </span>
              )}
              <span className="text-white font-medium text-sm">{stream.title}</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "#9CA3AF" }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="aspect-video">
            {stream.embedUrl ? (
              <iframe
                src={stream.embedUrl}
                title={stream.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.5)" }}>
                <Radio className="w-16 h-16 text-gray-600" />
                <a
                  href={stream.streamUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on {stream.platformType}
                </a>
              </div>
            )}
          </div>
          {stream.description && (
            <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-gray-400 text-sm">{stream.description}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LiveStreamCard({ stream, onWatch }: { stream: StreamItem; onWatch: (s: StreamItem) => void }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(239,68,68,0.25)",
      }}
      onClick={() => onWatch(stream)}
    >
      <div className="relative aspect-video">
        {stream.thumbnailUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${stream.thumbnailUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(20,0,0,0.8)" }}>
            <Radio className="w-14 h-14 text-red-800" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.9)" }}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">LIVE</span>
        </div>
        {stream.viewerCount != null && stream.viewerCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white" style={{ background: "rgba(0,0,0,0.6)" }}>
            <Eye className="w-3 h-3" />
            {stream.viewerCount.toLocaleString()}
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.9)" }}>
            <div className="w-0 h-0 ml-1" style={{ borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid white" }} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-gray-400">{PLATFORM_ICONS[stream.platformType.toLowerCase()] ?? <Radio className="w-4 h-4" />}</span>
          <span className="text-xs text-gray-500 capitalize">{stream.platformType}</span>
        </div>
        <h3 className="text-white font-serif leading-snug line-clamp-2">{stream.title}</h3>
        {stream.embedUrl ? (
          <span className="text-xs text-red-400 mt-1 block">Click to watch</span>
        ) : (
          <span className="text-xs text-gray-500 mt-1 block flex items-center gap-1">
            <ExternalLink className="w-3 h-3 inline" /> Opens in new tab
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ScheduledStreamCard({ stream }: { stream: StreamItem }) {
  const [timeUntil, setTimeUntil] = useState(() =>
    stream.scheduledStart ? getTimeUntil(stream.scheduledStart) : ""
  );

  const tick = useCallback(() => {
    if (stream.scheduledStart) setTimeUntil(getTimeUntil(stream.scheduledStart));
  }, [stream.scheduledStart]);

  useEffect(() => {
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-4 flex gap-4 items-center"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="w-16 h-16 rounded-xl flex-shrink-0 bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: stream.thumbnailUrl ? `url(${stream.thumbnailUrl})` : undefined,
          background: stream.thumbnailUrl ? undefined : "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        {!stream.thumbnailUrl && <Radio className="w-7 h-7 text-blue-500/50" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-medium line-clamp-1">{stream.title}</h4>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-gray-500 capitalize flex items-center gap-1">
            {PLATFORM_ICONS[stream.platformType.toLowerCase()] ?? <Radio className="w-3 h-3" />}
            {stream.platformType}
          </span>
          {stream.scheduledStart && (
            <span className="text-xs flex items-center gap-1" style={{ color: "#60A5FA" }}>
              <Clock className="w-3 h-3" />
              {new Date(stream.scheduledStart).toLocaleDateString("en-NA", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>
      {timeUntil && (
        <div className="flex-shrink-0 text-right">
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.3)" }}>
            {timeUntil}
          </span>
        </div>
      )}
      {stream.streamUrl && (
        <a
          href={stream.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: "#9CA3AF" }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </motion.div>
  );
}

export default function Live() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [watchStream, setWatchStream] = useState<StreamItem | null>(null);

  const liveQuery = trpc.streams.list.useQuery({ isLive: true });
  const allQuery = trpc.streams.list.useQuery({});

  const allStreams = (allQuery.data ?? []) as StreamItem[];
  const liveStreams = (liveQuery.data ?? []) as StreamItem[];

  const now = Date.now();
  const scheduled = allStreams.filter(
    (s) => !s.isLive && s.scheduledStart && new Date(s.scheduledStart).getTime() > now
  );

  const platforms = Array.from(new Set(allStreams.map((s) => s.platformType.toLowerCase()))).sort();

  function filterByPlatform<T extends StreamItem>(list: T[]): T[] {
    if (platformFilter === "all") return list;
    return list.filter((s) => s.platformType.toLowerCase() === platformFilter);
  }

  function handleWatch(stream: StreamItem) {
    if (stream.embedUrl) {
      setWatchStream(stream);
    } else if (stream.streamUrl) {
      window.open(stream.streamUrl, "_blank", "noopener,noreferrer");
    }
  }

  const isLoading = liveQuery.isLoading || allQuery.isLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors p-2 rounded-xl">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
          <div className="flex items-center gap-2">
            {liveStreams.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-bold">{liveStreams.length} LIVE</span>
              </span>
            )}
            <h1 className="text-white text-2xl font-serif tracking-[0.3em]">LIVE</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Hero banner */}
      <section className="relative h-44 md:h-60 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 pt-16">
          <div className="flex items-center gap-3 mb-2">
            <Radio className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-serif tracking-wider">LIVE STREAMS</h1>
          </div>
          <p className="text-white/70 text-sm md:text-base">
            {liveStreams.length > 0
              ? `${liveStreams.length} stream${liveStreams.length > 1 ? "s" : ""} live right now`
              : "Namibian sports, live and on demand"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Platform filter pills */}
        {platforms.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {["all", ...platforms].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: platformFilter === p ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)",
                  border: platformFilter === p ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: platformFilter === p ? "#93C5FD" : "#9CA3AF",
                }}
              >
                {PLATFORM_ICONS[p] ?? null}
                {p === "all" ? "All Platforms" : p}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        )}

        {!isLoading && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10">
            {/* LIVE NOW section */}
            {filterByPlatform(liveStreams).length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 text-sm font-bold uppercase tracking-wider">LIVE NOW</span>
                  </span>
                  <span className="text-gray-500 text-sm">{filterByPlatform(liveStreams).length} active</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filterByPlatform(liveStreams).map((stream) => (
                    <LiveStreamCard key={stream.id} stream={stream} onWatch={handleWatch} />
                  ))}
                </div>
              </section>
            )}

            {/* No live streams right now */}
            {filterByPlatform(liveStreams).length === 0 && filterByPlatform(scheduled).length === 0 && (
              <motion.div variants={fadeUp} className="text-center py-20">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <Radio className="w-10 h-10 text-red-800" />
                </div>
                <h3 className="text-2xl font-serif text-gray-400 mb-2">No Live Streams Right Now</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Check back when events kick off. Scheduled streams will appear here automatically.
                </p>
              </motion.div>
            )}

            {/* SCHEDULED section */}
            {filterByPlatform(scheduled).length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-serif text-white tracking-wide">UPCOMING STREAMS</h2>
                  </div>
                  <span className="text-gray-500 text-sm">{filterByPlatform(scheduled).length} scheduled</span>
                </div>
                <div className="space-y-3">
                  {filterByPlatform(scheduled).map((stream) => (
                    <ScheduledStreamCard key={stream.id} stream={stream} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>

      {/* Embed modal */}
      {watchStream && <EmbedModal stream={watchStream} onClose={() => setWatchStream(null)} />}
    </div>
  );
}
