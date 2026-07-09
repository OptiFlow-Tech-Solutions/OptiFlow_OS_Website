import { useEffect, useRef, useState } from 'react';
import { TIMELINE_STEPS, TIMELINE_METRICS } from './pricingData';

export default function ImplementationTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div
        className={`imp-timeline ${visible ? 'visible' : ''} stagger`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--gap-md)',
          marginBottom: 64,
        }}
      >
        {TIMELINE_STEPS.map((step) => (
          <div
            key={step.num}
            className="imp-step"
            style={{
              textAlign: 'center',
              position: 'relative',
              padding: '24px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div
              className="imp-step-num"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--teal))',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 15,
                margin: '0 auto 12px',
                animation: `floatUp 3s ease-in-out infinite`,
                animationDelay: `${(step.num - 1) * 0.3}s`,
              }}
            >
              {step.num}
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{step.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="imp-metrics stagger-3" style={{
        maxWidth: 900,
        marginInline: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--gap-md)',
      }}>
        {TIMELINE_METRICS.map((m) => (
          <div key={m.label} className="card imp-metric" style={{ textAlign: 'center', padding: 'var(--gap-md)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div className="imp-metric-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, marginBottom: 8, color: m.color }}>
              {m.value}
            </div>
            <p className="imp-metric-label" style={{ fontSize: 13, color: 'var(--muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .imp-step::after {
          content: '';
          position: absolute;
          top: 50%;
          right: calc(-1 * var(--gap-md) / 2);
          width: var(--gap-md);
          height: 2px;
          background: linear-gradient(90deg, color-mix(in oklch, var(--accent) 60%, transparent), color-mix(in oklch, var(--teal) 60%, transparent));
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .stagger.visible .imp-step::after { opacity: 0.4; }
        .imp-step:last-child::after { display: none; }
        .imp-step:hover { transform: translateY(-6px); border-color: var(--accent); box-shadow: 0 8px 28px color-mix(in oklch, var(--accent) 15%, transparent); }

        @keyframes floatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        @media (prefers-reduced-motion: reduce) {
          .imp-step-num { animation: none; }
        }

        @media (max-width: 1024px) {
          .imp-timeline { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .imp-timeline { grid-template-columns: 1fr; gap: var(--gap-sm); }
          .imp-step::after { display: none; }
          .imp-metrics { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
