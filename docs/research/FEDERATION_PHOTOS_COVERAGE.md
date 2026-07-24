# Federation Photos Coverage — 2026-07-24

**Question:** Did every active federation get a sport-relevant photo (Namibian preferred, generic OK)?

| Moment | Heroes (`background_image`) | Logos (`logo`) |
|--------|----------------------------:|---------------:|
| **Before this pass** | **83 / 83 (100%)** — YES | **53 / 83 (64%)** — NO |
| **After this pass** | **83 / 83 (100%)** — YES | **83 / 83 (100%)** — YES (**55** crests/identity + **28** sport marks) |

Soft-merged inactive stubs (`namibia-aquatics`, `weightlifting-namibia`) are out of scope; both already have heroes.

## Schema

| UI role | Column | Notes |
|---------|--------|-------|
| Hero / cover | `background_image` | Sport-relevant photo under `/sports/*` |
| Logo / mark | `logo` | Official crest under `/logos/*` or generic mark under `/logos/marks/*` |

## Before (live query, start of pass)

```
total_active=83  with_hero=83  with_logo=53  missing_hero=0  missing_logo=30
```

All 83 hero paths resolved to files on disk under `client/public/sports/`. Prior batches: `000036` + `000040` (see `federation_photos_batch.md`).

### Null logos before (30)

| Slug | Name | Hero already set |
|------|------|------------------|
| badminton-namibia | Badminton Namibia | `/sports/badminton.jpg` |
| baseball-namibia | Baseball Namibia | `/sports/baseball.jpg` |
| billiards-snooker-namibia | Billiards & Snooker Namibia | `/sports/billiards-action.jpg` |
| bodybuilding-namibia | Bodybuilding Namibia | `/sports/bodybuilding.jpg` |
| dance-sport-namibia | Dance Sport Namibia | `/sports/dance-sport.jpg` |
| golf-namibia | Golf Namibia | `/sports/golf.jpg` |
| indigenous-combat-sport | Indigenous Combat Sport Federation | `/sports/african-traditional-wrestling.jpg` |
| karate-namibia | Karate Namibia | `/sports/karate.jpg` |
| lacrosse-namibia | Lacrosse Namibia | `/sports/lacrosse.jpg` |
| namibia-footgolf | Namibia Footgolf Federation | `/sports/golf.jpg` |
| namibia-horse-racing | Namibia Horse Racing Association | `/sports/horse-racing.jpg` |
| namibia-kendo | Namibia Kendo Association | `/sports/kendo.jpg` |
| namibia-korfball | Namibia Korfball | `/sports/korfball.jpg` |
| namibia-modern-pentathlon | Namibia Modern Pentathlon | `/sports/modern-pentathlon.jpg` |
| namibia-muaythai | Namibia Muaythai Federation | `/sports/muaythai.jpg` |
| nnssu | Namibia National Students Sports Union | `/sports/athletics.jpg` |
| namibia-orienteering | Namibia Orienteering | `/sports/orienteering.jpg` |
| powerlifting-namibia | Namibia Power & Weight Lifting Association | `/sports/powerlifting.jpg` |
| namibia-practical-shooting | Namibia Practical Shooting Association | `/sports/practical-shooting.jpg` |
| namibia-speed-hiking | Namibia Speed Hiking Association | `/sports/speed-hiking.jpg` |
| namibia-teqball | Namibia Teqball Federation | `/sports/teqball.jpg` |
| nufs | Namibia Uniformed Forces Sports | `/sports/athletics.jpg` |
| namibia-waterski | Namibia Waterski Association | `/sports/waterski.jpg` |
| namibia-western-mounted-games | Namibia Western Mounted Games Federation | `/sports/western-mounted-games.jpg` |
| petanque-namibia | Petanque Namibia | `/sports/petanque.jpg` |
| softball-namibia | Softball Namibia | `/sports/softball.jpg` |
| surfing-namibia | Surfing Namibia | `/sports/surfing.jpg` |
| taekwondo-namibia | Taekwondo Namibia | `/sports/taekwondo.jpg` |
| tisan | Traditional and Indigenous Sports Association of Namibia | `/sports/fitness-aerobics.jpg` → improved |
| ultimate-frisbee-namibia | Ultimate Frisbee Namibia | `/sports/frisbee.jpg` |

## Changes this pass

**Migration:** `supabase/migrations/20260724120000_federations_sport_marks_coverage.sql`  
**Assets:** `client/public/logos/marks/*.svg` (30 files)

| Change | Detail |
|--------|--------|
| Logos | **28** nulls → sport-mark SVGs; **Golf** → `/logos/Namibia_Golf_Federation_logo.jpg`; **Dance Sport** → `/logos/Dance_Sport_Namibia_logo.jpg` |
| Hero tweak | `tisan` hero → `/sports/african-traditional-wrestling.jpg` (more role-relevant than fitness-aerobics) |
| Crests | Golf + Dance Sport crests from NNOC affiliated-members assets (previously rejected FB silhouettes) |

### After (live re-query)

```
total_active=83  with_hero=83  with_logo=83  missing_hero=0  missing_logo=0
mark_logos=28  crest_or_other=55
```

## Honest answer to the user question

- **Heroes / sport photos:** **YES** — already 100% before this pass; remains 100% after. Namibia-specific where available (football, rugby, cricket, hockey, basketball, swimming, boxing, etc.); otherwise sport-correct Commons/Unsplash locals.
- **Official crests:** **Partial** — 55 identity logos (incl. newly added Golf + Dance); the other **28** use clearly generic sport silhouettes (`/logos/marks/*`), not invented trademarks.
- **Still without a photo:** **None** among active federations. Inactive merged stubs may keep thin branding by design.

## Policy notes

- Do not replace `/logos/marks/*` with invented “official” crests if a real crest is later found — swap to the verified file.
- Prefer real crests from federation sites / Wikimedia when they become available (Golf, Karate, Badminton, PWFN, NNSSU, NUFS, TISAN remain the highest-value crest hunts).
