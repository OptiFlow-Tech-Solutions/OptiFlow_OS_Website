# Contact & Support

## Purpose

Define the structure and behavior of the Contact & Support page — a multi-channel communication hub combining lead capture, sales contact, support channels, office information, and response time commitments.

## ADDED Requirements

### Requirement: Enquiry Form

The Contact page SHALL include a lead capture form with 7 fields using the shared `submitForm()` function from core.js for Netlify Forms submission.

#### Scenario: Form fields render

- **GIVEN** the assembled contact page
- **WHEN** the page renders
- **THEN** a `<form id="contactForm">` SHALL be present with 7 fields: Full Name (required), Company Name (required), Mobile Number (required), Email Address (required), Team Size (select), Industry (select), Current Operational Challenges (textarea)
- **AND** required fields SHALL have `required` attribute and `aria-invalid` support
- **AND** the form SHALL have `data-netlify="true"` and `name="contact"` attributes

#### Scenario: Form uses shared submission

- **GIVEN** the contact form is submitted
- **WHEN** the form passes client-side validation
- **THEN** the form SHALL be handled by `core.js` `submitForm()` function
- **AND** no custom `fetch()`, `XMLHttpRequest`, or form `onsubmit` handler SHALL exist in page scripts

#### Scenario: Validation errors display

- **GIVEN** the contact form with empty required fields
- **WHEN** the form is submitted
- **THEN** error messages SHALL display below each invalid field with class `visible`
- **AND** invalid inputs SHALL have class `error` and `aria-invalid="true"`
- **AND** email field SHALL validate format via regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **AND** phone field SHALL validate format via regex `/^\+?\d{7,15}$/`

#### Scenario: Success state displays

- **GIVEN** the contact form submits successfully
- **WHEN** the form enters success state
- **THEN** form fields SHALL be hidden
- **AND** a success message with checkmark icon SHALL display
- **AND** a "Expect a response within 24 hours" badge SHALL appear with animated pulse dot

### Requirement: Sales Contact Channels

The Contact page SHALL display 3 sales contact channels with icons, descriptions, and action links.

#### Scenario: Sales channels render

- **GIVEN** the assembled contact page, Sales Contact section
- **WHEN** the page renders
- **THEN** 3 `.contact-chan` cards SHALL display: Call Us (with `{{PHONE}}`), Email Us (with `{{EMAIL}}`), WhatsApp (with `{{PHONE}}`)
- **AND** each channel SHALL have an accent SVG icon, heading, detail text with hours, and action link text with arrow
- **AND** phone channels SHALL show "Mon — Sat, 10 AM — 7 PM IST"
- **AND** email channel SHALL show "Response within 4—8 business hours"

### Requirement: Support Contact Channels

The Contact page SHALL display 3 support contact channels with teal icons.

#### Scenario: Support channels render

- **GIVEN** the assembled contact page, Support section
- **WHEN** the page renders
- **THEN** 3 `.contact-chan` cards SHALL display: Support Email, Helpdesk Portal, Knowledge Base
- **AND** each channel SHALL have a teal icon (`--teal-soft` background, `--teal` color)
- **AND** Support Email SHALL show "support@optiflow.in" with 4—8 hour response time
- **AND** Helpdesk Portal SHALL reference dashboard access
- **AND** Knowledge Base SHALL reference self-serve guides and tutorials

### Requirement: Office Information

The Contact page SHALL display office location, contact details, and operating hours.

#### Scenario: Office card renders

- **GIVEN** the assembled contact page, Office section
- **WHEN** the page renders
- **THEN** an `.office-card` SHALL display: location ("Surat, Gujarat, India"), phone (`{{PHONE}}`), email (`{{EMAIL}}`), hours ("Mon — Sat, 10 AM — 7 PM IST")
- **AND** the location SHALL use `{{LOCATION}}` placeholder
- **AND** an "Open for business" badge SHALL be displayed with green styling

### Requirement: Response Time Commitments

The Contact page SHALL display 4 response time commitment cards with color-coded icons.

#### Scenario: Response cards render

