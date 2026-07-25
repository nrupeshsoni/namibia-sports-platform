import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import {
  ChevronLeft,
  Trophy,
  Users,
  Building2,
  MapPin,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function AthleteProfile() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [photoBroken, setPhotoBroken] = useState(false);

  const query = trpc.athletes.getBySlug.useQuery({ slug });
  const athlete = query.data ?? null;
  const isLoading = query.isLoading;
  const is404 = !isLoading && !athlete;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse w-24 h-24 rounded-full bg-white/10" />
      </div>
    );
  }

  if (is404) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif mb-4">Athlete Not Found</h1>
        <p className="text-gray-400 mb-6">The athlete profile could not be found.</p>
        <Link href="/">
          <button
            className="px-6 py-3 rounded-xl text-white font-medium"
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const a = athlete!;
  const isMale = a.gender?.toLowerCase() === "male";

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
        style={{ paddingTop: "calc(2rem + env(safe-area-inset-top, 0px))" }}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <Link href="/">
            <button
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
        </motion.div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Photo */}
              <motion.div variants={fadeUp} className="flex-shrink-0">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden mx-auto md:mx-0"
                  style={{
                    border: "2px solid rgba(239, 68, 68, 0.3)",
                    background: "rgba(239, 68, 68, 0.1)",
                  }}
                >
                  {a.photoUrl && !photoBroken ? (
                    <img
                      src={a.photoUrl}
                      alt={`${a.firstName} ${a.lastName}`}
                      className="w-full h-full object-cover"
                      onError={() => setPhotoBroken(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl md:text-5xl font-serif text-white/70">
                        {a.firstName.charAt(0)}
                        {a.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <motion.div variants={fadeUp}>
                  <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    {a.firstName} {a.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    {a.gender && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: isMale ? "rgba(59,130,246,0.2)" : "rgba(236,72,153,0.2)",
                          color: isMale ? "#93C5FD" : "#F9A8D4",
                          border: isMale
                            ? "1px solid rgba(59,130,246,0.4)"
                            : "1px solid rgba(236,72,153,0.4)",
                        }}
                      >
                        {isMale ? "♂ Male" : "♀ Female"}
                      </span>
                    )}
                    {a.nationality && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs flex items-center gap-1"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)" }}
                      >
                        <MapPin className="w-3 h-3" />
                        {a.nationality}
                      </span>
                    )}
                    {a.currentRanking != null && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ background: "rgba(251,191,36,0.2)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.4)" }}
                      >
                        <Trophy className="w-3 h-3" />
                        #{a.currentRanking}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Federation & Club */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                  {a.federationSlug && (
                    <Link href={`/federation/${a.federationSlug}`}>
                      <span
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white cursor-pointer transition-colors"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        <Users className="w-4 h-4" />
                        {a.federationName ?? "Federation"}
                      </span>
                    </Link>
                  )}
                  {a.clubSlug && (
                    <Link href={`/clubs/${a.clubSlug}`}>
                    <span
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Building2 className="w-4 h-4" />
                      {a.clubName ?? "Club"}
                    </span>
                    </Link>
                  )}
                </motion.div>

              </div>
            </div>

            {/* Achievements */}
            {a.achievements && (
              <motion.section variants={fadeUp} className="mt-8 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <h2 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{a.achievements}</p>
              </motion.section>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
