# Events Web Batch B — 2026-07-24

Agent: public-web events (Batch B). Live project `rbibqjgsnrueubrvyqps`.

## Scope

Golf, cycling, motorsport, triathlon, karate, taekwondo, judo, wrestling, weightlifting/powerlifting, gymnastics, dance sport, badminton, table tennis, volleyball, beach volleyball.

## Rules applied

- Verified public sources only (press, federation calendars, UWW/World Triathlon/WT/Kihapp).
- `sportsplatform_events`, federation resolved by slug, `is_published = true`.
- No duplicates (`ON CONFLICT (slug) DO NOTHING`).
- No fabricated dates; uncertain editions skipped and listed below.

## Migration

| File | Purpose |
|------|---------|
| `supabase/migrations/20260724203000_events_web_batch_B.sql` | Insert **23** verified events |

Applied via Supabase MCP `apply_migration` name `events_web_batch_B_20260724`.

**Post-apply live counts:** `sportsplatform_events` total **293** / published **291** (2026-07-24).

## Inserts (23)

| # | Event | Dates | Federation slug | Primary source |
|---|-------|-------|-----------------|----------------|
| 1 | Corner Butcher Gold Cup 2025 | 22–23 Nov 2025 | `golf-namibia` | New Era |
| 2 | Battle of the Social Groups Competition 2025 | 29 Nov 2025 | `golf-namibia` | New Era (Gold Cup follow-on) |
| 3 | Team Stableford Multiplier 2026 | 20 Jun 2026 | `golf-namibia` | Sportwrap |
| 4 | Nedbank WPP 1 2026 | 10–11 Jan 2026 | `namibia-cycling` | The Namibian; Nedbank |
| 5 | Nedbank National Road & TT Champs 2026 | 6–8 Feb 2026 | `namibia-cycling` | Nedbank; The Villager |
| 6 | NMSF Circuit Racing Leg 1 2026 | 14 Mar 2026 | `motorsport-namibia` | The Namibian; RacingCalendar |
| 7 | Namibian National Sprint Triathlon Champs 2026 | 21 Mar 2026 | `triathlon-namibia` | Namibian Sun; World Triathlon |
| 8 | FNB SKAI National Championship 2025 | 3 Aug 2025 | `karate-namibia` | Kihapp |
| 9 | 2nd Southern Africa WUKF Open 2025 | 11 Oct 2025 | `karate-namibia` | Kihapp |
| 10 | Wuxi 2025 WT World Championships (Namibia) | 24–30 Oct 2025 | `taekwondo-namibia` | New Era; World Taekwondo |
| 11 | Gangwon Para TKD Open Challenge 2026 | 8–9 Jul 2026 | `taekwondo-namibia` | New Era |
| 12 | Namib Storm / SADC Open 2025 | 30 Jun–5 Jul 2025 | `wrestling-namibia` | UWW |
| 13 | Beach Wrestling Debut Swakopmund Mole | 6 Dec 2025 | `wrestling-namibia` | New Era; Namibian Sun |
| 14 | NPA National Qualifier Championships 2025 | 25 Jul 2025 | `powerlifting-namibia` | New Era |
| 15 | WPC Worlds Brazil 2025 (Shangadi) | 22–26 Oct 2025 | `powerlifting-namibia` | New Era; Republikein |
| 16 | AWPC Open Deadlift Windhoek 2026 | 28 Mar 2026 | `powerlifting-namibia` | The Namibian |
| 17 | AWPC African Championships Durban 2026 | 24 Sep 2026 | `powerlifting-namibia` | The Namibian |
| 18 | NGF Rhythmic Senior/Novice Nationals 2025 | 17–18 Oct 2025 | `namibia-gymnastics` | Namibian Sun |
| 19 | GDS World Dance Championship Bangkok 2026 | 15–17 Jul 2026 | `dance-sport-namibia` | New Era |
| 20 | NTTA Senior/Open Championship 2025 | 21 Jun 2025 | `table-tennis-namibia` | Namibian Sun / Sportwrap |
| 21 | Region 5 Youth Games Table Tennis 2025 | 4–11 Jul 2025 | `table-tennis-namibia` | Republikein |
| 22 | DTS Liqui Fruit International Beach VB 2025 | 8–9 Mar 2025 | `namibia-beach-volleyball` | The Namibian |
| 23 | Bank Windhoek Beach Volleyball Open 2025 | 3–4 May 2025 | `namibia-beach-volleyball` | Namibian Sun |

## Already present (not re-inserted)

- Golf: FNB Namibian Open 2025, Namibian Open 2026, Nedbank for Good Series
- Cycling: Desert Dash 2025/26, WPP 2–6 2026
- Motorsport: circuit legs 2025 + leg 2 2026
- Triathlon: Africa Premium/Junior Cup Swakopmund 2026
- Karate: Swakop Open 2026, OGKN nationals 2026, 3rd WUKF SA Open 2026
- Judo: Region 5 Games 2025, qualifiers/African seniors/Open 2026
- Volleyball indoor: MTC VNL finals 2025, league 2026, CAVB Zone VI legs (also on NVF)
- Beach volleyball: CAVB Zone VI Namibia legs 2026
- Dance: DanceSport nationals 2025
- Gymnastics: Region 5 Windhoek 2025, Commonwealth Games 2026
- Powerlifting: African / Classic African 2026 rows already present (distinct from AWPC Durban)

## Explicitly skipped

| Sport | Reason |
|-------|--------|
| **Badminton** | No dated 2025–26 Namibian badminton tournament found on public web (BCA report / SportyHQ hits were squash or historical). |
| **Judo** | Calendar already populated; no additional verified host dates beyond existing rows. |
| **Indoor volleyball** | MTC VNL + nationals already covered; no new primary-source gaps in this pass. |
| **Olympic weightlifting** (`weightlifting-namibia`) | Soft-merged inactive; NPA events assigned to `powerlifting-namibia`. |
| **Artistic gymnastics nationals Oct 2025** | Press confirms event at Crete Club but no exact start/end day — skipped. |
| **Gold Cup 2026 weekend** | Sportwrap confirms event happened before 20 Jun Team Stableford but does not publish exact days — skipped. |
| **GDS Inter-Continental Randburg** | Economist piece lacks a confirmed year in the accessible text — skipped. |

## Federation ID map (live)

| Slug | id |
|------|-----|
| `golf-namibia` | 81 |
| `namibia-cycling` | 62 |
| `motorsport-namibia` | 71 |
| `triathlon-namibia` | 32 |
| `karate-namibia` | 40 |
| `taekwondo-namibia` | 76 |
| `judo-namibia` | 75 |
| `wrestling-namibia` | 77 |
| `powerlifting-namibia` | 46 |
| `weightlifting-namibia` | 23 (merged — unused) |
| `namibia-gymnastics` | 34 |
| `dance-sport-namibia` | 90 |
| `badminton-namibia` | 79 |
| `table-tennis-namibia` | 80 |
| `namibia-volleyball` | 37 |
| `namibia-beach-volleyball` | 59 |
