# Events Enrichment Batch — 2026-07-20

Agent: EVENTS. Live project `rbibqjgsnrueubrvyqps`.

## Schema notes

`sportsplatform_events` columns used: `name`, `slug`, `description`, `type`, `start_date`, `end_date`, `location`, `region`, `poster_url`, `is_published`, `federation_id`.

No `source_url` or `status` column — sources are appended in `description`; publish state uses `is_published` (unpublished = unverified seed).

## Audit (Pass 1 → Pass 2)

| Metric | Pre-enrichment | After Pass 1 | After Pass 2 |
|--------|----------------|--------------|--------------|
| Total events | 126 | 148 | **160** |
| Published | 126 | 147 | **158** |
| With poster | 0 | 21 | **99** |
| Active feds with ≥1 event | ~35 | 34 | **40 / 83** |
| Zero-event active feds | ~48 | 49 | **43** |

## Migrations

| File | Purpose |
|------|---------|
| `supabase/migrations/20260720000020_events_corrections_enrichment.sql` | Fix wrong dates/FKs; enrich descriptions + posters |
| `supabase/migrations/20260720000021_events_populate_verified_batch.sql` | Insert 22 verified landmark events |
| `supabase/migrations/20260720000035_events_pass2_dedupe_enrich.sql` | Dedupe 9 duplicates; +21 gap-federation events; poster backfill |

## Critical corrections

| Slug | Issue | Fix |
|------|-------|-----|
| `swimming-nationals-2025` | Linked to **skateboarding-namibia**; Mar 2025 dates | → NASFED SC nationals 24–28 Sep 2025, `swimming-namibia` |
| `bw-marathon-2025` | “Bank Windhoek Marathon” 15 Jun (fabricated) | → **Vivo Energy Windhoek Marathon 2025** 24 May |
| `athletics-nationals-2025` | Apr 25–27 | → Senior nationals **30–31 Aug 2025** (delayed) |
| `athletics-nationals-2026-main` | Generic “nationals” | → **U18 & U20** 17–18 Apr 2026 (AN calendar) |
| `national-athletics-2026` | Jun seed not on AN calendar | **Unpublished** |
| `npl-2025` | Jan–Nov window | → **NPFL 2025/26** 24 Oct 2025 – 19 Apr 2026 |
| `netball-premier-2025` | Generic Feb–Sep | → MTC NNPL 2025 ~31 May – 4 Oct |
| `nnpl-playoffs-2026` (+ dup) | Feb “playoffs” | → 2026 season **opening weekend** 2–4 May |
| `nedbank-wpp4-2026` (+ dup) | 22 Feb | → **22 Mar** Matchless |
| `nasfed-long-course-2026` | Start 18 Feb | → **19–22 Feb** Olympia |
| `swimming-nationals-2026` | Wrong “nationals” mid-Mar | → NASFED LC Gala 4 Infinity 13–14 Mar |
| `boxing-nationals-*` | 13–15 Mar | → **14–16 Mar** (postponed) |
| `icc-u19-wc-2026-namibia` | End 2 Feb | → Tournament span to **6 Feb** |

## New verified inserts (samples)

