import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { fadeUp } from "@/lib/animations";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

/**
 * Shared glass/dark shell for public legal pages (`/privacy`, `/terms`).
 */
export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white">
      <header
        className="border-b sticky top-0 z-20"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <button
              type="button"
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors p-2 rounded-xl"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
          <span className="text-sm font-serif text-gray-400 tracking-wide">NAMIBIA SPORTS</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="container mx-auto max-w-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <h1 className="text-3xl md:text-4xl font-serif mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>
          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed [&_h2]:text-white [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-red-400 [&_a]:hover:text-red-300">
            {children}
          </div>
        </motion.article>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-600">
        <p>
          <Link href="/privacy">
            <a className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
          </Link>
          <span className="mx-3">·</span>
          <Link href="/terms">
            <a className="text-gray-500 hover:text-white transition-colors">Terms of Use</a>
          </Link>
        </p>
      </footer>
    </div>
  );
}
