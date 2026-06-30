# Design: Interactive Runtime (SYS-003)

## Decisions

### 1. Delete motion.mjs

47 lines, zero imports. The module exports `createRevealObserver`, `observeAll`, and `springs`. None used. Remove it. If spring animations are needed later, add them then.

### 2. Unified FAQ system

All FAQ toggles use `.faq-question` class — the standard from core.js. Pages currently using `.faq-q` (demo-booking, pricing) switch to `.faq-question`. Inline `onclick="toggleFAQ(this)"` replaced with delegation via core.js.

### 3. Unified counter system

All counters use `data-count` attribute — the standard from core.js. Pages using `data-target` (demo-booking, pricing) switch to `data-count`. This fixes pricing's broken counters.

### 4. Escape key for drawer

```javascript
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && drawer.classList.contains('open')) {
    closeDrawer();
  }
});
```

### 5. De-duplication principle

For every page-specific script, check: does core.js already handle this? If yes, remove the page-specific code. Only keep what's truly page-unique (calendar, ROI calculator, typewriter, mouse effects, reading bar, pain-point rotator, FAQ search, feature tab nav, architecture tooltips).

### 6. Keyboard-accessible calendar

Change date cells from `<div onclick>` to `<button>`. Add `aria-label` with date. Handle Enter/Space via click delegation.

```html
<!-- Before -->
<div class="cal-day" onclick="selectDate(4)">4</div>
<!-- After -->
<button class="cal-day" data-day="4" aria-label="May 4, 2026">4</button>
```

### 7. Performance pattern

Add a `visibilitychange` listener to core.js that pauses all animations:
```javascript
document.addEventListener('visibilitychange', function() {
  document.documentElement.classList.toggle('page-hidden', document.hidden);
  // typewriters, intervals, requestAnimationFrame loops check this
});
```

Add `{passive: true}` to all scroll listeners in page scripts.

### 8. Form accessibility

Add `aria-invalid="true"` and `aria-describedby` to form inputs on validation error. Core.js handles this generically for any form with `[data-validate]` attribute (ponytail: add only if used by 2+ pages).

### Architecture

```
Before:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ core.js  │  │ page A.js│  │ page B.js│
│ 9 feat   │  │ duplicates│  │ duplicates│
│          │  │ 3 of core│  │ 4 of core│
└──────────┘  └──────────┘  └──────────┘
     └──────────────────────────────────┘
           all loaded on same page
           feature executed 2x-4x

After:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ core.js  │  │ page A.js│  │ page B.js│
│ 11 feat  │  │ unique   │  │ unique   │
│          │  │ features │  │ features │
└──────────┘  └──────────┘  └──────────┘
     └──────┬──────────┬─────┘
            │          │
     ┌──────┴──────────┴─────┐
     │  No duplication       │
     │  Core handles shared  │
     │  Pages handle unique  │
     └───────────────────────┘
```
