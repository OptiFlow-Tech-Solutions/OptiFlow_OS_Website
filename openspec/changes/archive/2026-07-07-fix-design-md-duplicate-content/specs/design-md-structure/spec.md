## ADDED Requirements

### Requirement: DESIGN.md has valid markdown structure
The DESIGN.md file SHALL have all sections at the top-level heading hierarchy with no content trapped inside code fences.

#### Scenario: Voice & Tone section is a top-level section
- **WHEN** a markdown parser reads DESIGN.md
- **THEN** "## Voice & Tone" renders as a section heading, not as code block content

#### Scenario: Imagery section is a top-level section
- **WHEN** a markdown parser reads DESIGN.md
- **THEN** "## Imagery" renders as a section heading, not as code block content

#### Scenario: Layout section is a top-level section
- **WHEN** a markdown parser reads DESIGN.md
- **THEN** "## Layout" renders as a section heading, not as code block content

### Requirement: DESIGN.md has a single H1 heading
The DESIGN.md file SHALL contain exactly one H1 heading (the document title).

#### Scenario: Brand Description is H2
- **WHEN** reading the heading hierarchy
- **THEN** "Brand Description" is a `##` (H2) heading, not `#` (H1)

### Requirement: Frontmatter metadata is not duplicated
The YAML frontmatter SHALL be the single source of truth for metadata; no duplicate blockquotes SHALL appear below the title.

#### Scenario: No metadata blockquotes after title
- **WHEN** reading the content between the H1 title and the Brand Description section
- **THEN** no `> Category:` or `> Surface:` blockquote lines exist

### Requirement: Orphaned empty directories are removed
The `DESIGN.md/system/` directory SHALL not exist if it contains no files.

#### Scenario: system/ directory removed
- **WHEN** listing `DESIGN.md/` subdirectories
- **THEN** `system/` is not present
