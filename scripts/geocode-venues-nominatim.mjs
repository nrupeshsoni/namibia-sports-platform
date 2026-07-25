/**
 * One-shot Nominatim geocode for sportsplatform_venues missing lat/lng.
 * Respects OSM Nominatim usage policy: 1 req/sec, identifying User-Agent.
 * Does not write to DB — prints JSON for review + SQL updates.
 *
 * Usage: node scripts/geocode-venues-nominatim.mjs
 */

const USER_AGENT =
  "NamibiaSportsPlatform/1.0 (venue-geocode; https://sports.com.na; contact: admin@sports.com.na)";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const DELAY_MS = 1100;

/** Namibia approximate bounds (reject out-of-country hits). */
const NA_BOUNDS = { minLat: -29.0, maxLat: -16.9, minLng: 11.5, maxLng: 25.5 };

/** Curated coords from well-known public map pins (OSM / stadium pages) — used only when Nominatim misses. */
/** Fallback only when live Nominatim miss — verified OSM feature pins. */
const CURATED = {
  6: { lat: -22.6406, lng: 14.5789, source: "curated:Rossmund Golf Course OSM" },
  8: { lat: -22.6141947, lng: 17.0883911, source: "curated:SKW Sport Klub Windhoek OSM" },
  23: { lat: -22.6094316, lng: 17.0948584, source: "curated:Olympia swimming pool OSM" },
  28: { lat: -17.9239442, lng: 19.7728462, source: "curated:Rundu Stadium OSM" },
  36: { lat: -22.1112458, lng: 14.2789585, source: "curated:Henties Bay Golf Course OSM" },
  40: { lat: -22.7142, lng: 17.0611, source: "curated:Omeya Golf Estate OSM" },
};

