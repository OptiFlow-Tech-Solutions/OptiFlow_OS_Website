# site-data-centralization

## Purpose

Shared site configuration module (`frontend/src/data/site.ts`) that Nav, Footer, and page components consume to eliminate hardcoded company data and navigation links. Data derived from canonical `site.json` with manual sync until API is live.

## Requirements

### Requirement: Centralized site configuration module exists
The system SHALL provide a TypeScript module at `frontend/src/data/site.ts` that exports typed objects for navigation links, footer columns, and company contact information, with data derived from the canonical `site.json`.

#### Scenario: Module exports nav configuration
- **WHEN** importing `navLinks`, `navDropdown`, and `navCTA` from the site module
- **THEN** each export contains the link arrays matching `site.json.nav.links`, `site.json.nav.dropdown`, and `site.json.nav.cta`

#### Scenario: Module exports footer configuration
- **WHEN** importing `footerColumns` from the site module
- **THEN** the export contains the 4-column link structure matching `site.json.footer.columns`

#### Scenario: Module exports company info
- **WHEN** importing `site` from the site module
- **THEN** the export contains `name`, `phone`, `email`, `whatsapp`, `location`, `tagline`, and `year` fields matching `site.json`

#### Scenario: Module is fully typed
- **WHEN** using any export from the site module
- **THEN** TypeScript provides autocomplete and type-checking for all fields; no `any` types are used

### Requirement: Nav component consumes site config
The system SHALL refactor the Nav component to import navigation data from the site module instead of using hardcoded link arrays within the component file.

#### Scenario: Nav links come from site module
- **WHEN** Nav component renders
- **THEN** the rendered nav links match the data exported from the site module's `navLinks`

#### Scenario: Nav dropdown comes from site module
- **WHEN** Nav component renders
- **THEN** the Resources dropdown items match the data exported from the site module's `navDropdown`

#### Scenario: Nav CTA comes from site module
- **WHEN** Nav component renders
- **THEN** the "Book Demo" button label and href match the data exported from the site module's `navCTA`

### Requirement: Footer component consumes site config
The system SHALL refactor the Footer component to import footer column data and company info from the site module instead of using hardcoded data or default props.

#### Scenario: Footer columns come from site module
- **WHEN** Footer component renders
- **THEN** the column links match the data exported from the site module's `footerColumns`

#### Scenario: Footer company info comes from site module
- **WHEN** Footer component renders
- **THEN** the phone, email, location, tagline, and copyright year come from the site module's `site` export

### Requirement: site config sync validation
The system SHALL provide a validation check that compares the site module against `site.json` and warns if they diverge.

#### Scenario: Validation detects drift
- **WHEN** `npm run validate` executes
- **THEN** if site module data differs from `site.json`, a warning is emitted listing the specific mismatched fields

#### Scenario: Validation passes on match
- **WHEN** the site module and `site.json` contain identical data
- **THEN** no warning is emitted
