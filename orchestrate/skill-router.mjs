/**
 * V5: Capability-based skill routing with multi-skill composition.
 * Routes tasks to skills using capability analyzer for semantic matching,
 * supports composing multiple skills for complex tasks, falls back to keyword rules.
 * @module orchestrate/skill-router
 */

import { findBestSkills } from './capability-analyzer.mjs';
import { findSkillsByDomain } from './capability-registry.mjs';
import { get as cacheGet, set as cacheSet, hashKey } from './cache-manager.mjs';

const DEFAULT_SKILLS = Object.freeze(['coding-standards']);

/**
 * Multi-skill composition rules for common task patterns.
 * When a task matches a pattern, ALL listed skills are included.
 * @type {Map<RegExp, string[]>}
 */
// ponytail: single-pass ordered rules; first match wins
const COMPOSITIONS = [
  { pattern: /\b(landing\s*page|conversion\s*page|marketing\s*page)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'motion-master', 'accessibility-pro', 'performance-optimization'] },
  { pattern: /\b(component\s*library|ui\s*kit|component\s*set|design\s*system)\b.*(?:build|create|setup)/i,
    skills: ['design-system-master', 'component-architecture', 'accessibility-pro'] },
  { pattern: /\b(?:add|build|create|implement|use)\b.*\b(?:animation|motion|stagger|reveal|page\s*transition|keyframe)\b|\b(?:animation|motion|stagger|reveal|transition)\b.*\b(?:add|build|create|implement|use)\b/i,
    skills: ['motion-master', 'frontend-design'] },
  { pattern: /\b(accessibility\s*audit|a11y\s*review|wcag\s*check)\b/i,
    skills: ['accessibility-pro'] },
  { pattern: /\b(performance\s*audit|speed\s*up|bundle\s*analyze|lighthouse)\b/i,
    skills: ['performance-optimization'] },
  { pattern: /\b(design\s*review|visual\s*review|brand\s*review)\b/i,
    skills: ['frontend-design', 'ui-ux-pro-max', 'design-system-master'] },
  { pattern: /\b(component|button|card|modal|form|table).*(?:architecture|structure|pattern|best\s*practice)\b/i,
    skills: ['component-architecture', 'design-system-master'] },
  { pattern: /\b(build\s*.*new|create\s*.*new|from\s*scratch)\b.*\b(page|website|site)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'motion-master', 'accessibility-pro', 'component-architecture', 'performance-optimization'] },
  // ── V6: /opsx-auto extended composition rules ──
  { pattern: /\b(fix|improve|redesign|refresh|polish|update)\b.*\b(hero|header)\b.*\b(section|area|banner)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'motion-master', 'accessibility-pro'] },
  { pattern: /\b(pricing|price|plan)\b.*\b(page|section|table|grid)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'accessibility-pro', 'performance-optimization'] },
  { pattern: /\b(auth|login|sign)\b.*\b(flow|module|system|workflow)\b/i,
    skills: ['security-review', 'frontend-patterns', 'accessibility-pro'] },
  { pattern: /\b(dashboard|admin)\b.*\b(build|create|implement|fix|update)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'component-architecture', 'accessibility-pro', 'dashboard-builder'] },
  { pattern: /\b(demo|booking|schedule|appointment)\b.*\b(page|flow|system|form)\b/i,
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'demo-flow-optimizer', 'accessibility-pro'] },
  { pattern: /\b(newsletter|subscription|email.list)\b.*\b(add|build|create|implement|setup)\b/i,
    skills: ['content-engine', 'frontend-patterns', 'backend-patterns', 'newsletter-pipeline'] },
  { pattern: /\b(inventory|stock|warehouse|supply)\b.*\b(module|system|management)\b/i,
    skills: ['component-architecture', 'backend-patterns', 'frontend-patterns', 'performance-optimization'] },
  { pattern: /\b(fix|broken|misaligned)\b.*\b(layout|spacing|overflow)\b/i,
    skills: ['make-interfaces-feel-better', 'design-system-master', 'coding-standards'] },
  { pattern: /\b(improve|enhance|polish)\b.*\b(nav|navigation|menu)\b/i,
    skills: ['design-system-master', 'frontend-patterns', 'accessibility-pro'] },
  { pattern: /\b(email|notification|alert)\b.*\b(setup|configure|implement|send)\b/i,
    skills: ['backend-patterns', 'security-review'] },
  { pattern: /\b(api|endpoint|route)\b.*\b(build|create|add|implement)\b/i,
    skills: ['backend-patterns', 'api-design', 'security-review'] },
  { pattern: /\b(setup|set\s*up|configure)\b.*\b(email|notification)\b/i,
    skills: ['backend-patterns', 'security-review'] },
];

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
  // V5: Global monorepo skill aliases
  { keywords: ['design system', 'shadcn', 'component library', 'radix'], skills: ['design-system-master', 'design-system'] },
  { keywords: ['architecture', 'project structure', 'bulletproof', 'module pattern'], skills: ['component-architecture'] },
  { keywords: ['bundle size', 'lighthouse', 'core web vitals', 'ttfb', 'lcp'], skills: ['performance-optimization'] },
];

