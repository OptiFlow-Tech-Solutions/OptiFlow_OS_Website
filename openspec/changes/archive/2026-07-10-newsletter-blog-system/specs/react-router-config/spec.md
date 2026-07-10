# react-router-config

## MODIFIED Requirements

### Requirement: Centralized route configuration
The system SHALL provide a single `routes.ts` module that defines all SPA routes as an array of route objects, each containing `path`, `component` (lazy-loaded), `title`, and `description` fields.

#### Scenario: All 16 routes are registered
- **WHEN** a developer inspects `routes.ts`
- **THEN** the module exports an array of 16 route objects covering all 15 product pages and 1 catch-all 404

#### Scenario: Route config is the single source of truth
- **WHEN** `App.tsx` needs to render routes
- **THEN** it maps over the exported route array to generate `<Route>` elements

#### Scenario: Each route has title and description
- **WHEN** any route object is inspected
- **THEN** it contains a non-empty `title` and `description` string matching the values from `site.json`

### Requirement: App.tsx renders all routes via React Router
The `App.tsx` component SHALL render a `<Routes>` element containing one `<Route>` per entry in the route configuration, all wrapped in the existing `<PageLayout>` layout route.

#### Scenario: App renders all configured routes
- **WHEN** the application mounts
- **THEN** React Router renders 15 product page routes plus 1 catch-all 404 route

#### Scenario: Routes use PageLayout as wrapper
- **WHEN** any valid route is rendered
- **THEN** the page is wrapped with Nav, Footer, ScrollTop, and StickyCTA via the `<PageLayout>` outlet

#### Scenario: BrowserRouter basename is /os
- **WHEN** the user navigates to `/os/pricing/`
- **THEN** React Router matches the `/pricing/` path relative to the `/os` basename
