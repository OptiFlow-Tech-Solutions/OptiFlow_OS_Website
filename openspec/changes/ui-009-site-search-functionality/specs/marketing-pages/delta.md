# Delta: Marketing Pages → UI-009 Site Search

## MODIFIED

### Requirement: Page Structure

The system SHALL maintain a consistent page structure on every page.

#### Scenario: Structural ordering

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** the content SHALL follow the order: navigation (`<header>`) → main content (`<main>`) → footer (`<footer>`)
- **AND** a skip-to-content link SHALL precede the navigation
- **AND** the main content area SHALL have `id="content"`
- **AND** the search modal overlay SHALL be present after the footer, outside the `<main>` flow

## ADDED

### Requirement: Site-Wide Search Availability

Every public marketing page SHALL include the site search functionality via injected `search.js` script and nav-embedded search UI.

#### Scenario: Search available on all pages

- **GIVEN** any public (non-noindex) assembled page
- **WHEN** the page is loaded
- **THEN** the search toggle button SHALL be visible in the navigation bar
- **AND** `Ctrl+K` SHALL open the search modal
- **AND** the search modal SHALL be present in the DOM with `aria-hidden="true"`

#### Scenario: Search respects noindex pages

- **GIVEN** the admin page (`noindex: true`)
- **WHEN** the search index is built
- **THEN** the admin page SHALL NOT appear in `search-index.json`
- **AND** the admin page SHALL NOT appear in search results
