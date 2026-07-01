# Design: API-006 — Monitoring & Observability

## Decisions

### 1. Health Check Endpoint
- **Route:** `GET /api/health` (public, no auth)
- **Response:** `{ "status": "ok", "timestamp": "2026-07-01T...", "uptime": "operational" }`
- **Rationale:** Simplest possible uptime check. One function, zero dependencies. Compatible with UptimeRobot, Cloudflare Health Checks, Pingdom.

### 2. Audit Log Viewer
- **Route:** `GET /api/admin/audit?page=1&per_page=20` (JWT auth)
- Reads from `env.AUDIT` KV namespace, returns paginated audit entries sorted newest-first.
- Same pagination pattern as submissions endpoint.
- **Rationale:** Audit data already exists in KV. Zero new storage cost.

### 3. Enhanced Admin Stats
- Existing `GET /api/admin/stats` extended with:
  - `last7Days`: array of `{ date, count }` for 7-day trend
  - `last30Days`: array of `{ date, count }` for 30-day trend
  - `emailsSent`: total emails sent this week
  - `emailsFailed`: total email failures this week
  - `rateLimited`: count of blocked requests (in-memory, current cold-start)
- **Rationale:** Trend data enables operational visibility without a timeseries database.

### 4. Admin Dashboard Tabs
- New tab bar: Submissions | Audit Log | Email Delivery
- Each tab loads its own data lazily (on tab switch).
- Tab state managed via `data-tab` attributes, CSS `.active` class.
- **Rationale:** Progressive disclosure. Auditors see audit log; operators see email delivery; most users stay on submissions.

### 5. IP Privacy Fix
- `log()` function: hash IP before `console.log`, same as KV storage.
- `line 75` change: `ip: hashedIp` instead of raw `ip`.
- **Rationale:** One-line fix. Zero risk. Prevents PII in Cloudflare Worker logs.

### 6. Delta Spec Location
- `openspec/changes/api-006/specs/platform-monitoring/` — merged to `openspec/specs/platform-monitoring/` on archive.

### 7. CSS Approach
- All new admin styles use existing CSS variables (`--bg`, `--surface`, `--border`, `--accent`, `--teal`, etc.)
- Tab bar styled with `.admin-tabs` class in `core.css`
- Audit table reuses `.admin-submission-list` patterns
- **Rationale:** No new colors. No new spacing. Consistent with design system.
