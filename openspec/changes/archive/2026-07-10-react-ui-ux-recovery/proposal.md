## Why

The React conversion of the OptiFlow OS marketing site introduced systematic UI/UX regressions: a design token foundation that diverges from the canonical DESIGN.md specification, inconsistent styling approaches across 15 pages (three different patterns: `<style>` tag components, inline styles, and Tailwind utilities), and visual quality issues including hardcoded colors, mismatched typography, and broken responsive behavior. The React version must be made production-ready before any new feature work begins.

## What Changes

- **Foundation**: Reconcile `design-tokens.css` with DESIGN.md specification (colors, typography, container width, type scale)
- **Consistency**: Standardize all pages to use a single styling approach — CSS custom properties via Tailwind theme, eliminating inline style objects and page-specific `<style>` tags
- **Audit**: Systematic side-by-side audit of all 15 React pages against original HTML pages and DESIGN.md
- **Visual Polish**: Fix every identified layout, spacing, alignment, typography, and color issue across all pages
- **Responsive**: Verify and fix responsive behavior at all breakpoints (mobile 480px, tablet 768px, laptop 1024px, desktop+)
- **Animations**: Add subtle hover effects, transitions, and micro-interactions where appropriate
- **Architecture**: Extract duplicated patterns into reusable components; eliminate dead code
- **Verification**: Run visual, functional, and regression testing across all pages
- **Gate**: Enforce that all quality gates pass before any new feature implementation begins

## Capabilities

### New Capabilities
- `react-ui-audit`: Systematic audit framework — every React page compared against the original HTML and DESIGN.md, with issues documented per page
- `design-token-reconciliation`: Align React `design-tokens.css` with canonical DESIGN.md hex colors, Inter font family, 1320px container, and fixed px type scale
- `style-consistency-enforcement`: Standardize all 15 pages to use a single styling pattern — eliminate inline `style={{}}` objects and page-local `<style>` tags in favor of Tailwind classes using CSS custom properties
- `cross-page-responsive-verification`: Test and fix responsive behavior across all breakpoints on every page

### Modified Capabilities
- `react-design-tokens`: Update color, font, container, and type scale requirements to match DESIGN.md
- `react-global-styles`: Add consistency enforcement rules — no inline styles, no page-local style tags
- `shared-components`: Add animation, hover-state, and micro-interaction requirements to shared components
- `page-migration`: Add quality gate exit criteria (no console errors, no visual regressions, responsive verified)
- `home-page-styles`: Replace `<style>` tag approach with Tailwind utility classes

## Impact

- **All 15 React page components** (`frontend/src/pages/*.tsx`)
- **All ~45 components** (`frontend/src/components/**/*.tsx`)
- **Design token foundation** (`frontend/src/styles/design-tokens.css`, `index.css`)
- **Tailwind theme mapping** (`@theme` block in `index.css`)
- **9 custom hooks** (verify they still function after token changes)
- **6 data modules** (content fine, but layout references may need updating)
- **Test suite** (add visual regression snapshot tests, responsive breakpoint tests)
