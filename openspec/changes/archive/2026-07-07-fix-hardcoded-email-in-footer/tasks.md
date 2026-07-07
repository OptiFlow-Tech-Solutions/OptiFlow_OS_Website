## 1. Verification

- [x] 1.1 Confirm all source files are clean: grep `src/pages/` and `src/partials/` for hardcoded `info@optiflow.co.in`, `+91`, and `Surat, India` — expect zero results
- [x] 1.2 Verify existing `npm run validate` passes against current clean state

## 2. Add hardcoded contact check

- [x] 2.1 Add source-scanning logic to `scripts/validate.mjs` that checks `src/pages/**/*.html` and `src/partials/*.html` for:
  - Raw email patterns (`info@optiflow.co.in` or `@optiflow.co.in` not inside `{{EMAIL}}`)
  - Raw phone patterns (`+91` phone numbers not inside `{{PHONE}}`)
  - Raw location (`Surat, India` not inside `{{LOCATION}}`)
- [x] 2.2 Each violation reports as an `error`-level `log()` with file and line context
- [x] 2.3 Place the check after existing Data Consistency section (before the final error/warning summary)

## 3. Validate

- [x] 3.1 Run `npm run build && npm run validate` — expect zero new errors, zero contact-related errors
- [x] 3.2 Temporarily hardcode `info@optiflow.co.in` in a source file, run `npm run validate`, confirm it fails with a clear error message, then revert
