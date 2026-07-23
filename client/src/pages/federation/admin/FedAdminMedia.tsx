import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function FedAdminMedia({ federationId }: { federationId: number }) {
  return <MediaLibrary federationId={federationId} />;
}
