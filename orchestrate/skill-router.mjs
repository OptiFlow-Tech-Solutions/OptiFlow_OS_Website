/**
 * V4: Capability-based skill routing.
 * Routes tasks to skills using capability analyzer for semantic matching,
 * falls back to keyword-based rules.
 * @module orchestrate/skill-router
 */

import { findBestSkills } from './capability-analyzer.mjs';
import { findSkillsByDomain } from './capability-registry.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const DEFAULT_SKILLS = Object.freeze(['coding-standards']);

/** Legacy keyword-based rules as fallback */
const RULES = [
  { keywords: ['page'], andKeywords: ['new', 'add', 'create'], skills: ['design-system', 'frontend-patterns'] },
  { keywords: ['component', 'button', 'card', 'nav'], skills: ['design-system'] },
  { keywords: ['style', 'visual', 'spacing', 'layout'], skills: ['make-interfaces-feel-better'] },
  { keywords: ['accessibility', 'a11y', 'wcag', 'aria'], skills: ['frontend-a11y', 'accessibility'] },
  { keywords: ['seo', 'meta', 'og tags', 'sitemap'], skills: ['seo'] },
  { keywords: ['test', 'qa', 'browser', 'playwright', 'e2e'], skills: ['browser-qa', 'e2e-testing'] },
  { keywords: ['performance', 'speed', 'bundle', 'fast'], skills: ['benchmark'] },
  { keywords: ['build', 'compile', 'assemble'], skills: ['build-error-resolver'] },
  { keywords: ['security', 'xss', 'csrf'], skills: ['security-review'] },
  { keywords: ['deploy', 'publish', 'ship'], skills: ['deployment-patterns'] },
  { keywords: ['content', 'copy', 'writing', 'text'], skills: ['article-writing'] },
  { keywords: ['git', 'commit', 'branch'], skills: ['git-workflow'] },
  { keywords: ['refactor', 'cleanup', 'deduplicate'], skills: ['coding-standards'] },
  { keywords: ['dark mode', 'theme'], skills: ['design-system'] },
  { keywords: ['responsive', 'mobile'], skills: ['frontend-patterns'] },
  { keywords: ['motion', 'animation', 'stagger', 'reveal', 'transition'], skills: ['motion-foundations', 'motion-patterns', 'motion-ui'] },
  { keywords: ['design direction', 'visual quality', 'premium', 'polish'], skills: ['frontend-design-direction'] },
  { keywords: ['brand voice', 'copy', 'tone', 'messaging', 'writing style'], skills: ['brand-voice'] },
  { keywords: ['lint', 'prettier', 'format', 'code quality'], skills: ['plankton-code-quality'] },
  { keywords: ['production', 'launch', 'go-live', 'pre-launch'], skills: ['production-audit'] },
  { keywords: ['canary', 'smoke test', 'health check', 'post-deploy'], skills: ['canary-watch'] },
  { keywords: ['verify', 'verification', 'pre-release check'], skills: ['verification-loop'] },
  { keywords: ['tour', 'onboarding', 'explain architecture'], skills: ['code-tour'] },
  { keywords: ['cache', 'incremental build', 'build speed'], skills: ['content-hash-cache-pattern'] },
];

const DOMAIN_SKILLS = Object.freeze({
  design: ['design-system', 'make-interfaces-feel-better', 'frontend-design-direction'],
  frontend: ['frontend-patterns', 'frontend-a11y'],
  build: ['build-error-resolver'],
  accessibility: ['accessibility', 'frontend-a11y'],
  seo: ['seo'],
  content: ['article-writing', 'brand-voice'],
  quality: ['tdd-workflow', 'verification-loop', 'eval-harness'],
  security: ['security-review'],
});

/**
 * Route by spec domains. V4: uses capability-based matching when registry is available.
 * @param {Array<{specName: string, domains?: string[]}>} affectedSpecs
 * @returns {string[]}
 */
export function routeBySpecs(affectedSpecs) {
  const domains = [...new Set(affectedSpecs.flatMap((s) => s.domains || []))];
  if (!domains.length) return [...DEFAULT_SKILLS];

  // Try capability-based matching first
  const matched = findSkillsByDomain(domains);
  if (matched.length) return matched.map((s) => s.name);

  // Fallback to hardcoded domain map
  const skills = new Set();
  for (const domain of domains) {
    const mapped = DOMAIN_SKILLS[domain];
    if (mapped) mapped.forEach((s) => skills.add(s));
  }
  return skills.size > 0 ? [...skills] : [...DEFAULT_SKILLS];
}

/**
 * Route a task description to relevant ECC skills.
 * V4: Uses capability analyzer for intelligent matching, falls back to keyword rules.
 * @param {string} taskDescription
 * @returns {string[]}
 */
export function routeTask(taskDescription) {
  const cacheKey = `skill-route:${taskDescription.slice(0, 80)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Primary: capability-based matching
  try {
    const best = findBestSkills(taskDescription, 5);
    if (best.length > 0 && best[0] !== 'coding-standards') {
      cacheSet(cacheKey, best, { ttl: 300000 });
      return best;
    }
  } catch { /* registry may not be built yet — use fallback */ }

  // Fallback: keyword rules
  const lower = taskDescription.toLowerCase();
  const matches = new Set();
  for (const { keywords, andKeywords, skills } of RULES) {
    const kwMatch = keywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower));
    const andMatch = !andKeywords || andKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower));
    if (kwMatch && andMatch) for (const skill of skills) matches.add(skill);
  }

  const result = matches.size > 0 ? [...matches] : [...DEFAULT_SKILLS];
  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}
