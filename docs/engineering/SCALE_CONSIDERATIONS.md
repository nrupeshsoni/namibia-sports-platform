# SCALE_CONSIDERATIONS.md — Namibia Sports Platform

> **Template version:** 1.0 | **Stack:** React/Vite + tRPC + Netlify + Supabase
> **Purpose:** Honest assessment of what breaks between prototype and production. Complete before production deployment.

---

## 1. Project Scale Profile

| Dimension | Current State | 6-Month Target | Worst-Case Spike |
|---|---|---|---|
| Concurrent users | <100 | 500 | 2000 |
| Requests per minute | <50 | 200 | 500 |
| Database rows (largest table) | federations ~67 | federations 67, events 1000+ | events 10K+ |
| File storage (total GB) | <1 | 5 | 20 |
| Geographic regions served | Namibia (primary) | Southern Africa | Multi-region |
| Monthly data transfer (GB) | <5 | 20 | 100 |

**Scale classification:** Regional service — hundreds of users, single country, moderate data.

---

## 2. Infrastructure & Hosting

### Netlify (Frontend + Functions)

| Concern | Current Config | Production Requirement |
|---|---|---|
| Plan tier | Free/Pro | Pro recommended for functions |
| Function timeout | 10s (default) | 26s max (Pro) |
| Function memory | 1024MB | 1024MB |
| Bandwidth limit | 100GB/mo (Free) | 400GB+ (Pro) |
| Build time budget | ~1 min | <5 min |

**Known Netlify limits:**
- Functions: 10s timeout (Free), 26s (Pro)
- Concurrent function executions scale with plan
- Stateless — no in-memory persistence between invocations

### Supabase (Database / Auth / Storage)

| Concern | Current Config | Production Requirement |
|---|---|---|
| Plan tier | Free/Pro | Pro for production |
| Database size limit | 500MB (Free) | 8GB (Pro) |
| Connection pooling | Transaction mode recommended | Use pooler port 6543 |
| Max concurrent connections | 50 (Free) | 200+ (Pro) |
| Database region | EU West (Ireland) | Same for Namibia latency |
| RLS on all tables | Verify | Required |
| Point-in-time recovery | Pro feature | Enable for production |

**Known Supabase limits:**
- Free: 500MB DB, 1GB storage, 2GB bandwidth
- Connection pooler REQUIRED for serverless
- Realtime: 200 concurrent connections soft limit (Pro)

---

## 3. Database Scale Planning

### Tables That Will Grow

| Table | Current Rows | Projected 12-Month | Growth Rate | Retention | Archive Strategy |
|---|---|---|---|---|---|
| namibia_na_26_events | <100 | 2000+ | Linear | Keep | Archive past events after 2 years |
| namibia_na_26_news_articles | <50 | 500+ | Linear | Keep | Archive by date |
| namibia_na_26_athletes | <500 | 2000+ | Linear | Keep | Soft delete |
| namibia_na_26_clubs | <200 | 500+ | Linear | Keep | |

### Data Integrity at Scale

- [ ] All foreign keys have ON DELETE behavior defined
- [ ] Indexes on federationId, clubId, created_at for list queries
- [ ] Timestamps use timestamptz for timezone safety
- [ ] RLS policies tested under load

---

## 4. API & External Dependencies

| Service | Rate Limit | Usage Estimate | Fallback if Down | Cost at Scale |
|---|---|---|---|---|
| Supabase | Connection limits | Moderate | None — core | Pro tier |
| Anthropic Claude | Per-tier | Low (summaries) | Skip AI features | Usage-based |
| WhatsApp Business API | Tier-based | Low | Queue, retry | Usage-based |
| Cloudflare (DNS) | Standard | Low | — | Free/Pro |

### Failure Mode Analysis

| If this breaks... | User impact | Detection | Recovery |
|---|---|---|---|
| Supabase DB down | Site unusable | Health check | Supabase status page |
| Netlify outage | Site unreachable | Uptime monitor | Netlify status |
| WhatsApp API | Notifications fail | Log errors | Queue, retry later |
| Claude API | AI summaries fail | Graceful degradation | Return raw content |

---

## 5. Geographic & Network Considerations

| User Region | Expected % | Latency (EU West) |
|---|---|---|
| Namibia | 80% | 150–300ms |
| South Africa | 15% | 100–200ms |
| Other | 5% | 200–500ms |

### Network Resilience

- [ ] Loading states on all data-dependent components
- [ ] Critical flows work on 3G (500ms+ latency)
- [ ] Images via Supabase CDN, responsive sizing
- [ ] API payloads minimal (no over-fetching)

---

## 6. Cost Projection

| Service | Free Tier Until | Pro Cost/Month | 10x Scale |
|---|---|---|---|
| Netlify | 100GB bandwidth | $19 | $19–99 |
| Supabase | 500MB DB | $25 | $25 |
| Domain/DNS | — | ~$15 | ~$15 |
| **Total** | | ~$60 | ~$100 |

---

## 7. Security at Scale

- [ ] Input validation (Zod) on all tRPC procedures
- [ ] Auth on every non-public procedure
- [ ] Rate limiting on auth endpoints
- [ ] CORS restrictive (sports.com.na only)
- [ ] RLS on all Supabase tables
- [ ] No secrets in client code
- [ ] Webhook signature verification

---

## 8. The Honest Assessment

**What is the single most likely thing to break first under load?**
> Database connection exhaustion if connection pooling is not correctly configured for serverless.

**What is the single most expensive scaling surprise?**
> Supabase bandwidth and function invocations if traffic spikes.

**If we had to handle 10x traffic tomorrow, what would fail?**
> Unbounded list queries; missing pagination on events/news/athletes.

**Deferred items:**

| Item | Risk | Trigger | Deadline |
|---|---|---|---|
| Rate limiting on tRPC | Medium | Abuse reported | Q2 |
| E2E test suite | Medium | Pre-production | Q2 |
| RLS policy audit | High | Before prod | Q1 |

---

## Sign-Off

| Role | Name | Date |
|---|---|---|
| Technical Lead | | |
| Project Owner | | |
