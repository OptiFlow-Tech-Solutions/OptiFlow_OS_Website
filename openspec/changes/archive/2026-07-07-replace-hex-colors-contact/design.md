## Context

The OptiFlow design system in `core.css` defines all colors as `oklch()`-based CSS custom properties. The contact page's hero illustration contains an inline SVG with the only remaining raw hex value: `#1B4D81` used as both `stroke` and `fill`.

The DESIGN.md confirms: `#1B4D81` = Primary Blue = `--accent`. This is the same variable used throughout the site for CTAs, links, and active navigation.

## Goals / Non-Goals

**Goals:**
- Eliminate the last raw hex color from `contact.html`
- Use `var(--accent)` in SVG presentation attributes, matching the design system

**Non-Goals:**
- Converting `oklch()` values to CSS variables (e.g., error red `oklch(55% 0.20 22)` — no `--error` variable exists in `core.css` yet; adding one is a separate design decision)
- Fixing hex colors in other pages (home.html, why-optiflow.html, etc. — out of scope)
- Converting data-URI hex colors in form-select background-image SVGs (these are icon sprites, not CSS color properties)

## Decisions

### Decision 1: Use `var(--accent)` directly in SVG presentation attributes

**Chosen:** Replace `stroke="#1B4D81"` with `stroke="var(--accent)"` and `fill="#1B4D81"` with `fill="var(--accent)"`.

**Rationale:** SVG2 treats presentation attributes as CSS properties, so `var()` is valid. The same SVG already proves this works — the inner `<circle>` uses `fill="color-mix(in oklch, var(--accent) 10%, transparent)"`. Browser support is universal for modern browsers (Chrome 49+, Firefox 31+, Safari 9.1+).

**Alternative considered:** Move SVG to CSS with classes. Overkill for 3 inline attribute changes.

### Decision 2: Don't create an `--error` variable for the hardcoded oklch red

**Chosen:** Leave `oklch(55% 0.20 22)` as-is for this change.

**Rationale:** The design system doesn't define an error semantic color yet. Introducing `--error` requires:
1. Adding it to `:root` and `[data-theme="dark"]` in `core.css`
2. Auditing all 14 pages for error-colors to standardize
3. Deciding on the design team's preferred error color token

This is a meaningful design decision, not a simple hex replacement. Out of scope for this change but worth noting as a follow-up.

## Risks / Trade-offs

- **Risk:** None. The replacement is a 1:1 mapping — `#1B4D81` IS `var(--accent)`.
- **Verification:** Visual check confirms the SVG renders identically before/after.
