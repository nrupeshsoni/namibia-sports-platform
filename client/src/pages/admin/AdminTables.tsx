import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { FederationFormData } from "@/components/admin/FederationForm";
import type { EventFormData } from "@/components/admin/EventForm";
import type { ClubFormData } from "@/components/admin/ClubForm";
import type { AthleteFormData } from "@/components/admin/AthleteForm";

export function TableShell({
  isLoading,
  empty,
  children,
}: {
  isLoading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
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

export function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 text-xs tracking-widest text-gray-400 font-medium border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {children}
    </th>
  );
}

export function Td({ children }: { children?: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-300 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      {children}
    </td>
  );
}

export function RowActions({
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

export function FederationsTable({
  data,
  isLoading,
  search,
  onEdit,
  onDelete,
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
          <tr>
            <Th>Name</Th>
            <Th>Abbreviation</Th>
            <Th>Type</Th>
            <Th>Email</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
              <Td>
                <span className="text-white font-medium">{f.name}</span>
              </Td>
              <Td>{f.abbreviation ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <Badge variant="secondary" className="text-xs">
                  {f.type}
                </Badge>
              </Td>
              <Td>{f.email ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions onEdit={() => onEdit(f)} onDelete={() => onDelete(f.id)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

export function EventsTable({
  data,
  isLoading,
  search,
  onEdit,
  onDelete,
}: {
  data: EventFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: EventFormData) => void;
  onDelete: (item: EventFormData) => void;
}) {
  const filtered = (data ?? []).filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Start Date</Th>
            <Th>Location</Th>
            <Th>Region</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
              <Td>
                <span className="text-white font-medium">{e.name}</span>
              </Td>
              <Td>
                <Badge variant="secondary" className="text-xs">
                  {e.type ?? "—"}
                </Badge>
              </Td>
              <Td>
                {e.startDate ? new Date(e.startDate).toLocaleDateString() : <span className="text-gray-600">—</span>}
              </Td>
              <Td>{e.location ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{e.region ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions onEdit={() => onEdit(e)} onDelete={() => onDelete(e)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

export function ClubsTable({
  data,
  isLoading,
  search,
  onEdit,
  onDelete,
}: {
  data: ClubFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: ClubFormData) => void;
  onDelete: (item: ClubFormData) => void;
}) {
  const filtered = (data ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>City</Th>
            <Th>Region</Th>
            <Th>Email</Th>
            <Th>Founded</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
              <Td>
                <span className="text-white font-medium">{c.name}</span>
              </Td>
              <Td>{c.city ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.region ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.contactEmail ?? <span className="text-gray-600">—</span>}</Td>
              <Td>{c.establishedYear ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions onEdit={() => onEdit(c)} onDelete={() => onDelete(c)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

export function AthletesTable({
  data,
  isLoading,
  search,
  onEdit,
  onDelete,
}: {
  data: AthleteFormData[] | undefined;
  isLoading: boolean;
  search: string;
  onEdit: (item: AthleteFormData) => void;
  onDelete: (item: AthleteFormData) => void;
}) {
  const filtered = (data ?? []).filter((a) => {
    const name = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });
  return (
    <TableShell isLoading={isLoading} empty={filtered.length === 0}>
      <table className="w-full">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>Email</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
              <Td>
                <span className="text-white font-medium">
                  {a.firstName} {a.lastName}
                </span>
              </Td>
              <Td>{a.gender ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                {a.dateOfBirth ? (
                  new Date(a.dateOfBirth).toLocaleDateString()
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </Td>
              <Td>{a.email ?? <span className="text-gray-600">—</span>}</Td>
              <Td>
                <RowActions onEdit={() => onEdit(a)} onDelete={() => onDelete(a)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
