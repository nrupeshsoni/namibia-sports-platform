# Hollow federations — production content fill (2026-07-21)

**Agent:** Content fill (hollow core / NBF athletes)  
**Project:** `rbibqjgsnrueubrvyqps`  
**Branch:** `fix/gap-register-section-a`  
**DB mutated:** **Y** (3 migrations applied remotely)

## Goal

Close the Big-8 **NBF athletes = 0** hole and reduce hollow Clubs / Athletes / News tabs where **verified** public sources exist. No fabricated contacts or event dates. Crests: re-hunted priority null-logo feds — **no new verified crest assets** (prior deep-pass rejections still stand).

## Migrations (local + remote ledger)

| Local file | Remote name |
|------------|-------------|
| `supabase/migrations/20260721140000_athletes_nbf_majors_fill.sql` | `athletes_nbf_majors_fill` |
| `supabase/migrations/20260721140100_clubs_hollow_feds_verified.sql` | `clubs_hollow_feds_verified` |
| `supabase/migrations/20260721140200_news_hollow_feds_verified.sql` | `news_hollow_feds_verified` |

## Athletes added (38 rows, idempotent)

| Fed | Count | Sources |
|-----|------:|---------|
| NBF (basketball) | **14** | Wikipedia UNAM Wolves + Lions B.C. BAL qualifier rosters |
| NAGU (golf) | **6** | New Era Namibian Open / Gold Cup / Windhoek Open; The Namibian Northern Open + women’s Challenge |
| BFN (badminton) | **6** | Wikipedia Namibia national badminton team squad |
| PWFN (powerlifting) | **3** | New Era Shangadi / PWFN budget; The Namibian Meyer |
| MMAN (MMA) | **2** | IMMAF Africa 2024 + Hybrid Fitness site |
| NKBF (kickboxing) | **2** | Republikein Desert Storm 5 |
| NHF (handball) | **1** | IHF player profile Sakaria Shikongo |
| NJF (jukskei) | **4** | Namibia Economist / NSC Kroonstad tests |

Photos: `/sports/*` or existing `/athletes/golf.jpg` — no invented portraits.

## Clubs added (4)

| Club | Fed | Source | Contacts |
|------|-----|--------|----------|
| Lions Basketball Club | NBF | Wikipedia Lions B.C. | name+city only |
| Hybrid Fitness Centre | MMAN | hybridfitnesscentre.com | website only |
| Combat Club Windhoek | NKBF | The Namibian Muay Thai / NKBF affiliate piece | address from article; no phone/email invented |
| Karas Handball Club | NHF | IHF player club name | name+city only |

## News added (6)

| Slug | Fed | Source |
|------|-----|--------|
| `jukskei-namibia-senior-tests-kroonstad-sa` | NJF | economist.com.na |
| `mman-damian-muller-immaf-africa-flyweight-2024` | MMAN | immaf.org |
| `nkbf-muller-brothers-desert-storm-5` | NKBF | republikein.com.na |
| `bfn-lynn-du-preez-awiba-2021` | BFN | badmintonafrica.com |
| `nagu-parker-namibian-open-2026` | NAGU | neweralive.na |
| `pwfn-shangadi-world-championships-brazil-bronze` | PWFN | neweralive.na |

## Crests

Priority null logos (NAGU, NKF, BFN, DSN, NSRF, TKD, UFN, PWFN, NNSSU, NUFS, TISAN) re-checked against prior `000055` / deep-pass notes:

- **No new crest promoted** — NSSU Schools eagle ≠ NNSSU; golf/karate/badminton/PWFN/surfing/TKD/ultimate/umbrellas still lack a verifiable federation crest file.
- Null logos remain **30 / 83** active.

## Live counts (after apply)

| Metric | Before (~gap snapshot) | After |
|--------|------------------------:|------:|
| Active athletes | 124 | **162** (+38) |
| NBF athletes | 0 | **14** |
| Active clubs | 165 | **169** (+4) |
| Published news | 73 | **79** (+6) |
| Null logos | 30 | **30** (unchanged) |
| Hollow core-5 | 26 | **24** (−2: MMAN, NKBF exit via club+news+athletes) |

## Explicitly not done

- New event rows / invented fixture dates  
- Fabricated club emails/phones  
- Crest uploads for rejected candidates under `client/public/logos/_candidates/`  
- Long-tail hollow emerging sports with no named clubs or press (kendo, teqball, orienteering, etc.)

---

## Polish pass (2026-07-23)

**Migration:** `20260723100000_athletes_clubs_hollow_polish.sql` (remote: `athletes_clubs_hollow_polish`)  
**Sitemap:** regenerated `scripts/data/*-slugs.json` + `client/public/sitemap.xml` → **83** feds / **79** news / **178** athletes.

### Athletes / clubs added

| Fed | Athletes | Clubs | Sources |
|-----|----------:|------:|---------|
| Karate | **5** | +OGKN | goju-ryu-karate-namibia.com UFAK Region South 2026 |
| Dance Sport | **6** | +Codesync | Republikein DSN nationals 2025 |
| Triathlon | **4** | — | The Namibian Africa Junior golds + triathlon.org NF rankings |
| Taekwondo | **1** | — | New Era Seth Mabuza Zone 6 bronze |

### Crest re-hunt (Golf / Karate / Badminton / PWFN)

| Candidate | Verdict |
|-----------|---------|
| FB `NamibiaKarateFederation` | **Reject** — Namibian flag-wave / Paralympic-style graphic, not karate crest |
| FB `NamibiaKarate` | **Reject** — Namibia JKA Shotokan branch logo |
| Golf FB / Webnode | **Reject** — silhouette / initials-only favicon |
| Badminton / PWFN | **Reject** — no verified federation crest file found |

Null logos remain **30 / 83** active.

### Live counts (after polish)

| Metric | Before polish | After |
|--------|--------------:|------:|
| Active athletes | 162 | **178** (+16) |
| Active clubs | 169 | **171** (+2) |
| Published news | 79 | **79** |
| Null logos | 30 | **30** |
