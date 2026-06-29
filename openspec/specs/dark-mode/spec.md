# Dark Mode

## Purpose

Define the dark mode theme system that provides a comfortable low-light browsing experience while maintaining brand identity and readability.

## Requirements

### Requirement: Theme Attribute

The system SHALL support light and dark themes via the `data-theme` attribute on the `<html>` element.

#### Scenario: Light theme (default)

- **GIVEN** a first-time visitor with no saved preference and a light system theme
- **WHEN** the page loads
- **THEN** `<html>` SHALL have `data-theme="light"` (or no explicit theme)
- **AND** the `:root` CSS custom properties SHALL apply

#### Scenario: Dark theme activation

- **GIVEN** `<html data-theme="dark">`
- **WHEN** the page renders
- **THEN** all `[data-theme="dark"]` CSS overrides SHALL apply
- **AND** background SHALL switch to deep navy (`oklch(9% 0.02 250)`)
- **AND** text SHALL switch to near-white (`oklch(98% 0.002 240)`)
- **AND** accent colors SHALL brighten for visibility against dark backgrounds

### Requirement: Preference Persistence

The system SHALL persist theme preference to localStorage.

#### Scenario: Theme remembered

- **GIVEN** a user toggles to dark mode
- **WHEN** the user navigates to another page or returns later
- **THEN** the theme SHALL remain dark
- **AND** the preference SHALL be stored under `localStorage` key `optiflow-theme`

### Requirement: System Preference Detection

The system SHALL detect system preference on first visit via `prefers-color-scheme`.

#### Scenario: First visit with dark system preference

- **GIVEN** a first-time visitor with no `localStorage` entry
- **WHEN** the page loads and `window.matchMedia('(prefers-color-scheme: dark)')` matches
- **THEN** the theme SHALL be set to "dark"

#### Scenario: First visit with light system preference

- **GIVEN** a first-time visitor with no `localStorage` entry
- **WHEN** the page loads and the system preference is light
- **THEN** the theme SHALL remain at the default (light)

### Requirement: Smooth Transition

The system SHALL smoothly transition between themes with a CSS transition.

#### Scenario: Theme change animation

- **GIVEN** the user toggles between light and dark themes
- **WHEN** the `data-theme` attribute changes
- **THEN** the `body` SHALL transition `background` and `color` over 0.35s
- **AND** the navigation SHALL transition `background`, `border-color`, and `box-shadow` over 0.35s with a cubic-bezier easing

### Requirement: Theme Toggle in Navigation

The system SHALL provide a theme toggle button in the navigation bar.

#### Scenario: Nav toggle present

- **GIVEN** any page with the shared navigation
- **WHEN** the page renders
- **THEN** a `<button class="theme-toggle">` SHALL be present in the nav CTA area
- **AND** clicking it SHALL toggle the theme

### Requirement: Theme Toggle in Footer

The system SHALL provide a theme toggle button in the footer.

#### Scenario: Footer toggle present

- **GIVEN** any page with the shared footer
- **WHEN** the page renders
- **THEN** a `<button class="theme-toggle">` SHALL be present in the footer bottom bar
- **AND** it SHALL be styled to match the dark footer background

### Requirement: Component Dark Mode Rendering

The system SHALL ensure all shared components render correctly in dark mode.

#### Scenario: Cards in dark mode

- **GIVEN** the dark theme is active
- **WHEN** `.card` elements render
- **THEN** they SHALL use dark-mode shadow tokens with a subtle white edge highlight
- **AND** hover state SHALL add a teal glow

#### Scenario: Glass cards in dark mode

- **GIVEN** the dark theme is active
- **WHEN** `.glass-card` elements render
- **THEN** they SHALL use a semi-transparent white background (`rgba(255,255,255,.06)`)
- **AND** border SHALL be semi-transparent (`rgba(255,255,255,.08)`)

#### Scenario: Navigation in dark mode

- **GIVEN** the dark theme is active
- **WHEN** the navigation scrolls
- **THEN** `.topnav.scrolled` SHALL use a dark glass background (`rgba(15,23,42,.85)`)
- **AND** dropdown menus SHALL use a dark background (`rgba(15,23,42,.94)`)

#### Scenario: FAQ in dark mode

- **GIVEN** the dark theme is active
- **WHEN** FAQ items render
- **THEN** question hover color SHALL remain teal
- **AND** open state icon color SHALL be teal

### Requirement: Page-Specific Dark Mode Overrides

The system SHALL ensure all page-specific styles override correctly in dark mode.

#### Scenario: Page style dark mode

- **GIVEN** a page has custom `<style>` block rules using `[data-theme="dark"]` selectors
- **WHEN** the dark theme is active
- **THEN** those page-specific overrides SHALL apply correctly
- **AND** validation SHALL warn if a page has no dark mode styles
