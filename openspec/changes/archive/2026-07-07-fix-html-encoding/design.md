## Context

The OptiFlow OS website source is 16 static HTML pages + 3 partials assembled by `scripts/assemble.mjs`. Several source files contain mojibake — broken character sequences caused by UTF-8 bytes being interpreted as Windows-1252 encoding. The affected characters are:

| Character | UTF-8 bytes | Broken as | Count (est.) |
|-----------|------------|-----------|-------------|
| `—` (U+2014 em dash) | `E2 80 94` | `â€"` / `â€"` | ~80+ matches across 8+ files |
| `₹` (U+20B9 rupee sign) | `E2 82 B9` | `â‚¹` | ~15 matches |
| `×` (U+00D7 multiply) | `C3 97` | `Ã—` | ~3 matches |

These render as garbled text in browsers, damaging the professional appearance of the site.

### Constraints
- No dependency changes — purely content fixes
- Must preserve existing HTML structure and attributes
- Fix must survive the build pipeline (`assemble.mjs` processes source → dist)
- File encoding must remain UTF-8 after fix

## Goals / Non-Goals

**Goals:**
- Replace all broken UTF-8 sequences in `src/pages/*.html` and `src/partials/*.html` with HTML entities
- Ensure `npm run build && npm run validate` passes after fix
- Zero broken sequences remaining across all source files

**Non-Goals:**
- Refactoring or restructuring HTML files
- Changing the build pipeline or CSS
- Fixing encoding in `dist/` directly (dist is regenerated from source)
- Converting legimate HTML comments or intentional character sequences

## Decisions

### Decision 1: Use HTML entities, not raw Unicode

**Chosen**: `&mdash;`, `&#8377;`, `&times;` (HTML entities)
**Alternative**: Raw Unicode characters (`—`, `₹`, `×`)

**Rationale**: HTML entities are encoding-agnostic — they survive any file encoding or build pipeline transformation. Raw Unicode, while cleaner, could be re-corrupted by a misconfigured editor or script. The build pipeline (`assemble.mjs`) does string replacement with `replaceAll` and writes UTF-8, so entities are the safer choice.

### Decision 2: Fix in source, not in build

**Chosen**: Fix the source files directly
**Alternative**: Add a pre-processing step in `assemble.mjs`

**Rationale**: The build script is the wrong place for this. Fixing at source means every edit after this starts clean. Adding a pre-processing regex in the build script would obscure the problem and add ongoing maintenance burden for what is fundamentally a data corruption fix.

### Decision 3: File-by-file fix, not scripted batch

**Chosen**: Manual replacement per file using targeted find-and-replace
**Alternative**: Script that auto-detects and replaces broken sequences

**Rationale**: Total affected lines are ~100 across ~8 files. A script risks false positives (matching legitimate sequences). Manual per-file replacement is auditable, testable, and takes roughly the same time as writing/debugging a script for a one-time fix.

## Risks / Trade-offs

- **[Risk] Legitimate text containing `â` followed by `€` followed by `"` could be falsely matched** → Mitigation: These are the exact byte sequences that produce broken UTF-8. No legitimate content uses this exact sequence. Manual review per match eliminates false positives.
- **[Risk] Some broken sequences may be missed** → Mitigation: Run `grep` after fix to verify zero matches remain across all src files. Validate build output.
- **[Trade-off] Inline HTML entities are slightly less readable in source** → Acceptable. Correct rendering trumps source readability. Em dashes in comments already use proper Unicode and won't be touched.
