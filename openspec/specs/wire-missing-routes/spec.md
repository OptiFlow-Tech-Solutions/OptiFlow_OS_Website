# wire-missing-routes

## Purpose

Ensure all React page components have corresponding routes in App.jsx and proper barrel exports. The CompetitivePositioning and ServerError pages existed as source files but were unreachable — they had no route entries and ServerError wasn't even exported from the pages barrel.

## Requirements

### Requirement: CompetitivePositioning page has a route
The CompetitivePositioning page SHALL be accessible at `/os/competitive-positioning` via a React Router route in App.jsx.

#### Scenario: Direct navigation to competitive positioning
- **WHEN** user navigates to `/os/competitive-positioning`
- **THEN** the CompetitivePositioning page renders with hero, competitive quadrant, feature matrix, cost comparison, and CTA sections

#### Scenario: Nginx redirect reaches the page
- **WHEN** user navigates to `/competitive-positioning` (old path)
- **THEN** nginx issues a 301 redirect to `/os/competitive-positioning/` and the React page renders

### Requirement: ServerError page has a route
The ServerError page SHALL be accessible at `/os/server-error` via a React Router route in App.jsx.

#### Scenario: Direct navigation to server error page
- **WHEN** user navigates to `/os/server-error`
- **THEN** the ServerError page renders with error code, lead text, suggested links, and contact info

### Requirement: ServerError is exported from pages barrel
The ServerError component SHALL be exported from `frontend/src/pages/index.js` so it can be imported via the barrel.

#### Scenario: Barrel import works
- **WHEN** importing `{ ServerError }` from `'../pages'`
- **THEN** the ServerError component is resolved successfully

### Requirement: App.jsx has route entries for both pages
App.jsx SHALL contain `<Route>` entries for both `competitive-positioning` and `server-error` paths with lazy-loaded components.

#### Scenario: All routes are defined
- **WHEN** inspecting App.jsx route definitions
- **THEN** routes for `competitive-positioning` and `server-error` are present alongside the other 14 routes
