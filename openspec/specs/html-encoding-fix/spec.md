# HTML Encoding Fix

## Purpose

Ensure all source HTML files render correctly by replacing broken UTF-8 encoding artifacts (mojibake from UTF-8 bytes misinterpreted as Windows-1252) with proper HTML entities. This spec defines the requirements for character encoding correctness across the OptiFlow OS website.

## Requirements

### Requirement: All em dashes render correctly

The system SHALL render em dashes as the proper typographic character by replacing every broken UTF-8 sequence (`â"€`, resulting from `—` U+2014 after UTF-8→Windows-1252→UTF-8 double-encoding) with the HTML entity `&mdash;`. This pattern appears in CSS section comment separators and HTML comments across all `src/pages/*.html` files.

#### Scenario: Em dash in CSS comments

- **WHEN** a CSS comment contains `â"€` as a section separator (e.g., `/* â"€â"€â"€ Hero â"€â"€â"€ */`)
- **THEN** each occurrence of `â"€` is replaced with `&mdash;`, producing `/* &mdash;&mdash;&mdash; Hero &mdash;&mdash;&mdash; */`

#### Scenario: Em dash in HTML comments

- **WHEN** an HTML comment contains `â"€` (e.g., `<!-- â"€â"€ Hero â"€â"€ -->`)
- **THEN** each occurrence of `â"€` is replaced with `&mdash;`, producing `<!-- &mdash;&mdash; Hero &mdash;&mdash; -->`

#### Scenario: Em dash survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&mdash;` entities in source appear as proper em dashes in the assembled `dist/` output

### Requirement: All rupee signs render correctly

The system SHALL render Indian rupee currency symbols as `₹` by replacing every broken UTF-8 sequence (`â‚¹`) with the HTML entity `&#8377;`.

#### Scenario: Rupee sign in pricing content

- **WHEN** a page contains `â‚¹` in pricing, cost, or financial text
- **THEN** those sequences are replaced with `&#8377;`

#### Scenario: Rupee sign survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&#8377;` entities in source appear as proper `₹` symbols in the assembled `dist/` output

### Requirement: All multiplication signs render correctly

The system SHALL render multiplication signs as `×` by replacing every broken UTF-8 sequence (`Ã—`) with the HTML entity `&times;`.

#### Scenario: Multiplication sign in content

- **WHEN** a page contains `Ã—` in text content
- **THEN** those sequences are replaced with `&times;`

#### Scenario: Multiplication sign survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&times;` entities in source appear as proper `×` symbols in the assembled `dist/` output

### Requirement: All middle dots render correctly

The system SHALL render middle dots as the HTML entity `&middot;` by replacing every broken UTF-8 sequence (`Â·`, resulting from `·` U+00B7 after UTF-8→Windows-1252→UTF-8 double-encoding) with the HTML entity `&middot;`.

#### Scenario: Middle dot in problem impact labels

- **WHEN** a page contains `Â·` as a visual separator in text content
- **THEN** the sequence `Â·` is replaced with `&middot;`

#### Scenario: Middle dot survives build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all `&middot;` entities in source appear as proper middle dots in the assembled `dist/` output

### Requirement: All arrow characters render correctly

The system SHALL render arrow characters by replacing every broken UTF-8 sequence resulting from Unicode arrows (`→` U+2192, `↓` U+2193, `↑` U+2191) after double-encoding with the equivalent HTML entities (`&rarr;`, `&darr;`, `&uarr;`).

#### Scenario: Right arrow replacement

- **WHEN** a page contains `â†'` (corrupted `→`) in text content
- **THEN** the sequence is replaced with `&rarr;`

#### Scenario: Down arrow replacement

- **WHEN** a page contains `â†"` (corrupted `↓`) in text content
- **THEN** the sequence is replaced with `&darr;`

#### Scenario: Up arrow replacement

- **WHEN** a page contains `â†'` (corrupted `↑`) in text content
- **THEN** the sequence is replaced with `&uarr;`

#### Scenario: Arrows survive build pipeline

- **WHEN** `npm run build` is executed
- **THEN** all arrow HTML entities (`&rarr;`, `&darr;`, `&uarr;`) in source appear as proper Unicode arrow symbols in the assembled `dist/` output

### Requirement: Zero broken sequences remain after fix

The system SHALL contain zero instances of the broken UTF-8 sequences `â"€`, `Â·`, `â†'`, `â†"`, `â†'`, `â‚¹`, or `Ã—` in any file under `src/pages/`.

#### Scenario: Post-fix validation

- **WHEN** grep is run for `â` across all `src/pages/**/*.html` files
- **THEN** zero matches are returned

### Requirement: Valid HTML after fix

The system SHALL pass `npm run validate` without new errors related to character encoding.

#### Scenario: Validation passes

- **WHEN** `npm run build && npm run validate` is executed after the fix
- **THEN** the validation script exits with zero and no encoding-related errors

### Requirement: Existing proper Unicode em dashes are preserved

The system SHALL NOT modify em dashes that are already correctly encoded as UTF-8 `—` (U+2014) characters, such as those used in HTML comments (`<!-- comment — continued -->`).

#### Scenario: Proper em dashes left untouched

- **WHEN** a page contains a correctly encoded UTF-8 em dash (`—` U+2014) in an HTML comment
- **THEN** those characters remain unchanged after the fix operation
