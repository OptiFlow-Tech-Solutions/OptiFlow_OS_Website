## MODIFIED Requirements

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
