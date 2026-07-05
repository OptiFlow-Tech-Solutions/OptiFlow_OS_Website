/**
 * Backfills feature traceability fields from archive records.
 * Scans openspec/changes/archive/ + features/features.json,
 * matches archive entries to features by name similarity,
 * populates traceability.specs, archiveDir, lastValidated.
 *
 * Usage: node scripts/backfill-traceability.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FEATURES_PATH = resolve(ROOT, 'features', 'features.json');
const ARCHIVE_DIR = resolve(ROOT, 'openspec', 'changes', 'archive');
const SPECS_DIR = resolve(ROOT, 'openspec', 'specs');

function tokenize(name) {
  return name.toLowerCase()
    .replace(/[&,-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t.length > 1);
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function extractPrefixAndNum(id) {
  const m = id.match(/^([A-Z]+)-(\d+)$/);
  return m ? { prefix: m[1], num: parseInt(m[2]) } : null;
}

function _readArchiveSummary(archiveName) {
  const dir = resolve(ARCHIVE_DIR, archiveName);
  const proposalPath = resolve(dir, 'proposal.md');
  if (!existsSync(proposalPath)) return '';
  try {
    const content = readFileSync(proposalPath, 'utf-8');
    const m = content.match(/^##\s*Summary\s*\n(.+)/m);
    return m ? m[1].trim() : '';
  } catch {
    return '';
  }
}

function readArchiveSpecs(archiveName) {
  const specsDir = resolve(ARCHIVE_DIR, archiveName, 'specs');
  if (!existsSync(specsDir)) return [];
  try {
    return readdirSync(specsDir, { withFileTypes: true })
      .filter((e) => (e.isFile() && e.name.endsWith('.md')) || e.isDirectory())
      .map((e) => e.name.replace('.md', ''));
  } catch {
    return [];
  }
}

function _readArchiveTasksProgress(archiveName) {
  const tasksPath = resolve(ARCHIVE_DIR, archiveName, 'tasks.md');
  if (!existsSync(tasksPath)) return null;
  try {
    const content = readFileSync(tasksPath, 'utf-8');
    const total = (content.match(/^-\s*\[[ x]\]/gm) || []).length;
    const done = (content.match(/^-\s*\[x\]/gm) || []).length;
    return { done, total };
  } catch {
    return null;
  }
}

function discoverSourceFiles(featureName) {
  const pagesDir = resolve(ROOT, 'src', 'pages');
  if (!existsSync(pagesDir)) return [];
  const nameTokens = tokenize(featureName);
  try {
    return readdirSync(pagesDir)
      .filter((f) => f.endsWith('.html'))
      .filter((f) => {
        const fileTokens = tokenize(f.replace('.html', ''));
        const score = jaccard(fileTokens, nameTokens);
        return score > 0.15 || nameTokens.some((t) => f.toLowerCase().includes(t));
      })
      .map((f) => `src/pages/${f}`);
  } catch {
    return [];
  }
}

function discoverSourceFilesWide(featureName) {
  const searchDirs = ['assets/css', 'assets/js', 'scripts', 'functions/api', 'hooks'];
  const found = [];
  const nameTokens = tokenize(featureName);

  for (const dir of searchDirs) {
    const full = resolve(ROOT, dir);
    if (!existsSync(full)) continue;
    try {
      const files = readdirSync(full, { recursive: true, withFileTypes: true });
      for (const f of files) {
        if (!f.isFile()) continue;
        const relPath = join(dir, f.name).replace(/\\/g, '/');
        const fileTokens = tokenize(f.name);
        const score = jaccard(fileTokens, nameTokens);
        if (score > 0.2) found.push(relPath);
      }
    } catch { /* skip */ }
  }
  return found.slice(0, 8);
}

function resolveSpecsForArchiveName(archiveName) {
  if (!existsSync(SPECS_DIR)) return [];
  const specDirs = readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory());
  const archiveTokens = tokenize(archiveName);
  return specDirs
    .filter((d) => {
      const specTokens = tokenize(d.name);
      return jaccard(archiveTokens, specTokens) > 0.1;
    })
    .map((d) => d.name);
}

console.log('Backfilling feature traceability from archive records...\n');

const features = JSON.parse(readFileSync(FEATURES_PATH, 'utf-8'));
const archiveDirs = existsSync(ARCHIVE_DIR)
  ? readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
  : [];

console.log(`Features in registry: ${features.features.length}`);
console.log(`Archive directories:  ${archiveDirs.length}\n`);

let matched = 0;
const unmatched = [];

for (const feature of features.features) {
  if (feature.traceability?.archiveDir && feature.traceability?.specs?.length > 0) {
    matched++;
    continue; // already populated
  }

  const featTokens = tokenize(feature.name);
  const prefixInfo = extractPrefixAndNum(feature.id);

  // Try exact ID prefix match first (e.g., page-001 → PAGE-001)
  let bestMatch = null;
  let bestScore = 0;

  for (const archiveName of archiveDirs) {
    const archTokens = tokenize(archiveName);

    // Direct prefix-num match
    if (prefixInfo) {
      const prefixLower = prefixInfo.prefix.toLowerCase();
      const numStr = String(prefixInfo.num).padStart(3, '0');
      if (archiveName.includes(`${prefixLower}-${numStr}`)) {
        bestMatch = archiveName;
        break;
      }
    }

    // Jaccard similarity fallback
    const score = jaccard(featTokens, archTokens);
    if (score > bestScore && score > 0.12) {
      bestScore = score;
      bestMatch = archiveName;
    }
  }

  if (bestMatch) {
    const specs = readArchiveSpecs(bestMatch);
    const mainSpecs = resolveSpecsForArchiveName(bestMatch);
    const allSpecs = [...new Set([...specs, ...mainSpecs])];

    const sourceFiles = discoverSourceFiles(feature.name);
    const wideFiles = discoverSourceFilesWide(feature.name);
    const allFiles = [...new Set([...sourceFiles, ...wideFiles])];

    if (!feature.traceability) {
      feature.traceability = { specs: [], sourceFiles: [], archiveDir: '', lastValidated: '' };
    }

    feature.traceability.specs = allSpecs;
    feature.traceability.sourceFiles = allFiles;
    feature.traceability.archiveDir = bestMatch;
    feature.traceability.lastValidated = new Date().toISOString().split('T')[0];

    matched++;
    console.log(`  ✓ ${feature.id} → ${bestMatch} [${allSpecs.length} spec(s), ${allFiles.length} file(s)]`);
  } else {
    // Try at least discovering source files
    const sourceFiles = discoverSourceFiles(feature.name);
    if (!feature.traceability) {
      feature.traceability = { specs: [], sourceFiles: [], archiveDir: '', lastValidated: '' };
    }
    if (sourceFiles.length > 0) {
      feature.traceability.sourceFiles = sourceFiles;
      feature.traceability.lastValidated = new Date().toISOString().split('T')[0];
    }
    unmatched.push(`${feature.id} ${feature.name}`);
  }
}

writeFileSync(FEATURES_PATH, JSON.stringify(features, null, 2), 'utf-8');
console.log(`\nMatched: ${matched} / ${features.features.length}`);
if (unmatched.length) {
  console.log(`Unmatched: ${unmatched.length}`);
  unmatched.slice(0, 10).forEach((u) => console.log(`  - ${u}`));
  if (unmatched.length > 10) console.log(`  ... and ${unmatched.length - 10} more`);
}
console.log('\nDone. features.json updated.');
