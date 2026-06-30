# Feature Showcase Page

## Purpose

Define the structure, content, and behavior of the Feature Showcase page — a curated visual gallery that demonstrates 6 core OptiFlow OS features through before/after transformation stories.

## ADDED Requirements

### Requirement: Feature Showcase Page Renders

The system SHALL render a Feature Showcase page at `/feature-showcase/` with 6 curated feature sections, each showing a Problem → Fix → Outcome transformation.

#### Scenario: Page source exists

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `feature-showcase.html` SHALL exist with `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`

#### Scenario: Build output

- **GIVEN** `site.json` contains an entry for `feature-showcase/index.html`
- **WHEN** `npm run build` is executed
- **THEN** `dist/feature-showcase/index.html` SHALL be generated

### Requirement: Showcase Sections

The page SHALL contain exactly 6 feature showcase sections, each labeled with a `data-screen-label` attribute.

#### Scenario: Six feature sections

- **GIVEN** the assembled Feature Showcase page
- **WHEN** the page renders
- **THEN** exactly 6 `<section class="feature-section">` elements SHALL be present for: Task Management, Attendance, SOPs, Reports, Checklists, and Leave Management
- **AND** each section SHALL have a `data-screen-label` attribute (e.g., "01 Task Management", "02 Attendance", etc.)
- **AND** a Hero section SHALL precede the feature sections with `data-screen-label="00 Hero"`

### Requirement: Problem → Fix → Outcome Flow

Each feature showcase section SHALL follow a Problem → Fix → Outcome narrative structure.

#### Scenario: Problem card present

- **GIVEN** any feature showcase section
- **WHEN** the page renders
- **THEN** a `.showcase-problem` element SHALL describe a real operational problem with quantified impact

#### Scenario: Solution cards

- **GIVEN** any feature showcase section
- **WHEN** the page renders
- **THEN** 2-3 `.card` elements SHALL describe how OptiFlow solves that problem

#### Scenario: Outcome metrics

- **GIVEN** any feature showcase section
- **WHEN** the page renders
- **THEN** 3 `.showcase-metric` stat cards SHALL display quantified outcomes (e.g., completion rate, time saved, cost reduction)

### Requirement: Dual-Device Visuals

Each feature showcase section SHALL include a visual comparison showing desktop and mobile views of the feature in action.

#### Scenario: Desktop and mobile mockups

- **GIVEN** any feature showcase section
- **WHEN** the page renders
- **THEN** a `.dashboard-preview` element SHALL represent the desktop view
- **AND** a `.phone-frame` element SHALL represent the mobile view
- **AND** both SHALL be visible side by side within a `.showcase-visual` container

### Requirement: Sticky Sub-Navigation

The page SHALL include a sticky feature sub-navigation bar below the main nav that highlights the currently visible section.

#### Scenario: Sub-nav present

- **GIVEN** the assembled Feature Showcase page
- **WHEN** the page renders
- **THEN** a `.feature-nav` element SHALL be present with 6 `.feature-tab` buttons
- **AND** the active tab SHALL update via IntersectionObserver as sections scroll into view

#### Scenario: Stuck state

- **GIVEN** the page has scrolled past the sub-nav's initial position
- **WHEN** the sub-nav intersects the viewport boundary
- **THEN** the `.stuck` class SHALL be applied for shadow effect

### Requirement: Feature Showcase Metadata

The page SHALL use build-time placeholders for SEO metadata that resolve from `site.json`.

#### Scenario: Placeholders used

- **GIVEN** the page source file `src/pages/feature-showcase.html`
- **WHEN** inspected
- **THEN** `<title>` SHALL contain `{{PAGE_TITLE}}`
- **AND** `<meta name="description">` SHALL contain `{{PAGE_DESCRIPTION}}`

#### Scenario: OG and Twitter tags

- **GIVEN** the assembled page
- **WHEN** rendered
- **THEN** `og:image`, `og:type`, and `twitter:card` meta tags SHALL be present

### Requirement: Full Dark Mode Support

All page-specific components SHALL have complete `[data-theme="dark"]` style overrides.

#### Scenario: Dark mode overrides

- **GIVEN** the page's `<style>` block
- **WHEN** `<html data-theme="dark">` is active
- **THEN** dark overrides SHALL exist for at minimum: `.showcase-problem`, `.showcase-metric`, `.feature-nav`, `.showcase-visual`, `.dashboard-preview`, `.phone-frame`, `.card`, and `.showcase-cta`

### Requirement: No Duplicated Core Logic

Page-specific scripts SHALL NOT duplicate reveal, stagger, sticky-cta, or scroll-to-top logic already handled by `core.js`.

#### Scenario: Only sub-nav logic is page-specific

- **GIVEN** the page's `<script>` block
- **WHEN** inspected
- **THEN** it SHALL contain only `IntersectionObserver` logic for the feature sub-navigation
- **AND** it SHALL NOT contain scroll-reveal, stagger, sticky-CTA, or scroll-to-top observers
