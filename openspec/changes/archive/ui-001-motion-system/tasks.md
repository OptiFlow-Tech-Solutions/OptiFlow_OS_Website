# Tasks: Motion & Animation System Enhancement (UI-001)

## Task List

| ID | Task | Status |
|----|------|--------|
| T1 | Add `--ease-in`, `--ease-in-out`, `--ease-spring` tokens to core.css | done |
| T2 | Add `--motion-distance` token to core.css | done |
| T3 | Add `will-change` to `.reveal` in core.css | done |
| T4 | Add `.reveal-left`, `.reveal-right`, `.reveal-scale` variants to core.css | done |
| T5 | Add `@starting-style` block for CSS-only reveal | done |
| T6 | Update core.js to observe all reveal variant classes | done |
| T7 | Update design-system spec delta | done |
| T8 | Run `npm run build && npm run validate` | done — 0 new errors |
| T9 | Update VSI.md and DASHBOARD.md (archive) | done |

## Implementation Summary

**core.css** (+8 lines):
- 3 easing tokens: `--ease-in`, `--ease-in-out`, `--ease-spring`
- 1 distance token: `--motion-distance: 28px`
- 3 reveal variants: `.reveal-left`, `.reveal-right`, `.reveal-scale`
- `will-change: opacity, transform` on all `.reveal*` classes
- `@starting-style` block for JS-disabled CSS-only reveal

**core.js** (+3 lines):
- 3 selector updates to include `.reveal-left`, `.reveal-right`, `.reveal-scale`
