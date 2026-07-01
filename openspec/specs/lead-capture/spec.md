# Lead Capture

## Purpose

Define the shared form submission system for lead capture across the OptiFlow OS static website — enabling demo booking and contact forms to send data to a real endpoint with proper validation, user feedback, and UTM tracking.
## Requirements
### Requirement: Shared Form Submission

The system SHALL provide a `submitForm()` function in `core.js` that handles form submission with a state machine (idle → submitting → success → error → idle).

#### Scenario: Successful submission
- **WHEN** a user submits a validated form with a configured endpoint
- **THEN** the form SHALL enter `submitting` state showing a loading indicator
- **AND** the form data SHALL be POSTed to the endpoint
- **AND** a honey-pot field SHALL be injected if not present
- **AND** on 2xx response, if the response body contains `success: true`, the form SHALL transition to `success` state
- **AND** if the response body contains `success: false`, the form SHALL transition to `error` state with the API error message

#### Scenario: Submission error
- **WHEN** a form submission fails (network error or non-2xx response)
- **THEN** the form SHALL transition to `error` state showing the error message
- **AND** a retry button SHALL be displayed
- **AND** clicking retry SHALL re-enter `submitting` state and re-POST

#### Scenario: Form returns to idle on retry
- **WHEN** a form is in `error` state and the user clicks retry
- **THEN** the form SHALL re-submit
- **AND** on failure, the form SHALL return to `error` state with the new error message

### Requirement: Endpoint Configuration

Forms SHALL configure their submission target via `data-endpoint` attribute on the `<form>` element. The `data-netlify` attribute provides a Netlify Forms fallback.

#### Scenario: Netlify Forms endpoint
- **WHEN** a form has `data-netlify="true"` attribute
- **THEN** the submission SHALL use `Content-Type: application/x-www-form-urlencoded`
- **AND** `form-name` SHALL be sent as a hidden field with the form's `name` attribute value
- **AND** the honey-pot field value SHALL be included in the payload

#### Scenario: JSON API endpoint
- **WHEN** a form has `data-endpoint` set to a URL (not Netlify Forms)
- **THEN** the submission SHALL use `Content-Type: application/json`
- **AND** form data SHALL be sent as a JSON object with `formName`, `fields`, `honeyPot`, and `utm` keys

#### Scenario: Missing endpoint defaults to API
- **WHEN** a form has no `data-endpoint` and no `data-netlify` attribute
- **THEN** the submission SHALL POST to `/api/form-submit` with JSON content type
- **AND** the form SHALL NOT log a warning or show an error

### Requirement: UTM Parameter Capture

The system SHALL capture UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) from the current URL and include them in form submission payloads.

#### Scenario: UTM params present
- **WHEN** the URL contains `?utm_source=linkedin&utm_medium=cpc&utm_campaign=launch`
- **THEN** the form payload SHALL include `utm_source: "linkedin"`, `utm_medium: "cpc"`, `utm_campaign: "launch"`

#### Scenario: No UTM params
- **WHEN** the URL contains no UTM parameters
- **THEN** the form payload SHALL NOT include any `utm_*` fields

### Requirement: Form State Styling

The system SHALL provide CSS classes for form submission states applied to the form element.

#### Scenario: Submitting state
- **WHEN** a form has class `form-submitting`
- **THEN** the submit button SHALL be disabled
- **AND** the submit button SHALL display a loading indicator (CSS spinner)
- **AND** all form inputs SHALL be disabled

#### Scenario: Success state
- **WHEN** a form has class `form-success`
- **THEN** form fields SHALL be hidden
- **AND** a success message SHALL be displayed in their place

#### Scenario: Error state
- **WHEN** a form has class `form-error`
- **THEN** the error message SHALL be displayed above the submit button
- **AND** a retry button SHALL be shown

### Requirement: Honey-Pot Spam Detection

All forms using `submitForm()` SHALL include an invisible honey-pot field that bots auto-fill but humans never see or interact with.

#### Scenario: Honey-pot field injected
- **WHEN** a form with `data-endpoint` or `data-netlify` is submitted
- **THEN** `submitForm()` SHALL append a hidden `<input>` with name `_hp`, `tabindex="-1"`, and `autocomplete="off"` if one does not already exist
- **AND** the honey-pot field SHALL be visually hidden via CSS (`position: absolute; left: -9999px`)

#### Scenario: Honey-pot field present in source
- **WHEN** a form already contains `<input name="_hp" ...>` in the HTML source
- **THEN** `submitForm()` SHALL NOT inject a duplicate honey-pot field

### Requirement: Default API Endpoint

When no `data-endpoint` and no `data-netlify` attribute are present, `submitForm()` SHALL default to POSTing to `/api/form-submit`.

#### Scenario: Default endpoint used
- **WHEN** a form has neither `data-endpoint` nor `data-netlify`
- **THEN** `submitForm()` SHALL POST to `/api/form-submit` with `Content-Type: application/json`
- **AND** the payload SHALL include `formName` (from the form's `name` attribute), `fields` (object of all named inputs), `honeyPot` (value of `_hp` field), and `utm` (captured UTM params)

