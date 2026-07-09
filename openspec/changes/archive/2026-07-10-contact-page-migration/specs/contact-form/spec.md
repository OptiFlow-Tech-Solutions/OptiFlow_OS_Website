# contact-form

## Purpose

Contact form component — 7 input fields, honeypot spam protection, client-side validation, submission state management, and API integration with the Django backend at `POST /api/enquiries/`.

## Requirements

### Requirement: Contact form renders 7 input fields
The ContactForm component SHALL render 7 labeled input fields: Full Name (text, required), Company Name (text, required), Phone Number (tel, required), Email Address (email, required), Team Size (select, required), Industry (select, required), and Current Challenges (textarea, optional).

#### Scenario: All fields render with labels
- **WHEN** ContactForm component mounts
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
The form SHALL validate fields on submit and display per-field error states using the `Input` component's `variant="error"` prop. The submit button SHALL be disabled while submitting.

#### Scenario: Empty required fields show errors
- **WHEN** user submits the form with all fields empty
- **THEN** name, company, phone, email, team size, and industry fields display error styling and the form does not submit

#### Scenario: Name shorter than 3 characters shows error
- **WHEN** user enters a name with fewer than 3 characters and submits
- **THEN** the name field shows a validation error and the form does not submit

#### Scenario: Invalid Indian phone shows error
- **WHEN** user enters a phone number that is not 10 digits starting with 6-9
- **THEN** the phone field shows an error and the form does not submit

#### Scenario: Invalid email shows error
- **WHEN** user enters an email without `@` or domain
- **THEN** the email field shows an error and the form does not submit

#### Scenario: Valid form allows submission
- **WHEN** all required fields pass validation
- **THEN** the form submits to `POST /api/enquiries/` and the submit button enters loading state

### Requirement: Form has submission state management
The form SHALL support three states: default (fields visible, button active), submitting (fields dimmed, button shows loading), success (fields hidden, success message with check icon), and error (fields hidden, error message with retry button).

#### Scenario: Submitting state dims form
- **WHEN** form is submitting
- **THEN** all fields and the submit button have reduced opacity, the button shows a loading indicator, and fields are not interactive

#### Scenario: Success state shows confirmation
- **WHEN** enquiry is successfully submitted
- **THEN** form fields are hidden, a success message with check icon displays "Message Sent Successfully", and text "We'll respond within one business day. For urgent matters, call us at [phone] or use WhatsApp."

#### Scenario: Error state allows retry
- **WHEN** API submission fails
- **THEN** form fields are hidden, an error message displays "Something went wrong. Please try again.", and a retry button resets the form to default state

#### Scenario: Retry button resets form
- **WHEN** user clicks retry button in error state
- **THEN** the form returns to the default state with all fields cleared and the submit button re-enabled

### Requirement: Form submits to Enquiry API
The ContactForm SHALL POST form data as JSON to `/api/enquiries/` using the website's standard API envelope format. On success (201), it SHALL transition to success state. On validation error (400), it SHALL display field-level errors from the API response. On network or server error, it SHALL transition to error state.

#### Scenario: Successful submission posts to API
- **WHEN** a valid form is submitted
- **THEN** a POST request is sent to `/api/enquiries/` with JSON body containing name, company, phone, email, team_size, industry, challenges, and _hp fields

#### Scenario: API validation errors display field messages
- **WHEN** the API returns 400 with field-level errors
- **THEN** each field with an error displays the server error message below the field

#### Scenario: Network failure shows error state
- **WHEN** the fetch call rejects or returns a non-200/201/400 status
- **THEN** the error state displays with a retry button

### Requirement: API 201 on honeypot-filled submission
When the honeypot `_hp` field contains a value, the backend SHALL return a 201 response without persisting the submission. The form SHALL treat this identically to a successful submission (transition to success state).

#### Scenario: Honeypot submission shows fake success
- **WHEN** the form is submitted with a honeypot value
- **THEN** the API returns 201, the form shows the success state, but no Enquiry record is created
