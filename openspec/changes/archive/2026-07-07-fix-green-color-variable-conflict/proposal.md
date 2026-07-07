## Why

DESIGN.md defines two distinct green accent colors (Success Green `#54B89A` and Growth Green `#99D271`), but `core.css` provides only a single `--green` variable. This conflates two semantic color roles into one token, forcing individual pages to locally override `--green` with different values — creating visual inconsistency and making `var(--green)` mean different things on different pages.

## What Changes

- Remove local `--green` overrides from `features.html` and `feature-showcase.html` that redefine the variable to undocumented values
- Update the pricing page to use `var(--lime)` (Growth Green) for all growth/KPI/savings indicators instead of misusing `var(--green)`
- Replace hardcoded green hex values in pricing page bar fills with CSS variable references
- Ensure `--green` consistently means "Success Green" (completion, done states, checkmarks) everywhere
- Ensure `--lime` consistently means "Growth Green" (KPIs, savings, progress, ROI) everywhere

## Capabilities

### New Capabilities

- `green-color-tokens`: Establish `--green` as Success Green and `--lime` as Growth Green, aligning `core.css` with DESIGN.md and removing page-level overrides

### Modified Capabilities

_None_ — no existing specs define color variable behavior.

## Impact

- `assets/css/core.css` — no changes needed; the variables already exist correctly
- `src/pages/pricing.html` — 29 references to `var(--green)`, ~15 of which should be `var(--lime)`
- `src/pages/features.html` — remove `:root` and `[data-theme="dark"]` `--green` overrides (lines 16, 22)
- `src/pages/feature-showcase.html` — remove `:root` and `[data-theme="dark"]` `--green` overrides (lines 16, 22)
- `src/pages/terms.html` — review local `--green-soft` override for consistency
