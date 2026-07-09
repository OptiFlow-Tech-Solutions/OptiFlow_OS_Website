import type { CostCardEntry } from '../../../data/competitive';

interface CostComparisonProps {
  entries: CostCardEntry[];
  sectionHeading: string;
  sectionLead: string;
}

export default function CostComparison({ entries, sectionHeading, sectionLead }: CostComparisonProps) {
  return (
    <>
      <style>{`
        .cc-grid {
          display: grid;
          grid-template-columns: repeat(${Math.min(entries.length, 4)}, 1fr);
          gap: var(--gap-md);
        }
        .cc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 10px 30px color-mix(in oklch, var(--fg) 6%, transparent);
          transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
        }
        .cc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 40px color-mix(in oklch, var(--fg) 10%, transparent);
          border-color: color-mix(in oklch, var(--accent) 30%, var(--border));
        }
        .cc-card:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
          border-radius: 20px;
        }
        .cc-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--fg);
        }
        .cc-cost {
          font-family: var(--font-mono);
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          margin: 16px 0 12px;
          color: var(--fg);
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .cc-detail {
          font-size: 15px;
          font-weight: 500;
          color: var(--muted);
          line-height: 1.55;
        }
        .cc-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: var(--green);
          color: #fff;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 8px;
        }
        .cc-best {
          border-color: var(--green);
          box-shadow: 0 0 20px color-mix(in oklch, var(--green) 18%, transparent), 0 10px 30px color-mix(in oklch, var(--fg) 6%, transparent);
        }
        .cc-best .cc-cost { color: var(--green); }

        [data-theme="dark"] .cc-card {
          background: #111827;
          border-color: rgba(255,255,255,.08);
          box-shadow: 0 10px 30px rgba(0,0,0,.35);
        }
        [data-theme="dark"] .cc-card:hover {
          box-shadow: 0 14px 40px rgba(0,0,0,.45);
          border-color: rgba(255,255,255,.16);
        }
        [data-theme="dark"] .cc-card h3 { color: #F9FAFB; }
        [data-theme="dark"] .cc-cost { color: #F9FAFB; }
        [data-theme="dark"] .cc-detail { color: #D1D5DB; }
        [data-theme="dark"] .cc-best {
          border-color: var(--lime);
          box-shadow: 0 0 24px rgba(153,210,113,.14), 0 10px 30px rgba(0,0,0,.35);
        }
        [data-theme="dark"] .cc-best .cc-cost { color: var(--lime); }

        @media (max-width: 1024px) {
          .cc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 767px) {
          .cc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section-header reveal">
        <h2>{sectionHeading}</h2>
        <p className="lead" style={{ maxWidth: 640, margin: '0 auto' }}>{sectionLead}</p>
      </div>

      <div className="cc-grid stagger-4">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`cc-card reveal${entry.bestValue ? ' cc-best' : ''}`}
          >
            {entry.bestValue && <span className="cc-badge">Best Value</span>}
            <h3>{entry.title}</h3>
            <div className="cc-cost">{entry.cost}</div>
            <div className="cc-detail">{entry.detail}</div>
          </div>
        ))}
      </div>
    </>
  );
}
