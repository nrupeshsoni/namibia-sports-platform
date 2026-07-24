import { BarChart3, Calendar, Trophy, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * Platform-admin dashboard totals.
 * Directory uses listAll + sports/bodies/merged breakdown (not Ministry “61”).
 * Events/clubs/athletes use uncapped `adminStats.counts`.
 */
export function AdminStatsCards({ enabled }: { enabled: boolean }) {
  const countsQuery = trpc.adminStats.counts.useQuery(undefined, { enabled });
  const federationsQuery = trpc.federations.listAll.useQuery(undefined, { enabled });
  const c = countsQuery.data;
  const fedRows = federationsQuery.data;

  const fedSportCount = fedRows?.filter(
    (f) => f.type === "federation" && f.isActive !== false
  ).length;
  const fedBodyCount = fedRows?.filter(
    (f) =>
      (f.type === "ministry" || f.type === "commission" || f.type === "umbrella") &&
      f.isActive !== false
  ).length;
  const fedMergedCount = fedRows?.filter(
    (f) => f.isActive === false || Boolean(f.mergedIntoSlug)
  ).length;
  const fedStatDetail =
    fedRows == null
      ? undefined
      : [
          `${fedSportCount ?? 0} sports`,
          `${fedBodyCount ?? 0} bodies`,
          (fedMergedCount ?? 0) > 0 ? `${fedMergedCount} merged` : null,
        ]
          .filter(Boolean)
          .join(" · ");

  const stats = [
    {
      label: "Directory",
      value: fedRows?.length ?? c?.federations ?? "—",
      detail: fedStatDetail,
      color: "#EF4444",
      icon: Trophy,
    },
    { label: "Events", value: c?.events ?? "—", color: "#3B82F6", icon: Calendar },
    { label: "Clubs", value: c?.clubs ?? "—", color: "#10B981", icon: Users },
    { label: "Athletes", value: c?.athletes ?? "—", color: "#FBBF24", icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
            <p className="text-3xl font-serif text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            {"detail" in stat && stat.detail ? (
              <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
