# form-processing-api Specification

## Purpose
TBD - created by archiving change api-001-form-processing-api. Update Purpose after archive.
## Requirements
### Requirement: Form Submission Endpoint

The system SHALL expose a POST endpoint at `/api/form-submit` that accepts JSON request bodies containing form field data, form metadata, and UTM parameters.

#### Scenario: Valid submission accepted
- **WHEN** a POST request is received at `/api/form-submit` with valid JSON body containing `formName`, `fields`, and `honeyPot` set to empty string
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "message": "Submission received" }`
- **AND** an email notification SHALL be sent via Resend
- **AND** structured JSON SHALL be logged to the worker console

#### Scenario: Missing required fields
- **WHEN** a POST request is received with missing `formName` or `fields` in the JSON body
- **THEN** the endpoint SHALL return HTTP 400 with `{ "success": false, "error": "Missing required fields: formName, fields" }`
- **AND** no email notification SHALL be sent

#### Scenario: Honey-pot detection
- **WHEN** the `honeyPot` field contains any non-empty value
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true }` (to not reveal detection)
- **AND** the submission SHALL be silently discarded
- **AND** a "spam_detected" log entry SHALL be written

### Requirement: Server-Side Field Validation

The system SHALL validate submitted form fields against per-form field schemas before accepting the submission.

#### Scenario: Contact form field validation
- **WHEN** a submission with `formName: "contact"` is received
- **THEN** `fields.name`, `fields.email`, `fields.phone`, and `fields.company` SHALL be required and non-empty
- **AND** `fields.email` SHALL match regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **AND** `fields.phone` SHALL match regex `/^\+?\d{7,15}$/`
- **AND** on validation failure, HTTP 422 SHALL be returned with per-field error messages

#### Scenario: Demo booking form field validation
- **WHEN** a submission with `formName: "demo-booking"` is received
- **THEN** `fields.name`, `fields.email`, `fields.phone`, `fields.company` SHALL be required
- **AND** `fields.demoDate` if present SHALL be a valid ISO date string
- **AND** on validation failure, HTTP 422 SHALL be returned

#### Scenario: Newsletter form field validation
- **WHEN** a submission with `formName: "newsletter"` is received
- **THEN** `fields.email` SHALL be required and valid
- **AND** on validation failure, HTTP 422 SHALL be returned

### Requirement: Rate Limiting

The system SHALL enforce a per-IP rate limit of 5 submissions per 10-minute sliding window.

#### Scenario: Under rate limit
- **WHEN** a client IP has submitted fewer than 5 requests in the last 10 minutes
- **THEN** the request SHALL be processed normally

#### Scenario: Rate limit exceeded
- **WHEN** a client IP has submitted 5 or more requests in the last 10 minutes
- **THEN** the endpoint SHALL return HTTP 429 with `{ "success": false, "error": "Too many requests. Please try again later." }`
- **AND** the Retry-After header SHALL be set

### Requirement: Email Notification

The system SHALL delegate email notification delivery to the email-notifications Worker at `/api/email` for every valid form submission.

#### Scenario: Email dispatched for contact form
- **WHEN** a valid "contact" form submission is received
- **THEN** the form-submit Worker SHALL POST to `/api/email` with `{ "type": "contact", "fields": <form fields>, "utm": <utm params> }`
- **AND** the form-submit Worker SHALL NOT call the Resend API directly

#### Scenario: Email dispatched for demo booking
- **WHEN** a valid "demo-booking" form submission is received
- **THEN** the form-submit Worker SHALL POST to `/api/email` with `{ "type": "demo-booking", "fields": <form fields>, "utm": <utm params> }`

#### Scenario: Email dispatched for newsletter
- **WHEN** a valid "newsletter" form submission is received
- **THEN** the form-submit Worker SHALL POST to `/api/email` with `{ "type": "newsletter", "fields": <form fields>, "utm": <utm params> }`

#### Scenario: Email Worker failure degrades gracefully
- **WHEN** the POST to `/api/email` fails or returns `emailSent: false`
- **THEN** the submission SHALL still be accepted (HTTP 200)
- **AND** a warning SHALL be logged to the worker console
- **AND** the response body SHALL include `"emailSent": false`

#### Scenario: Email Worker returns success
- **WHEN** the POST to `/api/email` returns HTTP 200 with `emailSent: true`
- **THEN** the response body SHALL include `"emailSent": true`

### Requirement: Structured Logging

The system SHALL log each submission as a structured JSON object with timestamp, form name, field keys (not values for PII), IP, UTM params, and spam status.

#### Scenario: Log entry for valid submission
- **WHEN** a valid submission is processed
- **THEN** a JSON log entry SHALL be written with keys: `timestamp`, `formName`, `fieldKeys`, `ip`, `utm`, `spam`, `emailSent`
- **AND** field values SHALL be excluded from the log for PII protection

#### Scenario: Log entry for spam detection
- **WHEN** a honey-pot detection occurs
- **THEN** a JSON log entry SHALL be written with `spam: true` and no field data

### Requirement: Cross-Platform Compatibility

The system SHALL function as both a Cloudflare Worker and a Netlify Function using a shared validation and notification library.

#### Scenario: Cloudflare Worker deployment
- **WHEN** deployed to Cloudflare Pages via `functions/api/form-submit.js`
- **THEN** the worker SHALL handle POST requests and return valid JSON responses

#### Scenario: Netlify Function deployment
- **WHEN** deployed to Netlify via `netlify/functions/form-submit.js`
- **THEN** the function SHALL handle POST requests and return valid JSON responses