const DOMAIN_SKILLS = Object.freeze({
  design: ['design-system', 'make-interfaces-feel-better', 'frontend-design-direction', 'design-system-master', 'ui-ux-pro-max', 'frontend-design'],
  frontend: ['frontend-patterns', 'frontend-a11y', 'component-architecture', 'motion-master'],
  build: ['build-error-resolver', 'performance-optimization'],
  accessibility: ['accessibility', 'frontend-a11y', 'accessibility-pro'],
  seo: ['seo'],
  content: ['article-writing', 'brand-voice'],
  quality: ['tdd-workflow', 'verification-loop', 'eval-harness', 'component-architecture'],
  security: ['security-review'],
  animation: ['motion-master', 'motion-foundations', 'motion-patterns', 'motion-ui'],
  performance: ['performance-optimization', 'benchmark', 'react-performance'],
});

/**
 * Compose skills from a task description using multi-skill composition rules.
 * @param {string} taskDescription
 * @returns {string[]|null} Composed skill list, or null if no composition matched.
 */
export function composeSkills(taskDescription) {
  const lower = taskDescription.toLowerCase();
  for (const { pattern, skills } of COMPOSITIONS) {
    if (pattern.test(lower)) return skills;
  }
  return null;
}

/**
 * Route by spec domains. V5: uses composition + capability-based matching when registry available.
 * @param {Array<{specName: string, domains?: string[]}>} affectedSpecs
 * @returns {string[]}
 */
export function routeBySpecs(affectedSpecs) {
  const domains = [...new Set(affectedSpecs.flatMap((s) => s.domains || []))];
  if (!domains.length) return [...DEFAULT_SKILLS];

  const matched = findSkillsByDomain(domains);
  if (matched.length) return matched.map((s) => s.name);

  const skills = new Set();
  for (const domain of domains) {
    const mapped = DOMAIN_SKILLS[domain];
    if (mapped) mapped.forEach((s) => skills.add(s));
  }
  return skills.size > 0 ? [...skills] : [...DEFAULT_SKILLS];
}

/**
 * Route a task description to relevant ECC skills.
 * V5: Applies composition rules first, then capability matching, then keyword fallback.
 * @param {string} taskDescription
 * @returns {string[]}
 */
export function routeTask(taskDescription) {
  const cacheKey = `skill-route:${hashKey(taskDescription)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Step 1: Check multi-skill composition rules
  const composed = composeSkills(taskDescription);
  if (composed) {
    cacheSet(cacheKey, composed, { ttl: 300000 });
    return composed;
  }

  // Step 2: Capability-based matching
  try {
    const best = findBestSkills(taskDescription, 8);
    if (best.length > 0 && best[0] !== 'coding-standards') {
      cacheSet(cacheKey, best, { ttl: 300000 });
      return best;
    }
  } catch { /* registry may not be built yet — use fallback */ }

  // Step 3: Keyword rules
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
