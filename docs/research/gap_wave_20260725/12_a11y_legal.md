# Gap Wave — A11Y / Legal / Privacy

**Wave:** `gap_wave_20260725`  
**Doc:** `12_a11y_legal.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Scope:** Privacy/Terms, cookie consent, WCAG basics, focus states, aria on ticker/map, registration terms, PII retention  
**Method:** Codebase grep + file reads (no live axe/Lighthouse run; no DB mutations)  
**DB mutations this analysis:** none

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Combined A11Y / Legal / Privacy score** | **68 / 100** |
| Soft-public legal floor (Privacy + Terms + footers + Register checkbox) | **Met** |
| Cookie / storage transparency | **Not met** |
| WCAG 2.2 AA readiness (public hubs) | **Partial — not claimable** |
| PII public API stripping | **Strong** |
| Retention / DSAR / account erasure ops | **Weak / policy-only** |

**One-line decision:** Legal pages and Register acceptance are shippable for soft public beta; do **not** claim WCAG AA, POPIA-complete retention, or cookie-compliance until the P1 gaps below close. Prior scorecard Legal **92** overstated residual cookie, federation-footer, Google-OAuth terms, and a11y surface debt.

### Score breakdown

| Pillar | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Privacy / Terms content & discoverability | 86 | 22% | Live pages; honest NSC placeholder; hub footers; Fed sites miss links |
| Cookie / tracking consent | 35 | 12% | No banner; Privacy silent on cookies/localStorage; Umami commented |
| WCAG basics (landmarks, skip, contrast, media alt) | 58 | 18% | `lang=en`, some `<main>`; no skip link; CSS heroes; footer contrast weak |
| Focus states | 70 | 12% | shadcn `focus-visible` solid; several custom `outline-none` without ring |
| Ticker / Map ARIA | 55 | 14% | Ticker region + reduced-motion OK; Map/panel under-labelled; marquee a11y debt |
| Registration terms acceptance | 72 | 12% | Email path gated; client-only; Google OAuth bypass when flag on |
| PII retention & subject rights ops | 52 | 10% | Public strip strong; retention vague; no self-serve delete / audit trail |

**Weighted ≈ 68.**

---

## 2. Inventory — what exists

| Asset | Path / surface | Status |
|-------|----------------|--------|
| Privacy Policy | `/privacy` → `client/src/pages/legal/Privacy.tsx` | **Live** (last updated 21 Jul 2026) |
| Terms of Use | `/terms` → `client/src/pages/legal/Terms.tsx` | **Live** |
| Legal layout | `client/src/pages/legal/LegalPageLayout.tsx` | Shared glass/dark shell + `<main>` |
| Routes | `App.tsx` `/privacy`, `/terms` | Wired |
| SEO | `SeoHead` static match for both | Present |
| Sitemap | `/privacy`, `/terms` hubs included | Present (per CHANGELOG / SEO docs) |
| Hub footers | Home, Events (inline); News / Live / Map via `SiteLegalFooter` | Present |
| Federation public shells | `FederationLayout.tsx` | **No** Privacy/Terms footer |
| Register acceptance | `Register.tsx` checkbox + client gate | Present (email path) |
| Cookie consent UI | — | **Absent** |
| Analytics cookies | `index.html` Umami comment only | Off / unset |
| First-party storage | `theme` localStorage; PWA dismiss; sidebar cookie `sidebar_state` | Undisclosed in Privacy |
| Public PII strip | `athletes` / `coaches` / `clubs` / `venues` / `schools` routers | Present |
| WhatsApp consent column | `consent_at` + migration | Schema ready; API hard-off |
| Account deletion API / UI | — | **Absent** |
| Automated retention jobs | — | **Absent** |
| A11y test tooling | axe / pa11y / jsx-a11y in CI | **Absent** |

---

## 3. Privacy / Terms — gaps

### Done (keep)

- Operator disclosure: The Dome Technologies + Facilit8 Namibia.
- Honest **NSC / statutory controller placeholder** (amber callout) — not fake government branding.
- Purposes, athlete directory language, WhatsApp/marketing **opt-in only**, rights list, Namibian governing law (Terms), cross-links Privacy ↔ Terms.
- Contact mailboxes named: `privacy@sports.com.na`, `legal@sports.com.na`.
- Discoverable from Home/Events/News/Live/Map + legal page footers.

### Gaps

| ID | Severity | Gap | Evidence | Fix direction |
|----|----------|-----|----------|---------------|
| L1 | **P1** | Privacy has **no Cookies / similar technologies** section | `Privacy.tsx` §§3–8; no cookie/localStorage mention | Add section: essential UI prefs (`theme`, PWA dismiss, admin sidebar cookie), auth via Supabase JWT (not app session cookie), optional Umami when enabled |
| L2 | **P1** | Retention is qualitative only (“reasonable period”) | `Privacy.tsx` §8 | Publish concrete defaults (e.g. inactive accounts N months; WA rows until unsubscribe + M days; logs 30–90d) + who can request erasure |
| L3 | **P1** | No documented DSAR SLA / identity-verification process | Rights §9 is a mailto only | Internal runbook + public “we respond within X days” |
| L4 | **P2** | Federation public pages omit legal links | `FederationLayout.tsx` ends at `<main>`; no `SiteLegalFooter` | Add compact footer on Fed shells |
| L5 | **P2** | Controller relationship still placeholder | Privacy §2 / Terms §1 amber boxes | Block “official NSC platform” marketing until signed; keep honest copy until then |
| L6 | **P2** | Mailboxes `privacy@` / `legal@` not verified in-repo as routed | Policy text only | Confirm MX/forwarding before ads/crawl push |
| L7 | **P3** | Children §10 is thin (no age threshold, no parental consent flow) | Privacy §10 | Align with junior athlete upload SOP for Fed admins |
| L8 | **P3** | International transfer / processor list incomplete | §7 names CF, Supabase, AI, WA | Name regions (EU West Supabase, CF edge) + subprocessors table |

**Scorecard correction:** Legal content for soft beta = **Done**. Legal *ops completeness* (cookies, retention numbers, Fed footers, mailbox proof) = **Open**.

---

## 4. Cookie consent

| Check | Result |
|-------|--------|
| Cookie banner / preference centre | **Missing** |
| Privacy discloses cookies | **No** |
| Non-essential trackers live | **No** (Umami script commented; no gtag) |
| First-party cookies / storage in use | **Yes** — `sidebar_state` cookie (`sidebar.tsx`); `localStorage` theme + PWA dismiss; auth is bearer JWT not `COOKIE_NAME` session |

### Verdict

- **Soft public (Namibia-first, no ads, analytics off):** cookie *banner* is not a hard blocker if Privacy discloses essential storage — but **L1 is still required**.
- **Before Umami / ads / EU-targeted campaigns:** ship notice + opt-in for non-essential scripts; keep essential prefs outside consent wall.
- Do **not** treat “no analytics” as “no cookies” — the sidebar cookie and localStorage prefs exist today.

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| C1 | **P1** | No consent UX when analytics later lands | Gate Umami behind consent + update Privacy |
| C2 | **P1** | Undisclosed first-party storage | Privacy § cookies (L1) |
| C3 | **P3** | Dead `COOKIE_NAME` / docs still mention cookie sessions | Align `docs/03_api…`, `SECURITY.md` with JWT-in-header reality |

---

## 5. WCAG basics

Baseline: **WCAG 2.2 Level AA** as the public claim target. Current state does **not** support an AA claim.

| Criterion (sample) | Status | Notes |
|--------------------|--------|-------|
| 1.1.1 Non-text content | **Fail / Partial** | Home/Events/Fed cards use CSS `backgroundImage` for content imagery → no `alt`. Ticker thumbs use `alt=""` (OK if decorative beside title). |
| 1.3.1 Info & relationships | **Partial** | Legal/auth/Fed/admin use `<main>`; Home hero is a bare `<section>` inside app `<main>`. |
| 1.4.3 Contrast | **Risk** | `SiteLegalFooter` / legal footer use `text-gray-600` / `gray-700` on near-black — likely **&lt; 4.5:1** for small text. Body copy on legal pages (`gray-300`) is OK. |
| 2.1.1 Keyboard | **Partial** | Radix/shadcn generally OK; Leaflet map markers/popups are mouse-first; custom dropdowns without listbox pattern. |
| 2.2.2 Pause/Stop/Hide | **Fail (ticker)** | Infinite CSS marquee has no pause control; reduced-motion path helps but default users get moving content. |
| 2.4.1 Bypass blocks | **Fail** | No “Skip to main content” link. |
| 2.4.7 Focus Visible | **Partial** | See §6. |
| 3.1.1 Language | **Pass** | `<html lang="en">` in `client/index.html`. |
| 4.1.2 Name/Role/Value | **Partial** | Ticker region labelled; Map + region combobox under-specified (see §7). |

### Other basics

| Item | Status |
|------|--------|
| `prefers-reduced-motion` (global CSS + ticker) | **Partial** — ticker handled; Map `flyTo` / Framer Motion / hero carousel still animate |
| Touch target ≥44px (mobile audit) | **Partial** — Map region buttons / news modal close improved; ticker items `min-h-[36px]` |
| Automated a11y in CI | **Missing** |
| Live region for async errors (Register) | Error is plain `<p>` — OK if tied via `aria-describedby` (not currently) |

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| A1 | **P1** | No skip link | Add visually-hidden skip → `#main` on App shell |
| A2 | **P1** | Content images as CSS backgrounds | Prefer `<img alt="…">` or `role="img"` + `aria-label` for hero/fed cards |
| A3 | **P1** | Footer / muted link contrast | Raise footer links to ≥ `gray-400` / theme token that passes AA |
| A4 | **P2** | No axe/Lighthouse gate | Add CI smoke (axe-core on `/`, `/news`, `/map`, `/privacy`) |
| A5 | **P2** | Hero carousel `animate-bounce` + auto-rotate ignore reduced-motion | Honor `prefers-reduced-motion` for hero interval + bounce |

