## Context

The OptiFlow OS marketing website was converted from a static HTML/CSS site (`src/pages/*.html` using `assets/css/core.css`) to a React SPA (`frontend/` using Vite, TypeScript, and Tailwind CSS 4). During conversion, three divergences were introduced:

1. **Design token fork**: `frontend/src/styles/design-tokens.css` uses Oklch color values and `clamp()`-based typography that differ from the canonical `DESIGN.md/DESIGN.md` specification (hex colors, fixed px type scale, Inter font family, 1320px container).

2. **Styling fragmentation**: Three different patterns coexist — page-local `<style>` tags (`HomeStyles.tsx`, Pricing inline `<style>{}`), React inline `style={{}}` objects (Pricing, ProblemSolutions), and Tailwind utility classes. No single standard governs how a component gets its styles.

3. **Missing quality gates**: No systematic page-by-page audit against originals, no responsive verification across breakpoints, no visual regression testing, no animation consistency.

The site has 15 React pages, ~45 components, 9 custom hooks, 6 data modules, and a test suite (Playwright E2E + axe-core for a11y).

## Goals / Non-Goals

**Goals:**
- Reconcile design tokens with DESIGN.md (colors, type scale, container, font family)
- Standardize all pages to use a single styling approach via Tailwind theme
- Audit and fix every page's layout, spacing, responsive behavior, and visual quality
- Add consistent micro-interactions (hover states, transitions) across all components
- Establish quality gates that prevent future regressions
- Reach production readiness — better than the original HTML version

**Non-Goals:**
- Backend/Django changes
- New pages or features beyond the 15 existing React pages
- 500 error page (not yet in React)
- Internationalization or localization
- Performance optimization beyond what the styling changes naturally improve
- Analytics or tracking changes
- CI/CD pipeline changes (beyond adding visual regression test step)

## Decisions

### D1: Design token source of truth
**Decision**: Migrate `design-tokens.css` from Oklch-based values to hex values matching DESIGN.md. Load Inter font via `font-display: swap`.

**Rationale**: DESIGN.md is the canonical brand specification. The React implementation should reflect it exactly. Oklch was an optimization for wide-gamut displays but 97%+ of Indian traffic uses sRGB displays — the Oklch values map to near-equivalent sRGB hex values anyway. The hex values in DESIGN.md are what stakeholders approved.

**Alternatives considered**:
- Keep Oklch and update DESIGN.md → Would require re-approval of all brand colors
- Use color-mix() to bridge both → Adds complexity with no visual benefit
- Define both in :root and let browser pick → Confusing dual-source

### D2: Styling approach standardization
**Decision**: All component styling uses Tailwind utility classes referencing CSS custom properties via `@theme`. No inline `style={{}}` objects. No page-local `<style>` tags. Page-specific grid/hero styles move to Tailwind's `@layer components` pattern or dedicated `.module.css` files.

**Rationale**: Tailwind is already configured with all design tokens via `@theme` in `index.css`. Dual-styling approaches (inline + Tailwind + CSS-in-JS) create confusion about which value takes precedence. A single approach makes the codebase predictable and enforceable via linting.

**Alternatives considered**:
- Keep `<style>` tags (HomeStyles pattern) → Already duplicated across pages
- CSS Modules only → Would require removing Tailwind, bigger refactor
- Styled Components / Emotion → New dependency, unnecessary for a marketing site

### D3: Audit methodology
**Decision**: Side-by-side visual comparison: open original HTML page and React page in parallel, inspect at 4 breakpoints (480, 768, 1024, 1440+), document discrepancies in a structured issue list per page, fix in priority order (layout > spacing > typography > color > animation).

**Rationale**: Manual visual inspection catches issues automated tools miss (visual hierarchy, spacing feel, "does it look right"). Automated tools (Lighthouse, axe-core, stylelint) handle the objective checks.

**Alternatives considered**:
- Automated visual diff (Percy/Chromatic) → Overhead for a one-time recovery; useful for regression testing post-recovery
- Browser screenshots only → Misses interaction states and responsive behavior

### D4: Component extraction
**Decision**: Extract duplicated patterns into shared components only when the same pattern appears on 3+ pages. One-off patterns stay in their page. No premature abstraction.

**Rationale**: The project already has 45 components — some are single-use. Extraction is only valuable if it reduces maintenance burden. Over-extraction creates indirection.

### D5: Animation approach
**Decision**: Use CSS transitions via Tailwind classes for micro-interactions (`hover:`, `transition-*`, `duration-*`). Keep existing custom hooks (`useCardTilt`, `useParallax`, `useScrollReveal`) for interactive animations. No additional animation library.

**Rationale**: Custom hooks are already implemented and working. Tailwind's built-in transition utilities cover 90% of the needed micro-interactions. Adding Framer Motion would be a new dependency for a use case already handled.

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Token migration breaks existing dark mode | Medium | High | Dark mode tokens defined separately in data-theme selector; migrate hex values one-to-one, test both themes |
| Removing inline styles breaks layout | High | Medium | Audit inline styles before removal; convert to Tailwind classes that produce equivalent output |
| Font loading (Inter) causes FOUT on slow connections | Medium | Low | Use `font-display: swap` + preload link; system font fallback is visually close |
| Page-local `<style>` removal breaks page-specific animations | Low | Medium | Move keyframe animations to `transitions.css` or Tailwind `@keyframes` |
| E2E tests break from CSS class changes | Medium | Medium | Run test suite after each batch of fixes; update selectors as needed |
| Scope creep — this touches every file | High | High | Strict phase ordering: foundation first, audit second, fix third, verify fourth. No new features. |

## Open Questions

- Should the original HTML/CSS pages in `src/pages/` be deleted after React verification passes? (Keeps repo size down but removes fallback)
- Should we add visual regression snapshot testing (e.g., `@playwright/test` snapshots) as part of the CI pipeline?
- Stakeholder review: who signs off that the React version is "better than the original"?
