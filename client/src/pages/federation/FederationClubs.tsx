import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

const REGIONS = [
  "Erongo", "Hardap", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati",
  "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi", "Kavango East", "Kavango West", "Karas",
];

export default function FederationClubs() {
  const { federation } = useFederation();
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const clubsQuery = trpc.clubs.list.useQuery({
    federationId: federation?.id,
    search: search || undefined,
    region: regionFilter === "all" ? undefined : regionFilter,
  });

  const clubs = clubsQuery.data ?? [];

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Search + Region */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4">
        <div
          className="flex-1 relative rounded-xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
        >
          <option value="all">All Regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Club grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <motion.div
            key={club.id}
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {club.logoUrl ? (
                  <img src={club.logoUrl} alt={club.name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <span className="text-xl font-serif text-white/70">{club.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-serif text-white truncate">{club.name}</h3>
                {club.region && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {club.city ? `${club.city}, ${club.region}` : club.region}
                  </div>
                )}
                {club.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{club.description}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {clubs.length === 0 && (
        <motion.p variants={fadeUp} className="text-center text-gray-500 py-12">
          No clubs found
        </motion.p>
      )}
    </motion.div>
  );
}
