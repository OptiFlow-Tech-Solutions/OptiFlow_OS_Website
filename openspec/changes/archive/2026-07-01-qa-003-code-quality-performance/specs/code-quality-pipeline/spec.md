# Code Quality Pipeline

## Purpose

Automate code quality enforcement via GitHub Actions CI with linting, testing, and dependency auditing on every PR, ensuring consistent quality gates before merge.

## Requirements

### Requirement: GitHub Actions CI Workflow

The system SHALL include a GitHub Actions workflow at `.github/workflows/pr-checks.yml` that runs on every pull request to `main`.

#### Scenario: PR triggers CI pipeline

- **WHEN** a pull request is opened or updated against `main`
- **THEN** the CI workflow SHALL execute in order: `npm run build`, `npm run validate`, `npm run lint:all`, `npm test`, `npm audit --production`
- **AND** all steps SHALL complete within 10 minutes

#### Scenario: Failed step blocks merge

- **WHEN** any CI step fails
- **THEN** the workflow SHALL exit with a non-zero status
- **AND** the PR SHALL be marked as failing required checks

### Requirement: Dependency Vulnerability Scanning

The system SHALL scan dependencies for known vulnerabilities via `npm audit --production` as a CI step.

#### Scenario: Vulnerabilities detected

- **WHEN** `npm audit --production` finds a vulnerability with severity HIGH or CRITICAL
- **THEN** the audit step SHALL fail
- **AND** the vulnerability details SHALL be displayed in CI output

#### Scenario: No vulnerabilities

- **WHEN** `npm audit --production` finds only LOW or MODERATE severity or no vulnerabilities
- **THEN** the audit step SHALL pass

### Requirement: ESLint Scope Coverage

ESLint SHALL cover all JavaScript files including `functions/` Worker scripts.

#### Scenario: functions/ files are linted

- **WHEN** `npm run lint:js` is executed
- **THEN** all `.js` files in `functions/` SHALL be included in ESLint's scope
- **AND** any lint violations SHALL be reported

### Requirement: Pre-Commit Hook Automation

The system SHALL include a git pre-commit hook for automated quality checks before commit.

#### Scenario: Pre-commit check runs automatically

- **WHEN** `git commit` is executed
- **THEN** `npm run precommit` SHALL run automatically via husky
- **AND** the commit SHALL be blocked if precommit checks fail

### Requirement: Pipeline Configs for Orchestration

The system SHALL include `security.yaml` and `audit.yaml` pipeline configs for the orchestration engine.

#### Scenario: Security pipeline config exists

- **WHEN** the orchestration engine references `security.yaml`
- **THEN** a valid pipeline config SHALL exist at `orchestrate/pipeline-configs/security.yaml`
- **AND** it SHALL include GATE_SECURITY step

#### Scenario: Audit pipeline config exists

- **WHEN** the orchestration engine references `audit.yaml`
- **THEN** a valid pipeline config SHALL exist at `orchestrate/pipeline-configs/audit.yaml`
- **AND** it SHALL include a11y, SEO, and design compliance steps

### Requirement: Pre-Existing HTML Validation Fixes

The system SHALL resolve all pre-existing HTML validation errors in contact and product-overview pages.

#### Scenario: No html-validate errors in contact page

- **WHEN** `npx html-validate "dist/contact/index.html"` is executed
- **THEN** zero errors SHALL be reported

#### Scenario: No html-validate errors in product-overview page

- **WHEN** `npx html-validate "dist/product-overview/index.html"` is executed
- **THEN** zero errors SHALL be reported
