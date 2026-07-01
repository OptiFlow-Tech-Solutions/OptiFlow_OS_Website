## Why

The demo booking and contact forms currently use `alert()` for submission — no leads are captured. Every prospect who fills out a form is lost. This is the site's primary conversion mechanism for a B2B SaaS targeting Indian MSMEs. Making forms actually submit captures real pipeline.

## What Changes

- Replace `alert()`-based form submission with real endpoint posting (form handler in core.js, configurable endpoint per form)
- Add proper form states: submitting spinner, success confirmation, error retry
- Add UTM/source tracking to capture lead origin
- Form data sent as JSON POST with validation errors returned inline
- **BREAKING**: Form submission behavior changes from `alert()` to real network request — existing form handlers removed from page-level scripts
- Demo booking form and contact form both adopt the shared submission pattern
- Calendar slot selection data included in demo booking payload

## Capabilities

### New Capabilities
- `lead-capture`: Form submission, validation, state management, UTM tracking, and endpoint configuration for demo booking and contact forms on the static site

### Modified Capabilities
- `marketing-pages`: Demo booking and contact pages switch from `alert()`-based submission to real form posting with loading/error/success states
- `shared-components`: core.js gains a reusable `submitForm()` function with state machine (idle → submitting → success/error → idle)

## Impact

- `assets/js/core.js` — new `submitForm()` utility with state management, UTM capture
- `assets/css/core.css` — new form state styles (.form-submitting, .form-success, .form-error)
- `src/pages/demo-booking.html` — form refactored to use shared `submitForm()`, calendar data included
- `src/pages/contact.html` — form refactored to use shared `submitForm()`
- `site.json` — new `formEndpoint` field or per-page endpoint config
