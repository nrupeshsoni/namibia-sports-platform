/**
 * Public federation sub-nav honesty: hide Clubs / Athletes / News / Streams
 * when that federation has zero published items. Home + Events always stay.
 * Admins pass `showAllTabs` so federation_admin can still open empty CMS targets.
 */

export type FederationTabInventory = {
  clubs: number;
  athletes: number;
  news: number;
  streams: number;
};

/** Tab paths gated by inventory for anonymous / non-admin public nav. */
export function isInventoryGatedTab(path: string): boolean {
  return path === "clubs" || path === "athletes" || path === "news" || path === "streams";
}

/**
 * Whether a federation public tab should appear in the sticky nav.
 * @param path - Tab path segment (`""` = Home, `events`, `clubs`, …)
 * @param inventory - Published/active counts for gated tabs
 * @param showAllTabs - true for platform/federation admin preview
 */
export function shouldShowFederationPublicTab(
  path: string,
  inventory: FederationTabInventory,
  showAllTabs: boolean
): boolean {
  if (showAllTabs) return true;
  if (!isInventoryGatedTab(path)) return true;
  if (path === "clubs") return inventory.clubs > 0;
  if (path === "athletes") return inventory.athletes > 0;
  if (path === "news") return inventory.news > 0;
  if (path === "streams") return inventory.streams > 0;
  return true;
}
