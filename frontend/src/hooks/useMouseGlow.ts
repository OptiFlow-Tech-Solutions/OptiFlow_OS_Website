import { useState, useEffect, useCallback, type RefObject } from 'react';

export function useMouseGlow(containerRef: RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0, isActive: false });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    });
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    let lastE: MouseEvent | null = null;

    function onMove(e: MouseEvent) {
      lastE = e;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (lastE) handleMouseMove(lastE);
          ticking = false;
        });
      }
    }

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, [containerRef, handleMouseMove]);

  return pos;
}
