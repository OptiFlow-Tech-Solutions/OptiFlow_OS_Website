# Platform Database

## Purpose

Define the database schema and migration system for persisting contact form submissions, demo booking requests, and newsletter subscriptions collected from the OptiFlow OS marketing website.

## Requirements

### Requirement: Contact Form Submissions Table

The system SHALL store contact form submissions in a `contact_submissions` table.

#### Scenario: Contact submission inserted

- **GIVEN** the `contact_submissions` table exists
- **WHEN** a contact form is submitted with name, company, phone, email, team_size, industry, and challenges
- **THEN** a new row SHALL be inserted with `id` (UUID), `created_at` (timestamp), and all submitted fields
- **AND** `name`, `company`, `email` SHALL be NOT NULL
- **AND** `phone` SHALL be NOT NULL

#### Scenario: Missing required fields rejected

- **GIVEN** the `contact_submissions` table with NOT NULL constraints
- **WHEN** a contact form submission arrives missing `name`, `company`, `phone`, or `email`
- **THEN** the database SHALL reject the insert
- **AND** the API layer SHALL return a validation error

### Requirement: Demo Booking Submissions Table

The system SHALL store demo booking requests in a `demo_bookings` table.

#### Scenario: Demo booking inserted

- **GIVEN** the `demo_bookings` table exists
- **WHEN** a demo booking is submitted with name, company, mobile, email, team_size, industry, challenges, selected_date, and selected_time_slot
- **THEN** a new row SHALL be inserted with `id` (UUID), `created_at` (timestamp), and all submitted fields
- **AND** `name`, `company`, `mobile`, `email`, `team_size`, `industry`, `selected_date`, and `selected_time_slot` SHALL be NOT NULL

#### Scenario: Duplicate time slot detection

- **GIVEN** a demo booking already exists for a given date and time slot
- **WHEN** a second booking requests the same date and time slot
- **THEN** the database SHALL enforce a unique constraint on (`selected_date`, `selected_time_slot`)
- **AND** the API layer SHALL return a "slot unavailable" response

### Requirement: Newsletter Subscriptions Table

The system SHALL store newsletter signups in a `newsletter_subscriptions` table.

#### Scenario: Newsletter subscription inserted

- **GIVEN** the `newsletter_subscriptions` table exists
- **WHEN** a user submits their email via the newsletter form
- **THEN** a new row SHALL be inserted with `id` (UUID), `email` (unique), `created_at` (timestamp), and `status` (default `active`)
- **AND** `email` SHALL be UNIQUE

#### Scenario: Duplicate newsletter subscription

- **GIVEN** an email is already in `newsletter_subscriptions` with status `active`
- **WHEN** the same email is submitted again
- **THEN** the database SHALL reject the insert due to the unique constraint
- **AND** the API layer SHALL return a 409 Conflict with message "Already subscribed"

### Requirement: Schema Migrations

The system SHALL use sequential, versioned migration files to manage schema changes.

#### Scenario: Forward migration

- **GIVEN** an empty or outdated database
- **WHEN** `npm run db:migrate` is executed
- **THEN** all pending migrations SHALL be applied in version order
- **AND** a `migrations` tracking table SHALL record which migrations have been applied

#### Scenario: Migration rollback

- **GIVEN** the most recent migration has been applied
- **WHEN** `npm run db:migrate:rollback` is executed
- **THEN** the most recent migration SHALL be reverted
- **AND** the `migrations` tracking table SHALL remove the reverted entry

#### Scenario: Migration idempotency

- **GIVEN** all migrations are already applied
- **WHEN** `npm run db:migrate` is executed again
- **THEN** no changes SHALL be made
- **AND** the command SHALL exit with code 0

### Requirement: Data Privacy

The system SHALL support data retention and deletion policies.

#### Scenario: Soft delete flag

- **GIVEN** a row in any submissions table
- **WHEN** a record is deleted via the admin interface
- **THEN** the `deleted_at` timestamp SHALL be set instead of removing the row
- **AND** soft-deleted records SHALL be excluded from default queries

#### Scenario: Retention policy enforcement

- **GIVEN** contact submissions older than 365 days
- **WHEN** the retention cleanup job runs
- **THEN** soft-deleted records older than 90 days SHALL be permanently removed
- **AND** non-deleted records SHALL be preserved
