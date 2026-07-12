## Why

The demo booking page is the primary conversion path for OptiFlow OS — it's where interested MSME owners schedule personalized product walkthroughs. The current `demo-booking.html` is a 614-line static page with a client-only calendar widget and a Netlify-bound form that doesn't persist bookings. The React stub (`DemoBooking.tsx`) is a 14-line placeholder. This is the highest-value page with no backend integration and no real booking capability.

## What Changes

- Replace the 14-line `DemoBooking.tsx` placeholder with a full React page matching `demo-booking.html` content (hero, 12 benefit cards, trust bar, 6-step timeline, FAQ, CTAs)
- Build `BookingForm` component with 7 fields, client-side validation (Indian mobile, email, required fields), honeypot, and API submission
- Build `CalendarWidget` component with month navigation, day grid, time slot selection, weekday/weekend logic, and booking confirmation flow
- Create `DemoBooking` Django model with fields: name, company, mobile, email, team_size, industry, challenges, preferred_date, preferred_time_slot, status
- Implement `POST /api/demo-bookings/` endpoint with validation, persistence, and email notification to customer and admin
- Implement `GET /api/demo-bookings/slots/?date=` endpoint returning available time slots
- Add optimistic concurrency control to prevent double-booking of the same slot
- All times stored and displayed in IST (Asia/Kolkata) to match the Indian MSME target audience

## Capabilities

### New Capabilities
- `demo-booking-page`: Full React page component replacing the 14-line placeholder, rendering all 8 sections (hero, benefits x2, trust bar, timeline, booking form, calendar, FAQ, CTA) with content matching the static HTML source
- `demo-booking-form`: Booking form component with 7 input fields (name, company, mobile, email, team_size, industry, challenges), honeypot spam protection, client-side validation, form submission states (submitting/success/error), and API integration
- `demo-booking-calendar`: Calendar widget with month navigation, day grid (past dates disabled, today highlighted), time slot display (9 slots weekdays, 4 slots weekends, none on Sunday), slot selection with summary and confirm button, and confirmed state
- `demo-booking-api`: Django REST API providing `POST /api/demo-bookings/` (validate, persist, send email) and `GET /api/demo-bookings/slots/?date=` (return available time slots for a given date, excluding already-booked slots)

### Modified Capabilities
- `page-migration`: Adds explicit DemoBooking page scenarios to the "all 17 pages render complete content" requirement, covering form rendering, calendar interaction, validation, submission flow, and booking integration

## Impact

- **Frontend**: `DemoBooking.tsx` rewritten; new components `BookingForm.tsx`, `CalendarWidget.tsx`; reusable `BenefitCard.tsx`, `TimelineSteps.tsx`; new `sections/DashboardMockup.tsx` for the hero visual
- **Backend**: `backend/leads/models.py` gets `DemoBooking` model; `backend/leads/views.py` gets DRF views; `backend/leads/serializers.py` new; `backend/leads/urls.py` wired to `/api/demo-bookings/`
- **Database**: New `leads_demobooking` table via Django migration; requires `unique_together` constraint on `(preferred_date, preferred_time_slot)` excluding cancelled bookings
- **Email**: Django `send_mail` with SMTP backend config; admin notification address via `settings.py` env var
- **Dependencies**: F-DS-001 (design system), F-LAY-001 (page layout), F-ROUTE-001 (routing — already registered), F-ARCH-001 (Django + React scaffold — already in place)
