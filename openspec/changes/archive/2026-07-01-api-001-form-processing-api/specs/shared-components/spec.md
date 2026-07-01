## MODIFIED Requirements

### Requirement: Shared Form Submission Utility

The system SHALL provide a `submitForm(formElement)` function in `core.js` that handles form submission with state management, validation, UTM capture, honey-pot injection, and endpoint posting.

#### Scenario: Form submission with state transitions
- **GIVEN** a `<form>` element with `data-endpoint` attribute
- **WHEN** `submitForm(formElement)` is called
- **THEN** the form SHALL add class `form-submitting`
- **AND** all inputs and the submit button SHALL be disabled
- **AND** form data SHALL be collected from all named inputs, selects, and textareas (excluding `_hp`)
- **AND** UTM parameters from the URL SHALL be appended to the payload
- **AND** a honey-pot field (`_hp`) SHALL be injected if not present

#### Scenario: Default endpoint routing
- **GIVEN** a `<form>` element with no `data-endpoint` and no `data-netlify`
- **WHEN** `submitForm(formElement)` is called
- **THEN** the form SHALL POST to `/api/form-submit`
- **AND** the payload SHALL be structured as `{ formName, fields, honeyPot, utm }`

#### Scenario: API response error handling
- **GIVEN** a form in `form-submitting` state
- **WHEN** the endpoint returns HTTP 200 with `{ success: false, error: "..." }` or HTTP 422/429
- **THEN** `form-submitting` class SHALL be removed
- **AND** `form-error` class SHALL be added
- **AND** the API error message SHALL be displayed to the user

#### Scenario: Success state rendering
- **GIVEN** a form in `form-submitting` state
- **WHEN** the endpoint returns a 2xx response with `{ success: true }`
- **THEN** `form-submitting` class SHALL be removed
- **AND** `form-success` class SHALL be added
- **AND** the form's inner content SHALL be replaced with a success message element

#### Scenario: Error state with retry
- **GIVEN** a form in `form-submitting` state
- **WHEN** the fetch fails or returns an error response
- **THEN** `form-submitting` class SHALL be removed
- **AND** `form-error` class SHALL be added
- **AND** an error message SHALL be displayed with a retry button
- **AND** clicking retry SHALL call `submitForm()` again

#### Scenario: Page-specific validation preserves pre-submit check
- **GIVEN** the demo booking or contact page
- **WHEN** the form's submit event fires
- **THEN** page-level validation (required fields, email/phone format) SHALL run first
- **AND** only after validation passes SHALL `submitForm()` from core.js be called
