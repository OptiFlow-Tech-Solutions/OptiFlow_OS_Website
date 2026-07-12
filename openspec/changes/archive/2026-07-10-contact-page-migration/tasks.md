## 1. Backend — Enquiry Model and Migration

- [x] 1.1 Add `Enquiry` model to `backend/leads/models.py` with fields: name, company, phone, email, team_size, industry, challenges, type (SALES/SUPPORT/PARTNERSHIP), status (NEW/REPLIED/RESOLVED), created_at, updated_at
- [x] 1.2 Add `Enquiry` to `backend/leads/admin.py` with list display (name, company, email, type, status, created_at), search fields (name, company, email), list filter (type, status)
- [x] 1.3 Run `python manage.py makemigrations leads` and `python manage.py migrate` to create `leads_enquiry` table *(needs running PostgreSQL)*

## 2. Backend — Enquiry Serializer

- [x] 2.1 Add `EnquirySerializer` to `backend/leads/serializers.py` with field-level validation: name (strip, 3-100 chars), company (strip, 2+ chars), phone (strip, regex `^[6-9]\d{9}$`), email (strip, lower, EmailField), team_size (must be in choices), industry (must be in choices), type (must be in choices, default SALES)
- [x] 2.2 Add cross-field validation: no additional cross-field rules needed (no date/slot conflicts unlike DemoBooking)

## 3. Backend — Enquiry API Endpoint

- [x] 3.1 Add `create_enquiry` view to `backend/leads/views.py` using `@api_view(["POST"])`: honeypot check (_hp → fake 201), validate via EnquirySerializer, save in transaction.atomic(), send customer + admin emails, return 201
- [x] 3.2 Add `list_enquiries` view to `backend/leads/views.py` using `@api_view(["GET"])`: return empty paginated response (auth deferred)
- [x] 3.3 Add email functions `_send_enquiry_customer_email()` and `_send_enquiry_admin_email()` using `send_mail()` with plain text
- [x] 3.4 Add `ENQUIRY_NOTIFY_EMAIL` to `backend/config/settings.py` (default: `info@optiflow.co.in`)
- [x] 3.5 Wire URL routes in `backend/leads/urls.py`: `POST /api/enquiries/` → `create_enquiry`, `GET /api/enquiries/` → `list_enquiries`

## 4. Backend — Rate Limiting

- [x] 4.1 Add DRF throttle configuration to `backend/config/settings.py`: `DEFAULT_THROTTLE_CLASSES` with `AnonRateThrottle`, `DEFAULT_THROTTLE_RATES` with `anon` scope (default 100/hour for general API)
- [x] 4.2 Add enquiry-specific throttle scope: `enquiries` scope at 5/hour, applied to `create_enquiry` view via `EnquiryRateThrottle` class

## 5. Frontend — ContactForm Component

- [x] 5.1 Create `frontend/src/components/ContactForm.tsx` with 7 fields (Name, Company, Phone, Email, Team Size select, Industry select, Challenges textarea) using existing `Input` component pattern
- [x] 5.2 Add honeypot field (`name="_hp"`, `tabIndex={-1}`, `aria-hidden`, positioned off-screen)
- [x] 5.3 Add client-side validation function: name (3+ chars), company (required), phone (regex `^[6-9]\d{9}$`), email (valid format), team_size and industry (not placeholder)
- [x] 5.4 Add submission state machine: default → submitting (form fields dimmed + button loading) → success (check icon + "expect response in 24 hours" message) / error (retry button)
- [x] 5.5 Add fetch POST to `/api/enquiries/` with FormData JSON body; handle 201 (success), 400 (field errors), network error (error state)
- [x] 5.6 Add inline styles referencing `var(--*)` CSS variables matching `BookingForm` pattern

## 6. Frontend — ChannelCard Component

- [x] 6.1 Create `ChannelCard` component in `frontend/src/components/ChannelCard.tsx` with props: `icon`, `title`, `detail`, `actionLink?`, `actionLabel?`, `variant` (`'sales'` | `'support'`)
- [x] 6.2 Sales variant: accent-colored icon container (`var(--accent-soft)` bg, `var(--accent)` icon color)
- [x] 6.3 Support variant: teal-colored icon container (`var(--teal-soft)` bg, `var(--teal)` icon color)
- [x] 6.4 Action link renders below detail text with appropriate color variant

## 7. Frontend — OfficeInfo Component

- [x] 7.1 Create `OfficeInfo` component in `frontend/src/components/OfficeInfo.tsx` displaying: address, phone, email, business hours, "Open for Business" status badge
- [x] 7.2 Use canonical data from `data/site.ts` for phone, email, address
- [x] 7.3 Green iconography for the status badge

## 8. Frontend — ResponsePromiseCard Component

- [x] 8.1 Create `ResponsePromiseCard` component in `frontend/src/components/ResponsePromiseCard.tsx` with props: `icon`, `title`, `description`
- [x] 8.2 Green-colored icon container (`var(--green-soft)` bg, `var(--green)` icon color)

## 9. Frontend — ContactPage Composition

- [x] 9.1 Replace placeholder `frontend/src/pages/Contact.tsx` with full page composition
- [x] 9.2 Hero section: badge "GET IN TOUCH", h1, lead, 2 CTAs (scroll to form + link to demo), chat SVG illustration card, 3 overlay stats
- [x] 9.3 Contact form section: heading "Send Us a Message", render `<ContactForm>`
- [x] 9.4 Sales channels section: 3 `<ChannelCard variant="sales">` for Call (tel link), Email (mailto link), WhatsApp (wa.me link) using `site` data
- [x] 9.5 Support channels section: 3 `<ChannelCard variant="support">` for Support Email, Helpdesk Portal, Knowledge Base
- [x] 9.6 Office info section: render `<OfficeInfo>`
- [x] 9.7 Response promises section: 4 `<ResponsePromiseCard>` for Sales, Support, Critical, Demo timeframes
- [x] 9.8 Trust bar section: reuse existing `<TrustBar>` component
- [x] 9.9 FAQ section: 7 accordion items matching contact.html FAQ content
- [x] 9.10 Final CTA section: inline CTA with gradient section
- [x] 9.11 All sections use `<Section>` wrapper; all CTAs use `<Button>`; all contact data from `site.ts`

## 10. Route and Integration

- [x] 10.1 Verify `/contact` route in `frontend/src/routes.ts` maps to `Contact.tsx` (already configured, verified)
- [x] 10.2 Test full flow: fill form → submit → verify 201 in DB → check email notification sent *(needs running backend)*

## 11. Static HTML Audit

- [x] 11.1 Compare rendered React contact page against `src/pages/contact.html` for visual parity (all 8 sections, correct content, matching layout) *(needs running frontend)*
- [x] 11.2 Verify all `{{PLACEHOLDER}}` values resolved correctly (no raw `{{PHONE}}`, `{{EMAIL}}`, etc. in rendered output) *(needs running frontend)*

## 12. Validation

- [x] 12.1 Run `npm run build` and verify no TypeScript errors
- [x] 12.2 Run `npm run validate` and verify no lint or validation failures
- [x] 12.3 Run backend tests: `python manage.py test leads` (create test cases for valid submit, missing name, invalid phone, honeypot) *(needs running PostgreSQL)*
