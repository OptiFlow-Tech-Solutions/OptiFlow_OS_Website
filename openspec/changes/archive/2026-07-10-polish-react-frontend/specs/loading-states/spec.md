## ADDED Requirements

### Requirement: Skeleton loader component
The system SHALL provide a reusable skeleton loader component with multiple variants.

#### Scenario: Text skeleton
- **WHEN** content is loading and a `text` variant skeleton is rendered
- **THEN** the system SHALL display one or more animated gradient bars with rounded corners matching the expected text line height and width

#### Scenario: Card skeleton
- **WHEN** content is loading and a `card` variant skeleton is rendered
- **THEN** the system SHALL display a card-shaped placeholder with animated gradient, matching the dimensions of the actual card component

#### Scenario: Skeleton respects reduced motion
- **WHEN** user has reduced motion preference
- **THEN** skeleton gradient animation SHALL be disabled (static gradient)

### Requirement: Page-level loading state
The system SHALL display a loading indicator during route-level code splitting.

#### Scenario: Lazy-loaded page chunk is downloading
- **WHEN** React.lazy suspense boundary is triggered for a page component
- **THEN** the system SHALL display a centered spinner or page-level skeleton in `<PageLoader>` component until the chunk loads

### Requirement: Async content loading state
Any component that fetches data asynchronously SHALL show a loading state while data is pending.

#### Scenario: Newsletter articles loading
- **WHEN** the newsletter page is fetching articles from the API
- **THEN** the article grid SHALL display skeleton card placeholders until data resolves

#### Scenario: FAQ content loading
- **WHEN** the FAQ page is loading categories and items
- **THEN** the FAQ category tabs and accordion SHALL display skeleton placeholders

### Requirement: Empty state component
The system SHALL display a meaningful empty state when content lists return no results.

#### Scenario: No newsletter articles match filter
- **WHEN** the newsletter page filter returns zero articles
- **THEN** the system SHALL display an empty state message with an illustration or icon and a call-to-action to clear filters

#### Scenario: No FAQ results for search
- **WHEN** the FAQ search returns no matching items
- **THEN** the system SHALL display an empty state suggesting alternative search terms or linking to contact support
