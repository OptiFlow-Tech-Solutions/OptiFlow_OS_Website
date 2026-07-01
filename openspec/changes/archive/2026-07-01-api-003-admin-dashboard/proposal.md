# api-003: Admin Dashboard Enhancement

## Summary
Fix CSS duplication, add submission persistence, and enhance the admin dashboard with stats, search, and detail view. Builds on api-002's auth layer.

## Scope
- Remove duplicate CSS from `src/pages/admin.html` (already in `core.css`)
- Add KV-backed submission storage so dashboard shows real data
- Add dashboard stats (total submissions, recent count, by form type)
- Add submission detail expand/collapse (field key counts → actual values)
- Add search/filter by form type
- Add auto-refresh (30s polling)

## Affected Specs
- **Modified**: `admin-authentication` — update submissions endpoint, add stats/kv specs
- **Modified**: `shared-components` — admin dashboard stats/filter components
- **Modified**: `build-pipeline` — KV namespace binding
