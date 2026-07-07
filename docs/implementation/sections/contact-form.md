# Contact Form
- **Status:** partial | **Used On:** contact.html, demo-booking.html
- **Priority:** high

## Feature IDs
- UX-001 — unify CSS class names
- ACC-003 — ARIA labels

## Pending Improvements
- [ ] Unify CSS class names between contact and demo-booking pages (UX-001)

## Dependencies / Implementation Notes
Fields: name, email, phone, company, message (textarea). Includes honeypot spam detection (hidden field), UTM parameter capture from URL, form states: idle → submitting → success/error/retry. AJAX submission to `POST /api/form-submit`. The two pages (`contact.html`, `demo-booking.html`) use slightly different CSS class names — needs unification under UX-001. Forms share the same backend endpoint; differentiation via `formName` field.
