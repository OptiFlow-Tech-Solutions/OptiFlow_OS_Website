# contact-page

## Purpose

Full React page component for the contact page — hero with chat illustration, contact form, sales/support channel cards, office information, response time promises, trust bar, FAQ accordion, and final CTA.

## Requirements

### Requirement: Contact page renders all 8 sections
The ContactPage component SHALL render all content sections matching `contact.html`: hero with chat SVG illustration and stats, contact form (7 fields + honeypot), sales channels (3 cards), support channels (3 cards), office info card, response time promises (4 cards), trust bar (4 metrics), FAQ (7 accordion items), and final CTA section.

#### Scenario: Hero section renders
- **WHEN** user navigates to `/contact`
- **THEN** hero displays with badge "GET IN TOUCH", h1 heading, lead paragraph, two CTAs ("Send Message" scrolling to form and "Book a Demo" linking to demo-booking), chat SVG illustration card on right, and 3 overlay stats ("500+ Businesses", "Avg Response: < 24 hours", "10,000+ Users")

#### Scenario: Contact form section renders
- **WHEN** user views the contact form section
- **THEN** the form card displays with heading "Send Us a Message", 7 labeled fields (Name, Company, Phone, Email, Team Size, Industry, Challenges), a hidden honeypot field, and submit button "Send Message"

#### Scenario: Sales channels render 3 cards
- **WHEN** user views the sales channels section
- **THEN** 3 channel cards display: "Call Us" with phone number `{{PHONE}}` and action link `tel:{{PHONE_TEL}}`, "Email Us" with `{{EMAIL}}` and action link `mailto:{{EMAIL}}`, "WhatsApp" with `{{PHONE}}` and action link to `wa.me/917874677836`

#### Scenario: Support channels render 3 cards
- **WHEN** user views the support channels section
- **THEN** 3 support channel cards display: "Support Email" with support email, "Helpdesk Portal" with portal link, "Knowledge Base" with kb link

#### Scenario: Office info card renders
- **WHEN** user views the office info section
- **THEN** a centered card displays: address "Surat, Gujarat, India", phone `{{PHONE}}`, email `{{EMAIL}}`, hours "Mon–Sat, 10 AM – 7 PM IST", and an "Open for Business" status badge

#### Scenario: Response promises render 4 cards
- **WHEN** user views the response promises section
- **THEN** 4 cards display with icons, titles, and description: "Sales Inquiries — 1 Business Day", "Technical Support — 4–8 Hours", "Critical Issues — Priority Escalation", "Demo Requests — Fast Scheduling"

#### Scenario: Trust bar renders 4 metrics
- **WHEN** user views the trust bar
- **THEN** 4 metric cards display: "500+ Businesses", "10,000+ Users", "500,000+ Tasks", "1,200+ Departments"

#### Scenario: FAQ renders 7 accordion items
- **WHEN** user views the FAQ section
- **THEN** 7 accordion items display covering: response time expectations, demo scheduling process, industry-specific support, implementation timeline, team involvement, post-submission follow-up process, and post-go-live support

#### Scenario: Final CTA section renders
- **WHEN** user views the final CTA section
- **THEN** it displays heading, lead text, two CTAs ("Start Free Trial" and "Book a Demo" linking to demo-booking), and trust checkmarks

### Requirement: Contact page uses shared components
The ContactPage SHALL compose its layout using the shared `Section` component for each section, `Container` for content width, `Card` for card-based content, and `Button` for all CTAs.

#### Scenario: Section components wrap content
- **WHEN** ContactPage renders
- **THEN** each logical section (hero, form, channels, office, promises, FAQ, CTA) uses `<Section>` with appropriate heading/eyebrow/lead props

#### Scenario: CTAs use Button component
- **WHEN** any CTA button renders
- **THEN** it uses `<Button>` with appropriate variant and `as={Link}` for navigation or `as="button"` for form scrolling

### Requirement: Contact page uses canonical contact data
All contact information (phone, email, WhatsApp, location) displayed on the page SHALL be sourced from the canonical `data/site.ts` module. No hardcoded contact strings SHALL appear in the page or its child components.

#### Scenario: Phone displays from site data
- **WHEN** the sales channel "Call Us" card renders
- **THEN** the phone number is read from `site.phone` and the tel link uses `site.phoneTel`

#### Scenario: Email displays from site data
- **WHEN** the sales channel "Email Us" card renders
- **THEN** the email address is read from `site.email`

### Requirement: Channel cards support sales and support variants
The ChannelCard component SHALL render an icon, title, detail text, and optional action link. It SHALL support a `variant` prop with values `'sales'` (accent-colored icon background) and `'support'` (teal-colored icon background).

#### Scenario: Sales variant uses accent color
- **WHEN** a ChannelCard renders with `variant="sales"`
- **THEN** the icon container background uses `var(--accent-soft)` and the icon color uses `var(--accent)`

#### Scenario: Support variant uses teal color
- **WHEN** a ChannelCard renders with `variant="support"`
- **THEN** the icon container background uses `var(--teal-soft)` and the icon color uses `var(--teal)`

#### Scenario: Action link renders when provided
- **WHEN** a ChannelCard renders with `actionLink` and `actionLabel` props
- **THEN** an action link is visible below the detail text using the appropriate color variant

### Requirement: Response promise cards display timeframes
The ResponsePromiseCard component SHALL render an icon, title, and description text. The icon background SHALL use `var(--green-soft)` with `var(--green)` icon color.

#### Scenario: Four promise cards render with correct timeframes
- **WHEN** the response promises section renders
- **THEN** cards display "1 Business Day" for sales, "4–8 Hours" for support, "Priority Escalation" for critical, and "Fast Scheduling" for demos

### Requirement: Office info card shows business hours
The OfficeInfo component SHALL render the company address, phone, email, business hours, and an "Open for Business" status badge. The badge SHALL use green iconography.

#### Scenario: Office card displays complete information
- **WHEN** OfficeInfo renders
- **THEN** all fields display correct values from site data: address "Surat, Gujarat, India", phone from `site.phone`, email from `site.email`, hours "Mon–Sat, 10 AM – 7 PM IST"
