## Context

The OptiFlow design system (DESIGN.md) defines two green accent roles:

| Role | Token | Hex | Purpose |
|------|-------|-----|---------|
| Success Green | — | `#54B89A` | Completion, done states, confirmations |
| Growth Green | — | `#99D271` | KPIs, progress, ROI, savings |

`core.css` defines CSS variable equivalents but the naming is misleading:

| CSS Variable | oklch Value | Approximates |
|-------------|-------------|--------------|
| `--green` | `oklch(72% 0.12 145)` | Success Green `#54B89A` |
| `--lime` | `oklch(82% 0.14 125)` | Growth Green `#99D271` |

The name `--lime` obscures its true purpose as Growth Green, leading pages to misuse `--green` for growth/KPI indicators.

Additionally, `features.html` and `feature-showcase.html` override `--green` locally to `oklch(44% 0.13 155)` — a third, undocumented green — and the pricing page had its own override (since removed, per line 13 comment).

## Goals / Non-Goals

**Goals:**
- Make `--green` mean Success Green (completion, checkmarks, done states) consistently across all pages
- Make `--lime` mean Growth Green (KPIs, savings, ROI, progress) consistently across all pages
- Remove all page-level `--green` overrides that break semantic consistency
- Replace hardcoded hex green values with CSS variable references

**Non-Goals:**
- Do NOT rename `--lime` to `--growth-green` — this would be a broader refactor touching every page. The semantic mapping is the fix; renaming can happen separately.
- Do NOT change `core.css` — the variables have the right colors, only the usage is wrong
- Do NOT change any visual appearance intentionally — only realign which variable is used where
- Do NOT change DESIGN.md — the existing two-green system is correct

## Decisions

### Decision 1: `--green` = Success Green, `--lime` = Growth Green

**Rationale**: The oklch values in `core.css` already match the DESIGN.md hex values. The fix is about CONSISTENT USAGE, not new variables. `--lime` is poorly named but changing it is a separate concern.

**Alternatives considered**:
- Rename `--lime` → `--growth-green`: Rejected for this change. Would require touching every page (not just pricing/features). Can be done as a follow-up.
- Add a new `--success-green` variable: Rejected. `--green` already IS success green. Adding a new token just to rename is pointless overhead.

### Decision 2: Pricing page `var(--green)` → `var(--lime)` for growth indicators

Which pricing page elements switch to `--lime`:

| Context | Current | New | Why |
|---------|---------|-----|-----|
| Trust badge checkmarks | `var(--green)` | `var(--green)` | These ARE success indicators — keep |
| ROI dashboard savings amount | `var(--green)` | `var(--lime)` | Growth metric — switch |
| ROI dashboard pulse dot | `var(--green)` | `var(--lime)` | Growth indicator — switch |
| ROI connector line | `var(--green)` | `var(--lime)` | Growth visual — switch |
| ROI stats green values | `var(--green)` | `var(--lime)` | Growth metrics — switch |
| Save badge / save pct | `var(--green)` | `var(--lime)` | Savings display — switch |
| Save card bg/border/icon/amount | `var(--green)` | `var(--lime)` | Savings display — switch |
| Comparison "yes" cells | `var(--green)` | `var(--green)` | These ARE success/check — keep |
| Feature list check icons | `var(--green)` | `var(--green)` | These ARE success/check — keep |
| ROI calc `pc-bd-green` | `var(--green)` | `var(--lime)` | Growth metric — switch |
| Cloud hosting card icon | `var(--green)` | `var(--lime)` | Feature highlight — switch |
| Counter display (500K tasks) | `var(--green)` | `var(--lime)` | Growth KPI — switch |
| Hardcoded bar fills (#84CC16 etc) | hardcoded hex | `var(--lime)`-based gradient | Alignment — switch |

### Decision 3: Remove `--green` override from features.html and feature-showcase.html

Both pages override:
```css
:root { --green: oklch(44% 0.13 155); }
[data-theme="dark"] { --green: oklch(76% 0.14 145); }
```

**Rationale**: These overrides create a third undocumented green. Pages should use core.css's `--green` for success indicators and `--lime` for growth indicators. Removing the override makes these pages consistent.

**Verification needed**: After removal, review features/showcase pages to ensure no element relied on the darker green for visual hierarchy. If any element looks wrong, it likely needs `var(--lime)` instead.

## Risks / Trade-offs

- **Visual regression on features/showcase pages**: Removing the `--green` override will lighten `--green` from `oklch(44%)` to `oklch(72%)`. Any element previously using the darker green may look washed out. → Mitigation: review each `var(--green)` usage on those pages; if it's a KPI/growth indicator, switch to `var(--lime)`.
- **Pricing page savings display**: Switching from `--green` to `--lime` changes the color from teal-adjacent green to a lime yellow-green. This may look visually different from expected. → Mitigation: `--lime` IS the Growth Green from DESIGN.md. The current display is already semantically wrong; this fixes it.
- **Dark mode**: `--lime` doesn't have a dark mode override in core.css. It uses the same `oklch(82% 0.14 125)` in both modes. → Mitigation: DESIGN.md's Growth Green `#99D271` works well on dark backgrounds already.
