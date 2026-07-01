# Delta: Admin Authentication → API-005 Database & Data Management

## Change: Add Pagination, Export, and Subscriber Stats

### Modified: Admin Submissions Endpoint

- **ADD**: Accept `?page=` (default 1) and `?per_page=` (default 20, max 100) query parameters
- **ADD**: Include `pagination` object in response: `{ page, perPage, total, pages }`
- **ADD**: Accept `?formName=` filter to narrow by form type
- **MODIFY**: Submissions SHALL be read via `KV.list({ prefix: "sub:" })` with date-based key sorting

### Added: Admin Export Endpoint

- **ADD**: GET `/api/admin/submissions/export` endpoint (Bearer-protected)
- **ADD**: Accept `?format=csv|json` (default csv)
- **ADD**: Accept `?formName=` filter
- **ADD**: CSV response with header row, one submission per row
- **ADD**: JSON response as array of submission objects
- **ADD**: Content-Disposition: attachment header with filename
- **ADD**: Audit entry written on each export

### Modified: Admin Stats Endpoint

- **ADD**: Include `subscribers` count in stats response (from `subscriber:*` keys)
- **ADD**: Response shape: `{ stats: { total, today, byForm, subscribers }, success: true }`

### Modified: Admin Page

- **ADD**: Pagination controls (previous/next buttons, page indicator, per-page dropdown)
- **ADD**: "Export CSV" and "Export JSON" download buttons in the filter bar
- **ADD**: Subscriber count in stats cards
- **ADD**: Form type filter dropdown applies to both view and export

### Modified: Submission KV Storage

- **MODIFY**: Key format changed from `sub:<timestamp>-<random>` to `sub:{YYYY-MM-DD}:{uuid}`
- **MODIFY**: Value SHALL include `schema: "submission.v1"` field