| Event | Dates | Federation slug | Primary source |
|-------|-------|-----------------|----------------|
| Nedbank Desert Dash 2025 | 5–6 Dec 2025 | `namibia-cycling` | Nedbank press; desertdashnamibia.com |
| Nedbank Desert Dash 2026 | 11–12 Dec 2026 | `namibia-cycling` | The Namibian; official site |
| Bank Windhoek Red Run 2025 | 9 Aug 2025 | `athletics-namibia` | Bank Windhoek |
| Bank Windhoek Red Run 2026 | 1 Aug 2026 | `athletics-namibia` | EasyReg; NAMPA; AN calendar |
| Vivo Energy Windhoek Marathon 2026 | 23 May 2026 | `athletics-namibia` | City of Windhoek |
| Spar Ocean View Marathon 2026 | 7 Feb 2026 | `athletics-namibia` | AN calendar PDF |
| Rössing Marathon 2026 | 7 Mar 2026 | `athletics-namibia` | AN calendar PDF |
| Bank Windhoek Senior T&F 2026 | 24–25 Apr 2026 | `athletics-namibia` | The Namibian; AN calendar |
| Sanlam Coastal Marathon 2026 | 25 Apr 2026 | `athletics-namibia` | AN calendar |
| NSSU Athletics Nationals 2025 | 2–3 May 2025 | `athletics-namibia`* | The Namibian |
| Husab Marathon 2026 | 15 Aug 2026 | `athletics-namibia` | AN calendar |
| Navachab Half Marathon 2026 | 19 Sep 2026 | `athletics-namibia` | AN calendar |
| Standard Bank Top 8 Cup 2026 | 2–23 May 2026 | `nfa` | NFA.org.na; RSSSF |
| Top Score NEC 2026 | 10–12 Sep 2026 | `namibia-sports-commission`* | The Namibian |
| NASFED OWS Nationals 2025 | 29–30 Nov 2025 | `swimming-namibia` | NASFED calendar PDF |
| NASFED Aquapentathlon 2026 | 11 Apr 2026 | `swimming-namibia` | NASFED calendar PDF |
| Nujoma Boxing Bonanza 2025 | 12 Apr 2025 | `namibia-boxing` | The Namibian |
| Namibian Open Golf 2026 | 17–18 May 2026 | `golf-namibia` | The Namibian |
| FNB Namibian Open 2025 | 17–18 May 2025 | `golf-namibia` | Allgemeine Zeitung |
| Welwitschias vs Blue Bulls | 11 Jul 2026 | `nru` | The Namibian; WE |
| NHU Indoor Hockey Finals 2026 | 16 May 2026 | `nhu` | The Namibian |
| Newspaper Cup netball leg | 3–6 Apr 2026 | `namibia-netball` | NFA |

\* NSSU (schools) is **not** a federation row — only NNSSU (students) exists. School events linked to Athletics Namibia / NSC as noted.

## Already present & verified (enriched, not re-inserted)

- Africa Triathlon Premium Cup Swakopmund — 21 Mar 2026 (events.triathlon.org)
- Nedbank Newspaper Cup football — 3–6 Apr 2026 (NFA)
- Nedbank WPP series 2026 rounds 2–6 (Nedbank / New Era)
- ICC U19 WC Namibia host window (ICC)
- Hockey ACCC Harare Jan 2026 (New Era)
- Namibia Street Classic / Herman Davids — 27–28 Mar 2026 (NAMPA + AN calendar)

## Explicitly skipped (uncertain / no 2025–27 date)

- Fish River Canyon Ultra — last DUV-listed editions 2018–19; **no confirmed 2025/26 edition**
- Welwitschias Currie Cup season — side **not** in SA Rugby 2026 Currie Cup lists
- Full NPFL round-by-round fixture table (use RSSSF for match-level later)
- Olympic/Youth Olympic individual athlete entries without confirmed Namibian selection lists
- Motorsport Namibia / Desert racing calendars without primary federation PDF

## Remaining gaps (updated after Pass 2)

1. **43/83** active federations still have zero events (see list below).
2. Thin tennis/archery/chess seeds still need source audit.
3. **NSSU** federation entity missing from roster.
4. Schema: optional `source_url`, `status` enum would help curation.
5. Motorsport 2026 full calendar PDF not ingested (only press-verified legs).

## Source index

- https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf
- https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf
- https://www.desertdashnamibia.com/
- https://nfa.org.na/
- https://www.rsssf.org/tablesn/nami2026.html
- https://events.triathlon.org/2026-africa-triathlon-premium-cup-swakopmund
- https://www.icc-cricket.com/media-releases/icc-u19-men-s-cricket-world-cup-schedule-announced
- https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf
- https://www.psasquashtour.com/
- The Namibian, New Era, NAMPA, Namibia Economist, Nedbank Namibia press, Bank Windhoek, EasyReg, Namibian Sun, Republikein

