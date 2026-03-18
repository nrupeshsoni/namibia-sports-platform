import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Search,
  ChevronLeft,
  LayoutGrid,
  List,
  Trophy,
  Clock,
  ChevronDown,
  X,
} from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { fadeUp, staggerContainer } from '@/lib/animations';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const EVENT_TYPES = ['all', 'competition', 'tournament', 'training', 'workshop', 'meeting'] as const;
type EventTypeFilter = (typeof EVENT_TYPES)[number];

const REGIONS = [
  'All Regions',
  'Khomas',
  'Erongo',
  'Oshana',
  'Omusati',
  'Ohangwena',
  'Oshikoto',
  'Kavango East',
  'Kavango West',
  'Zambezi',
  'Kunene',
  'Otjozondjupa',
  'Omaheke',
  'Hardap',
  'Karas',
] as const;

const TYPE_IMAGES: Record<string, string> = {
  competition: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  tournament: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  training: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  meeting: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1461896836934-4f16cf7d507c?w=800&q=80',
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  competition: { bg: 'rgba(239,68,68,0.25)', text: '#FCA5A5', border: 'rgba(239,68,68,0.4)' },
  tournament: { bg: 'rgba(59,130,246,0.25)', text: '#93C5FD', border: 'rgba(59,130,246,0.4)' },
  training: { bg: 'rgba(16,185,129,0.25)', text: '#6EE7B7', border: 'rgba(16,185,129,0.4)' },
  workshop: { bg: 'rgba(251,191,36,0.25)', text: '#FCD34D', border: 'rgba(251,191,36,0.4)' },
  meeting: { bg: 'rgba(168,85,247,0.25)', text: '#C4B5FD', border: 'rgba(168,85,247,0.4)' },
  other: { bg: 'rgba(107,114,128,0.25)', text: '#D1D5DB', border: 'rgba(107,114,128,0.4)' },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getTypeImage(type: string): string {
  return TYPE_IMAGES[type] ?? TYPE_IMAGES.other;
}

function formatDate(date: Date | string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDeadlineCountdown(deadline: Date | string | null): string | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0 || days > 7) return null;
  if (days === 0) return 'Closes today!';
  return `${days}d left to register`;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

interface EventCardProps {
  event: {
    id: number;
    name: string;
    posterUrl: string | null;
    type: string;
    startDate: Date;
    endDate: Date | null;
    registrationDeadline: Date | null;
    location: string | null;
    region: string | null;
  };
  viewMode: 'grid' | 'list';
}

function EventCard({ event, viewMode }: EventCardProps) {
  const colors = TYPE_COLORS[event.type] ?? TYPE_COLORS.other;
  const image = event.posterUrl ?? getTypeImage(event.type);
  const deadline = getDeadlineCountdown(event.registrationDeadline);

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={fadeUp}
        className="flex gap-0 rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Date column */}
        <div
          className="flex-shrink-0 w-20 md:w-28 flex flex-col items-center justify-center p-4 text-center"
          style={{ background: 'rgba(239,68,68,0.12)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-2xl font-bold text-white leading-none">
            {new Date(event.startDate).getDate()}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">
            {new Date(event.startDate).toLocaleString('en-US', { month: 'short' })}
          </span>
          <span className="text-xs text-gray-500">{new Date(event.startDate).getFullYear()}</span>
        </div>

        {/* Image */}
        <div className="flex-shrink-0 w-28 md:w-40 overflow-hidden hidden sm:block">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {event.type}
              </span>
              {event.region && (
                <span className="text-xs text-gray-500 truncate">{event.region}</span>
              )}
            </div>
            <h3 className="font-serif text-white text-base md:text-lg leading-tight line-clamp-2">
              {event.name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
            {deadline && (
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {deadline}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 flex items-center pr-4">
          <button
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))',
              boxShadow: '0 8px 24px -8px rgba(239,68,68,0.5)',
            }}
          >
            Register
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid card
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-3xl overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {event.type}
          </span>
        </div>

        {/* Region badge */}
        {event.region && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs px-2 py-1 rounded-full text-gray-300"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {event.region}
            </span>
          </div>
        )}

        {/* Deadline urgency banner */}
        {deadline && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center gap-1.5">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-amber-300 w-full justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            >
              <Clock className="w-3 h-3" />
              {deadline}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-white text-lg leading-snug mb-3 line-clamp-2">
          {event.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-400 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        <button
          className="w-full mt-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] text-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.85), rgba(220,38,38,0.85))',
            boxShadow: '0 8px 24px -8px rgba(239,68,68,0.5)',
          }}
        >
          Register
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden animate-pulse"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="h-48 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/10 rounded-full w-1/3" />
        <div className="h-5 bg-white/10 rounded-full w-3/4" />
        <div className="h-3 bg-white/10 rounded-full w-1/2" />
        <div className="h-3 bg-white/10 rounded-full w-2/5" />
        <div className="h-9 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function Events() {
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');
  const [regionFilter, setRegionFilter] = useState<string>('All Regions');
  const [regionOpen, setRegionOpen] = useState(false);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const eventsQuery = trpc.events.list.useQuery({});

  const now = new Date();

  const filtered = useMemo(() => {
    const all = eventsQuery.data ?? [];
    return all.filter((e) => {
      const start = new Date(e.startDate);
      const isUpcoming = start >= now;
      if (tab === 'upcoming' && !isUpcoming) return false;
      if (tab === 'past' && isUpcoming) return false;
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (regionFilter !== 'All Regions' && e.region !== regionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = e.name.toLowerCase().includes(q);
        const locMatch = e.location?.toLowerCase().includes(q) ?? false;
        const regionMatch = e.region?.toLowerCase().includes(q) ?? false;
        if (!nameMatch && !locMatch && !regionMatch) return false;
      }
      return true;
    });
  }, [eventsQuery.data, tab, typeFilter, regionFilter, search]);

  const TYPE_LABELS: Record<EventTypeFilter, string> = {
    all: 'All',
    competition: 'Competition',
    tournament: 'Tournament',
    training: 'Training',
    workshop: 'Workshop',
    meeting: 'Meeting',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Fixed Glass Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/10">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
          </Link>

          <h1 className="font-serif tracking-[0.35em] text-xl text-white">EVENTS</h1>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Expandable search */}
        {searchOpen && (
          <div
            className="px-4 pb-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search events, locations, regions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <div className="pt-20">
        {/* ── Sticky Filter Bar ── */}
        <div
          className="sticky top-[68px] z-40"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Type pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 hover:scale-105"
                    style={{
                      background:
                        typeFilter === t
                          ? 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))'
                          : 'rgba(255,255,255,0.06)',
                      border:
                        typeFilter === t
                          ? '1px solid rgba(239,68,68,0.5)'
                          : '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      boxShadow: typeFilter === t ? '0 4px 16px -4px rgba(239,68,68,0.4)' : 'none',
                    }}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>

              {/* Region dropdown */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setRegionOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: regionFilter !== 'All Regions' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)',
                    border: regionFilter !== 'All Regions' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  {regionFilter}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {regionOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-44 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: 'rgba(20,20,20,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    {REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRegionFilter(r); setRegionOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors"
                        style={{ color: regionFilter === r ? '#EF4444' : '#D1D5DB' }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* ── Tab + View toggle row ── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            {/* Upcoming / Past tabs */}
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {(['upcoming', 'past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-5 py-2.5 text-sm font-medium capitalize transition-all duration-300"
                  style={{
                    background: tab === t ? 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))' : 'transparent',
                    color: 'white',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Result count */}
              <span className="text-sm text-gray-400">
                {eventsQuery.isLoading ? 'Loading…' : `Showing ${filtered.length} event${filtered.length !== 1 ? 's' : ''}`}
              </span>

              {/* Grid / List toggle */}
              <div
                className="flex rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2.5 transition-colors"
                  style={{
                    background: viewMode === 'grid' ? 'rgba(239,68,68,0.4)' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : '#9CA3AF',
                  }}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2.5 transition-colors"
                  style={{
                    background: viewMode === 'list' ? 'rgba(239,68,68,0.4)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#9CA3AF',
                  }}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Loading skeletons ── */}
          {eventsQuery.isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* ── Events ── */}
          {!eventsQuery.isLoading && filtered.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-3'
              }
            >
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} viewMode={viewMode} />
              ))}
            </motion.div>
          )}

          {/* ── Empty state ── */}
          {!eventsQuery.isLoading && filtered.length === 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Trophy className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="font-serif text-2xl text-gray-300 mb-2">No Events Found</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Try adjusting your filters or check back soon for new events.
              </p>
              <button
                onClick={() => { setTypeFilter('all'); setRegionFilter('All Regions'); setSearch(''); }}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.7), rgba(220,38,38,0.7))',
                  border: '1px solid rgba(239,68,68,0.4)',
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="py-8 mt-12 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Namibia Sports Platform
        </p>
        <p className="text-xs text-gray-700 mt-1">
          Designed & Developed by{' '}
          <a href="https://thedome.com.na" className="text-red-600 hover:text-red-500">
            The Dome Technologies
          </a>{' '}
          &{' '}
          <a href="https://facilit8.com.na" className="text-red-600 hover:text-red-500">
            Facilit8 Namibia
          </a>
        </p>
      </footer>
    </div>
  );
}
