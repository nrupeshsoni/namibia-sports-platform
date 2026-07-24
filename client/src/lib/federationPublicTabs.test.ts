import { describe, expect, it } from "vitest";
import {
  isInventoryGatedTab,
  shouldShowFederationPublicTab,
  type FederationTabInventory,
} from "./federationPublicTabs";

const empty: FederationTabInventory = { clubs: 0, athletes: 0, news: 0, streams: 0 };
const full: FederationTabInventory = { clubs: 2, athletes: 1, news: 3, streams: 1 };

describe("federationPublicTabs", () => {
  it("gates clubs/athletes/news/streams only", () => {
    expect(isInventoryGatedTab("")).toBe(false);
    expect(isInventoryGatedTab("events")).toBe(false);
    expect(isInventoryGatedTab("clubs")).toBe(true);
    expect(isInventoryGatedTab("athletes")).toBe(true);
    expect(isInventoryGatedTab("news")).toBe(true);
    expect(isInventoryGatedTab("streams")).toBe(true);
  });

  it("keeps Home and Events for public even when inventory is empty", () => {
    expect(shouldShowFederationPublicTab("", empty, false)).toBe(true);
    expect(shouldShowFederationPublicTab("events", empty, false)).toBe(true);
  });

  it("hides empty inventory tabs for public visitors", () => {
    expect(shouldShowFederationPublicTab("clubs", empty, false)).toBe(false);
    expect(shouldShowFederationPublicTab("athletes", empty, false)).toBe(false);
    expect(shouldShowFederationPublicTab("news", empty, false)).toBe(false);
    expect(shouldShowFederationPublicTab("streams", empty, false)).toBe(false);
  });

  it("shows inventory tabs when counts are positive", () => {
    expect(shouldShowFederationPublicTab("clubs", full, false)).toBe(true);
    expect(shouldShowFederationPublicTab("athletes", full, false)).toBe(true);
    expect(shouldShowFederationPublicTab("news", full, false)).toBe(true);
    expect(shouldShowFederationPublicTab("streams", full, false)).toBe(true);
  });

  it("shows all tabs for admin preview even when empty", () => {
    expect(shouldShowFederationPublicTab("clubs", empty, true)).toBe(true);
    expect(shouldShowFederationPublicTab("streams", empty, true)).toBe(true);
  });
});
