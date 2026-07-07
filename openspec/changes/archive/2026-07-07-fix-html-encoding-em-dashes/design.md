## Context

The OptiFlow OS website consists of 14 HTML pages with inline `<style>` blocks containing CSS section comments using box-drawing characters (—). These characters, along with middle dots (·) and arrows (→, ↓, ↑) in body text, were corrupted through a UTF-8 → Windows-1252 double-encoding pipeline. The bytes `E2 80 94` (UTF-8 for —) were misinterpreted as Windows-1252 then re-encoded as UTF-8, producing the visible sequence `â"€`.

The build system (`scripts/assemble.mjs`) reads and writes files in pure UTF-8, so it faithfully reproduces the corruption from source to dist. The fix must be applied at the source level.

## Goals / Non-Goals

**Goals:**
- Replace every corrupted byte sequence in `src/pages/*.html` with the correct HTML entity or literal Unicode character
- Ensure grep for corruption patterns returns zero results after fix
- Pass `npm run build && npm run validate` without errors

**Non-Goals:**
- Changing the build pipeline encoding (fs.readFileSync with 'utf-8' is correct)
- Converting ALL literal Unicode chars to HTML entities (only fix corruption, don't touch correct UTF-8)
- Fixing encoding in partials (nav.html, footer.html, analytics.html — these have correct UTF-8)
- Fixing encoding in site.json (uses correct UTF-8 em dashes that produce correct `{{PAGE_TITLE}}` output)

## Decisions

### Decision 1: Use HTML entities for replacements

**Chosen:** Replace corrupted sequences with HTML entities (`&mdash;`, `&middot;`, `&rarr;`) rather than literal Unicode characters.

**Rationale:** HTML entities are pure ASCII. They survive any encoding pipeline without corruption. The build system already uses this approach for other content (e.g., `&mdash;` in competitive-positioning.html, `&#8377;` in pricing.html). Consistency with the existing codebase convention.

**Alternative considered:** Replace with literal Unicode characters (`—`, `·`, `→`). This would produce smaller file sizes but risks re-corruption if any tool in the chain mishandles UTF-8. Given the corruption already happened once, HTML entities are the safer choice.

### Decision 2: Target the known byte sequences, not regex patterns

**Chosen:** Exact string replacement: `â"€` → `&mdash;`, `Â·` → `&middot;`, `â†'` → `&rarr;`, `â†"` → `&darr;`, `â†'` → `&uarr;`.

**Rationale:** The corrupted bytes are deterministic. A simple `String.replaceAll()` is sufficient. Regex is overkill and risks matching genuine text. Each pattern is a literal multi-byte string.

### Decision 3: Edit files individually, not with a script

**Chosen:** Use the Edit tool on each affected file, one pattern at a time.

**Rationale:** The correction is small (~3 replacement patterns per file, ~14 files). A script adds complexity for a one-off task. Direct editing provides auditability — each change is explicit in git history.

### Decision 4: Replace NOT remove — keep the CSS comment structure

**Chosen:** Replace each corrupted three-char sequence `â"€` with a single `&mdash;`, not delete the comment separators entirely.

**Rationale:** CSS comments exist to aid readability during development. The pattern `/* --- Section Name --- */` is a convention used throughout the codebase. Replacing preserves this convention.

## Risks / Trade-offs

- **Risk:** Miss a corrupted sequence → **Mitigation:** `grep` for `â` in `src/` after fix to verify zero remaining
- **Risk:** Match genuine text containing `â` → **Mitigation:** The specific 2-3 byte sequences are unambiguous; no genuine English/Hindi text would contain `â"€` or `Â·`
- **Trade-off:** HTML entities are slightly longer than literal Unicode → negligible for CSS comments and short text snippets
