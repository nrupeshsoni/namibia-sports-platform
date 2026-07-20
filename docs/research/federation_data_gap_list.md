# Federation Data Gap List — 2026-07-20 (updated session 9 — crests deep pass 3)

**News (Agent NEWS, same day):** 35 published / 35 with `featured_image` / 13 federations linked — migration `20260720000031`. Details: `news_enrichment_batch.md`.

**Authoritative sources**
- NSC Feb 2025 contact PDF → `federation-contacts-extracted.md`
- Logo research CSV → `source_federation_logos.csv`
- Official sites / Wikimedia / Logopedia (see table below)
- Websites/socials batch → `websites_socials_enrichment_batch.md` (Pass 1 + Pass 2)

**Entity counts:** 85 total (1 ministry + 1 commission + 8 umbrella + 75 federations)

## Website & social completeness (Agent WEBSITES/SOCIALS)

| Metric | Pass 1 start | After Pass 1 | After Pass 2 |
|--------|-------------:|-------------:|-------------:|
| With website | 43 (51%) | 48 (56%) | **55 (64.7%)** |
| Missing website | 42 | 37 | **30** |
| With facebook | 29 | 49 | **51** |
| With instagram | 11 | 28 | **28** |
| With twitter/X | 6 | 9 | **9** |
| With youtube | 0 | 2 | **2** |

### Pass 2 websites added
Archery (World Archery), DanceSport (WDSF), Ultimate (WFDF), Muaythai (IFMA Africa), Ice Stock (`detlef.iway.na/ean`), Badminton (BWF Wayback), Surfing (ISA directory).

### Still missing websites (30)
Baseball, Softball, Bodybuilding, Lacrosse, Taekwondo, Footgolf (FB only), Petanque, Korfball, Orienteering, Jukskei, Sailing (FB only), Kickboxing (FB only), Boxing Control Commission (FB only), Billiards (FB only), Padel, NLAS, NUFS, TISAN (traditional), Indigenous Combat, MMA, Horse Racing, Kendo, Practical Shooting, Speed Hiking, Teqball, Waterski, Western Mounted Games, Namibia Power & Weight Lifting Association, Weightlifting Namibia (merged stub), Fistball.

## Sport photos / heroes (Agent PHOTOS — `000036` + Pass 2 `000040`)

Full write-up: `docs/research/federation_photos_batch.md`

| Metric | Before | After |
|--------|-------:|------:|
| Active with `background_image` | 63 | **83 / 83** (Pass 2 `000040`) |
| Active null (prefer null over wrong) | 20 | **0** |
| Broken local `/sports/*` 404s | 31 | **0** |
| Remote Unsplash heroes | 32 | **0** |
| Named files in `client/public/sports/` | ~7 Namibia + hashes | **~86 named** |

### Still missing photos
None (Pass 2 closed the prior 11).

## Logo completeness (updated — migration `20260720000043` / Agent LOGOS-DEEP pass 3)

| Metric | Count |
|--------|------:|
| Rows with logo set | **51 / 83 active (61%)** |
| Logo null (initials UI) | **32** active |
| Files in `client/public/logos/` | **45** (+ Handball, NALASRA) |
| Interim `/sports/*` only | **0** |

### Crests added (migration `20260720000043` — LOGOS-DEEP pass 3)

| Federation | File | Source |
|------------|------|--------|
| Namibia Handball Federation | `Namibia_Handball_Federation_logo.png` | CAHB Zone 6 directory via Sportaview `sportaview.com/img/fed/namibia.png` (text: Namibia Handball Federation) |
| Namibia Local Authority Sports (`nlas`) | `NALASRA_logo.png` | Wayback `nalasra.com/mobile_logo.png` (NALASRA — Namibia Local Authority Sports & Recreation Association) |

### Rejected this pass (`000043`)
- Golf — FB Graph silhouette; Webnode favicon = “NG” initials only; no crest on NNOC/AGC pages
- Karate — FB `NamibiaKarateFederation` = NSC flag-wave; `NamibiaKarate` = JKA Shotokan branch; Wayback `nakulogo` = NSC crest (not NKF)
- Badminton / PWFN — BWF/IF pages text-only; no federation crest asset
- Handball IHF `Namibia.png` — national flag only (rejected; CAHB crest used instead)
- Muaythai / Footgolf — FB silhouettes
- FISU / WFDF Namibia assets — national flag downloads only
- NUFS / TISAN (Traditional & Indigenous) — no verified crest found
- NSSU Schools eagle crest (`nssu.com.na/assets/images/logo.png`) — verified but **wrong org** for `nnssu` (DB = Students/FISU tertiary; Schools = learners body)

