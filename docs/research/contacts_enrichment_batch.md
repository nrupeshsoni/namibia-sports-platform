# Contacts Enrichment Batch — 2026-07-20 (Agent CONTACTS)

**Scope:** Email / phone / president / secretary_general only. Logos out of scope.  
**Rule:** Never fabricate. Unverified fields left null.

## Priority targets researched

| Federation | Slug | Email | Phone | President | SG | Verdict |
|------------|------|-------|-------|-----------|-----|---------|
| Footgolf Namibia | `namibia-footgolf` | — | — | **Chalo Chainda** | **Allan Kake** | Leadership applied |
| Western Mounted Games | `namibia-western-mounted-games` | — | — | — | — | No verified contacts |
| Padel Namibia | `namibia-padel-tennis` | — | — | Thomas Nangombe *(existing)* | Lilly Mwiya *(existing)* | Email/phone still unverified |
| Handball Namibia | `namibia-handball` | **namibiahandballassociation@gmail.com** | **+264 81 280 1709** | — | — | CAHB contacts applied; leadership conflict |
| Bodybuilding Namibia | `bodybuilding-namibia` | — | — | **Evaristor Gylgrister** (WFF) | — | Leadership applied; no public email/phone |
| Softball Namibia | `softball-namibia` | — | — | — | — | No verified contacts |
| Baseball Namibia | `baseball-namibia` | — | — | — | — | No verified contacts |
| Lacrosse Namibia | `lacrosse-namibia` | — | — | — | — | No active federation evidence |
| Petanque Namibia | `petanque-namibia` | — | — | — | — | No clubs/contacts found |
| Korfball Namibia | `namibia-korfball` | — | — | — | — | No verified contacts |
| Orienteering Namibia | `namibia-orienteering` | — | — | — | — | No verified contacts |
| Surfing Namibia | `surfing-namibia` | — | — | — | — | Historical mentions only; no current contacts |

---

## Applied updates (verified)

### 1. Footgolf Namibia — leadership

