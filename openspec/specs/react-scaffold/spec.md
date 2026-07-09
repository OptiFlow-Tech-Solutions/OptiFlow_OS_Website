# react-scaffold

## Purpose

Scaffold the React SPA foundation with Vite 8, React 19, Tailwind CSS 4, React Router 7, design tokens, theme toggle, and route structure matching the static site.

## Requirements

### Requirement: Vite dev server starts
The project SHALL start a Vite dev server on `localhost:5173` with hot module replacement using `npm run dev`.

#### Scenario: Dev server starts without errors
- **WHEN** developer runs `npm run dev` in the `frontend/` directory
- **THEN** Vite starts and displays a localhost URL within 3 seconds

#### Scenario: Hot module replacement works
- **WHEN** developer edits a `.jsx` file
- **THEN** the browser updates without a full page reload

### Requirement: React Router with /os prefix routes
The SPA SHALL use React Router 7 with all 15 page routes accessible under the `/os/` prefix via Vite's `base` configuration.

#### Scenario: Home page at /os/
- **WHEN** user navigates to `/os/`
- **THEN** the Home page component renders

#### Scenario: Pricing page at /os/pricing
- **WHEN** user navigates to `/os/pricing`
- **THEN** the Pricing page component renders

#### Scenario: All 15 routes render content
- **WHEN** user navigates to any valid route (`/os/features/`, `/os/contact/`, `/os/faq/`, etc.)
- **THEN** the corresponding page component renders with content (not a blank page or error)

#### Scenario: Unknown route shows 404
- **WHEN** user navigates to `/os/nonexistent`
- **THEN** the NotFound component renders

### Requirement: Design tokens match static site
Tailwind SHALL produce visual output matching the static site's colors, spacing, typography, and shadows as defined in `core.css` and `tokens.css`.

#### Scenario: Primary accent color matches
- **WHEN** an element uses `bg-accent` or `text-accent` class
- **THEN** the rendered color matches `oklch(33% 0.09 255)` in light mode

#### Scenario: Dark mode colors match
- **WHEN** dark mode is active (`data-theme="dark"` on `<html>`)
- **THEN** accent color renders as `oklch(68% 0.12 210)`

#### Scenario: Typography scale matches
- **WHEN** a page renders h1, h2, h3, lead, and body text
- **THEN** font sizes match `--fs-h1`, `--fs-h2`, etc. from `tokens.css`

### Requirement: Dark mode toggle persists
The theme toggle SHALL switch between light and dark themes, persist the selection to `localStorage`, and respect `prefers-color-scheme` on first visit.

#### Scenario: Toggle switches theme
- **WHEN** user clicks the theme toggle button
- **THEN** the `data-theme` attribute on `<html>` toggles between `dark` and no value

#### Scenario: Theme persists across reload
- **WHEN** user sets dark mode and reloads the page
- **THEN** dark mode is still active

#### Scenario: System preference on first visit
- **WHEN** user visits for the first time with no stored preference
- **THEN** theme matches `prefers-color-scheme: dark` media query

### Requirement: Site data consumed from site.js
Components SHALL read company data (phone, email, nav links, footer links) from `src/data/site.js` — not from hardcoded values.

#### Scenario: Phone number renders from site data
- **WHEN** the Footer component renders
- **THEN** phone number displayed matches `site.contact.phone` from `site.js`

#### Scenario: Nav links render from site data
- **WHEN** the Navbar component renders
- **THEN** all navigation links are generated from `site.nav.links` array

### Requirement: Barrel exports for pages and components
The project SHALL provide `index.js` barrel export files for the `components/` and `pages/` directories.

#### Scenario: Import component from barrel
- **WHEN** developer writes `import { Button, Card } from '../components'`
- **THEN** both Button and Card are imported from the barrel export

#### Scenario: Import page from barrel
- **WHEN** developer writes `import { Home, Pricing } from '../pages'`
- **THEN** both page components are imported from the barrel export

### Requirement: Production build succeeds
Running `npm run build` in the `frontend/` directory SHALL produce an optimized bundle in `frontend/dist/`.

#### Scenario: Build completes within 30 seconds
- **WHEN** developer runs `npm run build`
- **THEN** build completes without errors in under 30 seconds

#### Scenario: Bundle size within targets
- **WHEN** production build completes
- **THEN** JavaScript bundle is under 200KB gzipped and CSS is under 50KB gzipped