### Crests added (migration `20260720000038` — LOGOS-DEEP pass 2)

| Federation | File | Source |
|------------|------|--------|
| Ice Stock Namibia | `Namibia_Ice_Stock_Association_logo.jpg` | Official banner crest cropped from `detlef.iway.na/ean/images/top_sculpture3.jpg` |
| Namibia Boxing Control Commission | `Namibian_Boxing_Federation_logo.jpg` | Facebook Graph `NamibiaBoxingFederation` (NABF crest Est. 1991; replaces `/sports/` sport photo — sole boxing row) |

### Rejected this pass (`000038`)
- Karate Wayback `nakulogo_res_480_528.jpg` + FB = NSC flag-wave (not karate crest); style badges = Shotokan/Goju branches only
- Golf / Handball / Muaythai / Footgolf = FB silhouettes or flag placeholders
- Dance Sport / Horse Racing / Badminton / Taekwondo / PWFN — no verified crest (IF pages text-only; US NHRA logo is wrong org)
- Boxing Control Board ≠ NABF naming mismatch noted but crest applied as only boxing crest found for the sole boxing directory row

### Crests added (migration `20260720000033` — LOGOS-DEEP)

| Federation | File | Source |
|------------|------|--------|
| Namibia Kickboxing Federation | `Namibia_Kickboxing_Federation_logo.jpg` | Facebook Graph `kickfederation` page picture (fist + Namibian flag shield) |
| Sailing Namibia | `Namibia_Sailing_Association_logo.jpg` | Facebook Graph `windynamib` page picture (NSA sail + laurel) |
| Namibia Canoeing | `Namibia_Canoe_Rowing_Federation_logo.jpg` | Facebook Graph `namibiacanoerowing` (N.C.R.F. crest) |
| Rowing Namibia | (share NCRF crest) | same national canoe/rowing body |
| Namibia Jukskei Federation | `Namibia_Jukskei_logo.png` | Official `jukskei-nam.com/images/logo_NamibiaJukskeiNew.png` |

### Sibling conflicts avoided (already filled by `20260720000019`)
Fencing, Archery, Wrestling, Esports (NESA), Padel — LOGOS-DEEP did not overwrite.

### Crests added (migration `20260720000019`)

| Federation | File | Source |
|------------|------|--------|
| Fencing Namibia | `Namibia_Fencing_Federation_logo.png` | Official `namibianfencing.com` NFF crest |
| Archery Namibia | `Archery_Association_of_Namibia_logo.png` | Wayback `archerynamibia.org` AAN logo |
| Wrestling Namibia | `Namibian_Wrestling_Federation_logo.jpg` | Facebook Graph `NamibiaWrestlingFederation` (NWF crest) |
| Namibia Esports (NESA) | `Namibia_Electronic_Sport_Association_logo.png` | Official `esportsnamibia.org/nesa_logo.png` (compressed) |
| Namibia Padel | `Namibia_Padel_Tennis_Federation_logo.jpg` | Facebook Graph `NamibiaPadel` |

### Crests added (migration `20260720000010`)

| Federation | File | Source |
|------------|------|--------|
| Namibia Sports Commission | `Namibia_Sports_Commission_logo.jpg` | Facebook Graph `NamSportComm` page picture (“Wings of Power”) |
| Namibia Volleyball Federation | `Namibia_Volleyball_Federation_logo.jpg` | Wayback `namibiavolleyball.org/images/NVF.jpg` |
| Chess Namibia | `Namibia_Chess_Federation_logo.png` | Wayback `namibiachessfederation.com` logo |
| Judo Namibia | `Namibian_Judo_Federation_logo.png` | Wayback `njf.com.na/images/logo-wide.png` |
| Tennis Namibia | `Namibia_Tennis_Association_logo.png` | SportyHQ/Filepicker NTA logo |
| Shooting (NHRSA) | `Namibian_Hunting_Rifle_Shooting_Association_logo.png` | `nhrsa.com/images/logo.png` |
| Basketball | `Namibian_Basketball_Federation_logo.jpg` | Facebook Graph `namibianbasketball` |
| Table Tennis | `Namibia_Table_Tennis_Association_logo.jpg` | Facebook Graph `NamibiaTT` |
| Beach volleyball | (share NVF crest) | same as Volleyball |
| Roller / Skateboarding | (share NIIHA crest) | World Skate body |
| Futsal | (share NFA crest) | administered under NFA |

