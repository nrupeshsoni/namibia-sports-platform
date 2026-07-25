# 19 — Adversarial Gap Hunt

**Date:** 2026-07-25  
**Workspace:** `namibia-sports-platform`  
**Lens:** Find what prior audits miss — IDOR, open redirects, XSS, SSRF, `service_role` misuse, client env leaks, races, soft-delete gaps, federation slug collisions.  
**Prior audits consulted:** `docs/research/PRODUCTION_SECURITY_AUDIT.md` (2026-07-23), `docs/research/FULL_GAP_ANALYSIS.md`, `docs/architecture/RLS_POLICIES.md`.  
**Rules applied:** SEARCH FIRST · REUSE FIRST · NO ASSUMPTIONS · security.mdc · documentation.mdc.

---

## Verdict

Prior audits closed the obvious tenancy holes (`assertSameFederation` on write paths, stream `httpsUrlSchema`, PII gates, WhatsApp hard-off). This pass finds **residual attack surface that those checklists did not stress**: storage-path IDOR despite a federationId assert, news `sourceUrl` hrefs that never got the stream/federation `safeHttpsHref` treatment, Edge Function SSRF on og:image fetch, `service_role` used beyond “storage only”, and slug/soft-delete consistency bugs that enable wrong-tenant routing rather than classic write IDOR.

| Severity | Count |
|----------|------:|
| Critical (ops / credentials — already known) | 1 (reaffirmed, not re-opened as new code) |
| High (new or under-audited) | 4 |
| Medium | 7 |
| Low / informational | 5 |

---

## What prior audits already covered (do not re-litigate)

| Area | Status in prior audit |
|------|------------------------|
| Fed-admin write tenancy on events/news/streams/athletes/clubs | Assert + tests (`federationScope.test.ts`) |
| Stream `javascript:` via `streamUrl`/`embedUrl` | Fixed with `httpsUrlSchema` (H6) |
| Federation social `href` | Fixed with `safeHttpsHref` (M3) |
| WhatsApp public PII API | Hard-disabled |
| Athlete/coach `includePii` cross-tenant | Fixed |
| Hyperdrive `postgres` / git credential history | Critical human ops (C1/C2) |
| Login redirect open-redirect via query param | Not present — uses `window.location.origin` |

---

## HIGH

### A1 — `upload.image` IDOR: federationId assert ≠ entity ownership

**Missed by:** Production audit treated upload as “federationAdmin + assert” (checklist §3 / Admin CMS follow-up). `FULL_GAP_ANALYSIS` noted missing ownership; the later fix added `federationId` assert only.

**Evidence:**

```38:60:server/routers/upload.ts
    .mutation(async ({ ctx, input }) => {
      enforceRateLimit(`upload.image:${ctx.user.id ?? clientKey(ctx.req)}`, {
        ...RATE_LIMITS.upload,
        message: "Too many uploads. Please try again shortly.",
      });
      assertSameFederation(ctx.user, input.federationId);
      // ...
      const result = await uploadImage(
        input.entity as UploadEntity,
        input.entityId,
        buffer,
        contentType
      );
```

Contrast with `media.create`, which **does** resolve the entity’s owning federation:

```124:129:server/routers/media.ts
      const federationId = await resolveMediaFederationId(input.entityType, input.entityId);
      assertSameFederation(ctx.user, federationId);
```

**Attack:** Federation admin of tenant A calls `upload.image` with `federationId: A` (passes assert) and `entity: "athlete" | "club" | "federation" | "venue"`, `entityId: <B’s id>`. Object lands under `{entity}/{entityId}-…` in shared buckets; `upsert: true` can overwrite prior objects at colliding paths. Venue/federation entities are platform-scoped but still writable by any federation_admin this way.

**Fix direction:** Reuse `resolveMediaFederationId` (or equivalent) for upload; for `venue` require `adminProcedure` (or admin role); reject when entity row missing; add cross-tenant case to `federationScope.test.ts` that passes own `federationId` + foreign `entityId`.

---

### A2 — News `sourceUrl` / legacy footer links skip `safeHttpsHref`

**Missed by:** H6/M3 hardened streams + federation socials; news attribution links were never listed.

**Evidence (client renders raw `href`):**

