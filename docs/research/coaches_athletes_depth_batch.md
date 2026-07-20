# Coaches + Athletes Depth Batch — 2026-07-20

**Migration:** `supabase/migrations/20260720000051_coaches_athletes_depth.sql`  
**Project:** `rbibqjgsnrueubrvyqps`  
**DB mutated:** Yes (via Supabase MCP `apply_migration` → `coaches_athletes_depth`)

## Before → After (live)

| Metric | Before | After |
|--------|-------:|------:|
| Coaches total | 16 | **36** |
| Coaches active | 16 | **35** |
| Coaches with photo (active) | 0 (0%) | **35 (100%)** |
| Athletes total | 80 | **101** |
| Athletes active | 71 | **92** |
| Athletes with photo (active) | 71 (100%) | **92 (100%)** |

## Coaches — what changed

1. **Role corrections:** Allister Coetzee + Pierre de Bruyn → Former Head Coach (public transitions); Collin Benjamin bio paraphrased from Wikipedia (no invented CAF licence text retained as-is from prior seed was replaced with verified career facts).
2. **Federation fix:** Carla van der Merwe `42` (skateboarding) → `35` (NASFED/swimming).
3. **Soft-deactivated** unverified netball name Juliana Doweses; replaced by verified **Julene Meyer** head-coach row.
4. **Photos:** sport-correct `/sports/*` for all active coaches; Wikimedia portrait for Jacques Burger at `/coaches/jacques-burger.jpg` (2015 RWC, Commons).
5. **+20 verified inserts** (dedupe by first+last name): football (Samaria, Mannetti), rugby (Burger, Rossouw, Botha, Kitshoff, Engels, Philander), cricket (Craig Williams head coach), netball (Meyer, Burden, Wentworth), hockey (Shayne/Trevor Cormack, Price), boxing (Nestor Tobias), swimming (John Leitner), judo (Keith Bock, Cornelius Matthyser), athletics mentor (Frankie Fredericks).
6. **years_experience** left `NULL` on new rows — never invented tenure numbers. Bios live in `certifications` with `Source:` links (no dedicated bio column).

## Athletes — what changed

**+21 verified notables** (photos required) for underrepresented feds:

| Fed | New slugs |
|-----|-----------|
| Netball (`86`) | `anna-kaspar`, `louise-kauhesua`, `monica-gomases`, `loide-hanyanya`, `cornelia-mupenda` |
| Hockey (`88`) | `sunelle-ludwig`, `petro-stoffberg`, `azaylee-philander`, `jerrica-bartlett`, `kiana-che-cormack`, `pieter-jacobs-hockey`, `brynn-cleak` |
| Cycling (`62`) | `vera-looser`, `tristan-de-lange`, `dan-craven`, `alex-miller-cycling` |
| Swimming (`35`) | `ronan-wantenaar` |
| Judo (`75`) | `keith-bock` |
| Paralympic (`24`) | `chris-kinda`, `bradley-murere`, `petrus-karuli` |

Notes:
- `alex-miller-cycling` distinct from canoeist `alexander-miller`.
- Vera Looser Wikimedia portrait: `/athletes/vera-looser.jpg` (2018 Lotto Belgium Tour, Commons).
- Short paraphrased achievements only; no invented medals/stats.

## Assets on disk

- `client/public/coaches/jacques-burger.jpg`
- `client/public/athletes/vera-looser.jpg`
- Existing `/athletes/{netball,hockey,swimming,judo}.jpg` + `/sports/*` fallbacks

## Residual gaps

- Most coach/athlete photos remain sport stock (Commons coverage thin).
- Some pre-existing coach rows (basketball/tennis seed) still have unverified licence strings from earlier seed — not rewritten this pass except Benjamin/Coetzee/de Bruyn.
- Judo athlete depth still thin beyond Keith Bock / Lotta Reinefeld.
- Optional: link athletes to `club_id` where domestic clubs are known.
