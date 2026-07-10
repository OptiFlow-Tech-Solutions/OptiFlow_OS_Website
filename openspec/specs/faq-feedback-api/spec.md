# faq-feedback-api

## Purpose

Django API endpoint and model for recording FAQ helpfulness votes, replacing per-device localStorage with cross-device server-side tracking.

## Requirements

### Requirement: FAQFeedback model
The system SHALL provide a `FAQFeedback` Django model with fields: `faq_item_id` (IntegerField), `was_helpful` (BooleanField), and `created_at` (DateTimeField auto_now_add).

#### Scenario: Model migrates successfully
- **WHEN** `python manage.py migrate` is run
- **THEN** the `faq_feedback` table is created with the expected columns

### Requirement: Feedback POST endpoint
The system SHALL provide a `POST /api/faq/feedback/` endpoint that accepts `faq_item_id` (integer) and `was_helpful` (boolean) and returns `201 Created`.

#### Scenario: Helpful vote recorded
- **WHEN** `POST /api/faq/feedback/` with `{"faq_item_id": 1, "was_helpful": true}`
- **THEN** response returns 201 with `{"id": <int>}` and the vote is persisted

#### Scenario: Unhelpful vote recorded
- **WHEN** `POST /api/faq/feedback/` with `{"faq_item_id": 5, "was_helpful": false}`
- **THEN** response returns 201 and the vote is persisted

#### Scenario: Invalid faq_item_id rejected
- **WHEN** `POST /api/faq/feedback/` with `{"faq_item_id": -1, "was_helpful": true}`
- **THEN** response returns 400 with validation error

#### Scenario: Missing fields rejected
- **WHEN** `POST /api/faq/feedback/` with `{"was_helpful": true}`
- **THEN** response returns 400 with validation error for missing `faq_item_id`

### Requirement: Rate limiting
The system SHALL apply rate limiting to the feedback endpoint to prevent abuse.

#### Scenario: Excessive requests throttled
- **WHEN** a client sends more than 30 feedback requests per hour
- **THEN** subsequent requests return 429 Too Many Requests

### Requirement: FAQ app structure
The system SHALL create a new `faq/` Django app with `models.py`, `serializers.py`, `views.py`, `urls.py`, and `admin.py`, following the same pattern as the existing `leads/` app.

#### Scenario: App is registered
- **WHEN** `faq` is added to `INSTALLED_APPS` in settings
- **THEN** the app loads without import errors

#### Scenario: URLs are wired
- **WHEN** the root URL conf includes `faq.urls` under `/api/`
- **THEN** `GET /api/faq/feedback/` (OPTIONS) returns 200
