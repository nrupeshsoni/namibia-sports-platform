import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

function NewsImage({ src, title }: { src: string; title: string }) {
  const [broken, setBroken] = useState(false);
  const initial = title.trim().charAt(0).toUpperCase() || "N";

  if (broken) {
    return (
      <div
        className="aspect-video flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(59,130,246,0.2))",
        }}
      >
        <span className="text-4xl font-serif text-white/70">{initial}</span>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-800">
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setBroken(true)}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="aspect-video" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="p-6 space-y-3">
        <div className="h-3 rounded w-1/4" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="h-4 rounded w-3/4" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="h-3 rounded w-full" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
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
        <h2 className="text-3xl font-serif tracking-widest text-white uppercase">News</h2>
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
            <motion.article
              key={article.id}
              variants={fadeUp}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {article.featuredImage ? (
                <NewsImage src={article.featuredImage} title={article.title} />
              ) : (
                <div
                  className="aspect-video flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(59,130,246,0.15))",
                  }}
                >
                  <span className="text-4xl font-serif text-white/60">
                    {article.title.trim().charAt(0).toUpperCase() || "N"}
                  </span>
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.category && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "rgba(59, 130, 246, 0.3)", color: "#93C5FD" }}
                    >
                      {article.category}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif text-white mb-2">{article.title}</h3>
                {article.summary && <p className="text-sm text-gray-400 line-clamp-3">{article.summary}</p>}
                {article.publishedAt && (
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {!newsQuery.isLoading && !newsQuery.isError && articles.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16 px-4">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Newspaper className="w-9 h-9 text-gray-600" />
          </div>
          <h3 className="text-xl font-serif text-gray-300 mb-2">No news published yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {federation.name} has not posted articles yet. Check back for match reports,
            announcements, and federation updates.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
