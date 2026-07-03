/**
 * Extracts and analyzes capabilities from agents, skills, and task descriptions.
 * Provides capability-based matching for intelligent routing decisions.
 * @module orchestrate/capability-analyzer
 */

import { listCapabilities } from './capability-registry.mjs';
import { get as cacheGet, set as cacheSet, hashKey } from './cache-manager.mjs';

/**
 * Capability taxonomy — maps task intents to required capabilities.
 * @type {Array<{intent: string, patterns: RegExp[], domains: string[], roles: string[], skills: string[]}>}
 */
const TAXONOMY = [
  {
    intent: 'create-page',
    patterns: [/\b(new|add|create|build)\b.*\bpage\b/i, /\bpage\b.*\b(new|add|create|build)\b/i],
    domains: ['frontend', 'design'],
    roles: ['implementation'],
    skills: ['design-system', 'frontend-patterns'],
  },
  {
    intent: 'modify-style',
    patterns: [/\b(style|css|color|spacing|layout|typography|visual|design)\b/i],
    domains: ['design'],
    roles: ['implementation'],
    skills: ['design-system', 'make-interfaces-feel-better'],
  },
  {
    intent: 'add-component',
    patterns: [/\b(component|button|card|nav|footer|header|form|modal)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['design-system'],
  },
  {
    intent: 'improve-accessibility',
    patterns: [/\b(a11y|accessibility|wcag|aria|contrast|focus|keyboard|screen.reader)\b/i],
    domains: ['accessibility'],
    roles: ['implementation', 'review'],
    skills: ['accessibility', 'frontend-a11y'],
  },
  {
    intent: 'seo-optimization',
    patterns: [/\b(seo|meta|sitemap|og:|twitter:|structured.data|search.engine)\b/i],
    domains: ['seo'],
    roles: ['implementation', 'review'],
    skills: ['seo'],
  },
  {
    intent: 'write-tests',
    patterns: [/\b(test|e2e|playwright|spec|coverage)\b/i],
    domains: ['quality', 'testing'],
    roles: ['testing'],
    skills: ['browser-qa', 'e2e-testing'],
  },
  {
    intent: 'fix-bug',
    patterns: [/\b(fix|bug|error|broken|issue|resolve|debug)\b/i],
    domains: ['frontend', 'quality'],
    roles: ['debugging', 'implementation'],
    skills: ['coding-standards'],
  },
  {
    intent: 'deploy',
    patterns: [/\b(deploy|publish|ship|release|launch|go.live)\b/i],
    domains: ['deploy'],
    roles: ['operations'],
    skills: ['deployment-patterns'],
  },
  {
    intent: 'security-review',
    patterns: [/\b(security|vuln|xss|csrf|injection|auth|secret)\b/i],
    domains: ['security'],
    roles: ['security', 'review'],
    skills: ['security-review'],
  },
  {
    intent: 'performance',
    patterns: [/\b(perf|speed|fast|slow|optimize|bundle.size|lighthouse)\b/i],
    domains: ['performance'],
    roles: ['implementation'],
    skills: ['benchmark'],
  },
  {
    intent: 'refactor',
    patterns: [/\b(refactor|clean|improve|restructure|dedup)\b/i],
    domains: ['frontend', 'quality'],
    roles: ['refactoring'],
    skills: ['coding-standards'],
  },
  {
    intent: 'review-code',
    patterns: [/\b(review|audit|inspect|check)\b/i],
    domains: ['quality'],
    roles: ['review'],
    skills: ['verification-loop'],
  },
  {
    intent: 'document',
    patterns: [/\b(doc|readme|guide|tutorial|spec|documentation)\b/i],
    domains: ['content'],
    roles: ['documentation'],
    skills: ['article-writing'],
  },
  {
    intent: 'dark-mode',
    patterns: [/\b(dark.mode|theme|light|dark)\b/i],
    domains: ['design', 'dark-mode'],
    roles: ['implementation'],
    skills: ['design-system'],
  },
  {
    intent: 'animation',
    patterns: [/\b(animate|motion|stagger|reveal|transition|scroll)\b/i],
    domains: ['frontend', 'design'],
    roles: ['implementation'],
    skills: ['motion-foundations', 'motion-patterns'],
  },
  {
    intent: 'brand-audit',
    patterns: [/\b(brand|voice|tone|messaging|compliance)\b/i],
    domains: ['design', 'content'],
    roles: ['review'],
    skills: ['brand-voice', 'frontend-design-direction'],
  },
  // ── Global monorepo skill entries (V5) ──
  {
    intent: 'design-system-build',
    patterns: [/\b(design.system|component.library|shadcn|ui.kit|component.set|theme.system|design.token)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['design-system-master', 'ui-ux-pro-max', 'design-system'],
  },
  {
    intent: 'visual-design-direction',
    patterns: [/\b(visual.design|design.direction|aesthetic|look.and.feel|polish|premium|beautiful)\b/i],
    domains: ['design'],
    roles: ['implementation'],
    skills: ['frontend-design', 'frontend-design-direction', 'ui-ux-pro-max'],
  },
  {
    intent: 'motion-animation',
    patterns: [/\b(animate|motion|stagger|reveal|scroll.animation|layout.animation|spring|keyframe|waapi)\b/i],
    domains: ['frontend', 'design', 'animation'],
    roles: ['implementation'],
    skills: ['motion-master', 'motion-foundations', 'motion-patterns', 'motion-ui'],
  },
  {
    intent: 'a11y-audit-deep',
    patterns: [/\b(a11y|accessibility|wcag|aria|contrast|focus|keyboard|screen.reader|axe|accessible)\b/i],
    domains: ['accessibility'],
    roles: ['review', 'implementation'],
    skills: ['accessibility-pro', 'accessibility', 'frontend-a11y'],
  },
  {
    intent: 'architecture-plan',
    patterns: [/\b(architecture|project.structure|folder.structure|module|monorepo|component.architecture|scalable)\b/i],
    domains: ['frontend', 'quality'],
    roles: ['planning', 'refactoring'],
    skills: ['component-architecture', 'coding-standards'],
  },
  {
    intent: 'perf-optimize-deep',
    patterns: [/\b(perf|speed|fast|slow|optimize|bundle.size|lighthouse|core.web|ttfb|lcp|cls|fcp)\b/i],
    domains: ['performance', 'frontend', 'build'],
    roles: ['implementation'],
    skills: ['performance-optimization', 'benchmark', 'react-performance'],
  },
  {
    intent: 'landing-page',
    patterns: [/\b(landing.page|hero|cta|conversion|marketing.page|home.page)\b/i],
    domains: ['design', 'frontend', 'seo'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'motion-master', 'accessibility-pro', 'performance-optimization'],
  },
  // ── V6: /opsx-auto extended taxonomy ──
  {
    intent: 'pricing-page',
    patterns: [/\b(pricing|price|plan|subscription|cost|tier)\b.*\b(page|section|table|grid)\b/i, /\b(page|section|table)\b.*\b(pricing|price|plan|subscription)\b/i],
    domains: ['design', 'frontend', 'seo'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'accessibility-pro', 'performance-optimization'],
  },
  {
    intent: 'auth-flow',
    patterns: [/\b(auth|login|sign.*in|sign.*up|register|password|oauth)\b.*\b(flow|module|system|workflow)\b/i],
    domains: ['frontend', 'security', 'backend'],
    roles: ['implementation', 'security'],
    skills: ['security-review', 'frontend-patterns', 'accessibility-pro'],
  },
  {
    intent: 'dashboard-build',
    patterns: [/\b(dashboard|admin.panel|backend|admin.dashboard|analytics.panel)\b.*\b(build|create|implement|make)\b/i],
    domains: ['design', 'frontend', 'data'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'component-architecture', 'accessibility-pro', 'data-throughput-accelerator'],
  },
  {
    intent: 'dashboard-fix',
    patterns: [/\b(dashboard|admin.panel|backend)\b.*\b(fix|broken|bug|error|issue|problem)\b/i, /\b(fix|broken|bug)\b.*\b(dashboard|admin.panel|backend)\b/i],
    domains: ['frontend', 'quality'],
    roles: ['debugging', 'implementation'],
    skills: ['coding-standards', 'dashboard-builder'],
  },
  {
    intent: 'hero-redesign',
    patterns: [/\b(hero|header)\b.*\b(redesign|improve|fix|polish|enhance|update|refresh)\b/i, /\b(redesign|improve|fix)\b.*\b(hero|header)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'motion-master', 'accessibility-pro'],
  },
  {
    intent: 'layout-fix',
    patterns: [/\b(fix|broken|misaligned|overflow|cut.off|not.showing)\b.*\b(layout|position|spacing|margin|padding|grid|flex)\b/i],
    domains: ['frontend', 'design'],
    roles: ['debugging', 'implementation'],
    skills: ['make-interfaces-feel-better', 'design-system-master', 'coding-standards'],
  },
  {
    intent: 'ux-improve',
    patterns: [/\b(improve|enhance|polish|refine)\b.*\b(ux|user.experience|flow|journey|interaction)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'make-interfaces-feel-better', 'accessibility-pro'],
  },
  {
    intent: 'content-add',
    patterns: [/\b(add|write|create|publish)\b.*\b(content|blog|article|guide|resource|newsletter)\b.*\b(page|section|post)\b/i],
    domains: ['content', 'frontend'],
    roles: ['implementation'],
    skills: ['article-writing', 'brand-voice', 'content-engine'],
  },
  {
    intent: 'inventory-module',
    patterns: [/\b(inventory|stock|warehouse|supply.chain)\b.*\b(module|system|management|tracking)\b/i],
    domains: ['frontend', 'backend', 'data'],
    roles: ['implementation'],
    skills: ['component-architecture', 'backend-patterns', 'frontend-patterns', 'performance-optimization'],
  },
  {
    intent: 'onboarding-flow',
    patterns: [/\b(onboarding|getting.started|first.time|welcome|setup.wizard|tutorial)\b.*\b(flow|experience|page|screen)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'motion-ui', 'accessibility-pro'],
  },
  {
    intent: 'demobooking-page',
    patterns: [/\b(demo|booking|schedule|appointment|reservation|book.a.demo)\b.*\b(page|flow|system|form)\b/i],
    domains: ['design', 'frontend'],
    roles: ['implementation'],
    skills: ['ui-ux-pro-max', 'frontend-design', 'design-system-master', 'demo-flow-optimizer', 'accessibility-pro'],
  },
  {
    intent: 'form-build',
    patterns: [/\b(form|input|submit|contact.form|signup.form|lead.form)\b.*\b(build|create|add|implement|setup)\b/i],
    domains: ['frontend', 'backend', 'api'],
    roles: ['implementation'],
    skills: ['frontend-patterns', 'backend-patterns', 'accessibility-pro', 'security-review'],
  },
  {
    intent: 'responsive-fix',
    patterns: [/\b(responsive|mobile|breakpoint|viewport|media.query)\b.*\b(fix|issue|problem|broken|not.working)\b/i],
    domains: ['frontend', 'design'],
    roles: ['debugging', 'implementation'],
    skills: ['frontend-patterns', 'make-interfaces-feel-better', 'coding-standards'],
  },
  {
    intent: 'nav-improve',
    patterns: [/\b(nav|navigation|menu|header|navbar|hamburger)\b.*\b(improve|fix|update|add|change|modify|redesign|bar)\b/i, /\b(improve|fix|update)\b.*\b(nav|navigation|menu|header)\b/i],
    domains: ['design', 'frontend', 'accessibility'],
    roles: ['implementation'],
    skills: ['design-system-master', 'frontend-patterns', 'accessibility-pro'],
  },
  {
    intent: 'email-setup',
    patterns: [/\b(email|notification|newsletter|mail|sendgrid|resend|alert)\b.*\b(setup|set\s*up|configure|add|implement|create|build|send|notify)\b/i, /\b(setup|set\s*up|configure)\b.*\b(email|notification)\b/i, /\b(set\s*up)\b.*\b(email)\b/i],
    domains: ['backend', 'api'],
    roles: ['implementation'],
    skills: ['backend-patterns'],
  },
  {
    intent: 'newsletter-add',
    patterns: [/\b(newsletter|subscription|email.list|signup|subscribe)\b.*\b(add|build|create|implement|embed|set\s*up)\b/i, /\b(add|build|create)\b.*\b(newsletter|subscription)\b/i],
    domains: ['frontend', 'content', 'backend'],
    roles: ['implementation'],
    skills: ['content-engine', 'frontend-patterns', 'backend-patterns', 'newsletter-pipeline'],
  },
  {
    intent: 'test-add',
    patterns: [/\b(add|write|create)\b.*\b(test|spec|e2e|playwright|unit.test)\b/i],
    domains: ['quality', 'testing'],
    roles: ['testing'],
    skills: ['tdd-workflow', 'e2e-testing', 'browser-qa'],
  },
  {
    intent: 'api-build',
    patterns: [/\b(api|endpoint|route|handler|function|rest)\b.*\b(build|create|add|implement|setup|design|develop)\b/i, /\b(build|create|add)\b.*\b(api|endpoint|route)\b/i],
    domains: ['backend', 'api'],
    roles: ['implementation'],
    skills: ['backend-patterns', 'api-design', 'security-review'],
  },
];

/**
 * Analyze a task description and return matched intents with capability requirements.
 * @param {string} taskDescription
 * @returns {{intents: string[], domains: string[], roles: string[], skills: string[], confidence: number}}
 */
export function analyzeTask(taskDescription) {
  const cacheKey = `task-analysis:${hashKey(taskDescription)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const lower = taskDescription.toLowerCase();
  const intents = [];
  const domains = new Set();
  const roles = new Set();
  const skills = new Set();

  let totalConfidence = 0;
  let matchCount = 0;

  for (const entry of TAXONOMY) {
    const matched = entry.patterns.some((re) => re.test(lower));
    if (matched) {
      intents.push(entry.intent);
      entry.domains.forEach((d) => domains.add(d));
      entry.roles.forEach((r) => roles.add(r));
      entry.skills.forEach((s) => skills.add(s));
      totalConfidence += 1;
      matchCount++;
    }
  }

  const result = {
    intents,
    domains: [...domains],
    roles: [...roles],
    skills: [...skills],
    confidence: matchCount ? Math.min(1, totalConfidence / TAXONOMY.length) : 0,
  };

  cacheSet(cacheKey, result, { ttl: 300000 });
  return result;
}

/**
 * Score a skill against task intents and domains.
 * @param {object} skill - Skill object with domains, keywords, triggers
 * @param {string[]} requiredDomains
 * @param {string[]} requiredRoles
 * @returns {number}
 */
export function scoreSkill(skill, requiredDomains, _requiredRoles) {
  let score = 0;
  const skillDomains = skill.domains || [];

  // Domain overlap
  for (const d of requiredDomains) {
    if (skillDomains.includes(d)) score += 2;
  }

  // Keyword overlap with task intents (via triggers)
  if (skill.triggers) {
    for (const t of skill.triggers) {
      for (const d of requiredDomains) {
        if (t.toLowerCase().includes(d)) score += 1;
      }
    }
  }

  // Description relevance
  const desc = (skill.description || '').toLowerCase();
  for (const d of requiredDomains) {
    if (desc.includes(d)) score += 1;
  }

  return score;
}

/**
 * Score an agent against task requirements.
 * @param {object} agent - Agent object with capabilities.roles
 * @param {string[]} requiredRoles
 * @param {string[]} requiredDomains
 * @returns {number}
 */
export function scoreAgent(agent, requiredRoles, requiredDomains) {
  let score = 0;
  const agentRoles = agent.capabilities?.roles || [];
  const desc = (agent.description || '').toLowerCase();

  // Role overlap
  for (const r of requiredRoles) {
    if (agentRoles.includes(r)) score += 3;
    if (desc.includes(r)) score += 1;
  }

  // Domain relevance
  for (const d of requiredDomains) {
    if (desc.includes(d)) score += 1;
  }

  return score;
}

/**
 * Find the best matching skills for a task, sorted by relevance.
 * @param {string} taskDescription
 * @param {number} [limit=5]
 * @returns {string[]}
 */
export function findBestSkills(taskDescription, limit = 5) {
  const analysis = analyzeTask(taskDescription);
  if (!analysis.confidence) return ['coding-standards'];

  const allSkills = listCapabilities('skill');
  if (!allSkills.length) return analysis.skills.length ? analysis.skills : ['coding-standards'];

  const scored = allSkills
    .map((s) => ({ name: s.name, score: scoreSkill(s, analysis.domains, analysis.roles) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length) return scored.slice(0, limit).map((s) => s.name);

  return analysis.skills.length ? analysis.skills : ['coding-standards'];
}

/**
 * Find the best matching agents for a task, sorted by relevance.
 * @param {string} taskDescription
 * @param {number} [limit=3]
 * @returns {string[]}
 */
export function findBestAgents(taskDescription, limit = 3) {
  const analysis = analyzeTask(taskDescription);
  if (!analysis.confidence) return ['explore'];

  const allAgents = listCapabilities('agent');
  if (!allAgents.length) return ['tdd-guide'];

  const scored = allAgents
    .map((a) => ({ name: a.name, score: scoreAgent(a, analysis.roles, analysis.domains) }))
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length ? scored.slice(0, limit).map((a) => a.name) : ['tdd-guide'];
}