---

## Pass 2 — 2026-07-20 (dedupe + gap federations)

Migration: `supabase/migrations/20260720000035_events_pass2_dedupe_enrich.sql`  
(Live apply used MCP; file renamed to `000035` after sibling crest/`000034` RLS collisions.)

### Counts

| Metric | After Pass 1 | After Pass 2 |
|--------|--------------|--------------|
| Total events | 148 | **160** |
| Published | 147 | **158** |
| With poster | 21 | **99** |
| Active feds with events | 34 / 83 | **40 / 83** |
| Zero-event active feds | 49 | **43** |

### Dedupe actions (DELETE — no `sportsplatform_media` FKs)

| Deleted slug | Kept canonical |
|--------------|----------------|
| `wpp2-time-trial-2026` | `nedbank-wpp2-2026` |
| `wpp4-matchless-2026` | `nedbank-wpp4-2026` |
| `wpp-finals-2026` | `nedbank-wpp-finals-2026` |
| `accc-hockey-harare-2026` | `hockey-accc-2026` |
| `boxing-nationals-keetmanshoop-2026` | `boxing-nationals-2026` |
| `nnpl-playoffs-2026` | `netball-nnpl-playoffs-2026` |
| `annual-ace-golf-2026` | `golf-annual-ace-2026` |
| `ntf-triathlon-premium-2026` | `africa-triathlon-premium-cup-2026` |
| `cavb-zone6-bvb-leg1-2026` | `cavb-zone6-volleyball-leg1-2026` |

Soft-deprecated (unpublished): `welwitschias-test-2025` (no corroborating fixture).

### New / gap-federation inserts (verified)

| Federation | Events added |
|------------|--------------|
| `bowls-namibia` | National Bowls Week 2025 & 2026 |
| `squash-namibia` | PSA BDO Open 2025/2026; Namibian Closed 2026 |
| `motorsport-namibia` | Circuit Legs 1–2 2025; Leg 2 2026 |
| `equestrian-namibia` | FEI World Challenge Jul; GCW/RCO/Eventing Nam Champs |
| `namibia-gymnastics` | Region 5 Gymnastics Windhoek Dec 2025 |
| `surfing-namibia` | Sound Garden Surf Contest Jul 2026 |
| `karate-namibia` | WUKF Southern Africa Open Sep 2026 |
| `namibia-basketball` | KBA Finals 2025; KBA opener 2026 |
| `nru` | NRU Premier League 2026 |
| `nhu` | Outdoor field hockey league 2026 |
| `judo-namibia` | Region 5 Judo Games Jul 2025 |
| `namibia-volleyball` | MTC VNL Finals 2025 (+ season row enriched) |

### Posters

Bulk-assigned sport-matched `/sports/*` for athletics, cricket, NFA, NRU, netball, basketball, volleyball, golf, judo, karate, triathlon, WPP, hockey, bowls, squash, surfing where assets exist.

### Zero-event federations remaining (43)

badminton, baseball, billiards-snooker, bodybuilding, dance-sport, fencing, fistball, ice-stock, indigenous-combat-sport, lacrosse, mixed-martial-arts, canoeing, darts, esports, footgolf, full-contact-martial-arts, horse-racing, ice-inline-hockey, jukskei, kendo, kickboxing, korfball, martial-arts, modern-pentathlon, mountaineering, muaythai, orienteering, padel-tennis, paralympic, practical-shooting, speed-hiking, teqball, waterski, western-mounted-games, nawisa, nlas, nufs, petanque, roller-sports, sailing, skateboarding, softball, taekwondo.

### Skipped in Pass 2 (uncertain)

- Fish River Ultra 2025/26 (still no confirmed edition)
- Full NMSF 2026 PDF calendar (only press-verified legs)
- Local taekwondo nationals (no dated announcement)
- Sound Garden exact heat schedule (used weekend date from Republikein 10 Jul article)
- Welwitschias vs Kenya warm-up (DB seed retained; not re-verified this pass)

