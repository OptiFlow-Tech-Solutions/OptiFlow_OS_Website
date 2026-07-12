# page-migration

## Purpose

Port all site pages to React JSX components using shared components (Section, Card, Button, SEOHead) while preserving content fidelity. Now covering all 17 pages including About, CompetitivePositioning, and ServerError.

## Requirements

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

#### Scenario: FAQ page renders all sections
- **WHEN** user navigates to `/os/faq`
- **THEN** all FAQ sections are visible: hero with search bar, 4 help cards, category tabs (All/Product/Pricing/Security/Implementation), 42 FAQ items across 4 categories in accordion format, troubleshooting wizard (5 categories, 15 resolution paths), 4 escalation cards, micro-CTAs, and final CTA

#### Scenario: FAQ page uses shared components
- **WHEN** user navigates to `/os/faq`
- **THEN** all sections use `<Section>` instead of raw section tags, all cards use `<Card>`, all CTAs use `<Button as={Link}>`, and FAQ items use `<FAQAccordion>`

#### Scenario: FAQ page preserves original content
- **WHEN** comparing React FAQ page with static `faq.html`
- **THEN** all 42 FAQ questions and answers match the original content; all 4 category names and counts match; all 6 search suggestion chips match; all 15 troubleshooting paths match; all 4 escalation cards match

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

### Requirement: Home page has hero and sections
The home page SHALL render all 13 content sections (Hero, Trust Bar, The Problem, Cost of Inaction, Solution, Product Snapshot, How It Works, Features, Industries, Why OptiFlow Comparison, Testimonials, Final CTA, FAQ Preview) with content, layout, and animations matching the static `home.html` source.

#### Scenario: Home page typewriter cycles 5 phrases
- **WHEN** user views the hero section
- **THEN** the typewriter animation cycles through all 5 phrases with matching timing (60ms type, 30ms delete, 2200ms hold)

#### Scenario: Home page mouse glow follows cursor
- **WHEN** user moves the mouse over the hero section
- **THEN** a radial gradient glow follows the cursor position using rAF-throttled updates

#### Scenario: Home page card tilt works
- **WHEN** user hovers over impact cards in the Cost of Inaction section
- **THEN** cards tilt up to 12 degrees on X/Y axes based on mouse position

#### Scenario: Home page exit overlay triggers
- **WHEN** user scrolls past 400px and moves mouse above the viewport
- **THEN** the exit-intent popup displays with demo booking CTA

#### Scenario: Home page FAQ accordion opens/closes
- **WHEN** user clicks a FAQ question
- **THEN** the answer expands and the icon rotates; clicking again closes it

#### Scenario: Home page scroll reveal animations fire
- **WHEN** sections scroll into the viewport
- **THEN** elements with `.reveal` class fade in with stagger delays matching the original

#### Scenario: Home page comparison table renders
- **WHEN** user views the Why OptiFlow section
- **THEN** a 9-row comparison table displays with green check marks in the OptiFlow column

### Requirement: Pages use shared components exclusively
Pages SHALL NOT use raw `<section className="section">` tags — they SHALL use the `<Section>` component. This applies to all 17 pages.

#### Scenario: No raw section tags in any page
- **WHEN** searching all page source code
- **THEN** no page contains `<section className="section">` — all use `<Section>` component

### Requirement: Pages use Button component for CTAs
All CTA links in all pages SHALL use the `<Button>` component instead of raw `<a>` or `<Link>` tags.

#### Scenario: All CTA buttons use Button component
- **WHEN** viewing any page with CTAs
- **THEN** all CTA elements use `<Button as={Link} to="...">` pattern

### Requirement: Pages include SEOHead
Every page SHALL render an `<SEOHead>` component with at minimum `title` and `description` props.

#### Scenario: Each page has unique title
- **WHEN** navigating between pages
- **THEN** the document title updates to reflect the current page

### Requirement: Page content matches static HTML
The text content, headings, and structure of each page SHALL match the corresponding static HTML page in `src/pages/`.

#### Scenario: Landing page heading matches
- **WHEN** comparing React Home page h1 with static home.html h1
- **THEN** the text content is identical

#### Scenario: No content is added or removed
- **WHEN** comparing any React page with its static counterpart
- **THEN** all headings, paragraphs, and list items from the static page are present in the React page

### Requirement: Every React page passes visual quality gate
Every React page SHALL pass a visual quality gate before being considered production-ready: no layout breakage, colors match DESIGN.md, typography is consistent, spacing matches the original HTML, and the page renders without console errors.

#### Scenario: Visual quality gate checklist
- **WHEN** a page is verified against the quality gate
- **THEN** it passes checks for: layout accuracy, color consistency, typography consistency, spacing alignment, responsive behavior at 4 breakpoints, zero console errors, and functional verification of all interactive elements

#### Scenario: Page is better than original HTML
- **WHEN** comparing the React page with its HTML original
- **THEN** the React version matches or exceeds the original in visual polish, spacing, readability, and component hierarchy

### Requirement: All pages verified responsive
Every React page SHALL be verified at 320px, 480px, 768px, 1024px, 1200px, and 1440px viewport widths with no horizontal overflow, broken grids, or misaligned elements.

#### Scenario: Responsive verification on all pages
- **WHEN** responsive audit runs against all 15 pages
- **THEN** every page has zero horizontal overflow, correct grid collapse, and readable typography at every breakpoint

### Requirement: No console errors on any page
All 15 React pages SHALL render without producing console errors, React key warnings, or deprecation notices during navigation and interaction.

#### Scenario: Zero errors in browser console
- **WHEN** navigating through all 15 pages and interacting with all interactive elements
- **THEN** the browser console contains zero errors and zero React warnings

### Requirement: Visual regression tests exist
The test suite SHALL include at minimum one visual regression test per page comparing the React output against a known-good baseline.

#### Scenario: Home page visual regression test passes
- **WHEN** `npm run test:e2e` includes visual regression
- **THEN** a Playwright screenshot comparison for the Home page passes against the approved baseline

### Requirement: 500 error page route added
The system SHALL add a `/500` route in `routes.ts` pointing to a new `ServerError.tsx` page component, and the `App.tsx` root SHALL wrap its content in a React error boundary that navigates to `/500` on unhandled render errors.

#### Scenario: 500 page renders on server error
- **WHEN** an unhandled React error occurs during rendering
- **THEN** the user sees a 500 error page with error code "500", a descriptive heading, a lead paragraph explaining the issue, navigation links to Home and Contact, and company contact information

#### Scenario: 500 page content matches static 500.html
- **WHEN** comparing React 500 page with static `500.html`
- **THEN** the error code, heading text, lead text, suggested links, and contact info match the static source

#### Scenario: 500 page is not the 404 catch-all
- **WHEN** the 500 error page renders
- **THEN** the browser title is "Server Error — OptiFlow OS" not "Page Not Found — OptiFlow OS"

### Requirement: ArticleDetail page is additive not regressive
The system SHALL preserve the ArticleDetail page at `/newsletter/:slug` as an additive feature beyond static parity. It SHALL NOT be removed or altered to match static behavior since the static site has no equivalent.

#### Scenario: ArticleDetail route is preserved
- **WHEN** the route configuration is complete
- **THEN** `/newsletter/:slug` remains in routes.ts as a lazy-loaded route
