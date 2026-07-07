# Newsletter Signup
- **Status:** complete | **Used On:** newsletter.html, sometimes in footer
- **Priority:** low

## Feature IDs
- ACC-003 — ARIA labels

## Pending Improvements
- [ ] None currently

## Dependencies / Implementation Notes
Simple email-only form. Submits via `POST /api/form-submit` with `formName=newsletter`. Backend auto-adds subscriber to Workers KV and sends welcome email via Resend. Works correctly end-to-end. No known issues.
