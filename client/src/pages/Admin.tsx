import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, BarChart3, Calendar, Users, Trophy, Radio, Newspaper, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type Tab = "federations" | "events" | "clubs" | "athletes" | "news" | "streams";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "federations", label: "Federations", icon: Trophy },
  { id: "events", label: "Events", icon: Calendar },
  { id: "clubs", label: "Clubs", icon: Users },
  { id: "athletes", label: "Athletes", icon: Users },
  { id: "news", label: "News", icon: Newspaper },
  { id: "streams", label: "Streams", icon: Radio },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("federations");
  const [searchQuery, setSearchQuery] = useState("");

  const federationsQuery = trpc.federations.list.useQuery({});
  const eventsQuery = trpc.events.list.useQuery({});
  const clubsQuery = trpc.clubs.list.useQuery({});
  const athletesQuery = trpc.athletes.list.useQuery({});
  const newsQuery = trpc.news.list.useQuery({});
  const streamsQuery = trpc.streams.list.useQuery({});

  const stats = [
    { label: "Federations", value: federationsQuery.data?.length ?? "—", color: "#EF4444", icon: Trophy },
    { label: "Events", value: eventsQuery.data?.length ?? "—", color: "#3B82F6", icon: Calendar },
    { label: "Clubs", value: clubsQuery.data?.length ?? "—", color: "#10B981", icon: Users },
    { label: "Athletes", value: athletesQuery.data?.length ?? "—", color: "#FBBF24", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="text-gray-400 hover:text-white transition-colors text-sm">← Back to Site</button>
            </Link>
            <h1 className="text-xl font-serif tracking-[0.2em]">ADMIN DASHBOARD</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
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
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab.id
                    ? "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.4))"
                    : "rgba(255,255,255,0.05)",
                  border: activeTab === tab.id
                    ? "1px solid rgba(239,68,68,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === tab.id ? "white" : "#9CA3AF",
                }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search + Add */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
            />
          </div>
          <Button
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-4 w-4" /> Add {activeTab.slice(0, -1)}
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "federations" && <FederationsTable data={federationsQuery.data} isLoading={federationsQuery.isLoading} search={searchQuery} />}
        {activeTab === "events" && <EventsTable data={eventsQuery.data} isLoading={eventsQuery.isLoading} search={searchQuery} />}
        {activeTab === "clubs" && <ClubsTable data={clubsQuery.data} isLoading={clubsQuery.isLoading} search={searchQuery} />}
        {activeTab === "athletes" && <AthletesTable data={athletesQuery.data} isLoading={athletesQuery.isLoading} search={searchQuery} />}
        {activeTab === "news" && <NewsTable data={newsQuery.data} isLoading={newsQuery.isLoading} search={searchQuery} />}
        {activeTab === "streams" && <StreamsTable data={streamsQuery.data} isLoading={streamsQuery.isLoading} search={searchQuery} />}
      </div>
    </div>
  );
}

function TableShell({ isLoading, empty, children }: { isLoading: boolean; empty: boolean; children: React.ReactNode }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }
  if (empty) {
    return <p className="text-center text-gray-500 py-16">No records found.</p>;
  }
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-gray-300 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>{children}</td>;
}

function RowActions({ slug, onEdit, onDelete }: { slug?: string; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex gap-1 justify-end">
      {slug && (
        <Link href={`/federation/${slug}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </Link>
      )}
      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-400">
        <Edit className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function FederationsTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Name</Th><Th>Abbreviation</Th><Th>Type</Th><Th>Email</Th><Th>Slug</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{f.name}</span></Td>
              <Td>{f.abbreviation || <span className="text-gray-600">—</span>}</Td>
              <Td><Badge variant="secondary" className="text-xs">{f.type}</Badge></Td>
              <Td>{f.email || <span className="text-gray-600">—</span>}</Td>
              <Td><span className="text-gray-500 text-xs font-mono">{f.slug || `fed-${f.id}`}</span></Td>
              <Td><RowActions slug={f.slug || `fed-${f.id}`} /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function EventsTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Name</Th><Th>Type</Th><Th>Start Date</Th><Th>Location</Th><Th>Region</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{e.name}</span></Td>
              <Td><Badge variant="secondary" className="text-xs">{e.type}</Badge></Td>
              <Td>{e.startDate ? new Date(e.startDate).toLocaleDateString() : <span className="text-gray-600">—</span>}</Td>
              <Td>{e.location || <span className="text-gray-600">—</span>}</Td>
              <Td>{e.region || <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function ClubsTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Name</Th><Th>City</Th><Th>Region</Th><Th>Email</Th><Th>Founded</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{c.name}</span></Td>
              <Td>{c.city || <span className="text-gray-600">—</span>}</Td>
              <Td>{c.region || <span className="text-gray-600">—</span>}</Td>
              <Td>{c.email || <span className="text-gray-600">—</span>}</Td>
              <Td>{c.foundedYear || <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function AthletesTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter((a) => {
    const name = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Name</Th><Th>Nationality</Th><Th>Gender</Th><Th>Date of Birth</Th><Th>Email</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{a.firstName} {a.lastName}</span></Td>
              <Td>{a.nationality || <span className="text-gray-600">—</span>}</Td>
              <Td>{a.gender || <span className="text-gray-600">—</span>}</Td>
              <Td>{a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString() : <span className="text-gray-600">—</span>}</Td>
              <Td>{a.email || <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function NewsTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Title</Th><Th>Category</Th><Th>Published</Th><Th>Author</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((n) => (
            <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium line-clamp-1">{n.title}</span></Td>
              <Td>{n.category || <span className="text-gray-600">—</span>}</Td>
              <Td>
                {n.isPublished
                  ? <Badge className="bg-green-600/20 text-green-400 text-xs border-green-600/30">Published</Badge>
                  : <Badge variant="secondary" className="text-xs">Draft</Badge>}
              </Td>
              <Td>{n.authorName || <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function StreamsTable({ data, isLoading, search }: { data: any[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Title</Th><Th>Platform</Th><Th>Status</Th><Th>Scheduled</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{s.title}</span></Td>
              <Td>{s.platform || <span className="text-gray-600">—</span>}</Td>
              <Td>
                {s.isLive
                  ? <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs animate-pulse">● LIVE</Badge>
                  : <Badge variant="secondary" className="text-xs">Offline</Badge>}
              </Td>
              <Td>{s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
