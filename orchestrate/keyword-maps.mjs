/**
 * Shared keyword → spec resolution maps.
 * Used by feature-router and spec-indexer to map natural-language feature names
 * to OpenSpec capability spec directories.
 * @module orchestrate/keyword-maps
 */

export const FEATURE_TO_SPEC = Object.freeze({
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
  'home page': ['marketing-pages'],
  'home': ['marketing-pages'],
  'problem': ['marketing-pages'],
  'solutions': ['marketing-pages'],
  'product overview': ['marketing-pages'],
  'feature showcase': ['marketing-pages'],
  'features': ['marketing-pages'],
  'competitive': ['marketing-pages'],
  'positioning': ['marketing-pages'],
  'why optiflow': ['marketing-pages'],
  'pricing': ['marketing-pages'],
  'plans': ['marketing-pages'],
  'newsletter': ['marketing-pages'],
  'content': ['marketing-pages'],
  'faq': ['marketing-pages'],
  'self-service': ['marketing-pages'],
  'demo booking': ['marketing-pages'],
  'demo': ['marketing-pages'],
  'contact': ['marketing-pages'],
  'support': ['marketing-pages'],
  'privacy': ['marketing-pages'],
  'terms': ['marketing-pages'],
  'conditions': ['marketing-pages'],
  'form processing': ['platform-api'],
  'api': ['platform-api'],
  'admin auth': ['platform-auth'],
  'authentication': ['platform-auth'],
  'admin dashboard': ['platform-auth', 'platform-database'],
  'admin': ['platform-auth'],
  'dashboard': ['platform-auth'],
  'email': ['platform-email'],
  'notifications': ['platform-email'],
  'database': ['platform-database'],
  'data management': ['platform-database'],
  'monitoring': ['platform-monitoring'],
  'observability': ['platform-monitoring'],
  'health': ['platform-monitoring'],
  'accessibility': ['accessibility'],
  'testing': ['build-pipeline'],
  'code quality': ['build-pipeline'],
  'performance': ['build-pipeline', 'platform-monitoring'],
  'orchestration': ['orchestration-engine'],
  'engine': ['orchestration-engine'],
  'git hooks': ['build-pipeline'],
  'hooks': ['build-pipeline'],
  'automation': ['build-pipeline'],
  'git': ['build-pipeline'],
});

/**
 * Map a natural-language feature name to spec directory names.
 * @param {string} nameLower - lowercase feature name
 * @returns {string[]}
 */
export function resolveSpecsForFeature(nameLower) {
  return FEATURE_TO_SPEC[nameLower] || [];
}
