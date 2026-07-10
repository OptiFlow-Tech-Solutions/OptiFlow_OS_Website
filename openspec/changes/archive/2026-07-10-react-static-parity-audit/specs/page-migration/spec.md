## ADDED Requirements

### Requirement: 500 error page route added
The system SHALL add a `/500` route in `routes.ts` pointing to a new `ServerError.tsx` page component, and the `App.tsx` root SHALL wrap its content in a React error boundary that navigates to `/500` on unhandled render errors.

#### Scenario: 500 page renders on server error
- **WHEN** an unhandled React error occurs during rendering
- **THEN** the user sees a 500 error page with error code "500", a descriptive heading, a lead paragraph explaining the issue, navigation links to Home and Contact, and company contact information

#### Scenario: 500 page content matches static 500.html
- **WHEN** comparing React 500 page with static `500.html`
- **THEN** the error code, heading text, lead text, suggested links, and contact info match the static source

#### Scenario: 500 page is not the 404 catch-all
- **WHEN** the 500 error page renders
- **THEN** the browser title is "Server Error — OptiFlow OS" not "Page Not Found — OptiFlow OS"

### Requirement: ArticleDetail page is additive not regressive
The system SHALL preserve the ArticleDetail page at `/newsletter/:slug` as an additive feature beyond static parity. It SHALL NOT be removed or altered to match static behavior since the static site has no equivalent.

#### Scenario: ArticleDetail route is preserved
- **WHEN** the route configuration is complete
- **THEN** `/newsletter/:slug` remains in routes.ts as a lazy-loaded route
