/**
 * Routes and sequences slash command execution by phase.
 * Maps orchestration phases to project-specific commands.
 * @module orchestrate/command-router
 */

/** @type {Readonly<Record<string, string[]>>} */
const PHASE_COMMANDS = Object.freeze({
  explore: ['/opsx:explore'],
  propose: ['/opsx:propose {changeName}'],
  apply: ['/opsx:apply', '/validate-full'],
  verify: ['/opsx:verify', '/test', '/brand-check'],
  archive: ['/opsx:archive', '/page-status'],
});

const ALLOWED_PHASES = Object.freeze(Object.keys(PHASE_COMMANDS));

/**
 * Route a phase to its ordered command sequence.
 * Interpolates `{changeName}` if provided in context.
 * @param {string} phase
 * @param {{changeName?: string}} [context={}]
 * @returns {string[]}
 */
export function routeCommands(phase, context = {}) {
  const commands = PHASE_COMMANDS[phase] || [];
  const { changeName } = context;
  if (changeName) {
    return commands.map((c) => c.replace('{changeName}', changeName));
  }
  return [...commands];
}

/**
 * Return the ordered list of slash commands for manual execution.
 * @param {string} phase
 * @returns {string[]}
 */
export function getCommandPipeline(phase) {
  return PHASE_COMMANDS[phase] || [];
}

/**
 * @returns {Readonly<string[]>} all valid phases
 */
export function validPhases() {
  return ALLOWED_PHASES;
}
