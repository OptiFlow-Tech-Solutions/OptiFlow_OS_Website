# home-page-sections

## Purpose

13 section components (HeroSection through FAQPreview) plus ExitOverlay and WhatsAppFloat, rendering complete content from the static home.html with exact visual parity, using shared Section/Card/Button components.

## Requirements

### Requirement: HeroSection component
The Home page SHALL render a HeroSection component matching the static `home.html` hero section (S01) with identical content, layout, and visual styling.

#### Scenario: Hero renders typewriter heading
- **WHEN** the Home page loads
- **THEN** the hero displays an h1 with a typewriter animation cycling through 5 phrases: "Daily Operations Feel Out Of Control?", "Important Tasks Keep Getting Missed?", "No One Takes Full Ownership?", "No Clear Visibility Into Daily Operations?", "Your Business Can't Run Without You?"

#### Scenario: Hero renders hook badge
- **WHEN** the Home page loads
- **THEN** a hook badge displays "Stop Losing Time on Manual Processes" with a check icon

#### Scenario: Hero renders lead text
- **WHEN** the Home page loads
- **THEN** the lead paragraph matches the static HTML content exactly

#### Scenario: Hero renders CTAs using Button component
- **WHEN** the Home page loads
- **THEN** two buttons are displayed: "Book Your Demo — It's Free" (primary, glow, links to /os/demo-booking/) and "See OptiFlow In Action" (secondary, links to /os/product-overview/), both using `<Button>` component

#### Scenario: Hero renders trust bullets
- **WHEN** the Home page loads
- **THEN** 4 trust bullets display: "Zero IT Team Needed", "Results In Days, Not Months", "Built For Indian Businesses", "Trusted Across 7 Industries"

#### Scenario: Hero renders dashboard mockup
- **WHEN** the Home page loads
- **THEN** a dashboard mockup is displayed with a title bar (dot indicators), 4 KPI cards (Active Tasks: 1,247, Team Members: 86, Completion Rate: 94%, On-Time Delivery: 97%), an SVG line chart, a task table with 3 rows (Quality check, Client follow-up, SOP update), and 3 floating widgets (Tasks Completed Today: 24, On-Time Rate: 96%, Pending Actions: 3)

#### Scenario: Hero background gradient renders
- **WHEN** viewing the hero section in light mode
- **THEN** the hero has background color #F8FAFC with a radial gradient overlay using rgba(39,141,159,.04) centered at 50% 30%

#### Scenario: Hero dark mode
- **WHEN** viewing the hero section in dark mode
- **THEN** the background darkens to #0F172A, headings use rgba(255,255,255,.80), body text uses rgba(255,255,255,.62), and the secondary button has a glass effect with backdrop blur

#### Scenario: Hero responsive layout
- **WHEN** viewport width is below 1024px
- **THEN** the hero grid switches from 2-column to single-column layout

#### Scenario: Hero mobile layout
- **WHEN** viewport width is below 480px
- **THEN** the CTA buttons stack vertically, floating widgets are hidden, and the mouse glow is disabled

### Requirement: TrustBar component
The Home page SHALL render a TrustBar section (S02) with 4 metrics and a scrolling industry logo marquee.

#### Scenario: TrustBar renders metrics
- **WHEN** the Home page loads
- **THEN** 4 metrics display with monospace values: "10,000+", "500+", "95%", "4.8/5" and labels: "Tasks Managed Daily", "Businesses Onboarded", "On-Time Completion", "Customer Rating"

#### Scenario: TrustBar renders scrolling logos
- **WHEN** the Home page loads
- **THEN** a horizontally scrolling marquee displays industry names (Textile, Manufacturing, Trading, Warehousing, Distribution, Logistics, Services) with infinite CSS animation, masked at edges with a gradient fade

### Requirement: ProblemSection component
The Home page SHALL render a ProblemSection (S03) with a section header and 6 problem cards in a 3-column grid.

#### Scenario: ProblemSection renders header
- **WHEN** the Home page loads
- **THEN** the section header displays eyebrow "The Problem", heading "Growth Stops When Operations Depend On One Person", and matching lead text

