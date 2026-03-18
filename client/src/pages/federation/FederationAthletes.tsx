import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

export default function FederationAthletes() {
  const { federation } = useFederation();
  const [search, setSearch] = useState("");

  const athletesQuery = trpc.athletes.list.useQuery({
    federationId: federation?.id,
    search: search || undefined,
  });

  const athletes = athletesQuery.data ?? [];

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Search */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-xl overflow-hidden max-w-md"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search athletes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
        />
      </motion.div>

      {/* Athlete grid - client-side filter by name if backend doesn't support search */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(search
          ? athletes.filter((a) => {
              const name = `${a.firstName} ${a.lastName}`.toLowerCase();
              return name.includes(search.toLowerCase());
            })
          : athletes
        ).map((athlete) => (
          <motion.div
            key={athlete.id}
            variants={fadeUp}
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              {athlete.photoUrl ? (
                <img src={athlete.photoUrl} alt={`${athlete.firstName} ${athlete.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-serif text-white/70">
                  {athlete.firstName.charAt(0)}
                  {athlete.lastName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif text-white">
                {athlete.firstName} {athlete.lastName}
              </h3>
              {athlete.achievements && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{athlete.achievements}</p>
              )}
              {athlete.currentRanking != null && (
                <p className="text-xs text-gray-400 mt-1">Rank #{athlete.currentRanking}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {athletes.length === 0 && (
        <motion.p variants={fadeUp} className="text-center text-gray-500 py-12">
          No athletes found
        </motion.p>
      )}
    </motion.div>
  );
}
