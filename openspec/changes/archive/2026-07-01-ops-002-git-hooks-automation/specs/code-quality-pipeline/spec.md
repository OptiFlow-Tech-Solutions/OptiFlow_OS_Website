## MODIFIED Requirements

### Requirement: Pre-Commit Hook Automation

The system SHALL include a git pre-commit hook for automated quality checks before commit. The pre-commit hook SHALL validate:
1. No debug statements in source files
2. No hardcoded secrets
3. Contact data consistency (phone placeholders, location correctness)
4. No merge conflict markers
5. Commit message follows Conventional Commits format (`feat|fix|refactor|docs|test|chore|perf|ci|style`)
6. Branch name matches allowed patterns (`main|staging|develop|feature/*|fix/*|chore/*|docs/*`)

#### Scenario: Pre-commit check runs automatically

- **WHEN** `git commit` is executed
- **THEN** `npm run precommit` SHALL run automatically via husky
- **AND** the commit SHALL be blocked if precommit checks fail

#### Scenario: Commit message format validated

- **WHEN** `git commit -m "updated stuff"` is executed
- **THEN** the pre-commit hook SHALL fail with a message listing allowed commit types

#### Scenario: Branch name validated

- **WHEN** a commit is made on an unlisted branch name
- **THEN** the pre-commit hook SHALL fail with a message listing allowed branch patterns

#### Scenario: Amend commits skip message check

- **WHEN** `git commit --amend` is executed
- **THEN** the commit message format check SHALL be skipped
- **AND** all other checks SHALL still run
