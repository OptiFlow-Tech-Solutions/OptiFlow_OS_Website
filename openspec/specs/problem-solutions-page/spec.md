# problem-solutions-page

## Purpose

React ProblemSolutions page migrating all 10 visual sections from the static `problem-solutions.html` into the React SPA, using shared components (Section, Card, Button, Container) and hooks (useScrollReveal) with interactive animations (pain carousel, chaos map, WhatsApp mockup).

## Requirements

### Requirement: Problem Solutions page renders all 10 sections
The ProblemSolutions page SHALL render all 10 visual sections with identical content to the static `problem-solutions.html`, using shared components (`Section`, `Card`, `Button`, `Container`) where applicable.

#### Scenario: Hero section renders
- **WHEN** user navigates to `/os/problem-solutions`
- **THEN** hero section displays hook badge ("Business Challenges MSMEs Face Every Day"), h1 ("How Many Tasks Did Your Team Miss Today?"), lead paragraph, two CTA buttons (Book Free Demo, Explore The Problems), 4 trust checkmarks, and the 8-item chaos bubble grid

#### Scenario: Pain point carousel auto-rotates
- **WHEN** user views the pain points section
- **THEN** 8 pain point phrases cycle automatically every 3 seconds with fade transition, and cycling pauses when the browser tab is hidden

#### Scenario: Chaos map renders
- **WHEN** user views the chaos map section
- **THEN** 6 chaos sources (WhatsApp, Excel Sheets, Phone Calls, Manual Registers, Verbal Instructions, Sticky Notes) connect via arrows to a central "CHAOS" node, which connects to "OptiFlow OS" resolve node with "Single Source of Truth" subtitle

#### Scenario: Trust bar renders
- **WHEN** user views the trust bar section
- **THEN** 4 metrics display: 500+ Businesses Served, 10,000+ Tasks Managed Daily, 10,000+ Active Users, 1,200+ Departments Managed

#### Scenario: Industry problem cards render
- **WHEN** user views the "Why Growth Feels Hard" section
- **THEN** 6 cards display: Textile QC checklist, Textile 3-shift attendance, Manufacturing preventive maintenance, Manufacturing purchase approval, Trading sales follow-up, Logistics dispatch pick-list — each with industry tag, description, impact tag in INR, and ROI solution line

#### Scenario: WhatsApp chat mockup renders
- **WHEN** user views the WhatsApp & Excel section
- **THEN** a chat mockup displays 7 messages (alternating sent/received) showing operational chaos, alongside 3 cost cards (Tasks Get Lost, No Audit Trail, Zero Visibility) with impact tags and ROI lines

#### Scenario: Cost of inaction stats render
- **WHEN** user views the dark "Cost of Doing Nothing" section
- **THEN** 3 stat blocks display: Revenue lost (5-20L annually), Hours wasted (60-100/month), Owner time (40% on follow-ups) — each with note text

#### Scenario: Solution flow renders
- **WHEN** user views the solution flow section
- **THEN** 3 nodes (Business Chaos → OptiFlow OS → Process-Driven Business) connect via arrows, with 8 module tags below (Task Management, Worklists, Attendance, Leaves, SOPs & Checklists, Reports & Analytics, Helpdesk, Dashboards)

#### Scenario: People vs Process comparison renders
- **WHEN** user views the People vs Process section
- **THEN** two side-by-side columns display 7 comparison rows: left (People-Driven with danger styling) vs right (Process-Driven with green styling), each with a label row and outcome row

#### Scenario: Before and after comparison renders
- **WHEN** user views the Before & After section
- **THEN** two columns display 7 items each: left "Before OptiFlow" (danger-styled with X icons) and right "After OptiFlow" (green-styled with check icons)

### Requirement: Pain point carousel respects reduced motion
The pain point carousel SHALL respect the `prefers-reduced-motion: reduce` media query.

#### Scenario: Reduced motion disables carousel
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** all pain point items are visible and static — no auto-rotation occurs

### Requirement: Problem Solutions page uses shared components
The ProblemSolutions page SHALL use `<Section>` for standard sections, `<Card>` for card content blocks, and `<Button as={Link}>` for all CTA links.

#### Scenario: Page uses Section component
- **WHEN** inspecting ProblemSolutions.tsx source
- **THEN** the majority of content sections use the `<Section>` component (excluding hero, pain-points, and trust-bar which have custom layouts)

#### Scenario: Page uses Button component for CTAs
- **WHEN** inspecting ProblemSolutions.tsx source
- **THEN** all CTA links use `<Button as={Link} to="...">` pattern

### Requirement: Content matches static HTML
The text content, headings, and structure of the React ProblemSolutions page SHALL match the static `src/pages/problem-solutions.html`.

#### Scenario: Heading text matches
- **WHEN** comparing React page h1 and h2 text with static HTML
- **THEN** all heading text is identical

#### Scenario: Card counts match
- **WHEN** comparing card elements between React and static HTML
- **THEN** the number of problem cards (6), comparison rows (7 before + 7 after), and stat blocks (3) are identical
