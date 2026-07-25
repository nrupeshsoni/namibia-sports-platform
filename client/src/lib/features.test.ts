import { describe, expect, it } from "vitest";
import {
  isAiChatEnabled,
  isGoogleAuthEnabled,
  isLiveNavForced,
  isWhatsAppSubscribeEnabled,
} from "./features";
import { safeHttpsHref } from "./safeHref";

describe("feature flags default off", () => {
  it("keeps Live force-show, WhatsApp, AI, and Google auth disabled without VITE_ overrides", () => {
    expect(isLiveNavForced()).toBe(false);
    expect(isWhatsAppSubscribeEnabled()).toBe(false);
    expect(isAiChatEnabled()).toBe(false);
    expect(isGoogleAuthEnabled()).toBe(false);
  });
});

describe("safeHttpsHref (client)", () => {
  it("only returns https hrefs", () => {
    expect(safeHttpsHref("https://nfa.org.na")).toBe("https://nfa.org.na/");
    expect(safeHttpsHref("javascript:alert(1)")).toBeNull();
    expect(safeHttpsHref("http://legacy.example")).toBeNull();
  });

  it("guards news sourceUrl / footer hrefs (A2)", () => {
    expect(safeHttpsHref("https://economist.com.na/sport/a")).toBe(
      "https://economist.com.na/sport/a"
    );
    expect(safeHttpsHref("javascript:void(0)")).toBeNull();
    expect(safeHttpsHref("data:text/html,xss")).toBeNull();
    expect(safeHttpsHref("//cdn.evil/x")).toBeNull();
    expect(safeHttpsHref(null)).toBeNull();
  });
});
