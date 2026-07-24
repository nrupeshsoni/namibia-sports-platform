# SKILLS.md — Developer Reference for Namibia Sports Platform

Quick reference for tRPC procedures, schema, components, and patterns. Use this when working with Claude Code agents to avoid redundant exploration.

---

## tRPC Procedures (Current)

All accessed via `trpc.<router>.<procedure>` on the client.  
Routers live in `server/routers/` and are composed in `server/routers/index.ts`.

Federation-scoped mutations must call `assertSameFederation(ctx.user, …)` inside the procedure (middleware checks role only).

### `system` / `auth` / `users`
```typescript
system.health()                                // public
auth.me()                                      // public (null if anonymous)
auth.logout()                                  // public
users.list()                                   // adminProcedure
users.setRole({ userId, role, federationId? }) // adminProcedure
```

### `federations`
```typescript
federations.list({ search?, type?, limit? })
federations.listAll()                          // adminProcedure
federations.getById({ id })
federations.getBySlug({ slug })
federations.getByAbbreviation({ abbreviation })
federations.create(data)                       // adminProcedure
federations.update({ id, ...data })            // adminProcedure
federations.delete({ id })                     // adminProcedure
```

### `clubs` / `events` / `athletes` / `coaches`
```typescript
clubs.list({ federationId?, search?, region?, limit? })
clubs.getById({ id })
clubs.create / update / delete                 // federationAdminProcedure + assertSameFederation

events.list({ federationId?, upcoming?, type?, limit?, includeUnpublished? })
events.getById({ id })                         // drafts hidden unless admin / same-fed admin
events.create / update / delete                // federationAdminProcedure + assertSameFederation

athletes.list({ federationId?, clubId?, search?, limit?, includePii? })
athletes.getById({ id }) / getBySlug({ slug }) // public omits email/phone/DOB
athletes.create / update / delete              // federationAdminProcedure + assertSameFederation

coaches.list / getById / create / update / delete  // same pattern as athletes
```

### `venues` / `schools` / `media` / `hpPrograms`
```typescript
venues.list({ region?, limit?, includeInactive? })  // public = active-only
venues.getById / create / update / delete           // mutate = adminProcedure
schools.list / getById / create / update / delete   // mutate = adminProcedure
media.list / getById / create / delete              // mutate = federationAdminProcedure
hpPrograms.list / getById / create / update / delete
```

### `news` / `streams`
```typescript
news.list({ federationId?, category?, limit?, includeUnpublished? })
news.getBySlug({ slug })
news.create / update / publish / delete        // federationAdminProcedure + assertSameFederation

streams.list({ federationId?, isLive?, limit? })
streams.create / update / setLive / delete     // federationAdminProcedure + assertSameFederation
```

### `upload` / `search` / `ai` / `whatsapp`
```typescript
upload.image({ federationId, entity, entityId, base64, contentType? })
  // federationAdminProcedure + assertSameFederation; rate-limited

search.global({ query })                       // public; rate-limited

ai.generateSummary / suggestTags / chatAssistant
contentSync.status / suggestNews / suggestEvents / createNewsDraft / createEventDraft (admin; drafts only)
  // protectedProcedure; UI gated by VITE_SHOW_AI_CHAT; chat capped + rate-limited

whatsapp.subscribe / unsubscribe / getSubscriptions
  // API hard-disabled (WHATSAPP_API_ENABLED=false) for go-live
```

---

## Database Schema Reference

File: `drizzle/schema.ts` — **all app tables use prefix `sportsplatform_`**.

### Core tables (prefix `sportsplatform_`)

| Table | Purpose |
|-------|---------|
| `sportsplatform_federations` | Ministry + Commission + umbrellas + federations |
| `sportsplatform_clubs` | Clubs/teams |
| `sportsplatform_events` | Competitions / workshops |
| `sportsplatform_athletes` / `_coaches` | People profiles |
| `sportsplatform_venues` / `_schools` | Facilities / schools |
| `sportsplatform_news_articles` | Published news |
| `sportsplatform_live_streams` | Live + VOD registry |
| `sportsplatform_media` / `_hp_programs` | Media library / HP |
| `sportsplatform_whatsapp_subscriptions` | Opt-in rows (API off) |

**`users`** (no prefix) — platform users with RBAC (`role`, `federationId`, `clubId`).

Relations: `drizzle/relations.ts`. Migrations: `drizzle/` + `supabase/migrations/`.
---

## Component Library

### From shadcn/ui (all available in `@/components/ui/`)

```
Button, Input, Label, Textarea, Select, Checkbox, RadioGroup, Switch
Dialog, AlertDialog, Sheet, Popover, HoverCard, Tooltip
Card, Badge, Avatar, Separator, ScrollArea
Tabs, Accordion, Collapsible
Table, Form (react-hook-form integration)
Command (cmdk — use for global search palette)
Calendar, DatePicker (react-day-picker)
Chart (recharts wrapper)
Toast (sonner)
Progress, Slider
NavigationMenu, Menubar, DropdownMenu, ContextMenu
```

