## ADDED Requirements

### Requirement: Dependency Vulnerability Monitoring

The platform SHALL include `npm audit` scanning as part of the CI pipeline to detect known vulnerabilities in Node.js dependencies.

#### Scenario: Audit runs in CI

- **WHEN** the CI pipeline runs on a pull request
- **THEN** `npm audit --production` SHALL execute after test steps
- **AND** HIGH or CRITICAL vulnerabilities SHALL cause the step to fail

#### Scenario: Audit report is visible

- **WHEN** `npm audit --production` completes
- **THEN** a summary of vulnerabilities found SHALL be displayed in CI logs
