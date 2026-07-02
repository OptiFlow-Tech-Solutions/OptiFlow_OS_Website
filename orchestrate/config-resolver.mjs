/**
 * Dynamic configuration resolver. No hardcoded paths.
 * Resolves project root, global ECC root, and platform-specific paths at runtime.
 * @module orchestrate/config-resolver
 */

import { homedir } from 'node:os';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

let _cached = null;

/**
 * Resolve all key paths dynamically.
 * @returns {{
 *   projectRoot: string,
 *   globalRoot: string,
 *   openspecDir: string,
 *   specsDir: string,
 *   changesDir: string,
 *   designDir: string|null,
 *   assetsDir: string,
 *   srcDir: string,
 *   hooksDir: string,
 *   commandsDir: string,
 *   cacheDir: string,
 *   stateDir: string,
 *   globalSkillsDir: string,
 *   globalAgentsCfg: string,
 *   globalMcpCfg: string,
 *   globalHooksDir: string,
 *   globalCommandsDir: string,
 *   distDir: string,
 *   siteJsonPath: string,
 * }}
 */
export function resolvePaths() {
  if (_cached) return _cached;

  // Project root: orchestrate/ dir's parent
  const orchestrateDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(orchestrateDir, '..');

  // Global ECC root: ~/.config/opencode (cross-platform via homedir)
  const globalRoot = resolve(homedir(), '.config', 'opencode');

  /**
   * Find the DESIGN.md directory (starts with 'OptiFlow-OS').
   * @returns {string|null}
   */
  function findDesignDir() {
    try {
      const entry = readdirSync(projectRoot, { withFileTypes: true })
        .find((e) => e.isDirectory() && (e.name.startsWith('DESIGN') || e.name.startsWith('OptiFlow-OS')));
      return entry ? join(projectRoot, entry.name) : null;
    } catch { return null; }
  }

  _cached = Object.freeze({
    projectRoot,
    globalRoot,
    openspecDir: join(projectRoot, 'openspec'),
    specsDir: join(projectRoot, 'openspec', 'specs'),
    changesDir: join(projectRoot, 'openspec', 'changes'),
    designDir: findDesignDir(),
    assetsDir: join(projectRoot, 'assets'),
    srcDir: join(projectRoot, 'src'),
    hooksDir: join(projectRoot, 'hooks'),
    commandsDir: join(projectRoot, 'commands'),
    cacheDir: join(orchestrateDir, '.cache'),
    stateDir: join(orchestrateDir, '.state'),
    globalSkillsDir: join(globalRoot, 'skills'),
    globalAgentsCfg: join(globalRoot, '.opencode', 'opencode.json'),
    globalMcpCfg: join(globalRoot, 'opencode.jsonc'),
    globalHooksDir: join(globalRoot, 'hooks'),
    globalCommandsDir: join(globalRoot, 'commands'),
    distDir: join(projectRoot, 'dist'),
    siteJsonPath: join(projectRoot, 'site.json'),
  });

  return _cached;
}

/**
 * Check if global ECC repo exists.
 * @returns {boolean}
 */
export function globalRepoExists() {
  return existsSync(resolvePaths().globalRoot);
}

/**
 * Check if a specific resource type exists in the global repo.
 * @param {'skills'|'agents'|'mcp'|'hooks'|'commands'} type
 * @returns {boolean}
 */
export function globalResourceExists(type) {
  const paths = resolvePaths();
  switch (type) {
    case 'skills': return existsSync(paths.globalSkillsDir);
    case 'agents': return existsSync(paths.globalAgentsCfg);
    case 'mcp': return existsSync(paths.globalMcpCfg);
    case 'hooks': return existsSync(paths.globalHooksDir);
    case 'commands': return existsSync(paths.globalCommandsDir);
    default: return false;
  }
}
