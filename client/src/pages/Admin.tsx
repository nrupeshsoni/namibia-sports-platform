import { useState, useEffect } from "react";
import {
  Plus, Search, Edit, Trash2, Eye,
  BarChart3, Calendar, Users, Trophy, Radio, Newspaper, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { EntityModal } from "@/components/admin/EntityModal";
import { FederationForm, type FederationFormData } from "@/components/admin/FederationForm";
import { EventForm, type EventFormData } from "@/components/admin/EventForm";
import { ClubForm, type ClubFormData } from "@/components/admin/ClubForm";
import { AthleteForm, type AthleteFormData } from "@/components/admin/AthleteForm";

type Tab = "federations" | "events" | "clubs" | "athletes" | "news" | "streams";
type CrudTab = "federations" | "events" | "clubs" | "athletes";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "federations", label: "Federations", icon: Trophy },
  { id: "events", label: "Events", icon: Calendar },
  { id: "clubs", label: "Clubs", icon: Users },
  { id: "athletes", label: "Athletes", icon: Users },
  { id: "news", label: "News", icon: Newspaper },
  { id: "streams", label: "Streams", icon: Radio },
];

const CRUD_TABS: Tab[] = ["federations", "events", "clubs", "athletes"];

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [authLoading, user, setLocation]);

  const [activeTab, setActiveTab] = useState<Tab>("federations");
  const [searchQuery, setSearchQuery] = useState("");

  type FedModal = { mode: "create" } | { mode: "edit"; data: FederationFormData };
  type EvtModal = { mode: "create" } | { mode: "edit"; data: EventFormData };
  type ClubModal = { mode: "create" } | { mode: "edit"; data: ClubFormData };
  type AthModal = { mode: "create" } | { mode: "edit"; data: AthleteFormData };

  const [fedModal, setFedModal] = useState<FedModal | null>(null);
  const [evtModal, setEvtModal] = useState<EvtModal | null>(null);
  const [clubModal, setClubModal] = useState<ClubModal | null>(null);
  const [athModal, setAthModal] = useState<AthModal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ entity: CrudTab; id: number } | null>(null);

  const utils = trpc.useUtils();
  const federationsQuery = trpc.federations.list.useQuery({});
  const eventsQuery = trpc.events.list.useQuery({});
  const clubsQuery = trpc.clubs.list.useQuery({});
  const athletesQuery = trpc.athletes.list.useQuery({});
  const newsQuery = trpc.news.list.useQuery({});
  const streamsQuery = trpc.streams.list.useQuery({});

  const deleteFed = trpc.federations.delete.useMutation({
    onSuccess: () => { utils.federations.list.invalidate(); setDeleteConfirm(null); },
  });
  const deleteEvt = trpc.events.delete.useMutation({
    onSuccess: () => { utils.events.list.invalidate(); setDeleteConfirm(null); },
  });
  const deleteClub = trpc.clubs.delete.useMutation({
    onSuccess: () => { utils.clubs.list.invalidate(); setDeleteConfirm(null); },
  });
  const deleteAth = trpc.athletes.delete.useMutation({
    onSuccess: () => { utils.athletes.list.invalidate(); setDeleteConfirm(null); },
  });

  const isDeletePending =
    deleteFed.isPending || deleteEvt.isPending || deleteClub.isPending || deleteAth.isPending;

  const handleAddClick = () => {
    if (activeTab === "federations") setFedModal({ mode: "create" });
    else if (activeTab === "events") setEvtModal({ mode: "create" });
    else if (activeTab === "clubs") setClubModal({ mode: "create" });
    else if (activeTab === "athletes") setAthModal({ mode: "create" });
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    const { entity, id } = deleteConfirm;
    if (entity === "federations") deleteFed.mutate({ id });
    else if (entity === "events") deleteEvt.mutate({ id });
    else if (entity === "clubs") deleteClub.mutate({ id });
    else if (entity === "athletes") deleteAth.mutate({ id });
  };

  const stats = [
    { label: "Federations", value: federationsQuery.data?.length ?? "—", color: "#EF4444", icon: Trophy },
    { label: "Events", value: eventsQuery.data?.length ?? "—", color: "#3B82F6", icon: Calendar },
    { label: "Clubs", value: clubsQuery.data?.length ?? "—", color: "#10B981", icon: Users },
    { label: "Athletes", value: athletesQuery.data?.length ?? "—", color: "#FBBF24", icon: BarChart3 },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.08)" }}
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
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
                <p className="text-3xl font-serif text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
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
          {CRUD_TABS.includes(activeTab) && (
            <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white" onClick={handleAddClick}>
              <Plus className="h-4 w-4" /> Add {activeTab.slice(0, -1)}
            </Button>
          )}
        </div>

        {activeTab === "federations" && (
          <FederationsTable
            data={federationsQuery.data as FederationFormData[] | undefined}
            isLoading={federationsQuery.isLoading}
            search={searchQuery}
            onEdit={(item) => setFedModal({ mode: "edit", data: item })}
            onDelete={(id) => setDeleteConfirm({ entity: "federations", id })}
          />
        )}
        {activeTab === "events" && (
          <EventsTable
            data={eventsQuery.data as EventFormData[] | undefined}
            isLoading={eventsQuery.isLoading}
            search={searchQuery}
            onEdit={(item) => setEvtModal({ mode: "edit", data: item })}
            onDelete={(id) => setDeleteConfirm({ entity: "events", id })}
          />
        )}
        {activeTab === "clubs" && (
          <ClubsTable
            data={clubsQuery.data as ClubFormData[] | undefined}
            isLoading={clubsQuery.isLoading}
            search={searchQuery}
            onEdit={(item) => setClubModal({ mode: "edit", data: item })}
            onDelete={(id) => setDeleteConfirm({ entity: "clubs", id })}
          />
        )}
        {activeTab === "athletes" && (
          <AthletesTable
            data={athletesQuery.data as AthleteFormData[] | undefined}
            isLoading={athletesQuery.isLoading}
            search={searchQuery}
            onEdit={(item) => setAthModal({ mode: "edit", data: item })}
            onDelete={(id) => setDeleteConfirm({ entity: "athletes", id })}
          />
        )}
        {activeTab === "news" && (
          <NewsTable data={newsQuery.data} isLoading={newsQuery.isLoading} search={searchQuery} />
        )}
        {activeTab === "streams" && (
          <StreamsTable data={streamsQuery.data} isLoading={streamsQuery.isLoading} search={searchQuery} />
        )}
      </div>

      {/* Federation Modal */}
      <EntityModal
        open={fedModal !== null}
        onClose={() => setFedModal(null)}
        title={fedModal?.mode === "create" ? "Add Federation" : "Edit Federation"}
      >
        {fedModal && (
          <FederationForm
            mode={fedModal.mode}
            initialData={fedModal.mode === "edit" ? fedModal.data : undefined}
            onSuccess={() => setFedModal(null)}
          />
        )}
      </EntityModal>

      {/* Event Modal */}
      <EntityModal
        open={evtModal !== null}
        onClose={() => setEvtModal(null)}
        title={evtModal?.mode === "create" ? "Add Event" : "Edit Event"}
      >
        {evtModal && (
          <EventForm
            mode={evtModal.mode}
            initialData={evtModal.mode === "edit" ? evtModal.data : undefined}
            onSuccess={() => setEvtModal(null)}
          />
        )}
      </EntityModal>

      {/* Club Modal */}
      <EntityModal
        open={clubModal !== null}
        onClose={() => setClubModal(null)}
        title={clubModal?.mode === "create" ? "Add Club" : "Edit Club"}
      >
        {clubModal && (
          <ClubForm
            mode={clubModal.mode}
            initialData={clubModal.mode === "edit" ? clubModal.data : undefined}
            onSuccess={() => setClubModal(null)}
          />
        )}
      </EntityModal>

      {/* Athlete Modal */}
      <EntityModal
        open={athModal !== null}
        onClose={() => setAthModal(null)}
        title={athModal?.mode === "create" ? "Register Athlete" : "Edit Athlete"}
      >
        {athModal && (
          <AthleteForm
            mode={athModal.mode}
            initialData={athModal.mode === "edit" ? athModal.data : undefined}
            onSuccess={() => setAthModal(null)}
          />
        )}
      </EntityModal>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
            style={{
              background: "rgba(17,17,17,0.95)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-white font-medium text-lg">Are you sure?</p>
              <p className="text-gray-400 text-sm mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 border border-white/10 text-gray-300 hover:text-white"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirm}
                disabled={isDeletePending}
              >
                {isDeletePending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
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
  if (empty) return <p className="text-center text-gray-500 py-16">No records found.</p>;
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      {children}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-300 border-b"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      {children}
    </td>
  );
}

