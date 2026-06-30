# Tasks: Interactive Runtime (SYS-003)

## Task List

### T1: Delete motion.mjs ✅
- **File**: `assets/js/motion.mjs`
- **Action**: Delete the file. Zero imports, zero usage.
- **Spec**: shared-components — motion.mjs Module
- **Verify**: `npm run build`, confirm no errors

### T2: Add keyboard + a11y enhancements to core.js ✅
- **File**: `assets/js/core.js`
- **Action**: Add Escape key handler for drawer close, add `visibilitychange` listener to pause animations, add smooth scroll for hash links
- **Spec**: shared-components — Keyboard Drawer Control, accessibility — Animation Pause
- **Verify**: Open drawer, press Escape → closes; switch tabs → typewriter pauses

### T3: Deduplicate home.html ✅
- **File**: `src/pages/home.html`
- **Action**: Remove duplicate sticky-CTA scroll listener, remove duplicate scroll-to-top listener, throttle mousemove (mouse glow + card tilt + parallax), pause typewriter on visibility change
- **Spec**: marketing-pages — No Duplicate Shared Logic, Performance Standards
- **Verify**: Scroll test sticky CTA + scroll-top still work; typewriter pauses on tab switch

### T4: Deduplicate demo-booking.html + a11y ✅
- **File**: `src/pages/demo-booking.html`
- **Action**: Switch FAQ from `.faq-q` → `.faq-question`, switch counters from `data-target` → `data-count`, remove duplicate counter/stagger/reveal JS, make calendar keyboard-accessible (div → button), add `aria-invalid` to form
- **Spec**: shared-components — Unified FAQ + Counter, accessibility — Calendar + Form, marketing-pages — Dedup
- **Verify**: FAQ toggles work, counters animate, calendar accessible via keyboard

### T5: Deduplicate pricing.html + fix broken counters ✅
- **File**: `src/pages/pricing.html`
- **Action**: Switch FAQ from `.faq-q` → `.faq-question`, switch counters from `data-target` → `data-count`, remove duplicate sticky-CTA + scroll-top listeners, add `{passive: true}` to ROI scroll listener
- **Spec**: shared-components — Unified FAQ + Counter, marketing-pages — Dedup + Performance
- **Verify**: FAQ toggles work, trust-bar counters animate (previously broken), sticky CTA still works

### T6: Deduplicate why-optiflow.html ✅
- **File**: `src/pages/why-optiflow.html`
- **Action**: Throttle mousemove (mouse glow + magnetic buttons), pause typewriter on visibility change
- **Spec**: marketing-pages — Performance Standards
- **Verify**: Mouse effects still smooth, typewriter pauses on tab switch

### T7: Deduplicate remaining pages ✅
- **Files**: `src/pages/privacy-policy.html`, `src/pages/terms.html`, `src/pages/product-overview.html`, `src/pages/newsletter.html`, `src/pages/problem-solutions.html`, `src/pages/contact.html`, `src/pages/faq.html`
- **Action**: Remove duplicate sticky CTA + scroll-top listeners (privacy, terms), remove duplicate reveal observer (product-overview, newsletter), remove duplicate stagger observer (newsletter), pause pain-point rotator on blur (problem-solutions), add `aria-invalid` to form (contact), debounce search (faq), add `{passive: true}` to remaining scroll listeners
- **Spec**: marketing-pages — No Duplicate Shared Logic, Performance Standards
- **Verify**: Each page's unique features still work, shared features handled by core.js only

### T8: Rebuild and validate
- **Action**: `npm run build && npm run validate`
- **Spec**: build-pipeline — All scenarios
- **Expected**: 0 errors, 12 pages built, reduced warnings (pages are smaller without duplicate JS)

## Execution Order

```
T1 (delete motion.mjs) ──────────────────────┐
T2 (core.js enhancements) ────────────────────┤
T3 (home) ────────────────────────────────────┤
T4 (demo-booking) ────────────────────────────┤
T5 (pricing) ─── all independent ─────────────┤
T6 (why-optiflow) ────────────────────────────┤
T7 (remaining 7 pages) ───────────────────────┘
         │
         ▼
      T8 (build + validate)
```

T1-T7 are all independent and can be executed in any order.
