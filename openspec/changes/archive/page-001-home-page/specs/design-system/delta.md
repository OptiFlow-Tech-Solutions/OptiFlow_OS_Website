# Delta: Design System → PAGE-001 Home Page

## Change: Verification

### CSS Variables

- **CONFIRMED**: All colors use `var(--*)` tokens: `--accent`, `--teal`, `--green`, `--lime`, `--muted`, `--fg`, `--fg-soft`, `--border`, `--surface`
- **CONFIRMED**: Spacing uses `var(--gap-*)` tokens
- **CONFIRMED**: Typography uses `.display`, `h1`-`h3`, `.lead`, `.eyebrow`, `.body` classes
- **CONFIRMED**: Complete dark theme override block present with `[data-theme="dark"]` selectors

### Component Classes

- **CONFIRMED**: `.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-glow` used correctly
- **CONFIRMED**: `.section`, `.section-dark`, `.container` layout classes applied
- **CONFIRMED**: `.reveal`, `.stagger-*` animation classes present
- **CONFIRMED**: `.faq-item`, `.faq-question`, `.faq-answer` accordion markup correct

### Hardcoded Colors

- **NOTE**: Hardcoded hex values exist only in `<style>` blocks and SVG `fill` attributes — allowed per spec
- **NOTE**: Validation reports 3 warnings for `#0a1628`, `#1B4D81`, `#54B89A` in dist/index.html — all in style blocks
