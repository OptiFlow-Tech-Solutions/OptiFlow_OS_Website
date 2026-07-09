## 1. Backend — DemoBooking Model

- [x] 1.1 Create `DemoBooking` model in `backend/leads/models.py` with all fields (name, company, mobile, email, team_size, industry, challenges, preferred_date, preferred_time_slot, status, created_at, updated_at)
- [x] 1.2 Add `UniqueConstraint` with condition on `(preferred_date, preferred_time_slot)` excluding CANCELLED status
- [x] 1.3 Register `DemoBooking` in `backend/leads/admin.py` with list_display, search_fields, list_filter
- [x] 1.4 Run `python manage.py makemigrations leads` and `python manage.py migrate`

## 2. Backend — Serializers & Validation

- [x] 2.1 Create `backend/leads/serializers.py` with `DemoBookingSerializer` including all fields
- [x] 2.2 Add server-side validation: name (3-100 chars), company (2+ chars), mobile (10 digits, 6-9 start), email format
- [x] 2.3 Add team_size validation against allowed values list
- [x] 2.4 Add industry validation against allowed values list
- [x] 2.5 Add preferred_date validation (must be weekday, >= tomorrow)
- [x] 2.6 Add preferred_time_slot validation (must be in valid slots for that day of week)

## 3. Backend — API Endpoints

- [x] 3.1 Create `POST /api/demo-bookings/` view in `backend/leads/views.py` — validate serializer, save with `select_for_update` transaction, send emails
- [x] 3.2 Create `GET /api/demo-bookings/slots/` view — accept `?date=` query param, return available slots array
- [x] 3.3 Add honeypot check: if `_hp` field has value, return 201 without persisting
- [x] 3.4 Wire URLs in `backend/leads/urls.py` and include in `backend/config/urls.py`
- [x] 3.5 Add `DEMO_BOOKING_NOTIFY_EMAIL` env var to settings with sensible default

## 4. Backend — Email Notifications

- [x] 4.1 Add SMTP email backend configuration to `backend/config/settings.py` via env vars
- [x] 4.2 Create customer confirmation email template (subject: "Demo Request Received", body: date/time details)
- [x] 4.3 Create admin notification email (subject: "New Demo Booking", body: customer/company/date/time)
- [x] 4.4 Send both emails in the POST view; log errors but don't fail the request on email failure

## 5. Frontend — Shared Section Components

- [x] 5.1 Create `frontend/src/components/sections/DashboardMockup.tsx` with 4 KPI cards and 7-bar chart
- [x] 5.2 Export DashboardMockup from `components/index.ts`

## 6. Frontend — BookingForm Component

- [x] 6.1 Create `frontend/src/components/BookingForm.tsx` with 7 fields (name, company, mobile, email, team_size, industry, challenges) plus honeypot
- [x] 6.2 Implement client-side validation: required fields, email format, Indian mobile regex, team_size/industry in allowed values
- [x] 6.3 Implement form state management: default → submitting → success → error states with appropriate UI
- [x] 6.4 Implement API submission: POST to `/api/demo-bookings/` with form + calendar data; display field-level errors from server
- [x] 6.5 Wire calendar "Confirm" to trigger `form.requestSubmit()` via a forwarded ref or callback
- [x] 6.6 Export BookingForm from `components/index.ts`

## 7. Frontend — CalendarWidget Component

- [x] 7.1 Create `frontend/src/components/CalendarWidget.tsx` with state: currentYear, currentMonth, selectedDate, selectedSlot
- [x] 7.2 Implement month navigation (prev/next) with year boundary handling
- [x] 7.3 Implement day grid rendering with past/today/selected visual states and click handling
- [x] 7.4 Implement slot availability fetch from `GET /api/demo-bookings/slots/?date=` on date selection
- [x] 7.5 Implement time slot rendering: 9 slots weekdays, 4 slots Saturdays, empty Sundays; exclude booked slots from API
- [x] 7.6 Implement slot selection, summary display, and confirm button activation
- [x] 7.7 Implement confirmed state (success panel with check icon and message)
- [x] 7.8 Display "All times in IST" label
- [x] 7.9 Export CalendarWidget from `components/index.ts`

## 8. Frontend — Page Assembly (DemoBooking.tsx)

- [x] 8.1 Rewrite `frontend/src/pages/DemoBooking.tsx` with full content replacing the placeholder
- [x] 8.2 Render hero section with badge, heading, lead, CTAs, trust checkmarks, and DashboardMockup
- [x] 8.3 Render "Why Book" section with 6 BenefitCard inline components (blue/teal/green icon variants)
- [x] 8.4 Render trust bar with 4 counter stat items
- [x] 8.5 Render "What You'll Experience" section with TimelineSteps (6 steps, duration badge)
- [x] 8.6 Render "What You Walk Away With" section with 6 benefit cards
- [x] 8.7 Render booking form section with BookingForm component, limited-banner, and form error/success handling
- [x] 8.8 Render calendar section with CalendarWidget component
- [x] 8.9 Render FAQ section with 8 accordion items
- [x] 8.10 Render final CTA section with heading, CTAs, and trust checkmarks
- [x] 8.11 Ensure all CTAs use `<Button as={Link}>` pattern and all sections use `<Section>` component
- [x] 8.12 Add responsive styles matching the static HTML breakpoints

## 9. Integration & Verification

- [x] 9.1 Wire BookingForm and CalendarWidget together: calendar confirm triggers form submit, form state reflects calendar selection
- [x] 9.2 Verify end-to-end flow: fill form → select date → select slot → confirm → API call → success state
- [x] 9.3 Verify error states: validation errors display per-field, network errors show retry, slot capacity errors show message
- [x] 9.4 Run `npm run build` to verify TypeScript compilation and production build
- [x] 9.5 Run `npm run validate` (if available) to check links, SEO, and consistency
- [x] 9.6 Verify page content against `demo-booking.html` for content fidelity (all headings, paragraphs, lists match)
