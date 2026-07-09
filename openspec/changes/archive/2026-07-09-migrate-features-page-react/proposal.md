## Why

The Features page (`features.html`, 626 lines) is the most content-dense product page — 11 feature deep-dives with sticky sub-navigation, dashboard mockups, and the ecosystem hub visualization. It currently exists as a 14-line placeholder (`Features.tsx`) with only a title and lead text. Completing this migration unblocks the pattern for long-form content pages and delivers a key conversion surface for demo bookings.

## What Changes

- Replace placeholder `Features.tsx` with full migration of all 11 feature sections matching `features.html` content
- Extract reusable components: `FeatureSection`, `FeatureNav`, `EcosystemHub`, `DashboardPreview`, `PhoneFrame`
- Port sticky sub-navigation with IntersectionObserver scroll-spy to a reusable React hook (`useScrollSpy`)
- Convert page-specific CSS (~100 lines) to Tailwind classes and/or scoped style components following Home.tsx pattern
- Feature section data defined in a structured config file for maintainability
- Hero ecosystem hub orbital visualization (8 modules orbiting center hub with CSS animation)

## Capabilities

### New Capabilities
- `feature-sections`: The 11 feature detail sections (Tasks, Checklists, Delegation, Worklists, Attendance, Leave, SOPs, Training, Helpdesk, Reports, Notifications, Mobile), each with problem statement, cards, dashboard preview, benefits checklist, and CTA bar
- `feature-navigation`: Sticky horizontal tab bar (fixed below main Nav) with 12 tabs, IntersectionObserver-based active tab highlighting, and click-to-scroll navigation
- `ecosystem-hub`: Hero visual with center hub ("OptiFlow OS") and 8 orbiting module labels (Tasks, Checklists, Attendance, SOPs, Reports, Worklists, Leaves, Training) animated with CSS keyframes
- `scroll-spy-hook`: Reusable `useScrollSpy` hook accepting section IDs and options, returning the currently visible section ID for nav highlighting

### Modified Capabilities
<!-- No existing spec requirements change. These new capabilities fulfill the existing page-migration spec. -->

## Impact

- **Frontend**: `Features.tsx` (rewrite), new components in `components/sections/features/` and `components/`, new hook in `hooks/`, new data file in `data/`
- **CSS**: ~100 lines of page-specific styles migrated to Tailwind + scoped `<style>` via component pattern
- **Dependencies**: F-DS-001 (design tokens), F-LAY-001 (PageLayout/Route), F-ROUTE-001 (router) — all confirmed present in scaffold
- **No backend, database, or API changes**
