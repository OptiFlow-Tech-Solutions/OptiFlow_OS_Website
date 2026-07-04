## Spec: Cookie Consent & Privacy Compliance (UI-005)

### Purpose

Display a cookie consent banner on all OptiFlow OS website pages to comply with Indian DPDP Act 2023 and GDPR transparency requirements. Provide users with granular control over non-essential cookie categories.

### Requirements

#### REQ-1: Cookie Consent Banner

The site SHALL display a fixed bottom banner on first visit prompting users to accept or manage cookies.

| Check | Expectation |
|-------|------------|
| Banner display | Appears on first visit when no consent stored |
| Banner hidden | Remains hidden when `localStorage.optiflow-cookie-consent` exists |
| Z-index | `--z-cookie-banner: 103` (above sticky CTA at 90) |
| Appearance delay | 600ms slide-up animation from bottom |
| Responsive | Adapts to mobile: stack vertically, full-width buttons |

**BDD Scenario: First visit**
- GIVEN a user visits any OptiFlow OS page for the first time
- AND `localStorage.optiflow-cookie-consent` does not exist
- WHEN the page loads
- THEN a cookie consent banner slides up from the bottom of the page
- AND the banner contains a cookie icon, descriptive text, a Privacy Policy link, an "Accept All" button, a "Reject Non‑Essential" button, and a "Manage Preferences" link

**BDD Scenario: Returning consent**
- GIVEN a user has previously accepted or rejected cookies
- AND `localStorage.optiflow-cookie-consent` contains a valid consent object
- WHEN the user visits any page
- THEN the cookie consent banner does not appear

#### REQ-2: Accept All

The user SHALL be able to accept all cookie categories with one click.

| Check | Expectation |
|-------|------------|
| All categories | `essential: true`, `analytics: true`, `preferences: true` |
| Timestamp | `acceptedAt` set to ISO 8601 |
| Banner dismiss | Banner hides immediately |
| Modal dismiss | Modal closes if open |

**BDD Scenario: Accept All clicked**
- GIVEN the consent banner is visible
- WHEN the user clicks "Accept All"
- THEN the consent object contains all categories set to true
- AND the consent is persisted to localStorage
- AND the banner is hidden

#### REQ-3: Reject Non‑Essential

The user SHALL be able to reject all non-essential cookies while keeping essential ones enabled.

| Check | Expectation |
|-------|------------|
| Essential | Always `true` |
| Analytics | `false` |
| Preferences | `false` |

**BDD Scenario: Reject Non‑Essential clicked**
- GIVEN the consent banner is visible
- WHEN the user clicks "Reject Non‑Essential"
- THEN only `essential` is `true` in the consent object
- AND the consent is persisted to localStorage
- AND the banner is hidden

#### REQ-4: Manage Preferences Modal

The user SHALL be able to open a preferences modal to set granular cookie choices.

| Check | Expectation |
|-------|------------|
| Modal trigger | "Manage Preferences" link or footer "Cookie Settings" link |
| Categories | Essential (locked ON), Analytics (toggle), Preferences (toggle) |
| Modal close | Overlay click, Escape key, or close button |
| Z-index | `--z-cookie-modal: 104` (above banner) |
| Keyboard accessibility | Focus trap, Escape to close |

**BDD Scenario: Granular preference selection**
- GIVEN the user opens the preferences modal
- WHEN the user toggles Analytics ON and Preferences OFF
- AND clicks "Save Preferences"
- THEN the consent object has `analytics: true, preferences: false, essential: true`
- AND the consent is persisted to localStorage
- AND the banner is hidden
- AND the modal is closed

#### REQ-5: Cookie Settings Footer Link

A "Cookie Settings" link SHALL be present in the footer Resources column.

| Check | Expectation |
|-------|------------|
| Location | Footer Resources column, after Terms & Conditions |
| Behavior | On click, reopens preferences modal |
| Always visible | Even after consent is given |

**BDD Scenario: Reopen preferences after consent**
- GIVEN the user has already given consent
- AND the banner is not visible
- WHEN the user clicks "Cookie Settings" in the footer
- THEN the preferences modal opens
- AND current consent values are pre-populated in the toggles

#### REQ-6: localStorage Persistence

Consent choices SHALL be persisted in `localStorage` under key `optiflow-cookie-consent`.

```json
{
  "essential": true,
  "analytics": true|false,
  "preferences": true|false,
  "acceptedAt": "2026-07-04T09:00:00.000Z"
}
```

#### REQ-7: Dark Mode Support

The cookie consent banner and modal SHALL render correctly in dark mode.

| Check | Expectation |
|-------|------------|
| Banner | Uses `var(--surface)` which adapts to dark |
| Modal overlay | Darker overlay in dark mode (`rgba(0,0,0,.60)`) |
| Toggle knob | Uses `var(--surface)` for dark mode knob color |

#### REQ-8: Accessibility (WCAG 2.2 AA)

The cookie consent UI SHALL meet WCAG 2.2 Level AA standards.

| Check | Expectation |
|-------|------------|
| Banner role | `role="region"` with `aria-label="Cookie consent"` |
| Modal role | `role="dialog"` with `aria-modal="true"` |
| Focus visibility | `:focus-visible` outlines on all interactive elements |
| Reduced motion | No animations when `prefers-reduced-motion: reduce` |
| Color contrast | All text meets AA contrast ratios via CSS variables |
| Keyboard | Escape closes modal; toggles are keyboard accessible |

#### REQ-9: Assembly

The cookie consent SHALL be injected on every page via `<!-- INCLUDE: cookie-consent -->`.

| Check | Expectation |
|-------|------------|
| Partial | `src/partials/cookie-consent.html` contains banner + modal HTML |
| Build injection | `scripts/assemble.mjs` reads and replaces the include |
| Coverage | All 15 pages in `site.json` include the directive |
