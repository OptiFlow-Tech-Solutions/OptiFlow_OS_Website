# /test
Run the complete test suite.

## Pipeline
1. Lint: stylelint, html-validate, eslint
2. Build: npm run build
3. E2E: npx playwright test
4. Validate: npm run validate

## Agent
Uses e2e-runner for Playwright tests, plankton-code-quality for linting.
