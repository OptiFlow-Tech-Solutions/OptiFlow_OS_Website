## MODIFIED Requirements

### Requirement: Error page CSS uses shared core.css classes
The 404 error page SHALL use shared error page CSS classes (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact`) from `assets/css/core.css` instead of duplicating them in its inline `<style>` block. Only page-specific styles (`.error-suggestions`) SHALL remain inline.

#### Scenario: 404 loads shared CSS from core.css
- **WHEN** a user navigates to `/404/`
- **THEN** shared error page styles render from core.css
- **THEN** only `.error-suggestions` styles remain in the page's `<style>` block

#### Scenario: No visual regression
- **WHEN** the 404 page renders after CSS migration
- **THEN** the page appears visually identical to before the change
