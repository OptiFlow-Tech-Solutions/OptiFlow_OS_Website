# cross-page-responsive-verification

## Purpose

Verify and fix responsive behavior across all 15 React pages at every breakpoint (320px mobile, 480px small, 768px tablet, 1024px laptop, 1200px desktop, 1440px+ large), ensuring no overflow, clipping, misalignment, or broken grid behavior.

## ADDED Requirements

### Requirement: All pages verified at every breakpoint
Every React page SHALL render without horizontal overflow, layout breakage, or misaligned elements at 320px, 480px, 768px, 1024px, 1200px, and 1440px viewport widths.

#### Scenario: No horizontal overflow on any page
- **WHEN** viewing any page at any breakpoint
- **THEN** the page content does not exceed the viewport width (no horizontal scrollbar appears)

#### Scenario: Grids collapse correctly at tablet
- **WHEN** viewport is 768px wide
- **THEN** 4-column grids collapse to 2 columns, and 3-column grids collapse to 2 or 1 column as appropriate

#### Scenario: Grids collapse correctly at mobile
- **WHEN** viewport is 480px wide
- **THEN** all multi-column grids collapse to single column; cards and sections stack vertically

### Requirement: Navigation responsive behavior
The Nav component SHALL switch to hamburger menu below 1024px, with a slide-in drawer that covers the full viewport height and closes on link click or Escape key.

#### Scenario: Hamburger menu visible at tablet
- **WHEN** viewport is 768px
- **THEN** the hamburger icon is visible and the desktop nav links are hidden

#### Scenario: Drawer closes on link click
- **WHEN** a nav link is clicked inside the mobile drawer
- **THEN** the drawer closes and the user navigates to the target page

### Requirement: Typography scales down at mobile
All text SHALL scale down appropriately at mobile and tablet breakpoints via media query adjustments to the font-size tokens.

#### Scenario: H1 is readable at 480px
- **WHEN** viewport is 480px
- **THEN** `--fs-h1` is no larger than 36px and line-height remains readable

#### Scenario: Body text remains 16px minimum
- **WHEN** viewport is 320px
- **THEN** body text font-size is at least 16px (no iOS zoom trigger)

### Requirement: Hero sections responsive
Every page's hero section SHALL collapse from two-column to single-column layout below 1024px, with reduced padding and centered content at mobile.

#### Scenario: Hero grid collapses at tablet
- **WHEN** viewport is 768px
- **THEN** the hero grid displays as a single column with text content centered

#### Scenario: Hero visual hidden at mobile
- **WHEN** viewport is below 480px
- **THEN** decorative hero visuals (dashboard mockups, side graphics) are hidden to preserve space
