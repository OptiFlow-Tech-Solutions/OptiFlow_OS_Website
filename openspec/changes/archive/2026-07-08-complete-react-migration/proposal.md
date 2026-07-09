## Why

The React migration from the legacy static HTML frontend was started but never completed. Two pages (Features, FeatureShowcase) are ~85% placeholder stubs, two React pages (CompetitivePositioning, ServerError) exist as source files but have no routes, and the Docker build pipeline still compiles 8,500+ lines of old HTML that are thrown away. This leaves the site in a half-migrated state where the SPA is technically deployed but key pages are non-functional and the production build is wasteful.

## What Changes

- **Complete stub pages**: Migrate all remaining content from old HTML into Features.jsx (10 missing feature sections) and FeatureShowcase.jsx (5 missing transformation sections)
- **Wire missing routes**: Add `<Route>` entries for CompetitivePositioning and ServerError in App.jsx; add ServerError to the barrel export in `pages/index.js`
- **Clean Docker pipeline**: Remove the old `assemble.mjs` build from Dockerfile stages. The old HTML is never copied to the final nginx image. Only retain the root redirect page, sitemap, robots.txt, manifest.json, and image optimization from the old build
- **Fix data consistency**: Replace hardcoded emails and phone numbers with `site` data imports in Contact.jsx, FAQ.jsx, PrivacyPolicy.jsx, Terms.jsx; fix `{{WHATSAPP}}` unresolved template in Home.jsx; resolve conflicting price ranges between Pricing.jsx and CompetitivePositioning.jsx
- **Refactor shared component usage**: Replace raw `<section className="section">`, `<div className="card">`, and `<a className="btn">` with `<Section>`, `<Card>`, and `<Button>` in the 8 pages that don't use them
- **Remove legacy source files**: Delete `src/pages/`, `src/partials/`, `assets/css/core.css`, `assets/js/core.js`, and the `scripts/assemble.mjs` build script once all content is migrated and verified

## Capabilities

### New Capabilities
- `complete-feature-pages`: Finish Features.jsx and FeatureShowcase.jsx with full content from old HTML sources
- `wire-missing-routes`: Add routes for CompetitivePositioning and ServerError; fix barrel exports
- `clean-docker-pipeline`: Strip old HTML build from Dockerfile; retain only image optimization and infrastructure files
- `fix-data-consistency`: Replace hardcoded company info with site data; resolve price conflicts; fix template bugs

### Modified Capabilities
- `page-migration`: Mark Features and FeatureShowcase pages as fully migrated; mark CompetitivePositioning and ServerError as routed
- `shared-components`: Refactor 8 pages (About, FAQ, Contact, DemoBooking, Newsletter, ProblemSolutions, WhyOptiFlow, CompetitivePositioning) to use shared Section/Card/Button components instead of raw HTML elements

## Impact

- **Affected files**: `frontend/src/pages/Features.jsx`, `frontend/src/pages/FeatureShowcase.jsx`, `frontend/src/pages/index.js`, `frontend/src/App.jsx`, `frontend/src/pages/CompetitivePositioning.jsx`, `frontend/src/pages/ServerError.jsx`, `frontend/src/pages/Pricing.jsx`, `frontend/src/pages/Home.jsx`, `frontend/src/pages/Contact.jsx`, `frontend/src/pages/FAQ.jsx`, `frontend/src/pages/PrivacyPolicy.jsx`, `frontend/src/pages/Terms.jsx`, `frontend/src/pages/About.jsx`, `frontend/src/pages/DemoBooking.jsx`, `frontend/src/pages/Newsletter.jsx`, `frontend/src/pages/ProblemSolutions.jsx`, `frontend/src/pages/WhyOptiFlow.jsx`, `Dockerfile`, `src/pages/*.html`, `src/partials/*.html`, `assets/css/core.css`, `assets/js/core.js`, `scripts/assemble.mjs`
- **Dependencies**: None (self-contained frontend changes)
- **Breaking changes**: None (pages are already inaccessible or display stubs)
