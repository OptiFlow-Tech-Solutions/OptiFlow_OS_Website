## ADDED Requirements

### Requirement: Tailwind theme extends from CSS custom properties
The Tailwind configuration SHALL extend `theme.colors` using `var()` references to `tokens.css` custom properties, enabling named utility classes like `text-accent`, `bg-teal`, `border-green`.

#### Scenario: Named color classes work
- **WHEN** developer writes `className="text-accent bg-teal-soft"`
- **THEN** the element renders with the accent text color and teal soft background

#### Scenario: All core colors are mapped
- **WHEN** inspecting Tailwind theme config
- **THEN** `accent`, `teal`, `green`, `lime`, `bg`, `surface`, `fg`, `muted`, `border`, `border-soft`, `border-strong`, and their soft variants are all defined

### Requirement: Tailwind theme maps spacing and typography
The Tailwind configuration SHALL extend spacing scale with design tokens (`--gap-*`) and map font stacks from `tokens.css`.

#### Scenario: Gap utility classes work
- **WHEN** developer writes `className="gap-lg"` or `className="p-xl"`
- **THEN** gap equals `var(--gap-lg)` (32px) and padding equals `var(--gap-xl)` (56px)

#### Scenario: Font family classes work
- **WHEN** developer writes `className="font-display"` or `className="font-mono"`
- **THEN** font matches `--font-display` or `--font-mono` from tokens.css

### Requirement: Dark mode via data-theme attribute
The Tailwind configuration SHALL use `darkMode: ['selector', '[data-theme="dark"]']` to enable `dark:` variant classes.

#### Scenario: Dark variant applies in dark mode
- **WHEN** `data-theme="dark"` is set on `<html>` and an element has `className="dark:bg-surface"`
- **THEN** the surface color matches the dark mode `--color-surface` value

### Requirement: No duplicate token values
Design token values SHALL NOT be duplicated in the Tailwind config — all color, spacing, and font values SHALL reference CSS custom properties via `var()`.

#### Scenario: Token change propagates
- **WHEN** a color value changes in `tokens.css`
- **THEN** Tailwind classes referencing that token update without any changes to `tailwind.config.js`
