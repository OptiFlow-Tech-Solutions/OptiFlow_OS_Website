# shared-components

## Purpose

Reusable React components (Button, Card, Section, SEOHead) providing design system consistency across all pages with variant support and unit tests.

## Requirements

### Requirement: Button component
The system SHALL provide a Button component with `primary`, `secondary`, and `outline` variants, supporting `as` prop for rendering as `<Link>` or `<button>`.

#### Scenario: Primary button renders
- **WHEN** `<Button variant="primary">Click</Button>` is rendered
- **THEN** a button with accent background, white text, and hover glow effect is displayed

#### Scenario: Secondary button renders
- **WHEN** `<Button variant="secondary">Cancel</Button>` is rendered
- **THEN** a button with surface background and border is displayed

#### Scenario: Outline button renders
- **WHEN** `<Button variant="outline">Learn More</Button>` is rendered
- **THEN** a button with transparent background and accent border is displayed

#### Scenario: Button as Link
- **WHEN** `<Button as={Link} to="/os/pricing">View Pricing</Button>` is rendered
- **THEN** a link styled as a button navigates to `/os/pricing`

#### Scenario: Button with icon
- **WHEN** `<Button icon={<Arrow />}>Next</Button>` is rendered
- **THEN** the icon appears next to the button text

### Requirement: Card component
The system SHALL provide a Card component with optional hover elevation and configurable padding.

#### Scenario: Default card renders
- **WHEN** `<Card><p>Content</p></Card>` is rendered
- **THEN** content is displayed with surface background, border, border-radius, and card shadow

#### Scenario: Card with hover effect
- **WHEN** `<Card hover>Content</Card>` is rendered
- **THEN** card elevates on hover with increased shadow

#### Scenario: Card with custom padding
- **WHEN** `<Card padding="lg">Content</Card>` is rendered
- **THEN** card uses `var(--gap-lg)` padding

### Requirement: Section component
The system SHALL provide a Section component with optional background, header block, and container width.

#### Scenario: Default section renders
- **WHEN** `<Section><p>Content</p></Section>` is rendered
- **THEN** content is wrapped in `<section>` with vertical padding and max-width container

#### Scenario: Section with header
- **WHEN** `<Section heading="Features" lead="What we offer">Content</Section>` is rendered
- **THEN** a section-header div with h1 and lead paragraph appears above the content

#### Scenario: Section with background
- **WHEN** `<Section background="surface">Content</Section>` is rendered
- **THEN** section has `var(--color-surface)` as background

#### Scenario: Section with narrow container
- **WHEN** `<Section width="narrow">Content</Section>` is rendered
- **THEN** inner container is narrower than default (800px vs 1200px)

### Requirement: SEOHead component
The system SHALL provide an SEOHead component that renders `<title>`, `<meta>`, and Open Graph tags in the document `<head>` using `react-helmet-async` or equivalent.

#### Scenario: Title and description set
- **WHEN** `<SEOHead title="Pricing" description="OptiFlow pricing plans" />` is rendered
- **THEN** document title is "Pricing | OptiFlow Tech Solutions" and meta description matches

#### Scenario: Open Graph tags set
- **WHEN** SEOHead renders with title and description
- **THEN** `og:title`, `og:description`, and `og:url` meta tags are present in `<head>`

#### Scenario: Canonical URL set
- **WHEN** SEOHead renders with a page path
- **THEN** a `<link rel="canonical">` tag points to the full `/os/...` URL

### Requirement: Components have unit tests
Every shared component SHALL have a corresponding `.test.jsx` file with at least one test per variant.

#### Scenario: Button test passes
- **WHEN** `npm run test` is executed
- **THEN** Button primary, secondary, and outline variants all have passing tests

#### Scenario: Card test passes
- **WHEN** `npm run test` is executed
- **THEN** Card default and hover variants have passing tests

### Requirement: All pages use shared Section component
All 17 page components SHALL use the `<Section>` component for page sections. No page SHALL use raw `<section className="section">` tags.

#### Scenario: FAQ page uses Section component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all sections use `<Section>` instead of raw `<section className="section">`

#### Scenario: Contact page uses Section component
- **WHEN** inspecting Contact.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

### Requirement: All pages use shared Card component
All 17 page components SHALL use the `<Card>` component for card-style content blocks. No page SHALL use raw `<div className="card">` tags.

#### Scenario: FAQ page uses Card component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all card elements use `<Card>` instead of raw `<div className="card">`

### Requirement: All pages use shared Button component
All CTA links in every page SHALL use the `<Button>` component with `as={Link}` prop instead of raw `<a>` or `<Link>` tags with CSS classes.

#### Scenario: About page CTAs use Button component
- **WHEN** inspecting About.jsx source
- **THEN** all CTA elements use `<Button as={Link} to="...">` pattern

#### Scenario: FAQ page CTAs use Button component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all CTA elements use `<Button>` component
