## Context

The contact page (`src/pages/contact.html`, 623 lines) is the primary inbound lead generation page for OptiFlow OS. It must be migrated from static HTML (Netlify form submission) to the React + Django stack. An existing demo booking system in `backend/leads/` provides a proven pattern for form models, serializers, views, and validation. The React frontend has shared components (`Section`, `Card`, `Button`, `Input`, `TrustBar`, `CTASection`, `FAQPreview`) and a `BookingForm` component that serves as a template.

The migration involves 8 content sections, 4 new React components, 1 new Django model, 1 new API endpoint, and rate limiting.

## Goals / Non-Goals

**Goals:**
- Migrate all 8 sections from `contact.html` to React with visual parity
- Build a self-contained `ContactForm` component with client-side validation (no `forwardRef` needed — form submits itself)
- Add `Enquiry` model to the existing `leads` Django app (reuses established patterns)
- Add `POST /api/enquiries/` with validation, honeypot, rate limiting, and email notification
- Wire `/contact` route to the new `ContactPage` component
- Reuse existing shared components (`TrustBar`, `CTASection`, `FAQPreview`) — no new shared component needed beyond `ChannelCard` (page-local)

**Non-Goals:**
- Admin dashboard UI for managing enquiries (Django admin is sufficient)
- reCAPTCHA or advanced spam prevention (honeypot + rate limiting for v1)
- Email templating (plain text emails only, matching existing pattern)
- `GET /api/enquiries/` with full auth (returns empty for now; auth deferred)
- Reworking `ChannelCard` into a shared component (page-local until another page needs it)
- Modifying `FAQPreview` to accept custom items (hardcode 7 FAQ items for contact page)

## Decisions

### Decision 1: Enquiry model lives in `leads` app

**Chosen:** Add `Enquiry` to the existing `leads` app.
**Rationale:** The `leads` app already documents "demo bookings and contact form submissions" as its purpose. `Enquiry` shares ~80% field structure with `DemoBooking`. A new `enquiries` app would duplicate serializers, views, admin config, and app registration boilerplate. If `leads` grows unwieldy, extract later — premature app separation adds friction without benefit.
**Alternatives considered:** A new `enquiries` app. Rejected: more files, more boilerplate, same field patterns, no independent deployment need.

### Decision 2: ContactForm is self-contained (no forwardRef)

**Chosen:** `ContactForm` manages its own submission — no `forwardRef` or `useImperativeHandle`.
**Rationale:** `BookingForm` uses `forwardRef` because the `CalendarWidget` (a sibling component) triggers form submission from outside the form boundary. `ContactForm` has no such external trigger — the submit button is inside the form. Self-contained form is simpler, fewer lines.
**Alternatives considered:** Copy `BookingForm` exactly with `forwardRef`. Rejected: unnecessary abstraction, YAGNI.

### Decision 3: No shared ChannelCard — page-local component

**Chosen:** `ChannelCard` lives in `Contact.tsx` or a page-local file, not in `components/`.
**Rationale:** Used 6 times on exactly one page. No other page in the 16-page inventory has channel-style cards. Promote to shared when a second page needs it.
**Alternatives considered:** Add to `components/` as shared. Rejected: YAGNI — no second consumer exists.

### Decision 4: Rate limiting via DRF throttling

**Chosen:** DRF's built-in `AnonRateThrottle` with scope `enquiries` (5/hour).
**Rationale:** DRF is already installed and configured. No new dependencies. Configuration is 5 lines in `settings.py`. Matches the risk flagged in the feature inventory ("spam submissions; rate limiting needed").
**Alternatives considered:** Django Ratelimit decorator. Rejected: adds a new dependency for functionality DRF already provides. Cloudflare rate limiting. Rejected: would apply to all `/api/*` routes, not granular enough.

### Decision 5: Enquiry `type` defaults to SALES — no UI selector

**Chosen:** The form does not include a "type" selector. The `type` field defaults to `SALES` in the model. Admins can change it in Django admin.
**Rationale:** The static HTML has no type selector — users choose *how* to contact (phone/email/WhatsApp) via channel cards, not *why*. Adding a type dropdown changes the UX from the source page. If analytics show need for categorization, add a subtle dropdown later.
**Alternatives considered:** Add a radio group or dropdown to the form. Rejected: changes the established UX. Infer type from URL param. Rejected: fragile, complicates the form unnecessarily.

### Decision 6: Inline styles pattern (not CSS modules or Tailwind)

**Chosen:** Follow the existing pattern — inline `style` objects referencing `var(--*)` CSS variables, plus page-level `<style>` blocks for complex CSS.
**Rationale:** This is the established convention across all 27 existing React components. Consistent with `BookingForm`, `Input`, `Button`, `Card`, and every section component.
**Alternatives considered:** Tailwind utility classes. Rejected: existing components don't use them for styling (only layout). CSS modules. Rejected: no existing usage, adds tooling complexity.

## Risks / Trade-offs

- **[Risk] Spam submissions bypass honeypot** → Mitigation: Rate limiting (5/hour/IP) catches volume. Sophisticated spam will bypass honeypot. Add reCAPTCHA v3 later if spam becomes a problem.
- **[Risk] Email delivery failure loses leads** → Mitigation: Enquiry is saved to DB even if email fails (same pattern as DemoBooking). Admins can review in Django admin. Add a retry queue (Celery) later if needed.
- **[Risk] Validation divergence between client and server** → Mitigation: Client validation is UX-only (instant feedback). Server validation is authoritative. Discrepancies manifest as 400 responses with field errors, which the form handles.
- **[Risk] `leads` app becomes a grab-bag** → Mitigation: Two models (`DemoBooking`, `Enquiry`) is acceptable. Extract to `forms` or `submissions` app when a third model is added.

## Open Questions

1. **FAQ accordion pattern**: Should the 7 contact-specific FAQ items be hardcoded in `Contact.tsx`, or should `FAQPreview` be extended to accept custom items? Recommendation: hardcode for now; extend `FAQPreview` if a third page needs custom FAQ items.
2. **GET /api/enquiries/ auth**: Deferred. Return empty list for unauthenticated requests. Add JWT auth when admin dashboard is built.
