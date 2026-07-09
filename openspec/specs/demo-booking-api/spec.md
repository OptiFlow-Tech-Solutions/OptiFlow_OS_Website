# demo-booking-api

## Purpose

Django REST API for demo booking — model storage, validation, slot availability, email notifications.

## Requirements

### Requirement: DemoBooking model stores booking data
The system SHALL have a `DemoBooking` Django model in the `leads` app with fields: name (CharField, max 100), company (CharField, max 200), mobile (CharField, max 15), email (EmailField), team_size (CharField, max 20), industry (CharField, max 50), challenges (TextField, blank), preferred_date (DateField), preferred_time_slot (CharField, max 20), status (CharField with choices PENDING/CONFIRMED/COMPLETED/CANCELLED, default PENDING), created_at (DateTimeField, auto_now_add), updated_at (DateTimeField, auto_now).

#### Scenario: Model is registered in Django admin
- **WHEN** Django admin is accessed
- **THEN** DemoBooking model appears in the leads app with list display, search, and filters

#### Scenario: Migration creates the table
- **WHEN** `python manage.py makemigrations` and `python manage.py migrate` are run
- **THEN** the `leads_demobooking` table exists in the database with all specified columns

### Requirement: Unique constraint prevents double-booking
The system SHALL enforce that no two bookings can have the same `preferred_date` and `preferred_time_slot` combination, excluding bookings with status CANCELLED.

#### Scenario: Duplicate slot is rejected at database level
- **WHEN** two bookings attempt to use the same date and time slot
- **THEN** the second booking is rejected with a unique constraint violation

#### Scenario: Cancelled bookings don't block slots
- **WHEN** a booking with status CANCELLED exists for a date+time
- **THEN** a new booking can be created for the same date+time

### Requirement: POST endpoint creates bookings
The system SHALL expose `POST /api/demo-bookings/` that accepts JSON body with all booking fields, validates inputs, saves to database, and sends confirmation email.

#### Scenario: Valid booking creates record and returns 201
- **WHEN** a valid booking JSON is POSTed
- **THEN** a 201 response is returned with the created booking data and status is PENDING

#### Scenario: Missing required field returns 400
- **WHEN** a required field (name, company, mobile, email, team_size, industry, preferred_date, preferred_time_slot) is missing
- **THEN** a 400 response is returned with field-level error messages

#### Scenario: Invalid date format returns 400
- **WHEN** preferred_date is not in YYYY-MM-DD format
- **THEN** a 400 response is returned with a date format error

### Requirement: POST endpoint validates business rules
The endpoint SHALL validate: name (3-100 chars), company (2+ chars), mobile (10 digits, first digit 6-9), email (valid format), team_size (must be in [1–10, 11–25, 26–50, 51–100, 101–250, 250+]), industry (must be in [Textile, Manufacturing, Trading, Warehousing, Distribution, Logistics, Service, Other]), preferred_date (must be a weekday, must be >= tomorrow), preferred_time_slot (must be a valid slot for that day of week, must not be already booked).

#### Scenario: Weekend date returns 400
- **WHEN** preferred_date is a Saturday or Sunday
- **THEN** a 400 response is returned with a date error

#### Scenario: Past date returns 400
- **WHEN** preferred_date is today or earlier
- **THEN** a 400 response is returned with a date error

#### Scenario: Invalid team size returns 400
- **WHEN** team_size is not one of the allowed values
- **THEN** a 400 response is returned with a team_size error

#### Scenario: Invalid time slot for weekday returns 400
- **WHEN** preferred_date is a weekday and preferred_time_slot is not in the 9 weekday slots
- **THEN** a 400 response is returned with a time slot error

#### Scenario: Invalid time slot for Saturday returns 400
- **WHEN** preferred_date is Saturday and preferred_time_slot is not in the 4 Saturday slots
- **THEN** a 400 response is returned with a time slot error

#### Scenario: Already-booked slot returns 400
- **WHEN** the date+time combination is already booked (status not CANCELLED)
- **THEN** a 400 response is returned with a slot availability error

### Requirement: Slot availability endpoint
The system SHALL expose `GET /api/demo-bookings/slots/?date=<YYYY-MM-DD>` that returns a JSON array of available time slot strings for the given date.

#### Scenario: Weekday returns 9 slots when none booked
- **WHEN** GET is called with a weekday date with no bookings
- **THEN** response is `["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"]`

#### Scenario: Saturday returns 4 slots when none booked
- **WHEN** GET is called with a Saturday date with no bookings
- **THEN** response is `["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"]`

#### Scenario: Sunday returns empty array
- **WHEN** GET is called with a Sunday date
- **THEN** response is `[]`

#### Scenario: Booked slots are excluded
- **WHEN** GET is called and "10:00 AM" is already booked for that date
- **THEN** "10:00 AM" is not included in the response array

#### Scenario: Missing date parameter returns 400
- **WHEN** GET is called without a date query parameter
- **THEN** a 400 response is returned

### Requirement: Honeypot field silently discards spam
When the `_hp` field in the request body contains any value, the endpoint SHALL return a 201 success response but SHALL NOT persist the booking or send email.

#### Scenario: Honeypot filled returns fake success
- **WHEN** a POST includes `"_hp": "bot-value"`
- **THEN** a 201 response is returned but no database record is created and no email is sent

### Requirement: Email notification on booking
When a booking is successfully created, the system SHALL send a confirmation email to the customer's email address and a notification email to the admin address configured via `DEMO_BOOKING_NOTIFY_EMAIL` environment variable.

#### Scenario: Customer receives confirmation email
- **WHEN** a booking is created with email "owner@textileco.com"
- **THEN** an email is sent to "owner@textileco.com" with subject containing "Demo Request Received" and body containing the selected date and time slot

#### Scenario: Admin receives notification email
- **WHEN** a booking is created
- **THEN** an email is sent to the admin notification address with subject containing "New Demo Booking" and body containing the customer name, company, date, and time

#### Scenario: Email failure does not block booking
- **WHEN** email sending fails (SMTP error)
- **THEN** the booking is still saved and a 201 response is returned (the error is logged server-side)

### Requirement: API uses consistent response envelope
All API responses SHALL follow the DRF standard with consistent field-level error format for 400 responses.

#### Scenario: Validation error returns field-level errors
- **WHEN** validation fails on mobile and email fields
- **THEN** response body contains `{"mobile": ["error message"], "email": ["error message"]}`
