# Design: API-005 Database & Data Management

## Architecture

```
Cloudflare Workers
├── /api/form-submit      → writes to KV (SUBMISSIONS namespace)
├── /api/email            → writes to KV (NOTIFICATIONS namespace)
├── /api/admin/submissions → reads from KV with pagination
├── /api/admin/submissions/export → reads from KV, returns CSV/JSON
├── /api/admin/stats      → aggregates from KV
└── /api/admin/audit      → reads AUDIT namespace (new)
          │
   Cloudflare KV
   ├── SUBMISSIONS namespace   (sub:* keys, 30-day TTL metadata)
   ├── NOTIFICATIONS namespace (notif:* keys, 7-day TTL metadata)
   └── AUDIT namespace         (audit:* keys, 90-day retention)
```

## Decision 1: KV Key Namespace Design

**Key patterns:**

| Prefix | Purpose | Key Format | TTL |
|--------|---------|-----------|-----|
| `sub:` | Form submissions | `sub:{YYYY-MM-DD}:{uuid}` | 30 days |
| `notif:` | Email notification logs | `notif:{YYYY-MM-DD}:{uuid}` | 7 days |
| `audit:` | Admin/data access audit | `audit:{YYYY-MM-DD}:{uuid}` | 90 days |
| `subscriber:` | Newsletter subscribers | `subscriber:{email-hash}` | Permanent |

**Rationale:** Date-prefixed keys enable efficient KV list filtering by prefix (`list({ prefix: "sub:2026-07" })`). UUID prevents collision while keeping keys sortable.

## Decision 2: KV Value Schemas

**Submission record:**
```json
{
  "schema": "submission.v1",
  "id": "uuid",
  "timestamp": "ISO-8601",
  "formName": "contact|demo-booking|newsletter",
  "fields": { "name": "...", "email": "...", "phone": "..." },
  "utm": { "source": "...", "medium": "..." },
  "ip": "hash",
  "emailSent": true,
  "spam": false
}
```

**Notification log:**
```json
{
  "schema": "notification.v1",
  "id": "uuid",
  "timestamp": "ISO-8601",
  "type": "contact|demo-booking|newsletter",
  "to": "info@optiflow.co.in",
  "subject": "...",
  "success": true
}
```

**Audit entry:**
```json
{
  "schema": "audit.v1",
  "id": "uuid",
  "timestamp": "ISO-8601",
  "action": "submission_write|submission_read|submission_export|admin_login",
  "actor": "user-ip-hash",
  "resource": "sub:<key>|notif:<key>",
  "detail": {}
}
```

## Decision 3: Pagination

Admin submissions endpoint accepts `?page=1&per_page=20`. Implementation uses `KV.list()` with cursor-based pagination, translated to page numbers for the API surface.

```
GET /api/admin/submissions?page=1&per_page=20
→ { success: true, submissions: [...], pagination: { page: 1, perPage: 20, total: 156, pages: 8 } }
```

## Decision 4: Admin Export

```
GET /api/admin/submissions/export?format=csv&formName=contact
GET /api/admin/submissions/export?format=json
```

CSV exports flatten field keys into columns. JSON exports return the raw KV records array. Both respect form type filtering.

## Decision 5: Data Lifecycle

A scheduled Worker runs daily at 03:00 UTC to:
1. List `sub:` keys older than 30 days → delete
2. List `notif:` keys older than 7 days → delete
3. List `audit:` keys older than 90 days → delete
4. Log counts to audit namespace

## Decision 6: Schema Versioning

Each KV value includes a `schema` field (e.g., `submission.v1`). On read, if the schema doesn't match expected, the worker logs a warning and attempts migration (if versioned migration path exists) or skips the record.

## Trade-offs

- **List-based pagination over cursor-based:** Simpler admin UX at the cost of list overhead on large datasets. Acceptable for expected volume (< 10K records).
- **KV over D1:** KV is already provisioned, cost-free for current scale. Migrate to D1 when record count exceeds 100K or query complexity demands SQL.
- **Hard delete over soft delete:** TTL-based cleanup means no recovery from KV. Acceptable for non-critical marketing data.
