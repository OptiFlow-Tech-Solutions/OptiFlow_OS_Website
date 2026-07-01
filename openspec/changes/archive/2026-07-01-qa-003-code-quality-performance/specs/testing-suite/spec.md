## MODIFIED Requirements

### Requirement: CI Integration

The test suite SHALL be integrated into the CI/CD pipeline and quality gates via a GitHub Actions workflow at `.github/workflows/pr-checks.yml`.

#### Scenario: PR validation includes tests

- **GIVEN** a pull request is opened against `main`
- **WHEN** the CI workflow triggers
- **THEN** `npm test` SHALL run as a required step
- **AND** the PR SHALL be blocked if any test fails

#### Scenario: GATE_TEST enforcement

- **GIVEN** the orchestration engine runs quality gates
- **WHEN** GATE_TEST is executed
- **THEN** the gate SHALL pass only when all E2E tests pass across all browser projects

#### Scenario: CI workflow exists

- **GIVEN** the project repository
- **WHEN** a CI pipeline is required
- **THEN** `.github/workflows/pr-checks.yml` SHALL exist
- **AND** it SHALL run on pull requests to `main`
