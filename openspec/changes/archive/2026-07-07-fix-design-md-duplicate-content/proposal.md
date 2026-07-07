## Why

`DESIGN.md/DESIGN.md` has two large sections (Voice & Tone, Imagery + Layout — ~281 lines) trapped inside markdown code fences, making them invisible as structured content. The frontmatter metadata is also duplicated in blockquotes, and the Brand Description heading level breaks the document hierarchy. This is the single source of truth for the OptiFlow design system — it must be a valid, renderable, well-structured markdown document.

## What Changes

- Remove the ` ```md ` code fences wrapping the Voice & Tone section (lines 111-251)
- Remove the ` ```md id="k8t4qy" ` code fences wrapping the Imagery and Layout sections (lines 253-392)
- Strip redundant metadata blockquotes on lines 14-20 (duplicate of YAML frontmatter)
- Fix heading level: `# Brand Description` → `## Brand Description` (single H1 per document)
- Remove the empty `DESIGN.md/system/` directory (no content, never used)

## Capabilities

### New Capabilities

- `design-md-structure`: The DESIGN.md file is properly structured as valid markdown with all sections at top-level heading hierarchy, no sections hidden inside code fences, and no duplicated frontmatter.

### Modified Capabilities

<!-- None — existing specs are unrelated to DESIGN.md -->

## Impact

- Affected file: `DESIGN.md/DESIGN.md` (392 lines → ~285 lines after cleanup)
- Affected directory: `DESIGN.md/system/` (removed — empty directory)
- No code, API, CSS, or build changes required
