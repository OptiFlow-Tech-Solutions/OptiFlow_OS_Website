# Legal Pages

## Purpose

Define the structure, behavior, and accessibility of legal compliance pages (Privacy Policy and Terms & Conditions) on the OptiFlow OS website.

## ADDED Requirements

### Requirement: Privacy Policy Page

The system SHALL render a Privacy Policy page at `/privacy-policy/` with a hero section, sticky side navigation, and 8 content sections presented as bordered content cards.

#### Scenario: Page assembles correctly

- **GIVEN** the `src/pages/privacy-policy.html` source file
- **WHEN** `npm run build` is executed
- **THEN** `dist/privacy-policy/index.html` SHALL be generated
- **AND** the page SHALL contain a `<title>` matching the `site.json` entry
- **AND** the page SHALL contain the shared navigation and footer includes

#### Scenario: Hero section renders

- **GIVEN** the assembled privacy-policy page
- **WHEN** the page renders
- **THEN** a hero section SHALL display an "LEGAL & COMPLIANCE" eyebrow, the page title "Privacy Policy", a lead paragraph, and version/effective/updated metadata
- **AND** the hero SHALL have a centered layout with a radial gradient background effect

#### Scenario: Content sections render

- **GIVEN** the assembled privacy-policy page
- **WHEN** the page renders
- **THEN** 9 content sections SHALL be present: Introduction, Information Collection, Data Usage, Data Storage, Cookies, Third-Party Services, Your Rights, Security, Contact
- **AND** each section SHALL have a unique `id` attribute for side navigation linking
- **AND** each section SHALL contain an inline SVG icon in the heading

### Requirement: Side Navigation

Legal pages SHALL include a sticky side navigation that highlights the currently visible section based on scroll position.

#### Scenario: Side nav renders

- **GIVEN** the assembled privacy-policy or terms page
- **WHEN** the page renders
- **THEN** a `<aside class="side-nav">` element SHALL be present
- **AND** it SHALL contain links to all content sections on the page
- **AND** it SHALL have a "On this page" header in monospace uppercase

#### Scenario: Active section tracking

- **GIVEN** the side navigation is rendered
- **WHEN** the user scrolls to a content section
- **THEN** the corresponding side nav link SHALL have class `active`
- **AND** only one link SHALL be active at any time
- **AND** the active link SHALL use `--accent-soft` background

#### Scenario: Sticky positioning

- **GIVEN** the side navigation is rendered
- **WHEN** the page scrolls
- **THEN** the side nav SHALL remain visible at `top: calc(var(--nav-h) + 24px)`

#### Scenario: Hidden on tablet

- **GIVEN** the viewport is 1024px or narrower
- **WHEN** the page renders
- **THEN** the side nav SHALL be hidden via `display: none`

### Requirement: Reading Progress Bar

Legal pages SHALL display a fixed reading progress bar at the top of the viewport.

#### Scenario: Progress bar renders

- **GIVEN** the assembled privacy-policy or terms page
- **WHEN** the page renders
- **THEN** a `<div class="progress-bar">` SHALL be present with `position: fixed` and `z-index: 101`
- **AND** the bar SHALL have a gradient background from `--accent` to `--teal`

#### Scenario: Progress updates on scroll

- **GIVEN** the page is scrollable
- **WHEN** the user scrolls
- **THEN** the progress bar width SHALL be `(scrollTop / scrollableHeight) * 100` percent
- **AND** the scroll listener SHALL use `{passive: true}`

### Requirement: Content Cards

Legal page sections SHALL be rendered as content cards with border, background surface, and consistent internal spacing.

#### Scenario: Card styling

- **GIVEN** any content section on a legal page
- **WHEN** the page renders
- **THEN** the section SHALL have class `content-card` with background `var(--surface)`, border `var(--border)`, and border-radius `var(--radius-lg)`
- **AND** the heading SHALL have a bottom border separating it from the body text
- **AND** paragraph text SHALL use `line-height: 1.7`

#### Scenario: Info blocks within cards

- **GIVEN** a content card containing informational sub-sections
- **WHEN** the card renders
- **THEN** `.info-block` elements SHALL render with a subtle background and border
- **AND** each info block SHALL have a bold heading and muted body text

### Requirement: Cookie Classification Grid

The Privacy Policy page SHALL classify cookies used by the Platform in a 4-column grid of cards.

#### Scenario: Four cookie types displayed

- **GIVEN** the Cookies section of the privacy policy page
- **WHEN** the page renders
- **THEN** a `.cookie-grid` SHALL display exactly 4 `.cookie-card` items: Essential, Analytics, Performance, Preferences
- **AND** each card SHALL contain an SVG icon, heading, and description

### Requirement: User Rights Grid

The Privacy Policy page SHALL display 6 user data rights as a grid of cards.

