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
- **AND** the validation script SHALL error if any page's description is shorter than 120 or longer than 160 characters

### Requirement: OpenGraph Tags

Every page SHALL have complete OpenGraph meta tags.

#### Scenario: OG tag presence

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** `og:title` SHALL be present and populated
- **AND** `og:description` SHALL match the page's meta description
- **AND** `og:image` SHALL point to the OptiFlow logo (`/assets/img/OptiFlow.Logo.png`)
- **AND** `og:type` SHALL be set to "website" (or "article" for the newsletter page)
- **AND** `og:url` SHALL be the page's canonical absolute URL
- **AND** `og:site_name` SHALL be "OptiFlow OS"
- **AND** `og:locale` SHALL be "en_IN"
- **AND** `og:image:width` and `og:image:height` SHALL be present with values 512

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

### Requirement: Canonical URL Tag

Every page SHALL include a canonical URL meta tag pointing to its absolute URL.

#### Scenario: Canonical URL present

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** a `<link rel="canonical" href="https://optiflow.in/<path>/">` tag SHALL be present in the `<head>`
- **AND** the href SHALL be the absolute URL matching the page's site.json file path

### Requirement: Robots Meta Tag

Every public page SHALL include a robots meta tag allowing indexing.

#### Scenario: Robots tag present on all pages

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** a `<meta name="robots" content="index, follow">` tag SHALL be present in the `<head>`

### Requirement: OpenGraph URL

Every page SHALL include an `og:url` meta tag with its canonical URL.

#### Scenario: OG URL present

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** a `<meta property="og:url" content="https://optiflow.in/<path>/">` tag SHALL be present
- **AND** the content SHALL match the page's canonical URL

### Requirement: OpenGraph Site Name

Every page SHALL include an `og:site_name` meta tag.

#### Scenario: OG site name present

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** a `<meta property="og:site_name" content="OptiFlow OS">` tag SHALL be present

### Requirement: OpenGraph Locale

Every page SHALL include an `og:locale` meta tag set to `en_IN`.

#### Scenario: OG locale present

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** a `<meta property="og:locale" content="en_IN">` tag SHALL be present

### Requirement: OpenGraph Image Dimensions

The OG image meta tag SHALL include width and height attributes for complete social preview rendering.

#### Scenario: OG image dimensions present

- **GIVEN** any assembled page
- **WHEN** the page is shared on social media
- **THEN** `<meta property="og:image:width" content="512">` and `<meta property="og:image:height" content="512">` tags SHALL be present

### Requirement: Twitter Image Card

Every page SHALL include `twitter:image` and `twitter:image:alt` meta tags.

#### Scenario: Twitter image tags present

- **GIVEN** any assembled page
- **WHEN** the page is shared on Twitter/X
- **THEN** a `<meta name="twitter:image" content="/assets/img/OptiFlow.Logo.png">` tag SHALL be present
- **AND** a `<meta name="twitter:image:alt" content="OptiFlow OS Logo">` tag SHALL be present

### Requirement: BreadcrumbList Structured Data

Every page SHALL include BreadcrumbList JSON-LD structured data reflecting the page's position in the site hierarchy.

#### Scenario: BreadcrumbList present on sub-pages

- **GIVEN** an assembled page at `/features/`
- **WHEN** the page loads in a browser
- **THEN** a `<script type="application/ld+json">` block SHALL contain a `BreadcrumbList` schema
- **AND** the list SHALL include `{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://optiflow.in/" }`
- **AND** the list SHALL end with an item matching the current page name

### Requirement: Article Structured Data on Newsletter

The newsletter page SHALL include Article JSON-LD structured data.

#### Scenario: Article schema on newsletter page

- **GIVEN** the assembled newsletter page at `/newsletter/`
- **WHEN** the page loads in a browser
- **THEN** a `<script type="application/ld+json">` block SHALL contain an `Article` schema
- **AND** the Article SHALL include `headline`, `description`, `publisher` (Organization), and `datePublished` fields

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
