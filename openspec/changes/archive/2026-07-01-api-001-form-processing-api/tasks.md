## 1. Serverless API Setup

- [x] 1.1 Create `functions/api/form-submit.js` Cloudflare Worker entry point
- [x] 1.2 Create `lib/form-validate.js` shared validation module (per-form schemas, honey-pot check)
- [x] 1.3 Create `lib/form-notify.js` shared email notification module using Resend SDK
- [x] 1.4 Add `resend` to devDependencies in package.json

## 2. API Endpoint Implementation

- [x] 2.1 Implement POST handler with JSON body parsing and `formName`/`fields` extraction
- [x] 2.2 Implement per-form field validation: contact (name, email, phone, company), demo-booking (name, email, phone, company, demoDate), newsletter (email)
- [x] 2.3 Implement honey-pot spam detection (reject non-empty `_hp` field silently)
- [x] 2.4 Implement IP-based rate limiting (5 req/10min sliding window, in-memory)
- [x] 2.5 Implement structured JSON logging to console for each submission
- [x] 2.6 Implement Resend email notification with per-form subject lines
- [x] 2.7 Add graceful error handling: email failure does not fail the submission

## 3. Client-Side submitForm() Extension

- [x] 3.1 Add honey-pot field injection to `submitForm()` in `assets/js/core.js` (hidden `_hp` input)
- [x] 3.2 Add default endpoint routing: no `data-endpoint` or `data-netlify` → POST to `/api/form-submit`
- [x] 3.3 Restructure payload format for API: `{ formName, fields, honeyPot, utm }` JSON object
- [x] 3.4 Handle structured API error responses (`{ success: false, error: "..." }`) in error state
- [x] 3.5 Add honey-pot styling to `assets/css/core.css` (visually hidden, off-screen)

## 4. Form Page Updates

- [x] 4.1 Add hidden honey-pot field `<input name="_hp" tabindex="-1" autocomplete="off">` to contact page source
- [x] 4.2 Add hidden honey-pot field to demo-booking page source
- [x] 4.3 Add hidden honey-pot field to newsletter page source (if it has a form)

## 5. Build & Validate

- [x] 5.1 Copy `functions/` directory to `dist/functions/` in `scripts/assemble.mjs` (Cloudflare Workers)
- [x] 5.2 Run `npm run build` and fix any build errors
- [x] 5.3 Run `npm run validate` and fix any validation errors
