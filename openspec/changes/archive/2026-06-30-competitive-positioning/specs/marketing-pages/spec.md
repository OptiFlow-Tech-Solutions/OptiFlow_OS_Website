## MODIFIED Requirements

### Requirement: Page Inventory

The system SHALL render exactly 14 marketing pages as defined in the `site.json` pages array.

#### Scenario: All pages present
- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Feature-Showcase, Why-OptiFlow, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, Terms, and Competitive-Positioning
- **WHEN** `npm run build` is executed
- **THEN** all 14 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated

## ADDED Requirements

### Requirement: Resources Dropdown Includes Competitive Positioning

The Resources dropdown in both desktop nav and mobile drawer SHALL contain Newsletter, FAQ, and Competitive Positioning.

#### Scenario: Resources dropdown content
- **GIVEN** the nav is rendered
- **WHEN** the Resources dropdown is opened
- **THEN** it SHALL display "Newsletter", "FAQ", and "Competitive Positioning"
- **AND** the Competitive Positioning link SHALL point to `/competitive-positioning/`

### Requirement: Footer Includes Competitive Positioning Link

The footer Resource links SHALL include a link to the Competitive Positioning page.

#### Scenario: Footer resource links
- **GIVEN** the footer partial
- **WHEN** inspected
- **THEN** the Resources column SHALL include "Competitive Positioning" link pointing to `/competitive-positioning/`
