import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Newspaper, X, Calendar, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";

function formatDate(val: string | null | undefined): string {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-NA", { day: "numeric", month: "short", year: "numeric" });
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="aspect-video" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="p-5 space-y-3">
        <div className="h-3 rounded w-1/4" style={{ background: "rgba(239,68,68,0.2)" }} />
        <div className="h-4 rounded w-5/6" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="h-3 rounded w-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-3 rounded w-2/3" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
    </div>
  );
}

type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  federationId: number | null;
  category: string | null;
  tags: string[] | null;
  featuredImage: string | null;
  isPublished: boolean | null;
  publishedAt: string | null;
};

function ArticleModal({ article, onClose }: { article: NewsArticle; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "rgba(15,15,20,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {article.featuredImage && (
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{ backgroundImage: `url(${article.featuredImage})` }}
            />
          )}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                {article.category && (
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                    style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                )}
                {article.publishedAt && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "#9CA3AF" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-serif text-white mb-4 leading-snug">{article.title}</h2>

            {article.summary && (
              <p className="text-gray-300 text-sm leading-relaxed mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {article.summary}
              </p>
            )}

            {article.content && (
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            )}

            {!article.content && !article.summary && (
              <p className="text-gray-500 text-sm">No content available for this article.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function News() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const newsQuery = trpc.news.list.useQuery({ limit: 50 });
  const news = (newsQuery.data ?? []) as NewsArticle[];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach((a) => { if (a.category) cats.add(a.category); });
    return Array.from(cats).sort();
  }, [news]);

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return news;
    return news.filter((a) => a.category === categoryFilter);
  }, [news, categoryFilter]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Fixed header */}
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
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">NEWS</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="pt-24 pb-20">
        {/* Hero banner */}
        <section className="relative h-52 md:h-72 w-full overflow-hidden mb-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 to-blue-700/80" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <Newspaper className="w-14 h-14 mb-3" />
            <h1 className="text-4xl md:text-6xl font-serif mb-2 tracking-wider">SPORTS NEWS</h1>
            <p className="text-base md:text-lg font-light text-white/80">Latest from all Namibian federations</p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Category filter pills */}
          {categories.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-8"
            >
              {["all", ...categories].map((cat) => (
                <motion.button
                  key={cat}
                  variants={fadeUp}
                  onClick={() => setCategoryFilter(cat)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                  style={{
                    background: categoryFilter === cat
                      ? "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))"
                      : "rgba(255,255,255,0.05)",
                    border: categoryFilter === cat
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {cat === "all" ? "All Categories" : cat}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Loading skeletons */}
          {newsQuery.isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {newsQuery.isError && (
            <div className="text-center py-20">
              <p className="text-red-400">Failed to load news. Please try again.</p>
            </div>
          )}

          {!newsQuery.isLoading && !newsQuery.isError && filtered.length > 0 && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
              {/* Featured article */}
              {featured && (
                <motion.div
                  variants={fadeUp}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  onClick={() => setSelectedArticle(featured)}
                >
                  <div
                    className="w-full h-64 md:h-96 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${featured.featuredImage ?? "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80"})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      {featured.category && (
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-medium"
                          style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                        >
                          {featured.category}
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg" style={{ background: "rgba(251,191,36,0.2)", color: "#FBBF24" }}>
                        Featured
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-serif text-white mb-2 leading-tight">
                      {featured.title}
                    </h2>
                    {featured.summary && (
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl">{featured.summary}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      {featured.publishedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(featured.publishedAt)}
                        </span>
                      )}
                      <span
                        className="text-sm font-medium transition-colors group-hover:text-white"
                        style={{ color: "#EF4444" }}
                      >
                        Read More →
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Remaining articles grid */}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <motion.div
                      key={article.id}
                      variants={fadeUp}
                      className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] group"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div
                        className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${article.featuredImage ?? "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80"})`,
                        }}
                      />
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {article.category && (
                            <span
                              className="px-2.5 py-0.5 rounded-lg text-xs font-medium"
                              style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}
                            >
                              {article.category}
                            </span>
                          )}
                          {article.publishedAt && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publishedAt)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-gray-400 text-sm line-clamp-2">{article.summary}</p>
                        )}
                        <span
                          className="inline-block mt-3 text-xs font-medium transition-colors group-hover:text-red-300"
                          style={{ color: "#EF4444" }}
                        >
                          Read More →
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Empty state */}
          {!newsQuery.isLoading && !newsQuery.isError && filtered.length === 0 && (
            <div className="text-center py-20">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Newspaper className="w-9 h-9 text-gray-600" />
              </div>
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No News Yet</h3>
              <p className="text-gray-500">
                {categoryFilter !== "all"
                  ? "No articles in this category. Try selecting a different one."
                  : "Check back soon for the latest sports news from Namibia."}
              </p>
              {categoryFilter !== "all" && (
                <button onClick={() => setCategoryFilter("all")} className="text-sm text-blue-400 mt-3 hover:underline">
                  Show all categories
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Article modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
