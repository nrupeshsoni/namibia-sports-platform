import { BarChart3, Calendar, Users, User, Newspaper, Radio } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface FedAdminDashboardProps {
  federationId: number;
  federationName: string;
}

export default function FedAdminDashboard({ federationId, federationName }: FedAdminDashboardProps) {
  const eventsQuery = trpc.events.list.useQuery({ federationId });
  const clubsQuery = trpc.clubs.list.useQuery({ federationId });
  const athletesQuery = trpc.athletes.list.useQuery({ federationId });
  const newsQuery = trpc.news.list.useQuery({ federationId, includeUnpublished: true });
  const streamsQuery = trpc.streams.list.useQuery({ federationId });

  const stats = [
    { label: "Events", value: eventsQuery.data?.length ?? "—", color: "#3B82F6", icon: Calendar },
    { label: "Clubs", value: clubsQuery.data?.length ?? "—", color: "#10B981", icon: Users },
    { label: "Athletes", value: athletesQuery.data?.length ?? "—", color: "#FBBF24", icon: User },
    { label: "News", value: newsQuery.data?.length ?? "—", color: "#8B5CF6", icon: Newspaper },
    { label: "Streams", value: streamsQuery.data?.length ?? "—", color: "#EF4444", icon: Radio },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <h2 className="text-xl font-serif text-white mb-6 tracking-wide">{federationName} Admin Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Icon className="w-6 h-6 mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-serif text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
