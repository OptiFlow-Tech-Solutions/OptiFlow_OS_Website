# admin-authentication Specification

## Purpose
Define the admin authentication system that protects the internal admin dashboard with credential-based login, JWT session tokens, submission persistence via Cloudflare KV, and dashboard features including stats, search/filter, and auto-refresh.

## Requirements
### Requirement: Admin Login Endpoint

The system SHALL expose a POST endpoint at `/api/admin/login` that accepts admin credentials and returns a JWT token.

#### Scenario: Valid credentials
- **WHEN** a POST request is received at `/api/admin/login` with `{ "username": "<ADMIN_USERNAME>", "password": "<ADMIN_PASSWORD>" }`
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "token": "<JWT>" }`
- **AND** the JWT SHALL be signed with the JWT_SECRET environment variable
- **AND** the JWT SHALL expire after 24 hours

#### Scenario: Invalid credentials
- **WHEN** a POST request is received with incorrect username or password
- **THEN** the endpoint SHALL return HTTP 401 with `{ "success": false, "error": "Invalid credentials" }`

#### Scenario: Missing credentials
- **WHEN** a POST request is received without username or password fields
- **THEN** the endpoint SHALL return HTTP 400 with `{ "success": false, "error": "Missing credentials" }`

### Requirement: Admin Token Verification Endpoint

The system SHALL expose a POST endpoint at `/api/admin/verify` that validates an existing JWT token.

#### Scenario: Valid token
- **WHEN** a POST request with `{ "token": "<valid-jwt>" }` is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "valid": true }`

#### Scenario: Invalid or expired token
- **WHEN** a POST request with an expired or malformed token is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "valid": false }`

### Requirement: Admin Submissions Endpoint

The system SHALL expose a GET endpoint at `/api/admin/submissions` that returns recent form submissions with field values, secured by Bearer token authentication, sourced from Cloudflare KV.

#### Scenario: Authenticated request returns submissions with values
- **WHEN** a GET request with `Authorization: Bearer <valid-jwt>` is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "submissions": [...] }`
- **AND** each submission SHALL include `timestamp`, `formName`, `fields` (key-value pairs), `utm`, `emailSent`
- **AND** submissions SHALL be sorted by timestamp descending (most recent first)
- **AND** field values SHALL be included (not just keys) since admin is authenticated

#### Scenario: Unauthenticated request
- **WHEN** a GET request without a valid Bearer token is received
- **THEN** the endpoint SHALL return HTTP 401

### Requirement: Admin Stats Endpoint

The system SHALL expose a GET endpoint at `/api/admin/stats` that returns aggregated submission statistics.

#### Scenario: Authenticated stats request
- **WHEN** a GET request with `Authorization: Bearer <valid-jwt>` is received
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "stats": { "total": <N>, "today": <N>, "byForm": { "contact": <N>, "demo-booking": <N>, "newsletter": <N> } } }`

### Requirement: Submission KV Storage

The form processing endpoint SHALL store each valid submission in Cloudflare KV namespace `SUBMISSIONS`.

#### Scenario: Submission stored in KV
- **WHEN** a valid form submission is accepted
- **THEN** the submission SHALL be stored in KV with key `sub:<ISO-timestamp>-<random-6chars>`
- **AND** the value SHALL be JSON with `{ timestamp, formName, fields, utm, ip, emailSent, spam }`
- **AND** KV write failure SHALL NOT fail the submission (logged as warning)

### Requirement: Admin Credential Storage

Admin credentials SHALL be stored as Cloudflare Worker environment variables (secrets).

#### Scenario: Credentials available
- **WHEN** the Worker starts
- **THEN** ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET SHALL be accessible via `env`

### Requirement: Admin Page

The system SHALL provide an admin page at `/admin/` with login form and dashboard UI toggled by auth state.

#### Scenario: Unauthenticated visitor
- **WHEN** a user navigates to `/admin/` without a valid session
- **THEN** the login form SHALL be displayed
- **AND** the dashboard UI SHALL be hidden

#### Scenario: Authenticated visitor
- **WHEN** a user navigates to `/admin/` with a valid stored token
- **THEN** the token SHALL be verified via `/api/admin/verify`
- **AND** on success, the dashboard SHALL be shown and the login form hidden
- **AND** recent submissions SHALL be loaded from `/api/admin/submissions`

### Requirement: Admin Navigation Isolation

The admin page SHALL NOT be linked from the public navigation or footer.

#### Scenario: No public links to admin
- **WHEN** the public site navigation and footer are rendered
- **THEN** no link to `/admin/` SHALL be present
- **AND** the admin page SHALL have `<meta name="robots" content="noindex, nofollow">`

### Requirement: Admin Design Components

The system SHALL provide admin-specific CSS component classes in core.css.

#### Scenario: Admin login form
- **WHEN** the admin page renders the login form
- **THEN** `.admin-login`, `.admin-login-card`, `.admin-login-header` classes SHALL style the login UI
- **AND** the design SHALL follow the existing design system tokens (colors, spacing, typography)

#### Scenario: Admin dashboard
- **WHEN** the admin dashboard renders
- **THEN** `.admin-dashboard`, `.admin-submission-list`, `.admin-submission-item` classes SHALL style the dashboard UI
- **AND** `.admin-stats-grid` and `.admin-stat-card` SHALL display submission statistics
- **AND** `.admin-filter-bar` SHALL provide search input and form-type filter dropdown

### Requirement: Dashboard Stats Display

The admin dashboard SHALL display aggregate submission statistics upon authentication.

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
- **AND** on logout the interval SHALL be cleared

### Requirement: Submission Detail Toggle

Each submission item SHALL support expand/collapse to show full field values.

#### Scenario: Expand submission detail
- **WHEN** user clicks a submission item
- **THEN** the item SHALL expand to show all field key-value pairs
- **AND** clicking again SHALL collapse the detail
