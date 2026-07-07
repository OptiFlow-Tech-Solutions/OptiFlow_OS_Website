# Header/Navigation
- **Status:** partial | **Used On:** all 16 pages
- **Priority:** high

## Feature IDs
- UX-003 — dark mode logo
- UX-005 — breadcrumb component
- ACC-001 — aria-hidden SVGs
- ACC-003 — ARIA labels

## Pending Improvements
- [ ] Dark mode logo variant (UX-003)
- [ ] Breadcrumb component (UX-005)
- [ ] Full accessibility audit

## Dependencies / Implementation Notes
Present in `src/partials/nav.html` (39 lines). Includes: fixed topnav with scroll effect (`scroll-lock` on body), desktop nav links, dropdown menu, hamburger toggle, mobile drawer, theme toggle, CTA button. Navigation structure is driven by `site.json`. Inline `<style>` in partial — styles should move to `core.css`.
