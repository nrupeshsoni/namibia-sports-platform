import { motion } from "framer-motion";
import { Calendar, Users, User, Newspaper, Radio } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";
import WhatsAppSubscribe from "@/components/WhatsAppSubscribe";

export default function FederationHome() {
  const { federation, slug } = useFederation();
  if (!federation) return null;

  const eventsQuery = trpc.events.list.useQuery({ federationId: federation.id, upcoming: true });
  const newsQuery = trpc.news.list.useQuery({ federationId: federation.id, limit: 3 });
  const streamsQuery = trpc.streams.list.useQuery({ federationId: federation.id, isLive: true });
  const clubsQuery = trpc.clubs.list.useQuery({ federationId: federation.id });
  const athletesQuery = trpc.athletes.list.useQuery({ federationId: federation.id });

  const events = eventsQuery.data?.slice(0, 3) ?? [];
  const news = newsQuery.data ?? [];
  const liveStreams = streamsQuery.data ?? [];
  const clubCount = clubsQuery.data?.length ?? 0;
  const athleteCount = athletesQuery.data?.length ?? 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Events", value: events.length, icon: Calendar, color: "#EF4444" },
          { label: "Clubs", value: clubCount, icon: Users, color: "#3B82F6" },
          { label: "Athletes", value: athleteCount, icon: User, color: "#10B981" },
          { label: "News", value: news.length, icon: Newspaper, color: "#FBBF24" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Icon className="w-8 h-8 mb-2 text-gray-400" style={{ color: stat.color }} />
              <p className="text-3xl font-serif text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Live Banner */}
      {liveStreams.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Live Now</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {liveStreams.map((s) => (
              <Link key={s.id} href={`/federation/${slug}/streams`}>
                <button
                  className="px-4 py-2 rounded-xl text-white font-medium"
                  style={{
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))",
                  }}
                >
                  {s.title}
                </button>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xl font-serif text-white mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500">No upcoming events</p>
          ) : (
            events.map((event) => (
              <Link key={event.id} href={`/federation/${slug}/events`}>
                <div
                  className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-400">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString() : "-"}
                    </span>
                  </div>
                  <h3 className="text-white font-medium">{event.name}</h3>
                  {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.section>

      {/* Recent News */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xl font-serif text-white mb-4">Recent News</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {news.length === 0 ? (
            <p className="text-gray-500 col-span-full">No news yet</p>
          ) : (
            news.map((article) => (
              <div
                key={article.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {article.featuredImage && (
                  <div className="aspect-video bg-gray-800">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  {article.category && (
                    <span
                      className="text-xs px-2 py-1 rounded-full mr-2"
                      style={{ background: "rgba(59, 130, 246, 0.3)", color: "#93C5FD" }}
                    >
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-white font-medium mt-2 line-clamp-2">{article.title}</h3>
                  {article.summary && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.summary}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.section>

      {/* WhatsApp Subscribe */}
      <motion.section variants={fadeUp}>
        <WhatsAppSubscribe
          federationId={federation.id}
          federationName={federation.name}
        />
      </motion.section>
    </motion.div>
  );
}
