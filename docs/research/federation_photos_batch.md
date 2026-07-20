# Federation Sport Photos Batch — 2026-07-20 (Agent PHOTOS)

**Scope:** `background_image` (hero/cover) on `sportsplatform_federations`.  
**Not in scope:** crest/logo files under `client/public/logos/` (Agent LOGOS).

**Schema fields used**
| Field | Column | Role |
|-------|--------|------|
| `logo` | `logo` | Crest / identity mark (LOGOS) |
| `backgroundImage` | `background_image` | Sport hero/cover photo (PHOTOS) |

UI: `FederationLayout` hero uses `backgroundImage`; Home cards use `backgroundImage \|\| logo \|\| /sports/namibia-football.jpg`.

**Migration:** `supabase/migrations/20260720000036_federations_sport_photos.sql`  
**Scripts:** `scripts/fetch-sports-photos.mjs`, `scripts/fetch-sports-photos-pass2.mjs`

---

## Coverage

| Metric | Before | After |
|--------|-------:|------:|
| Active rows | 83 | 83 |
| Active with `background_image` | 63 | **83** (Pass 2 verified live) |
| Active null `background_image` | 20 | **0** |
| Active local `/sports/*` (many 404) | 31 | **83** (0 remote) |
| Active Unsplash remote | 32 | **0** |
| Named files in `client/public/sports/` (excl. hash stubs) | 7 Namibia + hashes | **~86 descriptive names** |

---

## Majors assigned

| Slug | File | Source / notes |
|------|------|----------------|
| nfa | `namibia-football.jpg` | Existing Namibia Brave Warriors celebration (repo) |
| nru | `namibia-rugby-action.jpg` | Wikimedia Commons — RWC 2023 NZ vs Namibia (Toulouse) |
| cricket-namibia | `namibia-cricket.jpg` | Existing repo Namibia cricket asset |
| athletics-namibia | `athletics.jpg` | Unsplash track start (relay baton) — sport-correct |
| namibia-netball | `netball.jpg` | Commons `Netball.jpg` — grassroots netball |
| nhu | `namibia-hockey.jpg` | Existing repo field hockey asset |
| namibia-basketball | `namibia-basketball.jpg` | Existing repo |
| swimming-namibia | `namibia-swimming.jpg` | Existing repo |
| namibia-boxing | `namibia-boxing.jpg` | Existing repo |
| namibia-volleyball | `volleyball.jpg` | Unsplash volleyball action |
| tennis-namibia | `tennis.jpg` | Unsplash clay-court tennis |
| namibia-cycling | `cycling.jpg` | Unsplash road cycling |

---

## Other local assignments (summary)

Commons (CC / free): archery, baseball, softball, fencing, angling/fishing, handball, darts, gymnastics, horse racing, ice hockey, waterski, skateboarding, rollerskating, MMA, korfball, lacrosse, taekwondo, frisbee, canoeing, petanque, mountaineering, equestrian, surfing, shooting, chess pieces, etc.

Unsplash (license OK, downloaded locally): badminton, bodybuilding, bowls, golf, judo/karate/martial-arts, triathlon, table tennis, squash, wrestling, climbing, rowing, sailing, futsal, billiards, powerlifting/weightlifting, esports, dance-sport, orienteering, motorsport, kickboxing/muaythai (martial interim).

---

## Rejected (prefer null / delete wrong file)

| Candidate | Reason |
|-----------|--------|
| Unsplash gym photo on athletics | Wrong sport (weights, not track) — replaced |
| Unsplash basketball on netball | Wrong sport — replaced with Commons netball |
| Unsplash bowls on fencing | Wrong sport — replaced with Olympics fencing |
| Unsplash neon “DO WHAT YOU LOVE” as handball | Not a sport photo — discarded |
| Pilates/aerobics downloaded as `archery.jpg` | Wrong — discarded; real archery from Commons |
| Scuba diving as fishing/angling | Wrong — discarded; Commons `Angling.jpg` |
| Football kick as frisbee | Wrong — discarded; Commons ultimate |
| Tennis serve as padel | Too tennis-specific — padel left **null** |
| Athletics reuse as modern pentathlon | Prefer null |
| Basketball as korfball (first attempt) | Discarded; later Commons korfball team photo used |

---

## Pass 2 — remaining 11 nulls (migration `20260720000040`)

All 11 filled with Wikimedia Commons sport-correct heroes (local `/sports/*`).

| Slug | File | Commons source |
|------|------|----------------|
| namibia-modern-pentathlon | `modern-pentathlon.jpg` | `Modern Pentathlon Rio 2016 Olympics.jpg` (laser-run) |
| namibia-padel-tennis | `padel.jpg` | `Padel en el Cos Sports Plaza.jpg` |
| fistball-namibia | `fistball.jpg` | Die Finals 2025 Dresden Faustball |
| ice-stock-namibia | `ice-stock.jpg` | `Bavarian Curling Nymphenburg Palace Munich.jpg` |
| indigenous-combat-sport | `african-traditional-wrestling.jpg` | `Lutte traditionnelle sénégalaise à Toubab Dialaw 08.jpg` (African traditional wrestling — not MMA) |
| namibia-jukskei | `jukskei.jpg` | `A classic jukskei game 2014-02-01 12-20.jpg` |
| namibia-kendo | `kendo.jpg` | `Kendo EM 2005 - kote.jpg` |
| namibia-practical-shooting | `practical-shooting.jpg` | `IPSC Nationals.jpg` |
| namibia-speed-hiking | `speed-hiking.jpg` | `Mountain running 2.jpg` |
| namibia-teqball | `teqball.jpg` | `Natalia Guitler en Teqball.jpg` |
| namibia-western-mounted-games | `western-mounted-games.jpg` | `Barrel-Racing-Szmurlo.jpg` |

**Coverage after Pass 2:** **83/83** active with `background_image`; **0** still null.

Large downloads compressed (fistball, African wrestling, speed-hiking, western-mounted-games).

---

## Still missing `background_image`

None (active rows). Prefer-null niche list closed in Pass 2.

---

## License notes

- **Wikimedia Commons:** files used under their stated licenses (typically CC BY / CC BY-SA / public domain). Attribution retained via Commons file titles in this doc and download scripts.
- **Unsplash:** free license for commercial use; no Unsplash remote URLs left in DB after this pass (downloaded into `/sports/`).
- **Namibia-specific existing assets** (`namibia-*.jpg`): pre-existing repo photography; treat as platform-owned stock pending source audit.

---

## Coordination

- Did **not** modify crest set under `/logos/` (boxing still has sport photo as `logo` — LOGOS ownership).
- Used migration timestamps **`20260720000036`** (Pass 1) and **`20260720000040`** (Pass 2; 000038 crests / 000039 events taken).
- Did **not** modify `logo` or `/logos/`.