### Glassmorphism Card Pattern

```tsx
// Standard glass card
<div style={{
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
}}>

// Lighter glass (on dark hero sections)
<div style={{
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
}}>
```

### Framer Motion — Standard Variants

```typescript
// In client/src/lib/animations.ts (create if not exists)
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

// Usage
<motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
```

### Live Indicator Badge

```tsx
<span className="inline-flex items-center gap-1.5">
  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
  <span className="text-red-400 text-xs font-bold uppercase tracking-wider">LIVE</span>
</span>
```

---

## Routing Map (wouter)

```
/                           → Home.tsx (main portal)
/federation/:slug           → FederationLayout > FederationHome
/federation/:slug/events|clubs|athletes|news|streams
/federation/:slug/admin/*   → FedAdmin* (role-gated)
/events                     → Events.tsx
/news                       → News.tsx (+ article modal / slug SEO)
/live                       → Live.tsx (VOD / Recent Coverage when not live)
/map                        → Map.tsx
/athletes/:slug             → AthleteProfile
/privacy /terms             → legal pages
/login /register            → auth/*
/admin                      → platform Admin (role === admin)
```

SEO: global `<SeoHead />` in `App.tsx` sets title/OG/JSON-LD for hubs, federation tabs, news, athletes.

---

## Auth Patterns

### Client-side auth check
```typescript
import { useAuth } from '@/contexts/AuthContext'

const { user, isLoading, isFederationAdmin, isAdmin } = useAuth()

// Federation admin guard
if (!isFederationAdmin(federationId)) redirect('/login')
```

### Server-side tRPC procedure guard
```typescript
// federationAdminProcedure checks ROLE only — always assert tenant inside:
federationAdminProcedure
  .input(z.object({ federationId: z.number(), /* ... */ }))
  .mutation(async ({ ctx, input }) => {
    assertSameFederation(ctx.user, input.federationId);
    // ... write
  })
```

---

## AI Integration

### Claude API (server-side only)
```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }]
})
```

### Streaming responses (for chat widget)
```typescript
const stream = client.messages.stream({ model: 'claude-sonnet-4-6', ... })
for await (const chunk of stream) { /* send to client */ }
```

---

## WhatsApp Message Templates

```typescript
// Event reminder (24h before)
`🏆 REMINDER: ${eventName}\n📅 ${date}\n📍 ${venue}\n\nGood luck to all athletes! 🇳🇦`

// Live stream starting
`🔴 LIVE NOW: ${federationName}\n▶️ Watch: ${streamUrl}\n\nReply STOP to unsubscribe`

// News digest (weekly)
`🗞️ Namibia Sports Weekly\n\n${topStories.map(s => `• ${s}`).join('\n')}\n\nMore at sports.com.na`
```

---

## Supabase Storage Buckets

| Bucket | Path Pattern | Usage |
|--------|-------------|-------|
| `federation-logos` | `/{federationId}/logo.png` | Federation logos |
| `federation-images` | `/{federationId}/hero.jpg` | Hero backgrounds |
| `athlete-photos` | `/{athleteId}/profile.jpg` | Athlete profile photos |
| `event-posters` | `/{eventId}/poster.jpg` | Event promotional images |
| `news-images` | `/{articleId}/featured.jpg` | News featured images |

---

## Common Namibian Data

### 14 Regions
Erongo, Hardap, //Karas, Kavango East, Kavango West, Khomas, Kunene,
Ohangwena, Omaheke, Omusati, Oshana, Oshikoto, Otjozondjupa, Zambezi

### Federation Type Counts
- 1 Ministry (Ministry of Sport)
- 1 Commission (Namibia Sports Commission)
- 8 Umbrella Bodies (NSC affiliates)
- 57 Sport-specific Federations

### Key Federation Slugs (examples)
- `nfa` — Namibia Football Association
- `nru` — Namibia Rugby Union
- `nca` — Namibia Cricket Association
- `nhu` — Namibia Hockey Union
- `naf` — Namibia Athletics Federation
- `nn` — Netball Namibia

---

## Known Issues / Technical Debt

1. **Credential rotation + Hyperdrive least-privilege** — `sportsplatform_app` role exists; human must set password, point Hyperdrive, rotate compromised `postgres` / `service_role` (`docs/research/SECURITY_CREDENTIAL_ROTATION.md`)
2. **Crest / hollow long-tail** — logos ~64% active; hollow core-5 still above full-public gate
3. **Live inventory thin** — nav gated; `/live` honest VOD empty states
4. **WhatsApp / AI / Google flags off** by default for go-live honesty
5. **Home.tsx** still has a static `federations.ts` fallback path if tRPC fails
6. **Page-level error boundaries + submit loading locks** still open (P1 UX)
