# html-encoding-fix — Delta Spec

## MODIFIED Requirements

### Requirement: All em dashes render correctly

The system SHALL render em dashes as the proper typographic character by replacing every broken UTF-8 sequence (`â"€`, appearing as `C3 A2 E2 80 9D E2 82 AC` in raw bytes, resulting from `—` U+2014 after UTF-8→Windows-1252→UTF-8 double-encoding) with the HTML entity `&mdash;`. This pattern appears in CSS section comment separators and HTML comments across all `src/pages/*.html` files.

#### Scenario: Em dash in CSS comments

- **WHEN** a CSS comment contains `â"€` as a section separator (e.g., `/* â"€â"€â"€ Hero â"€â"€â"€ */`)
- **THEN** each occurrence of `â"€` is replaced with `&mdash;`, producing `/* &mdash;&mdash;&mdash; Hero &mdash;&mdash;&mdash; */`

#### Scenario: Em dash in HTML comments

- **WHEN** an HTML comment contains `â"€` (e.g., `<!-- â"€â"€ Hero â"€â"€ -->`)
- **THEN** each occurrence of `â"€` is replaced with `&mdash;`, producing `<!-- &mdash;&mdash; Hero &mdash;&mdash; -->`

#### Scenario: Em dash survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&mdash;` entities in source appear as proper em dashes in the assembled `dist/` output

## ADDED Requirements

### Requirement: All middle dots render correctly

The system SHALL render middle dots as the HTML entity `&middot;` by replacing every broken UTF-8 sequence (`Â·`, resulting from `·` U+00B7 after UTF-8→Windows-1252→UTF-8 double-encoding) in `home.html` and `pricing.html` with the HTML entity `&middot;`.

#### Scenario: Middle dot in problem impact labels

- **WHEN** `home.html` contains `Lost Revenue Â· Delayed Deliveries`
- **THEN** the sequence `Â·` is replaced with `&middot;`, producing `Lost Revenue &middot; Delayed Deliveries`

#### Scenario: Middle dot in pricing tooltips

- **WHEN** `pricing.html` contains `&nbsp;Â·&nbsp;` as a visual separator
- **THEN** the sequence `Â·` is replaced with `&middot;`, producing `&nbsp;&middot;&nbsp;`

#### Scenario: Middle dot survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&middot;` entities in source appear as proper middle dots in the assembled `dist/` output

### Requirement: All arrow characters render correctly

The system SHALL render arrow characters by replacing every broken UTF-8 sequence resulting from Unicode arrows (`→` U+2192, `↓` U+2193, `↑` U+2191) after double-encoding with the equivalent HTML entities (`&rarr;`, `&darr;`, `&uarr;`).

#### Scenario: Right arrow in solution flow

- **WHEN** a page contains `â†'` (corrupted `→`) in text content
- **THEN** the sequence is replaced with `&rarr;`

#### Scenario: Down arrow in solution flow

- **WHEN** a page contains `â†"` (corrupted `↓`) in text content
- **THEN** the sequence is replaced with `&darr;`

#### Scenario: Up arrow in KPI metrics

- **WHEN** a page contains `â†'` (corrupted `↑`) in text content
- **THEN** the sequence is replaced with `&uarr;`

#### Scenario: Arrows survive build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all arrow HTML entities (`&rarr;`, `&darr;`, `&uarr;`) in source appear as proper Unicode arrow symbols in the assembled `dist/` output

### Requirement: Zero broken sequences remain after fix

The system SHALL contain zero instances of the broken UTF-8 sequences `â"€`, `Â·`, `â†'`, `â†"`, or `â†'` in any file under `src/pages/`.

#### Scenario: Post-fix validation

- **WHEN** grep is run for `â` across all `src/pages/**/*.html` files
- **THEN** zero matches are returned
