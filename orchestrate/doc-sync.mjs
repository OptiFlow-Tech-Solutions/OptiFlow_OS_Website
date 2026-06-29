/**
 * V4 Documentation synchronization.
 * Auto-updates documentation when specs change.
 * Generates changelog from archived deltas.
 * @module orchestrate/doc-sync
 */

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePaths } from './config-resolver.mjs';

const { projectRoot } = resolvePaths();

/** Spec → Documentation file map */
const SPEC_DOC_MAP = {
  'design-system': ['DESIGN.md'],
  'marketing-pages': ['site.json'],
  'build-pipeline': ['AGENTS.md'],
  'orchestration-engine': ['AGENTS.md'],
  seo: ['AGENTS.md'],
  accessibility: ['AGENTS.md'],
  'shared-components': ['AGENTS.md'],
  'dark-mode': ['DESIGN.md'],
};

/**
 * Determine which docs need updating based on affected specs.
 */
export function syncDocs(_changeName, affectedSpecs) {
  const docs = new Set();

  for (const spec of affectedSpecs) {
    const mapped = SPEC_DOC_MAP[spec.toLowerCase()];
    if (mapped) for (const doc of mapped) docs.add(doc);
  }

  const result = [...docs];
  if (result.length === 0) {
    console.log('  No documentation files need updating.');
  } else {
    for (const doc of result) {
      console.log(`  Doc to update: ${doc} (affected by: ${affectedSpecs.join(', ')})`);
    }
  }

  return { docsToUpdate: result };
}

/**
 * Generate a changelog entry for a change.
 */
export function generateChangeLog(changeName, deltas) {
  const date = new Date().toISOString().split('T')[0];
  const lines = [`## ${changeName} — ${date}`];

  for (const d of deltas) {
    const badge = d.action === 'ADDED' ? '+' : d.action === 'REMOVED' ? '-' : '~';
    lines.push(`- ${badge} **${d.spec}**: ${d.details}`);
  }

  return lines.join('\n') + '\n';
}

/**
 * Generate a full changelog from all archived changes.
 */
export function generateFullChangeLog() {
  const archiveDir = resolve(projectRoot, 'openspec', 'changes', 'archive');
  if (!existsSync(archiveDir)) return '';

  const entries = readdirSync(archiveDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort()
    .map((d) => {
      return `- **${d.name}**: Archived change`;
    });

  if (!entries.length) return '';

  const lines = ['# Changelog', ''];
  lines.push(...entries);
  return lines.join('\n') + '\n';
}

/**
 * Get the current documentation status.
 */
export function docStatus() {
  const docs = Object.values(SPEC_DOC_MAP).flat();
  const uniqueDocs = [...new Set(docs)];
  const status = [];

  for (const doc of uniqueDocs) {
    const exists = existsSync(resolve(projectRoot, doc));
    status.push({ document: doc, exists, updated: exists ? 'Present' : 'Missing' });
  }

  return status;
}
