# faq-page

## Purpose

Full FAQ page ported from static HTML (`src/pages/faq.html`) to a React page component using shared components, static TypeScript data files, and the shared FAQAccordion component.

## Requirements

### Requirement: FAQ page renders all sections
The system SHALL render the FAQ page with these sections in order: hero with search bar, self-service help toolbar (4 cards), category tabs, FAQ accordion list (4 categories, 42 items), troubleshooting wizard, escalation cards, and final CTA.

#### Scenario: Full page load
- **WHEN** user navigates to `/os/faq`
- **THEN** all sections render in order: hero, help cards, category tabs, FAQ accordions, troubleshooting wizard, escalation cards, CTA

### Requirement: FAQ search with text highlighting
The system SHALL provide a search input that filters FAQ items by matching question text and highlights matching terms in the answer when a result is clicked.

#### Scenario: Search returns matches
- **WHEN** user types "pricing" in the search input
- **THEN** matching FAQ items are displayed with category labels and match count

#### Scenario: Search highlights terms in answer
- **WHEN** user clicks a search result
- **THEN** the target FAQ expands and matching search terms are visually highlighted with `<mark>` tags

#### Scenario: No matches found
- **WHEN** user types a query with no matching FAQs
- **THEN** "No matching questions found" message is displayed

#### Scenario: Search suggestion chips
- **WHEN** the page loads
- **THEN** 6 suggestion chips are displayed below the search bar, and clicking one populates the search and triggers filtering

### Requirement: Category tabs with counts
The system SHALL provide category tabs (All, Product, Pricing, Security, Implementation) that filter FAQs, with each tab showing the count of items in that category.

#### Scenario: All tab shows all FAQs
- **WHEN** "All Questions" tab is active
- **THEN** all 42 FAQ items are visible across all categories

#### Scenario: Category tab filters correctly
- **WHEN** user clicks the "Pricing" tab
- **THEN** only the 10 pricing FAQ items are visible

#### Scenario: Category counts display
- **WHEN** the page loads
- **THEN** each category section header shows its item count (e.g., "12 questions")

### Requirement: Self-service help toolbar
The system SHALL display 4 help cards (Video Tutorials, SOP Library, Guided Setup, Troubleshooting) linking to relevant pages.

#### Scenario: Help cards render
- **WHEN** the page loads
- **THEN** 4 help cards are visible with icons, titles, descriptions, and CTAs linking to `/os/features/`, `/os/product-overview/`, `/os/demo-booking/`, and the troubleshooting anchor

### Requirement: Troubleshooting wizard
The system SHALL provide a 3-tier cascading select widget (category → problem → detail) with 5 categories and 15 resolution paths that displays guidance and a CTA link when all 3 selections are made.

#### Scenario: Cascading selects work
- **WHEN** user selects "Login & Access Problems" → "Forgot password"
- **THEN** the resolution panel displays password reset instructions with a "Contact Support" CTA

#### Scenario: All 15 resolution paths resolve
- **WHEN** user selects any valid 3-tier path
- **THEN** a resolution title, description, and action link are displayed

#### Scenario: Changing category resets downstream
- **WHEN** user changes the category select after making deeper selections
- **THEN** the problem and resolution selects reset to default

### Requirement: Escalation cards
The system SHALL display 4 escalation cards (Book a Demo, Email Us, WhatsApp, Call Us) with icons, descriptions, and contact CTAs.

#### Scenario: Escalation cards render
- **WHEN** the page loads below the troubleshooting section
- **THEN** 4 escalation cards are visible with contact links, phone number, and WhatsApp link

### Requirement: FAQ feedback with server-side persistence
The system SHALL provide thumbs up/down buttons on each FAQ answer that POST to `/api/faq/feedback/` and display a thank-you message.

#### Scenario: Helpful feedback submitted
- **WHEN** user clicks "Yes" on an FAQ feedback
- **THEN** a thank-you message replaces the buttons and a POST request is sent with `was_helpful: true`

#### Scenario: Not helpful feedback submitted
- **WHEN** user clicks "No" on an FAQ feedback
- **THEN** a thank-you message with follow-up links appears and a POST request is sent with `was_helpful: false`

### Requirement: Category-specific micro-CTAs
Each FAQ category section SHALL end with a micro-CTA banner relevant to that category (Product: "Book Demo", Pricing: "View Pricing", Security: "Contact Security Team", Implementation: "Book Demo").

#### Scenario: Product micro-CTA
- **WHEN** user scrolls to the end of the Product FAQ section
- **THEN** a "Ready to see the product in action?" micro-CTA with a "Book Demo" button is displayed

### Requirement: Page uses shared components
The FAQ page SHALL use `Section`, `Container`, `Card`, `Button`, and `FAQAccordion` shared components instead of raw HTML elements.

#### Scenario: Shared component usage
- **WHEN** inspecting FAQ page source
- **THEN** all sections use `<Section>`, cards use `<Card>`, CTAs use `<Button as={Link}>`, and accordion items use `<FAQAccordion>`
