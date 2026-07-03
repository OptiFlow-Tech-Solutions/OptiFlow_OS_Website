import { EventEmitter } from 'node:events';
const bus = new EventEmitter();
export const emit = bus.emit.bind(bus);
export const on = bus.on.bind(bus);
export const once = bus.once.bind(bus);

// ponytail: default listeners for observability
// external harnesses can add more via `on(event, handler)`
export function registerDefaults(logFn) {
  const handler = (data) => logFn(data);
  bus.on('auto:pipeline:start', handler);
  bus.on('auto:pipeline:end', handler);
  bus.on('auto:pipeline:phase', handler);
  bus.on('opsx:start', handler);
  bus.on('opsx:complete', handler);
  bus.on('pipeline:start', handler);
  bus.on('pipeline:end', handler);
  bus.on('pipeline:phase', handler);
  bus.on('pipeline:failed', handler);
  bus.on('gate:check', handler);
}
