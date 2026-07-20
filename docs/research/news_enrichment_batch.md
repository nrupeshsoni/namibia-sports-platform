# News Enrichment Batch — 2026-07-20

**Agent:** NEWS  
**Project:** `rbibqjgsnrueubrvyqps`  
**Migration:** `20260720000031_news_enrichment_batch.sql` (applied remotely as `news_enrichment_batch`)  
**DB mutated:** Yes

## Baseline → after

| Metric | Before | After |
|--------|-------:|------:|
| Published news | 23 | **35** |
| With `featured_image` | 0 | **35** |
| Distinct federations (linked) | 8 | **13** |

Beta content gate (≥12 news with images): **met**.

## Method

1. Inspected `sportsplatform_news_articles` schema + `server/routers/news.ts` (`list` filters `is_published`, orders by `published_at`).
2. Researched recent coverage (New Era, The Namibian, NBC, Windhoek Express, Namibia Economist, gsport).
3. Wrote **original short paraphrases** with source URL attribution in `content` (no verbatim full-article copies).
4. Linked rows to real federations by slug; used existing `client/public/sports/*` assets as `featured_image`.
5. Backfilled `featured_image` on all prior rows so Home/News cards are not blank.

## New articles (12)

| # | Slug | Federation | Image | Primary source |
|--:|------|------------|-------|----------------|
| 1 | `african-stars-fourth-npfl-title-2026` | NFA | `/sports/football-action.jpg` | [New Era](https://neweralive.na/starlile-makes-it-4-in-a-row-young-brazilians-return-to-the-premier-league/) |
| 2 | `unam-fc-nfa-cup-champs-2026` | NFA | `/sports/football.jpg` | [New Era](https://neweralive.na/unam-fc-ndf-mighty-gunners-ladies-crowned-nfa-cup-champs/) |
| 3 | `welwitschias-blue-bulls-thriller-2026` | NRU | `/sports/namibia-rugby-action.jpg` | [WE](https://www.we.com.na/sport-wrap-main/blue-bulls-edge-brave-welwitschias-in-97-point-thriller-NMH013511-11-16669) / [NBC](https://www.nbcnews.na/node/117742) |
| 4 | `eagles-t20-tri-nations-sweep-2026` | Cricket Namibia | `/sports/cricket-action.jpg` | [The Namibian](https://www.namibian.com.na/eagles-sweep-to-series-win/) |
| 5 | `athletics-namibia-glasgow-squad-2026` | Athletics Namibia | `/sports/athletics.jpg` | [New Era](https://neweralive.na/namibia-announces-glasgow-squad/) / [Economist](https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/) |
| 6 | `desert-jewels-squad-zimbabwe-africa-cup-2026` | Netball Namibia | `/sports/netball.jpg` | [New Era](https://neweralive.na/meyer-names-15-player-desert-jewels-squad-for-two-tough-test/) / [The Namibian](https://www.namibian.com.na/namibia-prepares-for-netball-world-cup-qualifier/) |
| 7 | `namibia-women-hockey-sa-series-2026` | NHU | `/sports/hockey.jpg` | [The Namibian](https://www.namibian.com.na/young-namibian-hockey-squad-to-face-sa/) / [gsport](https://gsport.co.za/cape-town-to-stage-south-africas-four-match-hockey-test-series-against-namibia/) |
| 8 | `mischa-araes-commonwealth-boxing-debut-2026` | Boxing (NBCC) | `/sports/boxing.jpg` | [New Era](https://neweralive.na/young-araes-to-make-commonwealth-history/) |
| 9 | `team-namibia-commonwealth-flag-handover-2026` | NNOC | `/sports/swimming.jpg` | [New Era](https://neweralive.na/team-namibia-set-for-commonwealth-games/) |
| 10 | `shikongo-para-athletics-commonwealth-2026` | NPC | `/sports/athletics-alt.jpg` | [New Era](https://neweralive.na/namibia-announces-glasgow-squad/) / [Economist](https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/) |
| 11 | `welwitschias-zambia-71-12-2026` | NRU | `/sports/namibia-rugby.jpg` | [The Namibian](https://www.namibian.com.na/welwitschias-overpower-zambia/) |
| 12 | `namibia-2026-major-sports-calendar` | NSC | `/sports/cricket.jpg` | [The Namibian](https://www.namibian.com.na/major-sporting-events-for-2026/) |

## Sport coverage

Football, rugby, cricket, athletics, netball, hockey, boxing, Olympic (NNOC), Paralympic (NPC), plus NSC calendar overview.

## Notes / constraints

- Results and squad names taken from published reporting; articles are paraphrases, not scrapes.
- Featured images are sport-matched platform assets under `/sports/` (not press photo downloads).
- Idempotent: `ON CONFLICT (slug) DO NOTHING`; image backfill only where null/empty.
- Did not touch RLS or events migrations.
