## Context

The OptiFlow website currently handles form submissions entirely client-side via `submitForm()` in `core.js`. Forms (Contact, Demo Booking, Newsletter) POST directly to Netlify Forms (`data-netlify="true"`) or a configurable JSON endpoint (`data-endpoint`). There is no server-side validation, spam protection, structured logging, email notification, or rate limiting.

The site is hosted on Cloudflare Pages and Netlify. Both platforms support serverless functions (Workers / Functions). The site already has a dual-deploy setup (`deploy:netlify` and `deploy:cloudflare` in `package.json`).

## Goals / Non-Goals

**Goals:**
- Add a single serverless function (`/api/form-submit`) that validates, logs, and notifies on form submissions
- Keep the client-side `submitForm()` backward-compatible with existing `data-netlify` forms
- Add honey-pot spam detection (invisible field that bots fill, humans don't)
- Add rate limiting at the API level
- Add structured JSON logging for every submission
- Add email notification for new leads
- Work with both Cloudflare Workers (primary) and Netlify Functions (secondary/fallback)

**Non-Goals:**
- CRM integration (HubSpot, Salesforce, etc.)
- Database storage for submissions
- Admin dashboard for viewing submissions
- File upload support
- Multi-step form wizards
- A/B testing the form

## Decisions

### 1. Cloudflare Worker as primary target, Netlify Function as secondary

The site runs on both platforms but Cloudflare Workers offer better cold-start, free-tier generous limits, and simpler configuration. The worker sits alongside the existing Cloudflare Pages project. A Netlify Function equivalent is provided for sites deployed only to Netlify.

**Alternative considered:** Netlify-only → rejected because Cloudflare Pages is the primary deploy target and Workers have better cold-start performance.

### 2. Resend for email notifications

Resend is a lightweight transactional email API with a generous free tier (100 emails/day), simple SDK, and no infrastructure overhead. It's preferred over SendGrid (complex setup), Mailgun (domain verification overhead), or Nodemailer with SMTP (needs SMTP credentials managed).

**Alternative considered:** Nodemailer + Gmail SMTP → rejected because it requires storing email credentials and has daily sending limits.

### 3. Honey-pot spam detection, not CAPTCHA

A hidden `<input>` field with `tabindex="-1"` and `autocomplete="off"` catches bots that auto-fill every field. Humans never see or fill it. If the field is populated server-side, the submission is silently dropped with a 200 (to not reveal the detection). This avoids the UX friction of CAPTCHA.

**Alternative considered:** reCAPTCHA v3 → rejected because it adds external JS payload, cookie consent concerns, and friction for Indian MSME users on slow connections.

### 4. Rate limiting via in-memory counter in the worker

A simple IP-based counter with a 10-minute sliding window. No external KV/store needed. Resets on worker cold-start (acceptable for this scale).

**Alternative considered:** Cloudflare KV → rejected for simplicity; cold-start reset is acceptable for a marketing site.

### 5. No database — email + log only

Submissions are forwarded via email and logged as structured JSON to the worker console (viewable in Cloudflare Logs or via log drain). No database to manage, no schema migrations.

**Alternative considered:** Cloudflare D1 → rejected because adds complexity with no current dashboard to consume it.

## Risks / Trade-offs

- [Rate limit cold-start reset] → Acceptable for current traffic volume (< 100 submissions/day). Add KV-backed rate limiting if spam becomes an issue.
- [Email delivery dependency on Resend] → Resend free tier (100/day) is sufficient for lead volume. If exceeded, the form still accepts submissions; email delivery degrades gracefully.
- [No persistent submission store] → Submissions exist only in email and worker logs. If both fail, data is lost. Acceptable for MVP; add D1 storage if needed later.
- [Dual-platform maintenance] → Worker + Function code is near-identical. Keep a shared `lib/validate.js` and `lib/notify.js` that both import.
