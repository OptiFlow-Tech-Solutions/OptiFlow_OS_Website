# Proposal: Page Transition Animations (UI-002)

## Why

The site has 15 static HTML pages with no cross-page transition. Each navigation causes a hard cut — jarring white flash, then full reload with scroll-reveal. The in-page motion system (UI-001) is polished: reveal variants, easing curve tokens, reduced-motion support. But crossing pages feels abrupt.

## What Changes

| Area | Change | Impact |
|------|--------|--------|
| `assets/css/core.css` | Add `@keyframes pageEnter` and `@keyframes pageExit` | Enter/exit animation primitives |
| `assets/css/core.css` | Add `.page-enter-active` and `.page-exit-active` body classes | Trigger animations |
| `assets/js/core.js` | Add internal link click interceptor + exit-animation-before-navigate | Smooth exit on navigation |
| `assets/js/core.js` | Add `page-enter-active` class on DOMContentLoaded | Smooth enter on page load |
| `openspec/specs/design-system/` | Add page transition spec requirements | Spec coverage |

## What Stays

- All existing animation classes, easing tokens, and IntersectionObserver behavior
- Reduced motion support (both animations skipped)
- Theme transition on body (0.35s) — page enter anim is additive, doesn't conflict
- Scroll-reveal, counter animation, FAQ accordion, sticky CTA — all unaffected

## Risks

- **No risk**: CSS animations are additive, no existing selectors change.
- **Low risk**: Internal link click handler uses `event.preventDefault()` — if JS fails, default navigation still works (graceful degradation).
- **No risk**: Reduced-motion media query skips both animations entirely.
