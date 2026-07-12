# shared-components

## Purpose

Reusable React components (Button, Card, Section, Container, Input, Nav, Footer, PageLayout, ScrollTop, StickyCTA, SEOHead, FAQAccordion) providing design system consistency across all pages with variant support and unit tests.

## Requirements

### Requirement: Button component
The system SHALL provide a Button component with `primary`, `secondary`, and `outline` variants, supporting `as` prop for rendering as `<Link>` or `<button>`.

#### Scenario: Primary button renders
- **WHEN** `<Button variant="primary">Click</Button>` is rendered
- **THEN** a button with accent background, white text, and hover glow effect is displayed

#### Scenario: Secondary button renders
- **WHEN** `<Button variant="secondary">Cancel</Button>` is rendered
- **THEN** a button with surface background and border is displayed

#### Scenario: Outline button renders
- **WHEN** `<Button variant="outline">Learn More</Button>` is rendered
- **THEN** a button with transparent background and accent border is displayed

#### Scenario: Button as Link
- **WHEN** `<Button as={Link} to="/os/pricing">View Pricing</Button>` is rendered
- **THEN** a link styled as a button navigates to `/os/pricing`

#### Scenario: Button with icon
- **WHEN** `<Button icon={<Arrow />}>Next</Button>` is rendered
- **THEN** the icon appears next to the button text

### Requirement: Card component
The system SHALL provide a Card component with optional hover elevation and configurable padding.

#### Scenario: Default card renders
- **WHEN** `<Card><p>Content</p></Card>` is rendered
- **THEN** content is displayed with surface background, border, border-radius, and card shadow

#### Scenario: Card with hover effect
- **WHEN** `<Card hover>Content</Card>` is rendered
- **THEN** card elevates on hover with increased shadow

#### Scenario: Card with custom padding
- **WHEN** `<Card padding="lg">Content</Card>` is rendered
- **THEN** card uses `var(--gap-lg)` padding

### Requirement: Input component
The system SHALL provide an Input component supporting default and error variants, with disabled/readonly states and optional icon.

#### Scenario: Default input renders
- **WHEN** `<Input placeholder="Enter text" />` is rendered
- **THEN** an `<input>` element with `var(--border)` border, `var(--radius)` border-radius, and `var(--surface)` background is displayed

#### Scenario: Error input renders
- **WHEN** `<Input variant="error" />` is rendered
- **THEN** the input has a red-tinted border matching the `.form-error-msg` color from `core.css`

#### Scenario: Input with icon renders
- **WHEN** `<Input icon={<SearchIcon />} placeholder="Search..." />` is rendered
- **THEN** the icon is displayed inside the input on the leading side

#### Scenario: Disabled input renders
- **WHEN** `<Input disabled />` is rendered
- **THEN** the input has `cursor: not-allowed`, reduced opacity, and does not accept user input

#### Scenario: Readonly input renders
- **WHEN** `<Input readOnly value="Cannot edit" />` is rendered
- **THEN** the input displays the value but is not editable

#### Scenario: Input passes through native attributes
- **WHEN** `<Input type="email" name="email" required aria-label="Email" />` is rendered
- **THEN** all native HTML attributes are applied to the underlying `<input>` element

### Requirement: Form state classes are ported
The system SHALL provide CSS classes for form submission states matching `core.css`: `.form-submitting`, `.form-success`, and `.form-error`.

#### Scenario: Form submitting state
- **WHEN** a `<form className="form-submitting">` is rendered
- **THEN** form fields and submit button are dimmed (`opacity: 0.6; pointer-events: none`) and the button shows a spinning loader

#### Scenario: Form success state
- **WHEN** a `<form className="form-success">` is rendered
- **THEN** form fields are hidden and a success message with check icon is displayed

#### Scenario: Form error state
- **WHEN** a `<form className="form-error">` is rendered
- **THEN** the submit button is hidden, an error message with retry button is displayed, and the error message uses `var(--teal-soft)`-like error colors

### Requirement: Container component
The system SHALL provide a Container component that wraps content in a max-width centered container with configurable width.

#### Scenario: Default container renders
- **WHEN** `<Container><p>Content</p></Container>` is rendered
- **THEN** content is wrapped in a `<div>` with `max-width: var(--container)` (1200px), `margin-inline: auto`, and `padding-inline: var(--gutter)`

