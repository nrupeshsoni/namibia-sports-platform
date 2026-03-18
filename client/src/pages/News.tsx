import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Newspaper, Search, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function News() {
  const [sportFilter, setSportFilter] = useState<string>("all");
  const newsQuery = trpc.news.list.useQuery({
    federationId: sportFilter === "all" ? undefined : Number(sportFilter) || undefined,
    limit: 50,
  });

  const news = newsQuery.data ?? [];
  const federationsQuery = trpc.federations.list.useQuery({});
  const federations = federationsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors p-2 rounded-xl"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">NEWS</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="pt-24 pb-20">
        <section className="relative h-48 md:h-64 w-full overflow-hidden mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-blue-600/80" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <Newspaper className="w-16 h-16 mb-4" />
            <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-wider">
              SPORTS NEWS
            </h1>
            <p className="text-lg font-light">
              Latest from all Namibian federations
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setSportFilter("all")}
              className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  sportFilter === "all"
                    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))"
                    : "rgba(255, 255, 255, 0.05)",
                border:
                  sportFilter === "all"
                    ? "1px solid rgba(239, 68, 68, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            >
              All Sports
            </button>
            {federations.slice(0, 8).map((fed) => (
              <button
                key={fed.id}
                onClick={() => setSportFilter(String(fed.id))}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background:
                    sportFilter === String(fed.id)
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    sportFilter === String(fed.id)
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                }}
              >
                {fed.abbreviation || fed.name.slice(0, 12)}
              </button>
            ))}
          </div>

          {newsQuery.isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {!newsQuery.isLoading &&
              news.map((article) => (
                <motion.div
                  key={article.id}
                  variants={fadeUp}
                  className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {article.featuredImage && (
                    <div
                      className="aspect-video bg-cover bg-center"
                      style={{ backgroundImage: `url(${article.featuredImage})` }}
                    />
                  )}
                  <div className="p-6">
                    {article.category && (
                      <Badge
                        className="mb-2"
                        style={{
                          background: "rgba(239, 68, 68, 0.3)",
                          color: "white",
                          border: "1px solid rgba(239, 68, 68, 0.5)",
                        }}
                      >
                        {article.category}
                      </Badge>
                    )}
                    <h3 className="text-xl font-serif text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-gray-400 text-sm line-clamp-2">{article.summary}</p>
                    )}
                    {article.publishedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>

          {!newsQuery.isLoading && news.length === 0 && (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No News Yet</h3>
              <p className="text-gray-500">Check back soon for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
