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
  value: number | undefined;
  onChange: (id: number) => void;
}

/**
 * Federation picker for platform-admin create modals when no filter is locked.
 */
export function CreateFedPicker({ value, onChange }: Props) {
  const federationsQuery = trpc.federations.listAll.useQuery();

  return (
    <div>
      <Label className="text-sm text-gray-400">Federation *</Label>
      <Select
        value={value?.toString() ?? ""}
        onValueChange={(v) => onChange(parseInt(v, 10))}
      >
        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
          <SelectValue placeholder="Select federation" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
          {(federationsQuery.data ?? []).map((fed) => (
            <SelectItem key={fed.id} value={fed.id.toString()}>
              {fed.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
