# Features Audit — Namibia Sports Platform

| Feature | Status | Scale Status | Notes |
|---------|--------|--------------|-------|
| **Federation listing** | ✅ | Beta | list, getById, getBySlug, getByAbbreviation |
| **Federation CRUD** | ✅ | Beta | create, update, delete (protected) |
| **Club listing & CRUD** | ✅ | Beta | federationId filter |
| **Event listing & CRUD** | ✅ | Beta | type mapping eventType→type |
| **Athlete listing & CRUD** | ✅ | Beta | |
| **Coach listing & CRUD** | ✅ | Beta | |
| **Venue listing & CRUD** | ✅ | Beta | |
| **News articles** | ✅ | Beta | list (published), getBySlug, create/update/publish (federationAdmin), delete (admin) |
| **Live streams** | ✅ | Beta | list (isLive filter), getById, create/update/setLive |
| **Auth (me, logout)** | ✅ | Beta | Session-based |
| **Supabase Auth integration** | 🚧 | Prototype | JWT verification in tRPC |
| **WhatsApp subscriptions** | ❌ | Deferred | Schema exists, routers pending |
| **AI (generateSummary, suggestTags)** | ❌ | Deferred | SKILLS.md references, not implemented |
| **Federation pages (frontend)** | 🚧 | Incomplete | FederationLayout references missing components |
| **Admin dashboard** | 🚧 | Prototype | May use mock data |
| **Image uploads (Supabase Storage)** | ❌ | Not Started | Per CLAUDE.md |

## CRUD Matrix

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| Federations | ✅ | ✅ | ✅ | ✅ |
| Clubs | ✅ | ✅ | ✅ | ✅ |
| Events | ✅ | ✅ | ✅ | ✅ |
| Athletes | ✅ | ✅ | ✅ | ✅ |
| Coaches | ✅ | ✅ | ✅ | ✅ |
| Venues | ✅ | ✅ | ✅ | ✅ |
| News | ✅ | ✅ | ✅ | ✅ |
| Streams | ✅ | ✅ | ✅ | ✅ (via setLive) |

## TODO/FIXME Search
Run: `grep -r "TODO\|FIXME\|TBD" --include="*.ts" --include="*.tsx" .` to locate.

## Empty States
Verify UI handles empty lists for: federations, clubs, events, athletes, news, streams.