- `client/src/components/NewsCard.tsx` — `href={sourceUrl}`
- `client/src/components/FeaturedNewsCard.tsx` — `href={article.sourceUrl}`
- `client/src/components/NewsArticleModal.tsx` — `href={sourceUrl}` (also from DB `sourceUrl` or parsed footer)
- `client/src/pages/admin/AdminContentSyncPanel.tsx` — `href={row.sourceUrl}`

**Server write path:** Aggregator stores RSS `item.link` with no URL scheme check (`supabase/functions/news-aggregator/index.ts`). `news.create` / `news.update` accept unbound `featuredImage: z.string()` (no `httpsUrlSchema`). `sourceUrl` is not on the fed-admin create schema today, but aggregator + any future admin field / direct DB edit feeds the client.

**Attack:** Compromised or hostile RSS item with `javascript:…` / `data:…` link → stored in `source_url` → click XSS in browsers that still honor `javascript:` in `<a href>`. Less dramatic: phishing via attacker-controlled `https://` that looks like an outlet (open external navigation — expected for “Read original”, but without allowlisting it is trust-of-feed).

**Fix direction:** Server: validate/normalize `source_url` / `featured_image` to `https:` (or null) on aggregator insert/update and on `news.*` mutations. Client: wrap every news/stream outbound link with existing `safeHttpsHref` (`client/src/lib/safeHref.ts`) — same pattern as `FederationModal`.

---

### A3 — SSRF via news-aggregator `fetchOgImage` / WP oEmbed

**Missed by:** Audits focused on Worker tRPC; Edge Function outbound fetch was not adversarial-reviewed.

**Evidence:**

```260:290:supabase/functions/news-aggregator/rss.ts
export async function fetchOgImage(articleUrl: string): Promise<string | null> {
  if (!isHttpUrl(articleUrl)) return null;
  // ... Google News unwrap ...
    const res = await fetch(lookupUrl, {
      headers: { /* … */ },
      signal: ctrl.signal,
      redirect: "follow",
    });
  // ...
  return fetchWpOembedThumbnail(lookupUrl);
}
```

`fetchWpOembedThumbnail` then hits `${origin}/wp-json/oembed/1.0/embed?url=…` for whatever origin the article URL claims. `isHttpUrl` allows `http:` and `https:`; **no** blocklist for link-local, RFC1918, metadata hosts, or DNS rebinding. Redirects are followed.

**Attack surface:** Any URL that appears in a trusted RSS/Google News item (or a poisoned feed entry) causes the Edge runtime to fetch it server-side. Classic targets: cloud metadata, internal admin panels on private IPs, file://-via-redirect chains where the platform allows them. Impact is **server-side** (Edge Function), not browser CSP.

**Fix direction:** Allowlist public hostnames (or deny private/reserved IP ranges after DNS resolve); force `https:`; cap redirects; do not oEmbed against arbitrary origins; prefer image URLs already present in the feed when possible.

---

### A4 — `service_role` used beyond “storage uploads only”

**Missed by:** Docs/`CLAUDE.md`/`env.ts` comment say service_role is storage-only; production audit repeated that story. Code disagrees.

| Consumer | Use |
|----------|-----|
| `server/services/supabaseStorage.ts` | Storage upload (documented) |
| `server/routers/users.ts` → `createAuthAndPlatformUser` | `auth.admin.createUser` with service_role |
| `supabase/functions/news-aggregator/index.ts` | Full PostgREST client as service_role (select/insert/update news) |

**Why it matters:** A leaked Worker secret or Edge secret is not “just buckets” — it is Auth Admin + unrestricted PostgREST relative to RLS. Aggregator kill-switch (`ENABLE_NEWS_AGGREGATOR`) reduces write volume but does not shrink key privilege if the function is invoked with the key present.

**Fix direction:** Split keys mentally and in runbooks: Auth Admin may need service_role (or a dedicated Auth admin path); document it honestly. Prefer a narrow DB role for aggregator inserts instead of service_role if PostgREST policies allow. Keep rotating per `SECURITY_CREDENTIAL_ROTATION.md` (still Critical ops).

---

## MEDIUM

### A5 — Federation slug / abbreviation collisions and fuzzy `getBySlug`

