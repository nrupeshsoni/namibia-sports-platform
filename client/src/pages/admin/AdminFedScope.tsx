import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

interface Props {
  value: number | null;
  onChange: (id: number) => void;
  children: (federationId: number) => React.ReactNode;
}

/** Platform admin picker that scopes FedAdmin CRUD panels to one federation. */
export function AdminFedScope({ value, onChange, children }: Props) {
  const federationsQuery = trpc.federations.listAll.useQuery();
  const feds = federationsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <Label className="text-sm text-gray-400">Working federation</Label>
        <Select
          value={value?.toString() ?? ""}
          onValueChange={(v) => onChange(parseInt(v, 10))}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
            <SelectValue placeholder="Select a federation to manage" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
            {feds.map((fed) => (
              <SelectItem key={fed.id} value={fed.id.toString()}>
                {fed.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {value != null ? (
        children(value)
      ) : (
        <p className="text-gray-500 text-sm py-8">Select a federation to manage its content.</p>
      )}
    </div>
  );
}
