## ADDED Requirements

### Requirement: Why OptiFlow page renders all 10 sections
The WhyOptiFlow page SHALL render all 10 visual sections with identical content to the static `why-optiflow.html`, using shared components (`Section`, `Card`, `Button`, `Container`) where applicable.

#### Scenario: Hero section with typewriter renders
- **WHEN** user navigates to `/os/why-optiflow`
- **THEN** hero section displays typewriter cycling through 5 custom phrases ("Turn Chaos Into Complete Control.", "Build A Team That Owns Results.", "See Every Operation In Real Time.", "Scale With Systems, Not Stress.", "Work On Your Business, Not In It."), a blinking cursor, mouse glow tracking cursor position, lead paragraph, two CTA buttons, 4 trust checkmarks, and the 3-stage transform visual with 3 floating KPI badges

#### Scenario: Problem cards section renders
- **WHEN** user views the "Purpose Built For Growing Businesses" section
- **THEN** 6 problem cards display: WhatsApp Dependency, Excel Dependency, Manual Follow-Ups, Employee Dependency, No Visibility, No Accountability — each with icon, description, impact stat, and OptiFlow solution line

#### Scenario: Designer cards section renders
- **WHEN** user views the "Built By People Who Understand Operations" section with dark background
- **THEN** 3 designer cards display: Designed For Daily Operations, Built For Real Accountability, Practical Easy Relevant — each with icon, heading, and description

#### Scenario: Easy adoption section renders
- **WHEN** user views the "Software Only Works If People Actually Use It" section
- **THEN** 3 adoption cards (Simple Interface, Role-Based Views, Mobile First) display with icons, headings, and descriptions, followed by 4 adoption stats: 90%+ Adoption Rate, <7 days Onboarding, 3 roles, 24/7 Accessible

#### Scenario: Timeline section renders
- **WHEN** user views the "Go Live Faster Than Traditional Systems" section with dark background
- **THEN** 4 timeline items display with centered vertical line: Discovery & Setup (1), Configuration (2), Team Training (3), Go Live & Support (4) — each with numbered dot, heading, and description

#### Scenario: ROI stats grid renders with animated counters
- **WHEN** user views the "Operational Improvements That Pay For Themselves" section
- **THEN** 8 ROI stat cards display with animated count-up values: 80% Reduced Follow-Ups, 95% Accountability Improvement, 100% Visibility Improvement, 40% Faster Task Execution, 120+ Hours Saved/Month, 3 Month Payback, 92% Task Completion Rate, 100% Audit Readiness — each with label and description

#### Scenario: Comparison table renders
- **WHEN** user views the "Why Businesses Choose OptiFlow" section with dark background
- **THEN** a 5-column comparison table renders with columns (Capability, WhatsApp, Excel, Generic Task Tools, Traditional Systems, OptiFlow OS — last highlighted) and 11 rows (Task Ownership, Accountability System, Real-Time Visibility, Attendance, Approval Workflows, Reporting & Analytics, SOP Library, Training Management, Audit Logs, Scalability, MSME Focused) with check/cross icons

#### Scenario: Customer results section renders
- **WHEN** user views the "Real Business Outcomes" section
- **THEN** 3 testimonial cards display (Amit Kumar, Neha Sharma, Rajesh Patel) with quote, author details, and outcome text, followed by 4 testimonial stats with count-up values

#### Scenario: Trust elements section renders
- **WHEN** user views the "Built On Trust, Visibility, And Accountability" section
- **THEN** 4 trust cards display: Role Based Permissions, Complete Audit Trails, 99.9% System Reliability, Dedicated Support — each with icon, heading, and description

#### Scenario: Final CTA section renders
- **WHEN** user views the final CTA section
- **THEN** heading ("Ready To Build A Process Driven Business?"), lead paragraph, 3 CTA buttons (Book Free Demo, Watch Product Tour, Compare vs Alternatives), and 4 trust checkmarks display with dark background styling

### Requirement: Typewriter cycles custom Why OptiFlow phrases
The typewriter in the hero SHALL cycle through 5 Why-OptiFlow-specific phrases using the existing `useTypewriter` hook.

#### Scenario: Typewriter cycles all 5 phrases
- **WHEN** user views the hero section
- **THEN** the typewriter types and deletes through: "Turn Chaos Into Complete Control." → "Build A Team That Owns Results." → "See Every Operation In Real Time." → "Scale With Systems, Not Stress." → "Work On Your Business, Not In It." — then loops back to the first phrase

#### Scenario: Typewriter pauses on blur
- **WHEN** the browser tab loses focus while typewriter is active
- **THEN** the typewriter pauses and resumes when the tab regains focus

### Requirement: Mouse glow tracks cursor in hero
The mouse glow effect in the hero SHALL follow the cursor position using the existing `useMouseGlow` hook.

#### Scenario: Glow follows cursor
- **WHEN** user moves mouse within the hero section
- **THEN** a radial gradient glow (600px diameter, accent color) follows the cursor position with rAF-throttled updates

#### Scenario: Glow disappears on mouse leave
- **WHEN** user moves mouse outside the hero section
- **THEN** the glow fades to opacity 0

### Requirement: ROI counters animate on scroll
ROI stat values SHALL animate from 0 to their target number when scrolled into view, using the existing `useCountUp` hook.

#### Scenario: Counters start on scroll into view
- **WHEN** the ROI stats section scrolls into the viewport (30% threshold)
- **THEN** each counter animates from 0 to its target value over 1500ms

#### Scenario: Counters respect reduced motion
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** counters display final values immediately without animation

### Requirement: Why OptiFlow page uses shared components
The WhyOptiFlow page SHALL use `<Section>` for standard sections, `<Card>` for card content blocks, and `<Button as={Link}>` for all CTA links.

#### Scenario: Page uses Section component
- **WHEN** inspecting WhyOptiFlow.tsx source
- **THEN** the majority of content sections use the `<Section>` component (excluding hero which has custom layout)

#### Scenario: Page uses Button component for CTAs
- **WHEN** inspecting WhyOptiFlow.tsx source
- **THEN** all CTA links use `<Button as={Link} to="...">` pattern

### Requirement: Content matches static HTML
The text content, headings, and structure of the React WhyOptiFlow page SHALL match the static `src/pages/why-optiflow.html`.

#### Scenario: Heading text matches
- **WHEN** comparing React page h1 and h2 text with static HTML
- **THEN** all heading text is identical

#### Scenario: Card and row counts match
- **WHEN** comparing card and row counts between React and static HTML
- **THEN** problem cards (6), designer cards (3), ROI cards (8), timeline items (4), testimonials (3), trust cards (4), and comparison table rows (11) are all identical
