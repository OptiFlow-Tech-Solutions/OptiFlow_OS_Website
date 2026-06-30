## MODIFIED Requirements

### Requirement: Page Metadata Source of Truth

All SEO metadata (title, description) in page source files SHALL use build-time placeholders that resolve from `site.json`.

#### Scenario: Title uses placeholder

- **GIVEN** any page source file in `src/pages/`
- **WHEN** the file is inspected
- **THEN** the `<title>` tag SHALL contain `{{PAGE_TITLE}}` as its content
- **AND** the title SHALL NOT be hardcoded in the source file

#### Scenario: Description uses placeholder

- **GIVEN** any page source file in `src/pages/`
- **WHEN** the file is inspected
- **THEN** the `<meta name="description">` tag SHALL use `{{PAGE_DESCRIPTION}}` as its content attribute
- **AND** the `<meta property="og:description">` tag SHALL use `{{PAGE_DESCRIPTION}}` as its content attribute
- **AND** the description SHALL NOT be hardcoded in the source file
