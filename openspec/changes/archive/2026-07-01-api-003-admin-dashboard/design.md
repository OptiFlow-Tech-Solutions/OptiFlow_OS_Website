# Design: api-003

## Decisions
- **KV for persistence**: Store submissions in Cloudflare KV namespace `SUBMISSIONS`. Append-only, keyed by timestamp + random suffix.
- **No DB**: KV is sufficient for simple submission storage. No need for D1.
- **Remove inline CSS**: All admin styles live in `core.css`. Page file only references it.
- **Stats computed server-side**: `/api/admin/stats` endpoint returns aggregated counts.
- **Detail via field values**: `/api/admin/submissions` now returns field values (not just keys). Admin is behind auth so PII exposure is acceptable.
- **Auto-refresh**: `setInterval(30s)` in dashboard JS polls for new submissions.
- **Filter client-side**: Form type dropdown filters submission list in-memory.
- **Sort by date descending**: Most recent first.
