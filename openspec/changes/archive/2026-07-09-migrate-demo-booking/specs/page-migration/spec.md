## MODIFIED Requirements

### Requirement: All 17 pages render complete content
Every page in the SPA SHALL render the full content from its static HTML counterpart, with Features (11 sections) and FeatureShowcase (6 sections) fully completed, using shared components (Section, Card, Button) for structure.

#### Scenario: Home page renders all 13 sections
- **WHEN** user navigates to `/os/`
- **THEN** all 13 sections are visible with identical text content, heading levels, and card counts as the static HTML

#### Scenario: Problem Solutions page renders all 10 sections
- **WHEN** user navigates to `/os/problem-solutions`
- **THEN** all 10 sections render with identical content to `problem-solutions.html`: hero, pain carousel (8 items, 3s rotation), chaos map, trust bar, 6 industry problem cards, WhatsApp mockup (7 messages), cost stats (3), solution flow, people-vs-process (7 rows), before-after (7 rows)

#### Scenario: Why OptiFlow page renders all 10 sections
- **WHEN** user navigates to `/os/why-optiflow`
- **THEN** all 10 sections render with identical content to `why-optiflow.html`: hero with typewriter (5 phrases) and mouse glow, 6 problem cards, 3 designer cards, adoption stats, 4-step timeline, 8 ROI counters, comparison table (5-col, 11-row), 3 testimonials, 4 trust elements, CTA

#### Scenario: Pricing page has plan cards
- **WHEN** user navigates to `/os/pricing`
- **THEN** pricing page displays plan cards with features, prices, and CTAs

#### Scenario: Contact page has form fields
- **WHEN** user navigates to `/os/contact`
- **THEN** contact page displays a form with name, email, phone, company, and message fields

#### Scenario: FAQ page has accordion items
- **WHEN** user navigates to `/os/faq`
- **THEN** FAQ page displays questions grouped by category

#### Scenario: All pages have h1 and lead text
- **WHEN** user navigates to any valid route
- **THEN** page has an `<h1>` and a descriptive lead paragraph matching static HTML content

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

#### Scenario: Demo booking page renders all 8 sections
- **WHEN** user navigates to `/os/demo-booking`
- **THEN** the page renders 8 sections matching `demo-booking.html`: hero with dashboard mockup, 6 benefit cards (why book), trust bar with 4 counters, 6-step timeline, 6 benefit cards (walk away), booking form (7 fields + honeypot), calendar widget (month nav, day grid, time slots, confirm), 8 FAQ accordion items, and final CTA

#### Scenario: Demo booking form validates and submits
- **WHEN** user fills the demo booking form with valid data, selects a date and time slot, and clicks confirm
- **THEN** the form submits to the API, a success state displays, and the booking is persisted to the database

#### Scenario: Demo booking calendar shows availability
- **WHEN** user selects a date on the demo booking calendar
- **THEN** available time slots are fetched from the API and displayed, excluding already-booked slots
