## Context

The OptiFlow OS website uses a centralized contact info system: `site.json` is the single source of truth for phone, email, WhatsApp, and location. The build script (`scripts/assemble.mjs`) substitutes `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`, and `{{LOCATION}}` placeholders in all source files. However, there is no automated enforcement preventing someone from typing a raw email or phone number into a source file, which would bypass the centralization and create inconsistency if contact details change.

The existing `scripts/validate.mjs` already has a "Data Consistency" section that checks dist output for a specific wrong phone number and old location. This change extends that pattern upstream — checking source files BEFORE assembly.

## Goals / Non-Goals

**Goals:**
- Add a validation rule that scans `src/pages/*.html` and `src/partials/*.html` for hardcoded contact patterns
- Fail `npm run validate` (exit code 1) when hardcoded values are found
- Provide clear error messages showing which file and line has the hardcoded value

**Non-Goals:**
- No changes to any source HTML files (they are already clean)
- No changes to `scripts/assemble.mjs` or `site.json`
- No new dependencies or scripts — extend existing `validate.mjs`
- No CI/CD or git hook changes (those already call `npm run validate`)

## Decisions

**1. Extend validate.mjs rather than create a new script**

Alternatives considered:
- Separate `check-hardcoded.mjs` script → rejected: adds maintenance surface, validate.mjs already does similar checks (hex colors, phone/location)
- Git hook only → rejected: doesn't surface in local dev workflow (build + validate)
- ESLint rule → rejected: over-engineered for a simple pattern scan

Rationale: `validate.mjs` already scans files for patterns. Adding a section for source-level contact info checks is the minimal change that works with existing `npm run validate`.

**2. Scan source files, not dist files**

The existing Data Consistency check (line 229-236) scans `dist/` for known-wrong values. The new check scans `src/` for any raw contact patterns. Source-level scanning catches problems before assembly, providing faster feedback. The existing dist check is kept as a safety net.

**3. Pattern matching approach**

Use regex to detect:
- `mailto:` with a raw email (not `{{EMAIL}}`) in `href` attributes
- Raw `@optiflow.co.in` domain strings in text content (not within `{{EMAIL}}`)
- `+91` phone numbers as text (not `{{PHONE}}`)
- Raw location string `Surat, India` (not `{{LOCATION}}`)

This is simpler and more maintainable than an AST-based approach.

## Risks / Trade-offs

- **False positive risk**: If a page legitimately needs to display a different email or phone (e.g., support@optiflow.co.in for a different contact type) → Mitigation: validate error messages are human-readable and point to the exact file+line; the developer can add an exception if needed
- **Pattern too narrow**: New contact patterns could be missed → Mitigation: the existing dist-level check catches any that slip through
- **ES module imports**: validate.mjs is already ESM (`import fs from 'node:fs'`), the new code matches the existing style
