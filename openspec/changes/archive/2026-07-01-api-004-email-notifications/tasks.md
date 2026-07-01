## 1. Create Email Notification Worker

- [x] 1.1 Create `functions/api/email.js` with POST `/api/email` endpoint accepting `{ type, fields, utm }`
- [x] 1.2 Implement `sendTeamNotification()` — builds and sends HTML email to `info@optiflow.co.in` via Resend API with per-type subject lines (contact, demo-booking, newsletter)
- [x] 1.3 Implement `sendWelcomeEmail()` — sends HTML welcome email to newsletter subscriber with brand logo, introduction, website link, and unsubscribe notice
- [x] 1.4 Implement request validation: require `type` field, reject unknown types, reject invalid JSON

## 2. Add HTML Email Templates

- [x] 2.1 Build HTML team notification template with inline styles — OptiFlow OS logo, accent color (`#1B4D81`), field table, UTM section, footer with company name and location
- [x] 2.2 Build HTML welcome email template — logo, welcome message, brief intro, link back to site, unsubscribe notice
- [x] 2.3 Add plain-text `text` fallback for each HTML email in Resend API payload
- [x] 2.4 Ensure table-based layout with inline CSS for email client compatibility

## 3. Add KV Notification Logging

- [x] 3.1 Implement `logEmail()` — writes to KV under key `notif:<ISO-timestamp>-<random>` with fields: `timestamp`, `type`, `to`, `subject`, `success`, `error` (if failed)
- [x] 3.2 Log both successful and failed send attempts
- [x] 3.3 Ensure KV write failure does not fail the email dispatch (catch and `console.warn`)

## 4. Modify Form-Submit Worker

- [x] 4.1 Remove inline `sendNotification()` function and its `subjects` object from `functions/api/form-submit.js`
- [x] 4.2 Replace email sending call with `fetch()` POST to `/api/email` passing `{ type: formName, fields, utm }`
- [x] 4.3 Handle email Worker response: extract `emailSent` field for the form submission response
- [x] 4.4 Handle email Worker failure: catch network errors, set `emailSent: false`, log warning

## 5. Validate

- [x] 5.1 Run `npm run build && npm run validate` to verify no regressions
- [x] 5.2 Run `npm run lint:all` to verify code quality
