/**
 * V6 Deep project analyzer — recursive repository inspection.
 * Detects framework, language, architecture, TODOs, stale docs, and more.
 * @module orchestrate/project-analyzer
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { resolvePaths } from './config-resolver.mjs';
import { get as cacheGet, set as cacheSet } from './cache-manager.mjs';

const {
  projectRoot, srcDir, assetsDir, hooksDir,
} = resolvePaths();
const ROOT = projectRoot;

const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git', '.cache', '.state', 'orchestrate', 'openspec', 'features']);
const SOURCE_EXTS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.yaml', '.yml', '.md']);
const CODE_EXTS = new Set(['.html', '.css', '.js', '.mjs']);

/**
 * @typedef {object} ProjectAnalysis
 * @property {string} projectName
 * @property {string} framework
 * @property {string} language
 * @property {string} packageManager
 * @property {string} buildSystem
 * @property {string} architectureStyle
 * @property {string} designSystem
 * @property {string} activeBranch
 * @property {object} fileStats
 * @property {string[]} todos
 * @property {string[]} fixmes
 * @property {string[]} staleDocs
 * @property {string[]} failingModules
 * @property {object[]} partialFeatures
 * @property {string[]} keyDirs
 * @property {number} totalFiles
 * @property {number} totalLines
 */

const CACHE_TTL = 600000;

/**
 * Walk a directory recursively, collecting files.
 */
function walkDir(dir, extensions = SOURCE_EXTS, maxDepth = 10) {
  const files = [];
  if (!existsSync(dir)) return files;

  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || IGNORE_DIRS.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory() && maxDepth > 0) {
        files.push(...walkDir(full, extensions, maxDepth - 1));
      } else if (entry.isFile() && (!extensions.size || extensions.has(extname(entry.name).toLowerCase()))) {
        files.push(full);
      }
    }
  } catch { /* permission */ }

  return files;
}

/**
 * Detect framework from package.json.
 */
function detectFramework() {
  const pkgPath = join(ROOT, 'package.json');
  if (!existsSync(pkgPath)) return 'static-site';
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps.next || deps.react) return 'react/next.js';
    if (deps.vue || deps.nuxt) return 'vue/nuxt';
    if (deps.angular) return 'angular';
    if (deps.svelte) return 'svelte';
    if (deps.express || deps.fastify) return 'express';
    if (deps.django) return 'django';
    if (deps.laravel) return 'laravel';
    return 'static-site';
  } catch { return 'static-site'; }
}

/**
 * Detect package manager from lock files.
 */
function detectPackageManager() {
  if (existsSync(join(ROOT, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(ROOT, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(ROOT, 'package-lock.json'))) return 'npm';
  if (existsSync(join(ROOT, 'bun.lockb'))) return 'bun';
  return 'unknown';
}

/**
 * Detect build system.
 */
function detectBuildSystem() {
  const pkgPath = join(ROOT, 'package.json');
  if (!existsSync(pkgPath)) return 'unknown';
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const scripts = Object.keys(pkg.scripts || {});
    if (scripts.includes('build')) return pkg.scripts.build;
    return 'no-build-script';
  } catch { return 'unknown'; }
}

/**
 * Detect architecture style from directory layout.
 */
function detectArchitectureStyle() {
  if (existsSync(join(ROOT, 'src', 'pages'))) return 'pages-based';
  if (existsSync(join(ROOT, 'src', 'components'))) return 'component-based';
  if (existsSync(join(ROOT, 'orchestrate'))) return 'orchestrated-static';
  return 'flat-html';
}

/**
 * Detect primary language.
 */
function detectLanguage() {
  const jsFiles = walkDir(srcDir, CODE_EXTS);
  const counts = { html: 0, css: 0, js: 0 };
  for (const f of jsFiles) {
    const ext = extname(f).toLowerCase();
    if (ext === '.html') counts.html++;
    else if (ext === '.css') counts.css++;
    else counts.js++;
  }
  const max = Math.max(counts.html, counts.css, counts.js);
  if (max === counts.html && counts.html > 0) return 'html/css/js';
  if (max === counts.js) return 'javascript';
  return 'html/css';
}

/**
 * Search for TODOs and FIXMEs in source files.
 */
function findMarkers() {
  const todos = [];
  const fixmes = [];
  const files = walkDir(join(ROOT, 'src'), CODE_EXTS);
  for (const file of files.slice(0, 200)) {
    try {
      const lines = readFileSync(file, 'utf-8').split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/TODO/i.test(line) && !/^\/\/\s*ponytail:/.test(line)) {
          todos.push(`${file}:${i + 1} — ${line.slice(0, 100)}`);
        }
        if (/FIXME/i.test(line)) {
          fixmes.push(`${file}:${i + 1} — ${line.slice(0, 100)}`);
        }
      }
    } catch { /* binary/skip */ }
  }
  return { todos, fixmes };
}

