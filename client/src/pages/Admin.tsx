import { useState, useEffect } from "react";
import {
  Plus, Search, Calendar, Users, Trophy, Radio, Newspaper, LogOut,
  GraduationCap, MapPin, School, Image, Target, UserCog, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { EntityModal } from "@/components/admin/EntityModal";
import { FederationForm, type FederationFormData } from "@/components/admin/FederationForm";
import { EventForm, type EventFormData } from "@/components/admin/EventForm";
import { ClubForm, type ClubFormData } from "@/components/admin/ClubForm";
import { AthleteForm, type AthleteFormData } from "@/components/admin/AthleteForm";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { UsersAdminPanel } from "@/components/admin/UsersAdminPanel";
import FedAdminNews from "@/pages/federation/admin/FedAdminNews";
import FedAdminStreams from "@/pages/federation/admin/FedAdminStreams";
import FedAdminCoaches from "@/pages/federation/admin/FedAdminCoaches";
import FedAdminHpPrograms from "@/pages/federation/admin/FedAdminHpPrograms";
import {
  FederationsTable, EventsTable, ClubsTable, AthletesTable,
} from "@/pages/admin/AdminTables";
import { AdminFedScope } from "@/pages/admin/AdminFedScope";
import { AdminFederationFilter } from "@/pages/admin/AdminFederationFilter";
import { AdminStatsCards } from "@/pages/admin/AdminStatsCards";
import { AdminVenuesPanel } from "@/pages/admin/AdminVenuesPanel";
import { AdminSchoolsPanel } from "@/pages/admin/AdminSchoolsPanel";
import { AdminContentSyncPanel } from "@/pages/admin/AdminContentSyncPanel";
import { ThemeToggle } from "@/components/ThemeToggle";

type Tab =
  | "federations" | "events" | "clubs" | "athletes" | "news" | "streams"
  | "coaches" | "venues" | "schools" | "media" | "hp" | "users" | "contentSync";
type CrudTab = "federations" | "events" | "clubs" | "athletes";

const ADMIN_LIMIT = 200;

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "federations", label: "Federations", icon: Trophy },
  { id: "events", label: "Events", icon: Calendar },
  { id: "clubs", label: "Clubs", icon: Users },
  { id: "athletes", label: "Athletes", icon: Users },
  { id: "coaches", label: "Coaches", icon: GraduationCap },
  { id: "news", label: "News", icon: Newspaper },
  { id: "streams", label: "Streams", icon: Radio },
  { id: "venues", label: "Venues", icon: MapPin },
  { id: "schools", label: "Schools", icon: School },
  { id: "media", label: "Media", icon: Image },
  { id: "hp", label: "HP Programs", icon: Target },
  { id: "contentSync", label: "Content Sync", icon: Brain },
  { id: "users", label: "Users", icon: UserCog },
];

const CRUD_TABS: Tab[] = ["federations", "events", "clubs", "athletes"];
const FED_FILTER_TABS: Tab[] = ["events", "clubs", "athletes"];

