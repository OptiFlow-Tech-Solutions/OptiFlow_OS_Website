## ADDED Requirements

### Requirement: All 15 pages render real content
Every page in the SPA SHALL render the full content from its static HTML counterpart, using shared components (Section, Card, Button) for structure.

#### Scenario: Home page has hero and sections
- **WHEN** user navigates to `/os/`
- **THEN** home page displays hero heading, lead text, and at least 3 content sections

#### Scenario: Pricing page has plan cards
- **WHEN** user navigates to `/os/pricing`
- **THEN** pricing page displays plan cards with features, prices, and CTAs

#### Scenario: Contact page has form fields
- **WHEN** user navigates to `/os/contact`
- **THEN** contact page displays a form with name, email, phone, company, and message fields

#### Scenario: FAQ page has accordion items
- **WHEN** user navigates to `/os/faq`
- **THEN** FAQ page displays questions grouped by category

#### Scenario: All 15 pages have h1 and lead text
- **WHEN** user navigates to any valid route
- **THEN** page has an `<h1>` and a descriptive lead paragraph matching static HTML content

### Requirement: Pages use shared components exclusively
Pages SHALL NOT use raw `<section className="section">` tags — they SHALL use the `<Section>` component.

#### Scenario: No raw section tags in pages
- **WHEN** searching page source code
- **THEN** no page contains `<section className="section">` — all use `<Section>` component

### Requirement: Pages use Button component for CTAs
All CTA links in pages SHALL use the `<Button>` component instead of raw `<a>` or `<Link>` tags.

#### Scenario: CTA buttons use Button component
- **WHEN** viewing a page with CTAs
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
