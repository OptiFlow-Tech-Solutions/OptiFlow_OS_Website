## Context

The current build pipeline (`scripts/assemble.mjs`) already supports 12 placeholders (`{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}`, etc.) but only 4 of 12 source pages use them for `<title>` and `<meta name="description">`. The other 8 pages hardcode both values. The assemble script also injects JSON-LD (Organization, WebSite, FAQPage), manifest, theme-color, and apple-touch-icon at build time. Validation checks link integrity, hardcoded colors, dark mode coverage, and basic SEO (title presence, description presence, H1 presence, OG tag presence).

Gaps: no canonical URL injection, no `og:url`/`og:site_name`/`og:locale`, no robots meta, no BreadcrumbList JSON-LD, no Article schema on newsletter, no validation of description length or structured data presence.

## Goals / Non-Goals

**Goals:**
- All 12 pages use `{{PAGE_TITLE}}` and `{{PAGE_DESCRIPTION}}` as single source of truth
- Build-time injection of canonical URLs, `og:url`, `og:site_name`, `og:locale`, `og:image:width`, `og:image:height`, robots meta
- Build-time injection of BreadcrumbList JSON-LD on every page
- Build-time injection of Article JSON-LD on newsletter page
- Build-time injection of `twitter:image` and `twitter:image:alt`
- Validate canonical presence, description length (120-160), structured data, og:url

**Non-Goals:**
- Changing any actual description text in site.json
- Adding new pages
- Changing page URLs or navigation structure
- Performance/Lighthouse optimization
- Image alt text audit
- Mobile usability

## Decisions

### Decision 1: Build-time injection over source-page hardcoding

**Rationale**: The build pipeline already injects 6+ items at assembly time (manifest, theme-color, apple-touch-icon, JSON-LD). Adding canonical, og:url, og:site_name, og:locale, og:image dimensions, twitter:image, robots meta in the same build step keeps the pattern consistent. Source pages stay lean.

**Alternatives considered**:
- Inject via `<head>` after page assembly (like JSON-LD): Works but mixes concerns — canonical and OG are HTML not script
- Source page hardcoding: Duplicates URLs across 12 files, breaks DRY

### Decision 2: Canonical URL derivation from site.json page.file field

**Rationale**: `site.json` already defines every page's file path (`index.html`, `features/index.html`, etc.). The build script already derives page URLs from this field for sitemap.xml and JSON-LD. Reuse the same derivation.

```
index.html              → https://optiflow.in/
features/index.html     → https://optiflow.in/features/
newsletter/index.html   → https://optiflow.in/newsletter/
```

### Decision 3: Robots meta set to "index, follow" for all pages

**Rationale**: All 12 pages are public, indexed content. No private/admin pages exist. Robots.txt already allows all crawlers. Explicit robots meta reinforces the intent.

### Decision 4: BreadcrumbList auto-generated from URL path segments

**Rationale**: A page's URL path cleanly maps to its position in the site hierarchy.

```
/newsletter/ → [Home, Resources, Newsletter]
/features/   → [Home, Features]
```

The build script parses each page's URL path into segments, capitalizes the segment, and generates the BreadcrumbList item array.

### Decision 5: OG description must match meta description

**Rationale**: Currently 8 pages have different OG descriptions than their meta descriptions. This sends conflicting signals to scrapers. After switching to `{{PAGE_DESCRIPTION}}`, both `<meta name="description">` and `<meta property="og:description">` will use the same value from site.json.

## Risks / Trade-offs

- **Build-time injection delay**: Adding 6+ new injections per page assembly. 12 pages × 6 injections = minimal impact (single-digit ms in Node.js)
- **Placeholder migration**: If a new page is added before this change completes, it may hardcode values and miss the build-time injections. Mitigation: validate script will catch missing placeholder usage
- **Breadcrumb auto-generation**: For `/product-overview/features/` would produce [Home, Product Overview, Features] which is correct. No edge cases in current 12-page structure
- **Article schema on newsletter**: Newsletter page has no author/byline exposed. Mitigation: use Organization as publisher
