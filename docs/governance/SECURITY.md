# SECURITY.md — Namibia Sports Platform

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x | ✅ Security updates |
| < 1.0 | ❌ Not supported |

## Security Architecture

### Authentication
- **Provider:** Supabase Auth (JWT)
- **Methods:** Email/password, OAuth (as configured)
- **Session:** Cookie-based with JWT verification in tRPC context

### Authorization
- **Model:** Role-based (user, admin, federation_admin, club_manager)
- **Enforcement:** tRPC procedures — `publicProcedure`, `protectedProcedure`, `federationAdminProcedure`, `adminProcedure`
- **RLS:** Supabase Row Level Security on tables (verify enabled)

### Data Protection
- **At rest:** Supabase managed (PostgreSQL encryption)
- **In transit:** HTTPS/TLS (Netlify, Supabase)
- **Secrets:** Environment variables only; never in code

### Network Boundaries
- **Public:** Home, events list, news list, streams list, federation pages
- **Authenticated:** Profile, subscriptions
- **Federation admin:** CRUD for own federation data
- **Admin:** Full platform access

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

1. Email the project maintainers at the contact listed in the repository
2. Include: description, steps to reproduce, impact assessment
3. Allow 72 hours for initial response
4. We will acknowledge and provide a timeline for fix

**Out of scope:** Feature requests, dependency update suggestions (use regular issues)

## Security Maintenance

- **Dependency audit:** Run `npm audit` before each release
- **API key rotation:** Document schedule in ops runbook
- **Access review:** Quarterly for admin accounts
