#!/usr/bin/env node
/**
 * Build-time sitemap for the Cloudflare Worker SPA.
 *
 * Reads committed slug lists under scripts/data/ (exported from live Supabase).
 * Optional: set SITEMAP_SUPABASE_URL + SITEMAP_SUPABASE_ANON_KEY to refresh
 * federation/news/athlete slugs from the public REST API before writing.
 *
 * Output: client/public/sitemap.xml (served as a static asset).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const OUT = path.join(ROOT, "client/public/sitemap.xml");
const ORIGIN = "https://sports.com.na";

const STATIC_ROUTES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/events", changefreq: "daily", priority: "0.9" },
  { loc: "/news", changefreq: "daily", priority: "0.9" },
  { loc: "/map", changefreq: "weekly", priority: "0.7" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.4" },
  { loc: "/terms", changefreq: "yearly", priority: "0.4" },
  // /live omitted while inventory is VOD-only (route remains reachable)
];

function readSlugFile(name) {
  const file = path.join(DATA_DIR, name);
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(raw.slugs) ? raw.slugs.filter(Boolean) : [];
}

async function fetchSlugsFromSupabase() {
  const url = process.env.SITEMAP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SITEMAP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  async function page(table, select, filter) {
    const endpoint = new URL(`/rest/v1/${table}`, url);
    endpoint.searchParams.set("select", select);
    for (const [k, v] of Object.entries(filter)) {
      endpoint.searchParams.set(k, v);
    }
    endpoint.searchParams.set("order", "slug.asc");
    endpoint.searchParams.set("limit", "1000");
    const res = await fetch(endpoint, { headers });
    if (!res.ok) {
      throw new Error(`${table} fetch failed: ${res.status} ${await res.text()}`);
    }
    const rows = await res.json();
    return rows.map((r) => r.slug).filter(Boolean);
  }

  const [federations, news, athletes, events, clubs] = await Promise.all([
    page("sportsplatform_federations", "slug", {
      is_active: "eq.true",
      slug: "not.is.null",
    }),
    page("sportsplatform_news_articles", "slug", {
      is_published: "eq.true",
      slug: "not.is.null",
    }),
    page("sportsplatform_athletes", "slug", {
      is_active: "eq.true",
      slug: "not.is.null",
    }),
  ]);

  return { federations, news, athletes, events, clubs };
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(`${ORIGIN}${loc}`)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildXml({ federations, news, athletes, events, clubs }) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const route of STATIC_ROUTES) {
    lines.push(urlEntry(route.loc, route.changefreq, route.priority));
  }
  for (const slug of federations) {
    lines.push(urlEntry(`/federation/${slug}`, "weekly", "0.8"));
  }
  for (const slug of news) {
    lines.push(urlEntry(`/news/${slug}`, "weekly", "0.6"));
  }
  for (const slug of athletes) {
    lines.push(urlEntry(`/athletes/${slug}`, "monthly", "0.5"));
  }
  for (const slug of events) {
    lines.push(urlEntry(`/events/${slug}`, "weekly", "0.6"));
  }
  for (const slug of clubs) {
    lines.push(urlEntry(`/clubs/${slug}`, "monthly", "0.5"));
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

async function main() {
  let federations = readSlugFile("federation-slugs.json");
  let news = readSlugFile("news-slugs.json");
  let athletes = readSlugFile("athlete-slugs.json");
  let events = readSlugFile("event-slugs.json");
  let clubs = readSlugFile("club-slugs.json");
  let source = "committed scripts/data/*-slugs.json";

  try {
    const live = await fetchSlugsFromSupabase();
    if (live) {
      federations = live.federations;
      news = live.news;
      athletes = live.athletes;
      source = "Supabase REST (env)";
      fs.writeFileSync(
        path.join(DATA_DIR, "federation-slugs.json"),
        JSON.stringify(
          {
            generatedFrom: "sportsplatform_federations where is_active=true",
            count: federations.length,
            slugs: federations,
          },
          null,
          2
        ) + "\n"
      );
      fs.writeFileSync(
        path.join(DATA_DIR, "news-slugs.json"),
        JSON.stringify(
          {
            generatedFrom: "sportsplatform_news_articles where is_published=true",
            count: news.length,
            slugs: news,
          },
          null,
          2
        ) + "\n"
      );
      fs.writeFileSync(
        path.join(DATA_DIR, "athlete-slugs.json"),
        JSON.stringify(
          {
            generatedFrom: "sportsplatform_athletes where is_active=true",
            count: athletes.length,
            slugs: athletes,
          },
          null,
          2
        ) + "\n"
      );
    }
  } catch (err) {
    console.warn("[generate-sitemap] live fetch skipped:", err.message);
  }

  if (!federations.length) {
    console.error("[generate-sitemap] no federation slugs — aborting");
    process.exit(1);
  }

  const xml = buildXml({ federations, news, athletes, events, clubs });
  fs.writeFileSync(OUT, xml);
  console.log(
    `[generate-sitemap] wrote ${OUT} (${federations.length} feds, ${news.length} news, ${athletes.length} athletes, ${events.length} events, ${clubs.length} clubs) via ${source}`
  );
}

main();
