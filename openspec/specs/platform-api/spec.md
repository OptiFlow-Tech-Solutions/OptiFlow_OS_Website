# Platform API

## Purpose

Define REST API endpoints that handle form submissions from the OptiFlow OS marketing website, enabling server-side persistence, email notifications, and admin data access.

## Requirements

### Requirement: Contact Form Submission Endpoint

The system SHALL provide a `POST /api/contact` endpoint for contact form submissions.

#### Scenario: Valid contact form submission

- **GIVEN** the API server is running
- **WHEN** a `POST` request is made to `/api/contact` with a valid JSON body containing `name`, `company`, `phone`, `email`, `team_size`, `industry`, and `challenges`
- **THEN** the server SHALL respond with HTTP 201 Created
- **AND** the response SHALL include `{ "success": true, "id": "<uuid>" }`
- **AND** the submission SHALL be persisted to the database
- **AND** a notification email SHALL be triggered

#### Scenario: Missing required fields

- **GIVEN** the API server is running
- **WHEN** a `POST` request is made to `/api/contact` with a body missing `name` or `email`
- **THEN** the server SHALL respond with HTTP 400 Bad Request
- **AND** the response SHALL include `{ "success": false, "errors": [{ "field": "name", "message": "Required" }] }`

#### Scenario: Invalid email format

- **GIVEN** the API server is running
- **WHEN** a `POST` request is made to `/api/contact` with `email` set to `"not-an-email"`
- **THEN** the server SHALL respond with HTTP 400 Bad Request
- **AND** the `errors` array SHALL include a validation error for the `email` field

### Requirement: Demo Booking Submission Endpoint

The system SHALL provide a `POST /api/demo-booking` endpoint for demo booking requests.

#### Scenario: Valid demo booking submission

- **GIVEN** the API server is running
- **WHEN** a `POST` request is made to `/api/demo-booking` with a valid JSON body containing `name`, `company`, `mobile`, `email`, `team_size`, `industry`, `challenges`, `selected_date`, and `selected_time_slot`
- **THEN** the server SHALL respond with HTTP 201 Created
- **AND** the response SHALL include `{ "success": true, "id": "<uuid>", "booking_date": "2026-07-15", "booking_time": "11:00 AM" }`
- **AND** a calendar invite email SHALL be triggered

#### Scenario: Time slot already taken

- **GIVEN** a demo booking exists for `2026-07-15` at `11:00 AM`
- **WHEN** another `POST` request to `/api/demo-booking` specifies the same date and time slot
- **THEN** the server SHALL respond with HTTP 409 Conflict
- **AND** the response SHALL include `{ "success": false, "message": "This time slot is no longer available. Please select another." }`

#### Scenario: Rate limiting

- **GIVEN** the API server is running with rate limiting enabled
- **WHEN** more than 5 `POST` requests are made to `/api/demo-booking` from the same IP within 1 minute
- **THEN** subsequent requests SHALL respond with HTTP 429 Too Many Requests
- **AND** the response SHALL include a `Retry-After` header

### Requirement: Newsletter Subscription Endpoint

The system SHALL provide a `POST /api/newsletter` endpoint for newsletter signups.

#### Scenario: New newsletter subscription

- **GIVEN** the API server is running
- **WHEN** a `POST` request is made to `/api/newsletter` with `{ "email": "owner@textileco.in" }`
- **THEN** the server SHALL respond with HTTP 201 Created
- **AND** the response SHALL include `{ "success": true, "message": "Subscribed successfully" }`

#### Scenario: Already subscribed email

- **GIVEN** `owner@textileco.in` is already subscribed
- **WHEN** a `POST` request is made to `/api/newsletter` with the same email
- **THEN** the server SHALL respond with HTTP 409 Conflict
- **AND** the response SHALL include `{ "success": false, "message": "Already subscribed" }`

### Requirement: Admin Data Access Endpoint

The system SHALL provide a `GET /api/admin/submissions` endpoint for authenticated admin access to form submissions.

#### Scenario: Authenticated admin retrieves submissions

- **GIVEN** a valid admin session token is provided in the `Authorization` header
- **WHEN** a `GET` request is made to `/api/admin/submissions?type=contact&page=1&limit=20`
- **THEN** the server SHALL respond with HTTP 200 OK
- **AND** the response SHALL include paginated submission records ordered by `created_at` descending
- **AND** soft-deleted records SHALL be excluded

#### Scenario: Unauthenticated access denied

- **GIVEN** no valid session token is provided
- **WHEN** a `GET` request is made to `/api/admin/submissions`
- **THEN** the server SHALL respond with HTTP 401 Unauthorized

### Requirement: CORS Configuration

The system SHALL allow cross-origin requests from the marketing website domain.

#### Scenario: Same-origin CORS headers

- **GIVEN** the API is deployed at `api.optiflow.in` and the website at `optiflow.in`
- **WHEN** the website makes a `POST` request to any `/api/*` endpoint
- **THEN** the response SHALL include `Access-Control-Allow-Origin: https://optiflow.in`
- **AND** preflight `OPTIONS` requests SHALL respond with HTTP 204 No Content