---

## Pass 3 — 2026-07-20 (zero-event federations)

Migration: `supabase/migrations/20260720000037_events_pass3_zero_feds.sql`  
Applied live to `rbibqjgsnrueubrvyqps` via Supabase MCP (`events_pass3_zero_feds`).

### Counts

| Metric | After Pass 2 | After Pass 3 |
|--------|--------------|--------------|
| Total events | 160 | **186** |
| Published | 158 | **184** |
| With poster | 99 | **117** |
| Active feds with events | 40 / 83 | **50 / 83** |
| Zero-event active feds | 43 | **33** |

### New inserts (26 verified)

| Federation slug | Events added |
|-----------------|--------------|
| `namibia-esports` | MTC NamLAN 2025; NESA GEF Qualifier Finals 2026 |
| `namibia-padel-tennis` | Heineken 0.0 NPPL Open 2026; NAMBRU Rhino Rally Padel 2026 |
| `sailing-namibia` | Junior National Sailing Championships 2026 |
| `dance-sport-namibia` | DSN National Championships 2025 |
| `namibia-jukskei` | Namibia Open 2025; Christie Horn Schools; Coen Brand ATKV; Sakeliga 2026; IJF tests 2026; Outjo Doubles 2026 |
| `billiards-snooker-namibia` | Women's 2025; President Cup 2025; Champ of Champs 2025; Women's/Masters/Champ of Champs 2026 |
| `namibia-full-contact-martial-arts` | RCFA Namib War III 2025; Namib War IV 2026 |
| `namibia-ice-inline-hockey` | Otjiwarongo opener 2025; NIIHA Champs 2025; National Trials 2026 |
| `taekwondo-namibia` | WT African Open Series Maputo 2025 (Namibia representation) |
| `namibia-paralympic` | Para Taekwondo Chuncheon 2026; Para Fencing camp Windhoek 2025 |

### Skipped (no verified local dated event)

- Able-bodied fencing nationals / Windhoek end-April 2026 (only “planned”)
- Softball / baseball local championships (no dated 2024–2027 host)
- Skateboarding contests (no dated public schedule)
- Badminton, bodybuilding, canoe/rowing, chess locals, handball/wrestling, petanque, kickboxing (RCFA linked to full-contact), MMA, darts, etc.

### Zero-event federations remaining (33)

badminton-namibia, baseball-namibia, bodybuilding-namibia, fencing-namibia, fistball-namibia, ice-stock-namibia, indigenous-combat-sport, lacrosse-namibia, mixed-martial-arts-namibia, namibia-canoeing, namibia-darts, namibia-footgolf, namibia-horse-racing, namibia-kendo, namibia-kickboxing, namibia-korfball, namibia-martial-arts, namibia-modern-pentathlon, namibia-mountaineering, namibia-muaythai, namibia-orienteering, namibia-practical-shooting, namibia-speed-hiking, namibia-teqball, namibia-waterski, namibia-western-mounted-games, nawisa, nlas, nufs, petanque-namibia, roller-sports-namibia, skateboarding-namibia, softball-namibia.

---

## Pass 4 — 2026-07-20 (remaining zeros)

Migration: `supabase/migrations/20260720000039_events_pass4_zero_feds.sql`  
Applied live to `rbibqjgsnrueubrvyqps` via Supabase MCP (`events_pass4_zero_feds`).

### Counts

| Metric | After Pass 3 | After Pass 4 |
|--------|--------------|--------------|
| Total events | 186 | **205** |
| Published | 184 | **203** |
| With poster | 117 | **131** |
| Active feds with events | 50 / 83 | **62 / 83** |
| Zero-event active feds | 33 | **21** |

### New inserts (19 verified → 12 federations)

