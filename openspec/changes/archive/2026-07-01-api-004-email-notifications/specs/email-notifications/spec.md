## ADDED Requirements

### Requirement: Email Dispatch Endpoint

The system SHALL expose a POST endpoint at `/api/email` that accepts JSON with notification type, recipient data, and template context, and sends an email via the Resend API.

#### Scenario: Send team notification for contact form
- **WHEN** a POST request is received at `/api/email` with `{ "type": "contact", "fields": { "name": "Test", "email": "test@example.com" }, "utm": {} }`
- **THEN** an email SHALL be sent to `info@optiflow.co.in` with subject "New Contact Form Submission — OptiFlow OS"
- **AND** the email body SHALL be HTML with OptiFlow brand styling (logo, accent colors, footer)
- **AND** the response SHALL be HTTP 200 with `{ "success": true, "type": "contact" }`

#### Scenario: Send team notification for demo booking
- **WHEN** a POST request is received with `{ "type": "demo-booking", "fields": { "name": "Test", "email": "test@example.com", "demoDate": "2026-07-15" } }`
- **THEN** an email SHALL be sent to `info@optiflow.co.in` with subject "New Demo Booking — OptiFlow OS"

#### Scenario: Send team notification for newsletter
- **WHEN** a POST request is received with `{ "type": "newsletter", "fields": { "email": "sub@example.com" } }`
- **THEN** an email SHALL be sent to `info@optiflow.co.in` with subject "New Newsletter Signup — OptiFlow OS"

### Requirement: Subscriber Welcome Email

The system SHALL send a welcome confirmation email to the subscriber when a newsletter signup is received.

#### Scenario: Welcome email sent to subscriber
- **WHEN** a POST request is received with `{ "type": "newsletter", "fields": { "email": "sub@example.com" } }`
- **THEN** a welcome email SHALL be sent to `sub@example.com` with subject "Welcome to OptiFlow OS"
- **AND** the welcome email SHALL include the OptiFlow OS brand logo, a brief introduction, and a link to the website
- **AND** the welcome email SHALL include an unsubscribe notice

#### Scenario: No welcome email for non-newsletter types
- **WHEN** a POST request is received with type other than "newsletter"
- **THEN** no subscriber-facing email SHALL be sent

### Requirement: HTML Email Templates

The system SHALL send HTML-formatted emails with OptiFlow brand styling for all notification types.

#### Scenario: Team notification email template
- **WHEN** any team notification email is sent
- **THEN** the email body SHALL contain the OptiFlow OS logo with alt text
- **AND** SHALL use the brand accent color (`#1B4D81`) for headers and buttons
- **AND** SHALL include a footer with company name "OptiFlow Tech Solutions" and location "Surat, India"
- **AND** SHALL use table-based layout with inline styles for email client compatibility

#### Scenario: HTML email renders with fallback
- **WHEN** an HTML email is sent
- **THEN** the email SHALL include a plain-text alternative via the `text` field in the Resend API payload
- **AND** the plain-text SHALL contain all substantive information from the HTML version

### Requirement: Email Notification Logging

The system SHALL log every email attempt (both success and failure) to Cloudflare KV store for auditing and debugging.

#### Scenario: Successful email logged
- **WHEN** an email is successfully sent via Resend API
- **THEN** a KV entry SHALL be written with key `notif:<ISO-timestamp>-<random>`
- **AND** the entry SHALL include: `timestamp`, `type`, `to`, `subject`, `success: true`

#### Scenario: Failed email logged
- **WHEN** the Resend API call fails
- **THEN** a KV entry SHALL be written with key `notif:<ISO-timestamp>-<random>`
- **AND** the entry SHALL include: `timestamp`, `type`, `to`, `subject`, `success: false`, `error`

#### Scenario: KV write failure does not fail the request
- **WHEN** KV storage is unavailable during logging
- **THEN** the email dispatch SHALL still succeed or fail independently
- **AND** a console warning SHALL be logged

### Requirement: Request Validation

The system SHALL validate incoming JSON request bodies on the email dispatch endpoint.

#### Scenario: Missing type field
- **WHEN** a POST request is received at `/api/email` without the `type` field
- **THEN** the endpoint SHALL return HTTP 400 with `{ "success": false, "error": "Missing required field: type" }`

#### Scenario: Unsupported notification type
- **WHEN** a POST request is received with an unknown `type` value
- **THEN** the endpoint SHALL return HTTP 400 with `{ "success": false, "error": "Unknown notification type: <type>" }`

#### Scenario: Invalid JSON body
- **WHEN** a POST request is received with malformed JSON
- **THEN** the endpoint SHALL return HTTP 400 with `{ "success": false, "error": "Invalid JSON body" }`

### Requirement: Graceful Degradation

The system SHALL ensure that email delivery failures never propagate as errors to the caller that submitted the notification request.

#### Scenario: Resend API network error
- **WHEN** the Resend API is unreachable
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "emailSent": false }`

#### Scenario: Resend API non-2xx response
- **WHEN** the Resend API returns HTTP 4xx or 5xx
- **THEN** the endpoint SHALL return HTTP 200 with `{ "success": true, "emailSent": false }`
- **AND** the error details SHALL be included in the log entry
