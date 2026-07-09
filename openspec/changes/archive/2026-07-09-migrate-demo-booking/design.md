## Context

The demo booking page (`src/pages/demo-booking.html`, 614 lines) is the primary conversion page for OptiFlow OS. It currently exists as a static HTML page with a client-only calendar widget and a Netlify-bound form. The React version (`DemoBooking.tsx`) is a 14-line placeholder. The backend Django `leads` app has stub model/view files with no actual implementation.

The project uses React 19 + Vite 6 + Tailwind CSS 4 + React Router 7 on the frontend, and Django 5 + DRF + PostgreSQL on the backend. Shared components (Section, Container, Card, Button, Input) are already available. The route `/demo-booking` is registered in `routes.ts`.

## Goals / Non-Goals

**Goals:**
- Render all 8 sections from the static HTML in React with content fidelity
- Build a functional booking form that validates inputs and submits to the Django API
- Build a calendar widget that shows available time slots and lets users select date+time
- Implement the Django backend with model, serializer, views, and email notification
- Prevent double-booking of the same time slot
- Match the static page's visual design using existing shared components and design tokens

**Non-Goals:**
- Calendar sync with Google/Outlook calendars (future feature)
- Real-time slot updates via WebSocket (polling or page reload is sufficient)
- Admin dashboard for managing bookings (Django admin is sufficient)
- SMS notifications (email only for now)
- Rescheduling or cancellation self-service (manual via contact for now)
- Timezone conversion — all times are IST (Asia/Kolkata)

## Decisions

### D1: Form + Calendar: Single-page combined flow

**Decision:** The form and calendar are separate visual sections on the same page, but they submit as one combined API call. The calendar section scrolls the user to the form section. When the calendar's "Confirm Booking" is clicked, it triggers the form submission.

**Alternatives considered:**
- Multi-step wizard (form → calendar): Adds unnecessary complexity; the original page has both visible at once
- Calendar-only with form in a modal: Loses the reading/scanning flow of the original page

**Rationale:** The original page has the form and calendar as sequential sections. Keeping them on the same page preserves the original user journey: scroll → read benefits → fill form → pick slot → confirm. The calendar "Confirm" button programmatically submits the form via `form.requestSubmit()`, collecting all data in one POST.

### D2: Optimistic concurrency for slot booking

**Decision:** Use `unique_together` constraint on `(preferred_date, preferred_time_slot)` with a conditional unique constraint excluding `CANCELLED` status, plus a database-level `SELECT FOR UPDATE` in a transaction.

**Alternatives considered:**
- Reservation pattern with TTL: Adds Redis dependency and complexity; overkill for 1-3 bookings/day
- Client-only check with no DB constraint: Race condition; two people can book the same slot

**Rationale:** At demo booking volume (~1-3/day), a simple pessimistic lock in a transaction is correct and fast. The DB constraint is a safety net. If volume grows, add a 5-minute reservation pattern later.

### D3: IST-only timezone

**Decision:** All time slots are stored as strings (`"10:00 AM"`) and dates as `DateField`. The backend treats all times as IST (Asia/Kolkata, already `TIME_ZONE` in settings). The UI displays "All times in IST" label.

**Rationale:** The target audience is Indian MSMEs. Adding timezone conversion introduces complexity with no user benefit. If international customers become a meaningful segment, add timezone support then.

### D4: BenefitCard and TimelineSteps as inline components

**Decision:** `BenefitCard` and `TimelineSteps` are defined as internal components within `DemoBooking.tsx`, not extracted to shared components.

**Alternatives considered:**
- Extract to `components/sections/` for reuse: Premature. Only this page uses them currently. Lift later if needed.

**Rationale:** These components are page-specific content layout helpers. They have no behavior or state — just markup. Extracting them creates indirection without benefit. Follow YAGNI.

### D5: DashboardMockup as a separate file

**Decision:** `DashboardMockup` lives in `components/sections/DashboardMockup.tsx` — NOT in the DemoBooking page file.

**Rationale:** The feature spec marks it as "reusable." It's a 80-line decorative component with KPI cards and a bar chart. It may appear on other pages (product overview, features). Extracting avoids duplication.

### D6: Form validation: client-side + server-side

**Decision:** Client-side validation provides instant field-level errors (required, email format, Indian mobile regex, team_size/industry in allowed values, date constraints). Server-side validation repeats all checks and returns field-level errors in the same format.

**Rationale:** Client validation is UX — fast feedback. Server validation is security — the API is the trust boundary. Both layers use the same ruleset. The frontend validation can't check slot availability (that requires a DB query), so the server is authoritative for that.

### D7: Email sending: synchronous Django send_mail

**Decision:** Use Django's built-in `send_mail()` in the view, synchronously. Configure SMTP via environment variables (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`).

**Rationale:** No Celery/Redis needed. At 1-3 bookings/day, the 500ms email send is imperceptible. If volume grows, wrap in `django.core.mail.send_mail` with a task queue later.

### D8: Honeypot field retained

**Decision:** Keep the hidden honeypot field (`name="_hp"`) in the React form. If the field has a value on submit, the backend silently returns success but doesn't persist the booking.

**Rationale:** The static page already has this. It's a zero-friction spam filter. No CAPTCHA dependency needed for a form that gets ~3 submissions/day.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Slot double-booking under concurrent requests | `unique_together` DB constraint + `SELECT FOR UPDATE` in transaction |
| Calendar timezone confusion for non-IST users | "All times in IST" label on calendar; IST is project default |
| Email deliverability issues (spam folder) | Configure SPF/DKIM for sending domain; use transactional email service (SendGrid/Mailgun) if deliverability is poor |
| Form spam via bot submissions | Honeypot field blocks basic bots; add rate limiting if spam increases |
| Calendar month navigation edge cases (year boundary) | Standard `Date` arithmetic — well-tested pattern |
| `unique_together` can't conditionally exclude CANCELLED | Use a `UniqueConstraint` with a `Q` condition (Django 2.2+) — `UniqueConstraint(fields=['preferred_date','preferred_time_slot'], condition=~Q(status='CANCELLED'))` |

## Open Questions

None — all design decisions are resolved above.
