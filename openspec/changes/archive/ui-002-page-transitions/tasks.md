# Tasks: Page Transition Animations (UI-002)

## Task List

| ID | Task | Status |
|----|------|--------|
| T1 | Add `@keyframes pageEnter` and `@keyframes pageExit` to core.css | done |
| T2 | Add `.page-enter-active` and `.page-exit-active` body animation rules to core.css | done |
| T3 | Add reduced-motion override for page transition classes in core.css | done |
| T4 | Add page-enter trigger (DOMContentLoaded) to core.js | done |
| T5 | Add internal-link click handler with exit animation to core.js | done |
| T6 | Update design-system spec delta | done |
| T7 | Run `npm run build && npm run validate` | done — 0 new errors |
| T8 | Update features.json status to complete | done |

## Implementation Summary

**core.css** (+16 lines):
- `@keyframes pageEnter` — fade-in + slide-up 10px, 350ms, ease-out
- `@keyframes pageExit` — fade-out, 250ms, ease-in
- `.page-enter-active body` — triggers pageEnter animation
- `.page-exit-active body` — triggers pageExit animation
- `@media (prefers-reduced-motion: reduce)` — disables both

**core.js** (+33 lines):
- On load: adds `page-enter-active` class to `<html>` (skipped if reduced-motion)
- On click: intercepts internal-link clicks, adds `page-exit-active`, navigates after 280ms
- Graceful degradation: skips if reduced-motion, external links, mailto/tel, downloads, new-tab
