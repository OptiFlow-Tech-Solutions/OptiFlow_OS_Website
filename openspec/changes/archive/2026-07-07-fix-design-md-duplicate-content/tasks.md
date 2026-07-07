## 1. Fix heading level

- [x] 1.1 Change `# Brand Description` to `## Brand Description` in `DESIGN.md/DESIGN.md` (line 22)

## 2. Remove duplicate frontmatter blockquotes

- [x] 2.1 Delete lines 14-20 (the `> Category`, `> Surface`, and `*> Purpose` blockquotes) from `DESIGN.md/DESIGN.md`

## 3. Remove code fences from Voice & Tone section

- [x] 3.1 Delete ` ```md ` on line 111 (the opening code fence before `## Voice & Tone`)
- [x] 3.2 Delete ` ``` ` on line 251 (the closing code fence after `Brand Promise`)

## 4. Remove code fences from Imagery + Layout sections

- [x] 4.1 Delete ` ```md id="k8t4qy" ` line (the opening code fence before `## Imagery`)
- [x] 4.2 Delete ` ``` ` on the last line (line 392, the closing code fence)

## 5. Clean up orphaned directories

- [x] 5.1 Delete the empty `DESIGN.md/system/` directory

## 6. Validation

- [x] 6.1 Run `npm run build` to confirm no build failures
- [x] 6.2 Run `npm run validate` to confirm validation passes
- [x] 6.3 Manually verify DESIGN.md parses as valid markdown (all sections visible, single H1, no code fences)
