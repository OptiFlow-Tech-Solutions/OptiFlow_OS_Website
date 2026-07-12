## ADDED Requirements

### Requirement: All 17 pages render complete content
Every page in the SPA SHALL render the full content from its static HTML counterpart, with Features (11 sections) and FeatureShowcase (6 sections) fully completed.

#### Scenario: Features page has no placeholder sections
- **WHEN** user navigates to `/os/features`
- **THEN** all 11 feature sections display real content matching the old `features.html` source

#### Scenario: FeatureShowcase page has no placeholder sections
- **WHEN** user navigates to `/os/feature-showcase`
- **THEN** all 6 transformation sections display real content matching the old `feature-showcase.html` source

#### Scenario: CompetitivePositioning page is accessible
- **WHEN** user navigates to `/os/competitive-positioning`
- **THEN** the page renders with hero, competitive quadrant, feature matrix, cost comparison, and CTA

#### Scenario: ServerError page is accessible
- **WHEN** user navigates to `/os/server-error`
- **THEN** the page renders with error code, lead text, suggested links, and contact info

## MODIFIED Requirements

### Requirement: Pages use shared components exclusively
Pages SHALL NOT use raw `<section className="section">` tags — they SHALL use the `<Section>` component. This now applies to all 17 pages.

#### Scenario: No raw section tags in any page
- **WHEN** searching all page source code
- **THEN** no page contains `<section className="section">` — all use `<Section>` component

### Requirement: Pages use Button component for CTAs
All CTA links in all pages SHALL use the `<Button>` component instead of raw `<a>` or `<Link>` tags.

#### Scenario: All CTA buttons use Button component
- **WHEN** viewing any page with CTAs
- **THEN** all CTA elements use `<Button as={Link} to="...">` pattern