| Field | Value | Source |
|-------|-------|--------|
| president | Chalo Chainda | [New Era — Footgolf: New sport on the block](https://neweralive.na/footgolf-new-sport-on-the-block/) |
| secretary_general | Allan Kake | [New Era — FootGolf Namibia coastal Open Day](https://neweralive.na/footgolf-namibia-to-host-coastal-open-day/) |
| description (enrich) | Note NSC recognition + FIFG / African FootGolf Association affiliation | Same New Era articles |

**Cross-check:** The Villager (9 Jul 2025) names launch committee: Chalo Chainda (president/chair), Bermiro Jackobs Isack, Lavinia Uutoni, Maria Dazapo, Enchious Nangolo, Allan Kake.  
https://fliphtml5.com/szlwy/jhyw/The_Villager_9_July_2025/

**Not applied:** No federation email or phone published. Search-engine suggestions (`fgna2025@gmail.com`, `footgolfnamibia@gmail.com`) were **not** present in source articles — discarded.

### 2. Handball Namibia — email + phone

| Field | Value | Source |
|-------|-------|--------|
| email | namibiahandballassociation@gmail.com | [CAHB Zone 6 federations](https://www.cahbonline.info/feds/?zn=6) |
| phone | +264 81 280 1709 | Same CAHB directory |

**Leadership not applied (conflict):**
- IHF member page lists president **Sokaria Shakumu**, phone +264 61 24 82 10, no SG — https://www.ihf.info/member-federations/namibia-handball-federation/5571
- LinkedIn self-claim: **Issy Nakamwe** as president (from Feb 2021)
- Left `president` / `secretary_general` null until NSC or a single authoritative source reconciles names.

Facebook already set: `https://www.facebook.com/profile.php?id=100066592937124`

### 3. Bodybuilding Namibia — WFF president

| Field | Value | Source |
|-------|-------|--------|
| president | Evaristor Gylgrister | [New Era — Namibian bodybuilders claim gold, silver](https://neweralive.na/namibian-bodybuilders-claim-gold-silver/) |
| description (enrich) | Clarify WFF Namibia affiliation | Same + AZ/Republikein coverage |

**Not applied:** No public federation email/phone. NFBB / Alethea Borman mentions exist in older/parallel coverage but no verified NFBB email/phone; do not overwrite WFF president with unverified NFBB data.

---

## Explicitly not applied (unverified or wrong entity)

| Claim | Why rejected |
|-------|----------------|
| `padel@atlantis.com.na` | Not found in New Era launch article (email obfuscated as `[email protected]` journalist byline only) |
| Namibia Padel club phones (081 444 2827 / 081 716 9915) | Club/venue (namibiapadel.com), not federation |
| NAMEF secretary@namef.org.na for Western Mounted Games | Different federation (Olympic/endurance equestrian) |
| SAWMGA South Africa contacts | Wrong country |
| `namsportshooting@gmail.com` / NNSU phone for Allan Kake as Footgolf contact | Different NSC roles; not published as Footgolf federation contact |
| WBSC Africa `baseball@wbscafrica.org` | Continental body, not Namibia federation |
| Lacrosse World Lacrosse / AAL contacts | Namibia not a member; no federation found |

---

## Counts

| Metric | Count |
|--------|------:|
| Federations with new verified fields this batch | **3** (Footgolf leadership, Handball email/phone, Bodybuilding president) |
| Email addresses newly applied | **1** |
| Phone numbers newly applied | **1** |
| Leadership names newly applied | **3** (2 Footgolf + 1 Bodybuilding) |
| Still null email **and** null phone (of 12 gap rows) | **11** (Handball now has both) |

---

## Still missing (null email AND null phone after this batch)

1. Baseball Namibia  
2. Bodybuilding Namibia *(president set; no email/phone)*  
3. Lacrosse Namibia  
4. Namibia Footgolf Federation *(leadership set; no email/phone)*  
5. Namibia Korfball  
6. Namibia Orienteering  
7. Namibia Padel Tennis Federation *(leadership already set; no email/phone)*  
8. Namibia Western Mounted Games Federation  
9. Petanque Namibia  
10. Softball Namibia  
11. Surfing Namibia  

**Next research avenues:** Updated NSC contact PDF (post–Feb 2025) that includes Footgolf / WMG / Padel; FIP padel member directory; IFBB/WFF continental directories; Facebook page About sections if publicly readable.

---

## Pass 2 — deeper research (2026-07-20 evening)

**Targets:** 11 rows still null email AND null phone.  
**Scope:** contacts/leadership/description only — no logo/website/facebook mutations.

### Applied this pass

#### Surfing Namibia (`surfing-namibia`)

| Field | Value | Source |
|-------|-------|--------|
| email | `rainer.eimbeck@gmail.com` | [ISA Member Directory](https://isasurf.org/become-a-member/member-directory/) — Namibia Surfing Association |
| phone | `+264 64 403 905` | Same ISA listing (`(064) 40 3905`) |
| secretary_general | Rainer Eimbeck | ISA Primary Contact; AZ notes he administers Namibischer Surfverein ([Surfer ausgezeichnet](https://www.az.com.na/nachrichten/surfer-ausgezeichnet)) |
| description | ISA member since 1997; P.O. Box 656 Swakopmund | ISA directory |

Migration: `20260720000011_federations_contacts_enrichment_pass2.sql`

### Researched — no verified email/phone (leave null)

| Federation | Findings | Why not applied |
|------------|----------|-----------------|
| Footgolf | Leadership already set. FIFG countries page has membership criteria only, no Namibia contact list. New Era / Villager / Eventibus have no federation email or phone. | Search-suggested `footgolfnamibia@gmail.com` / `fgna2025@gmail.com` **not** in source articles |
| Bodybuilding | President Gylgrister already set (New Era). WFF.lt HQ is `info@wff.lt` (Lithuania). WFF forum lists 2017 president Johandre Worsie Rabe (stale vs 2025 Gylgrister). | No Namibia-specific email/phone; NBC footer numbers are broadcaster contacts not NFBB |
| Padel | Leadership already set. `info@namibiapadel.com` / `+264 81 858 1077` are **Namibia Padel club** (Francois Wahl / Namspire legal notice), not NPF | Club ≠ federation contact per rule |
| Western Mounted Games | Gobabis event listing only; SAWMGA contacts are South Africa; no Namibia chapter email/phone | Wrong country / no Namibia federation contact |
| Softball | The Namibian (2010) names president Mervin Beukes | 16-year-old leadership; no email/phone; not applied as current |
| Baseball | Founding ABSA member historically; **not** on current WBSC Africa member list | No national email/phone |
| Lacrosse | Not World Lacrosse / AAL member | No federation evidence |
| Petanque | Not on FIPJP Africa affiliated list; petanque-world shows zero clubs | No contacts |
| Korfball | Not on IKF Africa members list | No contacts |
| Orienteering | Not IOF/Comofed member; no active NF | No contacts |

### Pass 2 rejects (explicit)

| Claim | Why rejected |
|-------|----------------|
| `info@namibiapadel.com` / club phones | Club legal notice (Namibia Padel / Francois Wahl), not federation |
| `clyde@sportturfnamibia.com` / similar | Not present in New Era or verified federation sources (search hallucination) |
| `namprim@iafrica.com.na` / `+264 64 404951` | Unreliable aggregator (soopage “Greece” listing); prefer ISA |
| Element Riders tourism listing alone | Business listing; ISA already provides federation-labelled email/phone |
| Soft/baseball continental emails | Wrong entity |
| SAWMGA / NAMEF for WMG | Wrong federation/country |

### Pass 2 counts

| Metric | Count |
|--------|------:|
| Federations newly filled (email+phone) | **1** (Surfing) |
| Emails newly applied | **1** |
| Phones newly applied | **1** |
| Leadership newly applied | **1** (SG Rainer Eimbeck) |
| Still null email **and** null phone | **10** |

### Still fully missing email+phone after Pass 2

1. Baseball Namibia  
2. Bodybuilding Namibia *(president only)*  
3. Lacrosse Namibia  
4. Namibia Footgolf Federation *(leadership only)*  
5. Namibia Korfball  
6. Namibia Orienteering  
7. Namibia Padel Tennis Federation *(leadership only)*  
8. Namibia Western Mounted Games Federation  
9. Petanque Namibia  
10. Softball Namibia  

**Blocked without:** post–Feb 2025 NSC contact PDF including new codes; FIP national member contact sheet; federation Facebook About pages with published email/phone.