#### Scenario: Narrow container renders
- **WHEN** `<Container width="narrow">Content</Container>` is rendered
- **THEN** the container has a narrower max-width appropriate for reading (e.g., 800px)

#### Scenario: Container passes className through
- **WHEN** `<Container className="my-class">Content</Container>` is rendered
- **THEN** the custom class is merged with the container's base classes

### Requirement: Section component
The system SHALL provide a Section component with optional background, header block, and container width.

#### Scenario: Default section renders
- **WHEN** `<Section><p>Content</p></Section>` is rendered
- **THEN** content is wrapped in `<section>` with vertical padding (`padding-block: clamp(56px, 8vw, var(--gap-2xl))`), scroll-margin-top, and a max-width container. Heading is an `h2` element (not `h1`).

#### Scenario: Section with header renders with h2 heading
- **WHEN** `<Section heading="Features" lead="What we offer">Content</Section>` is rendered
- **THEN** a section-header div with `h2` heading (with decorative `::after` gradient underline) and `.lead` paragraph appears above the content. The heading element SHALL be `h2`, not `h1`.

#### Scenario: Section with background
- **WHEN** `<Section background="surface">Content</Section>` is rendered
- **THEN** section has `var(--color-surface)` as background

#### Scenario: Section with narrow container
- **WHEN** `<Section width="narrow">Content</Section>` is rendered
- **THEN** inner container is narrower than default (800px vs 1200px)

#### Scenario: Section with dark background variant
- **WHEN** `<Section background="dark">Content</Section>` is rendered
- **THEN** section has `oklch(12% 0.018 250)` background with white headings, muted lead text, teal eyebrows, and cards with semi-transparent white backgrounds

### Requirement: SEOHead component
The system SHALL provide an SEOHead component that renders `<title>`, `<meta>`, and Open Graph tags in the document `<head>` using `react-helmet-async` or equivalent.

#### Scenario: Title and description set
- **WHEN** `<SEOHead title="Pricing" description="OptiFlow pricing plans" />` is rendered
- **THEN** document title is "Pricing | OptiFlow Tech Solutions" and meta description matches

#### Scenario: Open Graph tags set
- **WHEN** SEOHead renders with title and description
- **THEN** `og:title`, `og:description`, and `og:url` meta tags are present in `<head>`

#### Scenario: Canonical URL set
- **WHEN** SEOHead renders with a page path
- **THEN** a `<link rel="canonical">` tag points to the full `/os/...` URL

### Requirement: Components have unit tests
Every shared component SHALL have a corresponding `.test.jsx` file with at least one test per variant.

#### Scenario: Button test passes
- **WHEN** `npm run test` is executed
- **THEN** Button primary, secondary, and outline variants all have passing tests

#### Scenario: Card test passes
- **WHEN** `npm run test` is executed
- **THEN** Card default and hover variants have passing tests

### Requirement: All pages use shared Section component
All 17 page components SHALL use the `<Section>` component for page sections. No page SHALL use raw `<section className="section">` tags.

#### Scenario: FAQ page uses Section component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all sections use `<Section>` instead of raw `<section className="section">`

#### Scenario: Contact page uses Section component
- **WHEN** inspecting Contact.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

### Requirement: All pages use shared Card component
All 17 page components SHALL use the `<Card>` component for card-style content blocks. No page SHALL use raw `<div className="card">` tags.

#### Scenario: FAQ page uses Card component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all card elements use `<Card>` instead of raw `<div className="card">`

### Requirement: All pages use shared Button component
All CTA links in every page SHALL use the `<Button>` component with `as={Link}` prop instead of raw `<a>` or `<Link>` tags with CSS classes.

#### Scenario: About page CTAs use Button component
- **WHEN** inspecting About.jsx source
- **THEN** all CTA elements use `<Button as={Link} to="...">` pattern

#### Scenario: FAQ page CTAs use Button component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all CTA elements use `<Button>` component

### Requirement: Nav component
The system SHALL provide a Nav component implementing the full navigation bar including desktop links, dropdown, mobile drawer, scroll behavior, active page highlighting, and theme toggle, as specified in the `react-nav` capability.

#### Scenario: Nav component exists and is exported
- **WHEN** importing `{ Nav }` from `./components`
- **THEN** Nav is a valid React component

