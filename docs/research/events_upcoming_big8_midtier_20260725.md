# Events — Big-8 / mid-tier upcoming refresh (2026-07-25)

**Goal:** FULL_GAP_ANALYSIS P0 — seed ≥1 **upcoming** (`start_date >= now`) event for Big-8 holes and high-traffic mid-tier federations with 0 upcoming. Verified sources only; published with source URLs in description.

**Migration:** `supabase/migrations/20260725210000_events_upcoming_big8_midtier.sql`  
**Applied:** live `rbibqjgsnrueubrvyqps` via Supabase MCP `execute_sql` (2026-07-25).

## Pre-seed state (live SQL)

| Fed | Slug | Upcoming | Notes |
|-----|------|---------:|-------|
| NASFED | `swimming-namibia` | **0** | CG row start 23 Jul (past); SC Gala 3 done ~17–18 Jul |
| NHU | `nhu` | **0** | SA women’s tests 20–24 Jul rolled past |
| Golf | `golf-namibia` | **0** | Series umbrella start Feb (past) |
| Bowls | `bowls-namibia` | **0** | CG start 23 Jul (past) |
| Gymnastics | `namibia-gymnastics` | **0** | CG start 23 Jul (past) |
| Motorsport | `motorsport-namibia` | **0** | — |
| NPC | `namibia-paralympic` | **0** | CG start 23 Jul (past) |
| Judo / TKD / Table TNT | — | **0** | No dated public fixtures found |

## Seeded (new rows)

| Fed | Events added | Dates | Primary sources |
|-----|-------------:|-------|-----------------|
| **NASFED** | **2** | 26–29 Jul (CG swim remaining); 2–5 Sep (Zone IV Botswana) | New Era; Olympics.com CG swim schedule; CWG PDF; AllAfrica/BOPA; Mmegi; Economist (Zone IV defending champs) |
| **Bowls** | **1** | 26 Jul–2 Aug (CG remaining) | Namibian Sun squad; The Namibian; glasgow2026.com/bowls |
| **Gymnastics** | **1** | 26–28 Jul (AA + apparatus) | The Namibian; Namibian Sun; CWG Event Schedule PDF |
| **NPC** | **1** | 27 Jul–1 Aug (para athletics) | Namib Times; glasgow2026.com/scotstoun; scottishathletics |
| **Golf (NAGU)** | **6** | 1 Aug; 29 Aug; 5/12/26 Sep; 13 Nov | Nedbank NA press; New Era “heads North” |
| **Motorsport (NMSF)** | **1** | 28–30 Aug | fim-africa.com/mxoan |
| **NHU** | **0** | — | Research ceiling (below) |

**Total inserted:** 12 published upcoming events.

## NHU research ceiling

Re-hunted after Cape Town women’s tests (SA Hockey Association / FIH Altiusrt — series ended 24 Jul 2026):

- namibiahockey.org outdoor/league pages → **under construction**
- The Namibian / New Era / Republikein → no dated outdoor fixtures Jul–Oct 2026
- Youth Africa Cup Hockey5s Nairobi 6–8 Aug 2026 → **Namibia not listed** (KE, GH, MW, NG, ZA, UG only)
- Existing `nhu-outdoor-hockey-league-2026` (start 1 Jun–end 31 Oct) does **not** count as upcoming under `start_date >= now`

**Do not invent** weekend fixtures or a “second half” start date. Revisit when NHU publishes a fixture sheet or press names a dated round.

## Not seeded (insufficient Namibia confirmation or no date)

- World Aquatics Swimming Championships (25m) Beijing 1–6 Dec 2026 — dates official; **no Namibia entry/squad confirmation**
- NASFED SC Gala 4 / SC Nationals 2026 — 2026 winter calendar not published day-level after Gala 3
- Judo / Taekwondo / Table Tennis — no day-level public fixtures found this pass
- RCFA / WUKF martial arts — already covered under other feds or out of Big-8/mid-tier target set

## Post-seed verification query

```sql
SELECT f.slug, f.abbreviation,
  COUNT(*) FILTER (WHERE e.start_date >= NOW() AND e.is_published) AS upcoming
FROM sportsplatform_federations f
LEFT JOIN sportsplatform_events e ON e.federation_id = f.id
WHERE f.slug IN (
  'swimming-namibia','nhu','golf-namibia','bowls-namibia',
  'namibia-gymnastics','motorsport-namibia','namibia-paralympic'
)
GROUP BY f.slug, f.abbreviation
ORDER BY f.slug;
```
