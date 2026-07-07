## Why

Source HTML files contain UTF-8 mojibake artifacts from double-encoding (UTF-8 bytes misinterpreted as Windows-1252 then re-encoded as UTF-8). This causes corrupted characters to appear in the built website: CSS section separator comments render as garbage (`â"€` instead of `—`), middle dots display as `Â·` instead of `·`, and arrow characters are mangled. These visual defects appear on every page with inline `<style>` blocks — which is all 14 pages.

## What Changes

- Replace corrupted em dash/box-drawing sequences (`â"€`) in all CSS and HTML comments across `src/pages/*.html` with proper `&mdash;` HTML entities
- Replace corrupted middle dot sequences (`Â·`) in `home.html` and `pricing.html` with `&middot;` HTML entities
- Replace corrupted arrow sequences (`â†'`, `â†"`, `â†'`) where found in `home.html` and `problem-solutions.html` with proper Unicode arrow entities (`→`, `↓`, `↑`)
- Add middle dot and arrow corruption patterns to the existing `html-encoding-fix` spec
- Verify zero corrupted sequences remain via grep validation
- Rebuild and validate the site

## Capabilities

### New Capabilities
<!-- None — fix-only change, no new capabilities -->

### Modified Capabilities
- `html-encoding-fix`: Add middle dot (`Â·` → `&middot;`) and arrow character (`â†'` → `→`, etc.) corruption patterns to the requirements. Update the corrupted em dash pattern from `â€"`/`â€"` to `â"€` based on actual byte forensics.

## Impact

- **Files**: `src/pages/*.html` (~14 pages) — CSS comment block separators in every page with inline `<style>` blocks
- **Files**: `src/pages/home.html` — 8 middle dot corruptions + dashboard KPI arrow corruptions
- **Files**: `src/pages/pricing.html` — 8 middle dot corruptions
- **Files**: `src/pages/problem-solutions.html` — arrow corruptions in solution flow
- **Specs**: `openspec/specs/html-encoding-fix/spec.md` — delta update for additional patterns
- **Risk**: Low — find-and-replace on known byte sequences within HTML files. Only the two corrupted byte patterns change; all existing `&mdash;`, `&#8377;`, and `&times;` entities are left untouched.
- **Validation**: `npm run build && npm run validate` must pass with zero errors