function RowActions({
  slug,
  onEdit,
  onDelete,
}: {
  slug?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex gap-1 justify-end">
      {slug && (
        <Link href={`/federation/${slug}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </Link>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-400" onClick={onEdit}>
          <Edit className="h-3.5 w-3.5" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

function FederationsTable({
  data, isLoading, search, onEdit, onDelete,
}: {
  data: FederationFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: FederationFormData) => void;
  onDelete: (id: number) => void;
}) {
  const filtered = (data ?? []).filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr><Th>Name</Th><Th>Abbreviation</Th><Th>Type</Th><Th>Email</Th><Th></Th></tr>
        </thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{f.name}</span></Td>
              <Td>{f.abbreviation ?? <span className="text-gray-600">—</span>}</Td>
              <Td><Badge variant="secondary" className="text-xs">{f.type}</Badge></Td>
              <Td>{f.email ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions
                  onEdit={() => onEdit(f)}
                  onDelete={() => onDelete(f.id)}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function EventsTable({
  data, isLoading, search, onEdit, onDelete,
}: {
  data: EventFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: EventFormData) => void;
  onDelete: (id: number) => void;
}) {
  const filtered = (data ?? []).filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr><Th>Name</Th><Th>Type</Th><Th>Start Date</Th><Th>Location</Th><Th>Region</Th><Th></Th></tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{e.name}</span></Td>
              <Td><Badge variant="secondary" className="text-xs">{e.type ?? "—"}</Badge></Td>
              <Td>{e.startDate ? new Date(e.startDate).toLocaleDateString() : <span className="text-gray-600">—</span>}</Td>
              <Td>{e.location ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{e.region ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions
                  onEdit={() => onEdit(e)}
                  onDelete={() => onDelete(e.id)}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function ClubsTable({
  data, isLoading, search, onEdit, onDelete,
}: {
  data: ClubFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: ClubFormData) => void;
  onDelete: (id: number) => void;
}) {
  const filtered = (data ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr><Th>Name</Th><Th>City</Th><Th>Region</Th><Th>Email</Th><Th>Founded</Th><Th></Th></tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{c.name}</span></Td>
              <Td>{c.city ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.region ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.contactEmail ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.establishedYear ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions
                  onEdit={() => onEdit(c)}
                  onDelete={() => onDelete(c.id)}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function AthletesTable({
  data, isLoading, search, onEdit, onDelete,
}: {
  data: AthleteFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: AthleteFormData) => void;
  onDelete: (id: number) => void;
}) {
  const filtered = (data ?? []).filter((a) => {
    const name = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr><Th>Name</Th><Th>Gender</Th><Th>Date of Birth</Th><Th>Email</Th><Th></Th></tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{a.firstName} {a.lastName}</span></Td>
              <Td>{a.gender ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString() : <span className="text-gray-600">—</span>}</Td>
              <Td>{a.email ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions
                  onEdit={() => onEdit(a)}
                  onDelete={() => onDelete(a.id)}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function NewsTable({ data, isLoading, search }: { data: { id: number; title: string; category?: string | null; isPublished?: boolean | null; authorName?: string | null }[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Title</Th><Th>Category</Th><Th>Published</Th><Th>Author</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((n) => (
            <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium line-clamp-1">{n.title}</span></Td>
              <Td>{n.category ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                {n.isPublished
                  ? <Badge className="bg-green-600/20 text-green-400 text-xs border-green-600/30">Published</Badge>
                  : <Badge variant="secondary" className="text-xs">Draft</Badge>}
              </Td>
              <Td>{n.authorName ?? <span className="text-gray-600">—</span>}</Td>
              <Td><RowActions /></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function StreamsTable({ data, isLoading, search }: { data: { id: number; title: string; platform?: string | null; isLive?: boolean | null; scheduledAt?: Date | string | null }[] | undefined; isLoading: boolean; search: string }) {
  const filtered = (data ?? []).filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead><tr><Th>Title</Th><Th>Platform</Th><Th>Status</Th><Th>Scheduled</Th><Th></Th></tr></thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
              <Td><span className="text-white font-medium">{s.title}</span></Td>
              <Td>{s.platform ?? <span className="text-gray-600">—</span>}</Td>
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
