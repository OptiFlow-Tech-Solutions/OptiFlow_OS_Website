## Why

The React + Tailwind scaffold (F01) exists but is incomplete — page stubs have no real content, no shared components exist, tests are absent, and the route structure diverges from the static site's `/os/` prefix. Completing this scaffold unblocks all 29 remaining features. The static HTML site is production-ready, but every new feature (forms, auth, blog, admin) depends on a working React foundation.

## What Changes

- Complete all 15 page stubs from their static HTML counterparts, using shared components
- Build F02 shared components (Button, Card, Section, SEOHead) — folded into this change since pages need them
- Align routes with `/os/` prefix per `os-route-prefix` spec
- Wire Tailwind theme config to use named utility classes (`text-accent`, `bg-teal`) instead of raw `var(--color-*)` strings
- Add Vitest + React Testing Library for component unit tests
- Add barrel exports for pages and components
- Add build validation (lint + build) in CI gate
- Ensure dark mode toggle works across all pages
- Ensure production build succeeds with bundle size targets

## Capabilities

### New Capabilities

- `react-scaffold`: Vite + React 19 + Tailwind 4 + React Router 7 foundation with design tokens, theme toggle, and route structure
- `shared-components`: Button, Card, Section, SEOHead reusable components with variants and tests
- `page-migration`: 15 pages ported from static HTML to React components using shared components
- `tailwind-theme`: Tailwind theme config mapping CSS custom properties to named utility classes

### Modified Capabilities

- `os-route-prefix`: React SPA must use `/os/` prefix routes matching the static site URL structure

## Impact

- **frontend/src/pages/**: All 15 page stubs replaced with real content
- **frontend/src/components/**: New shared components (Button, Card, Section, SEOHead)
- **frontend/src/styles/**: Tailwind theme config updated; tokens.css remains authoritative source
- **frontend/tailwind.config.js**: New file mapping design tokens to Tailwind theme
- **frontend/vite.config.js**: Updated with `/os/` base path
- **frontend/package.json**: Add Vitest, React Testing Library, JSDOM
- **frontend/src/App.jsx**: Routes updated to `/os/` prefix
- Static site: Unchanged — continues to serve as reference and production fallback
