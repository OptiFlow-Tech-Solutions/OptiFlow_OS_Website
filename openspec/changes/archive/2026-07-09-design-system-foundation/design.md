## Context

The project has two representation layers for design: (1) `assets/css/core.css` (513 lines) — the runtime design system used by the static site build, containing CSS custom properties in Oklch color space plus component classes; and (2) `DESIGN.md/DESIGN.md` — the brand specification document. The React frontend scaffold (`frontend/`) has zero design integration. The existing `tailwind-theme` and `shared-components` specs define the target API shapes but have not been implemented.

The existing static site build pipeline (`scripts/assemble.mjs`) uses HTML includes (`<!-- INCLUDE: nav -->`) and `site.json` for data. This is a server-side assembly pattern. The React migration must replicate the same visual output using a client-side component model.

**Key constraints:**
- `core.css` is the authoritative source for runtime token values (colors, spacing, typography scale)
- `DESIGN.md` is the aspirational brand spec — where they conflict, `core.css` wins for implementation values
- All colors must use `var(--*)` CSS custom properties; no hardcoded hex
- Legacy static site files (`src/pages/`, `assets/`, `scripts/`) remain untouched
- The React build coexists with the static build; both pipelines must continue to work

## Goals / Non-Goals

**Goals:**
- Extract design tokens from `core.css` into a standalone `design-tokens.css` that both the React app and the legacy static site can reference
- Provide React context for theme management (dark/light toggle, persistence)
- Provide React components matching the existing `core.css` component class API with identical visual output
- Map all tokens to Tailwind CSS 4 utilities for efficient component authoring
- Port scroll-reveal animations and reduced-motion support to React-compatible form

**Non-Goals:**
- Changing any design token values (colors, spacing, typography) — this is extraction, not redesign
- Adding new component variants not present in `core.css`
- Removing the legacy `core.css` or static site build
- Implementing page-level components (those come in F-PG-* features)
- Setting up component tests (covered by existing `shared-components` spec)
- Porting Navbar, Footer, or layout shell components (those are F-ARCH follow-ups)

## Decisions

### Decision 1: Tokens live in plain CSS, consumed via Tailwind `var()` references

**Chosen:** Single `design-tokens.css` file with all `:root` and `[data-theme="dark"]` custom properties. Tailwind config extends `theme.colors`, `theme.spacing`, `theme.fontFamily` etc. with `var()` references.

**Alternatives considered:**
- *JavaScript/JSON tokens file* → Would enable TypeScript type-checking of token values, but doubles the source of truth (CSS and JS copies). Violates "no duplicate values" constraint.
- *CSS Modules per component* → Closer to `core.css` component class approach, but requires importing styles in every component. Tailwind utilities are more ergonomic for rapid page building.
- *Stitches/Vanilla Extract* → Type-safe, zero-runtime, but adds dependencies. The team already committed to Tailwind in the `react-scaffold` and `tailwind-theme` specs.

**Rationale:** Plain CSS is the lowest-common-denominator format. Both the React app (via Tailwind config) and the legacy static site (via `<link>`) can consume it. `var()` references in Tailwind config mean token changes propagate instantly — no rebuild of the config file needed.

### Decision 2: Theme state via React Context, not a CSS-only approach

**Chosen:** `ThemeProvider` component wrapping the app, storing theme state in React context + `localStorage`. On mount, reads `localStorage` or falls back to `prefers-color-scheme`. Sets `data-theme` attribute on `document.documentElement`.

**Alternatives considered:**
- *CSS-only toggle via checkbox hack* → Works without JS, but loses persistence across page reloads and can't sync with system preference.
- *Custom hook only (no context)* → Simpler, but every component that needs theme awareness would call the hook independently, causing duplicate `localStorage` reads.

**Rationale:** React context provides a single subscription point. The `data-theme` attribute on `<html>` triggers CSS variable swaps (already defined in `design-tokens.css`). This mirrors the exact mechanism used by the static site's `core.js`.

### Decision 3: Components use Tailwind utility classes internally

