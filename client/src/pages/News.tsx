import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SiteLegalFooter } from "@/components/SiteLegalFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedNewsCard } from "@/components/FeaturedNewsCard";
import {
  NewsArticleModal,
  type NewsArticleModalItem,
} from "@/components/NewsArticleModal";

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse p-5 space-y-3"
      style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-surface-border)" }}
    >
      <div className="h-3 rounded w-1/4" style={{ background: "rgba(239,68,68,0.2)" }} />
      <div className="h-4 rounded w-5/6" style={{ background: "var(--chrome-btn-bg)" }} />
      <div className="h-3 rounded w-full" style={{ background: "var(--chrome-btn-bg)" }} />
      <div className="h-3 rounded w-2/3" style={{ background: "var(--chrome-btn-bg)" }} />
    </div>
  );
}

type NewsArticle = NewsArticleModalItem & {
  federationId: number | null;
  tags: string[] | null;
  isPublished: boolean | null;
};

export default function News() {
  const [location, setLocation] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const slugFromPath = useMemo(() => {
    const m = location.match(/^\/news\/(.+)$/);
    return m ? m[1] : null;
  }, [location]);

  const articleBySlugQuery = trpc.news.getBySlug.useQuery(
    { slug: slugFromPath! },
    { enabled: !!slugFromPath }
  );

  useEffect(() => {
    if (articleBySlugQuery.data) {
      setSelectedArticle(articleBySlugQuery.data as NewsArticle);
    }
  }, [articleBySlugQuery.data]);

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (slugFromPath) setLocation("/news");
  };

  const newsQuery = trpc.news.list.useQuery({ limit: 50 });
  const news = (newsQuery.data ?? []) as NewsArticle[];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats).sort();
  }, [news]);

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return news;
    return news.filter((a) => a.category === categoryFilter);
  }, [news, categoryFilter]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen theme-page">
      <header className="fixed top-0 left-0 right-0 z-40 theme-chrome border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2 min-h-[44px]">
          <Link href="/">
            <button
              className="flex items-center gap-2 min-h-[44px] px-2 rounded-xl transition-colors"
              style={{ color: "var(--chrome-fg)", background: "var(--chrome-btn-bg)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
          </Link>
          <h1
            className="text-xl sm:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.3em]"
            style={{ color: "var(--chrome-fg)" }}
          >
            NEWS
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <div className="pt-24 pb-20">
        <section className="relative h-52 md:h-72 w-full overflow-hidden mb-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 to-blue-700/80" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <Newspaper className="w-14 h-14 mb-3" />
            <h1 className="text-4xl md:text-6xl font-serif mb-2 tracking-wider">SPORTS NEWS</h1>
            <p className="text-base md:text-lg font-light text-white/80">
              Latest from all Namibian federations
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
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
                    background:
                      categoryFilter === cat
                        ? "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))"
                        : "var(--chrome-btn-bg)",
                    border:
                      categoryFilter === cat
                        ? "1px solid rgba(239,68,68,0.5)"
                        : "1px solid var(--chrome-border)",
                    color: "var(--chrome-fg)",
                  }}
                >
                  {cat === "all" ? "All Categories" : cat}
                </motion.button>
              ))}
            </motion.div>
          )}

          {newsQuery.isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {newsQuery.isError && (
            <div className="text-center py-20">
              <p className="text-red-400">Failed to load news. Please try again.</p>
            </div>
          )}

          {!newsQuery.isLoading && !newsQuery.isError && filtered.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {featured && (
                <motion.div variants={fadeUp}>
                  <FeaturedNewsCard
                    article={featured}
                    onClick={() => setSelectedArticle(featured)}
                  />
                </motion.div>
              )}

              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <motion.div key={article.id} variants={fadeUp}>
                      <NewsCard
                        article={article}
                        accent="red"
                        onClick={() => setSelectedArticle(article)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!newsQuery.isLoading && !newsQuery.isError && filtered.length === 0 && (
            <div className="text-center py-20">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: "var(--chrome-btn-bg)",
                  border: "1px solid var(--chrome-border)",
                }}
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
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="text-sm text-blue-400 mt-3 hover:underline"
                >
                  Show all categories
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedArticle && (
        <NewsArticleModal article={selectedArticle} onClose={handleCloseArticle} />
      )}

      <SiteLegalFooter />
    </div>
  );
}
