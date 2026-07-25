/**
 * Public federation sub-nav honesty: hide Clubs / Athletes / News / Streams / Media
 * when that federation has zero published items. Home + Events always stay.
 */

export type FederationTabInventory = {
  clubs: number;
  athletes: number;
  news: number;
  streams: number;
  media: number;
};

export function isInventoryGatedTab(path: string): boolean {
  return path === "clubs" || path === "athletes" || path === "news" || path === "streams" || path === "media";
}

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
  if (path === "media") return inventory.media > 0;
  return true;
}
