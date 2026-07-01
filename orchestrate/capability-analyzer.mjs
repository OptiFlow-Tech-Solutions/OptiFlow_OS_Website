/**
 * Extracts and analyzes capabilities from agents, skills, and task descriptions.
 * Provides capability-based matching for intelligent routing decisions.
 * @module orchestrate/capability-analyzer
 */

import { listCapabilities } from './capability-registry.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

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
];

/**
 * Analyze a task description and return matched intents with capability requirements.
 * @param {string} taskDescription
 * @returns {{intents: string[], domains: string[], roles: string[], skills: string[], confidence: number}}
 */
export function analyzeTask(taskDescription) {
  const cacheKey = `task-analysis:${taskDescription.slice(0, 80)}`;
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
