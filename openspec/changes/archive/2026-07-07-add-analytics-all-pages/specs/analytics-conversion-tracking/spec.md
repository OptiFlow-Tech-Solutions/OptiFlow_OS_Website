## ADDED Requirements

### Requirement: TrackEvent helper function
`core.js` SHALL define a `trackEvent(name, props?)` function that wraps `window.plausible()` with a null guard. If `window.plausible` is not a function (script blocked, not loaded), the call SHALL be silently ignored without throwing an error.

#### Scenario: Plausible available
- **WHEN** `trackEvent('Submit Demo Booking', { utm_source: 'google' })` is called
- **AND** `window.plausible` is a function
- **THEN** `window.plausible('Submit Demo Booking', { props: { utm_source: 'google' } })` is invoked

#### Scenario: Plausible blocked
- **WHEN** `trackEvent('Submit Contact Form')` is called
- **AND** `window.plausible` is not a function (ad blocker or network failure)
- **THEN** no error is thrown and no event is sent

### Requirement: Demo booking conversion tracking
When a demo booking form is submitted successfully, `core.js` SHALL fire a `Submit Demo Booking` event via `trackEvent()` with UTM parameters attached.

#### Scenario: Successful demo booking
- **WHEN** the demo booking form submission resolves with `{ success: true }`
- **THEN** `trackEvent('Submit Demo Booking', { <all UTM params> })` is called

#### Scenario: Failed demo booking
- **WHEN** the demo booking form submission fails or returns an error
- **THEN** no conversion event is fired

### Requirement: Contact form conversion tracking
When a contact form is submitted successfully, `core.js` SHALL fire a `Submit Contact Form` event via `trackEvent()` with UTM parameters attached.

#### Scenario: Successful contact form submission
- **WHEN** the contact form submission resolves with `{ success: true }`
- **THEN** `trackEvent('Submit Contact Form', { <all UTM params> })` is called

#### Scenario: Failed contact form submission
- **WHEN** the contact form submission fails or returns an error
- **THEN** no conversion event is fired

### Requirement: Newsletter sign-up tracking
When the newsletter sign-up form is submitted successfully, `core.js` SHALL fire a `Sign Up Newsletter` event via `trackEvent()` with UTM parameters attached.

#### Scenario: Successful newsletter subscription
- **WHEN** the newsletter form submission resolves with `{ success: true }`
- **THEN** `trackEvent('Sign Up Newsletter', { <all UTM params> })` is called

#### Scenario: Failed newsletter subscription
- **WHEN** the newsletter form submission fails
- **THEN** no conversion event is fired

### Requirement: Pricing CTA click tracking
When a user clicks a call-to-action button on the pricing page that leads to the demo booking page, `core.js` SHALL fire a `Click Pricing CTA` event.

#### Scenario: Pricing CTA clicked
- **WHEN** a `.pricing-cta` element (or equivalent selector) is clicked
- **THEN** `trackEvent('Click Pricing CTA')` is called

### Requirement: Event naming convention
All custom events SHALL use Plausible's `Verb + Object` naming convention. Event names SHALL be:
- `Submit Demo Booking`
- `Submit Contact Form`
- `Sign Up Newsletter`
- `Click Pricing CTA`

#### Scenario: Consistent event names
- **WHEN** any custom event is fired
- **THEN** the event name matches the `Verb + Object` pattern
- **AND** is one of the four defined event names
