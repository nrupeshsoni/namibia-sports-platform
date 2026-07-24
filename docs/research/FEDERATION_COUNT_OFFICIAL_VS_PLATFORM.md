# Federation count: official “61” vs platform “85”

**Queried live:** 2026-07-24 · Supabase project `rbibqjgsnrueubrvyqps` · table `sportsplatform_federations`  
**Admin UI:** `federations.listAll` length (includes soft-merged inactive rows)

---

## Short answer

| Figure | Meaning | Source |
|------:|---------|--------|
| **61** | Ministry figure for **registered sport federations** (funding intent) | MEIYSAC Budget Vote 27, FY 2026/2027 (10 Apr 2026) |
| **57 (+ umbrellas)** | NSC contact roster: **57 sport federations** + **8 umbrella bodies** | NSC PDF *UPDATED FEDERATION CONTACT DETAILS* (25 Feb 2025) |
| **~26–32** | **NNOC affiliated members** (Olympic / Commonwealth pathway codes) | [olympic.org.na/members](https://olympic.org.na/members) — *not* the same as NSC’s 57 |
| **85** | Platform **directory entities** in one table | Live DB: Ministry + Commission + umbrellas + sports codes + soft-merge redirects |

The Admin card showing **85** is correct for “rows we manage.” It is **not** a claim that Namibia has 85 NSC-registered federations or 85 NNOC members.

---

## Official “61” — what it means

In the **Ministry of Education, Innovation, Youth, Sports, Arts and Culture** budget speech for Vote 27 (FY 2026/2027, delivered 10 April 2026), the Deputy Minister states the intention that **“all 61 registered sport federations should receive an allocation of resources.”**

That sentence refers to **NSC-registered sport federations** in the Ministry’s funding vocabulary. It does **not** include:

- the Ministry itself  
- the Namibia Sports Commission as a separate “federation”  
- umbrella / sector bodies (NNOC, Paralympic, schools, students, uniformed forces, etc.)

### Related official counts (same ecosystem, different scopes)

| Source | Count | Scope |
|--------|------:|-------|
| MEIYSAC Budget Vote 27 (Apr 2026) | **61** | Registered sport federations (funding target) |
| NSC Feb 2025 contact PDF | **57** + **8** umbrellas | Named federations + umbrella sport bodies |
| NSC public blurb (namibiasport.org / LinkedIn) | **57** + **6** umbrellas | Marketing summary; umbrella count differs from Feb PDF |
| NNOC affiliated members | **~26–32** | Olympic / recognised IF pathway only |
| Platform design brief (Dec 2025) | **67** = 1+1+8+**57** | Ministry + Commission + 8 umbrellas + 57 sports |

So “61” is a **2026 Ministry registered-federations** figure; “57” is the **Feb 2025 NSC federation roster**; neither equals the platform’s **85-entity directory**.

---

## Live platform breakdown (85)

```text
85 total rows
├── 83 active (public federations.list)
│   ├── 1  ministry
│   ├── 1  commission          (Namibia Sports Commission)
│   ├── 8  umbrella            (NNOC, Paralympic, NAWISA, NNSSU, NUFS, TISAN, NLAS, Martial Arts)
│   └── 73 federation          (sport codes / national governing bodies)
└── 2  inactive soft-merged    (URL redirects; Admin listAll still sees them)
    ├── namibia-aquatics → swimming-namibia
    └── weightlifting-namibia → powerlifting-namibia
```

**Arithmetic check:** `1 + 1 + 8 + 73 + 2 = 85`.

| `type` | Active | Soft-merged inactive | Total |
|--------|-------:|---------------------:|------:|
| ministry | 1 | 0 | 1 |
| commission | 1 | 0 | 1 |
| umbrella | 8 | 0 | 8 |
| federation | 73 | 2 | 75 |
| **Sum** | **83** | **2** | **85** |

### Why Admin shows 85 (not 83 or 61)

- Admin uses `federations.listAll`, which includes the **2 soft-merged** rows kept for slug redirects.  
- The big number is **entities in the directory table**, not “NSC-registered federations only.”

### Why 73 active `type=federation` > official 61 / 57

The platform is a **national sports directory**, not a strict clone of one PDF. Extra rows come from:

1. **Codes beyond the Feb 2025 NSC extract** (examples still active on the platform): Handball, Beach Volleyball, Futsal, Surfing, Climbing, Mountaineering, Orienteering, Petanque, Lacrosse, Baseball, Softball, Bodybuilding, Ultimate, Skateboarding, Roller Sports, Korfball, Modern Pentathlon, plus newer codes such as FootGolf / Padel / Western Mounted Games (added in `20260720000001` against a 2026 NSC-oriented reconcile).  
2. **Splits vs combined NSC lines** — e.g. Canoeing and Rowing as two slugs where NSC listed “Canoe & Rowing”; Angling as one row where NSC listed Freshwater + Sea Water.  
3. **Soft-merge retention** — two inactive federation rows remain so old URLs resolve (`is_active=false`, `merged_into_slug` set).

Conversely, some Feb 2025 NSC names are **not** separate active federation rows (by design or still open): e.g. Namibia Premier League (league body), Saddle Seat Equestrian, Endurance Riding, Traditional Sport and Games Federation (covered conceptually by umbrella TISAN).

---

## Umbrella bodies on the platform (8)

| Slug | Name |
|------|------|
| `nnoc` | Namibia National Olympic Committee |
| `namibia-paralympic` | Namibia Paralympic Committee |
| `nawisa` | Namibia Women in Sport Association |
| `nnssu` | Namibia National Students Sports Union |
| `nufs` | Namibia Uniformed Forces Sports |
| `tisan` | Traditional and Indigenous Sports Association of Namibia |
| `nlas` | Namibia Local Authority Sports |
| `namibia-martial-arts` | Namibia Martial Arts Federation |

Plus governance rows: `ministry-sport`, `namibia-sports-commission`.

---

## Cleanup needed?

| Action | Recommendation |
|--------|----------------|
| Mass-delete rows to force Admin = 61 | **No** — would destroy directory coverage, FK content, and soft-merge redirects |
| Delete soft-merged aquatics / weightlifting rows | **No** — required for `getBySlug` redirect behaviour |
| Clarify Admin stats copy | **Yes** — show federations vs bodies (and note merged) without removing data |
| Optional later: `nsc_registered` / roster tag | Optional schema flag so UI can filter “official 61/57” vs “directory extras” — **needs product approval** |
| Optional later: add missing NSC names (Saddle Seat, Endurance Riding, …) | Additive research only — **do not delete** existing long-tail without approval |

**Verdict:** No data purge. The 85 count is an intentional multi-entity directory. Treat **61** as the Ministry’s registered-federation funding figure, **57** as the Feb 2025 NSC federation list, and **85** as platform entities.

---

## How to re-check

```sql
SELECT type::text, is_active, (merged_into_slug IS NOT NULL) AS soft_merged, COUNT(*)
FROM sportsplatform_federations
GROUP BY 1, 2, 3
ORDER BY 1, 2 DESC, 3;
```

Evidence siblings: `docs/research/federation-contacts-extracted.md`, `docs/02_database_schema.md`, migration `supabase/migrations/20260720000001_federations_reconcile.sql`.
