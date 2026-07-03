# Design: Motion & Animation System Enhancement (UI-001)

## Architecture

```
core.css tokens ──► .reveal variants ──► core.js IntersectionObserver
                          │
                    ┌─────┼─────┐
                    │     │     │
               reveal-left  │  reveal-scale
                         reveal-right
```

## Easing Curve Design

| Token | Curve | Use |
|-------|-------|-----|
| `--ease-out` (existing) | `cubic-bezier(0.22,1,0.36,1)` | Entrances, reveals |
| `--ease-in` | `cubic-bezier(0.64,0,0.78,0)` | Exits, disappearing |
| `--ease-in-out` | `cubic-bezier(0.65,0,0.35,1)` | Symmetric transitions |
| `--ease-spring` | `cubic-bezier(0.34,1.56,0.64,1)` | Bouncy entrances (cards, modals) |

`--ease-spring` overshoots (~8%) then settles — subtle bounce feel for polished interactions.

## Reveal Variants

```
.reveal        → translateY(28px → 0)     [existing, now uses --motion-distance]
.reveal-left   → translateX(-1 * var(--motion-distance) → 0)
.reveal-right  → translateX(var(--motion-distance) → 0)  
.reveal-scale  → scale(0.94) + opacity(0 → 1)
```

## Performance

- `.reveal` gets `will-change: opacity, transform` — hints the compositor to promote to GPU layer before the opacity/transform transition fires.
- All variants use `transform` only (never `top/left/width/height`) — compositor-only, no layout.
- `@starting-style` block enables CSS-only reveal for JS-disabled browsers.