export default function Admin() {
  const [, setLocation] = useLocation();
  const { signOut } = useAuth();
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false });
  const isPlatformAdmin = meQuery.data?.role === "admin";

  useEffect(() => {
    if (meQuery.isLoading) return;
    if (!meQuery.data) { setLocation("/login"); return; }
    if (meQuery.data.role !== "admin") setLocation("/");
  }, [meQuery.isLoading, meQuery.data, setLocation]);

  const [activeTab, setActiveTab] = useState<Tab>("federations");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFedId, setFilterFedId] = useState<number | null>(null);
  const [scopeFedId, setScopeFedId] = useState<number | null>(null);
  const [fedModal, setFedModal] = useState<{ mode: "create" } | { mode: "edit"; data: FederationFormData } | null>(null);
  const [evtModal, setEvtModal] = useState<{ mode: "create" } | { mode: "edit"; data: EventFormData } | null>(null);
  const [clubModal, setClubModal] = useState<{ mode: "create" } | { mode: "edit"; data: ClubFormData } | null>(null);
  const [athModal, setAthModal] = useState<{ mode: "create" } | { mode: "edit"; data: AthleteFormData } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    entity: CrudTab; id: number; federationId?: number | null;
  } | null>(null);

  const utils = trpc.useUtils();
  const fedFilter = filterFedId ?? undefined;

  const federationsQuery = trpc.federations.listAll.useQuery(undefined, { enabled: isPlatformAdmin });
  const eventsQuery = trpc.events.list.useQuery(
    { includeUnpublished: true, limit: ADMIN_LIMIT, federationId: fedFilter },
    { enabled: isPlatformAdmin }
  );
  const clubsQuery = trpc.clubs.list.useQuery(
    { includeInactive: true, limit: ADMIN_LIMIT, federationId: fedFilter },
    { enabled: isPlatformAdmin }
  );
  const athletesQuery = trpc.athletes.list.useQuery(
    { includeInactive: true, includePii: true, limit: ADMIN_LIMIT, federationId: fedFilter },
    { enabled: isPlatformAdmin }
  );

  const deleteFed = trpc.federations.delete.useMutation({
    onSuccess: () => { utils.federations.listAll.invalidate(); utils.federations.list.invalidate(); utils.adminStats.counts.invalidate(); setDeleteConfirm(null); },
  });
  const deleteEvt = trpc.events.delete.useMutation({
    onSuccess: () => { utils.events.list.invalidate(); utils.adminStats.counts.invalidate(); setDeleteConfirm(null); },
  });
  const deleteClub = trpc.clubs.delete.useMutation({
    onSuccess: () => { utils.clubs.list.invalidate(); utils.adminStats.counts.invalidate(); setDeleteConfirm(null); },
  });
  const deleteAth = trpc.athletes.delete.useMutation({
    onSuccess: () => { utils.athletes.list.invalidate(); utils.adminStats.counts.invalidate(); setDeleteConfirm(null); },
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
    const { entity, id, federationId } = deleteConfirm;
    if (entity === "federations") deleteFed.mutate({ id });
    else if (entity === "events" && federationId != null) deleteEvt.mutate({ id, federationId });
    else if (entity === "clubs" && federationId != null) deleteClub.mutate({ id, federationId });
    else if (entity === "athletes" && federationId != null) deleteAth.mutate({ id, federationId });
  };

  if (meQuery.isLoading || !isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  const showSearchAdd = CRUD_TABS.includes(activeTab);
  const createLock = filterFedId ?? undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><button className="text-gray-400 hover:text-white transition-colors text-sm">← Back to Site</button></Link>
            <h1 className="text-xl font-serif tracking-[0.2em]">ADMIN DASHBOARD</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <AdminStatsCards enabled={isPlatformAdmin} />

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
                  border: activeTab === tab.id ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === tab.id ? "white" : "#9CA3AF",
                }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {FED_FILTER_TABS.includes(activeTab) && (
          <div className="mb-4">
            <AdminFederationFilter value={filterFedId} onChange={setFilterFedId} />
          </div>
        )}

        {showSearchAdd && (
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
            <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white" onClick={handleAddClick}>
              <Plus className="h-4 w-4" /> Add {activeTab.slice(0, -1)}
            </Button>
          </div>
        )}

        {activeTab === "federations" && (
          <FederationsTable data={federationsQuery.data as FederationFormData[] | undefined} isLoading={federationsQuery.isLoading} search={searchQuery} onEdit={(item) => setFedModal({ mode: "edit", data: item })} onDelete={(id) => setDeleteConfirm({ entity: "federations", id })} />
        )}
        {activeTab === "events" && (
          <EventsTable data={eventsQuery.data as EventFormData[] | undefined} isLoading={eventsQuery.isLoading} search={searchQuery} onEdit={(item) => setEvtModal({ mode: "edit", data: item })} onDelete={(item) => setDeleteConfirm({ entity: "events", id: item.id, federationId: item.federationId })} />
        )}
        {activeTab === "clubs" && (
          <ClubsTable data={clubsQuery.data as ClubFormData[] | undefined} isLoading={clubsQuery.isLoading} search={searchQuery} onEdit={(item) => setClubModal({ mode: "edit", data: item })} onDelete={(item) => setDeleteConfirm({ entity: "clubs", id: item.id, federationId: item.federationId })} />
        )}
        {activeTab === "athletes" && (
          <AthletesTable data={athletesQuery.data as AthleteFormData[] | undefined} isLoading={athletesQuery.isLoading} search={searchQuery} onEdit={(item) => setAthModal({ mode: "edit", data: item })} onDelete={(item) => setDeleteConfirm({ entity: "athletes", id: item.id, federationId: item.federationId ?? null })} />
        )}
        {activeTab === "news" && (
          <AdminFedScope value={scopeFedId} onChange={setScopeFedId}>
            {(id) => <FedAdminNews federationId={id} />}
          </AdminFedScope>
        )}
        {activeTab === "streams" && (
          <AdminFedScope value={scopeFedId} onChange={setScopeFedId}>
            {(id) => <FedAdminStreams federationId={id} />}
          </AdminFedScope>
        )}
        {activeTab === "coaches" && (
          <AdminFedScope value={scopeFedId} onChange={setScopeFedId}>
            {(id) => <FedAdminCoaches federationId={id} />}
          </AdminFedScope>
        )}
        {activeTab === "venues" && <AdminVenuesPanel />}
        {activeTab === "schools" && <AdminSchoolsPanel />}
        {activeTab === "media" && (
          <AdminFedScope value={scopeFedId} onChange={setScopeFedId}>
            {(id) => <MediaLibrary federationId={id} />}
          </AdminFedScope>
        )}
        {activeTab === "hp" && (
          <AdminFedScope value={scopeFedId} onChange={setScopeFedId}>
            {(id) => <FedAdminHpPrograms federationId={id} />}
          </AdminFedScope>
        )}
        {activeTab === "contentSync" && <AdminContentSyncPanel />}
        {activeTab === "users" && <UsersAdminPanel />}
      </div>

      <EntityModal open={fedModal !== null} onClose={() => setFedModal(null)} title={fedModal?.mode === "create" ? "Add Federation" : "Edit Federation"}>
        {fedModal && <FederationForm mode={fedModal.mode} initialData={fedModal.mode === "edit" ? fedModal.data : undefined} onSuccess={() => setFedModal(null)} />}
      </EntityModal>
      <EntityModal open={evtModal !== null} onClose={() => setEvtModal(null)} title={evtModal?.mode === "create" ? "Add Event" : "Edit Event"}>
        {evtModal && <EventForm mode={evtModal.mode} federationIdLock={createLock} initialData={evtModal.mode === "edit" ? evtModal.data : undefined} onSuccess={() => setEvtModal(null)} />}
      </EntityModal>
      <EntityModal open={clubModal !== null} onClose={() => setClubModal(null)} title={clubModal?.mode === "create" ? "Add Club" : "Edit Club"}>
        {clubModal && <ClubForm mode={clubModal.mode} federationIdLock={createLock} initialData={clubModal.mode === "edit" ? clubModal.data : undefined} onSuccess={() => setClubModal(null)} />}
      </EntityModal>
      <EntityModal open={athModal !== null} onClose={() => setAthModal(null)} title={athModal?.mode === "create" ? "Register Athlete" : "Edit Athlete"}>
        {athModal && <AthleteForm mode={athModal.mode} federationIdLock={createLock} initialData={athModal.mode === "edit" ? athModal.data : undefined} onSuccess={() => setAthModal(null)} />}
      </EntityModal>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)" }} onClick={() => setDeleteConfirm(null)}>
          <div className="rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6" style={{ background: "rgba(17,17,17,0.95)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="text-white font-medium text-lg">Are you sure?</p>
              <p className="text-gray-400 text-sm mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 border border-white/10 text-gray-300 hover:text-white" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm} disabled={isDeletePending}>
                {isDeletePending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
