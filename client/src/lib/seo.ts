/**
 * Lightweight document head manager for SPA SEO / AIO.
 * No react-helmet — mutates title, meta, link, and JSON-LD script tags.
 */

export const SITE_ORIGIN = "https://sports.com.na";
export const SITE_NAME = "sports.com.na";
export const DEFAULT_TITLE = "Namibia Sports Platform";
export const DEFAULT_DESCRIPTION =
  "Namibia's sports directory — federations, events, news, clubs, and athletes. Coverage grows federation by federation.";
export const DEFAULT_IMAGE = `${SITE_ORIGIN}/sports/football-action.jpg`;

const JSON_LD_ATTR = "data-seo-jsonld";

export type SeoMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

/** Resolve relative asset paths to absolute URLs for OG/JSON-LD. */
export function absoluteUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${path}`;
}

function ensureMeta(attr: "name" | "property", key: string): HTMLMetaElement {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

function ensureLink(rel: string): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

/** Apply document title + description + Open Graph / Twitter tags. */
export function applySeo(meta: SeoMeta): void {
  const title = meta.title.includes(SITE_NAME)
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const url = absoluteUrl(meta.path || "/");
  const image = absoluteUrl(meta.image || DEFAULT_IMAGE);
  const ogType = meta.type ?? "website";

  document.title = title;
  ensureMeta("name", "description").setAttribute("content", description);
  ensureMeta("name", "robots").setAttribute(
    "content",
    meta.noIndex ? "noindex,nofollow" : "index,follow"
  );

  ensureMeta("property", "og:type").setAttribute("content", ogType);
  ensureMeta("property", "og:site_name").setAttribute("content", SITE_NAME);
  ensureMeta("property", "og:title").setAttribute("content", title);
  ensureMeta("property", "og:description").setAttribute("content", description);
  ensureMeta("property", "og:url").setAttribute("content", url);
  ensureMeta("property", "og:image").setAttribute("content", image);

  ensureMeta("name", "twitter:card").setAttribute("content", "summary_large_image");
  ensureMeta("name", "twitter:title").setAttribute("content", title);
  ensureMeta("name", "twitter:description").setAttribute("content", description);
  ensureMeta("name", "twitter:image").setAttribute("content", image);

  ensureLink("canonical").setAttribute("href", url);
}

/** Replace all SEO JSON-LD script tags with the given graphs. */
export function setJsonLd(graphs: Record<string, unknown>[]): void {
  document.head
    .querySelectorAll(`script[${JSON_LD_ATTR}]`)
    .forEach((node) => node.remove());

  for (const graph of graphs) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(JSON_LD_ATTR, "true");
    script.textContent = JSON.stringify(graph);
    document.head.appendChild(script);
  }
}

export function clearJsonLd(): void {
  setJsonLd([]);
}

/** WebSite + SearchAction for the homepage (answer-engine friendly). */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DEFAULT_TITLE,
    url: SITE_ORIGIN,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: DEFAULT_TITLE,
      url: SITE_ORIGIN,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type FederationSeoInput = {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  backgroundImage?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  email?: string | null;
  type?: string | null;
  abbreviation?: string | null;
};

/** SportsOrganization / Organization JSON-LD for a federation page. */
export function buildFederationJsonLd(fed: FederationSeoInput): Record<string, unknown> {
  const sameAs = [fed.website, fed.facebook, fed.instagram, fed.twitter, fed.youtube].filter(
    (u): u is string => Boolean(u && /^https?:\/\//i.test(u))
  );
  const orgType =
    fed.type === "federation" || fed.type === "umbrella"
      ? "SportsOrganization"
      : "Organization";

  return {
    "@context": "https://schema.org",
    "@type": orgType,
    name: fed.name,
    alternateName: fed.abbreviation || undefined,
    url: `${SITE_ORIGIN}/federation/${fed.slug}`,
    description: fed.description || undefined,
    logo: fed.logo ? absoluteUrl(fed.logo) : undefined,
    image: absoluteUrl(fed.backgroundImage || fed.logo || DEFAULT_IMAGE),
    email: fed.email || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    areaServed: { "@type": "Country", name: "Namibia" },
    parentOrganization: {
      "@type": "Organization",
      name: DEFAULT_TITLE,
      url: SITE_ORIGIN,
    },
  };
}

export type NewsSeoInput = {
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | Date | null;
  category?: string | null;
};

function toIso(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** NewsArticle JSON-LD for a news article route. */
export function buildNewsArticleJsonLd(article: NewsSeoInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || undefined,
    image: absoluteUrl(article.featuredImage || DEFAULT_IMAGE),
    datePublished: toIso(article.publishedAt),
    articleSection: article.category || undefined,
    mainEntityOfPage: `${SITE_ORIGIN}/news/${article.slug}`,
    url: `${SITE_ORIGIN}/news/${article.slug}`,
    author: { "@type": "Organization", name: DEFAULT_TITLE, url: SITE_ORIGIN },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_TITLE,
      url: SITE_ORIGIN,
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/icons/icon-192.png` },
    },
  };
}

export type SportsEventSeoInput = {
  name: string;
  description?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  location?: string | null;
  slug?: string | null;
  posterUrl?: string | null;
};

/** SportsEvent JSON-LD (single event or ItemList of events). */
export function buildSportsEventJsonLd(
  events: SportsEventSeoInput[]
): Record<string, unknown> | null {
  if (!events.length) return null;
  const items = events.slice(0, 12).map((ev, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "SportsEvent",
      name: ev.name,
      description: ev.description || undefined,
      startDate: toIso(ev.startDate),
      endDate: toIso(ev.endDate),
      image: ev.posterUrl ? absoluteUrl(ev.posterUrl) : undefined,
      url: `${SITE_ORIGIN}/events`,
      location: ev.location
        ? {
            "@type": "Place",
            name: ev.location,
            address: { "@type": "PostalAddress", addressCountry: "NA" },
          }
        : undefined,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: { "@type": "Organization", name: DEFAULT_TITLE, url: SITE_ORIGIN },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming sports events in Namibia",
    itemListElement: items,
  };
}

export type AthleteSeoInput = {
  firstName?: string | null;
  lastName?: string | null;
  slug: string;
  achievements?: string | null;
  photoUrl?: string | null;
  federationName?: string | null;
};

/** Person JSON-LD for athlete profiles. */
export function buildAthleteJsonLd(athlete: AthleteSeoInput): Record<string, unknown> {
  const name = [athlete.firstName, athlete.lastName].filter(Boolean).join(" ") || athlete.slug;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${SITE_ORIGIN}/athletes/${athlete.slug}`,
    description: athlete.achievements || undefined,
    image: athlete.photoUrl ? absoluteUrl(athlete.photoUrl) : undefined,
    nationality: { "@type": "Country", name: "Namibia" },
    memberOf: athlete.federationName
      ? { "@type": "SportsOrganization", name: athlete.federationName }
      : undefined,
  };
}

/** Truncate meta descriptions to a safe length. */
export function truncateMeta(text: string, max = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}
