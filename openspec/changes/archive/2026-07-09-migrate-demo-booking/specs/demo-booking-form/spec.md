## ADDED Requirements

### Requirement: Booking form renders 7 input fields
The BookingForm component SHALL render 7 labeled input fields: Full Name (text, required), Company Name (text, required), Mobile Number (tel, required), Email Address (email, required), Team Size (select, required), Industry (select, required), and Current Challenges (textarea, optional).

#### Scenario: All fields render with labels
- **WHEN** BookingForm component mounts
- **THEN** all 7 fields are displayed with labels, placeholder text, and required indicators on required fields

#### Scenario: Team Size has 6 options
- **WHEN** the Team Size select is opened
- **THEN** options are: "Select team size" (placeholder), "1–10", "11–25", "26–50", "51–100", "101–250", "250+"

#### Scenario: Industry has 8 options
- **WHEN** the Industry select is opened
- **THEN** options are: "Select your industry" (placeholder), "Textile", "Manufacturing", "Trading", "Warehousing", "Distribution", "Logistics", "Service", "Other"

### Requirement: Form includes honeypot spam protection
The form SHALL include a hidden text input with `name="_hp"`, `tabindex="-1"`, and `aria-hidden="true"`, positioned off-screen. If this field contains a value on submission, the backend SHALL silently discard the submission.

#### Scenario: Honeypot field is hidden from users
- **WHEN** the form renders
- **THEN** the honeypot field is not visible and not focusable via keyboard navigation

### Requirement: Client-side validation provides field-level errors
The form SHALL validate fields on submit and display per-field error states. The submit button SHALL be disabled while submitting.

#### Scenario: Empty required fields show errors
- **WHEN** user submits the form with all fields empty
- **THEN** name, company, mobile, email, team size, and industry fields display error styling (red border) and the form does not submit

#### Scenario: Invalid Indian mobile shows error
- **WHEN** user enters a mobile number that is not 10 digits starting with 6-9
- **THEN** the mobile field shows an error and the form does not submit

#### Scenario: Invalid email shows error
- **WHEN** user enters an email without `@` or domain
- **THEN** the email field shows an error and the form does not submit

#### Scenario: Valid form allows submission
- **WHEN** all required fields pass validation
- **THEN** the form submits and the submit button enters loading state

### Requirement: Form has submission state management
The form SHALL support three states: default (fields visible, button active), submitting (fields dimmed, button shows loading), success (fields hidden, success message with check icon), and error (fields hidden, error message with retry button).

#### Scenario: Submitting state dims form
- **WHEN** form is submitting
- **THEN** all fields and the submit button have reduced opacity, the button shows a loading indicator, and fields are not interactive

#### Scenario: Success state shows confirmation
- **WHEN** booking is successfully submitted
- **THEN** form fields are hidden, a success message with check icon displays "Demo Request Received", and text "We'll contact you within one business day..."

#### Scenario: Error state shows retry button
- **WHEN** booking submission fails with a network or server error
- **THEN** the submit button is hidden, an error message displays, and a "Try Again" button resets the form to default state

### Requirement: Form submits combined booking data to API
The form SHALL collect all 7 field values plus the selected date and time slot from the calendar widget, and POST them to `/api/demo-bookings/`.

#### Scenario: Form sends all data on submit
- **WHEN** a valid form is submitted with calendar date and slot selected
- **THEN** a POST request is sent to `/api/demo-bookings/` with JSON body containing name, company, mobile, email, team_size, industry, challenges, preferred_date, and preferred_time_slot

#### Scenario: Calendar data flows through form submission
- **WHEN** calendar "Confirm Booking" button is clicked
- **THEN** it triggers `form.requestSubmit()` which submits the form with the selected date and time slot included

### Requirement: Team Size and Industry values match backend enum
The form SHALL send team_size and industry as the exact string values displayed in the dropdown options.

#### Scenario: Team Size value sent as displayed text
- **WHEN** user selects "11–25" for team size
- **THEN** the JSON body contains `"team_size": "11–25"`

#### Scenario: Industry value sent as displayed text
- **WHEN** user selects "Textile" for industry
- **THEN** the JSON body contains `"industry": "Textile"`
