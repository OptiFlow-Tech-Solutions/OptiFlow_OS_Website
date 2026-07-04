/**
 * Shared keyword → spec resolution maps.
 * Used by feature-router and spec-indexer to map natural-language feature names
 * to OpenSpec capability spec directories.
 *
 * V5.0: Full coverage for all 79 features across 13 prefixes.
 * @module orchestrate/keyword-maps
 */

export const FEATURE_TO_SPEC = Object.freeze({
  // ── SYS features ──
  'design system': ['design-system'],
  'theming': ['design-system', 'dark-mode'],
  'navigation': ['shared-components'],
  'structure': ['shared-components'],
  'runtime': ['shared-components'],
  'interactive': ['shared-components'],
  'build': ['build-pipeline'],
  'deployment': ['build-pipeline'],
  'pipeline': ['build-pipeline'],
  'seo': ['seo'],
  'metadata': ['seo'],

  // ── PAGE features ──
  'home page': ['marketing-pages'],
  'home': ['marketing-pages'],
  'homepage': ['marketing-pages'],
  'problem': ['marketing-pages'],
  'solutions': ['marketing-pages'],
  'product overview': ['marketing-pages'],
  'product': ['marketing-pages'],
  'feature showcase': ['marketing-pages', 'feature-showcase-page'],
  'features': ['marketing-pages'],
  'competitive': ['marketing-pages', 'competitive-positioning-page'],
  'positioning': ['marketing-pages', 'competitive-positioning-page'],
  'why choose': ['marketing-pages', 'competitive-positioning-page'],
  'pricing': ['marketing-pages'],
  'plans': ['marketing-pages'],
  'pricing page': ['marketing-pages'],
  'newsletter': ['marketing-pages'],
  'content': ['marketing-pages'],
  'faq': ['marketing-pages', 'faq-self-service'],
  'self-service': ['marketing-pages', 'faq-self-service'],
  'faq page': ['faq-self-service'],
  'help page': ['faq-self-service'],

  // ── LEAD features ──
  'demo booking': ['lead-capture', 'marketing-pages'],
  'demo': ['lead-capture', 'marketing-pages'],
  'booking': ['lead-capture'],
  'schedule demo': ['lead-capture'],
  'appointment': ['lead-capture'],
  'contact': ['contact-support', 'marketing-pages'],
  'support': ['contact-support', 'marketing-pages'],
  'contact page': ['contact-support'],
  'contact form': ['contact-support'],

  // ── LEGAL features ──
  'privacy': ['legal-pages', 'marketing-pages'],
  'privacy policy': ['legal-pages'],
  'terms': ['legal-pages', 'marketing-pages'],
  'conditions': ['legal-pages', 'marketing-pages'],
  'tos': ['legal-pages'],

  // ── API features ──
  'form processing': ['form-processing-api'],
  'form api': ['form-processing-api'],
  'form submission': ['form-processing-api'],
  'api': ['form-processing-api'],
  'admin auth': ['admin-authentication'],
  'authentication': ['admin-authentication'],
  'admin login': ['admin-authentication'],
  'admin dashboard': ['admin-authentication', 'database-data-management'],
  'admin panel': ['admin-authentication'],
  'admin': ['admin-authentication'],
  'email': ['email-notifications'],
  'notifications': ['email-notifications'],
  'send email': ['email-notifications'],
  'database': ['database-data-management'],
  'data management': ['database-data-management'],
  'kv store': ['database-data-management'],
  'storage': ['database-data-management'],
  'monitoring': ['platform-monitoring'],
  'observability': ['platform-monitoring'],
  'health check': ['platform-monitoring'],
  'logging': ['platform-monitoring'],

  // ── QA features ──
  'accessibility': ['accessibility'],
  'a11y': ['accessibility'],
  'wcag': ['accessibility'],
  'testing': ['testing-suite', 'build-pipeline'],
  'test suite': ['testing-suite'],
  'e2e test': ['testing-suite'],
  'playwright': ['testing-suite'],
  'code quality': ['code-quality-pipeline', 'build-pipeline'],
  'performance': ['performance-optimization', 'build-pipeline', 'platform-monitoring'],
  'optimization': ['performance-optimization'],

  // ── OPS features ──
  'orchestration': ['orchestration-engine'],
  'orchestrate': ['orchestration-engine'],
  'engine': ['orchestration-engine'],
  'git hooks': ['git-hooks', 'build-pipeline'],
  'hooks': ['git-hooks', 'build-pipeline'],
  'automation': ['git-hooks', 'build-pipeline'],
  'git': ['git-hooks'],

  // ── UI features ──
  'motion': ['design-system'],
  'animation': ['design-system'],
  'page transition': ['design-system'],
  'skeleton': ['skeleton-loading'],
  'loading': ['skeleton-loading'],
  'empty state': ['skeleton-loading'],
  'shimmer': ['skeleton-loading'],
  'toast': ['shared-components'],
  'notification': ['email-notifications'],
  'alert': ['shared-components'],
  'snackbar': ['shared-components'],
  'cookie': ['cookie-consent'],
  'consent': ['cookie-consent'],
  'gdpr': ['cookie-consent'],
  'privacy compliance': ['cookie-consent'],
  'image optimization': ['performance-optimization', 'build-pipeline'],
  'webp': ['performance-optimization'],
  'lazy loading': ['performance-optimization'],
  'service worker': ['build-pipeline'],
  'pwa': ['build-pipeline'],
  'offline': ['build-pipeline'],
  'product demo': ['marketing-pages'],
  'mockups': ['marketing-pages'],
  'site search': ['shared-components'],
  'search': ['shared-components'],
  'error boundary': ['shared-components'],
  'error recovery': ['shared-components'],
  'hero motion': ['design-system'],
  'hero animation': ['design-system'],
  'scroll animation': ['design-system'],
  'scroll trigger': ['design-system'],
  'card interaction': ['design-system'],
  'component polish': ['design-system'],
  'micro-interaction': ['design-system'],
  'content freshness': ['marketing-pages'],
  'last updated': ['marketing-pages'],

  // ── PERF features ──
  'critical css': ['performance-optimization', 'build-pipeline'],
  'above the fold': ['performance-optimization'],
  'css extraction': ['performance-optimization'],
  'asset caching': ['build-pipeline', 'performance-optimization'],
  'cdn': ['build-pipeline'],
  'cache strategy': ['build-pipeline', 'performance-optimization'],
  'font self-hosting': ['design-system', 'performance-optimization'],
  'font subsetting': ['design-system'],
  'lighthouse ci': ['performance-optimization', 'build-pipeline'],
  'lighthouse': ['performance-optimization'],
  'perf audit': ['performance-optimization'],

  // ── SEC features ──
  'csrf': ['security-review-needed'],
  'csrf protection': ['security-review-needed'],
  'input sanitization': ['security-review-needed', 'form-processing-api'],
  'xss': ['security-review-needed', 'form-processing-api'],
  'xss prevention': ['security-review-needed'],
  'sri hash': ['security-review-needed', 'build-pipeline'],
  'sri': ['security-review-needed'],
  'subresource integrity': ['security-review-needed'],
  'csp': ['security-review-needed'],
  'csp reporting': ['security-review-needed', 'platform-monitoring'],
  'content security policy': ['security-review-needed'],

  // ── TEST features ──
  'unit test': ['testing-suite'],
  'unit testing': ['testing-suite'],
  'jest': ['testing-suite'],
  'vitest': ['testing-suite'],
  'api test': ['testing-suite'],
  'integration test': ['testing-suite'],
  'visual regression': ['testing-suite'],
  'visual test': ['testing-suite'],
  'screenshot test': ['testing-suite'],
  'manual audit': ['accessibility'],
  'accessibility audit': ['accessibility'],
  'screen reader': ['accessibility'],
  'performance profiling': ['performance-optimization'],
  'profiling': ['performance-optimization'],
  'bundle analysis': ['performance-optimization'],

  // ── DOCS features ──
  'api documentation': ['shared-components'],
  'openapi': ['shared-components'],
  'architecture decision': ['shared-components'],
  'adr': ['shared-components'],
  'changelog': ['shared-components'],
  'deployment runbook': ['build-pipeline'],
  'runbook': ['build-pipeline'],
  'component catalog': ['design-system', 'shared-components'],
  'storybook': ['design-system'],

  // ── CONTENT features ──
  'content pipeline': ['marketing-pages'],
  'case study': ['marketing-pages'],
  'customer story': ['marketing-pages'],
  'testimonial': ['marketing-pages'],
  'product roadmap': ['marketing-pages'],
  'release notes': ['marketing-pages'],
  'blog': ['marketing-pages'],
  'blog engine': ['marketing-pages'],
  'rss': ['marketing-pages'],
});

/**
 * Map a natural-language feature name to spec directory names.
 * Falls back to token-level matching if no direct keyword match.
 * @param {string} nameLower - lowercase feature name
 * @returns {string[]}
 */
export function resolveSpecsForFeature(nameLower) {
  const direct = FEATURE_TO_SPEC[nameLower];
  if (direct) return direct;

  // Token-level fallback: check individual words
  const tokens = nameLower.split(/[\s&]+/).filter((t) => t.length > 2);
  for (const token of tokens) {
    const match = FEATURE_TO_SPEC[token];
    if (match) return match;
  }

  return [];
}
