import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Mail, Shield, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

const REGIONS = [
  "Erongo", "Hardap", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati",
  "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi", "Kavango East", "Kavango West", "Karas",
];

const CLUB_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#FBBF24", "#F97316", "#8B5CF6", "#EC4899"];

function clubColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return CLUB_COLORS[Math.abs(hash) % CLUB_COLORS.length];
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="h-20" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded w-3/4" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="h-3 rounded w-1/2" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-3 rounded w-2/3" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
    </div>
  );
}

export default function FederationClubs() {
  const { federation } = useFederation();
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  const clubsQuery = trpc.clubs.list.useQuery({ federationId: federation?.id });
  const clubs = clubsQuery.data ?? [];

  const filtered = clubs.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.region ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === "all" || c.region === regionFilter;
    return matchSearch && matchRegion;
  });

  if (!federation) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
        <h2 className="text-3xl font-serif tracking-widest text-white uppercase">Our Clubs</h2>
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444" }}
        >
          {clubs.length} {clubs.length === 1 ? "club" : "clubs"}
        </span>
      </motion.div>

      {/* Search + Region filters */}
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
            placeholder="Search by name, city or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", ...REGIONS].map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: regionFilter === r ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)",
                border: regionFilter === r ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: regionFilter === r ? "#93C5FD" : "#9CA3AF",
              }}
            >
              {r === "all" ? "All Regions" : r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading skeletons */}
      {clubsQuery.isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {clubsQuery.isError && (
        <motion.p variants={fadeUp} className="text-center text-red-400 py-12">
          Failed to load clubs. Please try again.
        </motion.p>
      )}

      {/* Club grid */}
      {!clubsQuery.isLoading && !clubsQuery.isError && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => {
            const color = clubColor(club.name);
            return (
              <motion.div
                key={club.id}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Gradient banner with logo or initial */}
                <div
                  className="h-20 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {club.logoUrl ? (
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      className="w-14 h-14 object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80";
                      }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-serif text-white"
                      style={{ background: `${color}33`, border: `1px solid ${color}66` }}
                    >
                      {club.name.charAt(0)}
                    </div>
                  )}
                  <span
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: club.isActive ? "rgba(16,185,129,0.2)" : "rgba(107,114,128,0.2)",
                      border: club.isActive ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(107,114,128,0.3)",
                      color: club.isActive ? "#10B981" : "#6B7280",
                    }}
                  >
                    {club.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-lg font-serif text-white leading-tight">{club.name}</h3>

                  {(club.region || club.city) && (
                    <div className="flex flex-wrap gap-1.5">
                      {club.region && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                          style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD" }}
                        >
                          <MapPin className="w-3 h-3" />
                          {club.region}
                        </span>
                      )}
                      {club.city && (
                        <span
                          className="px-2 py-0.5 rounded-md text-xs"
                          style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}
                        >
                          {club.city}
                        </span>
                      )}
                    </div>
                  )}

                  {club.presidentName && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      President: <span className="text-gray-300">{club.presidentName}</span>
                    </p>
                  )}

                  {club.coachName && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      Coach: <span className="text-gray-300">{club.coachName}</span>
                    </p>
                  )}

                  {club.memberCount != null && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-300">{club.memberCount.toLocaleString()}</span> members
                    </p>
                  )}

                  {club.contactEmail && (
                    <a
                      href={`mailto:${club.contactEmail}`}
                      className="text-xs flex items-center gap-1.5 transition-colors hover:text-blue-300 truncate"
                      style={{ color: "#60A5FA" }}
                    >
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      {club.contactEmail}
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty: no clubs at all */}
      {!clubsQuery.isLoading && !clubsQuery.isError && clubs.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Users className="w-9 h-9 text-gray-600" />
          </div>
          <h3 className="text-xl font-serif text-gray-400 mb-2">No Clubs Registered Yet</h3>
          <p className="text-gray-500 text-sm">Clubs will appear here once added by the federation admin.</p>
        </motion.div>
      )}

      {/* Empty: filters returned nothing */}
      {!clubsQuery.isLoading && !clubsQuery.isError && clubs.length > 0 && filtered.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-12">
          <p className="text-gray-400 mb-2">No clubs match your current filters.</p>
          <button
            onClick={() => { setSearch(""); setRegionFilter("all"); }}
            className="text-sm text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
