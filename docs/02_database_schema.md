# Database Schema — Namibia Sports Platform

**Source:** `drizzle/schema.ts` | **Provider:** Supabase PostgreSQL | **Region:** EU West (Ireland)
**Table prefix:** `sportsplatform_`

## Enums

| Enum | Values |
|------|--------|
| user_role | user, admin, federation_admin, club_manager |
| federation_category | ministry, commission, umbrella, federation |
| gender | male, female, other |
| event_type | competition, tournament, training, workshop, meeting, other |
| media_type | image, video, document |
| entity_type | federation, club, event, athlete, venue, coach |
| program_type | talent_identification, training, development, elite |
| platform_type | youtube, facebook, twitch, other |

## Tables

### sportsplatform_users
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| open_id | varchar(64) | NOT NULL UNIQUE |
| name | text | |
| email | varchar(320) | |
| login_method | varchar(64) | |
| role | user_role | DEFAULT 'user' |
| federation_id | integer | FK → federations |
| club_id | integer | FK → clubs |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| last_signed_in | timestamp | DEFAULT now() |

### sportsplatform_federations
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| name | text | NOT NULL |
| abbreviation | varchar(50) | |
| type | federation_category | DEFAULT 'federation' |
| description | text | |
| president | text | |
| secretaryGeneral | text | |
| email | varchar(320) | |
| phone | varchar(50) | |
| website | text | |
| facebook, instagram, twitter, youtube | text | |
| logo | text | |
| backgroundImage | text | |
| slug | varchar(255) | UNIQUE |
| primary_color | varchar(50) | |
| secondary_color | varchar(50) | |
| is_active | boolean | NOT NULL DEFAULT true |
| merged_into_slug | varchar(255) | NULL — canonical slug when soft-merged |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**Live inventory (2026-07-20):** 85 rows total, **83 active** (2 soft-merged inactive: `namibia-aquatics` → `swimming-namibia`, `weightlifting-namibia` → `powerlifting-namibia`). Public `federations.list` / search filter `is_active=true`; `getBySlug` resolves merged slugs to canonical. Admin uses `federations.listAll`. Gap tracking: `docs/research/federation_data_gap_list.md`. Completeness: `docs/research/federation_completeness_snapshot.md`.

**Relations:** has many clubs, events, athletes, coaches, newsArticles, liveStreams, highPerformancePrograms, whatsappSubscriptions

### sportsplatform_clubs
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| federation_id | integer | NOT NULL, FK → federations |
| name | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL UNIQUE |
| description | text | |
| logo_url | text | |
| contact_email | varchar(320) | |
| contact_phone | varchar(50) | |
| website | text | |
| address | text | |
| region | varchar(100) | |
| city | varchar(100) | |
| president_name | varchar(255) | |
| coach_name | varchar(255) | |
| established_year | integer | |
| member_count | integer | |
| is_active | boolean | DEFAULT true |

### sportsplatform_athletes
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| federation_id | integer | FK |
| club_id | integer | FK → clubs |
| first_name | varchar(255) | NOT NULL |
| last_name | varchar(255) | NOT NULL |
| slug | varchar(255) | UNIQUE (firstname-lastname-id) |
| slug | varchar(255) | UNIQUE (firstname-lastname-id) |
| slug | varchar(255) | UNIQUE (e.g. christine-mboma-1) |
| date_of_birth | timestamp | |
| gender | gender | |
| photo_url | text | |
| email | varchar(320) | |
| phone | varchar(50) | |
| achievements | text | |
| current_ranking | integer | |
| is_active | boolean | DEFAULT true |

### sportsplatform_coaches
Similar structure with certifications, specialization, years_experience.

### sportsplatform_events
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| federation_id | integer | FK |
| venue_id | integer | FK → venues |
| name | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL UNIQUE |
| type | event_type | DEFAULT 'competition' |
| start_date | timestamp | NOT NULL |
| end_date | timestamp | |
| registration_deadline | timestamp | |
| location | varchar(255) | |
| region | varchar(100) | |
| poster_url | text | |
| max_participants | integer | |
| current_participants | integer | DEFAULT 0 |
| is_published | boolean | DEFAULT false |

