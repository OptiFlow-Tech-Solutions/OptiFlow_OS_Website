## 1. Core CSS — Form State Styles

- [x] 1.1 Add `.form-submitting` styles to `core.css`: disabled inputs, submit button with spinner, cursor wait
- [x] 1.2 Add `.form-success` styles to `core.css`: hide form fields, show centered success message with checkmark icon
- [x] 1.3 Add `.form-error` styles to `core.css`: error banner above submit button, retry button, red border on error container
- [x] 1.4 Ensure all new CSS uses `var(--*)` tokens only — no hardcoded hex colors

## 2. Core JS — submitForm() Utility

- [x] 2.1 Add `getUTMParams()` helper to `core.js`: reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from `URLSearchParams`
- [x] 2.2 Add `collectFormData(form)` helper to `core.js`: serializes all named inputs/selects/textareas to a plain object
- [x] 2.3 Add `submitForm(form)` to `core.js`: state machine (idle → submitting → success | error → idle)
- [x] 2.4 Implement Netlify Forms path: when `data-netlify="true"`, use URL-encoded POST with `form-name` field
- [x] 2.5 Implement JSON API path: when `data-endpoint` is a URL, POST JSON with `Content-Type: application/json`
- [x] 2.6 Implement error state: show error message from response, render retry button that re-calls `submitForm()`

## 3. Demo Booking Page — Form Integration

- [x] 3.1 Remove existing `submitForm()` page-level function and `onsubmit` handler from demo-booking page script
- [x] 3.2 Add `data-netlify="true"` attribute to the booking form element
- [x] 3.3 Wire form `submit` event to call page-level validation first, then `core.submitForm(form)` on pass
- [x] 3.4 Include calendar slot data (`selected_date`, `selected_slot`) in form payload from `data-selected-date`/`data-selected-slot` attributes
- [x] 3.5 Remove the `confirmBooking()` alert call — calendar confirmation now stores state in form dataset

## 4. Contact Page — Form Integration

- [x] 4.1 Remove existing inline form submission handler from contact page script
- [x] 4.2 Add `data-netlify="true"` attribute to the contact form element
- [x] 4.3 Wire form `submit` event to call page-level validation first, then `core.submitForm(form)` on pass

## 5. Build & Validate

- [x] 5.1 Run `npm run build` — verify both pages assemble without errors
- [x] 5.2 Run `npm run validate` — verify no new errors, all pages valid (0 errors, pre-existing warnings only)
- [x] 5.3 Verify demo booking form: form structure correct, `data-netlify`, `name` attributes, `validateForm()` hook
- [x] 5.4 Verify contact form: form structure correct, `data-netlify`, `name` attributes, `validateForm()` hook
- [x] 5.5 Verify error state: `.form-error` CSS class, `form-error-msg` element, retry button wired via core.js
- [x] 5.6 Verify UTM capture: `getUTMParams()` reads URLSearchParams, appended to form payload in `collectFormData()`