| Federation slug | Events added |
|-----------------|--------------|
| `fistball-namibia` | Cohen Cup 2025; National Cup 2025; Ball-Balla 2025; Cohen International 2026 |
| `namibia-horse-racing` | Independence Cup 2026; Castlebet July Cup 2026 |
| `fencing-namibia` | Easter Club Challenge Gaborone 2026 |
| `bodybuilding-namibia` | WFF Africa Pro Qualifier Lusaka 2025 |
| `namibia-canoeing` | Coastal Rowing Sprints Cape Town 2026 |
| `namibia-western-mounted-games` | Gobabis debut 2026 |
| `namibia-waterski` | Nationals 2026; IWWF All Africa Championships 2026 |
| `mixed-martial-arts-namibia` | IMMAF Africa Windhoek 2024; IMMAF Africa Luanda 2025 |
| `namibia-kickboxing` | Desert Storm 5 (2024); Desert Storm 6 (2025) |
| `namibia-darts` | AUSC Region 5 Mazowe 2025 |
| `indigenous-combat-sport` | Nama Festival traditional sports showcase 2025 |
| `skateboarding-namibia` | Swatch ULT.X Cape Town qualifiers 2025 |

### Remaining zeros — categorized (21)

**No public event record found (research ceiling):**  
badminton-namibia, baseball-namibia, ice-stock-namibia, lacrosse-namibia, namibia-footgolf, namibia-kendo, namibia-korfball, namibia-martial-arts, namibia-modern-pentathlon, namibia-mountaineering, namibia-muaythai, namibia-orienteering, namibia-practical-shooting, namibia-speed-hiking, namibia-teqball, petanque-namibia, roller-sports-namibia, softball-namibia

**Needs NSC / federation calendar ask (umbrella or dormant public calendars):**  
nawisa, nlas, nufs

### Skipped in Pass 4

- Windhoek fencing “end of April 2026” local (still only planned)
- NDF month-only calendar rows (Mafia/Khomas/Falcons etc. — no day)
- Principals Traditional Sports Tournament July 2025 (month only)
- WFF Mr Universe Cameroon mid-2026 (month only / conflicting June vs July reports)
- Local softball/baseball/badminton nationals (no dated host found)

---

## Pass 5 — 2026-07-20 (majors upcoming calendars)

Migration: `supabase/migrations/20260720000041_events_pass5_majors_upcoming.sql`  
Applied live to `rbibqjgsnrueubrvyqps` via Supabase MCP (`events_pass5_majors_upcoming`).

### Majors upcoming (start_date ≥ 2026-07-20)

| Federation | Before | After | Notes |
|------------|--------|-------|-------|
| `nfa` | 0 | **3** | AFCON 2027 Qualifiers MD1–2 / MD3–4 / MD5–6 CAF windows |
| `cricket-namibia` | 0 | **5** | CWC L2 Utrecht tri-series + 4 Namibia ODIs |
| `swimming-namibia` | 0 | **1** | Commonwealth Games Glasgow swimming (named NASFED squad) |
| `namibia-basketball` | 0 | **2** | KBA mid-season weekend 24–26 Jul + midweek 29 Jul (TeamLinkt) |
| `nhu` | 0 | **0** | Outdoor season row exists (start 1 Jun — past); no forward-dated fixture found |
| `athletics-namibia` | 3 | **4** | + Commonwealth Games athletics/para |
| `namibia-netball` | 1 | **1** | Youth tournament 15 Aug already present; no dated Round 24+ |
| `nru` | 1 | **1** | Coastal Rugby Cup 20–22 Aug already present |

### Platform totals

| Metric | After Pass 4 | After Pass 5 |
|--------|--------------|--------------|
| Total events | 205 | **217** |
| Published | 203 | **215** |
| Upcoming (start ≥ 2026-07-20) | 32 | **44** |
| Upcoming missing poster | 18 | **0** |
| With poster (all) | 131 | **163** |

### New inserts (12 verified)