---

## 6. Focus states

| Layer | Assessment |
|-------|------------|
| shadcn primitives (`Button`, `Input`, `Checkbox`, `Tabs`, …) | **Good** — consistent `focus-visible:ring-[3px]` / ring-ring |
| Dashboard / sidebar | **Good** — explicit `focus-visible:ring-2` |
| Home search input | **Weak** — `focus:outline-none` **without** ring (`Home.tsx`) |
| Fed Clubs / Athletes search | **Weak** — `focus:outline-none` only |
| Events search | **OK-ish** — `focus:ring-1 focus:ring-white/20` (low contrast) |
| Hero CTAs / many custom glass buttons | **Weak** — hover/scale only; no focus ring classes |
| News ticker headline buttons | **Weak** — no focus-visible styles on `.news-ticker-item` |
| Map region filter button | **Weak** — no focus ring; missing `aria-expanded` |
| Legal / Register back buttons | **Weak** — hover background only |

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| F1 | **P1** | Custom page controls strip outline without replacement | Shared `focus-ring` utility on chrome buttons/inputs |
| F2 | **P2** | Ticker items not visibly focusable in marquee | Focus styles + pause-on-focus (ties to T2) |

---

## 7. ARIA — News ticker & Map

### 7.1 `NewsTicker` (`client/src/components/NewsTicker.tsx`)

