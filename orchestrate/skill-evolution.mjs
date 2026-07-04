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
 * Get patterns that have crossed the evolutions threshold (3+ uses).
 * @returns {Array<{key: string, pattern: object}>}
 */
export function getEvolvablePatterns() {
  loadPatterns();
  return Object.entries(patterns)
    .filter(([, p]) => p.count >= PATTERN_THRESHOLD)
    .map(([key, pattern]) => ({ key, pattern }));
}

/**
 * Get a skill success boost map for scoring.
 * Skills used successfully in past patterns get a boost multiplier (1.0–1.5).
 * Compiled from successful pattern history with recency weighting.
 * @returns {Record<string, number>}
 */
export function getSkillSuccessBoost() {
  loadPatterns();
  const boost = {};
  for (const [, p] of Object.entries(patterns)) {
    if (!p.success) continue;
    const recency = Math.min(1, p.count / PATTERN_THRESHOLD);
    for (const skill of (p.skills || [])) {
      boost[skill] = Math.max(boost[skill] || 1.0, 1.0 + recency * 0.5);
    }
  }
  return boost;
}

// ── Agent performance tracking ──
/** @type {Record<string, {agentId: string, phaseId: string, success: boolean, count: number}>} */
let agentStats = {};
const AGENT_STATS_PATH = resolve(__dir, '.state', 'agent-stats.json');

function loadAgentStats() {
  if (existsSync(AGENT_STATS_PATH)) {
    try { agentStats = JSON.parse(readFileSync(AGENT_STATS_PATH, 'utf-8')); } catch { agentStats = {}; }
  }
}

function saveAgentStats() {
  const dir = dirname(AGENT_STATS_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(AGENT_STATS_PATH, JSON.stringify(agentStats, null, 2), 'utf-8');
}

/**
 * Record agent phase execution result for performance learning.
 * @param {string} agentId
 * @param {string} phaseId
 * @param {boolean} success
 */
export function recordAgentResult(agentId, phaseId, success = true) {
  loadAgentStats();
  const key = `${agentId}:${phaseId}`;
  if (agentStats[key]) {
    agentStats[key].count++;
    agentStats[key].success = agentStats[key].success && success;
  } else {
    agentStats[key] = { agentId, phaseId, success, count: 1 };
  }
  saveAgentStats();
}

/**
 * Get agent success rates per phase for composition biasing.
 * Returns a map of agentId → {successRate, count} for the given phase.
 * @param {string} phaseId
 * @returns {Record<string, {successRate: number, count: number}>}
 */
export function getAgentPhaseRates(phaseId) {
  loadAgentStats();
  const rates = {};
  for (const [, stats] of Object.entries(agentStats)) {
    if (stats.phaseId === phaseId) {
      rates[stats.agentId] = {
        successRate: stats.count > 0 ? (stats.success ? 1 : 0) : 0.5,
        count: stats.count,
      };
    }
  }
  return rates;
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
