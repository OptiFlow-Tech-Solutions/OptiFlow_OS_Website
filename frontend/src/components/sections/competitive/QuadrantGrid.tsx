import type { QuadrantEntry } from '../../../data/competitive';

interface QuadrantGridProps {
  entries: QuadrantEntry[];
  centerTitle: string;
  centerSubtitle: string;
}

export default function QuadrantGrid({ entries, centerTitle, centerSubtitle }: QuadrantGridProps) {
  return (
    <>
      <style>{`
        .qg-wrap {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }
        .qg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .qg-card {
          padding: 36px 28px;
          border: 1px solid var(--border);
          position: relative;
        }
        .qg-card:nth-child(1) {
          border-radius: var(--radius-lg) 0 0 0;
          border-right-color: var(--border-soft);
          border-bottom-color: var(--border-soft);
        }
        .qg-card:nth-child(2) {
          border-radius: 0 var(--radius-lg) 0 0;
          border-bottom-color: var(--border-soft);
        }
        .qg-card:nth-child(3) {
          border-radius: 0 0 0 var(--radius-lg);
          border-right-color: var(--border-soft);
        }
        .qg-card:nth-child(4) {
          border-radius: 0 0 var(--radius-lg) 0;
        }
        .qg-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .qg-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--fg);
        }
        .qg-weaknesses {
          list-style: none;
          padding: 0;
          margin: 0 0 14px;
        }
        .qg-weaknesses li {
          font-size: 13px;
          color: var(--muted);
          padding: 4px 0 4px 18px;
          position: relative;
        }
        .qg-weaknesses li::before {
          content: '×';
          position: absolute;
          left: 0;
          color: oklch(55% 0.22 25);
          font-weight: 700;
        }
        .qg-advantage {
          font-size: 13px;
          font-weight: 600;
          color: var(--green);
          border-top: 1px solid var(--border-soft);
          padding-top: 12px;
          margin-top: 4px;
        }
        .qg-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, var(--accent), var(--teal));
          color: white;
          padding: 20px 24px;
          border-radius: 50%;
          width: 140px;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 30%, transparent);
          z-index: 2;
        }
        .qg-center-name {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }
        .qg-center-sub {
          font-size: 10px;
          opacity: 0.85;
          margin-top: 4px;
          line-height: 1.3;
        }

        [data-theme="dark"] .qg-card {
          background: var(--surface);
          border-color: var(--border);
        }
        [data-theme="dark"] .qg-card .qg-title { color: var(--fg); }
        [data-theme="dark"] .qg-card .qg-weaknesses li { color: var(--muted); }
        [data-theme="dark"] .qg-card .qg-advantage {
          color: var(--lime);
          border-top-color: var(--border-soft);
        }

        @media (max-width: 767px) {
          .qg-grid {
            grid-template-columns: 1fr;
          }
          .qg-card:nth-child(1),
          .qg-card:nth-child(2),
          .qg-card:nth-child(3),
          .qg-card:nth-child(4) {
            border-radius: 0;
            border-right-color: var(--border);
            border-bottom-color: var(--border-soft);
          }
          .qg-card:nth-child(4) {
            border-bottom: none;
          }
          .qg-center {
            position: static;
            transform: none;
            width: auto;
            height: auto;
            border-radius: var(--radius-lg);
            margin: 16px auto;
            padding: 16px 24px;
          }
        }
      `}</style>

      <div className="qg-wrap">
        <div className="qg-grid">
          {entries.map((entry, i) => (
            <div key={i} className="qg-card reveal">
              <div className="qg-label">{entry.label}</div>
              <div className="qg-title">{entry.title}</div>
              <ul className="qg-weaknesses">
                {entry.weaknesses.map((w, j) => (
                  <li key={j}>{w}</li>
                ))}
              </ul>
              <div className="qg-advantage">{entry.advantage}</div>
            </div>
          ))}
        </div>
        <div className="qg-center">
          <span className="qg-center-name">{centerTitle}</span>
          <span className="qg-center-sub">{centerSubtitle}</span>
        </div>
      </div>
    </>
  );
}