| Practice | Status |
|----------|--------|
| `role="region"` + `aria-label="Latest sports news headlines"` | **Present** |
| `aria-hidden={!visible}` when scrolled away | **Present** (hides from AT when off) |
| `prefers-reduced-motion` → static horizontal list | **Present** |
| Decorative thumb `alt=""` / dot `aria-hidden` | **Present** |
| Pause / stop for moving marquee | **Missing** |
| `aria-live` for new headlines | **Missing** (optional; avoid noisy polite spam) |
| Duplicate DOM in marquee (segments `a` + `b`) | **Issue** — doubled buttons/tab stops for same articles when motion OK |
| “All →” control | **Weak** — `Link` wrapping `<span>`, not a clear link name (“All news”) |
| Focus styles on headline buttons | **Missing** |

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| T1 | **P1** | Marquee fails pause/stop (2.2.2) | Pause on hover/focus; or CSS pause button; or reduced-motion-only marquee |
| T2 | **P1** | Duplicate tab stops in cloned track | `aria-hidden` on duplicate segment **or** use pure CSS without second interactive clone |
| T3 | **P2** | “All →” accessible name | Text link: “All news” |
| T4 | **P3** | No `aria-live` | Only if headlines update client-side without navigation |

### 7.2 Map (`client/src/pages/Map.tsx` + `MapRegionPanel.tsx`)

