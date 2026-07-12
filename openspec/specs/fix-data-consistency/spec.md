# fix-data-consistency

## Purpose

Ensure all React pages use the canonical data source (`data/site.js`) for company contact information (phone, email, WhatsApp) instead of hardcoded string literals. Resolve data conflicts between pages (pricing ranges) and fix template bugs.

## Requirements

### Requirement: No hardcoded company contact data in pages
All React pages SHALL import phone, email, and WhatsApp values from `data/site.js` instead of hardcoding string literals.

#### Scenario: Contact page uses site.email
- **WHEN** inspecting Contact.jsx source
- **THEN** the support email is rendered from `site.email`, not a hardcoded string

#### Scenario: FAQ page uses site.phone
- **WHEN** inspecting FAQ.jsx source
- **THEN** the phone number is rendered from `site.phone`, not a hardcoded string

#### Scenario: FAQ page uses site.whatsapp
- **WHEN** inspecting FAQ.jsx source
- **THEN** the WhatsApp link uses `site.whatsapp`, not a hardcoded number

#### Scenario: PrivacyPolicy page uses site.email
- **WHEN** inspecting PrivacyPolicy.jsx source
- **THEN** all email addresses are rendered from `site.email`, not hardcoded strings

#### Scenario: Terms page uses site.email
- **WHEN** inspecting Terms.jsx source
- **THEN** all email addresses are rendered from `site.email`, not hardcoded strings

### Requirement: Home page WhatsApp link is functional
The WhatsApp floating button on the Home page SHALL use the correct WhatsApp number from `data/site.js` instead of the unresolved `{{WHATSAPP}}` template literal.

#### Scenario: WhatsApp button links to correct number
- **WHEN** inspecting the WhatsApp floating button on the Home page
- **THEN** the `href` attribute uses `site.whatsapp` from the data module

### Requirement: Pricing data is consistent across pages
The price ranges displayed on Pricing.jsx and CompetitivePositioning.jsx SHALL be consistent.

#### Scenario: Pricing and Competitive Positioning show matching ranges
- **WHEN** comparing the OptiFlow price range on Pricing page with Competitive Positioning page
- **THEN** both pages show the same numerical range

### Requirement: ServerError date is stable
The ServerError page SHALL use a stable reference ID set once at mount time via `useState` instead of generating a new date on every render.

#### Scenario: Error reference ID does not change on re-render
- **WHEN** the ServerError page re-renders due to parent state changes
- **THEN** the error reference ID displayed on the page remains unchanged
