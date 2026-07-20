# Crest Brand Colors Batch — migration `20260720000060`

**Agent:** COLORS/META  
**Applied:** 2026-07-21 → `rbibqjgsnrueubrvyqps`  
**Method:** Visual review of `client/public/logos/*` crests + saturated-pixel sampling (near-white / near-black skipped). Hex stored as `#RRGGBB` uppercase.

## Fill rate (active federations)

| Metric | Before | After |
|--------|-------:|------:|
| `primary_color` + `secondary_color` | 15/83 (18%) | **47/83 (57%)** |
| Logo present, colors still null | 36 | **4** |

## Skipped (logo path exists, not a crest palette)

| slug | Why left null |
|------|----------------|
| `athletics-namibia` | `athletics-logo.png` is an HTML stub (`<!doctype…`), not an image |
| `namibia-climbing` | Landscape photo (Spitzkoppe), not a crest |
| `namibia-mountaineering` | Shares climbing landscape file |
| `nawisa` | Promo collage artwork, not a federation crest |

## Safe meta polish

| slug | Change |
|------|--------|
| `angling-namibia` | `abbreviation` **NFAA → NFFAA** (matches crest `N.F.F.A.A.`) |

## New pairs (32 active rows; shared crests reuse hex)

| slug | primary | secondary | Crest cue |
|------|---------|-----------|-----------|
| angling-namibia | #17539A | #B0B0B4 | Hex blue + silver |
| archery-namibia | #3B529F | #D82328 | Flag map blue + red |
| chess-namibia | #1975B8 | #FFFFFF | Blue field + white |
| equestrian-namibia | #28235D | #FFFFFF | Navy shield + white |
| fencing-namibia | #1022AB | #DA0202 | Map blue + red |
| ice-stock-namibia | #D9DC32 | #456DA9 | Sun yellow + handle blue |
| judo-namibia | #F00101 | #000000 | Red marks + black text |
| motorsport-namibia | #CD0E31 | #0B9046 | Helmet red + wreath green |
| namibia-basketball | #214A8A | #CAC23F | Swoosh blue + gold ball |
| namibia-volleyball | #D7242D | #A7A9AC | NVF red + silver |
| namibia-beach-volleyball | #D7242D | #A7A9AC | Shares NVF |
| namibia-boxing | #032D8C | #CF0621 | NABF blue + red |
| namibia-canoeing | #21397F | #B51A39 | NCRF flag map |
| rowing-namibia | #21397F | #B51A39 | Shares NCRF |
| namibia-darts | #013179 | #D21034 | Flag map blue + red |
| namibia-esports | #224092 | #CE3728 | NESA flag blue + red |
| namibia-martial-arts | #020C92 | #E70909 | Ring blue + red brush |
| namibia-full-contact-martial-arts | #020C92 | #E70909 | Shares MAN crest |
| namibia-futsal | #FFD700 | #000000 | Shares NFA |
| namibia-handball | #0149AC | #FF1818 | Banner blue + arc red |
| namibia-ice-inline-hockey | #30478D | #EE1A24 | Map blue + red ribbon |
| roller-sports-namibia | #30478D | #EE1A24 | Shares NIIHA |
| skateboarding-namibia | #30478D | #EE1A24 | Shares NIIHA |
| namibia-jukskei | #057899 | #E40203 | Teal ribbon + red text |
| namibia-kickboxing | #253C7C | #D62037 | Fist flag blue + red |
| nlas | #FE6200 | #003580 | Orange athlete + blue |
| namibia-padel-tennis | #D6223A | #243B78 | Racket red + navy |
| sailing-namibia | #9EDBEC | #EBAB41 | Sky blue + gold wreath |
| shooting-namibia | #FE9C00 | #681012 | Orange + maroon |
| table-tennis-namibia | #0119BC | #BE0713 | Blue + red paddles |
| tennis-namibia | #C3D550 | #000000 | Optic yellow + black |
| wrestling-namibia | #912A34 | #2E208D | Red + blue singlets |

Prior 15 pairs from `20260720000013` unchanged (NFA, NRU, Cricket, NASFED, Netball, NHU, NNOC, NPC, Cycling, Triathlon, Gymnastics, Squash, NSC, Ministry, Bowls).
