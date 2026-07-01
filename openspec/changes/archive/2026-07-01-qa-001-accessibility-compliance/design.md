# Design: QA-001 Accessibility Compliance

## Approach

Minimal additions to existing systems. No new dependencies. Leverage existing tooling.

## Changes

### 1. Validate script: contrast ratio check
Add a `checkContrast()` function to `scripts/validate.mjs` that:
- Reads `core.css` and extracts all oklch color variable definitions
- Computes WCAG 2.2 contrast ratios between foreground/background pairs
- Validates normal text (>= 4.5:1) and large text (>= 3:1) thresholds
- Reports warnings for any pairs below AA thresholds

```
┌──────────────────────────────────────────────────────────┐
│                  validate.mjs flow                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Existing checks                    New check            │
│  ┌──────────────┐                  ┌──────────────┐      │
│  │ Link check   │                  │ Contrast     │      │
│  │ Hardcoded    │                  │ Ratio        │      │
│  │ Dark mode    │                  │ Validation   │      │
│  │ SEO/a11y     │                  │              │      │
│  │ Description  │                  │ Parse oklch  │      │
│  │ Canonical    │                  │ Compute CR   │      │
│  │ OG tags      │                  │ Report gaps  │      │
│  │ Structured   │                  │              │      │
│  │ data         │                  │              │      │
│  │ Data consist │                  │              │      │
│  └──────────────┘                  └──────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Contrast check uses the relative luminance formula from WCAG 2.2:
- Convert oklch → sRGB → linear RGB → relative luminance
- `contrast = (L1 + 0.05) / (L2 + 0.05)` where L1 > L2

### 2. Admin tablist: aria-controls
Add `aria-controls` attributes to admin tabs linking to their corresponding panels:

```
Tab "Submissions"  →  aria-controls="panel-submissions"
Tab "Audit Log"    →  aria-controls="panel-audit"
Tab "Email Log"    →  aria-controls="panel-email"
```

### 3. Axe-core E2E tests
Add accessibility assertions to existing Playwright test suite using `@axe-core/playwright` (already installed as devDependency):
- Page-level `axe` scan on each public page
- Assert no violations at `wcag2aa` standard

### 4. Lighthouse a11y enforcement
Verify `lighthouserc.js` a11y threshold (>= 0.9) is functional. No code changes needed — this is a verification step.

## Files Changed

| File | Change |
|------|--------|
| `scripts/validate.mjs` | Add `checkContrast()` function, call in main |
| `src/pages/admin.html` | Add `aria-controls` to tab buttons, `id` to panels |
| `tests/e2e/` | Add a11y page scans using `@axe-core/playwright` |
| `assets/css/core.css` | No changes (reference only for contrast check) |

## No Changes To

- core.css design tokens (already within AA thresholds per manual check)
- page HTML structure (landmarks, skip links, focus indicators already correct)
- core.js (aria-expanded, keyboard nav, form validation already compliant)
