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

Each page SHALL have a unique `<title>`, `<meta name="description">`, OpenGraph tags, and canonical URL. All SEO metadata in page source files SHALL use build-time placeholders that resolve from `site.json`.

#### Scenario: Title uses placeholder

- **GIVEN** any page source file in `src/pages/`
- **WHEN** the file is inspected
- **THEN** the `<title>` tag SHALL contain `{{PAGE_TITLE}}` as its content
- **AND** the title SHALL NOT be hardcoded in the source file

#### Scenario: Description uses placeholder

- **GIVEN** any page source file in `src/pages/`
- **WHEN** the file is inspected
- **THEN** the `<meta name="description">` tag SHALL use `{{PAGE_DESCRIPTION}}` as its content attribute
- **AND** the `<meta property="og:description">` tag SHALL use `{{PAGE_DESCRIPTION}}` as its content attribute
- **AND** the description SHALL NOT be hardcoded in the source file

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

### Requirement: Source File Naming

Source page files SHALL be named to match their purpose. The newsletter page source SHALL be `newsletter.html` (not `blog.html`).

#### Scenario: Newsletter source file

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `newsletter.html` SHALL exist
- **AND** `blog.html` SHALL NOT exist

#### Scenario: Build mapping for newsletter

- **GIVEN** the SRC_MAP in `assemble.mjs`
- **WHEN** the newsletter entry is inspected
- **THEN** it SHALL map `newsletter/index.html` → `newsletter.html`

### Requirement: Page Structure

The system SHALL maintain a consistent page structure on every page.

#### Scenario: Structural ordering

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** the content SHALL follow the order: navigation (`<header>`) → main content (`<main>`) → footer (`<footer>`)
- **AND** a skip-to-content link SHALL precede the navigation
- **AND** the main content area SHALL have `id="content"`

### Requirement: Shared Logic Deduplication

Page-specific scripts SHALL NOT duplicate logic already handled by `core.js`. Sticky CTA visibility, scroll-to-top, scroll reveal, stagger animation, FAQ accordion, and counter animation SHALL be handled exclusively by core.js.

#### Scenario: No duplicate sticky CTA

- **GIVEN** the home, pricing, privacy-policy, and terms pages
- **WHEN** page-specific scripts are inspected
- **THEN** no sticky CTA scroll listener SHALL be present (core.js handles it)

#### Scenario: No duplicate scroll-to-top

- **GIVEN** the home and pricing pages
- **WHEN** page-specific scripts are inspected
- **THEN** no scroll-to-top scroll listener SHALL be present (core.js handles it)

#### Scenario: No duplicate reveal or stagger

- **GIVEN** the product-overview and newsletter pages
- **WHEN** page-specific scripts are inspected
- **THEN** no reveal or stagger IntersectionObserver SHALL be present (core.js handles it)

### Requirement: Performance Standards

All page-specific scroll listeners SHALL use `{passive: true}`. Mousemove listeners SHALL be throttled via `requestAnimationFrame`. Animations SHALL pause when the page is hidden.

#### Scenario: Scroll listeners are passive

- **GIVEN** any page-specific scroll listener
- **WHEN** the listener is registered
- **THEN** the options object SHALL include `{passive: true}`

#### Scenario: Mousemove listeners are throttled

- **GIVEN** mousemove listeners on home or why-optiflow pages
- **WHEN** the mouse moves rapidly
- **THEN** the callback SHALL fire at most once per animation frame
