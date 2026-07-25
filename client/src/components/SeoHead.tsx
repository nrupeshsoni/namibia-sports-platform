/**
 * Route-aware SEO / AIO head updates for Wouter navigations.
 * Static hubs use fixed copy; federation / news / athlete routes hydrate from tRPC.
 */
import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  applySeo,
  buildAthleteJsonLd,
  buildClubJsonLd,
  buildFederationJsonLd,
  buildNewsArticleJsonLd,
  buildSportsEventDetailJsonLd,
  buildSportsEventJsonLd,
  buildWebSiteJsonLd,
  clearJsonLd,
  setJsonLd,
  truncateMeta,
  type SeoMeta,
} from "@/lib/seo";

type StaticRoute = {
  match: (path: string) => boolean;
  meta: Omit<SeoMeta, "path">;
  jsonLd?: () => Record<string, unknown>[];
};

const STATIC_ROUTES: StaticRoute[] = [
  {
    match: (p) => p === "/",
    meta: {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    jsonLd: () => [buildWebSiteJsonLd()],
  },
  {
    match: (p) => p === "/events",
    meta: {
      title: "Sports Events in Namibia",
      description:
        "Competitions, tournaments, and workshops across Namibian sports federations — dates, venues, and regions.",
    },
  },
  {
    match: (p) => p === "/news",
    meta: {
      title: "Namibia Sports News",
      description:
        "Latest news from Namibia's sports federations, national teams, and development programmes.",
    },
  },
  {
    match: (p) => p === "/live",
    meta: {
      title: "Recent Coverage",
      description:
        "Recent video coverage from Namibian sports on sports.com.na.",
    },
  },
  {
    match: (p) => p === "/map",
    meta: {
      title: "Sports Map of Namibia",
      description:
        "Explore sports venues, clubs, and facilities across Namibia's 14 regions.",
    },
  },
  {
    match: (p) => p === "/privacy",
    meta: {
      title: "Privacy Policy",
      description: "How sports.com.na collects, uses, and protects personal information.",
      noIndex: false,
    },
  },
  {
    match: (p) => p === "/terms",
    meta: {
      title: "Terms of Use",
      description: "Terms governing use of the Namibia Sports Platform at sports.com.na.",
      noIndex: false,
    },
  },
  {
    match: (p) => p === "/login" || p.startsWith("/login/"),
    meta: {
      title: "Sign in",
      description: "Sign in to sports.com.na.",
      noIndex: true,
    },
  },
  {
    match: (p) => p === "/register" || p.startsWith("/register/"),
    meta: {
      title: "Create account",
      description: "Create a sports.com.na account.",
      noIndex: true,
    },
  },
  {
    match: (p) => p === "/admin" || p.startsWith("/admin/"),
    meta: {
      title: "Admin",
      description: "Platform administration.",
      noIndex: true,
    },
  },
];

function parseFederationSlug(path: string): string | null {
  const m = path.match(/^\/federation\/([^/]+)/);
  return m?.[1] ?? null;
}

function parseNewsSlug(path: string): string | null {
  const m = path.match(/^\/news\/([^/]+)/);
  return m?.[1] ?? null;
}

function parseAthleteSlug(path: string): string | null {
  const m = path.match(/^\/athletes\/([^/]+)/);
  return m?.[1] ?? null;
}

function federationTabLabel(path: string, slug: string): string {
  const base = `/federation/${slug}`;
  if (path === base || path === `${base}/`) return "";
  const segment = path.slice(base.length).replace(/^\//, "").split("/")[0];
  const labels: Record<string, string> = {
    events: "Events",
    clubs: "Clubs",
    athletes: "Athletes",
    news: "News",
    streams: "Streams",
    admin: "Admin",
  };
  return labels[segment] ?? "";
}

/** Applies document head SEO for the current Wouter location. */
export function SeoHead() {
  const [location] = useLocation();
  const path = location.split("?")[0] || "/";

  const fedSlug = parseFederationSlug(path);
  const newsSlug = parseNewsSlug(path);
  const athleteSlug = parseAthleteSlug(path);
  const eventSlug = parseEventSlug(path);
  const clubSlug = parseClubSlug(path);
  const isFedAdmin = Boolean(fedSlug && path.includes("/admin"));

  const federationQuery = trpc.federations.getBySlug.useQuery(
    { slug: fedSlug! },
    { enabled: Boolean(fedSlug) && !isFedAdmin }
  );
  const newsQuery = trpc.news.getBySlug.useQuery(
    { slug: newsSlug! },
    { enabled: Boolean(newsSlug) }
  );
  const athleteQuery = trpc.athletes.getBySlug.useQuery(
    { slug: athleteSlug! },
    { enabled: Boolean(athleteSlug) }
  );
  const eventsQuery = trpc.events.list.useQuery(
    { limit: 12 },
    { enabled: path === "/events" }
  );
  const eventDetailQuery = trpc.events.getBySlug.useQuery(
    { slug: eventSlug! },
    { enabled: Boolean(eventSlug) }
  );
  const clubDetailQuery = trpc.clubs.getBySlug.useQuery(
    { slug: clubSlug! },
    { enabled: Boolean(clubSlug) }
  );

  const staticRoute = useMemo(
    () => STATIC_ROUTES.find((r) => r.match(path)),
    [path]
  );

  useEffect(() => {
    if (fedSlug && !isFedAdmin) {
      const fed = federationQuery.data;
      if (federationQuery.isLoading || !fed) {
        soft404Seo({ title: "Federation", description: DEFAULT_DESCRIPTION, path });
        return;
      }
      const tab = federationTabLabel(path, fed.slug || fedSlug);
      const title = tab ? `${fed.name} — ${tab}` : fed.name;
      const description = truncateMeta(
        fed.description ||
          `${fed.name} on Namibia's national sports platform — events, clubs, athletes, and news.`
      );
      applySeo({
        title,
        description,
        path,
        image: fed.backgroundImage || fed.logo,
      });
      setJsonLd([
        buildFederationJsonLd({
          name: fed.name,
          slug: fed.slug || fedSlug,
          description: fed.description,
          logo: fed.logo,
          backgroundImage: fed.backgroundImage,
          website: fed.website,
          facebook: fed.facebook,
          instagram: fed.instagram,
          twitter: fed.twitter,
          youtube: fed.youtube,
          email: fed.email,
          type: fed.type,
          abbreviation: fed.abbreviation,
        }),
      ]);
      return;
    }

    if (newsSlug) {
      const article = newsQuery.data;
      if (newsQuery.isLoading || !article) {
        soft404Seo({ title: "News", description: "Namibia sports news on sports.com.na.", path });
        return;
      }
      applySeo({
        title: article.title,
        description: truncateMeta(
          article.summary || article.content || `${article.title} — Namibia sports news.`
        ),
        path,
        image: article.featuredImage,
        type: "article",
      });
      setJsonLd([buildNewsArticleJsonLd(article)]);
      return;
    }

    if (athleteSlug) {
      const athlete = athleteQuery.data;
      if (athleteQuery.isLoading || !athlete || !athlete.slug) {
        soft404Seo({ title: "Athlete", description: "Athlete profile on sports.com.na.", path });
        return;
      }
      const name = `${athlete.firstName} ${athlete.lastName}`.trim();
      applySeo({
        title: name,
        description: truncateMeta(
          athlete.achievements ||
            `${name}${athlete.federationName ? ` — ${athlete.federationName}` : ""} | Namibia sports.`
        ),
        path,
        image: athlete.photoUrl,
      });
      setJsonLd([
        buildAthleteJsonLd({
          firstName: athlete.firstName,
          lastName: athlete.lastName,
          slug: athlete.slug,
          achievements: athlete.achievements,
          photoUrl: athlete.photoUrl,
          federationName: athlete.federationName,
        }),
      ]);
      return;
    }


    if (eventSlug) {
      const event = eventDetailQuery.data;
      if (eventDetailQuery.isLoading || !event) {
        soft404Seo({ title: "Event", description: "Sports events on sports.com.na.", path });
        return;
      }
      applySeo({
        title: event.name,
        description: truncateMeta(event.description || `${event.name}${event.federationName ? ` — ${event.federationName}` : ""} | Namibia sports event.`),
        path,
        image: event.posterUrl,
      });
      setJsonLd([buildSportsEventDetailJsonLd({ name: event.name, slug: event.slug, description: event.description, startDate: event.startDate, endDate: event.endDate, location: event.location, posterUrl: event.posterUrl, federationName: event.federationName })]);
      return;
    }

    if (clubSlug) {
      const club = clubDetailQuery.data;
      if (clubDetailQuery.isLoading || !club) {
        soft404Seo({ title: "Club", description: "Sports clubs on sports.com.na.", path });
        return;
      }
      applySeo({
        title: club.name,
        description: truncateMeta(club.description || `${club.name}${club.federationName ? ` — ${club.federationName}` : ""} | Namibia sports club.`),
        path,
        image: club.logoUrl,
      });
      setJsonLd([buildClubJsonLd({ name: club.name, slug: club.slug, description: club.description, logoUrl: club.logoUrl, region: club.region, city: club.city, website: club.website, federationName: club.federationName })]);
      return;
    }
    if (isFedAdmin || (fedSlug && path.includes("/admin"))) {
      applySeo({
        title: "Federation Admin",
        description: "Federation administration.",
        path,
        noIndex: true,
      });
      clearJsonLd();
      return;
    }

    if (staticRoute) {
      applySeo({ ...staticRoute.meta, path });
      const graphs = staticRoute.jsonLd?.() ?? [];
      if (path === "/events" && eventsQuery.data?.length) {
        const eventLd = buildSportsEventJsonLd(
          eventsQuery.data.map((ev) => ({
            name: ev.name,
            description: ev.description,
            startDate: ev.startDate,
            endDate: ev.endDate,
            location: ev.location,
            slug: ev.slug,
            posterUrl: ev.posterUrl,
          }))
        );
        if (eventLd) graphs.push(eventLd);
      }
      setJsonLd(graphs);
      return;
    }

    // Unknown paths (incl. /404) must not compete for indexation.
    applySeo({
      title: "Page not found",
      description: "This page does not exist on sports.com.na.",
      path,
      noIndex: true,
    });
    clearJsonLd();
  }, [
    path,
    fedSlug,
    newsSlug,
    athleteSlug,
    eventSlug,
    clubSlug,
    isFedAdmin,
    staticRoute,
    federationQuery.data,
    federationQuery.isLoading,
    newsQuery.data,
    newsQuery.isLoading,
    athleteQuery.data,
    athleteQuery.isLoading,
    eventDetailQuery.data,
    eventDetailQuery.isLoading,
    clubDetailQuery.data,
    clubDetailQuery.isLoading,
    eventsQuery.data,
  ]);

  return null;
}
