# Clubs Enrichment Batch — 2026-07-20

**Scope:** `sportsplatform_clubs` logos (`logo_url`) + verified website / email / phone / address.  
**Rule:** Never fabricate contacts. Unverified fields left null.  
**Migration:** `supabase/migrations/20260720000042_clubs_enrichment_batch.sql`  
**Assets:** `client/public/logos/clubs/` (22 files)

## Baseline (live, pre-migration)

| Metric | Count |
|--------|------:|
| Clubs total | 62 |
| With logo | 0 (0%) |
| With any contact (email/phone/website) | 0 (0%) |
| Federations with clubs | ~16 |

Priority focus: NFA (18), NRU (7), Cricket Namibia (6).

---

## Logos applied

### A. Dedicated club / venue crests (22 assets → 24 club rows)

| Club slug | Path | Source |
|-----------|------|--------|
| `african-stars-fc` … `young-african-fc` (17 NFA) | `/logos/clubs/*.png` | Transfermarkt club wappen (official crest artwork) |
| `wanderers-rugby`, `wanderers-cricket`, `wanderers-hockey` | `/logos/clubs/wanderers-sports-club.png` | [Wanderers Cricket](https://cricket.wanderers.org.na/) site logo |
| `dts-hockey` | `/logos/clubs/dts-hockey.png` | [dts.org.na](https://www.dts.org.na/images/logos/DTS-LOGO.png) |
| `windhoek-golf` | `/logos/clubs/windhoek-golf.png` | [wccgolf.com.na](https://wccgolf.com.na/) header logo |
| `rossmund-golf` | `/logos/clubs/rossmund-golf.jpg` | [rossmund.com](https://www.rossmund.com/) official logo |
| `dome-basketball` | `/logos/clubs/the-dome.jpg` | [thedomenamibia.com](https://www.thedomenamibia.com/) site icon |
| `namibia-cricket-academy` | `/logos/cricket-logo.png` | Cricket Namibia federation crest (academy under CN) |

NFA crests with files: African Stars, Black Africa, Blue Waters, Civics, Eeshoke Chula Chula, Eleven Arrows, FC Ongos, Julinho Sporting, Khomas Nampol, Mighty Gunners, Okahandja United, Orlando Pirates Windhoek, Rundu Chiefs, Tigers, Tura Magic, UNAM FC, Young African.

### B. Sport-correct fallbacks (remaining clubs)

| Sport path | Clubs |
|------------|-------|
| `/sports/football.jpg` | King Kauluma Palace FC (no crest found) |
| `/sports/rugby.jpg` | United, Reho Falcon, Coastal, Western Suburbs, Rehoboth, Rundu rugby |
| `/sports/cricket.jpg` | United, Swakopmund, Old Boys, Dolphins cricket |
| `/sports/basketball.jpg` | ABC, Cougars |
| `/sports/athletics.jpg` | UNAM / Windhoek / Coastal athletics |
| `/sports/netball.jpg` | Queens, NDF, Uukumwe, Swakopmund netball |
| `/sports/volleyball.jpg` | Windhoek / Coastal / UNAM / Swakopmund volleyball |
| `/sports/swimming.jpg` | Windhoek / Coastal / NDF aquatic |
| `/sports/cycling.jpg` | Desert Riders, Coastal Cyclists |
| `/sports/badminton.jpg` | Windhoek / Swakopmund badminton |
| `/sports/judo.jpg` | Windhoek / Swakopmund judo |
| `/sports/karate.jpg` | Windhoek Karate |
| `/sports/table-tennis.jpg` | Windhoek TT |
| `/sports/tennis.jpg` | Windhoek / Swakopmund tennis |

**Logo coverage after apply:** 62/62 (100%). Dedicated crest rows: **25** (22 under `/logos/clubs/` + Cricket Namibia crest for academy + Wanderers reused×3); sport-correct: **37**.

---

## Contacts applied (verified)

| Club | Website | Email | Phone | Address | Source |
|------|---------|-------|-------|---------|--------|
| Wanderers Cricket | cricket.wanderers.org.na | — | +264 61 242069 | Tunchel St, Pionierspark | [Contact Us](https://cricket.wanderers.org.na/contact-us/) |
| Wanderers Rugby | wanderers.org.na | — | +264 61 242069 | Tunchel St, Pionierspark | Same club phone; [wanderers.org.na](https://www.wanderers.org.na/) |
| Wanderers Hockey | wanderers.org.na | — | +264 61 242069 | Tunchel St, Pionierspark | Multi-sport club |
| DTS Hockey | dts.org.na | dts@iway.na | +264 61 251 699 | Sean McBride & Tennis St, Olympia | [DTS Contact](https://www.dts.org.na/info-contact) |
| Rössmund Golf | rossmund.com | golf@rossmund.com | +264 64 405644 | B2 Road, Farm 160, Swakopmund | [rossmund.com/map](https://www.rossmund.com/map) |
| Windhoek Golf | wccgolf.com.na | — | +264 61 258 498 | — | Official site maintenance page (Pro Shop) |
| Dome Basketball | thedomenamibia.com | info@thedomenamibia.com | +264 64 400 301 | 5371 Welwitschia St, Swakopmund | [Dome Contact](https://www.thedomenamibia.com/dome-contact) |
| Namibia Cricket Academy | cricketnamibia.com | — | +264 83 707 1220 | Cricket St, Olympia | [CN Contact](https://cricketnamibia.com/contact-us/) (CN-run academy) |

**Clubs with any contact after apply:** 8/62 (~13%).  
**Still empty contacts:** 54/62 (~87%).

---

## Explicitly not applied

| Claim | Why rejected |
|-------|----------------|
| africanstarsfc.com / info@africanstarsfootballclub.com | Domain is Vietnam SEO/affiliate content, not Namibian club admin |
| blackafricasc.com | Domain inactive; club in leadership dispute (New Era) |
| Civics Tel +264 61 277 450 / hs@civicsfc.com | Stale Buschschule-era site; NFA announced rename to Bucks Buccaneers |
| Transfermarkt emails for NFA clubs | Aggregator-only; not primary club publications |
| manager@wanderers.org.na | Cited on directories only; not on official Wanderers contact page |
| treasury@scc.com.na (Swakopmund Cricket) | Not confirmed on a primary page in this pass |
| westernsuburbsrc@gmail.com | Wrong-country / unverified Namibia match |
| UNAM FC unamfc@unam.na | Search synthesis only; not on Wikipedia/UNAM pages verified here |
| Ongos Valley property email hub@ongosvalley.com.na | Housing developer, not football club |
| Windhoek Tennis = Central Tennis Club phones | Name mismatch; left null |
| Infinity Aquatics / Aqua Swimming as Windhoek Aquatic Club | Different entities |

---

## Counts (target after remote apply)

| Metric | Before | After |
|--------|-------:|------:|
| With logo | 0 | **62** (100%) |
| Dedicated crest (not sport photo) | 0 | **25** (~40%) |
| With website | 0 | **8** |
| With email | 0 | **3** |
| With phone | 0 | **8** |
| With any contact | 0 | **8** (~13%) |
| Still no contact | 62 (100%) | **54** (~87%) |

---

## Pass 2 — contacts only (2026-07-20)

**Migration:** `supabase/migrations/20260720000045_clubs_contacts_pass2.sql`  
**Scope:** website/social only. Logos untouched. No new email/phone (none verified on primary pages).

### Newly filled websites (14)

| Club slug | Website | Source |
|-----------|---------|--------|
| `african-stars-fc` | facebook.com/africanstarssoccerclub | Official logo-unveil posts |
| `orlando-pirates-windhoek` | facebook.com/orlandopiratesnam | [Wikipedia external links](https://en.wikipedia.org/wiki/Orlando_Pirates_Windhoek) |
| `young-african-fc` | facebook.com/FCYOUNGAFRICAN | [Wikipedia](https://en.wikipedia.org/wiki/Young_African_FC) |
| `tigers-fc` | facebook.com/ingweinyama | [de.Wikipedia Tigers](https://de.wikipedia.org/wiki/Tigers_FC) |
| `eeshoke-chula-chula-fc` | facebook.com/ChulaChulaFc | [Wikipedia Website field](https://en.wikipedia.org/wiki/Eeshoke_Chula_Chula_FC) |
| `civics-fc` | facebook.com/p/Bucks-Buccaneers-… | Rebrand [NFA](https://nfa.org.na/civics-football-club-officially-changes-name-to-bucks-buccaneers/) + [Wikipedia](https://en.wikipedia.org/wiki/Bucks_Buccaneers_FC) |
| `eleven-arrows-fc` | facebook.com/ElevenArrowsFc | Club-named page (matches Walvis Bay club) |
| `blue-waters-fc` | facebook.com/bluewatersfc | Club-named page (Wikipedia cites FB presence) |
| `mighty-gunners-fc` | facebook.com/mightygunnersfc | Club-named page (Otjiwarongo NDF club) |
| `fc-ongos` | instagram.com/f.c_ongos | Club-branded Instagram (#fcongos) |
| `united-rugby` | facebook.com/p/Trustco-United-Rugby-Club-… | [de.Wikipedia United Sport Club](https://de.wikipedia.org/wiki/United_Sport_Club) |
| `united-cricket` | same United Sport Club FB | Multi-code club (CN lists Trustco United CC) |
| `western-suburbs-rugby` | facebook.com/westernsuburbsrc | FB About references Windhoek, Namibia |
| `old-boys-cricket` | cricketnamibia.com/…/old-boys | [CN club page](https://cricketnamibia.com/windhoek-high-school-old-boys/) |

### Pass 2 rejected

| Claim | Why |
|-------|-----|
| africanstarsfc.com / blackafricasc.com / civicsfc.com / elevenarrowsfc.com | Dead, wrong-country, or empty shells (TM links only) |
| Transfermarkt phones | Aggregator — not used |
| Black Africa Facebook | Marked unofficial; leadership dispute |
| Coastal Rugby = Kudus contacts | Name/entity mapping unproven |
| Young African “081 144 880” (New Era) | Truncated number — not applied |
| UNAM FC unamfc@unam.na / Unambraves.com | Directory/synthesis only |
| treasury@scc.com.na | Still unverified on primary page |
| westernsuburbsrc@gmail.com (non-Namibia clubs) | Wrong country |

### Counts after Pass 2 (live)

| Metric | Pass 1 | Pass 2 |
|--------|-------:|-------:|
| With any contact | 8 | **22** (~35%) |
| With website | 8 | **22** |
| With email | 3 | **3** |
| With phone | 8 | **8** |
| Still no contact | 54 | **40** (~65%) |

---

## Follow-ups

1. NFA: request club admin emails/phones via NPFL/NFA (no public club directory).
2. Rename DB slug/name `civics-fc` → Bucks Buccaneers when product allows.
3. NRU: Coastal (Walvis Bay vs Kudus), Rehoboth, Reho Falcon, Rundu — social About scrape for email/phone.
4. Cricket: Swakopmund CC / Dolphins — still no primary club contacts.
5. Black Africa / King Kauluma / Julinho / Nampol / Rundu Chiefs / Okahandja / Tura Magic — hard gaps.

---

## Pass 3 — clubs expansion (2026-07-20)

**Migration:** `supabase/migrations/20260720000048_clubs_expansion_verified.sql`  
**Scope:** Insert **30** verified named clubs. **5** previously empty federations get first clubs. No fabricated contacts.

### Baseline → after (live)

| Metric | Before | After |
|--------|-------:|------:|
| Clubs total | 62 | **92** |
| Federations with clubs | 16 | **21** |
| New federations covered | — | boxing, squash, bowls, wrestling, gymnastics |

### New federations (13 clubs)

| Fed slug | Clubs | Sources |
|----------|-------|---------|
| `namibia-boxing` | Salute Boxing Academy; AC Boxing Gym; Chiappini Boxing Club | [saluteboxingacademy.com](https://saluteboxingacademy.com/); Namibia Daily News AC launch; Chiappini club (Windhoek) |
| `squash-namibia` | Wanderers Squash; Klein Windhoek Squash; SFC Squash | [wanderers.org.na](https://www.wanderers.org.na/); [kwsquash.com.na](https://www.kwsquash.com.na/); [sfc1929.com/squash](https://www.sfc1929.com/squash) |
| `bowls-namibia` | Windhoek / Eros / Trustco United Bowling | The Namibian + NBC National Bowls Week venues |
| `wrestling-namibia` | Windhoek Wrestling Club | WIS / NWF Nationals 2024 |
| `namibia-gymnastics` | Windhoek Rhythmic Club; SKW Gymnastics Academy; Elite Rhythmic | Namibian Sun WRC/Elite; [skw.com.na](http://www.skw.com.na/); NGF club list |

### Expansions on existing feds (17 clubs)

| Fed | Added | Sources |
|-----|-------|---------|
| `nhu` | Saints; School of Excellence; UNAM Hockey | [namibiahockey.org](https://namibiahockey.org/find-a-club/) club pages (+ Saints contact) |
| `namibia-basketball` | QBC; UNAM Wolves; Afro Stars | KBA Premier League (Namibian Sun / Republikein 2026) |
| `tennis-namibia` | Central Tennis Club | CAT/NTA host venue + Facebook CentralTennisClub |
| `namibia-volleyball` | NDF; Khomas NamPol; Afrocat | NVF CVA affiliated list + MTC VNL press |
| `namibia-netball` | NCS; Otjozondjupa NamPol; UNAM Ogongo; Afrocat Lions | MTC Netball Namibia Premier League (The Namibian / NBC) |
| `athletics-namibia` | NUST Welwitschia; Windhoek Gymnasium AC; Dome Athletics Academy | Athletics Namibia Grand Prix club list (Namibia Economist) |

### Contacts filled this pass (verified only)

| Club | Website / contact | Notes |
|------|-------------------|-------|
| Salute Boxing Academy | site + email + phone + address | Primary club site |
| Wanderers Squash | wanderers.org.na + club phone/address | Dedicated squash subdomain suspended |
| Klein Windhoek Squash | kwsquash.com.na + email + phone + address | NSA-affiliated official site |
| SFC Squash | sfc1929.com/squash | NSA-affiliated section page |
| SKW Gymnastics | skw.com.na | Club site |
| Saints Hockey | namibiahockey.org page + email + phone | NHU club page |
| SOE / UNAM Hockey | namibiahockey.org club pages | Website only |
| Central Tennis Club | Facebook + Olympia address | No primary email/phone applied |

### Explicitly not applied

| Claim | Why |
|-------|-----|
| acboxing-nam.com / directory phones for AC Boxing | Site 403 / aggregator — name+city only |
| Chiappini Boxing contacts | LinkedIn location only — no public club site |
| Bowls / most netball / volleyball / basketball / athletics phones | Press names clubs but no primary contact pages |
| Coastal Raiders / Sparta / WOBSC hockey | Deferred; NHU site under maintenance at apply time |
| Salty Jackal / surf schools as Surfing Namibia “clubs” | Commercial schools, not federation club register |
| The Collective (athletics) | Development platform, not a named club in GP list |

### Counts after Pass 3 (live)

| Metric | Pass 2 | Pass 3 |
|--------|-------:|-------:|
| Clubs total | 62 | **92** (+30) |
| Feds with clubs | 16 | **21** (+5) |
| With website | 22 | **31** (+9 this pass) |

---

## Pass 4 — clubs expansion (2026-07-20)

**Migration:** `supabase/migrations/20260720000050_clubs_expansion_pass4.sql`  
**Scope:** Insert **39** verified named clubs. **5** previously empty federations get first clubs. Logos = sport-correct `/sports/*`. Contacts only from primary federation/club pages.

### Baseline → after (live)

| Metric | Before | After |
|--------|-------:|------:|
| Clubs total | 92 | **131** (+39) |
| Federations with clubs | 21 | **26** (+5) |
| New federations covered | — | chess, motorsport, equestrian, sailing, handball |

### New federations (19 clubs)

| Fed slug | Clubs | Sources |
|----------|-------|---------|
| `chess-namibia` | Capablanca Chess Club; Rubinstein Chess Academy; NUST Chess Club; Zandell Chess Academy | Africa Chess Media / New Era league; rubinstein.com.na; nust.na chess society |
| `motorsport-namibia` | Windhoek Motor Club; Swakopmund Karters; Walvis Bay Motor Club; Namibian Enduro Club; Swakopmund Motor Club; Tsumeb Motor Club | NMSF affiliated clubs page |
| `equestrian-namibia` | Gymkhana Club Windhoek; Reiter Verein Swakopmund; Walvis Bay Equestrian Club; Reit Club Okahandja; Auas View Equestrian Club | NAMEF affiliation / club pages |
| `sailing-namibia` | Walvis Bay Yacht Club | wbyc.com.na + club PDFs (wbyc@iway.na) |
| `namibia-handball` | Titans; City Pillars; Swallows Handball Club | The Namibian — Redzone Handball Clash |

### Expansions on existing feds (20 clubs)

| Fed | Added | Sources |
|-----|-------|---------|
| `swimming-namibia` | Marlins; Infinity Aquatic; Aqua Swimming & Fitness; Dolphins SC; Phoenix SC; Swakopmund SC; Flippers SC | NASFED 2024 AGM; infinity-aquatics.com; aquaswimmingclub.com.na |
| `namibia-cycling` | Windhoek Pedal Power; Rock & Rut; Spoke Stars BMX | NCF affiliated clubs; windhoekpedalpower.com |
| `cricket-namibia` | Welwitschia; Zebra; CCD; Blue Waters Cricket Club | cricketnamibia.com/clubs |
| `nru` | Kudus; UNAM; Grootfontein; Dolphin Rugby Club | FNB Rugby League Republic |
| `karate-namibia` | Namibia Japan Karate Association (JKA); Shotokan Karate Swakopmund | namjkakarate.com; Shotokan Swakopmund dojo |

### Explicitly not applied

| Claim | Why |
|-------|-----|
| Triathlon named clubs | NTF allows clubs but no public named club register |
| Gymkhana personal emails | NAMEF page unreliable at fetch — website only |
| Handball phones | Press names clubs; no primary club sites |
| Athletics extras | No new verified named clubs beyond existing six |
| Weekend Chess Academy / TWCA | Deferred vs Capablanca/Zandell |

### Counts after Pass 4 (live)

| Metric | Pass 3 | Pass 4 |
|--------|-------:|------:|
| Clubs total | 92 | **131** (+39) |
| Feds with clubs | 21 | **26** (+5) |
