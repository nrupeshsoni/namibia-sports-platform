# Crests + hollow fill batch — 2026-07-24

**Project:** `rbibqjgsnrueubrvyqps`  
**Branch:** `main`  
**DB mutated:** **Y** (Supabase MCP `apply_migration`)

## Goal

Lift production crest quality (upgrade verified federation marks over generic `/logos/marks/*` SVGs) and fill hollow Clubs / Athletes / News tabs where **named public sources** exist. Soft-merged `namibia-aquatics` → `swimming-namibia` and `weightlifting-namibia` → `powerlifting-namibia` remain **inactive**.

## Baseline (this session start)

| Metric | Value |
|--------|------:|
| Active federations | 83 |
| SQL-null logos | **0** (sibling pass applied sport-mark SVGs: `20260724120000_federations_sport_marks_coverage.sql`) |
| Real crest paths (not `/logos/marks/%`) | **55** |
| Mark placeholders | **30** → **28** after sibling timing / recount **28** pre-upgrade |
| Active athletes | **178** |
| Active clubs | **171** |
| Published news | **79** |

Historical scorecard “logos 64% / 30 null” referred to **null before sport-marks**. This batch upgrades two marks to verified NNOC crests and fills hollow content.

## Crests

### Promoted (verified federation brand marks)

| Federation | File | Source |
|------------|------|--------|
| Golf Namibia (`golf-namibia`) | `client/public/logos/Namibia_Golf_Federation_logo.jpg` | NNOC affiliated-member page hero: `https://olympic.org.na/affiliated-members/namibia-golf-federation` (`…/549c3adbed0bbb035ccaef8a18fce5b1b5d4bd34.jpg`) — “NAMIBIA GOLF FEDERATION” wordmark + flag-coloured golfer graphic |
| Dance Sport Namibia (`dance-sport-namibia`) | `client/public/logos/Dance_Sport_Namibia_logo.jpg` | NNOC affiliated-member page hero: `https://olympic.org.na/affiliated-members/dance-sports-namibia` (`…/d51b86c23ce6218e3fc443e02cde60ac16aaaece.jpg`) — “DSN / DANCE SPORT NAMIBIA / Setting The Standard” |

Migration (remote): `federations_crests_nnoc_golf_dance`  
Local ledger: `supabase/migrations/20260724180000_federations_crests_nnoc_golf_dance.sql`

### Rejected (leave mark / no invent)

| Candidate | Verdict |
|-----------|---------|
| Karate FB `NamibiaKarateFederation` + Wayback `naku.com.na/images/nakulogo_*` + NNOC karate hero | **NSC flag-wave** graphic (not a karate crest) |
| Golf FB Graph | **1876 B** silhouette placeholder |
| Golf Webnode | Platform boilerplate / no crest asset |
| Badminton BWF archive / PWFN IPF Africa | Text-only directories — no federation crest file |
| NNSSU / NUFS / TISAN | No verified org crest (NSSU Schools eagle = wrong org for Students/FISU row) |
| Footgolf / Muaythai FB | Silhouette placeholders |
| Surfing / Ultimate / TKD IF pages | No federation crest asset found |

## Hollow content added

### Clubs (+18)

| Fed | Clubs | Sources |
|-----|------:|---------|
| NIIHA | Badgers, Kamikaze, Coastal Pirates, Scorpions | `niiha.com/the-clubs/` (+ club pages; phones/emails only when published) |
| Fistball | SKW, Cohen Faustball Club, DTS, SFC Swakopmund | `skw.com.na` Fistball page club list |
| Cue / NCSF | Namshooters, Coastal Waves, Young Ones, Tura Boys, Queen Cues, King Cues, Rehoboth Pool Club, 007, Coastal Warriors | Namibian Sun Champ of Champs 2025-12-05 |
| Climbing | Mountain Club of Namibia | `mcnam.org` |

Remote: `clubs_hollow_verified_niiha_fistball_cue`  
Local: `supabase/migrations/20260724180100_clubs_hollow_verified_niiha_fistball_cue.sql`

### Athletes (+15)

| Fed | Count | Sources |
|-----|------:|---------|
| NESA | 5 | Official NESA Dota 2 IESF African Qualifiers roster |
| Darts | 4 | The Namibian national-team selection article |
| Cue sports | 5 | Namibian Sun Champ of Champs / league awards |
| Taekwondo | 1 | New Era — Owen Samunzala World Championships debut |

Remote: `athletes_hollow_verified_nesa_darts_cue_tkd`  
Local (combined ledger): `supabase/migrations/20260724180200_athletes_news_hollow_verified.sql`

### News (+5)

| Slug | Fed | Source |
|------|-----|--------|
| `nesa-team-namibia-dota-2-iesf-african-qualifiers` | NESA | esportsnamibia.org |
| `tkd-owen-samunzala-wuxi-world-championships-2025` | TKD | neweralive.na |
| `ncsf-champ-of-champs-namshooters-2025` | Cue | namibiansun.com |
| `dsn-national-champions-crowned-2025` | DSN | republikein.com.na |
| `niiha-clubs-badgers-kamikaze-pirates-scorpions` | NIIHA | niiha.com/the-clubs/ |

Remote: `news_hollow_verified_nesa_tkd_cue_dsn_niiha`

## Live counts (after apply)

| Metric | Before | After | Δ |
|--------|-------:|------:|--:|
| Real crests (non-mark) | 53→55* | **55** | +2 Golf/DSN vs mark baseline |
| Mark placeholders | 30→28* | **28** | −2 |
| SQL-null logos | 0 | **0** | 0 |
| Active athletes | 178 | **193** | +15 |
| Active clubs | 171 | **189** | +18 |
| Published news | 79 | **83** | +4 net (+5 inserted; live total 83) |

\*Sibling sport-mark pass zeroed SQL-nulls first; this pass upgraded Golf/DSN marks to NNOC JPG crests (live paths confirmed).

Soft-merge check: `namibia-aquatics` / `weightlifting-namibia` still `is_active = false`.

## Explicitly not done

- Invented crests for Karate / Badminton / PWFN / umbrellas  
- Fabricated club phones/emails  
- New event fixture dates  
- Long-tail zero-source federations (kendo, teqball, orienteering, lacrosse, etc.)
