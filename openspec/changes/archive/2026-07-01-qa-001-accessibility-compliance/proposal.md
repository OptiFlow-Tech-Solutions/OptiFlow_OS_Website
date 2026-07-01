# QA-001: Accessibility Compliance

## Summary

Comprehensive accessibility audit and remediation to ensure WCAG 2.2 Level AA compliance across all 14 public pages. Adds automated contrast testing to the validation pipeline, hardens existing a11y patterns, and closes identified gaps.

## Motivation

The explore phase audit found the site already has strong a11y foundations (skip links, ARIA labels, keyboard nav, reduced motion, form validation). However:
1. No automated color contrast verification exists — oklch tokens are perceptually designed but not programmatically validated against WCAG thresholds
2. Lighthouse a11y gate is configured (>= 0.9) but not actively run in CI
3. Minor gaps: admin tablist missing `aria-controls`, heading hierarchy could be flatter on some pages

## Scope

### In Scope
1. Add automated WCAG contrast ratio testing to `scripts/validate.mjs`
2. Add `aria-controls` to admin tablist for screen reader support
3. Run Lighthouse a11y audit across all pages, fix any violations
4. Verify and harden existing a11y features (focus indicators, skip links, semantic landmarks)
5. Add `axe-core` accessibility tests to the E2E test suite

### Out of Scope
- Admin page `<main>` landmark (admin is noindex, nofollow)
- Purchasing external accessibility audit services
- Screen reader-specific UX testing (requires human QA)

## Affected Specs

- `accessibility` — Delta spec for new contrast testing requirement
- `admin-authentication` — Tablist aria-controls fix
- `design-system` — Contrast ratio verification added
- `build-pipeline` — validate.mjs enhancement
