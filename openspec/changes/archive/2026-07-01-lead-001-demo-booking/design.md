## Context

OptiFlow OS is a static HTML/CSS/JS marketing site (14 pages, no backend). The demo booking and contact forms currently use `alert()` for submission — no lead data leaves the browser. Every form submission is lost. The customer relationship starts at the demo call, but the site can't capture it.

The site deploys to Cloudflare Pages + Netlify. Both support Forms (Netlify Forms with `data-netlify="true"` attributes — zero JS, server-side capture). However, Netlify Forms has limitations (no custom JSON payload, no programmatic error handling). For a richer experience, the form should POST to a configurable endpoint.

## Goals / Non-Goals

**Goals:**
- Real form submission: data POSTs to a configurable endpoint (Netlify Forms, webhook, or API)
- User-visible state: loading spinner during submit, success confirmation, error retry with message
- UTM tracking: capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from URL params
- Demo booking calendar slot included in form payload
- Shared pattern: one `submitForm()` in core.js used by both demo-booking and contact pages
- Graceful degradation: forms still validate and show feedback even if endpoint is unreachable

**Non-Goals:**
- CRM integration (HubSpot, Zoho) — configurable endpoint enables this, but we don't build it
- Email notification — endpoint responsibility
- Lead scoring, qualification, or pipeline management
- Backend or database — site remains fully static
- Form analytics beyond UTM capture

## Decisions

**1. Shared `submitForm()` in core.js with state machine**
- Rationale: Two forms (demo booking, contact) share identical behavior. Centralize to avoid duplication.
- States: `idle → submitting → success | error → idle`
- Alternative: Per-page fetch calls. Rejected — duplicates validation, state management, UTM logic.

**2. `data-endpoint` attribute configures submission URL**
- Form element gets `data-endpoint` pointing to Netlify Forms name, webhook URL, or API endpoint.
- No site.json change needed. Endpoint is form-level configuration.
- Alternative: site.json `formEndpoint` field. Rejected — too rigid, can't vary per form.

**3. Netlify Forms as default, fallback to generic fetch POST**
- If `data-netlify="true"` is present, submit via Netlify Forms protocol (URL-encoded, special `form-name` field).
- If `data-endpoint` contains a URL, POST JSON with `Content-Type: application/json`.
- Both handled by the same `submitForm()` function.
- Alternative: Only one format. Rejected — limits deployment flexibility.

**4. UTM params captured from `URLSearchParams` at submit time**
- Simple, zero-dependency. Added as hidden fields to the POST payload.
- Alternative: Cookie-based UTM tracking for multi-session attribution. Over-engineered for a demo booking flow.

**5. Calendar slot data serialized as form fields**
- Selected date and time slot stored in `data-selected-date` and `data-selected-slot` attributes on the form.
- Included in POST payload as `selected_date` and `selected_slot`.
- Alternative: Separate calendar POST. Rejected — adds complexity, calendar confirmation is part of booking flow.

## Risks / Trade-offs

- [No backend validation] → Client-side validation only. Mitigation: endpoint should validate and return errors.
- [Spam/bot submissions] → No CAPTCHA. Mitigation: Netlify Forms has built-in spam filter; add honeypot field if spam becomes issue.
- [Static site limitation] → No server-side redirect on success. Mitigation: in-DOM success state replaces form, clear confirmation messaging.
- [UTM params only capture current session] → If user navigates away from landing URL, UTM is lost. Acceptable for demo booking where flow is often single-session.
