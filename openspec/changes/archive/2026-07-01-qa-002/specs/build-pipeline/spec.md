# Build Pipeline — Delta: Testing Suite Integration

## MODIFIED Requirements

### Requirement: CI/CD Pipeline

The system SHALL include a GitHub Actions CI workflow that runs on pull requests and pushes to main.

#### Scenario: PR validation

- **GIVEN** a pull request is opened against `main`
- **WHEN** the CI workflow triggers
- **THEN** the build SHALL run via `npm run build`
- **AND** validation SHALL run via `npm run validate`
- **AND** lint checks SHALL run via `npm run lint:all`
- **AND** E2E tests SHALL run via `npm test`
- **AND** all steps SHALL complete within 10 minutes

### Requirement: Validation Exit Code

The system SHALL exit with a non-zero code when validation errors are present.

#### Scenario: Test failures cause CI failure

- **GIVEN** one or more E2E tests fail
- **WHEN** `npm test` completes
- **THEN** the process SHALL exit with code 1

## ADDED Requirements

### Requirement: Test Command

The system SHALL include an `npm test` script that runs the full Playwright E2E test suite.

#### Scenario: Test command execution

- **GIVEN** the project has test files in `tests/e2e/`
- **WHEN** `npm test` is executed
- **THEN** Playwright SHALL run all test specs across configured browser projects
- **AND** the dev server SHALL be started automatically via `webServer` config