**Evidence:** `server/routers/federations.ts` resolution order: exact slug → `ilike` slug → `ilike` abbreviation → `fed-{id}` → **load all federations** and `nameToSlug(name) === slug`.

Gaps:

1. **DB `slug` UNIQUE is case-sensitive** (Postgres default). `Foo` and `foo` can both exist; `ilike` returns an arbitrary one (`limit 1`).
2. **`abbreviation` has no UNIQUE** (`drizzle/schema.ts`). Two federations can share `NFA`; abbreviation match is non-deterministic.
3. **Name-derived collision:** two distinct names that slugify identically → `.find` wins by scan order.
4. **`federations.create` does not set `slug`.** Nullable unique column → multiple `NULL` slugs allowed. Public URLs fall back to `fed-{id}` or name slugify, amplifying collision risk.
5. Soft-merge `mergedIntoSlug` is a free string — no FK / existence check on update.

**Impact:** Wrong federation shell / admin UI for a URL; SEO/canonical confusion; possible admin UX on the wrong tenant if a human follows a colliding deep link (API still scopes mutations by numeric `federationId`, so this is routing integrity, not silent cross-tenant write).

**Fix direction:** Generate slug on create; enforce `citext` or unique index on `lower(slug)` and `lower(abbreviation)`; remove or tightly scope step 5 full-table name match; validate `mergedIntoSlug` points at an active row.

---

### A6 — Soft-delete / lifecycle gaps

| Gap | Detail |
|-----|--------|
| Hard delete vs `isActive` | Clubs/athletes/coaches/HP have `isActive`, but `delete` mutations **hard-delete**. Streams comment admits no archive column. |
| No FK constraints | Schema uses bare `integer` federation/club ids — deletes leave orphans (athletes pointing at missing clubs, media rows pointing at missing entities). |
| Orphan media | `media.delete` is separate; entity delete does not cascade media or Storage objects. |
| `resolveCanonical` one-hop | Inactive A → B returns B even if B is inactive; no chain follow; no “successor must be active” check. |
| Role on inactive federation | `assignUserRole` only checks federation **exists**, not `isActive` / not-merged — can mint `federation_admin` for a soft-dead tenant. |
| Public list vs ID | Inactive federations hidden from `list`, but fuzzy slug paths + merge redirects create inconsistent visibility. |

**Fix direction:** Prefer soft-deactivate for CMS deletes; add FKs or cleanup jobs; harden `resolveCanonical`; reject role assignment to inactive/merged federations.

---

### A7 — Cross-tenant `clubId` attachment (integrity IDOR)

`athletes.create` / `update` and `coaches.create` / `update` accept `clubId` with **no** check that `clubs.federationId ===` athlete/coach `federationId`. A federation_admin can link their athlete to another federation’s club id (or a bogus id). Not a PII read, but corrupts directory joins (`getBySlug` leftJoin clubs) and future club-scoped RBAC.

---

### A8 — Public media enumeration

`media.list` (scoped by `entityType`+`entityId`) and `media.getById` are `publicProcedure` with no auth and no “is this entity public?” gate. Any client can probe sequential ids for `document` media of any club/athlete/event. If private PDFs were uploaded as `type: "document"`, URLs in `fileUrl` are exposed to enumeration (buckets are public-read per prior audit H5).

---

### A9 — News HTML XSS: mitigated in UI, weak at ingest (time bomb)

| Layer | Reality |
|-------|---------|
| Client modal/cards | Render `content` / `summary` as React **text** (`NewsArticleModal`) — HTML not executed today. |
| Aggregator `sanitizeHtml` | Regex strip of script/style/on\*/javascript:/iframe — bypass-prone (SVG, nested encodings, new tags). Used for `bodyHtml`; **stored content uses stripped `description`**, not `bodyHtml`. |
| Fed-admin `content` | Arbitrary string, no sanitize; safe only while UI stays text-only. |
| `dangerouslySetInnerHTML` | Only `chart.tsx` (Recharts) — OK. |

**Risk:** A future “rich news” renderer or email/push HTML path would inherit stored markup. Treat as **stored XSS debt**, not active browser RCE today.

---

### A10 — Race conditions

