/**
 * Skill Evolution — runtime pattern tracking and skill creation.
 * Records task→skill resolution patterns. When a pattern is used 3+ times
 * with success, auto-generates a reusable SKILL.md.
 * @module orchestrate/skill-evolution
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { namespace as cacheNS } from './cache-manager.mjs';
import { logEvent } from './audit-log.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const TRACKER_PATH = resolve(__dir, '.state', 'skill-patterns.json');
const PROJECT_SKILLS = resolve(__dir, '..', '.opencode', 'skills');
const PATTERN_THRESHOLD = 3;

const cache = cacheNS('skill-evolution');

/** @type {Record<string, {pattern: string, domains: string[], skills: string[], success: boolean, count: number, firstSeen: string, lastSeen: string}>} */
let patterns = {};

function loadPatterns() {
  if (existsSync(TRACKER_PATH)) {
    try { patterns = JSON.parse(readFileSync(TRACKER_PATH, 'utf-8')); } catch { patterns = {}; }
  }
}

function savePatterns() {
  const dir = dirname(TRACKER_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(TRACKER_PATH, JSON.stringify(patterns, null, 2), 'utf-8');
}

/**
 * Record a task→skill resolution for pattern learning.
 * @param {string} taskDescription
 * @param {string[]} domains
 * @param {string[]} skillsUsed
 * @param {boolean} success
 */
export function recordPattern(taskDescription, domains = [], skillsUsed = [], success = true) {
  loadPatterns();
  const key = taskDescription.toLowerCase().replace(/[^a-z0-9\s-]/g, '').slice(0, 60);

  if (patterns[key]) {
    patterns[key].count++;
    patterns[key].success = patterns[key].success && success;
    patterns[key].lastSeen = new Date().toISOString();
    patterns[key].skills = [...new Set([...patterns[key].skills, ...skillsUsed])];
  } else {
    patterns[key] = {
      pattern: taskDescription,
      domains,
      skills: skillsUsed,
      success,
      count: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
  }

  savePatterns();
  cache.set(key, patterns[key], { ttl: 600000 });
}

/**
 * Check if any pattern is ready to become a skill (seen 3+ times).
 * @returns {Array<{pattern: string, domains: string[], skills: string[], count: number}>}
 */
export function getEvolvablePatterns() {
  loadPatterns();
  return Object.values(patterns)
    .filter((p) => p.count >= PATTERN_THRESHOLD && p.success)
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate a SKILL.md for a mature pattern and register it.
 * @param {string} patternKey - the pattern key from patterns
 * @returns {{skillName: string, path: string, created: boolean}|null}
 */
export function evolveSkill(patternKey) {
  loadPatterns();
  const pattern = patterns[patternKey];
  if (!pattern || pattern.count < PATTERN_THRESHOLD) return null;

  const skillName = `auto-${patternKey.replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').slice(0, 30)}`;
  const skillDir = join(PROJECT_SKILLS, skillName);

  if (existsSync(skillDir)) return { skillName, path: skillDir, created: false };

  const skillMd = [
    '---',
    `name: ${skillName}`,
    `description: Auto-evolved skill for: ${pattern.pattern}`,
    'license: MIT',
    'metadata:',
    `  version: "1.0"`,
    `  triggers:`,
    `    - "${pattern.pattern}"`,
    `  domains:`,
    ...pattern.domains.map((d) => `    - ${d}`),
    '---',
    '',
    `# ${skillName}`,
    '',
    `Auto-generated skill for the pattern: **${pattern.pattern}**.`,
    '',
    '## When to Use',
    `This skill was evolved from ${pattern.count} successful executions.`,
    `Use when the task matches: "${pattern.pattern}"`,
    '',
    '## Recommended Skills',
    '',
    ...pattern.skills.map((s) => `- \`${s}\``),
    '',
    '## Domains',
    '',
    ...pattern.domains.map((d) => `- ${d}`),
    '',
    `> Auto-generated: ${new Date().toISOString()}`,
    '',
  ].join('\n');

  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), skillMd, 'utf-8');

  logEvent({ type: 'skill-evolution', skill: skillName, pattern: pattern.pattern, count: pattern.count });
  return { skillName, path: skillDir, created: true };
}
