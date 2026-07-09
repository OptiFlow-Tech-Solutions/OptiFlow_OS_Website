# competitive-positioning-page

## Purpose

Full Competitive Positioning page in the React SPA — hero with SVG comparison diagram, 2×2 quadrant grid with center overlay, 13-row feature comparison matrix, 4-card cost comparison, 3 standout differentiator cards, and CTA. Content matches static HTML `src/pages/competitive-positioning.html`.

## Requirements

### Requirement: Competitive Positioning page renders hero section
The Competitive Positioning page SHALL render a hero section with h1 heading, lead paragraph, dual CTAs (Book Demo, See Pricing), and an SVG comparison diagram showing OptiFlow OS connected to 4 competitor categories.

#### Scenario: Hero renders with heading and CTAs
- **WHEN** user navigates to `/os/competitive-positioning`
- **THEN** the page displays h1 "How OptiFlow OS compares to the alternatives", lead text about the honest comparison, Book Free Demo button, and See Pricing button

#### Scenario: Hero renders SVG comparison diagram
- **WHEN** the hero section renders
- **THEN** an inline SVG visual displays OptiFlow OS at center connected to WhatsApp/Excel, Generic SaaS, Traditional ERP, and Manual Paper competitor categories

### Requirement: 2x2 Quadrant Grid renders with center overlay
The Competitive Positioning page SHALL render a 2x2 quadrant grid where each quadrant card contains a category label, title, weaknesses list, and advantage text. The center SHALL display an "OptiFlow OS" overlay circle with the subtitle "All 4 solved in one platform".

#### Scenario: Four quadrant cards render
- **WHEN** the quadrant section renders
- **THEN** four quadrant cards are displayed in a 2x2 grid with category labels (Category 1-4), titles (WhatsApp & Excel Chaos, Generic SaaS Tools, Traditional ERPs, Manual Paper Systems), weakness lists (3 items each), and advantage text

#### Scenario: Center overlay renders
- **WHEN** the quadrant section renders
- **THEN** a circular overlay at the center of the 2x2 grid displays "OptiFlow OS" and subtitle "All 4 solved in one platform" with gradient background and glow shadow

#### Scenario: Quadrant collapses to single column on mobile
- **WHEN** viewport width is 767px or less
- **THEN** the quadrant grid displays as a single column and the center overlay becomes a static rounded rectangle between cards

### Requirement: 13-row feature comparison matrix renders
The Competitive Positioning page SHALL render a 5-column, 13-row feature comparison table comparing OptiFlow OS, WhatsApp/Excel, Generic SaaS, and Traditional ERP across 13 feature categories using check, cross, and text cell indicators.

#### Scenario: All 13 feature rows render
- **WHEN** the feature matrix section renders
- **THEN** the table contains exactly 13 data rows covering Task Management, Attendance & Geo-tagging, SOP Builder & Execution, Real-Time Dashboards, Mobile-First Access, Checklists & Audits, Reports & Analytics, Multi-Location Support, Role-Based Access, Leave Management, Pricing Model, Implementation Time, and Built for Indian MSMEs

#### Scenario: Cell indicators render correctly
- **WHEN** the matrix renders
- **THEN** OptiFlow OS column shows green checkmarks for all features, WhatsApp/Excel column shows crosses and "Manual"/"N/A" text, Generic SaaS column shows mixed checks/partials, and Traditional ERP column shows mixed checks/partials

#### Scenario: Matrix is horizontally scrollable on narrow screens
- **WHEN** viewport width is less than 900px
- **THEN** the table wrapper shows a horizontal scrollbar for viewing all 5 columns

#### Scenario: OptiFlow column is highlighted
- **WHEN** the matrix renders
- **THEN** the OptiFlow OS column has a distinct background color (accent-soft) and bold text to visually differentiate it

### Requirement: 4 cost comparison cards render with best value badge
The Competitive Positioning page SHALL render 4 cost comparison cards in a grid comparing annual costs: OptiFlow OS, WhatsApp/Excel, Generic SaaS, and Traditional ERP. The OptiFlow OS card SHALL display a "Best Value" badge and green accent styling.

#### Scenario: Four cost cards render with correct data
- **WHEN** the cost comparison section renders
- **THEN** four cards display with headings, annual cost ranges (OptiFlow: ₹15,000-45,000, WhatsApp/Excel: ₹3-8 Lakhs, Generic SaaS: ₹1.5-4.5 Lakhs, Traditional ERP: ₹5-15 Lakhs), and descriptive detail text

#### Scenario: OptiFlow card shows Best Value badge
- **WHEN** the cost comparison section renders
- **THEN** the OptiFlow OS card displays a "Best Value" badge, green border, and green cost range color

#### Scenario: Cost cards have hover effects
- **WHEN** user hovers over any cost card
- **THEN** the card lifts 4px with increased shadow and border accent color

#### Scenario: Cost grid adapts to screen size
- **WHEN** viewport width is 1024px or less
- **THEN** cost cards display in 2 columns
- **WHEN** viewport width is 767px or less
- **THEN** cost cards display in a single column

### Requirement: 3 standout differentiator cards render
The Competitive Positioning page SHALL render a "Why OptiFlow OS Stands Apart" section with 3 cards, each containing an icon, heading, and descriptive paragraph about unique differentiators.

#### Scenario: Three standout cards render
- **WHEN** the standout section renders
- **THEN** three cards display with headings "Built for Indian MSMEs", "Flat Pricing — No Per-User Tax", and "Implementation + Support Included", each with an SVG icon and descriptive paragraph

### Requirement: Competitive Positioning page renders CTA section
The Competitive Positioning page SHALL render a final CTA section with heading, lead text, Book Demo button, and Talk to Sales button.

#### Scenario: Final CTA section renders
- **WHEN** user scrolls to the bottom of the page
- **THEN** a CTA section displays "See the difference yourself", lead text, Book Free Demo button, and Talk to Sales button

### Requirement: Competitive Positioning page matches static HTML content
The text content, headings, and structure of the Competitive Positioning page SHALL match the static HTML `src/pages/competitive-positioning.html`.

#### Scenario: All headings match
- **WHEN** comparing each section heading with static HTML
- **THEN** text content is identical

#### Scenario: All matrix cell values match
- **WHEN** comparing each of the 13 matrix rows with static HTML
- **THEN** cell types (check/cross/text) and text values match exactly

#### Scenario: No content is added or removed
- **WHEN** comparing the React page with its static counterpart
- **THEN** all headings, paragraphs, quadrant cards, matrix rows, cost card values, and standout card text from the static page are present