### Still null-logo (notable)
Karate, Golf, Badminton, Weightlifting/PWFN, Horse Racing, Dance Sport, Taekwondo, MMA, Soft/Baseball, Surfing, Ultimate, umbrellas NUFS / TISAN (traditional) / NNSSU (students), most emerging federations.

### Rejected this pass (`000033` — LOGOS-DEEP)
- Karate FB `NamibiaKarateFederation` = Namibian flag-wave graphic (not a karate crest); `fb-naku2` = JKA Shotokan branch only
- Golf / Handball / Muaythai / Footgolf FB = generic silhouette placeholders
- Handball IHF assets = Namibia flag only (not federation crest)
- Boxing — no crest found (sport photo remains)
- Dance Sport / Horse Racing / Badminton / Taekwondo / PWFN — no verified crest found
- Fencing FB map+torch variants treated as sibling-owned (`000019`); not overwritten

### Rejected earlier (`000019`)
- Karate Wayback `naku.com.na` logo = NSC crest; FB `NamibiaKarate` = JKA branch (not national federation)
- Golf Webnode favicon = “NG” initials only (not a verified crest)
- Handball IHF member assets = Namibia flag placeholders; FB silhouette
- Boxing — no crest found (sport photo remains)
- World Archery `MALogos/?NOC=NAM` = generic “world archery member” badge

## Contacts (session 4–5 — Agent CONTACTS)

Full write-up: `docs/research/contacts_enrichment_batch.md`

| Federation | Applied | Still missing |
|------------|---------|---------------|
| Footgolf | President Chalo Chainda; SG Allan Kake (New Era) | email, phone |
| Handball | email + phone (CAHB Zone 6) | president/SG (IHF vs LinkedIn conflict) |
| Bodybuilding | President Evaristor Gylgrister (WFF / New Era) | email, phone |
| Surfing | email + phone + SG Rainer Eimbeck (ISA directory) | — |
| Padel | Leadership already present | email, phone |
| Western Mounted Games | — | all contact fields |

**Still null email AND null phone:** baseball, bodybuilding, lacrosse, footgolf, korfball, orienteering, padel, western-mounted-games, petanque, softball (**10** rows).

## Metadata (sessions 5–6 — Agent METADATA)

Full write-up: `docs/research/metadata_enrichment_batch.md`  
Duplicates: `docs/research/naming_duplicates_resolution.md`  
Schema draft: `docs/research/proposed_federation_schema_extensions.md`  
Completeness: `docs/research/federation_completeness_snapshot.md`

| Metric | Result |
|--------|--------|
| Abbreviation collisions | **0** |
| Descriptions &lt; 50 chars | **0** |
| Unique abbr / slug | **85 / 85** |
| Brand colors | **15/85 (18%)** crest-verified |
| Soft-merged duplicates | Aquatics→`swimming-namibia` (NASFED); Weightlifting→`powerlifting-namibia` (PWFN) |
| Schema gaps | Drafted (`is_active`, year, affiliation, city/region) — **not applied** |

## Client
`client/src/data/federations.ts` remains FALLBACK-ONLY (67 vs 85). Home uses tRPC first.

## Migrations applied remotely
1. `federations_reconcile`
2. `federations_populate_batch`
3. `federations_logos_and_contacts`
4. `federations_priority_crests` (+ `federations_bowls_crest`)
5. `federations_contacts_enrichment`
6. `federations_metadata_enrichment` (`20260720000007`)
7. `federations_contacts_enrichment_pass2` (`20260720000011` — Surfing ISA)
8. `federations_websites_socials` (remote name; local file `20260720000012_federations_websites_socials.sql`)
9. `federations_duplicates_and_brand_colors` (`20260720000013`)
10. `federations_websites_socials_pass2` (`20260720000018`)
11. `federations_crests_batch19` (`20260720000019`)
12. `federations_crests_deep` (`20260720000033` — Kickboxing, Sailing, NCRF, Jukskei)
13. `federations_crests_deep_pass2` (`20260720000038` — Ice Stock, Boxing NABF)
14. `federations_crests_deep_pass3` (`20260720000043` — Handball NHF, NLAS/NALASRA)
