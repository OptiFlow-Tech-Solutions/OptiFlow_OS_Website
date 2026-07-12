## ADDED Requirements

### Requirement: Centralized route configuration
The system SHALL provide a single `routes.ts` module that defines all SPA routes as an array of route objects, each containing `path`, `component` (lazy-loaded), `title`, and `description` fields.

#### Scenario: All 15 routes are registered
- **WHEN** a developer inspects `routes.ts`
- **THEN** the module exports an array of 15 route objects covering all 14 product pages and 1 catch-all 404

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
- **THEN** React Router renders 14 product page routes plus 1 catch-all 404 route

#### Scenario: Routes use PageLayout as wrapper
- **WHEN** any valid route is rendered
- **THEN** the page is wrapped with Nav, Footer, ScrollTop, and StickyCTA via the `<PageLayout>` outlet

#### Scenario: BrowserRouter basename is /os
- **WHEN** the user navigates to `/os/pricing/`
- **THEN** React Router matches the `/pricing/` path relative to the `/os` basename

### Requirement: Catch-all 404 route
The route configuration SHALL include a wildcard `*` path as the last route that renders a NotFound component for any unmatched `/os/*` URL.

#### Scenario: Unknown path renders 404
- **WHEN** a user navigates to `/os/nonexistent-page/`
- **THEN** the NotFound component renders with a 404 message

#### Scenario: 404 page includes navigation options
- **WHEN** the NotFound component renders
- **THEN** it displays links to Home, Product Overview, Features, Pricing, Contact, and FAQ

### Requirement: Document head updates on route change
The system SHALL update the document `<title>` and `<meta name="description">` tags to match the current route's metadata on every navigation.

#### Scenario: Title updates on navigation
- **WHEN** the user navigates from Home to Pricing
- **THEN** the document title changes to the Pricing page title from the route config

#### Scenario: Meta description updates on navigation
- **WHEN** the user navigates to any page
- **THEN** the `<meta name="description">` content reflects that page's description from the route config

#### Scenario: Default title on 404
- **WHEN** the NotFound component renders
- **THEN** the document title is "Page Not Found — OptiFlow OS"
