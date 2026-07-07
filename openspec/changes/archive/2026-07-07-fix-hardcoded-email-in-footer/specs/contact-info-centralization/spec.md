## ADDED Requirements

### Requirement: Source files must not contain hardcoded contact information

The system SHALL enforce that all contact information in source HTML files (`src/pages/*.html`, `src/partials/*.html`) uses the `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`, or `{{LOCATION}}` placeholder syntax. Raw contact values SHALL NOT appear in source files.

#### Scenario: Hardcoded email in source file fails validation

- **WHEN** a source file under `src/pages/` or `src/partials/` contains `info@optiflow.co.in` or `@optiflow.co.in` as literal text (not within a `{{EMAIL}}` placeholder)
- **THEN** `npm run validate` reports an error identifying the file and the offending text
- **AND** the validation exits with a non-zero exit code

#### Scenario: Hardcoded phone number in source file fails validation

- **WHEN** a source file under `src/pages/` or `src/partials/` contains a `+91` prefixed phone number as literal text (not within a `{{PHONE}}` or `{{PHONE_TEL}}` placeholder)
- **THEN** `npm run validate` reports an error identifying the file and the offending text
- **AND** the validation exits with a non-zero exit code

#### Scenario: Hardcoded location in source file fails validation

- **WHEN** a source file under `src/pages/` or `src/partials/` contains `Surat, India` as literal text (not within a `{{LOCATION}}` placeholder)
- **THEN** `npm run validate` reports an error identifying the file and the offending text
- **AND** the validation exits with a non-zero exit code

#### Scenario: Placeholder usage passes validation

- **WHEN** a source file uses `{{EMAIL}}`, `{{PHONE}}`, `{{PHONE_TEL}}`, and `{{LOCATION}}` exclusively (no raw values)
- **THEN** `npm run validate` passes without contact-related errors

#### Scenario: Clean source baseline

- **WHEN** `npm run validate` runs against the current codebase (which already uses placeholders correctly)
- **THEN** zero contact-info-hardcoding errors are reported
