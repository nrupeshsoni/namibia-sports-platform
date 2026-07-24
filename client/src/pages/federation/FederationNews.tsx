import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";
import { NewsCard } from "@/components/NewsCard";
import { Link } from "wouter";

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse p-6 space-y-3"
      style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }}
    >
      <div className="h-3 rounded w-1/4" style={{ background: "var(--chrome-btn-bg)" }} />
      <div className="h-4 rounded w-3/4" style={{ background: "var(--chrome-btn-bg)" }} />
      <div className="h-3 rounded w-full" style={{ background: "var(--chrome-btn-bg)" }} />
    </div>
  );
}

export default function FederationNews() {
  const { federation } = useFederation();

  const newsQuery = trpc.news.list.useQuery(
    { federationId: federation?.id },
    { enabled: !!federation?.id }
  );
  const articles = newsQuery.data ?? [];

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
        <h2 className="text-3xl font-serif tracking-widest uppercase" style={{ color: "var(--chrome-fg)" }}>
          News
        </h2>
        {!newsQuery.isLoading && (
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444" }}
          >
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
        )}
      </motion.div>

      {newsQuery.isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {newsQuery.isError && (
        <motion.p variants={fadeUp} className="text-center text-red-400 py-12">
          Failed to load news. Please try again.
        </motion.p>
      )}

      {!newsQuery.isLoading && !newsQuery.isError && articles.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <motion.div key={article.id} variants={fadeUp}>
              <Link href={`/news/${article.slug}`}>
                <NewsCard article={article} accent="blue" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!newsQuery.isLoading && !newsQuery.isError && articles.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16 px-4">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }}
          >
            <Newspaper className="w-9 h-9" style={{ color: "var(--chrome-muted)" }} />
          </div>
          <h3 className="text-xl font-serif mb-2" style={{ color: "var(--chrome-fg)" }}>
            No news published yet
          </h3>
          <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--chrome-muted)" }}>
            {federation.name} has not posted articles yet. Check back for match reports,
            announcements, and federation updates.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
