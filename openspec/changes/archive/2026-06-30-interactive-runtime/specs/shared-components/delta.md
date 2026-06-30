# Shared Components — Delta Spec

## ADDED: Keyboard Drawer Control

The interactive runtime SHALL close the mobile drawer on Escape key press.

#### Scenario: Escape closes drawer

- **GIVEN** the mobile drawer is open
- **WHEN** the user presses the Escape key
- **THEN** the drawer SHALL close
- **AND** the hamburger button SHALL return to closed state
- **AND** the overlay SHALL disappear

## ADDED: Focus Trap in Mobile Drawer

The interactive runtime SHALL trap focus within the mobile drawer when open.

#### Scenario: Focus stays in drawer

- **GIVEN** the mobile drawer is open
- **WHEN** the user presses Tab on the last focusable element
- **THEN** focus SHALL move to the first focusable element in the drawer
- **AND** Shift+Tab on the first element SHALL move focus to the last

## MODIFIED: Unified FAQ Accordion

The FAQ accordion SHALL use only the `.faq-question` class. The `.faq-q` class SHALL no longer be supported.

#### Scenario: FAQ toggle via .faq-question

- **GIVEN** any FAQ toggle button with class `.faq-question`
- **WHEN** the button is clicked
- **THEN** the parent `.faq-item` SHALL toggle `.open`
- **AND** `aria-expanded` SHALL update to reflect state
- **AND** this SHALL work on demo-booking and pricing pages identically

## ADDED: Unified Counter System

All animated counters SHALL use `data-count` attribute. `data-target` SHALL no longer be supported by page scripts.

#### Scenario: Counter via data-count

- **GIVEN** an element with `data-count="1500"`
- **WHEN** the element enters the viewport
- **THEN** an easeOutExpo animation SHALL count from 0 to 1500
- **AND** `data-prefix`, `data-suffix`, `data-fmt`, `data-duration` attributes SHALL be respected

## REMOVED: motion.mjs Module

The `assets/js/motion.mjs` module SHALL be removed. Zero pages import it. No feature depends on it.

#### Scenario: motion.mjs does not exist

- **GIVEN** the assets directory
- **WHEN** inspected
- **THEN** `motion.mjs` SHALL NOT exist
