# demo-booking-calendar

## Purpose

Calendar widget component for demo booking — month navigation, day grid, time slot selection, API availability fetch, IST timezone label.

## Requirements

### Requirement: Calendar renders month navigation and day grid
The CalendarWidget component SHALL display the current month with previous/next navigation buttons, a 7-column weekday header (Su-Sa), and a day grid with the correct number of days for the displayed month.

#### Scenario: Current month displays on mount
- **WHEN** CalendarWidget mounts
- **THEN** the current month and year are displayed (e.g., "July 2026") and the day grid shows the correct number of days

#### Scenario: Previous month button works
- **WHEN** user clicks the previous month button
- **THEN** the calendar displays the previous month with correct days

#### Scenario: Next month button works
- **WHEN** user clicks the next month button
- **THEN** the calendar displays the next month with correct days

#### Scenario: Month boundary navigation works
- **WHEN** user navigates from January to December (previous) or December to January (next)
- **THEN** the year changes correctly

### Requirement: Day grid shows visual states
The day grid SHALL visually distinguish past dates (dimmed, not clickable), today's date (teal border), and the currently selected date (accent background, white text).

#### Scenario: Past dates are disabled
- **WHEN** the calendar renders
- **THEN** dates before today are displayed with reduced opacity and are not clickable

#### Scenario: Today is highlighted
- **WHEN** the calendar renders
- **THEN** today's date has a teal border and bold font weight

#### Scenario: Selected date is highlighted
- **WHEN** user clicks a future date
- **THEN** that date gets an accent-colored background with white text

#### Scenario: Clicking a new date deselects previous
- **WHEN** user has date A selected and clicks date B
- **THEN** date B becomes selected and date A returns to default state

### Requirement: Time slots display based on selected date
When a date is selected, the time slot panel SHALL display available time slots for that date. Weekdays (Mon-Fri) SHALL show 9 slots (9:00 AM to 7:00 PM), weekends (Saturday) SHALL show 4 slots (9:00 AM to 12:00 PM), and Sundays SHALL show no slots.

#### Scenario: Weekday shows 9 slots
- **WHEN** user selects a Monday through Friday
- **THEN** the time slot panel displays 9 slots: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM, 6:00 PM, 7:00 PM

#### Scenario: Saturday shows 4 slots
- **WHEN** user selects a Saturday
- **THEN** the time slot panel displays 4 slots: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM

#### Scenario: Sunday shows no slots
- **WHEN** user selects a Sunday
- **THEN** the time slot panel displays a message that no slots are available on Sundays

#### Scenario: No date selected shows prompt
- **WHEN** no date is selected
- **THEN** the time slot panel displays "Select a date first" with helper text

### Requirement: Time slot selection activates confirm button
Clicking an available time slot SHALL select it (accent background) and display a summary of the selected date and time with a confirmation button.

#### Scenario: Clicking a slot selects it
- **WHEN** user clicks an available time slot
- **THEN** that slot is highlighted with accent background and white text, and any previously selected slot is deselected

#### Scenario: Summary displays after slot selection
- **WHEN** a date and time slot are both selected
- **THEN** a summary row shows the selected day and time (e.g., "Tue, 15 July 2026 at 10:00 AM")

#### Scenario: Confirm button activates after selection
- **WHEN** both date and time slot are selected
- **THEN** a "Confirm Booking" button appears

#### Scenario: Changing date clears slot selection
- **WHEN** user selects a time slot, then clicks a different date
- **THEN** the time slot selection is cleared and the summary and confirm button hide

### Requirement: Calendar confirms booking and transitions to success
Clicking "Confirm Booking" SHALL trigger the form submission and transition the calendar to a success state.

#### Scenario: Confirm triggers form submission
- **WHEN** user clicks "Confirm Booking"
- **THEN** the booking form's `requestSubmit()` is called, collecting all form data

#### Scenario: Calendar shows success state
- **WHEN** the booking is confirmed (form submits successfully)
- **THEN** the calendar panel transitions to a success state showing a check icon, "Demo Scheduled" heading, and confirmation text

### Requirement: Calendar fetches slot availability from API
When a date is selected, the calendar SHALL fetch available time slots from `GET /api/demo-bookings/slots/?date=<ISO-date>`. Already-booked slots SHALL be excluded from the displayed options.

#### Scenario: API call on date selection
- **WHEN** user selects a date
- **THEN** a GET request is made to `/api/demo-bookings/slots/?date=<YYYY-MM-DD>`

#### Scenario: Booked slots are excluded
- **WHEN** the API returns that "10:00 AM" is already booked for the selected date
- **THEN** "10:00 AM" is not displayed in the available time slots

#### Scenario: API error shows all slots as unavailable
- **WHEN** the slot availability API request fails
- **THEN** the calendar shows an error message and no slots are displayed (failing closed for safety)

### Requirement: Calendar displays IST timezone note
The calendar SHALL display a note indicating that all times are in Indian Standard Time (IST).

#### Scenario: Timezone note is visible
- **WHEN** the calendar section renders
- **THEN** a label or note reads "All times in IST (Indian Standard Time)"
