# Platform Monitoring

## Purpose

Define the monitoring and observability system that ensures the OptiFlow OS website and API are healthy, performant, and alert on failures.

## Requirements

### Requirement: Uptime Health Check

The system SHALL provide a health check endpoint and configure external uptime monitoring.

#### Scenario: Health check endpoint responds

- **GIVEN** the API server is running
- **WHEN** a `GET` request is made to `/api/health`
- **THEN** the server SHALL respond with HTTP 200 OK
- **AND** the response SHALL include `{ "status": "ok", "timestamp": "<iso8601>", "version": "<git-sha>" }`

#### Scenario: Database connectivity check

- **GIVEN** the API server is running
- **WHEN** a `GET` request is made to `/api/health`
- **THEN** the server SHALL verify database connectivity
- **AND** the response SHALL include `{ "database": "connected" }` on success
- **AND** the response SHALL include `{ "database": "disconnected" }` and HTTP 503 on failure

#### Scenario: Uptime monitor alerts on failure

- **GIVEN** an external uptime monitor (e.g., UptimeRobot, Cronitor) pings `/api/health` every 60 seconds
- **WHEN** `/api/health` returns a non-2xx status for 2 consecutive checks
- **THEN** the uptime monitor SHALL send an alert to `hello@optiflow.in`
- **AND** the alert SHALL include the failing endpoint, HTTP status code, and timestamp

### Requirement: Error Logging and Aggregation

The system SHALL log all errors with context and expose them for debugging.

#### Scenario: Structured error logging

- **GIVEN** an API endpoint throws an unhandled error
- **WHEN** the error handler catches it
- **THEN** the error SHALL be logged with `timestamp`, `level` (error), `message`, `stack trace`, `request method`, `request path`, and `request ID`
- **AND** the log output SHALL be JSON-formatted for machine parsing

#### Scenario: Validation errors logged as warnings

- **GIVEN** a form submission fails validation with HTTP 400
- **WHEN** the error handler processes the response
- **THEN** the validation failure SHALL be logged at `warn` level
- **AND** the log SHALL include which fields failed validation

#### Scenario: Log retention

- **GIVEN** log files accumulate over time
- **WHEN** the log rotation job runs
- **THEN** log files older than 30 days SHALL be compressed and archived
- **AND** log files older than 90 days SHALL be deleted

### Requirement: Form Submission Metrics

The system SHALL track form submission counts and expose them for monitoring.

#### Scenario: Submission counter endpoint

- **GIVEN** authenticated admin access
- **WHEN** a `GET` request is made to `/api/admin/metrics`
- **THEN** the server SHALL respond with HTTP 200 OK
- **AND** the response SHALL include counts for contact submissions, demo bookings, and newsletter signups grouped by day for the past 30 days

#### Scenario: Failed submission tracking

- **GIVEN** the API server is running
- **WHEN** any form submission endpoint returns a 4xx or 5xx status
- **THEN** the failure SHALL be counted in a `failed_submissions` metric
- **AND** an alert SHALL trigger if the failure rate exceeds 10% within any 1-hour window

### Requirement: API Performance Monitoring

The system SHALL track response times for all API endpoints.

#### Scenario: Response time logging

- **GIVEN** the API server is running with middleware instrumentation
- **WHEN** any API request is handled
- **THEN** the response time in milliseconds SHALL be recorded along with the endpoint path and status code
- **AND** a histogram of response times SHALL be available for the past 24 hours

#### Scenario: Slow response alert

- **GIVEN** response time metrics are being collected
- **WHEN** the p95 response time for any endpoint exceeds 2000ms for more than 5 minutes
- **THEN** an alert SHALL be sent to the admin email
- **AND** the alert SHALL identify the slow endpoint and the p95 value

### Requirement: Static Site Monitoring

The system SHALL verify the marketing website pages are healthy and performing within budget.

#### Scenario: Lighthouse Performance Budget

- **GIVEN** a CI pipeline runs Lighthouse audits on the production website
- **WHEN** any page scores below 90 on Performance, 95 on Accessibility, or 90 on SEO
- **THEN** the pipeline SHALL fail the check
- **AND** a report SHALL be attached to the build result

#### Scenario: Broken link monitoring

- **GIVEN** the `npm run validate` script is run on the built site
- **WHEN** any internal link returns 404
- **THEN** the check SHALL fail with a list of broken links
- **AND** the failure SHALL be reported in CI

#### Scenario: SSL certificate expiry check

- **GIVEN** the optiflow.in domain uses HTTPS
- **WHEN** the SSL certificate is within 14 days of expiry
- **THEN** an alert SHALL be sent to the admin email
- **AND** the alert SHALL include the expiry date and domain name
