# Tasks: api-003

## 1. CSS Cleanup
- [x] 1.1 Remove duplicate `<style>` block from `src/pages/admin.html` (already in core.css)

## 2. KV Submission Storage
- [x] 2.1 Add KV put call in `functions/api/form-submit.js` — store valid submissions in `SUBMISSIONS` namespace
- [x] 2.2 Add KV list call in `handleAdminSubmissions()` — fetch recent submissions sorted by key
- [x] 2.3 Add `/api/admin/stats` handler — aggregate counts from KV list

## 3. Admin Dashboard UI
- [x] 3.1 Add stats cards to admin dashboard (total, today, by-form breakdown)
- [x] 3.2 Add form type filter dropdown and search input
- [x] 3.3 Add submission detail expand/collapse on click
- [x] 3.4 Add auto-refresh polling (30s interval)
- [x] 3.5 Add dashboard CSS to core.css (stats cards, filter bar, detail toggle)

## 4. Admin JS Updates
- [x] 4.1 Add `loadStats()` function to `core.js` admin section
- [x] 4.2 Update `loadSubmissions()` to include field values in render
- [x] 4.3 Add filter/search event handlers
- [x] 4.4 Add detail toggle click handler
- [x] 4.5 Add auto-refresh interval (clear on logout)

## 5. Build & Validate
- [x] 5.1 Update `assemble.mjs` if KV binding config needed
- [x] 5.2 Run `npm run build` and fix errors
- [x] 5.3 Run `npm run validate` and fix errors