#### Scenario: Six rights displayed

- **GIVEN** the Your Rights section of the privacy policy page
- **WHEN** the page renders
- **THEN** a `.rights-grid` SHALL display exactly 6 cards: Access your data, Correct or update, Request deletion, Export your data, Withdraw consent, Communication preferences
- **AND** each card SHALL have a green SVG icon (`--green`), heading, and description

### Requirement: Security Features Grid

The Privacy Policy page SHALL display 6 security features as a grid of cards.

#### Scenario: Six security features displayed

- **GIVEN** the Security section of the privacy policy page
- **WHEN** the page renders
- **THEN** a `.security-grid` SHALL display exactly 6 cards: Role-based access, Encryption, Audit logs, Monitoring, Regular backups, Access restrictions
- **AND** each card SHALL have an accent SVG icon (`--accent`), heading, and description

### Requirement: Contact Section

The Privacy Policy page SHALL include a contact section with email and contact form links for privacy-related inquiries.

#### Scenario: Contact methods displayed

- **GIVEN** the Contact section of the privacy policy page
- **WHEN** the page renders
- **THEN** a `.contact-card` grid SHALL display 3 `.contact-item` elements: Privacy email, Support email, Contact form
- **AND** email addresses SHALL use `{{EMAIL}}` placeholder resolved from `site.json`
- **AND** the contact form link SHALL point to `/contact/`

### Requirement: Company Data Placeholders

Legal pages SHALL use `{{PLACEHOLDER}}` variables for all company information, resolved at build time from `site.json`.

#### Scenario: No hardcoded company data

- **GIVEN** the privacy-policy and terms page source files
- **WHEN** inspected
- **THEN** no hardcoded phone numbers, email addresses, company names, or years SHALL be present
- **AND** all company data SHALL use `{{PHONE}}`, `{{EMAIL}}`, `{{COMPANY}}`, `{{YEAR}}`, `{{LOCATION}}`, etc.

### Requirement: Print Styles

Legal pages SHALL include print-specific CSS to produce clean printed output.

#### Scenario: Print hides interactive elements

- **GIVEN** the page is printed via `@media print`
- **WHEN** the print stylesheet applies
- **THEN** navigation, mobile drawer, hamburger, progress bar, side nav, footer, breadcrumbs, and skip link SHALL be hidden
- **AND** content cards SHALL render without borders or shadows
- **AND** links SHALL render in black with underline
- **AND** paragraph and list items SHALL enforce orphans:3 and widows:3

### Requirement: Dark Mode Support

Legal pages SHALL render correctly in both light and dark themes.

#### Scenario: Dark mode overrides

- **GIVEN** the page's `<style>` block
- **WHEN** inspected
- **THEN** `[data-theme="dark"]` rules SHALL exist for: `.content-card`, `.side-nav a`, `.info-block`, `.hero-section::before`, `.rights-grid .card`
- **AND** all color values in dark mode rules SHALL use `color-mix()`, `var()`, or CSS custom properties

### Requirement: Responsive Layout

Legal pages SHALL adapt layout across desktop, tablet, and mobile viewports.

#### Scenario: Tablet layout (≤1024px)

- **GIVEN** viewport is 1024px or narrower
- **WHEN** the page renders
- **THEN** the content layout SHALL collapse to single column
- **AND** the side nav SHALL be hidden
- **AND** cookie, rights, and security grids SHALL display 2 columns

#### Scenario: Mobile layout (≤768px)

- **GIVEN** viewport is 768px or narrower
- **WHEN** the page renders
- **THEN** content cards SHALL reduce padding to 28px
- **AND** cookie, rights, security grids SHALL collapse to single column
- **AND** data flow arrows SHALL rotate 90 degrees to vertical

#### Scenario: Small mobile (≤480px)

- **GIVEN** viewport is 480px or narrower
- **WHEN** the page renders
- **THEN** hero metadata SHALL stack vertically
- **AND** content cards SHALL reduce padding to 20px 16px
- **AND** headings SHALL reduce font size
- **AND** the sticky CTA SHALL expand to full width

### Requirement: Shared Component Compliance

Legal pages SHALL use the project's shared components and SHALL NOT duplicate shared logic.

#### Scenario: Uses shared form logic

- **GIVEN** the privacy-policy or terms page has a form (if applicable)
- **WHEN** the page-specific scripts are inspected
- **THEN** no duplicate `fetch()`, `XMLHttpRequest`, or form `onsubmit` handlers SHALL exist for form submission

#### Scenario: Uses shared scroll/animation logic

- **GIVEN** the privacy-policy page scripts
- **WHEN** inspected
- **THEN** no duplicate sticky CTA scroll listener SHALL be present (core.js handles it)
- **AND** scroll event listeners SHALL use `{passive: true}`
