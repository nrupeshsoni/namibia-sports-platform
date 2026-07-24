# Hollow long-tail + public tab honesty — 2026-07-24

**Project:** `rbibqjgsnrueubrvyqps`  
**Branch:** `main`  
**DB mutated:** **Y** (`hollow_longtail_verified_fill` / local `20260724190000_hollow_longtail_verified_fill.sql`)

## Goal

Close scorecard gap #3: hollow core-5 ≤15% **or** hide empty federation tabs — do both where sources exist. No fabricated contacts.

## Before (live SQL, pre-fill)

| Metric | Count | Rate (n=83) |
|--------|------:|------------:|
| Hollow core-5 (0 clubs + news + athletes + upcoming + coaches) | **24** | **28.9%** |
| Hollow triple tabs (0 clubs + news + athletes) | **26** | **31.3%** |
| Hollow all-content (triple + 0 events + coaches) | **16** | **19.3%** |
| Active clubs / athletes / published news | 189 / 193 / 83 | — |

## Verified fill (exited core-5)

| Fed | Added | Sources |
|-----|-------|---------|
| Skateboarding (SKN) | Club Deluded Bros Arthouse + news | Namibian Sun Oniipa skatepark |
| Speed hiking (NSHA) | Club Let's Go Hiking Namibia | letsgohikingnamibia.com.na |
| Footgolf (NFGF) | News (NSC launch) | New Era |
| Muaythai (NMTF) | News (Combat Club) | The Namibian |
| Mountaineering (NM) | News (Mountain Club / MCSA) | mcnam.org |
| Softball (NSB) | News (Zone 6 return) | The Namibian |
| NIIHA (not core-5) | +5 World Games bronze athletes + news | Republikein |

## After fill (live SQL)

| Metric | Count | Rate |
|--------|------:|-----:|
| Hollow core-5 | **18** | **21.7%** |
| Hollow triple tabs | **20** | **24.1%** |
| Clubs / athletes / news | **191** / **198** / **89** | — |

Residual long-tail (kendo, teqball, lacrosse, umbrellas, etc.) still lack named public clubs/press — left empty; **public nav hides** empty Clubs/Athletes/News/Streams.

## UX (agent-fixable gate)

`FederationLayout` public sticky nav filters via `shouldShowFederationPublicTab` (`client/src/lib/federationPublicTabs.ts`):

- Always show **Home** + **Events**
- Hide **Clubs / Athletes / News / Streams** when that federation has zero published/active items
- **Platform admin** and **same-federation federation_admin** still see all tabs (CMS preview)
- Deep links to empty gated tabs redirect to federation home for public visitors

Vitest: `client/src/lib/federationPublicTabs.test.ts`.

## Scorecard impact

Public hollow **experience** gate met via tab honesty (scorecard §7 option). Raw core-5 still **21.7%** (>15%) until more verified sources land. Combined with human rotation + Builds `ci:gate` → path to **≥90** full public.
