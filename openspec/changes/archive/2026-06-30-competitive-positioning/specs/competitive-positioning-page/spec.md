## ADDED Requirements

### Requirement: Page Structure

The system SHALL render a Competitive Positioning page with 6 sections: Hero, Competitor Quadrant Grid, Feature Comparison Matrix, Cost Comparison, Trust/Why OptiFlow Stands Out, and CTA.

#### Scenario: All 6 sections render
- **WHEN** the page is assembled and rendered
- **THEN** the `<main>` tag SHALL contain exactly 6 `<section>` elements in order: Hero, Quadrant Grid, Feature Matrix, Cost Comparison, Why Stands Out, CTA

#### Scenario: Navigation and footer included
- **WHEN** the page renders
- **THEN** the `<header class="topnav">` navigation SHALL be present with Resources marked as active nav link
- **AND** the `<footer class="pagefoot">` SHALL be present

### Requirement: Competitor Quadrant Grid

The page SHALL display a 2x2 quadrant grid comparing OptiFlow OS against 4 competitor categories.

#### Scenario: 4 quadrants displayed
- **WHEN** the quadrant section renders
- **THEN** a `.quadrant-grid` SHALL contain exactly 4 `.quadrant-card` elements
- **AND** cards SHALL represent: WhatsApp & Excel Chaos, Generic SaaS Tools, Traditional ERPs, Manual Paper Systems
- **AND** each card SHALL include: category name, 3 key weaknesses, and an "OptiFlow advantage" line

#### Scenario: OptiFlow OS center node
- **WHEN** the quadrant grid renders
- **THEN** a center `.quadrant-center` element SHALL display "OptiFlow OS" with "All 4 solved in one platform" subtitle
- **AND** the center node SHALL use accent gradient styling

#### Scenario: Dark mode quadrant cards
- **WHEN** `[data-theme="dark"]` is active
- **THEN** quadrant cards SHALL use `var(--surface)` background with `var(--border)` border
- **AND** advantage text SHALL use `var(--teal)` color

### Requirement: Feature Comparison Matrix

The page SHALL include a responsive feature comparison table with OptiFlow OS and 4 competitor categories as columns.

#### Scenario: Feature matrix structure
- **WHEN** the feature matrix section renders
- **THEN** a `.comparison-table` SHALL have 5 columns: Feature, OptiFlow OS, WhatsApp/Excel, Generic SaaS, Traditional ERP
- **AND** the table SHALL include at least 10 feature rows covering: task management, attendance, SOPs, real-time dashboards, mobile access, checklists, reports, multi-location, role-based access, and pricing model
- **AND** OptiFlow OS column SHALL use check icons (`.check`) and competitor columns SHALL use cross icons (`.cross`) as appropriate

#### Scenario: Responsive scroll behavior
- **WHEN** viewport width is less than 768px
- **THEN** the comparison table SHALL be horizontally scrollable via `overflow-x: auto`
- **AND** the first column (Feature) SHALL remain sticky-left

### Requirement: Cost Comparison Section

The page SHALL display a cost comparison contrasting OptiFlow's flat annual pricing against per-user pricing models.

#### Scenario: Cost comparison cards
- **WHEN** the cost section renders
- **THEN** the section SHALL display 4 `.cost-card` elements comparing: OptiFlow OS (flat annual), WhatsApp/Excel (hidden costs), Generic SaaS (per-user/per-month), and Traditional ERP (implementation + license)
- **AND** each card SHALL show an annual cost estimate range in ₹
- **AND** OptiFlow OS card SHALL use `.card` with green border accent
- **AND** competitor cards SHALL use muted styling

#### Scenario: Dark mode cost cards
- **WHEN** `[data-theme="dark"]` is active
- **THEN** cost cards SHALL use appropriate dark background and maintain readable ₹ figures

### Requirement: Why OptiFlow Stands Out Section

The page SHALL include a trust-building section highlighting OptiFlow's unique advantages over competitors.

#### Scenario: Stand-out cards render
- **WHEN** the stand-out section renders
- **THEN** a `.grid-3` SHALL contain 3 `.card` elements with: "Built for Indian MSMEs", "Flat Pricing — No Per-User Tax", and "Implementation + Support Included"
- **AND** each card SHALL include an icon, heading, and description paragraph

### Requirement: SEO Metadata

The page SHALL use build-time placeholders for SEO metadata resolved from `site.json`.

#### Scenario: Title and description placeholders
- **WHEN** the page source file is inspected
- **THEN** the `<title>` tag SHALL contain `{{PAGE_TITLE}}`
- **AND** `<meta name="description">` SHALL contain `{{PAGE_DESCRIPTION}}`
- **AND** no hardcoded title or description SHALL be present

### Requirement: Dark Mode Support

All page-specific components SHALL have complete `[data-theme="dark"]` style overrides.

#### Scenario: Dark mode overrides exist
- **WHEN** the page's `<style>` block is inspected
- **THEN** `[data-theme="dark"]` rules SHALL exist for: `.quadrant-card`, `.quadrant-center`, `.cost-card`, `.cost-card.best`, `.comparison-table th`, `.comparison-table td`, `.standout-card` icon backgrounds
- **AND** all dark mode color values SHALL use `var()`, `color-mix()`, or CSS custom properties
- **AND** no raw hex values SHALL appear in dark mode rules

### Requirement: Cross-Links from Existing Pages

The Why OptiFlow and Pricing pages SHALL include cross-links to the Competitive Positioning page.

#### Scenario: Why OptiFlow CTA links
- **WHEN** the Why OptiFlow page renders
- **THEN** the CTA section SHALL include a secondary link "Compare OptiFlow vs alternatives" pointing to `/competitive-positioning/`

#### Scenario: Pricing page cross-link
- **WHEN** the Pricing page renders
- **THEN** the cost comparison section SHALL include a link "See full competitive comparison" pointing to `/competitive-positioning/`

### Requirement: Performance Standards

Page-specific scroll listeners SHALL use `{passive: true}`. No mousemove listeners SHALL be used. Animations SHALL pause when the page is hidden.

#### Scenario: Scroll listeners are passive
- **WHEN** any page-specific scroll listener is registered
- **THEN** the options object SHALL include `{passive: true}`
