# Platform Email

## Purpose

Define the email and notification service that delivers confirmation emails, internal alerts, and calendar invites triggered by form submissions on the OptiFlow OS marketing website.

## Requirements

### Requirement: Contact Form Acknowledgment Email

The system SHALL send an acknowledgment email to the user after a contact form submission.

#### Scenario: Acknowledgment email sent to submitter

- **GIVEN** a contact form submission is successfully persisted
- **WHEN** the email service processes the submission event
- **THEN** an email SHALL be sent to the submitter's email address
- **AND** the subject SHALL be "We received your enquiry — OptiFlow OS"
- **AND** the body SHALL include the submitter's name and a statement that the team will respond within 1 business day
- **AND** the sender SHALL be `hello@optiflow.in`

#### Scenario: Email delivery failure logged

- **GIVEN** the email provider returns an error (e.g., invalid recipient address)
- **WHEN** the acknowledgment email fails to send
- **THEN** the failure SHALL be logged with the submission ID and error reason
- **AND** the contact submission SHALL NOT be rolled back

### Requirement: Internal Notification for Contact Submissions

The system SHALL notify the OptiFlow team when a new contact form is submitted.

#### Scenario: Internal notification sent

- **GIVEN** a contact form submission is successfully persisted
- **WHEN** the email service processes the submission event
- **THEN** an internal notification email SHALL be sent to `hello@optiflow.in`
- **AND** the subject SHALL be "New Contact Enquiry: {company} — {name}"
- **AND** the body SHALL include all submitted fields (name, company, phone, email, team size, industry, challenges)
- **AND** the body SHALL include a direct reply link and the submission timestamp

### Requirement: Demo Booking Confirmation Email

The system SHALL send a confirmation email with calendar invite to the user after a demo booking.

#### Scenario: Booking confirmation with calendar invite

- **GIVEN** a demo booking submission is successfully persisted
- **WHEN** the email service processes the booking event
- **THEN** an email SHALL be sent to the submitter's email address
- **AND** the email SHALL include an `.ics` calendar attachment for the selected date and time slot
- **AND** the subject SHALL be "Demo Confirmed: {selected_date} at {selected_time_slot} — OptiFlow OS"
- **AND** the body SHALL include the booking details, a "Reschedule" link, and a "Add to Calendar" link

#### Scenario: Internal booking notification sent

- **GIVEN** a demo booking submission is successfully persisted
- **WHEN** the email service processes the booking event
- **THEN** an internal notification email SHALL be sent to `hello@optiflow.in`
- **AND** the subject SHALL be "New Demo Booking: {company} — {selected_date} {selected_time_slot}"
- **AND** the body SHALL include all booking fields plus the selected date and time

### Requirement: Newsletter Welcome Email

The system SHALL send a welcome email to new newsletter subscribers.

#### Scenario: Welcome email sent

- **GIVEN** a newsletter subscription is successfully persisted
- **WHEN** the email service processes the subscription event
- **THEN** an email SHALL be sent to the subscriber's email address
- **AND** the subject SHALL be "Welcome to the OptiFlow OS Newsletter"
- **AND** the body SHALL include an introduction to OptiFlow OS and a link to the latest newsletter issue
- **AND** the body SHALL include an unsubscribe link

#### Scenario: Resubscription skipped

- **GIVEN** a newsletter subscription returns HTTP 409 (already subscribed)
- **WHEN** the email service evaluates the event
- **THEN** no welcome email SHALL be sent

### Requirement: Email Template System

The system SHALL use HTML email templates with plain-text fallback for all outgoing emails.

#### Scenario: HTML and plain-text rendering

- **GIVEN** an email template is defined for any notification type
- **WHEN** the email is rendered
- **THEN** the email SHALL include both `text/html` and `text/plain` MIME parts
- **AND** the template SHALL use OptiFlow OS brand colors (accent, teal) via inline styles
- **AND** the template SHALL include the OptiFlow OS logo

#### Scenario: Template variable substitution

- **GIVEN** an email template contains `{{name}}`, `{{company}}`, `{{date}}` placeholders
- **WHEN** the email service renders the template with submission data
- **THEN** all placeholders SHALL be replaced with actual values
- **AND** no unreplaced placeholders SHALL remain
