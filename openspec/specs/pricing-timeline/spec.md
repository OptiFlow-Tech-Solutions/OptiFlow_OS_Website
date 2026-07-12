# pricing-timeline

## Purpose

Five-step implementation timeline on the pricing page showing the OptiFlow rollout process (Discovery through Go Live) with animated numbered circles, connecting lines, hover elevation, and summary metric cards.

## Requirements

### Requirement: Timeline displays five implementation steps

The implementation timeline SHALL display five steps (Discovery, Setup, Configuration, Training, Go Live) in a horizontal row, each with a numbered circle, heading, and short description.

#### Scenario: Five steps display in order
- **WHEN** the timeline renders
- **THEN** steps 1-5 display with labels: Discovery, Setup, Configuration, Training, Go Live

#### Scenario: Each step has a description
- **WHEN** step 1 (Discovery) renders
- **THEN** description "Understand your operations, workflows, and pain points" appears below the heading

### Requirement: Step circles have floating animation

Each step's numbered circle SHALL have a staggered `floatUp` animation (3s ease-in-out infinite), with delays of 0ms, 300ms, 600ms, 900ms, 1200ms for steps 1-5.

#### Scenario: Step circles animate with staggered delays
- **WHEN** the timeline renders
- **THEN** circles float up/down with different phase offsets

#### Scenario: Reduced motion disables floating animation
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** step circles do not animate

### Requirement: Steps have connecting lines

Consecutive steps SHALL be connected by horizontal gradient lines between their circles, visible when the section enters the viewport.

#### Scenario: Connecting lines appear on scroll
- **WHEN** the timeline section enters the viewport
- **THEN** horizontal gradient lines appear between consecutive steps

#### Scenario: Last step has no trailing connector
- **WHEN** the timeline renders
- **THEN** step 5 (Go Live) has no connecting line after it

### Requirement: Steps have hover elevation

Each step card SHALL elevate (translateY(-6px)) with increased shadow and accent border color on hover.

#### Scenario: Step elevates on hover
- **WHEN** the user hovers over a step card
- **THEN** the card lifts by 6px and its shadow intensity increases

### Requirement: Timeline section includes three metric cards

Below the timeline, three metric cards SHALL display "2-4 Weeks to go live", "90%+ Adoption within first month", and "Dedicated Implementation support throughout".

#### Scenario: Three metric cards render below timeline
- **WHEN** the timeline section renders
- **THEN** three cards display: 2-4, 90%+, Dedicated with their respective labels and accent colors

### Requirement: Timeline is responsive

The timeline SHALL collapse from 5 columns to 3 columns at 1024px, and to a single column at 768px, with connecting lines hidden on single-column layout.

#### Scenario: Three columns on tablet
- **WHEN** viewport width is ≤ 1024px
- **THEN** steps display in a 3-column grid

#### Scenario: Single column on mobile
- **WHEN** viewport width is ≤ 768px
- **THEN** steps display in a single column and connecting lines are hidden
