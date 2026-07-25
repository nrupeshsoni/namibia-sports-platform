# Contacts Pass 4 — Active federations with no email and no phone

**Date:** 2026-07-25  
**Project:** `rbibqjgsnrueubrvyqps`  
**Table:** `sportsplatform_federations` only  
**Trigger:** `docs/research/FULL_GAP_ANALYSIS_20260725.md` P0 #4  
**Rule:** Verified sources only. No fabrication. Club ≠ federation.

## Live baseline (Supabase MCP `execute_sql`)

```sql
SELECT id, abbreviation, name, slug, email, phone, website, president, secretary_general
FROM sportsplatform_federations
WHERE is_active = true
  AND (email IS NULL OR TRIM(email) = '')
  AND (phone IS NULL OR TRIM(phone) = '')
ORDER BY abbreviation;
```

| id | Abbr | Name | Slug | Pres / SG already set |
|---:|------|------|------|------------------------|
| 50 | LN | Lacrosse Namibia | `lacrosse-namibia` | — |
| 48 | NBB | Baseball Namibia | `baseball-namibia` | — |
| 45 | NBodF | Bodybuilding Namibia | `bodybuilding-namibia` | Evaristor Gylgrister / — |
| 107 | NFGF | Namibia Footgolf Federation | `namibia-footgolf` | Chalo Chainda / Allan Kake |
| 57 | NK | Namibia Korfball | `namibia-korfball` | — |
| 54 | NO | Namibia Orienteering | `namibia-orienteering` | — |
| 51 | NPet | Petanque Namibia | `petanque-namibia` | — |
| 109 | NPTF | Namibia Padel Tennis Federation | `namibia-padel-tennis` | Thomas Nangombe / Lilly Mwiya |
| 47 | NSB | Softball Namibia | `softball-namibia` | — |
| 108 | NWMGF | Namibia Western Mounted Games Federation | `namibia-western-mounted-games` | — |

## Result

| Metric | Count |
|--------|------:|
| Cohort size | **10** |
| **Filled** (email and/or phone applied) | **0** |
| **Still unknown** (null email AND null phone) | **10** |
| SQL `UPDATE`s this pass | **0** |

## Research summary

Re-checked New Era / Namibian Sun / Republikein / The Namibian / Villager, NNOC affiliated-members list, FIFG, FIP, WFF.lt, WBSC Africa, IKF, IOF/FIPJP/World Lacrosse membership cues, Footgolf Namibia Facebook About, namibiapadel.com legal notice, Alexforbes padel sponsorship posts, and prior Pass 1–3 notes in `contacts_enrichment_batch.md`.

Cloudflare `data-cfemail` values decoded from New Era / Sun HTML resolve only to **journalist** addresses (`hnalupe@nepc.com.na`, `hilmanalupe@gmail.com`, `otis@nsh.com.na`) — not federation contacts. Search-engine suggestions (`footgolfnamibia@gmail.com`, `fgna2025@gmail.com`) do not appear in source article HTML. Padel club phones/emails remain commercial Namibia Padel / Namspire, not NPF.

## Unblock

Needs human: NSC contact PDF for new codes, or federation officers to publish a federation-labelled email/phone.

Full reject table: `docs/research/contacts_enrichment_batch.md` § Pass 4.
