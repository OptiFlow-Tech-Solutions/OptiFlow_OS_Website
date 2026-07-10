## Why

The React SPA migration is functionally complete — all 16 pages ported from static HTML, builds cleanly in 3.4s, code-split per route. But it's a raw 1:1 port. The UI lacks the visual polish, micro-interactions, loading states, accessibility hardening, and design consistency the static site's `core.css` + `core.js` provides. Before this becomes the production deployment, it needs to feel *finished* — not just functional.

## What Changes

- **Design token consolidation**: Align React `design-tokens.css` with static `core.css` (Oklch colors, matching token names, consistent Dark Mode values). Remove the forked hex-based duplicate.
- **Motion & micro-interactions**: Add purposeful animations (scroll reveal, stagger lists, hover/active states on cards/buttons, page transitions with View Transitions API refinement) matching the static site's `core.js` behavior.
- **Loading & empty states**: Skeleton loaders for async content (newsletter, FAQ, blog articles), empty state components for listings with no data.
- **Accessibility audit & fixes**: WCAG 2.2 AA pass across all 16 pages — focus states, keyboard navigation, ARIA labels, contrast verification, screen reader testing.
- **Responsive QA**: Verify all 16 pages at mobile (375px), tablet (768px), laptop (1024px), desktop (1440px). Fix layout breaks.
- **Component consistency**: Audit all 80+ components for visual alignment, spacing rhythm, color usage, and interaction patterns. Remove unused/dead components.
- **Performance**: Audit chunk sizes (ProductOverview at 72KB is large), add preload hints for critical fonts, verify lazy loading boundaries.

## Capabilities

### New Capabilities
- `motion-system`: Scroll-triggered reveal animations, stagger effects, hover/active micro-interactions, page transition refinements — all matching static site behavior and respecting `prefers-reduced-motion`.
- `loading-states`: Skeleton loaders, loading spinners, and empty state components for async content across all pages.
- `accessibility-audit`: WCAG 2.2 AA compliance verification and remediation across all 16 pages and 80+ components.
- `responsive-qa`: Cross-viewport verification and fix pass for all pages.
- `design-token-consolidation`: Merge static `core.css` (Oklch) token system into React `design-tokens.css`, eliminating the forked hex-based duplicate.

### Modified Capabilities
<!-- None — existing specs define functional behavior; this change polishes presentation without changing requirements. -->

## Impact

- **CSS**: `frontend/src/styles/design-tokens.css` (rewrite to match `assets/css/core.css` tokens), `frontend/src/styles/global-ui.css` (refine component styles), `frontend/src/styles/index.css` (update `@theme` mapping), `frontend/src/styles/transitions.css` (view transitions refinement)
- **Pages**: All 16 page components in `frontend/src/pages/` (add loading/empty states, motion, a11y fixes)
- **Components**: Most of `frontend/src/components/` (motion props, focus states, ARIA labels, skeleton variants)
- **Hooks**: New `useSkeleton` hook, potential `useMotion` hook refinement
- **No API changes, no backend impact**

## Non-Goals

- Not adding new pages or features
- Not changing the backend API
- Not adding new npm dependencies (no framer-motion — use CSS animations + View Transitions API to match the zero-dependency ethos of the static site)
- Not redesigning — DESIGN.md v5.0 IS the specification
