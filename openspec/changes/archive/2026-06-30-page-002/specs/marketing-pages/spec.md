## ADDED Requirements

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
