/**
 * Retry logic and circuit breaker for resilient orchestration.
 * @module orchestrate/error-recovery
 */

/**
 * @param {() => Promise<any>} fn
 * @param {{maxRetries?: number, backoff?: number}} [opts]
 * @returns {Promise<any>}
 */
export async function retry(fn, { maxRetries = 3, backoff = 1000 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await new Promise((r) => setTimeout(r, backoff * (2 ** attempt)));
    }
  }
}

/**
 * @param {(...args: any[]) => Promise<any>} fn
 * @param {{threshold?: number, resetTimeout?: number}} [opts]
 * @returns {(...args: any[]) => Promise<any>}
 */
export function circuitBreaker(fn, { threshold = 5, resetTimeout = 30000 } = {}) {
  let failures = 0;
  let openUntil = 0;

  return async (...args) => {
    if (failures >= threshold) {
      if (Date.now() < openUntil) throw new Error('Circuit breaker is open');
      failures = 0;
    }
    try {
      const result = await fn(...args);
      failures = 0;
      return result;
    } catch (e) {
      failures++;
      if (failures >= threshold) openUntil = Date.now() + resetTimeout;
      throw e;
    }
  };
}
