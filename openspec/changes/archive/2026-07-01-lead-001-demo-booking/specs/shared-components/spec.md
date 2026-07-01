# Shared Components — Delta

## ADDED Requirements

### Requirement: Shared Form Submission Utility

The system SHALL provide a `submitForm(formElement)` function in `core.js` that handles form submission with state management, validation, UTM capture, and endpoint posting.

#### Scenario: Form submission with state transitions
- **GIVEN** a `<form>` element with `data-endpoint` attribute
- **WHEN** `submitForm(formElement)` is called
- **THEN** the form SHALL add class `form-submitting`
- **AND** all inputs and the submit button SHALL be disabled
- **AND** form data SHALL be collected from all named inputs, selects, and textareas
- **AND** UTM parameters from the URL SHALL be appended to the payload

#### Scenario: Success state rendering
- **GIVEN** a form in `form-submitting` state
- **WHEN** the endpoint returns a 2xx response
- **THEN** `form-submitting` class SHALL be removed
- **AND** `form-success` class SHALL be added
- **AND** the form's inner content SHALL be replaced with a success message element

#### Scenario: Error state with retry
- **GIVEN** a form in `form-submitting` state
- **WHEN** the fetch fails or returns a non-2xx response
- **THEN** `form-submitting` class SHALL be removed
- **AND** `form-error` class SHALL be added
- **AND** an error message SHALL be displayed with a retry button
- **AND** clicking retry SHALL call `submitForm()` again

#### Scenario: Page-specific validation preserves pre-submit check
- **GIVEN** the demo booking or contact page
- **WHEN** the form's submit event fires
- **THEN** page-level validation (required fields, email/phone format) SHALL run first
- **AND** only after validation passes SHALL `submitForm()` from core.js be called
