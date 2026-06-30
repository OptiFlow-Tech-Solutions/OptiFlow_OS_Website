# Accessibility — Delta Spec

## ADDED: Keyboard-Accessible Calendar

The demo-booking calendar SHALL be fully keyboard accessible.

#### Scenario: Calendar date via keyboard

- **GIVEN** the calendar widget on the demo-booking page
- **WHEN** the user focuses a date cell and presses Enter or Space
- **THEN** the date SHALL be selected
- **AND** the visual focus ring SHALL be visible

#### Scenario: Calendar navigation via keyboard

- **GIVEN** the calendar widget
- **WHEN** the user focuses the prev/next month buttons and presses Enter
- **THEN** the calendar SHALL navigate to the adjacent month
- **AND** `aria-label` SHALL describe the button action

## ADDED: Form Validation Accessibility

Form validation errors SHALL be communicated to screen readers via `aria-invalid` and `aria-describedby`.

#### Scenario: Invalid field announced

- **GIVEN** a form with validation
- **WHEN** a required field is empty and the form is submitted
- **THEN** the field SHALL receive `aria-invalid="true"`
- **AND** the error message SHALL be linked via `aria-describedby`

## ADDED: Animation Pause on Visibility Change

Animations SHALL pause when the page is hidden (tab switch, minimize).

#### Scenario: Typewriter pauses on blur

- **GIVEN** a typewriter animation is running
- **WHEN** the user switches to a different browser tab
- **THEN** the typewriter SHALL pause
- **AND** it SHALL resume when the tab becomes visible again

#### Scenario: Pain-point rotator pauses on blur

- **GIVEN** the pain-point rotator is auto-rotating
- **WHEN** the user switches to a different browser tab
- **THEN** the rotation SHALL pause
- **AND** it SHALL resume when the tab becomes visible again