| Practice | Status |
|----------|--------|
| Page title / chrome “INTERACTIVE MAP” | Visual only |
| `MapContainer` / map pane accessible name | **Missing** — no `aria-label` / `role="application"` or documented keyboard help |
| Region markers | Div-icons; **no `title` / `alt` / ARIA name** on marker; colour alone encodes selection (red vs green) |
| Popup content | Text OK; filter button inside popup OK |
| `MapRegionPanel` `<aside>` | Present; **no** `aria-label` |
| Region dropdown | Custom button list — **no** `aria-expanded`, `aria-haspopup`, `aria-controls`, listbox/option roles |
| Loading state | Spinner only — no `aria-busy` / live “Loading map” |
| `flyTo` animation | Ignores `prefers-reduced-motion` |
| Keyboard map use | Leaflet default: limited; no documented alternative list (panel lists help somewhat) |

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| M1 | **P1** | Map region control not a disclosed combobox/listbox | Add `aria-expanded` / `aria-controls` + focus trap or native `<select>` fallback |
| M2 | **P1** | Markers unnamed / colour-only state | `title`/`alt` on icon HTML; don’t rely on colour alone (pattern/label in popup + panel) |
| M3 | **P2** | Map container unnamed | `aria-label="Namibia sports venues map"` on wrapper; keyboard help text in panel |
| M4 | **P2** | `flyTo` vs reduced-motion | Use `setView` instantly when `prefers-reduced-motion: reduce` |
| M5 | **P3** | Loader not announced | `role="status"` + “Loading map” |

---

## 8. Registration terms acceptance

| Check | Result |
|-------|--------|
| Checkbox + label linking `/terms` and `/privacy` | **Yes** (`Register.tsx`) |
| Client submit blocked if unchecked | **Yes** |
| Submit button `disabled={!acceptedTerms}` | **Yes** |
| `aria-required` on checkbox | **Yes** |
| Server / DB record of acceptance (timestamp, policy version) | **No** |
| Supabase `signUp` metadata includes terms flag | **No** (only email/password/name) |
| Google OAuth button respects checkbox | **No** — `handleGoogle` does not check `acceptedTerms` (relevant when `VITE_ENABLE_GOOGLE_AUTH` on) |
| Login path re-acceptance on policy change | **No** |

| ID | Severity | Gap | Fix |
|----|----------|-----|-----|
| R1 | **P1** | Google path can bypass Terms checkbox | Disable Google until checked **or** interstitial acceptance |
| R2 | **P1** | Acceptance not persisted | Store `termsAcceptedAt` + `privacyAcceptedAt` (user metadata or `sportsplatform_users` columns) with policy version dates |
| R3 | **P2** | Policy updates don’t force re-consent | Compare `lastUpdated` vs stored acceptance; prompt if newer |

---

## 9. PII retention & handling

### Strengths (keep)

- Public athlete responses strip `email`, `phone`, `dateOfBirth` (`stripAthletePii`).
- Coaches / clubs / venues / schools strip contact fields for non-staff.
- Privacy states public athlete pages hide contact/DOB by default — **matches API**.
- WhatsApp `consent_at` prepared; public WA API hard-disabled.
- Federation admins warned in Terms about minors / private contacts.

### Gaps

| ID | Severity | Gap | Evidence | Fix |
|----|----------|-----|----------|-----|
| P1 | **P1** | No user-facing account deletion / export | No router/UI | Self-serve or mailto DSAR with SLA; document in Privacy |
| P2 | **P1** | Retention not operationalised | No jobs; Privacy §8 vague | Define TTLs; cron/Edge Function for inactive WA + orphaned sessions |
| P3 | **P2** | Athlete/coach PII retained indefinitely in DB even when stripped from public API | Schema columns remain | Admin retention policy; soft-delete + purge schedule for withdrawn athletes |
| P4 | **P2** | No proof of consent for Register | Client checkbox only | R2 |
| P5 | **P2** | Shared Supabase project (~737 tables) — blast-radius for PII dumps | Architecture docs | Reinforce least-privilege Hyperdrive role (ops); never unscoped dumps |
| P6 | **P3** | Research docs in repo contain real federation contact PII | `docs/research/*contacts*` | Ensure not shipped to public Worker assets (docs are not); avoid committing unnecessary personal emails long-term |
| P7 | **P3** | AI chat (when enabled) may send user text to Anthropic | Privacy §7 mentions AI | Explicit AI processing notice + disable by default (already flagged off) |

