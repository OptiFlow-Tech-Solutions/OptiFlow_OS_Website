# API-006: Monitoring & Observability

## Summary

Add comprehensive monitoring and observability to the OptiFlow OS Website, including a health check endpoint for uptime monitoring, enhanced admin dashboard with audit log viewer and email delivery stats, historical trend metrics, structured error logging, and IP privacy hardening.

## Motivation

The platform currently lacks any operational visibility:
- No health check endpoint for external monitoring (UptimeRobot, Cloudflare health checks)
- Audit logs are written to KV but never surfaced to the admin
- Email delivery has no failure visibility
- Stats endpoint only shows today/total — no historical trends
- Raw IPs are logged to console (privacy risk)
- Rate limiting is invisible — no blocked-request metrics

## Scope

### In Scope
1. `GET /api/health` — Public health check endpoint
2. Enhanced `GET /api/admin/stats` — Historical trends (last 7/30 days), rate-limit metrics, email delivery stats
3. `GET /api/admin/audit` — Audit log list for admin dashboard
4. Admin dashboard — New tabs: Audit Log, Email Delivery Stats
5. IP privacy — Hash IP before console.log
6. `platform-monitoring` capability spec

### Out of Scope
- Real-time WebSocket updates
- External alerting (Slack/Discord webhooks)
- Geo/IP analytics
- Latency percentile tracking
- Sentry/Logpush integration

## Affected Specs

- `accessibility` — New admin tab UI must meet WCAG 2.2 AA
- `admin-authentication` — New audit endpoint reuses JWT auth
- `dark-mode` — New admin tabs must support both themes
- `design-system` — Stats cards, audit table use CSS variables
- `marketing-pages` — Admin page is part of marketing site (`noindex`)
- `orchestration-engine` — Feature router needs `platform-monitoring` mapping
- `shared-components` — No nav/footer changes needed
- **`platform-monitoring` (NEW)** — Delta spec defining monitoring capabilities