**Chosen:** Each component (Button, Card, Section, etc.) uses Tailwind utility classes internally. The component's public API uses semantic props (`variant="primary"`, `hover`, `padding="lg"`).

**Alternatives considered:**
- *BEM-style class names inside components* → Closer to `core.css` approach but requires maintaining a separate component CSS file. Tailwind utilities are atomic and tree-shaken.
- *Styled Components / Emotion* → Runtime CSS-in-JS adds bundle weight. Tailwind is build-time.

**Rationale:** Tailwind utilities are the project's chosen styling method (per `tailwind-theme` spec). Components abstract complexity behind semantic props — page authors never write `className="bg-accent text-white rounded-lg shadow-button"`, they write `<Button variant="primary">`.

### Decision 4: Oklch color space with `@supports` fallback

**Chosen:** Design tokens use Oklch values (matching `core.css`). Add `@supports (color: oklch(0 0 0))` fallback block with approximate sRGB equivalents for the background, foreground, and accent colors only.

**Alternatives considered:**
- *No fallback* → Minimal code, but fails on older Android WebViews common among Indian MSME users.
- *PostCSS plugin to auto-convert* → Accurate but adds build tooling complexity. The sRGB approximations are close enough for a fallback.

**Rationale:** The fallback covers the critical path (background, text, accent). Decorative colors can degrade gracefully. This is a ~30 line addition with no ongoing maintenance burden.

### Decision 5: core.css authoritative over DESIGN.md where they conflict

**Chosen:** When `core.css` and `DESIGN.md` specify different values for the same token, use `core.css`'s value.

| Conflict | core.css | DESIGN.md | Resolution |
|----------|----------|-----------|------------|
| Container width | 1200px | 1320px | 1200px |
| Spacing scale | 8/12/20/32/56/96 | 8/16/24/40/80/120 | core.css values |
| Border radius (cards) | 16px | 20px | 16px |
| Border radius (buttons) | 10px | 14px | 10px |
| Body font size | 16px | 18px | 16px |
| Font face | System stack | Inter + JetBrains Mono | System stack (matches current site) |

**Rationale:** `core.css` values are already deployed and visually QA'd. Changing token values is a separate concern (would need a design review and cross-browser testing). This change extracts what exists, it does not redesign.

## Risks / Trade-offs

- **[Oklch rendering]** Older browsers without Oklch support will see sRGB fallbacks. The color difference is subtle (~2-5% perceptual difference) but not pixel-perfect. → Mitigation: `@supports` fallback block. Acceptable for the ~3% of Indian browser traffic on Chrome <111.

- **[Tailwind utility class bloat]** Using utility classes inside components means each component file has long `className` strings. → Mitigation: Components are thin wrappers — the utility classes are the implementation. Page authors use semantic props, not raw utilities. If a component's `className` exceeds ~10 utilities, extract to a `const styles` object.

- **[core.css duplication]** Design tokens exist in both `core.css` (for static site) and `design-tokens.css` (for React). Changes must be kept in sync. → Mitigation: `design-tokens.css` is a direct extraction from `core.css`'s `:root` and `[data-theme="dark"]` blocks. The extraction is one-way (core.css → tokens.css). A future change could make `core.css` import `tokens.css` to eliminate the duplication, but that changes the static build — out of scope here.

- **[CSS bundle size]** Adding `design-tokens.css` + Tailwind generated utilities increases CSS payload. → Mitigation: Tailwind purges unused utilities at build time. `design-tokens.css` is ~150 lines (just the `:root` block). Combined CSS is under 50KB gzipped (per `react-scaffold` spec target).

## Open Questions

- Should `core.css` eventually `@import` or `@layer` the new `design-tokens.css` to eliminate the token duplication? This would simplify the static site build but requires touching the legacy pipeline. Out of scope for this change.
- The `tailwind-theme` spec mentions a `tokens.css` file; we're naming it `design-tokens.css`. Should we reconcile the naming, or rename the existing spec? Trivial to resolve during implementation.
