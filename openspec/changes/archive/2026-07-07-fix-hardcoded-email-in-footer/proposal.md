## Why

Investigation of all source files (`src/pages/`, `src/partials/`) confirmed zero hardcoded contact information. All email, phone, and location references use `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`, and `{{LOCATION}}` placeholders that the `scripts/assemble.mjs` build system substitutes from `site.json` — the single source of truth. However, there is no automated protection against someone introducing hardcoded values in the future, which would break the centralized pattern and create inconsistency when contact details change (phone number update, domain migration, etc.).

## What Changes

- Add a validation rule to `scripts/validate.mjs` that scans source files for hardcoded contact information patterns (email, phone, WhatsApp number, location) and fails the build if any are found
- Document the centralized contact info pattern in AGENTS.md (already partially covered)
- Confirm all 6 contact occurrence locations in source are properly using placeholders:
  - `src/partials/footer.html:12` — `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`, `{{LOCATION}}`
  - `src/pages/contact.html:399,472` — `{{EMAIL}}`
  - `src/pages/terms.html:490,495` — `{{EMAIL}}`
  - `src/pages/privacy-policy.html:436,441` — `{{EMAIL}}`
  - `src/pages/500.html:51` — `{{EMAIL}}`

## Capabilities

### New Capabilities
- `contact-info-centralization`: Enforces that all contact information (email, phone, WhatsApp, location) in source files MUST use `{{PLACEHOLDER}}` syntax to prevent hardcoding regressions

### Modified Capabilities
<!-- None — no existing requirement changes. The system is already correctly centralized. -->

## Impact

- `scripts/validate.mjs` — new validation rule
- `site.json` — continues as single source of truth (no changes needed)
- All 17 source pages — confirmed clean, no changes needed
- `src/partials/footer.html` — confirmed clean, no changes needed
