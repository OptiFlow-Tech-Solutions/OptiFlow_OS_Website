# Marketing Pages

## Purpose

Define the structure, metadata, and behavior of all 13 marketing pages that comprise the OptiFlow OS public website.
## Requirements
### Requirement: Page Inventory
The system SHALL render exactly 14 marketing pages as defined in the `site.json` pages array. The FAQ page SHALL now include interactive self-service components beyond its original static Q&A format.

#### Scenario: All pages present
- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Feature-Showcase, Why-OptiFlow, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, Terms, and Competitive-Positioning
- **WHEN** `npm run build` is executed
- **THEN** all 14 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated
- **AND** the FAQ page SHALL include self-service toolbar, feedback buttons, troubleshooting widget, and escalation section

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

Source page files SHALL be named to match their purpose. The newsletter page source SHALL be `newsletter.html` (not `blog.html`). The feature showcase page source SHALL be `feature-showcase.html`.

#### Scenario: Feature Showcase source file

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `feature-showcase.html` SHALL exist

#### Scenario: Newsletter source file

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `newsletter.html` SHALL exist
- **AND** `blog.html` SHALL NOT exist

#### Scenario: Build mapping for newsletter

- **GIVEN** the SRC_MAP in `assemble.mjs`
- **WHEN** the newsletter entry is inspected
- **THEN** it SHALL map `newsletter/index.html` → `newsletter.html`

#### Scenario: Build mapping for feature showcase

- **GIVEN** the SRC_MAP in `assemble.mjs`
- **WHEN** the feature showcase entry is inspected
- **THEN** it SHALL map `feature-showcase/index.html` → `feature-showcase.html`

### Requirement: Page Structure

The system SHALL maintain a consistent page structure on every page.

#### Scenario: Structural ordering

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** the content SHALL follow the order: navigation (`<header>`) → main content (`<main>`) → footer (`<footer>`)
- **AND** a skip-to-content link SHALL precede the navigation
- **AND** the main content area SHALL have `id="content"`

### Requirement: Shared Logic Deduplication

Page-specific scripts SHALL NOT duplicate logic already handled by `core.js`. Sticky CTA visibility, scroll-to-top, scroll reveal, stagger animation, FAQ accordion, and counter animation SHALL be handled exclusively by core.js. Page-specific CSS SHALL NOT redefine stagger animation keyframes or transition rules already provided by core.css `.stagger-3`/`.stagger-4`/`.stagger-5` utility classes.

#### Scenario: No duplicate stagger CSS in newsletter page

- **GIVEN** the newsletter page source at `src/pages/newsletter.html`
- **WHEN** the `<style>` block is inspected
- **THEN** no `.stagger > *` or `.stagger.visible > *:nth-child()` animation rules SHALL be present
- **AND** all stagger animations SHALL use core.css `.stagger-N` utility classes

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

### Requirement: Problem & Solutions Narrative Page

The system SHALL render a Problem & Solutions page with a complete narrative flow: problem diagnosis → cost quantification → solution introduction → transformation proof.

#### Scenario: All 10 sections render

- **GIVEN** the `src/pages/problem-solutions.html` source file
- **WHEN** `npm run build` assembles the page
- **THEN** `dist/problem-solutions/index.html` SHALL contain exactly 10 `<section>` elements labeled via `data-screen-label` attributes: 01 Hero, 02 Pain Points, 02B Chaos Map, 03 Trust, 04 Why Growth Feels Hard, 05 WhatsApp & Excel, 06 The Cost of Doing Nothing, 07 The Solution, 08 People vs Process, 09 Before & After, 10 CTA

#### Scenario: Navigation and footer included

- **GIVEN** the assembled problem-solutions page
- **WHEN** the page renders
- **THEN** the `<header class="topnav">` navigation SHALL be present with Solutions marked as the active nav link
- **AND** the `<footer class="pagefoot">` SHALL be present with company info, product links, and contact details

#### Scenario: SEO metadata from site.json

- **GIVEN** the `site.json` entry for `problem-solutions/index.html` with `title` and `description` fields
- **WHEN** the page is assembled
- **THEN** `<title>` SHALL match the entry's title value
- **AND** `<meta name="description">` SHALL match the entry's description value

### Requirement: Pain-Point Rotator

The page SHALL include an auto-cycling carousel of pain-point statements that rotates every 3 seconds and pauses when the page is hidden.

#### Scenario: Carousel cycles on timer

- **GIVEN** the pain-points section with 8 `.pp-item` elements
- **WHEN** the page loads
- **THEN** exactly one `.pp-item` SHALL have class `active` at any time
- **AND** the active item SHALL cycle to the next every `3000ms`

#### Scenario: Pauses when page hidden

- **GIVEN** the pain-point rotator interval is running
- **WHEN** the browser tab is hidden (`visibilitychange` event fires with `document.hidden === true`)
- **THEN** the rotator SHALL skip the current cycle (no class change occurs)
- **AND** when the tab becomes visible again, the rotator SHALL resume normally

#### Scenario: Reduced motion disables carousel

- **GIVEN** the user has `prefers-reduced-motion: reduce`
- **WHEN** the pain-points section renders
- **THEN** all `.pp-item` elements SHALL be visible (opacity 1, no animation)
- **AND** only the element with class `active` SHALL be displayed; others SHALL have `display: none`

### Requirement: Operational Chaos Map

The page SHALL include a visual flow diagram showing operational chaos sources funneling into OptiFlow OS as the single source of truth.

#### Scenario: Chaos map renders 6 sources

- **GIVEN** the chaos map section (data-screen-label="02B Chaos Map")
- **WHEN** the page renders
- **THEN** the `.chaos-sources` grid SHALL contain exactly 6 `.chaos-src` items: WhatsApp, Excel Sheets, Phone Calls, Manual Registers, Verbal Instructions, Sticky Notes
- **AND** each source SHALL animate with the `floatChaos` keyframe

