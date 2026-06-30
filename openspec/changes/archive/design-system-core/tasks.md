## 1. Add CSS Custom Properties

- [x] 1.1 Add border hierarchy tokens (`--border-soft`, `--border-default`, `--border-strong`) to `:root` in core.css
- [x] 1.2 Add border hierarchy tokens dark-theme overrides in `[data-theme="dark"]`
- [x] 1.3 Add `--fg-disabled` token to `:root` and dark-theme block
- [x] 1.4 Add `--glow-accent` token to `:root` and dark-theme block
- [x] 1.5 Add z-index scale tokens to `:root` (--z-base through --z-skip-link)
- [x] 1.6 Add transition duration tokens (`--transition-fast`, `--transition-base`, `--transition-slow`) and easing token (`--ease-out`) to `:root`

## 2. Replace Hardcoded Z-Index Values

- [x] 2.1 Replace hardcoded `z-index` values in core.css with `var(--z-*)` references

## 3. Build and Validate

- [x] 3.1 Run `npm run build` to regenerate dist/
- [x] 3.2 Run `npm run validate` (0 errors, 84 warnings — all hex/SVG expected)
