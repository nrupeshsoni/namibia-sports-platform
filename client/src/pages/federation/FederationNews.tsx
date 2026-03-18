import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

export default function FederationNews() {
  const { federation } = useFederation();

  const newsQuery = trpc.news.list.useQuery({ federationId: federation?.id });
  const articles = newsQuery.data ?? [];

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
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
            {article.featuredImage && (
              <div className="aspect-video bg-gray-800">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
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

      {articles.length === 0 && (
        <motion.p variants={fadeUp} className="text-center text-gray-500 py-12">
          No news articles yet
        </motion.p>
      )}
    </motion.div>
  );
}
