import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

const AVATAR_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#FBBF24", "#F97316", "#8B5CF6", "#EC4899"];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function calcAge(dob: string | Date | null | undefined): number | null {
  if (dob == null) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 space-y-3 animate-pulse text-center"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="w-16 h-16 rounded-full mx-auto" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="h-3 rounded w-3/4 mx-auto" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="h-3 rounded w-1/2 mx-auto" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}

type GenderFilter = "all" | "male" | "female";
type StatusFilter = "all" | "active" | "inactive";
type SortBy = "name" | "ranking";

export default function FederationAthletes() {
  const { federation } = useFederation();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const athletesQuery = trpc.athletes.list.useQuery({ federationId: federation?.id });
  const athletes = athletesQuery.data ?? [];

  const maleCount = athletes.filter((a) => a.gender?.toLowerCase() === "male").length;
  const femaleCount = athletes.filter((a) => a.gender?.toLowerCase() === "female").length;

  const filtered = useMemo(() => {
    let list = [...athletes];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => `${a.firstName} ${a.lastName}`.toLowerCase().includes(q));
    }
    if (genderFilter !== "all") {
      list = list.filter((a) => a.gender?.toLowerCase() === genderFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((a) => (statusFilter === "active" ? a.isActive : !a.isActive));
    }
    if (sortBy === "name") {
      list.sort((a, b) =>
        `${a.firstName}${a.lastName}`.localeCompare(`${b.firstName}${b.lastName}`)
      );
    } else {
      list.sort((a, b) => {
        if (a.currentRanking == null && b.currentRanking == null) return 0;
        if (a.currentRanking == null) return 1;
        if (b.currentRanking == null) return -1;
        return a.currentRanking - b.currentRanking;
      });
    }
    return list;
  }, [athletes, search, genderFilter, statusFilter, sortBy]);

  if (!federation) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <h2 className="text-3xl font-serif tracking-widest text-white uppercase">Athletes</h2>
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444" }}
        >
          {athletes.length} total
        </span>
        {maleCount > 0 && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.3)" }}>
            {maleCount} male
          </span>
        )}
        {femaleCount > 0 && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(236,72,153,0.15)", color: "#F9A8D4", border: "1px solid rgba(236,72,153,0.3)" }}>
            {femaleCount} female
          </span>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <div
          className="relative rounded-xl overflow-hidden max-w-md"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search athletes by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Filter:</span>
          {(["all", "male", "female", "active", "inactive"] as const).map((f) => {
            const isGenderOpt = f === "male" || f === "female";
            const isStatusOpt = f === "active" || f === "inactive";
            const isActive =
              f === "all"
                ? genderFilter === "all" && statusFilter === "all"
                : isGenderOpt
                ? genderFilter === f
                : statusFilter === f;

            return (
              <button
                key={f}
                onClick={() => {
                  if (f === "all") { setGenderFilter("all"); setStatusFilter("all"); }
                  else if (isGenderOpt) setGenderFilter(f as GenderFilter);
                  else if (isStatusOpt) setStatusFilter(f as StatusFilter);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: isActive ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.05)",
                  border: isActive ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: isActive ? "#EF4444" : "#9CA3AF",
                }}
              >
                {f}
              </button>
            );
          })}

          <span className="text-xs text-gray-500 uppercase tracking-wider ml-2">Sort:</span>
          {(["name", "ranking"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: sortBy === s ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)",
                border: sortBy === s ? "1px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.1)",
                color: sortBy === s ? "#FBBF24" : "#9CA3AF",
              }}
            >
              By {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {athletesQuery.isLoading && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {athletesQuery.isError && (
        <motion.p variants={fadeUp} className="text-center text-red-400 py-12">
          Failed to load athletes. Please try again.
        </motion.p>
      )}

      {/* Grid */}
      {!athletesQuery.isLoading && !athletesQuery.isError && filtered.length > 0 && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((athlete) => {
            const color = avatarColor(`${athlete.firstName}${athlete.lastName}`);
            const age = calcAge(athlete.dateOfBirth);
            const isMale = athlete.gender?.toLowerCase() === "male";

            return (
              <motion.div
                key={athlete.id}
                variants={fadeUp}
                className="rounded-2xl p-5 text-center transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center overflow-hidden"
                    style={{ border: `2px solid ${color}55`, background: `${color}22` }}
                  >
                    {athlete.photoUrl ? (
                      <img
                        src={athlete.photoUrl}
                        alt={`${athlete.firstName} ${athlete.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80";
                        }}
                      />
                    ) : (
                      <span className="text-lg font-serif text-white/80">
                        {athlete.firstName.charAt(0)}{athlete.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#111]"
                    style={{ background: athlete.isActive ? "#10B981" : "#4B5563" }}
                  />
                </div>

                <h3 className="text-sm font-serif text-white leading-tight">
                  {athlete.firstName} {athlete.lastName}
                </h3>

                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {athlete.gender && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: isMale ? "rgba(59,130,246,0.15)" : "rgba(236,72,153,0.15)",
                        color: isMale ? "#93C5FD" : "#F9A8D4",
                      }}
                    >
                      {isMale ? "♂ Male" : "♀ Female"}
                    </span>
                  )}
                  {age != null && (
                    <span className="px-2 py-0.5 rounded-full text-xs text-gray-500 bg-white/5">
                      {age}y
                    </span>
                  )}
                </div>

                {athlete.currentRanking != null && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium" style={{ color: "#FBBF24" }}>
                      #{athlete.currentRanking}
                    </span>
                  </div>
                )}

                {athlete.achievements && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 text-left">
                    {athlete.achievements.slice(0, 100)}
                    {athlete.achievements.length > 100 ? "…" : ""}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty: no athletes at all */}
      {!athletesQuery.isLoading && !athletesQuery.isError && athletes.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <User className="w-9 h-9 text-gray-600" />
          </div>
          <h3 className="text-xl font-serif text-gray-400 mb-2">No Athletes Registered Yet</h3>
          <p className="text-gray-500 text-sm">Athletes will appear here once added by the federation admin.</p>
        </motion.div>
      )}

      {/* Empty: filters returned nothing */}
      {!athletesQuery.isLoading && !athletesQuery.isError && athletes.length > 0 && filtered.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-12">
          <p className="text-gray-400 mb-2">No athletes match your current filters.</p>
          <button
            onClick={() => { setSearch(""); setGenderFilter("all"); setStatusFilter("all"); }}
            className="text-sm text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
