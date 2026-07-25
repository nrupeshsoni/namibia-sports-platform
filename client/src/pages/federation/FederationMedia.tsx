import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse aspect-video" style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }} />
  );
}

/** Public federation media gallery. */
export default function FederationMedia() {
  const { federation } = useFederation();
  const mediaQuery = trpc.media.list.useQuery(
    { entityType: "federation", entityId: federation?.id ?? 0 },
    { enabled: !!federation?.id }
  );
  const items = mediaQuery.data ?? [];
  if (!federation) return null;
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
        <h2 className="text-3xl font-serif tracking-widest uppercase" style={{ color: "var(--chrome-fg)" }}>Media</h2>
        {!mediaQuery.isLoading && (
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444" }}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </motion.div>
      {mediaQuery.isLoading && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (<SkeletonCard key={i} />))}
        </div>
      )}
      {mediaQuery.isError && (
        <motion.p variants={fadeUp} className="text-center text-red-400 py-12">Failed to load media. Please try again.</motion.p>
      )}
      {!mediaQuery.isLoading && !mediaQuery.isError && items.length > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <motion.a key={m.id} variants={fadeUp} href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden group block" style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }}>
              <div className="aspect-video bg-black/20">
                {m.type === "image" ? (
                  <img src={m.thumbnailUrl || m.fileUrl} alt={m.title || (federation.name + " media")} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm uppercase tracking-wide" style={{ color: "var(--chrome-muted)" }}>{m.type}</div>
                )}
              </div>
              {(m.title || m.type !== "image") && (
                <div className="p-3"><p className="text-sm truncate" style={{ color: "var(--chrome-fg)" }}>{m.title || m.type}</p></div>
              )}
            </motion.a>
          ))}
        </div>
      )}
      {!mediaQuery.isLoading && !mediaQuery.isError && items.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16 px-4">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }}>
            <ImageIcon className="w-9 h-9" style={{ color: "var(--chrome-muted)" }} />
          </div>
          <h3 className="text-xl font-serif mb-2" style={{ color: "var(--chrome-fg)" }}>No media yet</h3>
          <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--chrome-muted)" }}>{federation.name} has not published gallery photos or videos yet.</p>
        </motion.div>
      )}
    </motion.div>
  );
}