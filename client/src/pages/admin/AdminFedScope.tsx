import { AdminFederationFilter } from "./AdminFederationFilter";

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
  children: (federationId: number | undefined) => React.ReactNode;
}

/**
 * Platform admin optional federation filter around FedAdmin CRUD panels.
 * Default is all federations; a selection filters the list and seeds create forms.
 */
export function AdminFedScope({ value, onChange, children }: Props) {
  return (
    <div className="space-y-4">
      <AdminFederationFilter
        value={value}
        onChange={onChange}
        label="Federation filter (optional — create forms use selection when set)"
      />
      {children(value ?? undefined)}
    </div>
  );
}
