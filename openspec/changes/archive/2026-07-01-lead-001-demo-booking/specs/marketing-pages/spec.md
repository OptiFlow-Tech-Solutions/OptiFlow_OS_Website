# Marketing Pages — Delta

## MODIFIED Requirements

### Requirement: Page Inventory
The system SHALL render exactly 14 marketing pages as defined in the `site.json` pages array. The FAQ page SHALL now include interactive self-service components beyond its original static Q&A format. The demo booking and contact pages SHALL use the shared `submitForm()` function from core.js for real form submission instead of `alert()`.

#### Scenario: All pages present
- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Feature-Showcase, Why-OptiFlow, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, Terms, and Competitive-Positioning
- **WHEN** `npm run build` is executed
- **THEN** all 14 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated
- **AND** the FAQ page SHALL include self-service toolbar, feedback buttons, troubleshooting widget, and escalation section

#### Scenario: Demo booking form submits to endpoint
- **GIVEN** the assembled demo-booking page
- **WHEN** a user fills and submits the booking form
- **THEN** the form data SHALL be posted to the configured endpoint via core.js `submitForm()`
- **AND** the form SHALL display submitting/success/error states
- **AND** the calendar slot data SHALL be included in the payload

#### Scenario: Contact form submits to endpoint
- **GIVEN** the assembled contact page
- **WHEN** a user fills and submits the contact form
- **THEN** the form data SHALL be posted to the configured endpoint via core.js `submitForm()`
- **AND** the form SHALL display submitting/success/error states

### Requirement: Shared Logic Deduplication

Page-specific scripts SHALL NOT duplicate logic already handled by `core.js`. Sticky CTA visibility, scroll-to-top, scroll reveal, stagger animation, FAQ accordion, counter animation, AND form submission SHALL be handled exclusively by core.js. Page-specific CSS SHALL NOT redefine stagger animation keyframes or transition rules already provided by core.css `.stagger-3`/`.stagger-4`/`.stagger-5` utility classes.

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

#### Scenario: No duplicate form submission logic
- **GIVEN** the demo-booking and contact pages
- **WHEN** page-specific scripts are inspected
- **THEN** no `fetch()` calls, `XMLHttpRequest`, or form `onsubmit` handlers SHALL be present for form submission
- **AND** form submission SHALL be handled exclusively by core.js `submitForm()`
