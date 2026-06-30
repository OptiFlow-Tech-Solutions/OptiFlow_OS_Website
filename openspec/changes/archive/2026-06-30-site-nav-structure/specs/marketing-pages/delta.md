# Marketing Pages — Delta Spec

## MODIFIED: Source File Naming

The newsletter page source file SHALL be named `newsletter.html` instead of `blog.html`.

### Scenario: Newsletter source file

- **GIVEN** the `src/pages/` directory
- **WHEN** inspected
- **THEN** `newsletter.html` SHALL exist
- **AND** `blog.html` SHALL NOT exist

### Scenario: Build mapping

- **GIVEN** the SRC_MAP in `assemble.mjs`
- **WHEN** the newsletter entry is inspected
- **THEN** it SHALL map `newsletter/index.html` → `newsletter.html`
