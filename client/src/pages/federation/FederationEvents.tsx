import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useFederation } from '@/contexts/FederationContext';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const EVENT_TYPES = ['all', 'competition', 'tournament', 'training', 'workshop', 'meeting', 'other'] as const;
type EventTypeFilter = (typeof EVENT_TYPES)[number];

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

const TYPE_LABELS: Record<EventTypeFilter, string> = {
  all: 'All',
  competition: 'Competition',
  tournament: 'Tournament',
  training: 'Training',
  workshop: 'Workshop',
  meeting: 'Meeting',
  other: 'Other',
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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
// Event Card (shared design with main Events page)
// ─────────────────────────────────────────────

interface FederationEventCardProps {
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
    description: string | null;
  };
}

function FederationEventCard({ event }: FederationEventCardProps) {
  const colors = TYPE_COLORS[event.type] ?? TYPE_COLORS.other;
  const image = event.posterUrl ?? (TYPE_IMAGES[event.type] ?? TYPE_IMAGES.other);
  const deadline = getDeadlineCountdown(event.registrationDeadline);

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

        {/* Deadline urgency */}
        {deadline && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5">
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

        {event.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{event.description}</p>
        )}

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
        <div className="h-9 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function FederationEvents() {
  const { federation } = useFederation();
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const eventsQuery = trpc.events.list.useQuery(
    { federationId: federation?.id },
    { enabled: !!federation?.id }
  );

  const now = new Date();

  const filtered = useMemo(() => {
    const all = eventsQuery.data ?? [];
    return all.filter((e) => {
      const start = new Date(e.startDate);
      const isUpcoming = start >= now;
      if (tab === 'upcoming' && !isUpcoming) return false;
      if (tab === 'past' && isUpcoming) return false;
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      return true;
    });
  }, [eventsQuery.data, tab, typeFilter]);

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Controls ── */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 justify-between">
        {/* Upcoming / Past tabs */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 text-sm font-medium capitalize transition-all duration-300"
              style={{
                background:
                  tab === t
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))'
                    : 'transparent',
                color: 'white',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 hover:scale-105"
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
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Result count */}
      <motion.p variants={fadeUp} className="text-sm text-gray-500">
        {eventsQuery.isLoading
          ? 'Loading events…'
          : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
      </motion.p>

      {/* ── Loading ── */}
      {eventsQuery.isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── Event grid ── */}
      {!eventsQuery.isLoading && filtered.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <FederationEventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!eventsQuery.isLoading && filtered.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Trophy className="w-9 h-9 text-gray-600" />
          </div>
          <h3 className="font-serif text-xl text-gray-300 mb-2">No Events Found</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            {tab === 'upcoming'
              ? 'No upcoming events scheduled. Check back soon!'
              : 'No past events to display.'}
          </p>
          <button
            onClick={() => { setTypeFilter('all'); setTab('upcoming'); }}
            className="mt-5 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.7), rgba(220,38,38,0.7))',
              border: '1px solid rgba(239,68,68,0.4)',
            }}
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
