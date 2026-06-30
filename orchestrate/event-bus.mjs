import { EventEmitter } from 'node:events';
const bus = new EventEmitter();
export const emit = bus.emit.bind(bus);
