# SKILLS.md — Developer Reference for Namibia Sports Platform

Quick reference for tRPC procedures, schema, components, and patterns. Use this when working with Claude Code agents to avoid redundant exploration.

---

## tRPC Procedures (Current)

All accessed via `trpc.<router>.<procedure>` on the client.

### `federations`
```typescript
federations.list({ search?: string, type?: "federation"|"umbrella"|"ministry"|"commission" })
federations.getById({ id: number })
federations.getBySlug({ slug: string })         // ADD: needed for federation pages
federations.create(data)                        // adminProcedure
federations.update({ id, ...data })             // adminProcedure | federationAdminProcedure
federations.delete({ id })                      // adminProcedure
```

### `clubs`
```typescript
clubs.list({ federationId?: number, search?: string, region?: string })
clubs.getById({ id: number })
clubs.create(data)                             // federationAdminProcedure
clubs.update({ id, ...data })                  // federationAdminProcedure
clubs.delete({ id })                           // federationAdminProcedure
```

### `events`
```typescript
events.list({ federationId?: number, upcoming?: boolean, type?: string })
events.getById({ id: number })
events.create(data)                            // federationAdminProcedure
events.update({ id, ...data })                 // federationAdminProcedure
events.delete({ id })                          // federationAdminProcedure
```

### `athletes`
```typescript
athletes.list({ federationId?: number, clubId?: number, search?: string })
athletes.getById({ id: number })
athletes.create(data)                          // federationAdminProcedure
athletes.update({ id, ...data })               // federationAdminProcedure
```

### `news` (TO BE ADDED)
```typescript
news.list({ federationId?: number, category?: string, limit?: number })
news.getBySlug({ slug: string })
news.create(data)                              // federationAdminProcedure
news.update({ id, ...data })                   // federationAdminProcedure
news.publish({ id })                           // federationAdminProcedure
```

### `streams` (TO BE ADDED)
```typescript
streams.list({ federationId?: number, isLive?: boolean })
streams.create(data)                           // federationAdminProcedure
streams.setLive({ id, isLive: boolean })       // federationAdminProcedure
```

### `ai` (TO BE ADDED)
```typescript
ai.generateSummary({ text: string })           // protectedProcedure
ai.suggestTags({ content: string })            // protectedProcedure
ai.chatAssistant({ message: string, history: Message[] }) // publicProcedure
```

### `whatsapp` (TO BE ADDED)
```typescript
whatsapp.subscribe({ phone: string, federationId?: number, types: string[] })
whatsapp.unsubscribe({ phone: string })
```

---

## Database Schema Reference

File: `drizzle/schema.ts`

### Key Tables

**`namibia_na_26_federations`**
```typescript
{ id, name, abbreviation, type, description, president, secretaryGeneral,
  email, phone, website, facebook, instagram, twitter, youtube,
  logo, backgroundImage, slug (ADD), primaryColor (ADD), createdAt, updatedAt }
```

**`namibia_na_26_clubs`**
```typescript
{ id, name, slug, description, logoUrl, federationId,
  contactEmail, contactPhone, website, address, region, city,
  presidentName, coachName, establishedYear, memberCount, isActive, createdAt, updatedAt }
```

**`namibia_na_26_events`**
```typescript
{ id, name, slug, description, eventType, federationId, venueId,
  startDate, endDate, location, registrationDeadline, registrationUrl,
  isActive, createdAt, updatedAt }
```

**`users`** (no prefix)
```typescript
{ id, openId, name, email, loginMethod, role, federationId, clubId,
  createdAt, updatedAt, lastSignedIn }
```

### Tables to Add (Phase 2)
- `namibia_na_26_news_articles` — federation/platform news
- `namibia_na_26_live_streams` — YouTube/FB/Twitch stream registry
- `namibia_na_26_whatsapp_subscriptions` — notification subscribers
- `namibia_na_26_results` — competition results
- `namibia_na_26_sponsors` — sponsorship entities
- `namibia_na_26_federation_pages` — CMS content blocks per federation

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
/federation/:slug/events    → FederationLayout > FederationEvents
/federation/:slug/clubs     → FederationLayout > FederationClubs
/federation/:slug/athletes  → FederationLayout > FederationAthletes
/federation/:slug/news      → FederationLayout > FederationNews
/federation/:slug/streams   → FederationLayout > FederationStreams
/federation/:slug/admin     → FederationLayout > FederationAdmin (protected)
/events                     → Events.tsx (aggregated)
/news                       → News.tsx (aggregated)
/news/:slug                 → NewsArticle.tsx
/live                       → Live.tsx (all active streams)
/athletes                   → Athletes.tsx (aggregated)
/venues                     → Venues.tsx
/login                      → auth/Login.tsx
/register                   → auth/Register.tsx
/admin                      → Admin.tsx (super admin, protected)
/404                        → NotFound.tsx
```

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
// Federation admin mutation
federationAdminProcedure
  .input(z.object({ federationId: z.number(), ...data }))
  .mutation(async ({ ctx, input }) => {
    // ctx.user.federationId is already verified to match input.federationId
    // by the federationAdminProcedure middleware
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

1. **No `slug` field on federations table** — Must add before building federation pages
2. **`drizzle/relations.ts` is empty** — Relations not defined, limiting join queries
3. **Admin page uses mock data** — Not connected to real tRPC endpoints
4. **Auth is localStorage-based** — Not Supabase Auth; needs migration
5. **Dual data path on Home.tsx** — Direct Supabase SDK + tRPC both used; should standardize to tRPC only
6. **`server/routers.ts` is a single large file (500+ lines)** — Should be split into `server/routers/` directory