/**
 * Check for stale documentation (docs with no recent commits).
 */
function findStaleDocs() {
  const stale = [];
  const docDirs = [join(ROOT, 'openspec'), join(ROOT, 'docs')];
  for (const dir of docDirs) {
    if (!existsSync(dir)) continue;
    try {
      const output = execSync(
        `git log --format="%ad %f" --date=short --name-only --since="30 days ago" -- ${dir}`,
        { cwd: ROOT, encoding: 'utf-8', timeout: 5000 },
      ).trim();
      if (!output) {
        stale.push(`${dir.replace(ROOT + '\\', '')} — no updates in 30+ days`);
        continue;
      }
      const touched = new Set(output.split('\n').filter(Boolean).filter((f) => f.endsWith('.md')));
      const allDocs = walkDir(dir, new Set(['.md']));
      for (const doc of allDocs) {
        if (!touched.has(doc.replace(ROOT + '\\', ''))) {
          stale.push(`${doc.replace(ROOT + '\\', '')} — stale (no commit in 30 days)`);
        }
      }
    } catch { /* git unavailable */ }
  }
  return stale.slice(0, 20);
}

/**
 * Detect partially completed features from features.json.
 */
function findPartialFeatures() {
  const featuresPath = join(ROOT, 'features', 'features.json');
  if (!existsSync(featuresPath)) return [];
  try {
    const features = JSON.parse(readFileSync(featuresPath, 'utf-8'));
    return features.features.filter((f) => f.status !== 'complete').slice(0, 30);
  } catch { return []; }
}

/**
 * Count files and estimate lines in a directory.
 */
function countFiles(dir) {
  const files = walkDir(dir, SOURCE_EXTS);
  let totalLines = 0;
  for (const f of files.slice(0, 300)) {
    try {
      totalLines += readFileSync(f, 'utf-8').split('\n').length;
    } catch { /* binary */ }
  }
  return { count: files.length, lines: totalLines };
}

/**
 * Run deep project analysis. Results cached for 10 minutes.
 * @returns {ProjectAnalysis}
 */
export function analyzeProject() {
  const cacheKey = 'project-analysis';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  let projectName = 'unknown';
  try {
    const sitePath = join(ROOT, 'site.json');
    if (existsSync(sitePath)) {
      const site = JSON.parse(readFileSync(sitePath, 'utf-8'));
      projectName = site.company?.name || site.name || 'OptiFlow OS Website';
    }
  } catch { projectName = 'OptiFlow OS Website'; }

  let branch = 'unknown';
  try { branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf-8', timeout: 3000 }).trim(); } catch { /* */ }

  const { todos, fixmes } = findMarkers();
  const srcStats = countFiles(srcDir);
  const assetsStats = countFiles(assetsDir);
  const hooksStats = countFiles(hooksDir);

  /** @type {ProjectAnalysis} */
  const result = {
    projectName,
    framework: detectFramework(),
    language: detectLanguage(),
    packageManager: detectPackageManager(),
    buildSystem: detectBuildSystem(),
    architectureStyle: detectArchitectureStyle(),
    designSystem: 'OptiFlow OS Enterprise DESIGN.md v5.0',
    activeBranch: branch,
    fileStats: {
      src: srcStats,
      assets: assetsStats,
      hooks: hooksStats,
      totalFiles: srcStats.count + assetsStats.count + hooksStats.count,
      totalLines: srcStats.lines + assetsStats.lines + hooksStats.lines,
    },
    todos,
    fixmes,
    staleDocs: findStaleDocs(),
    partialFeatures: findPartialFeatures(),
    failingModules: [],
    keyDirs: [],
    totalFiles: srcStats.count + assetsStats.count + hooksStats.count,
    totalLines: srcStats.lines + assetsStats.lines + hooksStats.lines,
  };

  // Detect key directories
  const dirs = readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !IGNORE_DIRS.has(e.name))
    .map((e) => e.name);
  result.keyDirs = dirs;

  cacheSet(cacheKey, result, { ttl: CACHE_TTL });
  return result;
}
