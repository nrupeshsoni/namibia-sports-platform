"use client";

import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Calendar,
  Building2,
  Loader2,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp } from "@/lib/animations";

import "leaflet/dist/leaflet.css";

/** Approximate center coordinates for Namibia's 14 regions */
const NAMIBIA_REGION_COORDS: Record<string, [number, number]> = {
  Khomas: [-22.56, 17.07],
  Erongo: [-22.68, 14.53],
  Oshana: [-17.78, 15.7],
  Omusati: [-18.11, 14.84],
  Ohangwena: [-17.43, 16.84],
  Oshikoto: [-18.62, 16.93],
  "Kavango East": [-17.91, 19.72],
  "Kavango West": [-17.9, 18.43],
  Zambezi: [-17.5, 24.3],
  Kunene: [-19.38, 13.85],
  Otjozondjupa: [-20.44, 17.08],
  Omaheke: [-21.85, 19.4],
  Hardap: [-24.02, 17.92],
  Karas: [-26.58, 18.14],
};

const NAMIBIA_CENTER: [number, number] = [-22.0, 17.5];
const ALL_REGIONS = Object.keys(NAMIBIA_REGION_COORDS);

/** Fix for default marker icon in Vite/React */
const createIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 8, { duration: 0.8 });
  }, [map, center]);
  return null;
}

export default function Map() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const venuesQuery = trpc.venues.list.useQuery({
    region: selectedRegion ?? undefined,
  });
  const eventsQuery = trpc.events.list.useQuery({
    region: selectedRegion ?? undefined,
    upcoming: true,
    limit: 20,
  });

  const venues = venuesQuery.data ?? [];
  const events = eventsQuery.data ?? [];

  const regionStats = useMemo(() => {
    const byRegion: Record<string, { venues: number; events: number }> = {};
    for (const r of ALL_REGIONS) byRegion[r] = { venues: 0, events: 0 };
    venues.forEach((v) => {
      const r = v.region ?? "Khomas";
      if (r in byRegion) byRegion[r].venues += 1;
    });
    events.forEach((e) => {
      const r = (e as { region?: string }).region ?? "Khomas";
      if (r in byRegion) byRegion[r].events += 1;
    });
    return byRegion;
  }, [venues, events]);

  /** Show markers for all regions; highlight those with venues/events */
  const markers = ALL_REGIONS;

  const mapCenter: [number, number] = selectedRegion
    ? NAMIBIA_REGION_COORDS[selectedRegion] ?? NAMIBIA_CENTER
    : NAMIBIA_CENTER;

  const formatDate = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-NA", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-[1000]"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-white font-serif tracking-wider cursor-pointer hover:text-red-400 transition-colors">
              ← NAMIBIA SPORTS
            </span>
          </Link>
          <p className="text-sm tracking-[0.2em] text-gray-400">INTERACTIVE MAP</p>
        </div>
      </header>

      <div className="pt-[72px] h-[calc(100vh-72px)] flex">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={NAMIBIA_CENTER}
            zoom={6}
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            {markers.map((region) => {
              const coords = NAMIBIA_REGION_COORDS[region];
              if (!coords) return null;
              const isSelected = selectedRegion === region;
              return (
                <Marker
                  key={region}
                  position={coords}
                  icon={createIcon(isSelected ? "#EF4444" : "#10B981")}
                  eventHandlers={{
                    click: () => setSelectedRegion(region),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-gray-900">{region}</strong>
                      <p className="text-gray-600 mt-1">
                        {regionStats[region]?.venues ?? 0} venues,{" "}
                        {regionStats[region]?.events ?? 0} events
                      </p>
                      <button
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
            {selectedRegion && <MapCenterController center={mapCenter} />}
          </MapContainer>

          {/* Leaflet zoom control - glass styled */}
          <div
            className="absolute bottom-6 right-6 z-[1000] rounded-xl overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="leaflet-control leaflet-control-zoom leaflet-bar !border-0 !m-0">
              {/* Zoom is handled by MapContainer */}
            </div>
          </div>
        </div>

        {/* Side panel - glassmorphism */}
        <aside
          className="w-full md:w-[380px] flex-shrink-0 overflow-y-auto border-l border-white/10"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-serif text-white mb-4">Region Filter</h2>

            {/* Region dropdown */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowRegionFilter(!showRegionFilter)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <span className="text-white">
                  {selectedRegion ?? "All regions"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showRegionFilter ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showRegionFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden max-h-64 overflow-y-auto z-50"
                  style={{
                    background: "rgba(0, 0, 0, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedRegion(null);
                      setShowRegionFilter(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    All regions
                  </button>
                  {ALL_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRegion(r);
                        setShowRegionFilter(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Venues */}
            <h3 className="text-sm tracking-[0.2em] text-red-400 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> VENUES
            </h3>
            {venuesQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : venues.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                No venues in this region
              </p>
            ) : (
              <div className="space-y-2 mb-6">
                {venues.map((v) => (
                  <motion.div
                    key={v.id}
                    variants={fadeUp}
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <p className="text-white font-medium">{v.name}</p>
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

            {/* Events */}
            <h3 className="text-sm tracking-[0.2em] text-blue-400 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> UPCOMING EVENTS
            </h3>
            {eventsQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                No upcoming events in this region
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((evt) => (
                  <Link key={evt.id} href={`/events${evt.slug ? `?slug=${evt.slug}` : ""}`}>
                    <motion.div
                      variants={fadeUp}
                      className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <p className="text-white font-medium line-clamp-2">
                        {evt.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(evt.startDate)}
                        {(evt.location || evt.region) && (
                          <span className="ml-2">
                            • {evt.location || evt.region}
                          </span>
                        )}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
