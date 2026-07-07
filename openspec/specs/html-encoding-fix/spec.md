# HTML Encoding Fix

## Purpose

Ensure all source HTML files render correctly by replacing broken UTF-8 encoding artifacts (mojibake from UTF-8 bytes misinterpreted as Windows-1252) with proper HTML entities. This spec defines the requirements for character encoding correctness across the OptiFlow OS website.

## Requirements

### Requirement: All em dashes render correctly

The system SHALL render em dashes as the proper typographic character `—` in all HTML pages by replacing every broken UTF-8 sequence (`â€"` and `â€"`) with the HTML entity `&mdash;`.

#### Scenario: Em dash in body text

- **WHEN** a page contains `â€"` or `â€"` in any HTML text content
- **THEN** those sequences are replaced with `&mdash;`

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

### Requirement: Zero broken sequences remain after fix

The system SHALL contain zero instances of the broken UTF-8 sequences `â€"`, `â€"`, `â‚¹`, or `Ã—` in any file under `src/`.

#### Scenario: Post-fix validation

- **WHEN** grep is run for `â€|â‚¹|Ã—` across all `src/**/*.html` files
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
