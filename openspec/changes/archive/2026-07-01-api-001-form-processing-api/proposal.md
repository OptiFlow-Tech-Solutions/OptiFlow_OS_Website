## Why

The current form submission system (`submitForm()` in `core.js`) posts directly to Netlify Forms or a raw JSON endpoint with no server-side validation, spam protection, email notifications, or structured logging. Every OptiFlow form (Contact, Demo Booking, Newsletter) lacks a trusted backend processing layer, making lead capture unreliable at scale.

## What Changes

- Add a serverless API endpoint (`/api/form-submit`) as a Cloudflare Worker capable of receiving, validating, and routing form submissions
- Extend `submitForm()` in `core.js` to POST to the new `/api/form-submit` endpoint by default, with `data-endpoint` override support unchanged
- Add server-side validation: required fields, email/phone format, honey-pot spam detection
- Add structured logging (JSON to console) for every submission with UTM context
- Add email notification via a lightweight service (Resend or similar) for new submissions
- Add rate limiting (5 submissions per IP per 10 minutes)
- Existing Netlify Forms path (`data-netlify`) remains functional as fallback

## Capabilities

### New Capabilities
- `form-processing-api`: Serverless API endpoint for form submission with validation, spam protection, rate limiting, logging, and email notification

### Modified Capabilities
- `lead-capture`: submitForm() default endpoint changes from Netlify-only to `/api/form-submit` with Netlify fallback; new honey-pot spam detection field requirement
- `shared-components`: submitForm() function gains honey-pot field injection and response format handling for structured API errors

## Impact

- New file: `functions/api/form-submit.js` (Cloudflare Worker) or `netlify/functions/form-submit.js` (Netlify Function)
- Modified: `assets/js/core.js` — `submitForm()` extended with honey-pot injection, default endpoint change, structured error handling
- Modified: `src/pages/contact/index.html`, `src/pages/demo-booking/index.html`, `src/pages/newsletter/index.html` — add hidden honey-pot field to each form
- New dependency: Resend SDK (or comparable email service) installed via npm for the serverless function
- Modified: `openspec/specs/lead-capture/spec.md` — delta for honey-pot and API response format
- Modified: `openspec/specs/shared-components/spec.md` — delta for submitForm() extensions
