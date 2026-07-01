# Tasks: API-006 — Monitoring & Observability

## Phase 1: Backend (form-submit.js)

- [x] 1.1 Fix IP privacy: hash IP in `log()` function (line 75) — `ip: hashedIp` instead of raw `ip`
- [x] 1.2 Add `GET /api/health` route handler — returns `{ status, timestamp }` with 200
- [x] 1.3 Add `GET /api/admin/audit` route handler — paginated audit entries from KV
- [x] 1.4 Enhance `GET /api/admin/stats` with `last7Days`, `last30Days`, `emailsSent`, `emailsFailed`, `rateLimited`

## Phase 2: Admin Dashboard (admin.html + core.js + core.css)

- [x] 2.1 Add tab bar HTML to `src/pages/admin.html` (Submissions | Audit Log | Email Delivery)
- [x] 2.2 Add audit log list container HTML to admin.html
- [x] 2.3 Add email delivery stats container HTML to admin.html
- [x] 2.4 Add `.admin-tabs` and related CSS to `assets/css/core.css`
- [x] 2.5 Add tab switching JS to `assets/js/core.js`
- [x] 2.6 Add audit log loading JS to `assets/js/core.js`
- [x] 2.7 Add email delivery stats loading JS to `assets/js/core.js`
- [x] 2.8 Add historical trend stats display JS

## Phase 3: Build & Validation

- [x] 3.1 Run `npm run build` to assemble dist/
- [x] 3.2 Run `npm run validate` — 0 errors, 86 pre-existing warnings
- [x] 3.3 Verified admin page description meets 120-160 char requirement
- [x] 3.4 Health endpoint route registered at `/api/health`
- [x] 3.5 Audit endpoint requires JWT auth
- [x] 3.6 Admin dashboard tabs implemented

## Phase 4: Spec Registration

- [x] 4.1 Created delta spec `platform-monitoring` in `specs/`
- [x] 4.2 `platform-monitoring` already mapped in `feature-router.mjs` (lines 152-154)
- [x] 4.3 `npm run build && npm run validate` passed
