import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, Calendar, Building2, Loader2 } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { ALL_REGIONS } from "@/lib/mapRegions";

type VenueRow = {
  id: number;
  name: string;
  city: string | null;
  region: string | null;
};

type EventRow = {
  id: number;
  name: string;
  slug: string | null;
  startDate: Date | string | null;
  location: string | null;
  region: string | null;
};

type MapRegionPanelProps = {
  selectedRegion: string | null;
  showRegionFilter: boolean;
  onToggleFilter: () => void;
  onSelectRegion: (region: string | null) => void;
  venuesLoading: boolean;
  eventsLoading: boolean;
  venues: VenueRow[];
  events: EventRow[];
};

function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Side panel: region dropdown + venues/events lists for the Map page. */
export function MapRegionPanel({
  selectedRegion,
  showRegionFilter,
  onToggleFilter,
  onSelectRegion,
  venuesLoading,
  eventsLoading,
  venues,
  events,
}: MapRegionPanelProps) {
  return (
    <aside
      className="w-full md:w-[380px] flex-shrink-0 overflow-y-auto max-h-[50vh] md:max-h-none border-t md:border-t-0 md:border-l"
      style={{
        background: "var(--chrome-bg)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--chrome-border)",
        color: "var(--chrome-fg)",
      }}
    >
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-serif mb-4" style={{ color: "var(--chrome-fg)" }}>
          Region Filter
        </h2>

        <div className="relative mb-6">
          <button
            type="button"
            onClick={onToggleFilter}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left min-h-[44px]"
            style={{
              background: "var(--chrome-btn-bg)",
              border: "1px solid var(--chrome-border)",
            }}
          >
            <span style={{ color: "var(--chrome-fg)" }}>
              {selectedRegion ?? "All regions"}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showRegionFilter ? "rotate-180" : ""
              }`}
              style={{ color: "var(--chrome-muted)" }}
            />
          </button>
          {showRegionFilter && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden max-h-64 overflow-y-auto z-50"
              style={{
                background: "var(--drawer-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--chrome-border)",
              }}
            >
              <button
                type="button"
                onClick={() => onSelectRegion(null)}
                className="w-full px-4 py-3 text-left min-h-[44px] transition-colors"
                style={{ color: "var(--chrome-fg)" }}
              >
                All regions
              </button>
              {ALL_REGIONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => onSelectRegion(r)}
                  className="w-full px-4 py-3 text-left min-h-[44px] transition-colors"
                  style={{ color: "var(--chrome-muted)" }}
                >
                  {r}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <h3 className="text-sm tracking-[0.2em] text-red-400 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> VENUES
        </h3>
        {venuesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        ) : venues.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No venues in this region</p>
        ) : (
          <div className="space-y-2 mb-6">
            {venues.map((v) => (
              <motion.div
                key={v.id}
                variants={fadeUp}
                className="rounded-xl p-3"
                style={{
                  background: "var(--glass-surface)",
                  border: "1px solid var(--glass-surface-border)",
                }}
              >
                <p className="font-medium" style={{ color: "var(--chrome-fg)" }}>
                  {v.name}
                </p>
                {(v.city || v.region) && (
                  <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[v.city, v.region].filter(Boolean).join(", ")}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <h3 className="text-sm tracking-[0.2em] text-blue-400 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> UPCOMING EVENTS
        </h3>
        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No upcoming events in this region</p>
        ) : (
          <div className="space-y-2">
            {events.map((evt) => (
              <Link key={evt.id} href={`/events${evt.slug ? `?slug=${evt.slug}` : ""}`}>
                <motion.div
                  variants={fadeUp}
                  className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: "var(--glass-surface)",
                    border: "1px solid var(--glass-surface-border)",
                  }}
                >
                  <p className="font-medium line-clamp-2" style={{ color: "var(--chrome-fg)" }}>
                    {evt.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(evt.startDate)}
                    {(evt.location || evt.region) && (
                      <span className="ml-2">• {evt.location || evt.region}</span>
                    )}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
