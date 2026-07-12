## ADDED Requirements

### Requirement: Route-level code splitting via React.lazy
The system SHALL lazy-load all page components using `React.lazy()`, ensuring each page's code is split into a separate chunk by the bundler.

#### Scenario: Each page has its own chunk
- **WHEN** the production build completes
- **THEN** the Vite output contains separate JavaScript chunks for each page component

#### Scenario: Page code loads on demand
- **WHEN** a user navigates to a page for the first time
- **THEN** the browser fetches only that page's JavaScript chunk

#### Scenario: Home page loads eagerly
- **WHEN** the application first loads
- **THEN** the Home page component and its dependencies are included in the initial bundle (not lazy-loaded)

### Requirement: Single Suspense boundary for all routes
The system SHALL wrap all lazy-loaded routes in a single `<Suspense>` boundary at the router level, displaying a page loader fallback during chunk loading.

#### Scenario: Loader shown during chunk fetch
- **WHEN** a user navigates to a lazy-loaded page and the chunk is still downloading
- **THEN** a page loader (spinner or skeleton) is displayed inside the PageLayout

#### Scenario: Loader respects page layout
- **WHEN** the Suspense fallback renders
- **THEN** the loader is rendered inside the `<main>` content area, preserving Nav and Footer visibility

#### Scenario: No loader flash on subsequent visits
- **WHEN** a user revisits a previously loaded page
- **THEN** the page renders immediately without showing the loader (chunk is cached)