const VENUES = [
  { id: 1, name: "The Dome Swakopmund", address: "Swakopmund", city: "Swakopmund", region: "Erongo" },
  { id: 2, name: "Namibia Cricket Ground", address: "Cricket Street, Olympia", city: "Windhoek", region: "Khomas" },
  { id: 3, name: "Hage Geingob Stadium", address: "Lichtenstein Street, Olympia", city: "Windhoek", region: "Khomas" },
  { id: 4, name: "Independence Stadium", address: "Independence Avenue", city: "Windhoek", region: "Khomas" },
  { id: 5, name: "Sam Nujoma Stadium", address: "Katutura", city: "Windhoek", region: "Khomas" },
  { id: 6, name: "Rossmund Desert Golf Course", address: "Swakopmund", city: "Swakopmund", region: "Erongo" },
  { id: 7, name: "Windhoek Country Club", address: "Western Bypass", city: "Windhoek", region: "Khomas" },
  { id: 8, name: "SKW Sports Complex", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 9, name: "Vegkop Athletics Stadium", address: null, city: "Windhoek", region: "Khomas" },
  { id: 10, name: "High Performance Oval", address: null, city: "Windhoek", region: "Khomas" },
  { id: 11, name: "Walvis Bay HS Rugby Ground", address: null, city: "Walvis Bay", region: "Erongo" },
  { id: 12, name: "Ongwediva Multi-Sport Centre", address: null, city: "Ongwediva", region: "Oshana" },
  { id: 13, name: "Tsumeb Sports Complex", address: null, city: "Tsumeb", region: "Oshikoto" },
  { id: 14, name: "Mariental Sports Grounds", address: null, city: "Mariental", region: "Hardap" },
  { id: 15, name: "Swakopmund Beach Courts", address: null, city: "Swakopmund", region: "Erongo" },
  { id: 16, name: "DTS Sports Grounds", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 17, name: "NUST Sports Grounds", address: "NUST Campus, Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 18, name: "UNAM Sports Grounds", address: "UNAM Main Campus, Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 19, name: "Wanderers Sports Club", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 20, name: "Ramblers Club", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 21, name: "Keetmanshoop Sports Complex", address: "Keetmanshoop", city: "Keetmanshoop", region: "Karas" },
  { id: 22, name: "Khomasdal Stadium", address: "Khomasdal, Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 23, name: "Olympia Aquatic Centre", address: "Olympia, Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 24, name: "Kuisebmond Stadium", address: "Kuisebmond, Walvis Bay", city: "Walvis Bay", region: "Erongo" },
  { id: 25, name: "Gobabis Sports Grounds", address: "Gobabis", city: "Gobabis", region: "Omaheke" },
  { id: 26, name: "Oshakati Independence Stadium", address: "Oshakati", city: "Oshakati", region: "Oshana" },
  { id: 27, name: "Vineta Sports Grounds", address: "Vineta, Swakopmund", city: "Swakopmund", region: "Erongo" },
  { id: 28, name: "Rundu Sports Stadium", address: "Rundu", city: "Rundu", region: "Kavango East" },
  { id: 29, name: "Windhoek Tennis Centre", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 30, name: "Outapi Sports Field", address: "Outapi", city: "Outapi", region: "Omusati" },
  { id: 31, name: "Tony Rust Raceway", address: "Windhoek", city: "Windhoek", region: "Khomas" },
  { id: 32, name: "Grootfontein Sports Complex", address: "Grootfontein", city: "Grootfontein", region: "Otjozondjupa" },
  { id: 33, name: "Rehoboth Stadium", address: "Rehoboth", city: "Rehoboth", region: "Hardap" },
  { id: 34, name: "Lüderitz Sports Stadium", address: "Lüderitz", city: "Lüderitz", region: "Karas" },
  { id: 35, name: "Paresis Park Sports Fields", address: "Paresis Park, Otjiwarongo", city: "Otjiwarongo", region: "Otjozondjupa" },
  { id: 36, name: "Henties Bay Golf Club", address: "Henties Bay", city: "Henties Bay", region: "Erongo" },
  { id: 37, name: "Swakopmund Sports Stadium", address: "Swakopmund", city: "Swakopmund", region: "Erongo" },
  { id: 38, name: "Katima Mulilo Sports Complex", address: "Katima Mulilo", city: "Katima Mulilo", region: "Zambezi" },
  { id: 39, name: "Eenhana Sports Grounds", address: "Eenhana", city: "Eenhana", region: "Ohangwena" },
  { id: 40, name: "Omeya Golf Estate", address: "Omeya, Windhoek area", city: "Windhoek", region: "Khomas" },
  { id: 41, name: "Mokati Stadium", address: "Orwetoveni, Otjiwarongo", city: "Otjiwarongo", region: "Otjozondjupa" },
  { id: 42, name: "Okahandja Sports Grounds", address: "Okahandja", city: "Okahandja", region: "Otjozondjupa" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function inNamibia(lat, lng) {
  return (
    lat >= NA_BOUNDS.minLat &&
    lat <= NA_BOUNDS.maxLat &&
    lng >= NA_BOUNDS.minLng &&
    lng <= NA_BOUNDS.maxLng
  );
}

function normalize(s) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function significantTokens(name) {
  const stop = new Set([
    "the",
    "sports",
    "sport",
    "grounds",
    "ground",
    "stadium",
    "complex",
    "centre",
    "center",
    "club",
    "field",
    "fields",
    "park",
    "multi",
    "namibia",
  ]);
  return normalize(name)
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stop.has(t));
}

function nameMatches(venueName, displayName) {
  const tokens = significantTokens(venueName);
  if (tokens.length === 0) return false;
  const hay = normalize(displayName);
  const hit = tokens.filter((t) => hay.includes(t)).length;
  return hit >= Math.min(2, tokens.length) || (tokens.length === 1 && hit === 1);
}

function isSpecificFeature(hit) {
  const cls = hit.class;
  const type = hit.type;
  if (cls === "leisure" || cls === "sport" || cls === "amenity") return true;
  if (cls === "tourism" && (type === "attraction" || type === "yes")) return true;
  if (cls === "building") return true;
  if (type === "stadium" || type === "pitch" || type === "sports_centre" || type === "golf_course")
    return true;
  if (cls === "highway" && type === "raceway") return true;
  return false;
}

function isCityOnly(hit) {
  return (
    (hit.class === "place" &&
      ["city", "town", "village", "suburb", "hamlet", "municipality"].includes(hit.type)) ||
    (hit.class === "boundary" && hit.type === "administrative")
  );
}

async function nominatimSearch(q) {
  const url = new URL(NOMINATIM);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "na");
  // Viewbox: Namibia bias (left,top,right,bottom)
  url.searchParams.set("viewbox", "11.5,-16.9,25.5,-29.0");
  url.searchParams.set("bounded", "0");

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Nominatim ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function pickResult(venue, results) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const scored = [];
  for (const hit of results) {
    const lat = parseFloat(hit.lat);
    const lng = parseFloat(hit.lon);
    if (!inNamibia(lat, lng)) continue;
    const country = hit.address?.country_code?.toLowerCase();
    if (country && country !== "na") continue;

    let score = 0;
    const matched = nameMatches(venue.name, hit.display_name ?? hit.name ?? "");
    if (matched) score += 50;
    if (isSpecificFeature(hit)) score += 40;
    if (isCityOnly(hit)) score -= 60;
    if (hit.importance) score += Math.min(20, hit.importance * 20);

    // Prefer city match in address
    const cityNorm = normalize(venue.city);
    const addrCity = normalize(
      hit.address?.city || hit.address?.town || hit.address?.village || hit.address?.suburb || "",
    );
    if (cityNorm && addrCity && (addrCity.includes(cityNorm) || cityNorm.includes(addrCity))) {
      score += 15;
    }

    scored.push({ hit, lat, lng, score, matched });
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;

  // Require either a specific feature match OR a strong name match — never city-only pins
  if (isCityOnly(best.hit) && !best.matched) return null;
  if (best.score < 40) return null;
  if (isCityOnly(best.hit) && best.score < 70) return null;

  return {
    lat: best.lat,
    lng: best.lng,
    display: best.hit.display_name,
    class: best.hit.class,
    type: best.hit.type,
    score: best.score,
    osm_id: best.hit.osm_id,
  };
}

async function geocodeVenue(venue) {
  const queries = [
    `${venue.name}, ${venue.city}, Namibia`,
    venue.address && venue.address !== venue.city
      ? `${venue.name}, ${venue.address}, ${venue.city}, Namibia`
      : null,
    `${venue.name}, Namibia`,
  ].filter(Boolean);

  for (const q of queries) {
    const results = await nominatimSearch(q);
    await sleep(DELAY_MS);
    const picked = pickResult(venue, results);
    if (picked) {
      return { ...picked, query: q, source: "nominatim" };
    }
  }
  return null;
}

async function main() {
  const results = [];
  for (const venue of VENUES) {
    process.stderr.write(`Geocoding #${venue.id} ${venue.name}...\n`);
    let geo = null;
    try {
      geo = await geocodeVenue(venue);
    } catch (err) {
      process.stderr.write(`  ERROR: ${err.message}\n`);
    }

    if (!geo && CURATED[venue.id]) {
      const c = CURATED[venue.id];
      geo = {
        lat: c.lat,
        lng: c.lng,
        display: venue.name,
        class: "curated",
        type: "manual",
        score: 100,
        query: "curated",
        source: c.source,
      };
      process.stderr.write(`  CURATED fallback\n`);
    }

    if (geo) {
      process.stderr.write(`  OK ${geo.lat},${geo.lng} (${geo.source}) score=${geo.score}\n`);
      results.push({ id: venue.id, name: venue.name, status: "ok", ...geo });
    } else {
      process.stderr.write(`  SKIP (unsure)\n`);
      results.push({ id: venue.id, name: venue.name, status: "skip", reason: "no confident match" });
    }
  }

  const ok = results.filter((r) => r.status === "ok");
  const skip = results.filter((r) => r.status === "skip");

  const out = {
    generatedAt: new Date().toISOString(),
    policy: "Nominatim 1 req/sec + User-Agent; leave null if unsure",
    geocoded: ok.length,
    skipped: skip.length,
    results,
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
