## MODIFIED Requirements

### Requirement: Navigation Links

The navigation bar SHALL include a "Showcase" link pointing to `/feature-showcase/`.

#### Scenario: Showcase nav link present

- **GIVEN** `site.json` nav configuration
- **WHEN** inspected
- **THEN** the `nav.links` array SHALL include `{ "label": "Showcase", "href": "/feature-showcase/" }`
