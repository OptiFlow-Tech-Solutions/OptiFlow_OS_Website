## 1. Design Token Consolidation [FRONTEND]

- [x] 1.1 [FRONTEND] Audit current `frontend/src/styles/design-tokens.css` against `assets/css/core.css` — document all token name and value differences in both light and dark modes
- [x] 1.2 [FRONTEND] Rewrite `frontend/src/styles/design-tokens.css` with Oklch color values matching `core.css`, preserving the same `--*` variable names
- [x] 1.3 [FRONTEND] Update `frontend/src/styles/index.css` `@theme` block to map new token values to Tailwind utility classes
- [x] 1.4 [FRONTEND] Remove hardcoded hex colors from all `.tsx` and `.css` files in `frontend/src/` (replace with CSS variable references)
- [x] 1.5 [FRONTEND] Run `npm run frontend:build` and verify zero visual regressions by comparing key page screenshots before/after

## 2. Motion System [FRONTEND]

- [x] 2.1 [FRONTEND] Create `frontend/src/hooks/usePrefersReducedMotion.ts` — reactive hook that reads `prefers-reduced-motion` media query and returns boolean
- [x] 2.2 [FRONTEND] Refine `frontend/src/hooks/useScrollReveal.ts` — add direction variants (up/down/left/right), configurable threshold/delay/duration, respect reduced motion
- [x] 2.3 [FRONTEND] Add stagger animation support to `useScrollReveal` — return staggered delay values for children of `.stagger-N` containers
- [x] 2.4 [FRONTEND] Update `frontend/src/hooks/useCountUp.ts` — add easeOutExpo easing, `data-duration`/`data-suffix`/`data-prefix` support, respect reduced motion
- [x] 2.5 [FRONTEND] Add CSS hover/active transitions to `.card` component in `frontend/src/components/Card.tsx` — translateY(-4px), shadow, scale(1.01)
- [x] 2.6 [FRONTEND] Add CSS shimmer effect to `.btn-primary` in `frontend/src/styles/global-ui.css` — matching static site's background-position animation
- [x] 2.7 [FRONTEND] Add button press state in `global-ui.css` — scale(0.97) on `:active`, shadow inset
- [x] 2.8 [FRONTEND] Add `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` classes to relevant sections across all 16 pages
- [x] 2.9 [FRONTEND] Add stagger classes (`.stagger-3`, `.stagger-4`, `.stagger-5`) to grid/list sections with appropriate N value
- [x] 2.10 [FRONTEND] Refine `frontend/src/styles/transitions.css` — add subtle translateY slide-up to page entrance (in addition to existing fade)

## 3. Loading & Empty States [FRONTEND]

- [x] 3.1 [FRONTEND] Create `frontend/src/components/Skeleton.tsx` — reusable skeleton with variants: `text`, `card`, `avatar` — animated gradient via CSS
- [x] 3.2 [FRONTEND] Update `frontend/src/components/PageLoader.tsx` — replace generic "Loading..." with a centered spinner or skeleton layout
- [x] 3.3 [FRONTEND] Add skeleton loading state to `frontend/src/pages/Newsletter.tsx` — show card skeleton grid while fetching articles from API
- [x] 3.4 [FRONTEND] Add skeleton loading state to `frontend/src/pages/FAQ.tsx` — show skeleton tabs + accordion while loading categories
- [x] 3.5 [FRONTEND] Create `frontend/src/components/EmptyState.tsx` — reusable empty state with icon, title, description, and optional CTA button
- [x] 3.6 [FRONTEND] Add empty state to newsletter filter (no matching articles) using `<EmptyState>` component
- [x] 3.7 [FRONTEND] Add empty state to FAQ search (no matching results) using `<EmptyState>` component

## 4. Accessibility Audit & Fixes [FRONTEND]

- [x] 4.1 [FRONTEND] Run Lighthouse accessibility audit on all 16 page routes, save reports to `reports/a11y/`
- [x] 4.2 [FRONTEND] Add visible `:focus-visible` ring styles to all interactive elements in `global-ui.css` — minimum 3:1 contrast
- [x] 4.3 [FRONTEND] Audit and fix all icon-only buttons — add `aria-label` to theme toggle, hamburger, scroll-top, social media icons, search
- [x] 4.4 [FRONTEND] Fix keyboard navigation in `Nav.tsx` dropdown — Enter/Space to open, Escape to close, arrow key navigation within dropdown, focus trap
- [x] 4.5 [FRONTEND] Fix keyboard navigation in mobile drawer (`Nav.tsx`) — focus trap inside open drawer, Escape to close, focus returns to hamburger on close
- [x] 4.6 [FRONTEND] Fix FAQ accordion ARIA — `aria-expanded` on toggle buttons, `aria-controls` linking button to panel, `role="region"` on answer panels
- [x] 4.7 [FRONTEND] Fix form accessibility — ensure all `<Input>` components have associated `<label>`, `aria-describedby` for error messages, focus first error on submit failure
- [x] 4.8 [FRONTEND] Verify and fix color contrast ratios in both light and dark modes — use axe-core Playwright integration for automated checks
- [x] 4.9 [FRONTEND] Run `@axe-core/playwright` E2E scan on all 16 pages, fix all violations

## 5. Responsive QA [FRONTEND]

- [x] 5.1 [FRONTEND] Audit all 16 pages at 375px width — identify horizontal overflow, broken layouts, overlapping elements, text clipping
- [x] 5.2 [FRONTEND] Audit all 16 pages at 768px width — verify 2-column grid behavior, navigation state, section spacing
- [x] 5.3 [FRONTEND] Audit all 16 pages at 1440px width — verify max-width container, full multi-column grids, no excessive whitespace
- [x] 5.4 [FRONTEND] Fix responsive issues found in 5.1-5.3 — adjust breakpoints, grid columns, spacing, and text sizing
- [x] 5.5 [FRONTEND] Ensure all buttons and links meet 44x44px minimum touch target on mobile viewports
- [x] 5.6 [FRONTEND] Test with browser font size at 200% — verify no horizontal scroll, no overlapping content

## 6. Component Cleanup [FRONTEND]

- [x] 6.1 [FRONTEND] Run dead-code detection — search `frontend/src/components/` for files not imported by any page or layout component; list candidates for removal
- [x] 6.2 [FRONTEND] Identify duplicate component implementations (e.g., two FAQ accordions, two comparison tables) — document which is canonical
- [x] 6.3 [FRONTEND] Remove dead components after confirming no imports via grep
- [x] 6.4 [FRONTEND] Remove duplicate component implementations, keeping the more complete/polished version; update imports

## 7. Final Verification [FRONTEND] [TEST]

- [x] 7.1 [FRONTEND] Run `npm run frontend:build` — verify TypeScript compiles with zero errors and Vite build succeeds
- [x] 7.2 [FRONTEND] Run `cd frontend && npm run lint` — verify ESLint passes with zero errors
- [x] 7.3 [TEST] Run Lighthouse CI on all 16 pages — verify Performance ≥ 90, Accessibility = 100, Best Practices ≥ 90, SEO ≥ 90
- [x] 7.4 [TEST] Run existing Playwright E2E tests (`npm run test`) — verify zero regressions
- [x] 7.5 [FRONTEND] Manual visual QA — spot-check navigation, homepage, pricing, FAQ, and contact pages on mobile + desktop
