## MODIFIED Requirements

### Requirement: Footer link data from siteConfig
The system SHALL source footer link column data and company contact information from `siteConfig` rather than hardcoded values or direct `site.json` imports.

#### Scenario: Product column matches siteConfig
- **WHEN** Footer is rendered
- **THEN** the Product column links match the href and label values defined in `siteConfig.footerColumns` for the Product section

#### Scenario: Solutions column matches siteConfig
- **WHEN** Footer is rendered
- **THEN** the Solutions column links match the href and label values defined in `siteConfig.footerColumns` for the Solutions section

#### Scenario: Resources column matches siteConfig
- **WHEN** Footer is rendered
- **THEN** the Resources column links match the href and label values defined in `siteConfig.footerColumns` for the Resources section

#### Scenario: Contact column matches siteConfig
- **WHEN** Footer is rendered
- **THEN** the Contact column links (phone, email) and location text match `siteConfig.company`
