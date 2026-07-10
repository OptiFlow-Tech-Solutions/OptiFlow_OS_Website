## Context

The React SPA (`frontend/`) is a full 1:1 port of the 16-page static HTML marketing site. It builds cleanly (Vite 6 + React 19 + Tailwind 4 + TypeScript 5) with route-level code splitting. However, it's a *raw* port — page content and component structure exist, but visual polish was deferred during migration.

The static site's `assets/css/core.css` (513 lines) and `assets/js/core.js` (356 lines) define the *actual* production quality bar: scroll-triggered reveal animations, staggered list entrances, counter animations, card hover effects, button glow, dark mode transitions, sticky CTA behavior, FAQ accordion. The React frontend has CSS View Transitions for page-level fades but none of the component-level motion.

**Key constraint**: The React frontend has zero animation dependencies. This is intentional — the static site achieves all motion with CSS + a 356-line vanilla JS file. We will match this ethos.

## Goals / Non-Goals

**Goals:**
- Consolidate design tokens so React uses the same Oklch color space as the static site
- Add CSS-driven scroll reveal, stagger, and hover micro-interactions matching `core.js` behavior
- Add skeleton loaders for async sections (newsletter, FAQ, blog)
- Achieve WCAG 2.2 AA compliance across all pages
- Fix any responsive layout breaks
- Remove dead/unused components
- Keep the zero-animation-dependency approach (no framer-motion)

**Non-Goals:**
- No new npm dependencies
- No redesign — DESIGN.md v5.0 is the spec
- No page content changes
- No backend/API changes
- No new pages or routes

## Decisions

### 1. CSS Animations over framer-motion

**Decision**: Use CSS animations + IntersectionObserver (via a `useScrollReveal` hook we already have) for all motion. No framer-motion.

**Rationale**: The static site achieves smooth motion with zero JS animation libraries — 356 lines of vanilla JS handles everything. Adding framer-motion (~150KB) for a marketing site is overkill. CSS animations are GPU-accelerated, respect `prefers-reduced-motion`, and the existing `useScrollReveal` hook already wraps IntersectionObserver.

**Alternative considered**: framer-motion would give smoother orchestration for complex sequences. Rejected because this is a marketing site with simple reveal/stagger patterns, not a dashboard with drag-and-drop.

### 2. Design Token Merge Strategy

**Decision**: Replace `frontend/src/styles/design-tokens.css` with tokens derived from `assets/css/core.css`, keeping the same `--*` variable names. Update `@theme` in `index.css` to map to the new tokens. Use Oklch color space throughout (matching static site).

**Rationale**: Currently React tokens are hex-based and differ from static tokens in both values and naming. One source of truth (`core.css`) simplifies maintenance. Tailwind v4 `@theme` directive maps CSS custom properties to utility classes, so existing `bg-bg`, `text-accent` etc. will continue working after the token values change.

**Risk**: Visual differences may surface after token swap. Mitigation: Run visual comparison page-by-page before/after the token merge.

### 3. Skeleton Loader Approach

**Decision**: Pure CSS skeleton components (animated gradient placeholder) using Tailwind utilities. No library. One reusable `<Skeleton>` component with variants (text, card, avatar, table-row).

**Rationale**: The only async content in this marketing SPA is newsletter/blog API calls and FAQ data. Simple CSS skeletons cover these cases without adding a library.

### 4. Accessibility Strategy

**Decision**: Manual audit of all 16 pages using Lighthouse + axe-core (already in devDeps), then systematic fixes. Focus areas: focus indicators, keyboard navigation (dropdown, drawer, FAQ accordion), ARIA labels on icon-only buttons, color contrast verification.

**Rationale**: Static site's `core.js` already has keyboard handling for drawer and some ARIA. Port those patterns to React equivalents.

### 5. Component Cleanup Approach

**Decision**: Search for components not imported by any page or layout, mark for removal. Check for duplicate implementations (e.g., two FAQ accordion implementations — one in `components/sections/FAQAccordion.tsx` and one in `components/faq/`).

**Rationale**: 80+ components after migration likely includes dead code from exploration phases.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Token merge breaks visual appearance on some pages | Run `npm run frontend:dev` and spot-check all pages after merge |
| CSS animations feel jankier than framer-motion | Test on low-end Android Chrome (Galaxy A series) for frame rate |
| Removing "dead" components breaks an edge case | Use grep to verify no imports before deletion |
| Accessibility fixes break existing keyboard behavior | Test with keyboard-only navigation on each page |
| Responsive fixes cascade into larger layout rework | Fix only clear breaks; defer layout redesigns to separate change |

## Open Questions

- Should we add a `usePrefersReducedMotion` hook that reads the media query reactively (beyond the one-time CSS check)? Resolution: Add it — React can't detect `prefers-reduced-motion` changes from CSS alone.
- The View Transitions API page fade — refine or replace with a more deliberate transition? Resolution: Keep the fade, add a subtle slide-up entrance on cold navigations.
