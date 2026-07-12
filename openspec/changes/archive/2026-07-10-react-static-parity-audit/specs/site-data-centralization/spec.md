## ADDED Requirements

### Requirement: Centralized site configuration module exists
The system SHALL provide a TypeScript module at `frontend/src/data/siteConfig.ts` that exports typed objects for navigation links, footer columns, and company contact information, with data derived from the canonical `site.json`.

#### Scenario: Module exports nav configuration
- **WHEN** importing `navLinks`, `navDropdown`, and `navCTA` from `siteConfig`
- **THEN** each export contains the link arrays matching `site.json.nav.links`, `site.json.nav.dropdown`, and `site.json.nav.cta`

#### Scenario: Module exports footer configuration
- **WHEN** importing `footerColumns` from `siteConfig`
- **THEN** the export contains the 4-column link structure matching `site.json.footer.columns`

#### Scenario: Module exports company info
- **WHEN** importing `company` from `siteConfig`
- **THEN** the export contains `name`, `phone`, `email`, `whatsapp`, `location`, and `year` fields matching `site.json`

#### Scenario: Module is fully typed
- **WHEN** using any export from `siteConfig`
- **THEN** TypeScript provides autocomplete and type-checking for all fields; no `any` types are used

### Requirement: Nav component consumes site config
The system SHALL refactor the Nav component to import navigation data from `siteConfig` instead of using hardcoded link arrays within the component file.

#### Scenario: Nav links come from siteConfig
- **WHEN** Nav component renders
- **THEN** the rendered nav links match the data exported from `siteConfig.navLinks`

#### Scenario: Nav dropdown comes from siteConfig
- **WHEN** Nav component renders
- **THEN** the Resources dropdown items match the data exported from `siteConfig.navDropdown`

#### Scenario: Nav CTA comes from siteConfig
- **WHEN** Nav component renders
- **THEN** the "Book Demo" button label and href match the data exported from `siteConfig.navCTA`

### Requirement: Footer component consumes site config
The system SHALL refactor the Footer component to import footer column data and company info from `siteConfig` instead of using hardcoded data.

#### Scenario: Footer columns come from siteConfig
- **WHEN** Footer component renders
- **THEN** the column links match the data exported from `siteConfig.footerColumns`

#### Scenario: Footer company info comes from siteConfig
- **WHEN** Footer component renders
- **THEN** the phone, email, location, and copyright year come from `siteConfig.company`

### Requirement: siteConfig sync validation
The system SHALL provide a validation check that compares `siteConfig.ts` against `site.json` and warns if they diverge.

#### Scenario: Validation detects drift
- **WHEN** `npm run validate` executes
- **THEN** if `siteConfig.ts` data differs from `site.json`, a warning is emitted listing the specific mismatched fields

#### Scenario: Validation passes on match
- **WHEN** `siteConfig.ts` and `site.json` contain identical data
- **THEN** no warning is emitted
