## ADDED Requirements

### Requirement: Self-Service Toolbar
The FAQ page SHALL display a self-service toolbar with quick-access cards linking to Video Tutorials, SOP Library resources, Guided Setup documentation, and a Troubleshooting section. The toolbar SHALL appear between the hero/search section and the FAQ categories.

#### Scenario: Toolbar renders with four cards
- **WHEN** a user visits the FAQ page
- **THEN** four self-service cards SHALL be visible in a 4-column grid (stacked on mobile)
- **AND** each card SHALL have an icon, title, short description, and CTA link

#### Scenario: Toolbar adapts to dark mode
- **WHEN** the user toggles dark mode
- **THEN** toolbar cards SHALL use theme-appropriate background and text colors via CSS variables

### Requirement: FAQ Feedback Buttons
Each FAQ answer SHALL display "Was this helpful?" feedback buttons (Yes/No) after the answer text. Voting SHALL persist in localStorage per question. After voting, a thank-you message SHALL replace the buttons.

#### Scenario: User votes Yes
- **WHEN** a user clicks "Yes" on a previously unvoted FAQ item
- **THEN** the vote SHALL be stored in localStorage
- **AND** the feedback buttons SHALL be replaced with a "Thanks for your feedback!" message

#### Scenario: User votes No
- **WHEN** a user clicks "No" on a previously unvoted FAQ item
- **THEN** the vote SHALL be stored in localStorage
- **AND** a follow-up prompt SHALL appear: "What were you looking for?" with a link to contact/demo

#### Scenario: Already-voted question
- **WHEN** a user re-visits a question they previously voted on
- **THEN** the feedback buttons SHALL not appear; the thank-you message SHALL show instead

### Requirement: Related Questions
Each FAQ answer SHALL display 2-3 related question links at the bottom of the answer body. Clicking a related question SHALL scroll to and expand that question.

#### Scenario: Related questions display
- **WHEN** a user expands an FAQ item
- **THEN** related question links SHALL appear below the answer text and feedback section

#### Scenario: Clicking a related question
- **WHEN** a user clicks a related question link
- **THEN** the target FAQ item SHALL expand
- **AND** the page SHALL scroll smoothly to that item

### Requirement: Troubleshooting Widget
The FAQ page SHALL include a guided troubleshooting widget with three cascading selectors: Issue Category, Specific Problem, and Resolution. Selecting a resolution SHALL display an action link to the appropriate resource.

#### Scenario: User completes the troubleshooting flow
- **WHEN** a user selects Issue Category → Specific Problem → Resolution in sequence
- **THEN** a resolution panel SHALL appear with a description and a CTA link (e.g., "Book Demo", "Contact Support", "View Pricing")

#### Scenario: User changes category
- **WHEN** a user changes the Issue Category selector
- **THEN** the Specific Problem and Resolution selectors SHALL reset to default
- **AND** any visible resolution panel SHALL hide

### Requirement: Escalation Section
The FAQ page SHALL display a "Still need help?" escalation section immediately before the bottom CTA, surfacing all contact options: demo booking, contact form, WhatsApp, and email.

#### Scenario: Escalation section renders
- **WHEN** a user scrolls to the escalation section
- **THEN** contact cards for Demo, Contact, WhatsApp, and Email SHALL be visible
- **AND** each card SHALL link to the appropriate destination

### Requirement: Enhanced Search
The FAQ search SHALL display a live match count and highlight matching search terms in results and expanded answers.

#### Scenario: Search shows match count
- **WHEN** a user types a search query with 2+ characters
- **THEN** the search results SHALL display "X matches found"

#### Scenario: Search highlights terms
- **WHEN** a user clicks a search result
- **THEN** the matching term SHALL be visually highlighted in the expanded answer using `<mark>` elements