| Federation | Events |
|------------|--------|
| `nfa` | AFCON 2027 Qualifiers MD1–2 (21 Sep–6 Oct 2026); MD3–4 (9–17 Nov 2026); MD5–6 (22–30 Mar 2027) |
| `cricket-namibia` | CWC L2 Utrecht tri-series 21–31 Jul 2026; NAM vs NEP 21 & 27 Jul; NAM vs NED 25 Jul; NED vs NAM 31 Jul |
| `swimming-namibia` | Commonwealth Games Glasgow swimming 23 Jul–2 Aug 2026 |
| `athletics-namibia` | Commonwealth Games Glasgow athletics 23 Jul–2 Aug 2026 |
| `namibia-basketball` | KBA mid-season weekend 24–26 Jul; Cadets vs Afro Stars II 29 Jul |

### Sources (Pass 5)

- CAF AFCON 2027 qualifiers fixtures: africasoccer.com; Wikipedia schedule table; nfa.org.na draw report
- ESPNcricinfo Namibia fixtures; KNCB Utrecht Kampong announcement; ICC Netherlands squad note
- Namibia Economist / New Era — Team Namibia Glasgow 2026 squad (swimming + athletics names)
- KBA TeamLinkt schedule: https://leagues.teamlinkt.com/kba

### Skipped (Pass 5)

- NPFL 2026/27 kickoff — independence announced; **no confirmed start date** (Nigerian NPFL Aug dates are not Namibia)
- FIFA WC 2026 qualifiers Sep 2025 Malawi/São Tomé — **already past** (not 2026)
- NASFED SC Nationals 2026 — no published 2026 date (2025 was 24–28 Sep)
- NHU outdoor finals / next round — season ongoing in DB but no dated public fixture after 20 Jul
- NNPL playoffs / Round 24+ — Round 23 reported 18 Jul; no next-round date published
- NRU Gold Cup 2026 — 2025 edition verified; no 2026 edition announced

---

## Pass 6 — 2026-07-20 (NHU upcoming + zero-fed re-hunt)

Migration: `supabase/migrations/20260720000053_events_pass6_nhu_upcoming.sql`  
Applied live to `rbibqjgsnrueubrvyqps` via Supabase MCP (`events_pass6_nhu_upcoming`).

### Platform totals

| Metric | After Pass 5 | After Pass 6 |
|--------|--------------|--------------|
| Total events | 217 | **222** |
| Published | 215 | **220** |
| Upcoming (start ≥ 2026-07-20) | 44 | **49** |
| With poster (all) | 163 | **168** |
| Active feds with events | 62 / 83 | **62 / 83** |
| Zero-event active feds | 21 | **21** |

### NHU upcoming (was 0 forward-dated)

| Event | Dates | Venue |
|-------|-------|-------|
| SA vs Namibia Women’s Hockey Test Series | 20–24 Jul 2026 | Cape Town (series) |
| Test 1 | 20 Jul 2026, 10:00 | Elkanah House High School |
| Test 2 | 21 Jul 2026, 17:00 | Elkanah House High School |
| Test 3 | 23 Jul 2026, 17:00 | Elkanah House High School |
| Test 4 | 24 Jul 2026, 14:00 | Hartleyvale Stadium |

### Sources (Pass 6)

- SA Hockey Association: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/
- gsport: https://gsport.co.za/cape-town-to-stage-south-africas-four-match-hockey-test-series-against-namibia/

### Zero-event federations — re-hunt (no inserts)

Still **21** zeros. No new dated 2025–27 public fixtures found for: badminton, baseball, ice-stock, lacrosse, footgolf, kendo, korfball, nlas, martial-arts, modern-pentathlon, mountaineering, muaythai, orienteering, practical-shooting, speed-hiking, teqball, nufs, nawisa, petanque, roller-sports, softball.

**Skipped / not used:** Junior Hockey Series Harare Aug 2026 (Namibia participation not verified); RCFA Namib War IV already in DB (`namibia-full-contact-martial-arts`); powerlifting nationals 25 Jul / archery AGA Botswana 12–15 Aug verified but those feds already had events (out of zero-fed scope).

