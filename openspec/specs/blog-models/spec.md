# blog-models

## Purpose

Django ORM models for the blog and newsletter system — Article, ArticleCategory, Resource, and NewsletterSubscriber — supporting content management, SEO, and email list building for OptiFlow OS.

## Requirements

### Requirement: ArticleCategory model
The system SHALL provide an `ArticleCategory` model with fields: `name` (CharField, max 100, unique), `slug` (SlugField, max 100, unique, auto-generated from name), `description` (TextField, blank), and `order` (PositiveIntegerField, default 0). Categories SHALL be orderable via the `order` field in admin.

#### Scenario: Category created with auto slug
- **WHEN** a category is created with name "Business Systems"
- **THEN** the slug is automatically set to "business-systems"

#### Scenario: Category names are unique
- **WHEN** a second category with the same name is created
- **THEN** the system raises a database integrity error

#### Scenario: Categories ordered by display order
- **WHEN** categories are queried without explicit ordering
- **THEN** they are returned in ascending `order` value

### Requirement: Article model
The system SHALL provide an `Article` model with fields: `title` (CharField, max 200, unique), `slug` (SlugField, max 200, unique, auto-generated from title), `excerpt` (TextField, max 500), `content` (TextField, stores sanitized HTML), `category` (ForeignKey to ArticleCategory, on_delete=PROTECT), `author` (CharField, max 100), `read_time` (PositiveIntegerField, in minutes), `featured_image` (URLField, blank), `is_featured` (BooleanField, default False), `is_published` (BooleanField, default False), `published_at` (DateTimeField, null, blank), `view_count` (PositiveIntegerField, default 0), `created_at` (DateTimeField, auto_now_add), and `updated_at` (DateTimeField, auto_now).

#### Scenario: Article created with auto slug
- **WHEN** an article is created with title "How to Reduce Follow-Ups by 80%"
- **THEN** the slug is automatically set to "how-to-reduce-follow-ups-by-80-percent"

#### Scenario: Published article requires published_at
- **WHEN** an article's `is_published` is set to True without a `published_at` value
- **THEN** the system raises a validation error

#### Scenario: Category deletion protected
- **WHEN** a category with associated articles is deleted
- **THEN** the system raises a ProtectedError and the category is preserved

#### Scenario: Articles ordered by published_at descending
- **WHEN** published articles are queried without explicit ordering
- **THEN** they are returned newest-first by `published_at`

### Requirement: Resource model
The system SHALL provide a `Resource` model with fields: `title` (CharField, max 200), `description` (TextField), `file_type` (CharField, max 50, choices: PDF, Excel, Guide, Template, Toolkit), `file_url` (URLField), `category` (CharField, max 100), `is_active` (BooleanField, default True), `download_count` (PositiveIntegerField, default 0), `created_at` (DateTimeField, auto_now_add), and `updated_at` (DateTimeField, auto_now).

#### Scenario: Resource has valid file type
- **WHEN** a resource is created with `file_type` of "PDF"
- **THEN** the resource is saved successfully

#### Scenario: Invalid file type rejected
- **WHEN** a resource is created with `file_type` of "Video"
- **THEN** the system raises a validation error

### Requirement: NewsletterSubscriber model
The system SHALL provide a `NewsletterSubscriber` model with fields: `email` (EmailField, unique), `is_active` (BooleanField, default True), `source` (CharField, max 50, default "website"), `subscribed_at` (DateTimeField, auto_now_add), and `unsubscribed_at` (DateTimeField, null, blank). Unsubscribing SHALL set `is_active` to False and `unsubscribed_at` to now without deleting the record.

#### Scenario: Duplicate email rejected
- **WHEN** a subscription is attempted with an already-subscribed email
- **THEN** the system raises a database integrity error

#### Scenario: Unsubscribe preserves record
- **WHEN** a subscriber unsubscribes
- **THEN** the record's `is_active` becomes False and `unsubscribed_at` is set, but the row is not deleted

### Requirement: Django admin registration
All four models SHALL be registered in Django admin with `list_display`, `search_fields`, and `list_filter` configurations. The `Article` admin SHALL include `prepopulated_fields` for slug generation from title. The `NewsletterSubscriber` admin SHALL show `is_active` filter and `email` search.

#### Scenario: Article admin prepopulates slug
- **WHEN** an admin user types an article title
- **THEN** the slug field is automatically populated from the title

#### Scenario: Subscriber admin filters by active status
- **WHEN** an admin user views the subscriber list
- **THEN** they can filter by active/inactive status
