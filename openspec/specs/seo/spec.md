# SEO

## Purpose

Define the search engine optimization requirements that ensure every page is discoverable, indexable, and well-represented in search results and social previews.

## Requirements

### Requirement: Unique Title Tag

Every page SHALL have a unique, descriptive `<title>` tag.

#### Scenario: Title uniqueness

- **GIVEN** the `site.json` pages array
- **WHEN** any page is assembled
- **THEN** the `<title>` SHALL match the page's `title` field exactly
- **AND** no two pages SHALL share the same title

### Requirement: Unique Meta Description

Every page SHALL have a unique meta description between 120 and 160 characters.

#### Scenario: Description presence and length

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** a `<meta name="description" content="...">` tag SHALL be present
- **AND** the description SHALL come from the page's `description` field in `site.json`
- **AND** it SHALL be between 120 and 160 characters in length

### Requirement: OpenGraph Tags

Every page SHALL have complete OpenGraph meta tags.

#### Scenario: OG tag presence

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** `og:title` SHALL be present and populated
- **AND** `og:description` SHALL be present and populated
- **AND** `og:image` SHALL point to the OptiFlow logo (`/assets/img/OptiFlow.Logo.png`)
- **AND** `og:type` SHALL be set to "website"

### Requirement: Twitter Card

Every page SHALL have a Twitter card meta tag.

#### Scenario: Twitter card presence

- **GIVEN** any assembled page
- **WHEN** the page is shared on Twitter/X
- **THEN** a `<meta name="twitter:card" content="summary">` tag SHALL be present

### Requirement: Single H1 Element

Every page SHALL have exactly one `<h1>` element.

#### Scenario: H1 uniqueness

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** exactly one `<h1>` element SHALL exist
- **AND** it SHALL contain the primary page heading

### Requirement: Clean URLs

The system SHALL produce search-engine-friendly, directory-based URLs without `.html` extensions.

#### Scenario: URL structure

- **GIVEN** a page defined in `site.json` as `/features/index.html`
- **WHEN** the page is built
- **THEN** the accessible URL SHALL be `/features/`
- **AND** no `.html` extension SHALL appear in any navigation link

### Requirement: Favicon

The system SHALL include a favicon on every page.

#### Scenario: Favicon present

- **GIVEN** any assembled page
- **WHEN** the page loads in a browser
- **THEN** a `<link rel="icon" href="/assets/img/OptiFlow.Logo.png" sizes="any">` tag SHALL be present in the `<head>`

### Requirement: Canonical Page Inventory

The `site.json` pages array SHALL be the canonical page inventory for SEO metadata.

#### Scenario: Single source of truth

- **GIVEN** the `site.json` pages array
- **WHEN** the build runs or validation executes
- **THEN** all page titles, descriptions, and URL paths SHALL be sourced from this array
- **AND** any page not in the array SHALL not be generated
- **AND** validation SHALL verify consistency between `site.json` metadata and generated pages
