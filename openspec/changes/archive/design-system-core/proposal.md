## Why

The design system in `core.css` already defines most tokens, but gaps exist between the brand specification (DESIGN.md v5.0) and the CSS implementation. Several tokens from the spec have no corresponding CSS variable, and the existing `openspec/specs/design-system/spec.md` is incomplete — it lacks requirements for complete color palette coverage, transition tokens, and z-index scale.

## What Changes

- Add missing CSS custom properties for border hierarchy (soft/default/strong), disabled text, and glow tokens
- Add z-index scale tokens for consistent layering
- Add transition duration and easing tokens
- Update design-system spec with new requirements for missing token categories
- Ensure all 12 pages reference only `var(--*)` tokens (no hardcoded colors)
- Add noise texture opacity token already present but undocumented in spec

## Capabilities

### New Capabilities
_None — this is a refinement of the existing design-system capability._

### Modified Capabilities
- `design-system`: Add border hierarchy tokens, disabled text token, glow token, z-index scale tokens, and transition tokens. Formalize noise texture requirements.

## Impact

- `assets/css/core.css` — add 10-12 new CSS custom properties; no breaking changes
- `openspec/specs/design-system/spec.md` — add 4 new requirements (border tokens, z-index, transitions, noise)
- All 12 HTML pages — unaffected (backward compatible, new tokens are additive)
- `npm run validate` — hex color detection may flag fewer warnings as tokens increase
