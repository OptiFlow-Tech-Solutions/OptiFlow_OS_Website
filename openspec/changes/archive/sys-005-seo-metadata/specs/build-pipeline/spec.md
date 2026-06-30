## MODIFIED Requirements

### Requirement: SEO Meta Injection

The build pipeline SHALL inject canonical URLs, OpenGraph URL/site name/locale/dimensions, Twitter image, and robots meta tags into every assembled page.

#### Scenario: Canonical URL injection

- **GIVEN** a page with file path `features/index.html` in site.json
- **WHEN** the build pipeline assembles the page
- **THEN** `<link rel="canonical" href="https://optiflow.in/features/">` SHALL be injected into `<head>`

#### Scenario: OG URL and site name injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta property="og:url" content="https://optiflow.in/<path>/">` SHALL be injected
- **AND** `<meta property="og:site_name" content="OptiFlow OS">` SHALL be injected
- **AND** `<meta property="og:locale" content="en_IN">` SHALL be injected
- **AND** `<meta property="og:image:width" content="512">` SHALL be injected
- **AND** `<meta property="og:image:height" content="512">` SHALL be injected

#### Scenario: Robots meta injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta name="robots" content="index, follow">` SHALL be injected into `<head>`

#### Scenario: Twitter image injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta name="twitter:image" content="/assets/img/OptiFlow.Logo.png">` SHALL be injected
- **AND** `<meta name="twitter:image:alt" content="OptiFlow OS Logo">` SHALL be injected

### Requirement: BreadcrumbList Structured Data Injection

The build pipeline SHALL inject BreadcrumbList JSON-LD structured data into every assembled page.

#### Scenario: BreadcrumbList generation

- **GIVEN** a page at `/problem-solutions/`
- **WHEN** the build pipeline injects JSON-LD
- **THEN** a BreadcrumbList schema SHALL be present with items for Home and Solutions

### Requirement: Article Structured Data on Newsletter

The build pipeline SHALL inject Article JSON-LD structured data into the newsletter page.

#### Scenario: Article schema on newsletter

- **GIVEN** the newsletter page
- **WHEN** the build pipeline injects JSON-LD
- **THEN** an Article schema SHALL be present with headline, description, publisher, and datePublished fields
