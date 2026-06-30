# Build Pipeline (Delta)

## MODIFIED Requirements

### Requirement: CI/CD Pipeline

The system SHALL include a GitHub Actions CI workflow that runs on pull requests and pushes to main.

#### Scenario: PR validation

- **GIVEN** a pull request is opened against `main`
- **WHEN** the CI workflow triggers
- **THEN** the build SHALL run via `npm run build`
- **AND** validation SHALL run via `npm run validate`
- **AND** lint checks SHALL run via `npm run lint:all`
- **AND** all steps SHALL complete within 5 minutes

#### Scenario: Deploy scripts

- **GIVEN** the project is configured for deployment
- **WHEN** `npm run deploy:netlify` is executed
- **THEN** the site SHALL be deployed to Netlify via netlify-cli
- **WHEN** `npm run deploy:cloudflare` is executed
- **THEN** the site SHALL be deployed to Cloudflare Pages via wrangler

## MODIFIED Requirements

### Requirement: Pipeline Configuration

The system SHALL have a deploy step in the build pipeline config that invokes the actual deploy script.

#### Scenario: Pipeline deploy step

- **GIVEN** the build pipeline config at `orchestrate/pipeline-config/build.yaml`
- **WHEN** the deploy step is executed
- **THEN** it SHALL run `npm run deploy` to execute the full deploy script
- **AND** it SHALL NOT be a placeholder echo command
