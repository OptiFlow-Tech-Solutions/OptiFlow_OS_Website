import { useCallback, useRef } from 'react';

interface CardTiltOptions {
  maxTilt?: number;
  translateY?: number;
}

export function useCardTilt(options: CardTiltOptions = {}) {
  const { maxTilt = 12, translateY = -4 } = options;
  const tickingRef = useRef(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      const el = e.currentTarget;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = (y / rect.height - 0.5) * maxTilt;
      const ry = (x / rect.width - 0.5) * -maxTilt;

      requestAnimationFrame(() => {
        card.style.transform = `translateY(${translateY}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        tickingRef.current = false;
      });
    },
    [maxTilt, translateY]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget.firstElementChild as HTMLElement | null;
    if (card) card.style.transform = '';
  }, []);

  return { onMouseMove, onMouseLeave };
}