- **GIVEN** the assembled contact page, Response Time section
- **WHEN** the page renders
- **THEN** a `.response-grid` SHALL display 4 `.response-card` items: Sales Enquiries (accent icon), Support Requests (teal icon), Critical Issues (red icon), Demo Requests (green icon)
- **AND** each card SHALL display a `.response-time` value in monospace font

### Requirement: Trust Bar with Counters

The Contact page SHALL display a trust bar with 4 animated count-up statistics.

#### Scenario: Counter animation

- **GIVEN** the trust bar section
- **WHEN** the section enters the viewport
- **THEN** counters SHALL animate from 0 to their target values: 500, 10000, 250000, 1200
- **AND** counters SHALL use `data-count` attributes processed by core.js

### Requirement: Contact-Specific FAQ

The Contact page SHALL include a FAQ accordion with 7 questions relevant to the contact and support context.

#### Scenario: FAQ questions render

- **GIVEN** the FAQ section of the contact page
- **WHEN** the page renders
- **THEN** 7 `.faq-item` elements SHALL be present using the shared FAQ accordion pattern
- **AND** questions SHALL cover: response time, demo scheduling, industry support, implementation services, team participation, post-submission process, post-go-live support

### Requirement: Hero Section with Illustration

The Contact page SHALL feature a hero section with a badge, heading, lead text, dual CTAs, and a visual illustration with stats.

#### Scenario: Hero renders

- **GIVEN** the assembled contact page
- **WHEN** the page renders
- **THEN** a hero section SHALL display a "LET'S TALK ABOUT YOUR BUSINESS" badge, an H1, lead paragraph, and two CTA buttons: "Contact Our Team" (primary) and "Book Free Demo" (secondary)
- **AND** a `.hero-illus` SHALL display a chat SVG illustration with floating animation
- **AND** 3 `.hil-stat` items SHALL display: "4hrs Avg Response Time", "500+ Businesses Served", "7 Industries"

### Requirement: Dual CTA Section

The Contact page SHALL include a final CTA section with dual action buttons at the bottom of the page.

#### Scenario: Final CTA renders

- **GIVEN** the assembled contact page
- **WHEN** the page renders
- **THEN** a `.cta-section` SHALL display with heading "Let's Build A More Accountable And Scalable Business Together"
- **AND** two buttons SHALL be present: "Contact Our Team" (primary, links to #contact-form) and "Book Free Demo" (secondary, links to /demo-booking/)

### Requirement: Placeholder Compliance

The Contact page SHALL use `{{PLACEHOLDER}}` variables for all company data resolved from `site.json`.

#### Scenario: No hardcoded company data

- **GIVEN** the contact page source file
- **WHEN** inspected
- **THEN** `{{PHONE}}`, `{{EMAIL}}`, `{{LOCATION}}` placeholders SHALL be used for all company contact information
- **AND** no hardcoded phone numbers, email addresses, or locations SHALL be present except `support@optiflow.in` (distinct from main email)

### Requirement: Dark Mode Support

The Contact page SHALL render correctly in both light and dark themes.

#### Scenario: Dark mode overrides

- **GIVEN** the page's `<style>` block
- **WHEN** inspected
- **THEN** `[data-theme="dark"]` rules SHALL exist for: `.contact-chan`, `.response-card`, `.office-card`, `.form-input:focus`
- **AND** all dark mode color values SHALL use `color-mix()` or `var()` functions

### Requirement: Responsive Layout

The Contact page SHALL adapt to tablet and mobile viewports.

#### Scenario: Tablet layout

- **GIVEN** viewport ≤ 1024px
- **WHEN** the page renders
- **THEN** hero grid SHALL collapse to single column
- **AND** response grid SHALL display 2 columns

#### Scenario: Mobile layout

- **GIVEN** viewport ≤ 768px
- **WHEN** the page renders
- **THEN** form grid SHALL collapse to single column
- **AND** hero CTA buttons SHALL stack vertically
- **AND** hero illustration stats SHALL stack vertically

#### Scenario: Small mobile

- **GIVEN** viewport ≤ 480px
- **WHEN** the page renders
- **THEN** trust metrics SHALL display 2 columns
- **AND** response grid SHALL collapse to single column
