## Context

`DESIGN.md/DESIGN.md` (392 lines) is the single source of truth for the OptiFlow OS design system. Two large sections are trapped inside markdown code fences, rendering them as plain code rather than structured content. The YAML frontmatter metadata is duplicated in blockquotes below the title. The Brand Description heading uses `#` (H1) instead of `##` (H2), violating single-H1 convention.

## Goals / Non-Goals

**Goals:**
- Remove code fences so Voice & Tone, Imagery, and Layout render as proper markdown sections
- Strip redundant metadata blockquotes (duplicate of YAML frontmatter)
- Fix Brand Description heading level from H1 to H2
- Remove the empty `DESIGN.md/system/` directory

**Non-Goals:**
- No changes to DESIGN.md content (wording, colors, typography values)
- No changes to `ASSETS/`, `core.css`, `site.json`, or any build scripts
- No lint or validation rule changes

## Decisions

1. **Content-preserving fix only** — All text remains identical; only the structural markup around it changes. No editorial decisions.

2. **Remove code fences, keep section hierarchy** — The ` ```md ` fences on lines 111 and 251 are removed. The ` ```md id="k8t4qy" ` fences on lines 253 and 392 are removed. All `##` headings inside become top-level sections.

3. **Strip only the metadata blockquotes** — Lines 14-20 repeat `Category`, `Surface`, and `Purpose` already present in the YAML frontmatter. These blockquotes are deleted. The frontmatter is the canonical source.

4. **H1→H2 for Brand Description** — Single H1 per document (line 14 title). Brand Description drops to H2.

5. **Delete empty system/ directory** — `DESIGN.md/system/` has no files. It is orphaned and removed.

## Risks / Trade-offs

- **Low risk**: This is a pure structural fix. No content changes, no code paths affected.
- **No build impact**: The build process (`npm run build`) does not parse DESIGN.md — it only uses `site.json` and source templates.
