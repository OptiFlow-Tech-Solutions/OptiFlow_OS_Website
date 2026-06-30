## Context

`core.css` already defines the bulk of the design system — ~40 CSS custom properties covering colors, typography, spacing, shadows, and component primitives. The brand spec (DESIGN.md v5.0) defines additional tokens not yet expressed as CSS variables: border hierarchy (soft/default/strong), disabled text, and glow. Additionally, the CSS lacks z-index scale and transition tokens, which are currently hardcoded in individual component rules.

## Goals / Non-Goals

**Goals:**
- Add CSS custom properties for all DESIGN.md v5.0 color roles not yet tokenized
- Add z-index scale tokens to replace magic numbers in core.css
- Add transition duration/easing tokens for consistent motion
- Update the design-system OpenSpec to document all tokens

**Non-Goals:**
- No font loading changes (fonts remain system stack, not Google Fonts)
- No component redesigns or visual changes
- No new pages or page-level changes
- No dark mode behavior changes (already complete)

## Decisions

1. **Border tokens** — Add `--border-soft`, `--border-default`, `--border-strong` mapped from DESIGN.md hex values (converted to OKLCH for color-space consistency). `--border` existing token maps to `--border-default`.

2. **Z-index scale** — `--z-base` (1), `--z-dropdown` (100), `--z-sticky` (200), `--z-overlay` (300), `--z-drawer` (400), `--z-modal` (500), `--z-toast` (600). Replaces 4 hardcoded z-index values in core.css.

3. **Transition tokens** — `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (350ms), `--ease-out` (cubic-bezier). Existing transitions stay as-is; new tokens are for future component adoption.

4. **OKLCH conversion** — All new tokens use OKLCH color space, consistent with existing tokens. Hex values from DESIGN.md are converted: e.g., `#64748B` → `oklch(56% 0.025 250)`.

## Risks / Trade-offs

- **Token creep**: ~12 new tokens added. Mitigation: all map 1:1 to DESIGN.md roles; none are speculative.
- **Z-index migration**: changing existing z-index values to var() references is tedious but mechanical. Mitigation: phased — add tokens first, replace values page by page in follow-up.
