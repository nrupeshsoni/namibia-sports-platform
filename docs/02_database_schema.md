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
| createdAt | timestamp | |
| updatedAt | timestamp | |

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
- RLS policies must be added in Supabase for multi-tenant isolation
