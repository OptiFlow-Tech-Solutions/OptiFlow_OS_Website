## Context

The Features page is the most content-dense product page on the site. The static HTML (`src/pages/features.html`, 626 lines) contains an ecosystem hub hero, sticky sub-navigation with scroll-spy, 11 feature detail sections with varying layouts, and a bottom CTA. The current React `Features.tsx` is a 14-line placeholder. The SPA is scaffolded with Vite + React 19 + Tailwind 4 + React Router 7. Home.tsx has already been fully migrated using a section-decomposition pattern (14 section components under `components/sections/`).

## Goals / Non-Goals

**Goals:**
- Migrate all 626 lines of content from `features.html` into a fully functional `Features.tsx`
- Create reusable components: `FeatureSection`, `FeatureNav`, `EcosystemHub`, `DashboardPreview`, `PhoneFrame`
- Create a reusable `useScrollSpy` hook for IntersectionObserver-based nav highlighting
- Define feature data in a structured config (not hardcoded JSX) for maintainability
- Convert page-specific CSS to Tailwind + scoped style components matching existing patterns
- Match all visual content exactly: text, metrics, dashboard tables, layout at all breakpoints

**Non-Goals:**
- Not adding new feature content beyond what's in the static HTML
- Not connecting dashboard previews to real data (they remain static mock data)
- Not creating a generalized page-building framework — components are specific to this page
- Not modifying PageLayout, Nav, Footer, or any shared infrastructure

## Decisions

### D1: Hybrid component architecture (not purely data-driven, not 11 separate components)

**Decision**: Extract 5 small reusable atoms (`FeatureProblem`, `FeatureBenefits`, `FeatureCTA`, `DashboardPreview`, `PhoneFrame`) plus one layout component (`FeatureSection`) that composes them. Define feature data as a typed config array. Render by mapping over config.

**Alternatives considered:**
- *11 per-section components* (like Home.tsx pattern): Too much duplication for similar sections; 11 files for near-identical structure
- *Pure data-driven single component*: The layout variations (2-col vs grid-3 vs process-steps vs phone-frames) would require a complex config schema with too many conditional branches

**Rationale**: The hybrid approach keeps the component count reasonable (~7) while handling layout diversity through a `layout` field on the config. Each feature section shares 80% of its DNA — header, problem statement, cards, benefits, CTA — but varies in whether it shows a dashboard preview and what side it's on.

### D2: Feature nav rendered inline (not portal)

**Decision**: Render `<FeatureNav>` inside `<Features>` page component, not via a portal or PageLayout slot.

**Alternatives considered:**
- *Portal to body*: Simpler z-index but couples the feature page to a specific DOM structure outside React's tree
- *Slot in PageLayout*: More general but adds complexity to shared infrastructure for a single page

**Rationale**: The nav is `position: fixed; top: var(--nav-h)` and doesn't need to escape any overflow containers. Keeping it inside the page component is the simplest approach. The page sets a `--fnav-h: 52px` CSS variable for `scroll-padding-top` calculations.

### D3: CSS via Tailwind + scoped `<style>` in a Styles component

**Decision**: Convert as much as possible to Tailwind utility classes. Remaining page-specific styles (animations, complex selectors) go in a `<FeaturesStyles>` component that injects a `<style>` tag — same pattern as `<HomeStyles>`. No CSS modules, no separate CSS files.

**Rationale**: Matches the existing site pattern (HomeStyles, Footer.css, Nav.css). Tailwind covers 60-70% of the static CSS; the remaining complex selectors (`.feature-nav.stuck`, `@keyframes orbitFloat`, stagger delays) are cleaner in plain CSS than Tailwind's arbitrary value syntax.

### D4: useScrollSpy hook — generic, reusable

**Decision**: Create `hooks/useScrollSpy.ts` with signature:
```ts
function useScrollSpy(sectionIds: string[], options?: {
  rootMargin?: string;
  threshold?: number | number[];
}): string | null
```
Uses `IntersectionObserver` internally, returns the ID of the currently visible section. Handles observer cleanup on unmount.

**Rationale**: This pattern already exists in vanilla JS on FAQ and Features pages. Making it a hook avoids duplicating the observer logic and handles React lifecycle cleanup automatically.

### D5: Feature data in `data/features.js`

**Decision**: Define feature section content in a structured JS module with typed fields. Each section entry includes: id, nav label, heading, lead, problem statement, cards array, benefits array, dashboard metrics/rows (optional), cta text/link. A `layout` field selects the rendering variant.

**Rationale**: Separates content from presentation. The 11 sections share a common schema but can opt into different layouts. Easier to maintain and review than 11 large JSX blocks.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **IntersectionObserver in React**: Vanilla DOM manipulation doesn't map cleanly to React's declarative model | Encapsulate in `useScrollSpy` hook with proper refs and cleanup; use `useCallback` for the observer callback to avoid stale closures |
| **Layout variation complexity**: The FeatureSection component could become a "config interpreter" with too many branches | Keep the config-based approach only for the 80% shared structure; use explicit JSX for unique sections (Delegation's process-steps, Mobile's phone-frames) if the config gets unwieldy |
| **Ecosystem hub positioning**: 8 absolutely-positioned modules need to look good at all viewport widths | Use percentage-based positioning relative to the `.hero-ecosystem` container. At mobile breakpoints (≤1024px), reduce min-height and let modules flow naturally |
| **Scroll-padding conflict**: Main nav + feature nav = double sticky bar (~52px + ~52px). `scroll-padding-top` must account for both | Set `scroll-margin-top` on feature sections to `calc(var(--nav-h) + var(--fnav-h) + 32px)` via inline style or a `FeaturesStyles` rule that scopes to `.feature-section` |
| **Bundle size**: Adding ~100 lines of CSS and several components | Minimal: the components are small, CSS is injected via a style tag (no extra request), same pattern used by Home.tsx |

## Open Questions

- None. All technical decisions resolved above based on static HTML analysis and existing Home.tsx patterns.
