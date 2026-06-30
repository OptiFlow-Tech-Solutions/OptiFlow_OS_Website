## MODIFIED Requirements

### Requirement: Page Inventory

The system SHALL render exactly 13 marketing pages as defined in the `site.json` pages array.

#### Scenario: All pages present

- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Why-OptiFlow, Feature-Showcase, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, and Terms
- **WHEN** `npm run build` is executed
- **THEN** all 13 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated

### Requirement: Source File Naming

Source page files SHALL be named to match their purpose. The feature showcase page source SHALL be `feature-showcase.html`.

#### Scenario: Feature Showcase source file

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `feature-showcase.html` SHALL exist
