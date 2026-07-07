## Why

Plausible analytics currently loads on all pages via a ponytail auto-injection hack in `scripts/assemble.mjs` (line 157), but only 1 of 16 source pages uses the documented `<!-- INCLUDE: analytics -->` pattern. More critically, there is zero conversion tracking — demo bookings, contact form submissions, and CTA clicks are invisible to analytics. UTM parameters are captured in `core.js` but discarded. This means the marketing team cannot measure ROI on any acquisition channel or conversion path.

## What Changes

- Add `<!-- INCLUDE: analytics -->` to all 15 pages missing it (competitive-positioning already has it)
- Add Plausible custom event tracking via `window.plausible()` for key conversions: demo booking submit, contact form submit, newsletter sign-up, pricing CTA clicks
- Wire existing `getUTMParams()` output to Plausible events so campaign attribution works end-to-end
- Remove the redundant ponytail auto-injection in `assemble.mjs` (the include directives make it unnecessary)
- Add a Plausible pageview `data-domain` check guard in `core.js` so tracking degrades gracefully if Plausible is blocked

## Capabilities

### New Capabilities
- `analytics-injection`: Standardized `<!-- INCLUDE: analytics -->` directives on every page source, replacing the ponytail auto-injection fallback in the build script
- `analytics-conversion-tracking`: Custom Plausible events for demo bookings, contact form submissions, newsletter sign-ups, and pricing CTA clicks, with UTM attribution wired through

### Modified Capabilities
<!-- No existing spec requirements are changing -->

## Impact

- `src/pages/*.html` (15 files): Add `<!-- INCLUDE: analytics -->` before `</head>`
- `src/partials/analytics.html`: Unchanged (already correct)
- `assets/js/core.js`: Add `trackEvent()` helper and wire it into form submission and CTA click handlers
- `scripts/assemble.mjs`: Remove the ponytail `html.replace('</head>', analyticsRaw)` auto-injection (L156-157); keep the INCLUDE directive replacement (L94)
