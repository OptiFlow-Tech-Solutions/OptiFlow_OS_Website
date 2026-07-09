# breadcrumb-navigation

## Purpose

Dynamic breadcrumb component that derives a navigation trail from the current URL path segments, rendering as accessible semantic HTML with JSON-LD structured data for SEO.

## Requirements

### Requirement: Breadcrumb renders from URL path
The system SHALL provide a `<Breadcrumb>` component that derives a navigation trail from the current URL path segments, displaying each segment as a clickable link.

#### Scenario: Single-level breadcrumb
- **WHEN** the user is on `/os/pricing/`
- **THEN** the breadcrumb displays: `Home  >  Pricing`

#### Scenario: Nested breadcrumb
- **WHEN** the user is on `/os/feature-showcase/`
- **THEN** the breadcrumb displays: `Home  >  Feature Showcase`

#### Scenario: Home page has no breadcrumb
- **WHEN** the user is on `/os/`
- **THEN** no breadcrumb is rendered

#### Scenario: 404 page breadcrumb
- **WHEN** the user is on an unmatched route (404)
- **THEN** the breadcrumb displays: `Home  >  Page Not Found`

### Requirement: Breadcrumb labels are human-readable
The system SHALL convert URL path segment slugs to human-readable labels by capitalizing the first letter of each word and replacing hyphens with spaces.

#### Scenario: Hyphenated slug becomes readable label
- **WHEN** the URL segment is `problem-solutions`
- **THEN** the breadcrumb label displays "Problem Solutions"

#### Scenario: Multi-word slug becomes readable label
- **WHEN** the URL segment is `competitive-positioning`
- **THEN** the breadcrumb label displays "Competitive Positioning"

### Requirement: Breadcrumb links are functional
Each breadcrumb segment SHALL link to its corresponding page path, with the last segment rendered as plain text (not a link) representing the current page.

#### Scenario: Intermediate segments are linked
- **WHEN** the breadcrumb displays "Home  >  Features"
- **THEN** "Home" is a clickable link to `/os/`

#### Scenario: Current page is not linked
- **WHEN** the breadcrumb displays "Home  >  Pricing"
- **THEN** "Pricing" is rendered as plain text, not a link

### Requirement: Breadcrumb is accessible
The breadcrumb SHALL use semantic ARIA markup (`<nav aria-label="Breadcrumb">`) with `<ol>` for the trail structure.

#### Scenario: Screen reader announces breadcrumb
- **WHEN** a screen reader encounters the breadcrumb
- **THEN** it announces "Breadcrumb" as the navigation label and reads each item in sequence

#### Scenario: Breadcrumb has structured data
- **WHEN** the breadcrumb renders
- **THEN** it includes a `<script type="application/ld+json">` block with `BreadcrumbList` schema for SEO
