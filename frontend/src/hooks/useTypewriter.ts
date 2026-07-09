import { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
}

const DEFAULT_PHRASES = [
  'Daily Operations Feel Out Of Control?',
  'Important Tasks Keep Getting Missed?',
  'No One Takes Full Ownership?',
  'No Clear Visibility Into Daily Operations?',
  "Your Business Can't Run Without You?",
];

export function useTypewriter(
  phrases: string[] = DEFAULT_PHRASES,
  options: TypewriterOptions = {}
) {
  const { typeSpeed = 60, deleteSpeed = 30, holdDuration = 2200 } = options;
  const [text, setText] = useState('');
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const piRef = useRef(0);
  const ciRef = useRef(0);
  const typingRef = useRef(true);
  const pauseRef = useRef(0);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useRef(false);

  const tick = useCallback(() => {
    if (document.hidden) {
      rafRef.current = requestAnimationFrame(() => setTimeout(tick, 200));
      return;
    }

    if (prefersReducedMotion.current) {
      setText(phrases[0] || '');
      return;
    }

    const txt = phrases[piRef.current];
    if (!txt) return;

    if (typingRef.current) {
      ciRef.current++;
      setText(txt.substring(0, ciRef.current));
      if (ciRef.current >= txt.length) {
        typingRef.current = false;
        pauseRef.current = holdDuration;
      }
    } else if (pauseRef.current > 0) {
      pauseRef.current -= typeSpeed;
    } else {
      ciRef.current--;
      setText(txt.substring(0, ciRef.current));
      if (ciRef.current <= 0) {
        typingRef.current = true;
        piRef.current = (piRef.current + 1) % phrases.length;
      }
    }
    const delay = typingRef.current ? typeSpeed : deleteSpeed;
    rafRef.current = requestAnimationFrame(() => setTimeout(tick, delay));
  }, [phrases, typeSpeed, deleteSpeed, holdDuration]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    if (mq.matches) {
      setText(phrases[0] || '');
      setIsCursorVisible(true);
      return;
    }

    const cursorInterval = setInterval(() => {
      setIsCursorVisible((v) => !v);
    }, 800);

    rafRef.current = requestAnimationFrame(() => setTimeout(tick, typeSpeed));

    return () => {
      clearInterval(cursorInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phrases, tick, typeSpeed]);

  return { text, isCursorVisible };
}
