import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export default function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const idsRef = useRef(sectionIds);
  idsRef.current = sectionIds;

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: options.rootMargin ?? '-30% 0px -50% 0px',
      threshold: options.threshold ?? 0,
    });
    observerRef.current = observer;

    idsRef.current.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds.join(','), handleIntersect, options.rootMargin]);

  return activeId;
}
