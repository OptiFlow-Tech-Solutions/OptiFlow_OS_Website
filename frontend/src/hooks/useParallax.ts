import { useState, useEffect } from 'react';

export function useParallax() {
  const [transform, setTransform] = useState('translateX(0px) translateY(0px)');

  useEffect(() => {
    let ticking = false;
    let lastX = 0;
    let lastY = 0;

    function update() {
      const dx = (lastX / window.innerWidth - 0.5) * 16;
      const dy = (lastY / window.innerHeight - 0.5) * 12;
      setTransform(`translateX(${dx}px) translateY(${dy}px)`);
      ticking = false;
    }

    function onMove(e: MouseEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return transform;
}
