# Marketing Pages

## Purpose

Define the structure, metadata, and behavior of all 12 marketing pages that comprise the OptiFlow OS public website.

## Requirements

### Requirement: Page Inventory

The system SHALL render exactly 12 marketing pages as defined in the `site.json` pages array.

#### Scenario: All pages present

- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Why-OptiFlow, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, and Terms
- **WHEN** `npm run build` is executed
- **THEN** all 12 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated

### Requirement: Unique Metadata

Each page SHALL have a unique `<title>`, `<meta name="description">`, OpenGraph tags, and canonical URL.

#### Scenario: Title and description

- **GIVEN** a page entry in `site.json` with `title` and `description` fields
- **WHEN** the page is assembled
- **THEN** the `<title>` tag SHALL match the page's `title` value
- **AND** the `<meta name="description">` SHALL match the page's `description` value (120-160 characters)

#### Scenario: OpenGraph tags

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** it SHALL contain `og:title` and `og:description` meta tags
- **AND** it SHALL contain `og:image` pointing to the OptiFlow logo
- **AND** it SHALL contain `og:type` set to "website"

#### Scenario: Twitter card

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** it SHALL contain a `<meta name="twitter:card" content="summary">` tag

### Requirement: Sticky Navigation

Each page SHALL include a sticky navigation bar with glass effect.

#### Scenario: Navigation bar present

- **GIVEN** any assembled page
- **WHEN** the page renders
- **THEN** a fixed-position `<header class="topnav">` SHALL be present
- **AND** it SHALL contain the OptiFlow logo, desktop nav links, theme toggle, and CTA buttons
- **AND** the nav SHALL acquire a glass blur background on scroll past 20px

### Requirement: Shared Footer

Each page SHALL include a shared footer with company info, product links, and contact details.

#### Scenario: Footer present

- **GIVEN** any assembled page
- **WHEN** the page renders
- **THEN** a `<footer class="pagefoot">` SHALL be present
- **AND** it SHALL contain branded columns (Product, Solutions, Resources, Contact)
- **AND** it SHALL display company info: phone, email, and location from `site.json`

### Requirement: Scroll-Reveal Animations

Each page SHALL use scroll-reveal animations for content sections.

#### Scenario: Reveal on scroll

- **GIVEN** page sections marked with `.reveal` class
- **WHEN** a section scrolls into the viewport
- **THEN** it SHALL transition from translateY(28px) and opacity 0 to visible state
- **AND** staggered children SHALL animate sequentially via `--delay` values

### Requirement: Page Structure

The system SHALL maintain a consistent page structure on every page.

#### Scenario: Structural ordering

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** the content SHALL follow the order: navigation (`<header>`) → main content (`<main>`) → footer (`<footer>`)
- **AND** a skip-to-content link SHALL precede the navigation
