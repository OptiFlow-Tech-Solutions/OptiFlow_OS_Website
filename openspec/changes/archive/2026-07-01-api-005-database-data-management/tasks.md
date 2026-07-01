# Tasks: API-005 Database & Data Management

## Phase 1: Schema & Key Structure (0.5h)

- [ ] 1.1 Create `openspec/specs/database-data-management/spec.md` delta spec
- [ ] 1.2 Define KV key naming conventions in spec
- [ ] 1.3 Define value schemas (submission.v1, notification.v1, audit.v1) in spec

## Phase 2: Core Implementation (1.5h)

- [ ] 2.1 Update form-processing-api KV write to use `sub:{YYYY-MM-DD}:{uuid}` key format
- [ ] 2.2 Update form-processing-api KV write to include `schema: "submission.v1"` in values
- [ ] 2.3 Update email-notifications KV write to use `notif:{YYYY-MM-DD}:{uuid}` key format and schema field
- [ ] 2.4 Add audit logging on each submission write (to separate `audit:` keys)
- [ ] 2.5 Add `subscriber:` key writes for newsletter signups (with email hash dedup)

## Phase 3: Admin API Updates (1h)

- [ ] 3.1 Add pagination to GET `/api/admin/submissions` with `page` and `per_page` query params
- [ ] 3.2 Implement KV list cursor-to-page translation in submission endpoint
- [ ] 3.3 Add GET `/api/admin/submissions/export` endpoint (CSV output)
- [ ] 3.4 Add `?format=json` support to export endpoint
- [ ] 3.5 Add `?formName=` filter support to both submissions and export endpoints

## Phase 4: Admin Dashboard Updates (1h)

- [ ] 4.1 Add pagination controls to admin.html (page nav, per-page selector)
- [ ] 4.2 Add "Export CSV" and "Export JSON" buttons to admin dashboard
- [ ] 4.3 Add subscriber count to admin stats display

## Phase 5: Data Lifecycle (0.5h)

- [ ] 5.1 Create scheduled Worker function `functions/api/_scheduled.js` for daily cleanup
- [ ] 5.2 Implement TTL-based key deletion (sub: 30d, notif: 7d, audit: 90d)
- [ ] 5.3 Add cleanup run audit log entry

## Phase 6: Validation & Build (0.5h)

- [ ] 6.1 Run `npm run build` and fix any build errors
- [ ] 6.2 Run `npm run validate` and fix validation issues
- [ ] 6.3 Run `npm run lint:all` and fix lint issues
- [ ] 6.4 Verify admin dashboard loads with new pagination and export buttons

## Phase 7: Spec Delta Sync

- [ ] 7.1 Update admin-authentication spec delta with export + pagination
- [ ] 7.2 Update form-processing-api spec delta with schema + key changes
- [ ] 7.3 Update email-notifications spec delta with schema + key changes