---

## Pass 7 — 2026-07-21 (zeros deep-research + CWG upcoming)

Migration: `supabase/migrations/20260720000059_events_pass7_zeros_upcoming.sql`  
Applied live to `rbibqjgsnrueubrvyqps` via Supabase MCP (`events_pass7_zeros_upcoming`).

### Platform totals

| Metric | After Pass 6 | After Pass 7 |
|--------|--------------|--------------|
| Total events | 222 | **230** |
| Published | 220 | **228** |
| Upcoming (start ≥ CURRENT_DATE) | 49 | **52** |
| With poster (all) | 168 | **176** |
| Active feds with events | 62 / 83 | **65 / 83** |
| Zero-event active feds | 21 | **18** |

### Zero-fed inserts (5 verified → 3 federations cleared)

| Federation slug | Events added |
|-----------------|--------------|
| `ice-stock-namibia` | IFI 11th Africa Cup Windhoek 19–21 Jun 2026 |
| `namibia-footgolf` | Official launch 7 Jul 2025; Coastal Open Day Rossmund 28 Feb 2026 |
| `nlas` | NALASRA Games Katima Mulilo 26–30 May 2025; Grootfontein 25 May–2 Jun 2026 |

### Upcoming inserts (3 — named Glasgow 2026 squads)

| Federation | Event |
|------------|-------|
| `bowls-namibia` | Commonwealth Games Glasgow 2026 (Bowls) 23 Jul–2 Aug |
| `namibia-boxing` | Commonwealth Games Glasgow 2026 (Boxing) 23 Jul–2 Aug |
| `namibia-gymnastics` | Commonwealth Games Glasgow 2026 (Gymnastics) 23 Jul–2 Aug |

### Sources (Pass 7)

- IFI Africa Cup: https://www.icestock.sport/en/event/afrika-cup-2026/ ; tender PDF `S26AusDuH_Afrika-Cup_EN.pdf`
- FootGolf: Villager 7 Jul 2025 launch; AZ launch write-up; New Era coastal Open Day
- NALASRA: NAMPA Katima 2025; NBC Grootfontein 2026 preview + kick-off
- CWG squads: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/

### Remaining zeros (18)

badminton-namibia, baseball-namibia, lacrosse-namibia, namibia-kendo, namibia-korfball, namibia-martial-arts, namibia-modern-pentathlon, namibia-mountaineering, namibia-muaythai, namibia-orienteering, namibia-practical-shooting, namibia-speed-hiking, namibia-teqball, nawisa, nufs, petanque-namibia, roller-sports-namibia, softball-namibia

### Skipped (Pass 7)

- Climb Namibia Spitzkoppe festival (GoodBETA / MCNAM community meet — not attributed to `namibia-mountaineering` without federation sanction evidence)
- RCFA Namib War IV / PSA BDO Open 2026 already in DB
- Local badminton/softball/baseball/petanque/kendo/korfball nationals — still no dated public host announcements
- NUFS / NAWISA dated umbrella calendars — still absent

---

## Web Batch C — 2026-07-24 (niche / umbrellas / para)

Migration: `supabase/migrations/20260724210000_events_web_batch_C.sql`  
Evidence: `docs/research/events_web_batch_C_20260724.md`  
Applied live via Supabase MCP (`events_web_batch_C_20260724`).

### Platform totals

| Metric | After Pass 7 | After Batch C (+ concurrent A/B) |
|--------|--------------|----------------------------------|
| Total events | 230 | **270** (Batch C contributed +14) |
| Published | 228 | **268** |
| Active feds with events | 65 / 83 | zeros largely unchanged — research ceiling |

### Inserts / fixes

+14 verified rows across chess, archery, NSC, bowls, paralympic, equestrian, handball; corrected `cohen-fistball-tournament-2026` to **9 May 2026**.

Still skipped: softball/baseball, practical shooting nationals, darts month-only calendar, nawisa/nufs, remaining 18 zero feds without day-level public fixtures.