#### Scenario: Nav renders without errors
- **WHEN** `<Nav />` is rendered inside a `<BrowserRouter>` and `<ThemeProvider>`
- **THEN** no console errors are produced and the nav header is visible

### Requirement: Footer component
The system SHALL provide a Footer component implementing the 5-column footer grid, social icons, theme toggle, and dynamic copyright year, as specified in the `react-footer` capability.

#### Scenario: Footer component exists and is exported
- **WHEN** importing `{ Footer }` from `./components`
- **THEN** Footer is a valid React component

#### Scenario: Footer renders without errors
- **WHEN** `<Footer />` is rendered inside a `<ThemeProvider>`
- **THEN** no console errors are produced and the footer grid is visible

### Requirement: PageLayout component
The system SHALL provide a PageLayout component composing Nav, main content slot, Footer, ScrollTop, and StickyCTA as specified in the `react-page-layout` capability.

#### Scenario: PageLayout component exists and is exported
- **WHEN** importing `{ PageLayout }` from `./components`
- **THEN** PageLayout is a valid React component

#### Scenario: PageLayout renders nested route content
- **WHEN** PageLayout is used as a layout route with nested child routes
- **THEN** child route content renders inside the `<main>` element between Nav and Footer

### Requirement: ScrollTop component
The system SHALL provide a ScrollTop floating button that appears after 400px scroll and scrolls to top on click.

#### Scenario: ScrollTop component exists
- **WHEN** importing `{ ScrollTop }` from `./components`
- **THEN** ScrollTop is a valid React component

### Requirement: StickyCTA component
The system SHALL provide a StickyCTA bottom bar visible after scrolling past viewport height.

#### Scenario: StickyCTA component exists
- **WHEN** importing `{ StickyCTA }` from `./components`
- **THEN** StickyCTA is a valid React component

### Requirement: Button component has transition animation
The Button component SHALL apply CSS transitions on `background-color`, `border-color`, `box-shadow`, and `transform` properties using `var(--transition-base)` duration and `var(--ease-out)` timing.

#### Scenario: Button hover transitions smoothly
- **WHEN** hovering over a primary button
- **THEN** the background, shadow, and transform change over ~250ms with an ease-out curve

#### Scenario: Button active state provides feedback
- **WHEN** pressing a button
- **THEN** the button scales down slightly (`transform: scale(0.97)`) providing tactile feedback

### Requirement: Card component has hover transition
The Card component SHALL apply a smooth elevation transition on hover using CSS `transition` on `box-shadow` and `transform` properties.

#### Scenario: Card hover elevates smoothly
- **WHEN** hovering over a card with `hover` prop
- **THEN** the shadow deepens and the card lifts over ~250ms

### Requirement: Input component focus transition
The Input component SHALL apply a CSS transition on `border-color` and `box-shadow` during focus/blur events.

#### Scenario: Input focus has smooth border transition
- **WHEN** an input receives `:focus-visible`
- **THEN** the border and box-shadow change over ~150ms

### Requirement: Nav dropdown menu animation
The Nav component's Resource dropdown SHALL animate in/out using `opacity` and `transform: translateY()` with `var(--transition-base)` duration.

#### Scenario: Dropdown animates open
- **WHEN** hovering over the Resources nav item
- **THEN** the dropdown menu fades in and slides down over 250ms

### Requirement: FAQAccordion component
The system SHALL provide a shared `FAQAccordion` component with single-open behavior, smooth grid-rows animation, and an `items` prop accepting `{ question: string, answer: ReactNode }[]`. The component SHALL be exported from `components/index.ts`.

#### Scenario: FAQAccordion renders items
- **WHEN** `<FAQAccordion items={[{question: "Q", answer: <p>A</p>}]} />` is rendered
- **THEN** one accordion item is displayed with the question and expandable answer

#### Scenario: Single-open behavior
- **WHEN** user clicks a second accordion item while the first is open
- **THEN** the first item closes and the second opens

#### Scenario: Uses design tokens
- **WHEN** FAQAccordion renders
- **THEN** styles reference `var(--surface)`, `var(--border)`, `var(--radius-lg)`, `var(--fg)`, `var(--muted)`, `var(--teal)` CSS variables

#### Scenario: Exported from barrel
- **WHEN** importing `{ FAQAccordion }` from `'../../components'`
- **THEN** the component is available and usable
