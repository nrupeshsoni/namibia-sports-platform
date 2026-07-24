import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SiteLegalFooter } from "@/components/SiteLegalFooter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { MapRegionPanel } from "@/components/MapRegionPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ALL_REGIONS,
  NAMIBIA_CENTER,
  NAMIBIA_REGION_COORDS,
  asList,
  normalizeRegionName,
  regionFromSearch,
} from "@/lib/mapRegions";

import "leaflet/dist/leaflet.css";

/** Keep the address bar in sync so region filters are shareable. */
function syncRegionQuery(region: string | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (region) url.searchParams.set("region", region);
  else url.searchParams.delete("region");
  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (next !== current) {
    window.history.replaceState(null, "", next);
  }
}

/** Div-icon markers (avoids Leaflet default-image path issues under Vite). */
function createIcon(color: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || map.getContainer() == null) return;
    try {
      map.flyTo(center, 8, { duration: 0.8 });
    } catch {
      // Map may already be torn down during route transitions / Suspense remounts
    }
  }, [map, center]);
  return null;
}

function MapScreen() {
  const { theme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(() =>
    typeof window !== "undefined" ? regionFromSearch(window.location.search) : null,
  );
  const [showRegionFilter, setShowRegionFilter] = useState(false);
  /** Defer Leaflet until after mount — avoids Suspense remount "already initialized" crashes. */
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    setLeafletReady(true);
  }, []);

  useEffect(() => {
    syncRegionQuery(selectedRegion);
  }, [selectedRegion]);

  const venuesQuery = trpc.venues.list.useQuery({
    region: selectedRegion ?? undefined,
    limit: 200,
  });
  const eventsQuery = trpc.events.list.useQuery({
    region: selectedRegion ?? undefined,
    upcoming: true,
    limit: 20,
  });

  const venues = asList(venuesQuery.data);
  const events = asList(eventsQuery.data);

  const regionStats = useMemo(() => {
    const byRegion: Record<string, { venues: number; events: number }> = {};
    for (const r of ALL_REGIONS) byRegion[r] = { venues: 0, events: 0 };
    for (const v of venues) {
      const r = normalizeRegionName(v.region ?? "Khomas");
      if (r in byRegion) byRegion[r].venues += 1;
    }
    for (const e of events) {
      const r = normalizeRegionName(e.region ?? "Khomas");
      if (r in byRegion) byRegion[r].events += 1;
    }
    return byRegion;
  }, [venues, events]);

  const mapCenter: [number, number] = selectedRegion
    ? (NAMIBIA_REGION_COORDS[selectedRegion] ?? NAMIBIA_CENTER)
    : NAMIBIA_CENTER;

  const selectRegion = (region: string | null) => {
    setSelectedRegion(region);
    setShowRegionFilter(false);
  };

  return (
    <div className="min-h-screen theme-page">
      <header className="fixed top-0 left-0 right-0 z-[1000] theme-chrome border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2 min-h-[44px]">
          <Link href="/">
            <span
              className="font-serif tracking-wider cursor-pointer hover:text-red-500 transition-colors text-sm sm:text-base"
              style={{ color: "var(--chrome-fg)" }}
            >
              ← NAMIBIA SPORTS
            </span>
          </Link>
          <p className="text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em]" style={{ color: "var(--chrome-muted)" }}>
            INTERACTIVE MAP
          </p>
          <ThemeToggle />
        </div>
      </header>

      {/* Stack on mobile so the region panel does not crush the map */}
      <div className="pt-[72px] h-[calc(100vh-72px)] flex flex-col md:flex-row">
        <div className="flex-1 relative min-h-[45vh] md:min-h-0">
          {!leafletReady ? (
            <div className="h-full w-full flex items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <MapContainer
              key="namibia-sports-map"
              center={NAMIBIA_CENTER}
              zoom={6}
              className="h-full w-full z-0"
              zoomControl={false}
            >
              <TileLayer
                key={theme}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={
                  theme === "light"
                    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                }
              />
              <ZoomControl position="bottomright" />
              {ALL_REGIONS.map((region) => {
                const coords = NAMIBIA_REGION_COORDS[region];
                if (!coords) return null;
                const isSelected = selectedRegion === region;
                return (
                  <Marker
                    key={region}
                    position={coords}
                    icon={createIcon(isSelected ? "#EF4444" : "#10B981")}
                    eventHandlers={{ click: () => setSelectedRegion(region) }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong className="text-gray-900">{region}</strong>
                        <p className="text-gray-600 mt-1">
                          {regionStats[region]?.venues ?? 0} venues,{" "}
                          {regionStats[region]?.events ?? 0} events
                        </p>
                        <button
                          type="button"
                          className="mt-2 text-red-500 text-xs font-medium"
                          onClick={() => setSelectedRegion(region)}
                        >
                          Filter by region
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              {selectedRegion ? <MapCenterController center={mapCenter} /> : null}
            </MapContainer>
          )}
        </div>

        <MapRegionPanel
          selectedRegion={selectedRegion}
          showRegionFilter={showRegionFilter}
          onToggleFilter={() => setShowRegionFilter((o) => !o)}
          onSelectRegion={selectRegion}
          venuesLoading={venuesQuery.isLoading}
          eventsLoading={eventsQuery.isLoading}
          venues={venues}
          events={events}
        />
      </div>

      <SiteLegalFooter />
    </div>
  );
}

/** Page-level boundary so Leaflet remount failures do not blank the whole app shell. */
export default function Map() {
  return (
    <ErrorBoundary>
      <MapScreen />
    </ErrorBoundary>
  );
}
