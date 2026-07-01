# admin-authentication Delta Spec (api-003)

## MODIFIED: Admin Submissions Endpoint

### Requirement: Admin Submissions Endpoint (revised)

The system SHALL expose a GET endpoint at `/api/admin/submissions` that returns recent form submissions with field values, secured by Bearer token authentication.

#### Scenario: Authenticated request returns submissions with values
- **WHEN** a GET request with `Authorization: Bearer <valid-jwt>` is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "submissions": [...] }`
- **AND** each submission SHALL include `timestamp`, `formName`, `fields` (key-value pairs), `utm`, `emailSent`
- **AND** submissions SHALL be sorted by timestamp descending
- **AND** field values SHALL be included (not just keys) since admin is authenticated

#### Scenario: Unauthenticated request
- **WHEN** a GET request without a valid Bearer token is received
- **THEN** the endpoint SHALL return HTTP 401

## ADDED: Admin Stats Endpoint

### Requirement: Admin Stats Endpoint

The system SHALL expose a GET endpoint at `/api/admin/stats` that returns aggregated submission statistics.

#### Scenario: Authenticated stats request
- **WHEN** a GET request with `Authorization: Bearer <valid-jwt>` is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "stats": { "total": <N>, "today": <N>, "byForm": { "contact": <N>, "demo-booking": <N>, "newsletter": <N> } } }`

## ADDED: Submission Persistence via KV

### Requirement: Submission KV Storage

The form processing endpoint SHALL store each valid submission in Cloudflare KV namespace `SUBMISSIONS`.

#### Scenario: Submission stored in KV
- **WHEN** a valid form submission is accepted
- **THEN** the submission SHALL be stored in KV with key `sub:<ISO-timestamp>-<random-6chars>`
- **AND** the value SHALL be JSON with `{ timestamp, formName, fields, utm, ip, emailSent, spam }`
- **AND** KV write failure SHALL NOT fail the submission (logged as warning)

## ADDED: Admin Dashboard Features

### Requirement: Dashboard Stats Display

The admin dashboard SHALL display aggregate submission statistics.

#### Scenario: Stats loaded on dashboard open
- **WHEN** the dashboard becomes visible after auth
- **THEN** stats SHALL be fetched from `/api/admin/stats`
- **AND** total, today, and by-form counts SHALL be displayed in stat cards

### Requirement: Submission Search/Filter

The admin dashboard SHALL provide client-side filtering of submissions.

#### Scenario: Filter by form type
- **WHEN** user selects a form type from the filter dropdown
- **THEN** only submissions matching that form type SHALL be shown

#### Scenario: Search submissions
- **WHEN** user types in the search input
- **THEN** submissions whose field values contain the search text SHALL be shown (case-insensitive)

### Requirement: Auto-Refresh

The admin dashboard SHALL auto-refresh submissions every 30 seconds.

#### Scenario: Auto-polling
- **WHEN** the dashboard is visible
- **THEN** a 30-second interval SHALL poll `/api/admin/submissions`
- **AND** the submission list SHALL update with any new entries

### Requirement: Submission Detail Toggle

Each submission item SHALL support expand/collapse to show full field values.

#### Scenario: Expand submission detail
- **WHEN** user clicks a submission item
- **THEN** the item SHALL expand to show all field key-value pairs
- **AND** clicking again SHALL collapse the detail
