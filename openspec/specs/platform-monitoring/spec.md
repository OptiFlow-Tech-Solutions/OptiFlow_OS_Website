# Capability Spec: platform-monitoring

## Overview

Platform-wide monitoring and observability for the OptiFlow OS Website. Provides health checks, operational metrics, audit trail visibility, and email delivery tracking through the existing Cloudflare Workers backend.

## Requirements

### REQ-MON-001: Health Check Endpoint
- **Priority:** CRITICAL
- `GET /api/health` returns JSON `{ status: "ok", timestamp: ISO8601 }`
- Public endpoint (no authentication required)
- Must respond within 100ms (no external dependencies)
- Used by UptimeRobot, Cloudflare Health Checks, and other external monitors

### REQ-MON-002: Audit Log API
- **Priority:** HIGH
- `GET /api/admin/audit?page=1&per_page=20` returns paginated audit entries
- Requires valid JWT (Bearer token)
- Sorted newest-first by key (date-partitioned)
- Response: `{ success: true, entries: [...], pagination: { page, perPage, total, pages } }`

### REQ-MON-003: Enhanced Admin Stats (Trends)
- **Priority:** HIGH
- Extend `GET /api/admin/stats` with:
  - `last7Days`: array of `{ date, count }` — submission counts per day for last 7 days
  - `last30Days`: array of `{ date, count }` — submission counts per day for last 30 days
  - `emailsSent`: integer — total successful email deliveries (last 7 days)
  - `emailsFailed`: integer — total failed email deliveries (last 7 days)
  - `rateLimited`: integer — blocked request count (current cold start window)
- Requires valid JWT

### REQ-MON-004: Admin Dashboard Tabs
- **Priority:** HIGH
- Tab bar with three tabs: Submissions (default), Audit Log, Email Delivery
- Tab switching loads data lazily via fetch
- Accessible: keyboard-navigable, ARIA roles for tablist/tab/tabpanel
- Theme-compatible: uses CSS variables for dark/light mode

### REQ-MON-005: IP Privacy Hardening
- **Priority:** MEDIUM
- `log()` function in form-submit.js must hash the IP before console output
- Use same `sha256()` function already present for KV storage
- No raw IPs in Cloudflare Worker logs

### REQ-MON-006: Email Delivery Visibility
- **Priority:** HIGH
- Admin dashboard Email Delivery tab shows:
  - Summary: emails sent (week), failed (week), success rate percentage
  - Paginated list of recent email logs (from `env.NOTIFICATIONS` KV)
  - Each entry: timestamp, type (contact/demo/newsletter/welcome), recipient (masked), status

### REQ-MON-007: Design System Compliance
- **Priority:** HIGH
- All new CSS must use existing `--var(*)` custom properties from `core.css`
- No hardcoded colors, spacing, or border-radii
- Tab bar must match existing admin component patterns
- Responsive: tabs wrap on narrow screens (<480px)

## Constraints

- All monitoring data stored in existing KV namespaces (no new bindings)
- Health check must not consume KV quotas (no reads/writes)
- Admin endpoints must reuse existing JWT authentication pattern
- CSS must not add page-specific styles — add to `core.css`

## Dependencies

- `admin-authentication` — JWT verify pattern for audit/stats endpoints
- `database-data-management` — KV namespace access patterns
- `design-system` — CSS variable usage
- `dark-mode` — Theme compatibility

## Requirements (Added via QA-003)

### Requirement: Dependency Vulnerability Monitoring

The platform SHALL include `npm audit` scanning as part of the CI pipeline to detect known vulnerabilities in Node.js dependencies.

#### Scenario: Audit runs in CI

- **WHEN** the CI pipeline runs on a pull request
- **THEN** `npm audit --production` SHALL execute after test steps
- **AND** HIGH or CRITICAL vulnerabilities SHALL cause the step to fail

#### Scenario: Audit report is visible

- **WHEN** `npm audit --production` completes
- **THEN** a summary of vulnerabilities found SHALL be displayed in CI logs
