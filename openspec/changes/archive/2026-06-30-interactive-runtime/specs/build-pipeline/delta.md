# Build Pipeline — Delta Spec

## REMOVED: motion.mjs Asset

The build pipeline SHALL NOT include `motion.mjs` in `dist/assets/js/`. No page references this file; removing it from source automatically removes it from builds.

#### Scenario: Build output excludes motion.mjs

- **GIVEN** `motion.mjs` has been deleted from `assets/js/`
- **WHEN** `npm run build` is executed
- **THEN** `dist/assets/js/motion.mjs` SHALL NOT exist
- **AND** no build errors or warnings SHALL be emitted
