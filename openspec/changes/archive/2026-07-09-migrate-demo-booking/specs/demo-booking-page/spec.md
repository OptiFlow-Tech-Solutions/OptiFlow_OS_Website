## ADDED Requirements

### Requirement: Demo booking page renders all 8 sections
The DemoBooking page component SHALL render all 8 content sections matching `demo-booking.html`: hero with dashboard mockup, benefit cards (why book), trust bar with counters, timeline, benefit cards (walk away with), booking form, calendar widget, FAQ, and final CTA.

#### Scenario: Hero section renders
- **WHEN** user navigates to `/os/demo-booking`
- **THEN** hero displays with badge "LIVE PRODUCT DEMONSTRATION", h1 heading, lead paragraph, two CTAs ("Book Your Demo" and "Watch Product Tour"), 4 trust checkmarks, and the floating dashboard mockup with KPI cards and bar chart

#### Scenario: Why book section renders 6 benefit cards
- **WHEN** user views the "Why Book" section
- **THEN** 6 benefit cards are displayed with icons (blue/teal/green), titles, and descriptions matching the static HTML content

#### Scenario: Trust bar renders 4 metrics
- **WHEN** user views the trust bar
- **THEN** 4 metric cards display: "500 Businesses Served", "10,000+ Active Users", "500,000+ Tasks Managed", "1200 Departments Managed"

#### Scenario: Timeline renders 6 steps
- **WHEN** user views the "What You'll Experience" section
- **THEN** a vertical timeline displays 6 steps (Business Discovery, Platform Walkthrough, Use Case Demo, Workflow Mapping, Q&A, Implementation Roadmap) with numbered markers, headings, descriptions, and a duration badge ("30–45 Minutes")

#### Scenario: Walk away section renders 6 benefit cards
- **WHEN** user views the "What You Will Walk Away With" section
- **THEN** 6 benefit cards display: Operational Gap Analysis, Visibility Framework, Implementation Roadmap, Platform Evaluation Guide, Accountability Framework, Scaling Recommendations

#### Scenario: Booking form renders 7 fields
- **WHEN** user views the booking form section
- **THEN** the form displays 7 fields: Full Name, Company Name, Mobile Number, Email Address, Team Size (select), Industry (select), and Current Challenges (textarea), plus a hidden honeypot field and submit button

#### Scenario: Calendar renders current month
- **WHEN** user views the calendar section
- **THEN** the calendar displays the current month with day-of-week headers (Su-Sa), a day grid with today highlighted, past dates dimmed, and month navigation buttons

#### Scenario: FAQ renders 8 accordion items
- **WHEN** user views the FAQ section
- **THEN** 8 accordion items are displayed: "Is the demo free?", "How long does the demo take?", "Do I need technical knowledge?", "Can the demo be customized?", "Will I see real product screens?", "Can my team join?", "How quickly can we get started?", "What happens after the demo?"

#### Scenario: Final CTA section renders
- **WHEN** user views the final CTA section
- **THEN** it displays heading, lead text, two CTAs ("Book Free Demo" linking to form, "Talk To A Consultant" linking to contact), and 4 trust checkmarks

#### Scenario: Page includes SEOHead
- **WHEN** DemoBooking page renders
- **THEN** document title is "Book a Demo — OptiFlow OS" and meta description matches the route config

### Requirement: Benefit cards use consistent layout
Benefit cards on the demo booking page SHALL use a flex layout with colored icon container (blue/teal/green variants), heading, and body text.

#### Scenario: Benefit card renders with correct icon color
- **WHEN** a benefit card is rendered
- **THEN** the icon container has a background color matching the variant (blue = `var(--accent-soft)`, teal = `var(--teal-soft)`, green = `var(--green-soft)`) and text in the corresponding foreground color

### Requirement: Timeline steps use numbered markers
Timeline steps SHALL display with a vertical gradient line, numbered circular markers (alternating between accent and teal), step headings, and descriptions.

#### Scenario: Timeline renders with alternating colors
- **WHEN** timeline steps are rendered
- **THEN** odd-numbered steps have accent-colored markers and even-numbered steps have teal-colored markers

### Requirement: Dashboard mockup renders floating KPIs
The hero dashboard mockup SHALL display 4 KPI cards and a bar chart with 7 bars and day labels.

#### Scenario: Dashboard displays KPI values
- **WHEN** the dashboard mockup renders
- **THEN** it shows "Tasks On Track: 94%", "Team Attendance: 47", "SOP Compliance: 98%", and "Monthly Savings: ₹2.8L"

#### Scenario: Dashboard displays bar chart
- **WHEN** the dashboard mockup renders
- **THEN** a chart with 7 bars labeled Mon-Sun is displayed with varying heights

### Requirement: Page sections use shared components
All sections on the demo booking page SHALL use the `<Section>` component. CTAs SHALL use the `<Button>` component with `as={Link}`. No raw `<section className="section">` or `<a className="btn">` tags.

#### Scenario: Sections use Section component
- **WHEN** inspecting DemoBooking.tsx
- **THEN** all page sections use `<Section>` component with heading/lead/background props

#### Scenario: CTAs use Button component
- **WHEN** inspecting DemoBooking.tsx
- **THEN** all CTA links use `<Button as={Link} to="...">` pattern