| Race | Location | Effect |
|------|----------|--------|
| Check-then-insert by slug | `news-aggregator` `maybeSingle` then `insert` | Duplicate key errors / skipped enrich under concurrent cron overlaps |
| Athlete slug two-phase | `insert` then `update` slug | Crash window → null slug rows |
| `inviteOrPromote` | Concurrent createUser + ensureUser for same email | Auth/profile skew (partially handled via conflict message) |
| Storage `upsert: true` | `supabaseStorage.uploadImage` | Concurrent uploads to same built path unlikely (timestamp in key) but entity-level logical races remain with A1 |
| Global unique slugs (clubs/events/news) | create without retry | Second writer gets DB unique violation — ensure TRPC surfaces CONFLICT, not 500 |

---

### A11 — Client-exposed forge / maps key

`client/src/components/Map.tsx` loads Maps via:

```ts
const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
```

Documented in `.env.example` as optional `VITE_*` (by design browser-visible). Still a **billing/quota abuse** key if unrestricted at the forge proxy. Server also holds `BUILT_IN_FORGE_API_KEY` (not `VITE_`) for Worker-side forge helpers — do not conflate or copy the server key into `VITE_`.

Anon Supabase JWT in `.env.production` was already accepted as public-by-design (audit M5).

---

## LOW / informational

### A12 — Login / OAuth redirects

`AuthContext` and `getLoginUrl()` build redirects from `window.location.origin` — **not** an open redirect. Residual risk is only if a malicious site hosts a phishing clone (out of scope).

### A13 — Stream client defense-in-depth

Server now requires `https:` for stream URLs; client `Live.tsx` / `FederationStreams.tsx` still bind `href={stream.streamUrl}` and `window.open(stream.streamUrl)` without `safeHttpsHref`. Legacy rows inserted before H6 could still be unsafe until scrubbed.

### A14 — Aggregator `matchFederation` over-match

Partial `includes` matching can attribute an article to the wrong federation (content integrity / reputation), not a security boundary bypass.

### A15 — `contentSync.status` capability leak

Exposes `anthropicConfigured: boolean` to platform admins only — low info disclosure.

### A16 — Admin silent no-op deletes

`athletes.delete` asserts ownership but omits the explicit `existing.federationId !== input.federationId` → NOT_FOUND pattern used in clubs; a platform admin with mismatched claim can get `{ success: true }` with zero rows deleted. Reliability / confused-deputy hygiene, not fed-admin IDOR.

---

## Threat model notes (Hyperdrive / RLS)

Reaffirmed, not new: Drizzle over Hyperdrive uses a role that does not evaluate RLS. tRPC + explicit asserts are the **only** tenancy boundary. A1 matters more because of that — there is no Storage RLS or DB RLS backstop for wrong-path uploads beyond bucket policies (public read).

---

## Priority fix order (code)

1. **A1** — Entity ownership on `upload.image` (+ tests).  
2. **A2** — `safeHttpsHref` on all news source links + https validation on aggregator/`news` URL fields.  
3. **A3** — SSRF controls on `fetchOgImage` / oEmbed.  
4. **A4** — Document + minimize service_role (Auth Admin vs Storage vs aggregator).  
5. **A5–A7** — Slug uniqueness/generation, soft-delete discipline, clubId tenant check.  
6. **A8–A11** — Media enumeration policy, HTML sanitize/render contract, races, forge key restrictions.

---

## Verification performed this hunt

- Grep/read of all `server/routers/*` mutation assert patterns vs `media`/`upload` asymmetry.  
- Client news/stream/federation href usage vs `safeHttpsHref`.  
- Full read of `supabase/functions/news-aggregator/rss.ts` og:image path.  
- `service_role` / `createClient` call sites.  
- `VITE_*` client env usage.  
- Federation `getBySlug` + schema uniqueness.  
- Soft-delete / `isActive` / hard `delete` consistency.  
- Cross-check against `PRODUCTION_SECURITY_AUDIT.md` so findings are additive.

**No code changes in this wave** — research deliverable only.

---

## Changelog stub (for implementers)

When fixes land, update `CHANGELOG.md` `[Unreleased]` under **Security** with A1–A4 IDs, and tick related items in `docs/06_tasks.md` if tracked there.