#### Scenario: ProblemSection renders 6 problem cards
- **WHEN** the Home page loads
- **THEN** 6 cards display: Tasks Get Missed, No Accountability, WhatsApp Chaos, Excel Dependency, No Visibility, Delayed Follow-Ups — each with an icon, description, impact badge, and ROI text matching static HTML

#### Scenario: ProblemSection uses Card and Section components
- **WHEN** inspecting the ProblemSection source
- **THEN** it uses `<Section>` for the wrapping section and `<Card>` for each problem card

### Requirement: CostOfInaction component
The Home page SHALL render a CostOfInaction dark section (S04) with 5 impact cards that have 3D card tilt hover effects.

#### Scenario: CostOfInaction renders dark section
- **WHEN** the Home page loads
- **THEN** the section uses `<Section background="dark">` with a centered header "Every Day Without A System, Money Leaks"

#### Scenario: CostOfInaction renders 5 impact cards
- **WHEN** the Home page loads
- **THEN** 5 cards display: Revenue Leakage (₹8-15L/yr), Productivity Drain (₹12-20L/yr), Delivery Penalties (₹5-10L/yr), Key-Person Risk (₹10-25L/yr), Founder Burnout (Growth Ceiling)

#### Scenario: Impact cards have 3D tilt on hover
- **WHEN** the user moves the mouse over an impact card
- **THEN** the card tilts in 3D space (rotateX/rotateY up to 12 degrees) based on mouse position, and resets when the mouse leaves

### Requirement: SolutionFlow component
The Home page SHALL render a SolutionFlow section (S05) with a 3-stage vertical flow visual and module tags.

#### Scenario: SolutionFlow renders 3 stages
- **WHEN** the Home page loads
- **THEN** three stages display vertically with arrows between them: "Scattered WhatsApp · Excel · Memory" (chaos style, warm tint), "OptiFlow OS — Unified Operations" (gradient accent, largest), "Predictable · Accountable · Scalable" (green tint)

#### Scenario: SolutionFlow renders module tags
- **WHEN** the Home page loads
- **THEN** 8 module pill tags render below the stages: Tasks, Attendance, SOPs, Reports, Teams, Checklists, Leaves, Analytics — each with hover effects changing border and text color

### Requirement: ProductSnapshot component
The Home page SHALL render a ProductSnapshot section (S06) with 8 module cards in a 4-column grid.

#### Scenario: ProductSnapshot renders 8 module cards
- **WHEN** the Home page loads
- **THEN** 8 cards display: Task Management, Worklists, Attendance, SOP Library, Reports & Analytics, Leave Management, Team Management, Helpdesk — each with a gradient icon, description, and outcome text matching static HTML

### Requirement: HowItWorks component
The Home page SHALL render a HowItWorks section (S07) with 4 numbered steps connected by a gradient line.

#### Scenario: HowItWorks renders 4 steps
- **WHEN** the Home page loads
- **THEN** 4 steps display with numbered circles (01-04): Create Process, Assign Doer, Track Work, Generate Reports — each with a description and outcome text

#### Scenario: HowItWorks renders connecting line
- **WHEN** the Home page loads
- **THEN** a horizontal gradient line (accent → teal → green → lime) connects the step circles

### Requirement: FeatureSection component
The Home page SHALL render a FeatureSection (S08) with 8 feature cards in a 4-column grid.

#### Scenario: FeatureSection renders 8 feature cards
- **WHEN** the Home page loads
- **THEN** 8 cards display: Delegation, Attendance, SOPs, Dashboard, Helpdesk, Analytics, Leave, Audit Logs — each with an icon mark, description, and ROI text matching static HTML

### Requirement: IndustrySection component
The Home page SHALL render an IndustrySection (S09) with 7 industry cards in a 4-column grid.

#### Scenario: IndustrySection renders 7 industry cards
- **WHEN** the Home page loads
- **THEN** 7 cards display: Textile, Manufacturing, Trading, Warehousing, Distribution, Logistics, Services — each with an icon, challenge, and solution text matching static HTML

### Requirement: WhyOptiflowComparison component
The Home page SHALL render a WhyOptiflowComparison dark section (S10) with a comparison table of 9 rows.

#### Scenario: Comparison renders 9-row table
- **WHEN** the Home page loads
- **THEN** a comparison table renders with 9 rows (Task Ownership, Accountability, Visibility, Attendance, Approvals, Reporting, SOPs, Scalability, MSME Fit) — each comparing Traditional vs OptiFlow OS with green check marks in the OptiFlow column

