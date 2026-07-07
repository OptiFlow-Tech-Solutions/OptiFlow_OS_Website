## Why

A 404 error page is a standard requirement for any production website. The page source template already exists at `src/pages/404.html` and is registered in `site.json`, but it needs review against the 500 error page for consistency and completeness before finalizing.

## What Changes

- Audit the existing 404 page (`src/pages/404.html`) against the design system and the 500 error page
- Ensure consistent error page patterns: matching CSS variables for the error code color, shared structure, and component behavior
- Add company contact information block ({{EMAIL}}, {{PHONE}}) to match the 500 page's helpful contact pattern
- Verify responsive behavior, dark mode support, and animation classes
- Validate the built output passes `npm run validate`

## Capabilities

### New Capabilities
- `404-error-page`: A fully functional 404 error page with navigation, suggestions, CTAs, contact info, dark mode, and responsive layout — matching the 500 page pattern and design system.

### Modified Capabilities
<!-- None — this is a new page, not modifying existing capabilities -->

## Impact

- **Source**: `src/pages/404.html` (modify existing template)
- **Build**: Already registered in `site.json` with `noindex: true`; assembled by `scripts/assemble.mjs` into `dist/404/index.html`
- **No API changes, no new dependencies, no breaking changes**
