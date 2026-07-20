import { trpc } from "@/lib/trpc";
import { isLiveNavForced } from "@/lib/features";

type StreamRow = {
  isLive: boolean;
  scheduledStart: string | Date | null;
};

/**
 * Show Live in primary nav only when something is live or scheduled upcoming.
 * Completed/on-demand VODs alone do not promote Live (beta honesty).
 * While loading, hide to avoid flashing an empty Live destination.
 */
export function useShowLiveNav(): boolean {
  const forced = isLiveNavForced();
  const { data, isLoading } = trpc.streams.list.useQuery({});

  if (forced) return true;
  if (isLoading || !data) return false;

  const now = Date.now();
  return (data as StreamRow[]).some(
    (s) =>
      s.isLive ||
      (s.scheduledStart != null && new Date(s.scheduledStart).getTime() > now)
  );
}
