# Backend — Implementation Documentation
- **Current Score:** 35/100 | **Target Score:** 75/100 | **Gap:** 40 | **Last Updated:** 2026-07-06

## Overview
The backend currently consists solely of 3 Cloudflare Worker functions providing form handling, email dispatch, and scheduled maintenance. There is no application server, no business logic layer, and no persistence beyond KV key-value storage. The entire product backend (task management, attendance tracking, SOP workflows, reporting, customer portal, admin dashboard) remains unbuilt. This is the largest gap in the system, accounting for 40 of the 75 target points.

## Current State
- **form-submit.js** — Cloudflare Worker handling POST /api/form-submit: validates required fields, sanitizes input (HTML entity encoding), rate-limits by IP (5 req/10min via KV), CSRF origin check, stores submissions in KV namespace SUBMISSIONS, triggers email notification via internal fetch to email.js
- **email.js** — Cloudflare Worker handling POST /api/email: receives internal dispatch from form-submit.js, sends email via Resend API, logs to KV namespace NOTIFICATIONS
- **_scheduled.js** — Cloudflare Worker cron trigger: purges expired rate limit entries and audit logs older than retention period
- **Admin auth** — JWT-based single-user authentication (HS256), username/password from environment variables, login/verify endpoints
- **Admin endpoints** — GET submissions list (paginated), GET stats (aggregate counts), GET submissions/export (CSV/JSON)
- Scoring deductions: single admin user with plaintext credentials (TD-05), no RBAC, no password hashing, no monitoring or alerting (TD-06)

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|------------|------|----------|------------|--------|
| BE-001 | Calendar integration (demo booking) | HIGH | 2.0 | Not Started |
| PROD-006 | Customer portal (login, dashboard) | HIGH | 40.0 | Planned |
| PROD-007 | Admin dashboard UI | HIGH | 20.0 | Planned |
| DEV-001 | Uptime monitoring | HIGH | 1.0 | Not Started |
| DEV-002 | Error tracking (Sentry) | MEDIUM | 2.0 | Not Started |
| DEV-004 | Staging environment parity | MEDIUM | 2.0 | Not Started |

## Implementation Order
1. **BE-001 (Calendar integration)** — highest immediate business impact; every demo booking silently fails (TD-04). Embed Calendly or Cal.com widget; 2-hour fix closes a critical lead-generation gap.
2. **DEV-001 (Uptime monitoring)** — deploy UptimeRobot before any complex backend work begins; need visibility into availability baseline.
3. **PROD-006 (Customer portal)** — largest backend feature (40h); requires PostgreSQL (see database section), authentication system, user management, dashboard views. This is the backbone of product delivery.
4. **PROD-007 (Admin dashboard)** — depends on PROD-006 data layer; provides internal visibility into customers, usage, and system health.
5. **DEV-002 (Error tracking)** — add Sentry after portal exists; production traffic will surface real errors.
6. **DEV-004 (Staging environment)** — build staging parity once production environment exists to mirror.

## Dependencies
| Depends On | For Feature |
|------------|-------------|
| Database migration (PostgreSQL) | PROD-006, PROD-007 (all application data) |
| SEC-008 (password hashing) | PROD-006 (multi-user auth) |
| API versioning (API-001) | PROD-006 (portal API endpoints) |
| (none) | BE-001, DEV-001, DEV-002 |

## Key Files
| File | Purpose |
|------|---------|
| `workers/form-submit.js` | Form submission handler: validation, sanitization, rate limiting, CSRF, KV storage |
| `workers/email.js` | Email dispatch: receives internal request, sends via Resend API, logs notifications |
| `workers/_scheduled.js` | Cron worker: purges expired rate limit and audit log entries |
| `wrangler.toml` | Cloudflare Worker configuration: routes, KV bindings, environment variables, cron triggers |
| `.env.example` | Environment variable template: ADMIN_USER, ADMIN_PASS, JWT_SECRET, RESEND_API_KEY |

## Acceptance Criteria
- [ ] Demo booking page integrates with real calendar provider; bookings create actual calendar events
- [ ] Customer portal supports user registration, login, password reset, and dashboard view
- [ ] Admin dashboard displays real-time metrics: submissions, users, system health
- [ ] UptimeRobot or equivalent monitoring active with alert notification channel
- [ ] Sentry or equivalent captures and reports backend errors with stack traces
- [ ] Staging environment matches production configuration (Workers, KV, env vars)
- [ ] All worker functions have error handling with user-friendly messages; no raw stack traces in responses

## References
- MASTER_IMPLEMENTATION.md
- FEATURE_INDEX.md
- TECHNICAL_DEBT.md (TD-04, TD-05, TD-06)
