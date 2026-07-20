/**
 * Product feature flags for beta UX honesty.
 * Live route (`/live`) always works; primary-nav visibility is gated separately.
 */

/**
 * Force-show Live in primary nav regardless of stream inventory.
 * Default: unset/false — nav uses {@link useShowLiveNav} inventory check instead.
 */
export function isLiveNavForced(): boolean {
  return import.meta.env.VITE_SHOW_LIVE_NAV === "true";
}
