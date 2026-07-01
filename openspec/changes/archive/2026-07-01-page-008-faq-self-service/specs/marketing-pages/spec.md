## MODIFIED Requirements

### Requirement: Page Inventory
The system SHALL render exactly 14 marketing pages as defined in the `site.json` pages array. The FAQ page SHALL now include interactive self-service components beyond its original static Q&A format.

#### Scenario: All pages present
- **GIVEN** `site.json` contains entries for Home, Problem-Solutions, Product-Overview, Features, Feature-Showcase, Why-OptiFlow, Pricing, Newsletter, FAQ, Contact, Demo-Booking, Privacy-Policy, Terms, and Competitive-Positioning
- **WHEN** `npm run build` is executed
- **THEN** all 14 pages SHALL be generated in `dist/` with corresponding directory structures
- **AND** only pages defined in `site.json` SHALL be generated
- **AND** the FAQ page SHALL include self-service toolbar, feedback buttons, troubleshooting widget, and escalation section
