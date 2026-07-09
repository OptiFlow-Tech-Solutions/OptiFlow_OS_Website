import { useState, useEffect, useRef } from 'react';

interface CountUpOptions {
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp(target: number, options: CountUpOptions = {}) {
  const { duration = 1500, prefix = '', suffix = '' } = options;
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setDisplay(`${prefix}${target.toLocaleString()}${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started, target, prefix, suffix]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let rafId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.round(progress * target);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration, prefix, suffix]);

  return { display, ref };
}
