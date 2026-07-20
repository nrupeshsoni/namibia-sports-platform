/**
 * FALLBACK-ONLY static federation catalogue (curated subset).
 *
 * Canonical source of truth is Supabase `sportsplatform_federations` (~85 entities)
 * via tRPC `federations.list` / `getBySlug`. Home.tsx loads DB rows first and only
 * uses this array if the API fails.
 *
 * Intentionally small — do NOT expand toward parity with the DB. Prefer migrations
 * under `supabase/migrations/`. Image paths may be stale; logos live in
 * `client/public/logos/`.
 *
 * @see docs/research/federation_data_gap_list.md
 */

/** Derive URL slug from name — matches server getBySlug resolution */
export function getFederationSlug(f: { id: number; name: string; slug?: string | null }): string {
  if (f.slug) return f.slug;
  const fromName = f.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return fromName || `fed-${f.id}`;
}

export interface Federation {
  id: number;
  name: string;
  slug?: string;
  category: 'ministry' | 'commission' | 'umbrella' | 'federation';
  shortName: string;
  description?: string;
  image: string;
  president?: string;
  secretary?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

/** Minimal offline/error fallback — major bodies only (no fabricated contacts). */
export const federations: Federation[] = [
  {
    id: 1,
    name: 'Ministry of Sport, Youth and National Service',
    category: 'ministry',
    shortName: 'MINISTRY OF SPORT',
    image: '/sports/namibia-football.jpg',
    description: 'Government ministry overseeing sports development in Namibia',
  },
  {
    id: 2,
    name: 'Namibia Sports Commission',
    category: 'commission',
    shortName: 'SPORTS COMMISSION',
    image: '/logos/athletics-logo.png',
    description: 'National sports commission coordinating all sporting activities',
  },
  {
    id: 3,
    name: 'Disability Sport Namibia',
    category: 'umbrella',
    shortName: 'DISABILITY SPORT',
    image: '/sports/bCLTLTx2ggc5.jpeg',
  },
  {
    id: 6,
    name: 'Namibia National Olympic Committee (NNOC)',
    category: 'umbrella',
    shortName: 'NNOC',
    image: '/logos/Namibia_National_Olympic_Committee_logo.png',
  },
  {
    id: 14,
    name: 'Athletics Namibia',
    category: 'federation',
    shortName: 'ATHLETICS',
    image: '/logos/athletics-logo.png',
  },
  {
    id: 17,
    name: 'Boxing Namibia',
    category: 'federation',
    shortName: 'BOXING',
    image: '/sports/namibia-boxing.jpg',
  },
  {
    id: 20,
    name: 'Cricket Namibia',
    category: 'federation',
    shortName: 'CRICKET',
    image: '/sports/namibia-cricket.jpg',
  },
  {
    id: 25,
    name: 'Football Association of Namibia',
    category: 'federation',
    shortName: 'FOOTBALL',
    image: '/sports/namibia-football.jpg',
  },
  {
    id: 30,
    name: 'Hockey Namibia',
    category: 'federation',
    shortName: 'HOCKEY',
    image: '/sports/namibia-hockey.jpg',
  },
  {
    id: 35,
    name: 'Netball Namibia',
    category: 'federation',
    shortName: 'NETBALL',
    image: '/sports/netball.jpg',
  },
  {
    id: 40,
    name: 'Rugby Namibia',
    category: 'federation',
    shortName: 'RUGBY',
    image: '/sports/namibia-rugby.jpg',
  },
  {
    id: 45,
    name: 'Swimming Namibia',
    category: 'federation',
    shortName: 'SWIMMING',
    image: '/sports/namibia-swimming.jpg',
  },
];
