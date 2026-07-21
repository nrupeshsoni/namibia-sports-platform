import { describe, expect, it } from "vitest";
import { clientKey, enforceRateLimit } from "./_core/rateLimit";

describe("enforceRateLimit", () => {
  it("allows up to the limit and rejects the next call", () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 3, windowMs: 60_000 };

    expect(() => {
      enforceRateLimit(key, opts);
      enforceRateLimit(key, opts);
      enforceRateLimit(key, opts);
    }).not.toThrow();

    expect(() => enforceRateLimit(key, opts)).toThrow(/too many/i);
  });

  it("counts each key separately", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    const a = `test:a:${Math.random()}`;
    const b = `test:b:${Math.random()}`;

    enforceRateLimit(a, opts);

    expect(() => enforceRateLimit(b, opts)).not.toThrow();
  });

  it("starts a fresh window once the old one has elapsed", async () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 1, windowMs: 5 };

    enforceRateLimit(key, opts);
    expect(() => enforceRateLimit(key, opts)).toThrow();

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(() => enforceRateLimit(key, opts)).not.toThrow();
  });
});

describe("clientKey", () => {
  it("prefers the Cloudflare-set header over client-supplied ones", () => {
    const req = new Request("https://example.test/", {
      headers: {
        "cf-connecting-ip": "203.0.113.5",
        "x-forwarded-for": "198.51.100.9, 203.0.113.5",
      },
    });

    expect(clientKey(req)).toBe("203.0.113.5");
  });
});
