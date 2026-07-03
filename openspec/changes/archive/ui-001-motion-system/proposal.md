# Proposal: Motion & Animation System Enhancement (UI-001)

## Why

The unified motion system (consolidated in SYS-003) is a solid foundation, but lacks important primitives:

1. **Incomplete easing tokens** — only `--ease-out` exists. No `--ease-in`, `--ease-in-out`, or spring curve for bouncier interactions.
2. **No `will-change` on `.reveal`** — causes unnecessary repaint/layout work when IntersectionObserver fires, especially on mobile.
3. **Single reveal direction** — only `translateY(28px)`. No side-entrance or scale-in variants.
4. **Hardcoded distance** — `28px` reveal distance is not tokenized.

## What Changes

| Area | Change | Impact |
|------|--------|--------|
| `assets/css/core.css` | Add `--ease-in`, `--ease-in-out`, `--ease-spring` tokens | Complete easing palette |
| `assets/css/core.css` | Add `--motion-distance` token | Configurable reveal distance |
| `assets/css/core.css` | Add `will-change` to `.reveal` | GPU-accelerated reveals, no jank |
| `assets/css/core.css` | Add `.reveal-left`, `.reveal-right`, `.reveal-scale` | Directional reveal variants |
| `assets/js/core.js` | Observe all `.reveal*` variants (already covered) | No JS changes needed |
| `openspec/specs/design-system/` | Add easing token and reveal variant requirements | Spec coverage |

## What Stays

- All existing animation classes and behavior
- Reduced motion support
- IntersectionObserver logic
- Stagger delay system
- Counter animation
- All component transitions

## Risks

- **No risk**: New CSS classes are additive, no existing selectors change.
- **No risk**: `will-change` is a hint, browsers that don't support it ignore it.
- **Low risk**: `@starting-style` for JS-disabled — additive, degrades gracefully.
