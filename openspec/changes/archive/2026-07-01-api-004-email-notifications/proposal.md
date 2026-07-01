## Why

Email notifications are currently a single inline function inside the form-submit Worker, sending plain-text notifications only to the team inbox. As the site scales to more form types and user engagement (welcome emails, confirmation receipts), this coupling becomes unmaintainable. Extract email into its own capability to enable HTML templates, recipient-side notifications, and independent testing.

## What Changes

- Extract `sendNotification()` from `functions/api/form-submit.js` into a standalone `functions/api/email.js` Cloudflare Worker
- Add HTML email templates with brand styling (logo, colors, footer)
- Add newsletter welcome/confirmation email sent to the subscriber's email (not just the team inbox)
- Add email notification logging to KV store (`notif:*` prefix) for debugging and audit
- **BREAKING**: `form-submit.js` delegates email sending to the new email Worker instead of calling Resend directly

## Capabilities

### New Capabilities
- `email-notifications`: Standalone email notification service with HTML templating, per-type subject/body configuration, KV logging, and graceful degradation

### Modified Capabilities
- `form-processing-api`: `sendNotification()` removed from form-submit Worker; delegates to email-notifications Worker for email delivery

## Impact

- `functions/api/email.js` — new Cloudflare Worker (email dispatch + HTML templates)
- `functions/api/form-submit.js` — modified to call email Worker instead of inline `sendNotification()`
- `openspec/specs/form-processing-api/spec.md` — delta: remove email requirement, add delegation requirement
- Cloudflare KV — new `notif:*` key prefix for email logs
- Environment: `RESEND_API_KEY` already configured; no new secrets needed
