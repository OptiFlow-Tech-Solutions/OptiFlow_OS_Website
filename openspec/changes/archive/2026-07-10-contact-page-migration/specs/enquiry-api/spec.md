# enquiry-api

## Purpose

Django REST API for contact enquiries — model storage, validation, rate limiting, email notifications.

## Requirements

### Requirement: Enquiry model stores contact form data
The system SHALL have an `Enquiry` Django model in the `leads` app with fields: name (CharField, max 100), company (CharField, max 200), phone (CharField, max 15), email (EmailField), team_size (CharField, max 20), industry (CharField, max 50), challenges (TextField, blank), type (CharField with choices SALES/SUPPORT/PARTNERSHIP, default SALES), status (CharField with choices NEW/REPLIED/RESOLVED, default NEW), created_at (DateTimeField, auto_now_add), updated_at (DateTimeField, auto_now).

#### Scenario: Model is registered in Django admin
- **WHEN** Django admin is accessed
- **THEN** Enquiry model appears in the leads app with list display showing name, company, email, type, status, and created_at; search on name, company, email; list filter on type, status

#### Scenario: Migration creates the table
- **WHEN** `python manage.py makemigrations leads` and `python manage.py migrate` are run
- **THEN** the `leads_enquiry` table exists in the database with all specified columns

### Requirement: POST endpoint creates enquiries
The system SHALL expose `POST /api/enquiries/` that accepts JSON body with all enquiry fields, validates inputs, saves to database with rate limiting, and sends confirmation email.

#### Scenario: Valid enquiry creates record and returns 201
- **WHEN** a valid enquiry JSON is POSTed
- **THEN** a 201 response is returned with the created enquiry data (id, status: NEW, created_at)

#### Scenario: Missing required field returns 400
- **WHEN** a required field (name, company, phone, email, team_size, industry) is missing
- **THEN** a 400 response is returned with field-level error messages

#### Scenario: Invalid phone format returns 400
- **WHEN** phone is not 10 digits starting with 6-9
- **THEN** a 400 response is returned with a phone validation error

#### Scenario: Invalid email returns 400
- **WHEN** email is not a valid email format
- **THEN** a 400 response is returned with an email validation error

### Requirement: POST endpoint validates business rules
The endpoint SHALL validate: name (3-100 chars, required), company (2+ chars, required), phone (10 digits, first digit 6-9, required), email (valid format, required), team_size (must be one of: 1–10, 11–25, 26–50, 51–100, 101–250, 250+), industry (must be one of: Textile, Manufacturing, Trading, Warehousing, Distribution, Logistics, Service, Other), type (must be one of: SALES, SUPPORT, PARTNERSHIP; defaults to SALES if omitted).

#### Scenario: Name too short returns 400
- **WHEN** name has fewer than 3 characters after stripping
- **THEN** a 400 response is returned with a name validation error

#### Scenario: Invalid team size returns 400
- **WHEN** team_size is not one of the allowed values
- **THEN** a 400 response is returned with a team_size error

#### Scenario: Invalid type returns 400
- **WHEN** type is not one of SALES, SUPPORT, or PARTNERSHIP
- **THEN** a 400 response is returned with a type error

### Requirement: Honeypot field silently discards bots
The endpoint SHALL check for a `_hp` field in the request body. If `_hp` is non-empty, the endpoint SHALL return a 201 response with fake success data WITHOUT creating a database record.

#### Scenario: Filled honeypot returns fake 201
- **WHEN** a POST request includes `"_hp": "some value"`
- **THEN** a 201 response is returned with synthetic id and status, but no row is inserted into leads_enquiry

#### Scenario: Empty honeypot proceeds normally
- **WHEN** a POST request includes `"_hp": ""` or omits the field
- **THEN** validation proceeds normally and a record is created on success

### Requirement: Rate limiting prevents spam
The endpoint SHALL apply DRF throttling to `POST /api/enquiries/`: 5 requests per hour per IP address (anon) or user (auth). Exceeding the limit SHALL return 429 Too Many Requests.

#### Scenario: Sixth request in one hour returns 429
- **WHEN** a single IP address POSTs 6 requests to `/api/enquiries/` within one hour
- **THEN** the 6th request returns 429 with a "Request was throttled" message

#### Scenario: Different IPs are tracked independently
- **WHEN** requests come from two different IP addresses
- **THEN** each IP has its own 5-request-per-hour limit

### Requirement: Email notification on successful submission
The endpoint SHALL send email notifications on successful enquiry creation: a confirmation email to the submitter and an admin notification email. Email failures SHALL be logged but SHALL NOT prevent the 201 response.

#### Scenario: Customer receives confirmation email
- **WHEN** a valid enquiry is submitted with an email address
- **THEN** a confirmation email is sent to the submitter's email address with subject "We've received your enquiry — OptiFlow OS"

#### Scenario: Admin receives notification email
- **WHEN** a valid enquiry is submitted
- **THEN** a notification email is sent to the configured `ENQUIRY_NOTIFY_EMAIL` address with enquiry details (name, company, phone, email, type, challenges)

#### Scenario: Email failure does not block submission
- **WHEN** email sending fails (SMTP error)
- **THEN** the error is logged, but the 201 response is still returned with the created enquiry data

### Requirement: GET endpoint lists enquiries (admin)
The system SHALL expose `GET /api/enquiries/` that returns a paginated list of enquiries. This endpoint SHALL require authentication (future; initial implementation may return empty or 401).

#### Scenario: Unauthenticated request returns no data
- **WHEN** an unauthenticated GET request is made to `/api/enquiries/`
- **THEN** the endpoint returns an empty paginated response or 401 Unauthorized
