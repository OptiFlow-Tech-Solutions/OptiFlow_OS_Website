## ADDED Requirements

### Requirement: Post-Merge Hook

The system SHALL include a post-merge hook that runs after `git merge` or `git pull` to detect dependency drift and warn of rebuild-requiring changes.

#### Scenario: Package lockfile change triggers install

- **WHEN** a merge changes `package-lock.json`
- **THEN** `npm install` SHALL run automatically via the post-merge hook

#### Scenario: Site data change warns about rebuild

- **WHEN** a merge changes `site.json` or `assets/css/core.css`
- **THEN** the hook SHALL warn the user to run `npm run build`

### Requirement: Pre-Push Hook

The system SHALL include a pre-push hook that runs lint and validate checks before allowing a `git push`.

#### Scenario: Push blocked on lint failure

- **WHEN** `git push` is executed and linting returns errors
- **THEN** the push SHALL be blocked with exit code 1

#### Scenario: Push blocked on validate failure

- **WHEN** `git push` is executed and validation returns errors
- **THEN** the push SHALL be blocked with exit code 1

#### Scenario: Clean push proceeds

- **WHEN** `git push` is executed and both lint and validate pass
- **THEN** the push SHALL proceed with exit code 0
