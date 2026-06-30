# Build Pipeline — Delta Spec

## MODIFIED: Active State Resolution for Mobile Drawer

The build pipeline SHALL resolve `{{ACTIVE_PAGE}}` expressions in the mobile drawer portion of the nav partial.

### Scenario: Mobile drawer active resolution

- **GIVEN** a page with `active: "Pricing"` in site.json
- **WHEN** the page is assembled
- **THEN** the Pricing link in the mobile drawer SHALL receive `class="active"`

## MODIFIED: Footer Placeholder Resolution

The build pipeline SHALL replace `{{PHONE}}`, `{{EMAIL}}`, and `{{YEAR}}` in the footer partial with values from `site.json`. This is already handled by the generic placeholder replacement loop; no code change required — this delta confirms the behavior is specified.

### Scenario: Footer placeholder injection

- **GIVEN** the footer partial contains `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`
- **WHEN** `npm run build` is executed
- **THEN** these SHALL be replaced with values from `site.json`
- **AND** no `{{PLACEHOLDER}}` strings SHALL remain in the output
