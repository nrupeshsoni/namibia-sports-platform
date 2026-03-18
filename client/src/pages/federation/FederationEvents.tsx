import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

const EVENT_TYPES = ["all", "competition", "tournament", "training", "workshop", "meeting", "other"] as const;

export default function FederationEvents() {
  const { federation } = useFederation();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const eventsQuery = trpc.events.list.useQuery({
    federationId: federation?.id,
    upcoming: true,
  });

  const events = (eventsQuery.data ?? []).filter(
    (e) => typeFilter === "all" || e.type === typeFilter
  );

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Filter */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize"
            style={{
              background: typeFilter === t
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.6))"
                : "rgba(255, 255, 255, 0.05)",
              border: typeFilter === t ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          >
            {t}
          </button>
        ))}
      </motion.div>

      {/* Event cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={fadeUp}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="aspect-video bg-gray-800/50 flex items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-600" />
            </div>
            <div className="p-6">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(239, 68, 68, 0.3)", color: "#FCA5A5" }}
              >
                {event.type}
              </span>
              <h3 className="text-xl font-serif text-white mt-2 mb-3">{event.name}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400" />
                  {event.startDate
                    ? new Date(event.startDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {event.location}
                  </div>
                )}
              </div>
              {event.description && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{event.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <motion.p variants={fadeUp} className="text-center text-gray-500 py-12">
          No events found
        </motion.p>
      )}
    </motion.div>
  );
}
