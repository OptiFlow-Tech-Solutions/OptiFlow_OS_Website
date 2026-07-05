# Delta: Shared Components → UI-009 Site Search

## ADDED

### Requirement: Search Toggle Button

The navigation partial SHALL include a search toggle button that opens the site search modal overlay.

#### Scenario: Search button present in nav

- **GIVEN** the navigation partial at `src/partials/nav.html`
- **WHEN** the page renders
- **THEN** a `<button class="search-toggle">` SHALL be present in the `.nav-cta` area
- **AND** the button SHALL contain a search (magnifying glass) SVG icon
- **AND** the button SHALL have `aria-label="Search"`
- **AND** the button SHALL have `title="Search (Ctrl+K)"`

#### Scenario: Search button styled consistently

- **GIVEN** the search toggle button
- **WHEN** the page renders
- **THEN** it SHALL be 38x38px with centered icon
- **AND** hover state SHALL use `--fg-soft` background
- **AND** the icon color SHALL be `--muted`, transitioning to `--fg` on hover

### Requirement: Search Modal Overlay

The navigation partial SHALL include a search modal overlay markup for client-side search.

#### Scenario: Search modal structure

- **GIVEN** the navigation partial at `src/partials/nav.html`
- **WHEN** the page renders
- **THEN** a `<div class="search-overlay" id="searchModal">` SHALL be present
- **AND** the overlay SHALL have `role="dialog"`, `aria-label="Site search"`, and `aria-hidden="true"`
- **AND** it SHALL contain a `.search-panel` with a `.search-input-wrap` (icon + input#searchInput) and a `.search-results` container

#### Scenario: Search modal is hidden by default

- **GIVEN** the search modal overlay
- **WHEN** the page loads
- **THEN** the overlay SHALL have `aria-hidden="true"`
- **AND** it SHALL be visually hidden (opacity 0, visibility hidden)

### Requirement: Search CSS Variables

The core.css `:root` SHALL define `--z-search: 200` for search overlay stacking context.

#### Scenario: Search z-index variable defined

- **GIVEN** the core.css `:root` block
- **WHEN** inspected
- **THEN** `--z-search: 200` SHALL be defined

### Requirement: Search Overlay Styles

Core.css SHALL provide styles for `.search-overlay`, `.search-panel`, `.search-input-wrap`, `.search-results`, `.search-result`, `.search-empty`, highlight marks, and responsive breakpoints.

#### Scenario: Search overlay uses CSS variables

- **GIVEN** the search overlay styles
- **WHEN** the page renders in dark mode
- **THEN** all colors SHALL adapt automatically via CSS custom properties
- **AND** no hardcoded hex colors SHALL appear in the search overlay styles

#### Scenario: Search result highlighting

- **GIVEN** a search result with `<mark>` tags
- **WHEN** the page renders
- **THEN** highlighted text SHALL use `color-mix(in oklch, var(--teal) 20%, transparent)` background
- **AND** the text color SHALL remain `--fg` for readability

#### Scenario: Keyboard navigation styling

- **GIVEN** search results with arrow key navigation
- **WHEN** a result has class `.selected`
- **THEN** it SHALL have `--fg-soft` background matching the hover state

### Requirement: Client-Side Search Engine

The system SHALL provide a `search.js` module that loads `search-index.json` and performs client-side text search with ranked results.

#### Scenario: Search index loaded on demand

- **GIVEN** the search modal is opened for the first time
- **WHEN** `openModal()` is called
- **THEN** `fetch('/search-index.json')` SHALL be called
- **AND** the response SHALL be cached for subsequent opens

#### Scenario: Query scoring algorithm

- **GIVEN** a search query of 2+ characters
- **WHEN** `search(query)` is called
- **THEN** results SHALL be ranked by: exact title match (100) > title starts-with (90) > title contains (70) > description contains (40) > excerpt contains (30)
- **AND** top 8 results SHALL be returned

#### Scenario: Result rendering with highlights

- **GIVEN** a set of search results
- **WHEN** `renderResults(items, query)` is called
- **THEN** each result SHALL display as a linked card with title and description
- **AND** query terms SHALL be wrapped in `<mark>` tags
- **AND** an empty state message SHALL display when no results match

#### Scenario: Keyboard navigation

- **GIVEN** the search modal is open with results
- **WHEN** ArrowDown key is pressed
- **THEN** the next result SHALL be selected
- **WHEN** ArrowUp key is pressed
- **THEN** the previous result SHALL be selected
- **WHEN** Enter key is pressed on a selected result
- **THEN** the browser SHALL navigate to the result's URL

#### Scenario: Modal dismiss behavior

- **GIVEN** the search modal is open
- **WHEN** Escape key is pressed
- **THEN** the modal SHALL close and input SHALL be cleared
- **WHEN** the user clicks outside the `.search-panel`
- **THEN** the modal SHALL close

#### Scenario: Keyboard shortcut

- **GIVEN** any page
- **WHEN** the user presses Ctrl+K (or Cmd+K on macOS)
- **THEN** the search modal SHALL open
