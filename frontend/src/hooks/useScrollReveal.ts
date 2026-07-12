import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export default function useScrollReveal(options: RevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const reducedMotion = usePrefersReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;

    const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const elements = document.querySelectorAll(selectors.join(','));
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reducedMotion, threshold, rootMargin]);

  return observerRef;
}
