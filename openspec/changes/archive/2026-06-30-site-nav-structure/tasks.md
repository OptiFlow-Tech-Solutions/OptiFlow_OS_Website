# Tasks: Site Navigation & Structure (SYS-002)

## Task List

### T1: Update footer to use placeholders ✅
- **File**: `src/partials/footer.html`
- **Action**: Replace hardcoded phone, email, year with `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`
- **Spec**: shared-components — Footer Placeholders
- **Verify**: `npm run build && npm run validate`

### T2: Add skip-to-content link to nav ✅
- **File**: `src/partials/nav.html`
- **Action**: Add `<a class="skip-link" href="#content">Skip to content</a>` before `<header>`
- **File**: `src/pages/features.html` — fix `id="features-start"` → `id="content"` for consistency
- **Spec**: marketing-pages — Page Structure, shared-components — Skip-to-Content
- **Verify**: Inspect any page for skip link, test Tab key

### T3: Slim Resources dropdown ✅
- **File**: `src/partials/nav.html`
- **Action**: Remove "Privacy Policy" and "Terms & Conditions" from desktop and mobile Resources dropdowns
- **File**: `site.json`
- **Action**: Remove Privacy Policy and Terms from `nav.dropdown.items`
- **Spec**: shared-components — Resources Dropdown
- **Verify**: `npm run build`, inspect nav dropdown

### T4: Add mobile drawer active state resolution ✅
- **File**: `src/partials/nav.html`
- **Action**: Add `{{ACTIVE_PAGE}}` expressions to mobile drawer links (same pattern as desktop)
- **Spec**: shared-components — Mobile Drawer Active State
- **Verify**: Build, check multiple pages for mobile active class

### T5: Single nav CTA ✅
- **File**: `src/partials/nav.html`
- **Action**: Remove "Watch Demo" button, keep only "Book Demo"
- **Spec**: shared-components — Nav CTA
- **Verify**: Build, inspect nav header

### T6: Rename blog.html → newsletter.html ✅
- **File**: `src/pages/blog.html` → rename to `src/pages/newsletter.html`
- **File**: `scripts/assemble.mjs` → update SRC_MAP line 25
- **Spec**: marketing-pages — Source File Naming
- **Verify**: `npm run build`, check `dist/newsletter/index.html` exists

### T7: Rebuild and validate
- **Action**: `npm run build && npm run validate`
- **Spec**: build-pipeline — All scenarios
- **Expected**: 0 errors, 12 pages built, reduced warnings

## Execution Order

```
T6 (rename) ──┐
T1 (footer)  ─┤
T2 (skip)    ─┼── all independent, can run in parallel
T3 (dropdown)─┤
T4 (mobile)  ─┤
T5 (cta)     ─┘
         │
         ▼
      T7 (build + validate)
```

All T1-T6 are independent and can be executed in any order.
