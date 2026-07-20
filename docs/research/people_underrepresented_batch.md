# People Pass 3 — Underrepresented Sports (2026-07-21)

**Migration:** `supabase/migrations/20260720000061_people_underrepresented_sports.sql`  
**Project:** `rbibqjgsnrueubrvyqps`  
**DB mutated:** Yes (via Supabase MCP `apply_migration` → `people_underrepresented_sports`)

## Before → After (live)

| Metric | Before | After |
|--------|-------:|------:|
| Athletes total | 101 | **133** |
| Athletes active | 92 | **124** |
| Athletes with photo (active) | 92 (100%) | **124 (100%)** |
| Coaches total | 36 | **48** |
| Coaches active | 35 | **47** |
| Coaches with photo (active) | 35 (100%) | **47 (100%)** |

## Coaches — +12 verified inserts

| Fed | Names | Role notes |
|-----|-------|------------|
| Volleyball (`37`) | Joel Matheus, Mwita Sikopo, Mutasa Kudakwashe | NVF programme / senior M+W head coaches |
| Tennis (`89`) | Gerrie Dippenaar | Davis Cup captain/coach |
| Table tennis (`80`) | Simon Gologolo, Wayne Green | NTTA national + assistant |
| Gymnastics (`34`) | Vesselin Kostin, Petra Thorburn, Morihei Anderson | NTD + WAG/MAG coaches |
| Wrestling (`77`) | Luis Forcelledo Paz, Kevin Vleermuis | NWF head + assistant |
| Chess (`28`) | Charles Eichab | FIDE Instructor / academy coach |

Dedupe by first+last name. `years_experience` left `NULL`. Bios in `certifications` with `Source:` links.

## Athletes — +32 verified inserts

| Fed | New slugs |
|-----|-----------|
| Volleyball (`37`) | `stefanus-kangandjera`, `simon-ekandjo`, `teofilus-ndafenongo`, `simonia-kanyumara`, `naemi-amunyela`, `frieda-iindongo` |
| Tennis (`89`) | `connor-van-schalkwyk`, `codie-van-schalkwyk`, `jean-erasmus`, `steyn-dippenaar`, `ruben-yssel` |
| Table tennis (`80`) | `kamrouz-ghayouri`, `lian-gebauer` |
| Boxing (`87`) | `jeremia-nakathila`, `walter-kautondokwa`, `fillipus-nghitumbwa`, `bethuel-uushona` |
| Gymnastics (`34`) | `anne-leen-thorburn`, `immanuel-kooper`, `annelise-koster`, `robert-honiball` |
| Wrestling (`77`) | `lazarus-haimbodi`, `virinao-nguatjiti`, `lafras-uys`, `calvin-dreyer`, `ester-abraham` |
| Chess (`28`) | `dante-beukes`, `heskiel-ndahangwapo`, `charles-eichab`, `jamie-nicole-beukes`, `lishen-mentile`, `otto-nakapunda` |

Charles Eichab appears as both athlete + coach (same pattern as Keith Bock).

## Per-federation active coverage (after)

| Federation | Athletes | Coaches |
|------------|---------:|--------:|
| Volleyball | 7 | 3 |
| Tennis | 6 | 2 |
| Table tennis | 2 | 2 |
| Boxing | 8 | 2 |
| Gymnastics | 4 | 3 |
| Wrestling | 5 | 2 |
| Chess | 6 | 1 |

## Assets on disk

- `client/public/athletes/{table-tennis,gymnastics,wrestling,chess}.jpg` (copied from `/sports/*`)
- `client/public/sports/chess.jpg` (alias of `chess-tournament.jpg`)
- Existing `/athletes/{volleyball,tennis,boxing}.jpg` + `/sports/*` coach fallbacks

Wikimedia individual portrait download attempted for Otto Nakapunda; Commons returned 429 — sport stock retained.

## Residual gaps

- Most photos remain sport stock (Commons portraits thin / rate-limited).
- Table tennis senior depth still thin (junior-focused public coverage).
- Beach volleyball (`59`) still 0 athletes/coaches (out of scope this pass).
- Optional: `club_id` links where domestic clubs are known.
