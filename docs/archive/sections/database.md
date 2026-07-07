# Database — Implementation Documentation
- **Current Score:** 10/100 | **Target Score:** 60/100 | **Gap:** 50 | **Last Updated:** 2026-07-06

## Overview
The project currently has no relational database. All data persistence is handled by Cloudflare KV, a globally distributed key-value store designed for configuration and metadata, not application data. This is the single most critical gap in the architecture (TD-01) and blocks virtually all product features. A migration to PostgreSQL is required before any application development can begin.

## Current State
- **Cloudflare KV namespaces** (4):
  - `SUBMISSIONS` — stores form contact/demo booking submissions; keyed by submission ID; values are JSON strings
  - `RATE_LIMIT` — stores IP-based request counters with TTL for rate limiting; keyed by IP+endpoint
  - `NOTIFICATIONS` — stores email send logs (recipient, subject, timestamp, status); keyed by notification ID
  - `AUDIT` — stores admin action audit trail (login, export, view); keyed by audit entry ID
- **KV limitations in use**: eventual consistency (writes may not be immediately visible), no query language (only get/list by key prefix), no relationships or foreign keys, no schema enforcement, no migrations, no transactions, 25 MiB value size limit, 1,000 list results max per request
- **Current KV usage** is read-heavy with simple key lookups; write volume is low (form submissions only)
- Scoring deductions: 50-point gap reflects the complete absence of a proper database; no schema, no queries, no constraints, no migration system, no backup strategy

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|------------|------|----------|------------|--------|
| DB Migration | PostgreSQL deployment + schema design | CRITICAL | 40.0 | Not Started |
| DEV-003 | Automated KV backups | HIGH | 1.0 | Not Started |

## Implementation Order
1. **PostgreSQL deployment** — provision a managed PostgreSQL instance (Supabase, Neon, or Railway). This is the foundational dependency for all application features.
2. **Schema design** — define tables for: users (authentication, roles), customers (company profiles), submissions (contact/demo forms), notifications (email logs), audit_logs (admin actions), and future tables for tasks, attendance, SOPs, and reports.
3. **Migration framework** — implement a schema migration system (Drizzle ORM, Prisma Migrate, or raw SQL with versioning); all schema changes must be repeatable and reversible.
4. **Data migration** — export existing KV data (submissions, notifications, audit logs) and import into PostgreSQL; validate data integrity post-migration.
5. **Worker refactor** — update all 3 Cloudflare Workers (form-submit.js, email.js, _scheduled.js) to use PostgreSQL via Hyperdrive or direct connection instead of KV namespaces.
6. **DEV-003 (KV backups)** — implement automated KV export/backup as interim safety net before migration completes; can run in parallel with PostgreSQL setup.

## Dependencies
| Depends On | For Feature |
|------------|-------------|
| PostgreSQL deployment | PROD-006, PROD-007, all application features |
| Database schema | PROD-006 (customer portal data), PROD-007 (admin dashboard data) |
| Data migration from KV | Worker refactor (can't decommission KV until data is migrated) |
| (none) | DEV-003 |

## Key Files
| File | Purpose |
|------|---------|
| `wrangler.toml` | KV namespace bindings: SUBMISSIONS, RATE_LIMIT, NOTIFICATIONS, AUDIT |
| `workers/form-submit.js` | Writes to SUBMISSIONS KV; triggers email worker |
| `workers/email.js` | Writes to NOTIFICATIONS KV after email dispatch |
| `workers/_scheduled.js` | Purges expired entries from RATE_LIMIT and AUDIT KV namespaces |
| `.env.example` | Environment template (currently no DB-related variables) |

## Acceptance Criteria
- [ ] PostgreSQL instance provisioned and accessible from Cloudflare Workers (via Hyperdrive or IP allowlist)
- [ ] Complete schema designed with all tables, columns, types, constraints, indexes, and foreign keys documented in schema.sql or migration files
- [ ] Migration framework in place; first migration creates full schema; rollback tested
- [ ] All existing KV data migrated to PostgreSQL with verified row counts and data integrity checks
- [ ] All 3 workers refactored to use PostgreSQL; KV namespaces deprecated (kept only for rate limiting if performance-critical)
- [ ] Automated KV backup (DEV-003) running on schedule as interim safety measure
- [ ] Database connection uses connection pooling; prepared statements for all queries

## References
- MASTER_IMPLEMENTATION.md
- FEATURE_INDEX.md
- TECHNICAL_DEBT.md (TD-01 — CRITICAL)
