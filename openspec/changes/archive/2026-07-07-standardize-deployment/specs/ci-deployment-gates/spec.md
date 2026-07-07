## ADDED Requirements

### Requirement: Docker image is built and verified in CI
The CI pipeline SHALL include a job that builds the Docker image and verifies it starts and passes healthcheck. This job SHALL run on every push to main and every pull request.

#### Scenario: Docker build succeeds in CI
- **WHEN** a push or PR triggers CI
- **THEN** the `docker build` command completes with exit code 0

#### Scenario: Container healthcheck passes in CI
- **WHEN** the built image is started as a container
- **THEN** `curl -sf http://localhost/health` returns HTTP 200 within the healthcheck start period

### Requirement: Route smoke test in CI
The CI Docker verification job SHALL test key routes (at minimum: `/`, `/pricing/`, `/contact/`, `/robots.txt`, `/assets/css/core.css`) and verify they return HTTP 200.

#### Scenario: Homepage returns 200
- **WHEN** the Docker CI job curls `http://localhost:80/`
- **THEN** HTTP status is 200

#### Scenario: Subdirectory page returns 200
- **WHEN** the Docker CI job curls `http://localhost:80/pricing/`
- **THEN** HTTP status is 200

#### Scenario: Static asset returns 200
- **WHEN** the Docker CI job curls `http://localhost:80/assets/css/core.css`
- **THEN** HTTP status is 200

#### Scenario: SEO artifact returns 200
- **WHEN** the Docker CI job curls `http://localhost:80/robots.txt`
- **THEN** HTTP status is 200

### Requirement: CI fails on Docker build failure
If the Docker image fails to build, the CI SHALL report the job as failed and SHALL NOT proceed to subsequent deployment jobs.

#### Scenario: Docker build failure blocks pipeline
- **WHEN** `docker build` exits with non-zero code
- **THEN** the CI job status is `failure` and dependent jobs do not run

### Requirement: Docker build uses layer caching in CI
The CI Docker job SHALL use GitHub Actions cache or Docker layer caching to avoid rebuilding unchanged layers on every run.

#### Scenario: Cached layers used on subsequent builds
- **WHEN** CI runs a second time without Dockerfile changes
- **THEN** the build completes in less time than the first run
