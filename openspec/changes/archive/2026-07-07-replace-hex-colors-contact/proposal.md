## Why

The contact page (`src/pages/contact.html`) contains hardcoded hex color `#1B4D81` in an inline SVG — violating the project's CSS variable convention. Every other color on the contact page uses either `var(--*)` CSS variables or `oklch()` values. This is the last raw hex value on the page, and fixing it aligns with the design system's single source of truth in `core.css`.

## What Changes

- Replace `#1B4D81` with `var(--accent)` in 3 SVG presentation attributes in the hero illustration (`src/pages/contact.html`, line 276)
  - `stroke="#1B4D81"` → `stroke="var(--accent)"` (1 occurrence)
  - `fill="#1B4D81"` → `fill="var(--accent)"` (1 occurrence)
- Rebuild and validate the site

## Capabilities

### Modified Capabilities
<!-- None -- no spec changes needed; this is a code hygiene fix consistent with existing design system conventions -->

## Impact

- **Files**: `src/pages/contact.html` — 1 line changed, 3 hex replacements on a single SVG element
- **Specs**: No spec changes required — the design system already defines `--accent` as `oklch(33% 0.09 255)` (equivalent to `#1B4D81`)
- **Risk**: Minimal — SVG presentation attributes support `var()` in all modern browsers; the adjacent `<circle>` already uses `fill="color-mix(in oklch, var(--accent) 10%, transparent)"` proving CSS variable compatibility
- **Validation**: `npm run build && npm run validate` must pass with zero errors
