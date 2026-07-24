import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

const ALL = "__all__";

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
  /** Optional label override */
  label?: string;
  className?: string;
}

/**
 * Optional federation filter for Platform Admin lists ("All federations" default).
 */
export function AdminFederationFilter({
  value,
  onChange,
  label = "Federation filter",
  className = "max-w-md",
}: Props) {
  const federationsQuery = trpc.federations.listAll.useQuery();
  const feds = federationsQuery.data ?? [];

  return (
    <div className={className}>
      <Label className="text-sm text-gray-400">{label}</Label>
      <Select
        value={value?.toString() ?? ALL}
        onValueChange={(v) => onChange(v === ALL ? null : parseInt(v, 10))}
      >
        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
          <SelectValue placeholder="All federations" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
          <SelectItem value={ALL}>All federations</SelectItem>
          {feds.map((fed) => (
            <SelectItem key={fed.id} value={fed.id.toString()}>
              {fed.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
