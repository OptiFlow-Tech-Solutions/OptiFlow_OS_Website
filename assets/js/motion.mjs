/* ═══════════════════════════════════════════
   OptiFlow OS — Unified Motion System
   Replaces ad-hoc stagger delays with a
   configurable, performance-aware animation engine
   ═══════════════════════════════════════════ */

export const defaults = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  offset: 28,        // translateY offset
  duration: 700,     // ms
  stagger: 80,        // ms between children
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export function createRevealObserver(options = {}) {
  const opts = { ...defaults, ...options };
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If target has staggered children, animate them sequentially
        const children = entry.target.querySelectorAll(':scope > .reveal, :scope > *');
        children.forEach((child, i) => {
          if (child.classList.contains('reveal') || child.dataset.stagger) {
            child.style.transitionDelay = `${i * opts.stagger}ms`;
            child.classList.add('visible');
          }
        });
      }
    });
  }, { threshold: opts.threshold, rootMargin: opts.rootMargin });
}

export function observeAll(selector = '.reveal', observer = null) {
  const obs = observer || createRevealObserver();
  document.querySelectorAll(selector).forEach((el) => obs.observe(el));
  return obs;
}

// Motion presets matching the design system's 4 shadow levels
export const springs = {
  default: { type: 'spring', stiffness: 200, damping: 24 },
  gentle:  { type: 'spring', stiffness: 120, damping: 14 },
  snappy:  { type: 'spring', stiffness: 400, damping: 30 },
  bouncy:  { type: 'spring', stiffness: 300, damping: 10 },
};
