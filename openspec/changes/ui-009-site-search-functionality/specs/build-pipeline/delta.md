# Delta: Build Pipeline → UI-009 Site Search

## ADDED

### Requirement: Search Index Generation

The build pipeline SHALL generate a `search-index.json` file after all pages are assembled, containing title, description, URL, and content excerpts for every public (non-noindex) page.

#### Scenario: Search index generated after build

- **GIVEN** all pages have been assembled into `dist/`
- **WHEN** the build pipeline runs `generateSearchIndex()`
- **THEN** `dist/search-index.json` SHALL be created
- **AND** each entry SHALL contain `url`, `title`, `description`, and `excerpt` fields
- **AND** pages with `noindex: true` SHALL be excluded from the index
- **AND** excerpts SHALL be extracted from the page's `<main>` content, truncated to 300 characters

#### Scenario: Index file size is reasonable

- **GIVEN** the current site has 14 public pages
- **WHEN** the search index is generated
- **THEN** the file size SHALL be under 15 KB

### Requirement: Search Script Injection

The build pipeline SHALL inject `<script src="/assets/js/search.js" defer></script>` into the `<head>` of every assembled page.

#### Scenario: Search script present in all pages

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** `<script src="/assets/js/search.js" defer></script>` SHALL be present in `<head>`

### Requirement: Search Asset Provision

The `assets/js/search.js` file SHALL be copied to `dist/assets/js/search.js` as part of the shared assets copy step.

#### Scenario: Search JS available at runtime

- **GIVEN** the build has completed
- **WHEN** the `dist/assets/js/` directory is inspected
- **THEN** `search.js` SHALL exist
