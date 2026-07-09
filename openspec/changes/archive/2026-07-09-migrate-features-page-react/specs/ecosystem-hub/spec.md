## ADDED Requirements

### Requirement: Ecosystem hub renders in hero section
The hero section of the Features page SHALL display an ecosystem hub visualization with a center node labeled "OptiFlow OS" and 8 orbiting module labels.

#### Scenario: Center hub visible
- **WHEN** user views the hero section
- **THEN** a circular center hub with gradient accent-to-teal background and "OptiFlow OS" text is displayed

#### Scenario: Eight orbiting modules rendered
- **WHEN** hero ecosystem is rendered
- **THEN** 8 module labels (Tasks, Checklists, Attendance, SOPs, Reports, Worklists, Leaves, Training) are positioned around the center hub

#### Scenario: Modules are absolutely positioned
- **WHEN** inspecting the ecosystem hub layout
- **THEN** the 8 modules use absolute positioning relative to the hero-ecosystem container

### Requirement: Hub has animated glow
The center hub SHALL have a pulsing glow animation on its pseudo-element.

#### Scenario: Glow animation plays
- **WHEN** page loads
- **THEN** the hub's `::after` pseudo-element pulses opacity between 0.3 and 0.7 over a 3-second ease-in-out cycle

### Requirement: Orbiting modules have float animation
Each of the 8 module labels SHALL animate vertically with staggered delays.

#### Scenario: Modules float up and down
- **WHEN** page loads
- **THEN** all 8 modules oscillate vertically by 10px over a 6-second ease-in-out cycle

#### Scenario: Animation delays are staggered
- **WHEN** observing all 8 modules simultaneously
- **THEN** each module's animation phase is offset by approximately 0.8 seconds from the next, creating a wave effect

### Requirement: Hero background has radial gradient glow
The hero section SHALL display a large radial gradient glow behind the ecosystem hub visual.

#### Scenario: Background glow visible
- **WHEN** user views the hero section
- **THEN** a teal-tinted radial gradient ellipse is visible behind the ecosystem hub

### Requirement: Hero content renders tagline and CTAs
The hero section SHALL display an eyebrow text ("Business Operating System For MSMEs"), an h1 heading, lead paragraph, two CTA buttons (Book Free Demo, Watch Product Tour), and 4 trust badges.

#### Scenario: Hero content matches static HTML
- **WHEN** comparing React hero with static HTML hero
- **THEN** the heading, lead text, CTA button labels, and trust badge text are identical

### Requirement: Responsive ecosystem hub
The ecosystem hub SHALL adapt to different viewport sizes without breaking the orbital layout.

#### Scenario: Hub shrinks at tablet
- **WHEN** viewport width is ≤1024px
- **THEN** the hero-ecosystem container reduces to min-height 300px

#### Scenario: Hero visual reorders on mobile
- **WHEN** viewport width is ≤1024px
- **THEN** the hero visual (ecosystem hub) appears above the hero content text