#### Scenario: Chaos resolves to OptiFlow OS

- **GIVEN** the chaos map flow
- **WHEN** the page renders
- **THEN** the flow SHALL visually connect sources → CHAOS state → OptiFlow OS node
- **AND** the resolve tag SHALL display "OptiFlow OS" with subtitle "Single Source of Truth"

### Requirement: Industry-Specific Problem Cards

The page SHALL display 6 problem scenario cards across textile, manufacturing, trading, and logistics verticals with quantified ₹ impact.

#### Scenario: Cards cover 4 industries

- **GIVEN** the section labeled "04 Why Growth Feels Hard"
- **WHEN** the page renders
- **THEN** the `.grid-3` SHALL contain exactly 6 `.card` elements
- **AND** cards SHALL cover Textile (2 cards), Manufacturing (2 cards), Trading (1 card), and Logistics (1 card)

#### Scenario: Each card shows ₹ impact

- **GIVEN** any problem card in the section
- **WHEN** the page renders
- **THEN** the card SHALL contain an `.impact-tag` with a specific ₹ amount or operational cost
- **AND** the card SHALL contain a `.roi-line` describing how OptiFlow OS fixes the problem

### Requirement: WhatsApp Chat Mockup

The page SHALL include a simulated WhatsApp operations group chat mockup to illustrate chat-based chaos.

#### Scenario: Chat mockup shows realistic messages

- **GIVEN** the WhatsApp & Excel section
- **WHEN** the page renders
- **THEN** the `.chat-mock` SHALL display at least 5 chat messages from multiple senders (Owner, Supervisor, QC Manager, HR, Finance)
- **AND** messages SHALL alternate between `.sent` and `.received` styles

#### Scenario: Cost analysis accompanies mockup

- **GIVEN** the chat mockup is rendered
- **WHEN** the page is viewed
- **THEN** 3 cost-of-chaos cards SHALL appear alongside the mockup: Tasks Get Lost, No Audit Trail, Zero Visibility
- **AND** each cost card SHALL contain an `.impact-tag`

### Requirement: Cost of Doing Nothing Stats

The page SHALL quantify the cost of inaction with 3 stat blocks on a dark section background.

#### Scenario: Three stats displayed

- **GIVEN** the section labeled "06 The Cost of Doing Nothing"
- **WHEN** the page renders
- **THEN** the `.stats-panel` SHALL display exactly 3 `.stat-block` elements showing: annual revenue loss (₹5-20L), monthly hours wasted (60-100), and owner time on follow-ups (40%)

#### Scenario: Dark section background

- **GIVEN** the Cost of Doing Nothing section
- **WHEN** the page renders
- **THEN** the section SHALL use class `section-dark` for inverted background treatment
- **AND** stat numbers SHALL remain visible in dark mode via `[data-theme="dark"]` overrides

### Requirement: People-Driven vs Process-Driven Comparison

The page SHALL contrast 7 operational attributes between people-driven and process-driven businesses.

#### Scenario: Side-by-side comparison

- **GIVEN** the section labeled "08 People vs Process"
- **WHEN** the page renders
- **THEN** the `.pvp-grid` SHALL contain two `.pvp-col` columns: people-driven (danger border) and process-driven (green border)
- **AND** each column SHALL display exactly 7 `.pvp-row` entries comparing the same operational dimensions

### Requirement: Before/After Compact Comparison

The page SHALL display a compact before-OptiFlow / after-OptiFlow comparison grid.

#### Scenario: 7 dimensions compared

- **GIVEN** the section labeled "09 Before & After"
- **WHEN** the page renders
- **THEN** the `.compact-compare` SHALL contain two `.compact-col` columns: before (red) and after (green)
- **AND** each column SHALL display exactly 7 `.compact-row` entries with dot indicators

### Requirement: Full Dark Mode Support

All page-specific components SHALL have complete `[data-theme="dark"]` style overrides using CSS custom properties.

#### Scenario: Dark mode overrides exist

- **GIVEN** the page's `<style>` block
- **WHEN** inspected
- **THEN** `[data-theme="dark"]` rules SHALL exist for at minimum: `.hook-badge`, `.pain-points`, `.chat-mock`, `.chaos-bubble` variants, `.section-dark`, `.pvp-label`, `.pvp-row`, `.compact-row`, `.module-tag`, `.industry-tag`, `.impact-tag`, `.roi-line`, `.compare-col`, `.compare-item`, `.sf-node` variants, `.chaos-src`, `.stat-block`, `.compact-col`

#### Scenario: No hardcoded dark hex colors

- **GIVEN** the `[data-theme="dark"]` block
- **WHEN** inspected
- **THEN** all color values SHALL use `color-mix()`, `var()`, or CSS custom properties
- **AND** no raw hex values SHALL appear in dark mode rules

### Requirement: Resources Dropdown Includes Competitive Positioning

The Resources dropdown in both desktop nav and mobile drawer SHALL contain Newsletter, FAQ, and Competitive Positioning.

#### Scenario: Resources dropdown content updated

- **GIVEN** the nav is rendered
- **WHEN** the Resources dropdown is opened
- **THEN** it SHALL display "Newsletter", "FAQ", and "Competitive Positioning"
- **AND** the Competitive Positioning link SHALL point to `/competitive-positioning/`

### Requirement: Footer Includes Competitive Positioning Link

The footer Resource links SHALL include a link to the Competitive Positioning page.

#### Scenario: Footer resource links

- **GIVEN** the footer partial
- **WHEN** inspected
- **THEN** the Resources column SHALL include "Competitive Positioning" link pointing to `/competitive-positioning/`