Live enrichment (2026-07-20 Pass 2): **160** rows (158 published, 99 posters); sources in `description`. See `docs/research/events_enrichment_batch.md`.

### sportsplatform_venues
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| name | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL UNIQUE |
| address | text | |
| city | varchar(100) | |
| region | varchar(100) | |
| capacity | integer | |
| facilities | text[] | |
| is_active | boolean | DEFAULT true |

### sportsplatform_news_articles
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| federation_id | integer | FK |
| author_id | integer | FK → users |
| title | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL UNIQUE |
| content | text | |
| summary | text | |
| category | varchar(100) | |
| tags | text[] | |
| featured_image | text | |
| is_published | boolean | DEFAULT false |
| published_at | timestamp | |

### sportsplatform_live_streams
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| federation_id | integer | FK |
| title | varchar(255) | NOT NULL |
| platform_type | platform_type | DEFAULT 'youtube' |
| stream_url | text | |
| embed_url | text | |
| thumbnail_url | text | |
| scheduled_start | timestamp | |
| scheduled_end | timestamp | |
| is_live | boolean | DEFAULT false |
| viewer_count | integer | |

**Live inventory (2026-07-20):** **4** rows (completed YouTube VODs; NFA/NRU/Cricket/NASFED) via `20260720000032`. Primary nav shows Live only when `is_live` or upcoming `scheduled_start` exists (`useShowLiveNav`).

### sportsplatform_whatsapp_subscriptions
| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| phone | varchar(50) | NOT NULL |
| user_id | integer | FK |
| federation_id | integer | FK |
| subscription_types | text[] | |
| is_active | boolean | DEFAULT true |

### sportsplatform_schools, sportsplatform_media, sportsplatform_hp_programs
See `drizzle/schema.ts` and `drizzle/relations.ts` for full definitions.

`sportsplatform_media` (beta seed `20260720000044` + pass 2 `20260720000054`): polymorphic `(entity_type, entity_id)`; **61** local image rows across flagship + netball/hockey/basketball/boxing/volleyball/tennis/aquatics/judo/handball/beach volleyball federations, plus venue/athlete galleries (`/sports/*`, `/logos/*`, `/venues/*`, `/athletes/*`). No FK to federations.

## Foreign Key Summary
- users.federation_id → federations.id
- users.club_id → clubs.id
- clubs.federation_id → federations.id
- athletes.federation_id, athletes.club_id
- coaches.federation_id, coaches.club_id
- events.federation_id, events.venue_id
- news_articles.federation_id, news_articles.author_id → users.id
- live_streams.federation_id
- whatsapp_subscriptions.user_id, federation_id

## Missing Relationships / Notes
- Ensure ON DELETE behavior is defined for all FKs when generating migrations

## Row Level Security (RLS)

Applied live via `20260720000030_harden_sportsplatform_rls.sql` + `20260720000034_rls_select_and_revoke_writes.sql`.

| Access | Who | Tables |
|--------|-----|--------|
| SELECT public | `anon`, `authenticated` | **published/active/visible only** — news/events (`is_published`); federations/clubs/athletes/coaches/venues/hp (`is_active`); streams (live/URL/schedule); schools/media (no visibility column — still open SELECT) |
| SELECT staff | `admin` / `federation_admin` (scoped) | drafts + inactive rows (`20260720000034` staff SELECT policies) |
| SELECT scoped | own row or `admin` | `sportsplatform_users`, `sportsplatform_whatsapp_subscriptions` |
| WRITE (RLS) | admin / federation_admin / own WhatsApp | same as `20260720000030` — but PostgREST **cannot** write: table GRANTs revoked |
| Table GRANTs | `anon`/`authenticated` | **SELECT only** (`REVOKE` INSERT/UPDATE/DELETE/TRUNCATE in `20260720000034`) |

Helpers (SECURITY DEFINER): `sportsplatform_private.is_admin()`, `is_federation_admin(int)`, `current_user_id()`.

`user_role` enum labels: `user`, `admin`, `federation_admin`, `club_manager` (aligned with Drizzle).

**Auth path:** Client uses Supabase Auth only; mutations go through tRPC + Hyperdrive (privileged role / bypasses RLS). PostgREST anon/authenticated: SELECT published catalog only; no write privileges. `service_role` still bypasses RLS.
