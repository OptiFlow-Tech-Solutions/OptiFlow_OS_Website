# blog-frontend

## ADDED Requirements

### Requirement: Newsletter page renders from API
The React Newsletter page at `/newsletter` SHALL fetch articles, categories, popular articles, and resources from the API on mount. All content previously hardcoded in `newsletter.html` SHALL be replaced with dynamic API data. The page SHALL show a loading state while data fetches and an error state if the API is unreachable.

#### Scenario: Page loads with API data
- **WHEN** a user navigates to `/os/newsletter/`
- **THEN** the page fetches from `/api/articles/`, `/api/articles/popular/`, and `/api/resources/` and renders the results

#### Scenario: Loading state shown
- **WHEN** the page is fetching data from the API
- **THEN** a skeleton loader or spinner is displayed in place of article cards

#### Scenario: Error state shown
- **WHEN** the API returns an error or is unreachable
- **THEN** an error message with a retry button is displayed

### Requirement: ArticleCard component
The system SHALL provide an `ArticleCard` component that renders an article preview card with: category tag (from article category), title, excerpt truncated to 120 characters, author name, read time, and formatted date. Clicking the card SHALL navigate to `/newsletter/:slug`.

#### Scenario: Article card displays metadata
- **WHEN** an ArticleCard receives article data
- **THEN** it shows the category name styled as a teal badge, the article title as a heading, and the excerpt

#### Scenario: Card links to article detail
- **WHEN** a user clicks an ArticleCard
- **THEN** they navigate to `/newsletter/<article-slug>`

#### Scenario: Excerpt truncated
- **WHEN** an article's excerpt exceeds 120 characters
- **THEN** only the first 120 characters are displayed with an ellipsis

### Requirement: CategoryFilterBar component
The system SHALL provide a `CategoryFilterBar` component that renders pill-shaped buttons for each category fetched from the API, plus an "All" option. Clicking a category SHALL filter the article grid. The active filter SHALL be visually distinct (filled accent color).

#### Scenario: Filter bar renders categories from API
- **WHEN** the API returns categories
- **THEN** each category appears as a filter button alongside "All"

#### Scenario: Filtering updates article grid
- **WHEN** a user clicks a category filter
- **THEN** only articles in that category are shown

#### Scenario: Active filter is highlighted
- **WHEN** a filter is selected
- **THEN** that button has a filled accent background while others have outline styling

### Requirement: PopularArticles component
The system SHALL provide a `PopularArticles` component that renders a ranked list (01-06) of articles fetched from `/api/articles/popular/`, each showing rank number, category, title, metadata, and a view count badge.

#### Scenario: Popular list shows ranked articles
- **WHEN** the popular API returns 6 articles
- **THEN** they are displayed as a numbered list with rank badges

#### Scenario: Fewer than 6 popular articles
- **WHEN** the popular API returns fewer than 6 articles
- **THEN** only the available articles are displayed with their correct ranks

### Requirement: NewsletterSignup component
The system SHALL provide a `NewsletterSignup` component with an email input, honeypot field (hidden, `_hp`), and submit button. On submit, it SHALL POST to `/api/newsletter/subscribe/`. Success SHALL show a confirmation message. Duplicate email (409) SHALL show "You're already subscribed." Validation errors SHALL display inline.

#### Scenario: Successful signup shows confirmation
- **WHEN** a user enters a valid email and submits
- **THEN** the form is replaced with a success message

#### Scenario: Duplicate email shows appropriate message
- **WHEN** a 409 Conflict is received
- **THEN** the form shows "You're already subscribed!"

#### Scenario: Invalid email shows validation error
- **WHEN** a 400 Bad Request is received
- **THEN** the error message is displayed inline below the input

#### Scenario: Honeypot field is hidden
- **WHEN** the form renders
- **THEN** the `_hp` field is visually hidden and positioned off-screen

### Requirement: ResourceCard component
The system SHALL provide a `ResourceCard` component that renders a resource with: icon (based on file_type), title, description, file type badge, and a download link pointing to `file_url`.

#### Scenario: Resource card shows file type icon
- **WHEN** a ResourceCard receives a resource with `file_type: "PDF"`
- **THEN** it displays a PDF-appropriate icon

#### Scenario: Resource card links to file
- **WHEN** a user clicks the download area
- **THEN** they are taken to `file_url` in a new tab

### Requirement: ArticleDetail page
The system SHALL provide an `ArticleDetail` page at route `/newsletter/:slug`. It SHALL fetch the article from `/api/articles/:slug/` on mount. It SHALL display: category tag, title, author, date, read time, featured image placeholder (or gradient), full HTML content (sanitized), a reading progress bar at the top of the page, and a "Back to Newsletter" link.

#### Scenario: Article detail loads from API
- **WHEN** a user navigates to `/os/newsletter/from-whatsapp-to-workflows/`
- **THEN** the page fetches the article detail and renders title, content, and metadata

#### Scenario: Reading progress bar tracks scroll
- **WHEN** a user scrolls through the article
- **THEN** a horizontal progress bar at the top of the page fills proportionally to scroll progress

#### Scenario: 404 on missing article
- **WHEN** a user navigates to `/os/newsletter/nonexistent-slug/`
- **THEN** the page displays a "This article could not be found" message with a back link

### Requirement: Empty state for no filter matches
When the category filter produces zero matching articles, the system SHALL display an empty state with: an icon, "No articles found" heading, a message suggesting a different topic, and a "View All Articles" button that resets the filter to "All".

#### Scenario: Empty state on no matches
- **WHEN** a category filter returns zero articles
- **THEN** the empty state component replaces the article grid

#### Scenario: Reset clears filter
- **WHEN** a user clicks "View All Articles" in the empty state
- **THEN** the filter resets to "All" and all articles are shown
