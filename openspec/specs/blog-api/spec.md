# blog-api

## Purpose

REST API endpoints for the blog and newsletter system — article listing, detail, popular articles, resource listing, and newsletter subscribe/unsubscribe — powering the dynamic newsletter page and article detail views.

## Requirements

### Requirement: Paginated article listing
The system SHALL provide a `GET /api/articles/` endpoint that returns paginated articles (20 per page). Only published articles (`is_published=True`) SHALL be returned. Results SHALL be ordered by `published_at` descending. An optional `?category=` query parameter SHALL filter by category slug.

#### Scenario: List returns published articles paginated
- **WHEN** `GET /api/articles/` is requested
- **THEN** the response contains a paginated list with `count`, `next`, `previous`, and `results` fields

#### Scenario: Empty database returns empty results
- **WHEN** `GET /api/articles/` is requested with no published articles
- **THEN** the response has `count: 0` and empty `results`

#### Scenario: Filter by category
- **WHEN** `GET /api/articles/?category=operations` is requested
- **THEN** only articles in the "operations" category are returned

#### Scenario: Invalid category returns empty
- **WHEN** `GET /api/articles/?category=nonexistent` is requested
- **THEN** the response has `count: 0` and empty `results`

#### Scenario: Draft articles excluded
- **WHEN** an article has `is_published=False`
- **THEN** it does NOT appear in the listing response

### Requirement: Article detail by slug
The system SHALL provide a `GET /api/articles/:slug/` endpoint that returns the full article object including `title`, `slug`, `excerpt`, `content`, `category` (nested object with name and slug), `author`, `read_time`, `featured_image`, `published_at`, `view_count`. Accessing a published article SHALL increment its `view_count` by 1. Draft articles SHALL return 404.

#### Scenario: Published article returns full detail
- **WHEN** `GET /api/articles/from-whatsapp-to-workflows/` is requested for a published article
- **THEN** the response includes title, slug, excerpt, HTML content, nested category, author, read_time, and view_count

#### Scenario: Draft article returns 404
- **WHEN** `GET /api/articles/some-draft/` is requested for an unpublished article
- **THEN** the response is 404 Not Found

#### Scenario: Nonexistent slug returns 404
- **WHEN** `GET /api/articles/no-such-article/` is requested
- **THEN** the response is 404 Not Found

#### Scenario: View count increments on access
- **WHEN** a published article is accessed via the detail endpoint
- **THEN** its `view_count` is incremented by 1

### Requirement: Popular articles endpoint
The system SHALL provide a `GET /api/articles/popular/` endpoint that returns the top 6 published articles ordered by `view_count` descending, limited to articles published in the last 30 days.

#### Scenario: Popular returns top by views
- **WHEN** `GET /api/articles/popular/` is requested
- **THEN** the response contains up to 6 articles sorted by view_count descending

#### Scenario: Popular excludes old articles
- **WHEN** an article was published more than 30 days ago
- **THEN** it does NOT appear in the popular results even if it has high views

### Requirement: Resource listing endpoint
The system SHALL provide a `GET /api/resources/` endpoint that returns all active resources (`is_active=True`) with fields: `title`, `description`, `file_type`, `file_url`, `category`, `download_count`.

#### Scenario: Active resources returned
- **WHEN** `GET /api/resources/` is requested
- **THEN** only resources with `is_active=True` are returned

#### Scenario: Inactive resources excluded
- **WHEN** a resource has `is_active=False`
- **THEN** it does NOT appear in the listing

### Requirement: Newsletter subscribe endpoint
The system SHALL provide a `POST /api/newsletter/subscribe/` endpoint. It SHALL accept `email` (required, valid email) and `source` (optional, defaults to "website"). A honeypot field `_hp` SHALL silently accept the request with a 201 if non-empty. Duplicate emails SHALL return 409 Conflict. Invalid emails SHALL return 400 Bad Request.

#### Scenario: Valid subscription creates subscriber
- **WHEN** `POST /api/newsletter/subscribe/` is sent with `{"email": "user@example.com", "source": "blog"}`
- **THEN** the response is 201 Created with the subscriber data

#### Scenario: Honeypot catches bots
- **WHEN** `POST /api/newsletter/subscribe/` is sent with `{"email": "bot@spam.com", "_hp": "gotcha"}`
- **THEN** the response is 201 Created but no subscriber is actually created

#### Scenario: Duplicate email returns 409
- **WHEN** `POST /api/newsletter/subscribe/` is sent with an already-active email
- **THEN** the response is 409 Conflict with an appropriate message

#### Scenario: Invalid email returns 400
- **WHEN** `POST /api/newsletter/subscribe/` is sent with `{"email": "not-an-email"}`
- **THEN** the response is 400 Bad Request with validation errors

#### Scenario: Missing email returns 400
- **WHEN** `POST /api/newsletter/subscribe/` is sent without an email field
- **THEN** the response is 400 Bad Request

### Requirement: Newsletter unsubscribe endpoint
The system SHALL provide a `POST /api/newsletter/unsubscribe/` endpoint. It SHALL accept `email` (required) and set the subscriber's `is_active` to False with `unsubscribed_at` timestamp. Non-existent emails SHALL return 404. Already-unsubscribed emails SHALL return 200 with a message indicating they were already unsubscribed.

#### Scenario: Active subscriber unsubscribes
- **WHEN** `POST /api/newsletter/unsubscribe/` is sent with `{"email": "user@example.com"}`
- **THEN** the response is 200 OK and the subscriber is marked inactive

#### Scenario: Unknown email returns 404
- **WHEN** `POST /api/newsletter/unsubscribe/` is sent with an unregistered email
- **THEN** the response is 404 Not Found

#### Scenario: Already unsubscribed returns 200
- **WHEN** `POST /api/newsletter/unsubscribe/` is sent for an already-inactive subscriber
- **THEN** the response is 200 OK with a message indicating they were already unsubscribed
