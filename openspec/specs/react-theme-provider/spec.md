# react-theme-provider

## Purpose

React context provider (`ThemeProvider`) and `useTheme` hook managing dark/light theme state via `data-theme` attribute on `<html>`, with localStorage persistence and system preference detection.

## Requirements

### Requirement: ThemeProvider wraps the application
The system SHALL provide a `ThemeProvider` React component that wraps the application and manages the theme state via React context.

#### Scenario: ThemeProvider renders children
- **WHEN** `<ThemeProvider><App /></ThemeProvider>` is rendered
- **THEN** child components render normally and can access theme context

#### Scenario: ThemeProvider sets initial data-theme from localStorage
- **WHEN** `localStorage` contains `theme: "dark"` and `ThemeProvider` mounts
- **THEN** `data-theme="dark"` is set on `document.documentElement`

#### Scenario: ThemeProvider falls back to system preference
- **WHEN** no `localStorage` theme key exists and `prefers-color-scheme: dark` matches
- **THEN** `data-theme="dark"` is set on `document.documentElement`

#### Scenario: ThemeProvider defaults to light when no preference
- **WHEN** no `localStorage` theme key exists and `prefers-color-scheme: light` matches
- **THEN** `data-theme` is not set on `document.documentElement` (light mode default)

### Requirement: useTheme hook provides theme state and toggle
The system SHALL provide a `useTheme()` hook that returns the current theme string (`"light"` | `"dark"`) and a `toggleTheme()` function.

#### Scenario: useTheme returns current theme
- **WHEN** a component calls `useTheme()` while dark mode is active
- **THEN** `{ theme: "dark", toggleTheme }` is returned

#### Scenario: toggleTheme switches theme
- **WHEN** `toggleTheme()` is called while theme is `"light"`
- **THEN** `data-theme="dark"` is set on `<html>`, `localStorage.theme` is set to `"dark"`, and consuming components re-render with `theme: "dark"`

#### Scenario: toggleTheme switches back to light
- **WHEN** `toggleTheme()` is called while theme is `"dark"`
- **THEN** `data-theme` attribute is removed from `<html>`, `localStorage.theme` is set to `"light"`, and consuming components re-render with `theme: "light"`

#### Scenario: Theme persists across page reloads
- **WHEN** user sets dark mode, reloads the page
- **THEN** dark mode is still active (read from `localStorage`)

### Requirement: Theme toggle is accessible
The theme toggle button rendered by any consumer of `useTheme` SHALL meet WCAG 2.2 Level AA accessibility standards.

#### Scenario: Toggle has accessible label
- **WHEN** a theme toggle button is rendered using `useTheme`
- **THEN** it has an `aria-label` attribute describing its action (e.g., "Switch to dark mode")

#### Scenario: Toggle is keyboard accessible
- **WHEN** user presses Enter or Space on a focused theme toggle button
- **THEN** the theme toggles

#### Scenario: Toggle announces theme change
- **WHEN** theme is toggled
- **THEN** an `aria-live="polite"` region announces the new theme state
