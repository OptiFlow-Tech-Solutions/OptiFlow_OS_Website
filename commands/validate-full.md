# /validate-full
Run the complete validation pipeline (L1-L7).

## Checks
L1: HTML syntax validation
L2: Data consistency (phone, email, location match site.json)
L3: Link checker (all internal links resolve)
L4: Design audit (hardcoded colors, CSS var compliance)
L5: SEO audit (titles, meta descriptions, OG tags, h1)
L6: Accessibility scan (contrast, ARIA, keyboard nav)
L7: Performance budget (page weight, request count)

## Agent
Delegates to browser-qa for visual checks and a11y for accessibility.