#### Scenario: Comparison uses dark section
- **WHEN** viewing the Why OptiFlow section
- **THEN** it uses `<Section background="dark">` with a noise overlay

### Requirement: TestimonialSection component
The Home page SHALL render a TestimonialSection (S11) with 3 testimonial cards and a stats bar.

#### Scenario: TestimonialSection renders 3 testimonials
- **WHEN** the Home page loads
- **THEN** 3 testimonial cards display with quote, avatar, author name, role, and outcome text matching static HTML

#### Scenario: TestimonialSection renders stats bar
- **WHEN** the Home page loads
- **THEN** a stats bar displays 4 metrics: "80% Fewer Follow-Ups", "95% Accountability Score", "92% On-Time Completion", "100% Audit Readiness"

### Requirement: CTASection component
The Home page SHALL render a CTASection (S12) with heading, lead, 2 CTA buttons, and 4 trust bullets using the `.cta-section` styling from GlobalStyles.

#### Scenario: CTASection renders correctly
- **WHEN** the Home page loads
- **THEN** the CTA section displays heading "Ready To Build A Process-Driven Business?", lead text, "Book Free Demo" (primary glow) and "Watch Product Tour" (secondary) buttons, and 4 trust bullets (Fast Deployment, MSME Focused, Dedicated Support, Easy Adoption)

### Requirement: FAQPreview component
The Home page SHALL render a FAQPreview section (S13) with 5 FAQ accordion items and a "View All FAQs" link.

#### Scenario: FAQPreview renders 5 questions
- **WHEN** the Home page loads
- **THEN** 5 FAQ accordion items display with exact questions matching static HTML: "What is OptiFlow OS?", "How quickly can we go live?", "Can it really replace WhatsApp and Excel?", "Do you charge per user?", "Is our business data secure?"

#### Scenario: FAQ accordion opens on click
- **WHEN** the user clicks a FAQ question
- **THEN** the answer expands with a smooth transition, the plus icon rotates, and clicking again closes it

### Requirement: ExitOverlay component
The Home page SHALL render an ExitOverlay component that displays an exit-intent popup when the user's mouse leaves the viewport after scrolling past 400px.

#### Scenario: Exit overlay triggers on mouse leave
- **WHEN** the user scrolls past 400px and moves the mouse above the viewport (clientY <= 0)
- **THEN** a modal overlay displays with heading "See How Much Time Your Business Could Save", lead text, and a "Book Your Free Demo" button

#### Scenario: Exit overlay closes
- **WHEN** the exit overlay is active and the user clicks the close button or the overlay background
- **THEN** the overlay fades out and becomes non-interactive

#### Scenario: Exit overlay fires only once
- **WHEN** the exit overlay has already been triggered
- **THEN** it does not trigger again on subsequent mouse leave events

### Requirement: WhatsAppFloat component
The Home page SHALL render a WhatsAppFloat component as a fixed floating button linking to the WhatsApp business number.

#### Scenario: WhatsAppFloat renders and is clickable
- **WHEN** the Home page loads
- **THEN** a green floating button with the WhatsApp logo is visible at bottom-right, links to `https://wa.me/{{WHATSAPP}}`, and opens in a new tab

### Requirement: All 13 sections use shared components
Every home page section SHALL use `<Section>`, `<Card>`, and `<Button>` components from the shared component library. No raw `<section className="section">` or `<div className="card">` tags.

#### Scenario: Home page sections compliance
- **WHEN** inspecting any home page section component source
- **THEN** it uses `<Section>` for section wrappers, `<Card>` for card elements, and `<Button as={Link} to="...">` for CTAs

### Requirement: Responsive behavior at 5 breakpoints
The Home page SHALL render correctly at 5 breakpoints: 1200px (desktop), 1024px (tablet landscape), 768px (tablet portrait), 480px (mobile), 360px (small mobile).

#### Scenario: Grid columns adapt at breakpoints
- **WHEN** viewport width changes between breakpoints
- **THEN** card grids adapt column counts: 4-col at desktop, 3-col at 1024px, 2-col at 768px, 1-col at 480px, matching home.html responsive CSS