---

## 10. Priority backlog (actionable)

### P0 — before broader marketing / ads

_None unique to this pillar if security credential rotation is tracked elsewhere._ Soft beta can proceed with honest legal pages **if** marketing does not claim official NSC controller status or WCAG AA.

### P1 — close for “legal + a11y honest soft public”

1. **L1 / C2** — Privacy: Cookies & local storage section.  
2. **L2 / P1–P2** — Concrete retention + DSAR path (even if email-operated).  
3. **R1 / R2** — Persist terms acceptance; block Google until accepted.  
4. **A1 / A3 / F1** — Skip link; footer contrast; shared focus ring on custom chrome.  
5. **T1 / T2** — Ticker pause + no duplicate tab stops.  
6. **M1 / M2** — Map region combobox ARIA + named markers.  
7. **L4** — `SiteLegalFooter` on federation public layout.

### P2 — AA trajectory

8. **A2 / A5** — Real image alternatives; reduced-motion on hero/map fly.  
9. **A4** — axe CI smoke.  
10. **C1** — Consent gate before enabling Umami.  
11. **R3 / L3** — Re-consent + DSAR SLA.  
12. **M3 / M4 / T3** — Map naming, reduced-motion fly, “All news” link text.

### P3 — polish

13. Children / transfer detail (L7–L8); AI notice; research-doc PII hygiene; loader live regions.

---

## 11. Suggested revised domain scores

| Domain (scorecard lens) | Prior (2026-07-25 scorecard) | This audit | Notes |
|-------------------------|-----------------------------:|-----------:|-------|
| Legal | 92 | **78** | Pages+footers+Register yes; cookies/retention/Fed footer/Google gap |
| Frontend (a11y slice) | (rolled into 91) | **a11y ~60** | Don’t claim AA; ticker/map/focus/skip debt |
| Combined pillar (this doc) | — | **68** | Use for wave synthesis |

---

## 12. File index (touched by this audit)

| Area | Paths |
|------|-------|
| Legal UI | `client/src/pages/legal/{Privacy,Terms,LegalPageLayout}.tsx` |
| Footers | `client/src/components/SiteLegalFooter.tsx`; Home/Events footers; Fed layout (gap) |
| Register | `client/src/pages/auth/Register.tsx` |
| Ticker | `client/src/components/NewsTicker.tsx`; `client/src/index.css` (marquee) |
| Map | `client/src/pages/Map.tsx`; `client/src/components/MapRegionPanel.tsx` |
| Storage | `ThemeContext.tsx`; `PWAInstallBanner.tsx`; `components/ui/sidebar.tsx` |
| PII API | `server/routers/{athletes,coaches,clubs,venues,schools}.ts` |
| Schema | `drizzle/schema.ts` (`users`, athlete/coach contacts, `whatsapp…consentAt`) |
| Prior docs | `docs/research/PRODUCTION_GO_LIVE_SCORECARD.md`; `PUBLIC_READY_GAP_ANALYSIS.md`; `docs/04_features_audit.md` |

---

## 13. Rules / constraints applied

- Search/reuse first; findings grounded only in files read and greps.  
- No code changes in this wave doc; no secrets committed.  
- Shared-DB caution: retention/purge recommendations must stay scoped to `sportsplatform_*` only.

---

## 14. Sign-off

| Question | Answer |
|----------|--------|
| Soft beta with Privacy/Terms linked? | **Yes** |
| Claim POPIA-complete / WCAG AA? | **No** |
| Cookie banner mandatory today (analytics off)? | **No** — disclosure (**L1**) yes; banner when non-essential scripts ship |
| Biggest a11y hotspots? | Skip link, ticker marquee, Map ARIA, custom focus rings, CSS content images |
| Biggest privacy ops hotspot? | Vague retention + no erasure workflow + unpersisted Register consent |
