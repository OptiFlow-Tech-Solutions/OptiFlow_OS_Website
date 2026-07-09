import { COMPARISON_MATRIX, type CellState } from './pricingData';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function Cell({ state, text }: { state: CellState; text?: string }) {
  if (state === 'yes') {
    return (
      <span style={{ color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
        <CheckIcon /> Included
      </span>
    );
  }
  if (state === 'limited') {
    return (
      <span style={{ color: 'var(--teal)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
        <InfoIcon /> {text || 'Limited'}
      </span>
    );
  }
  return <span style={{ color: 'color-mix(in oklch, var(--fg) 25%, transparent)' }}>&mdash;</span>;
}

export default function ComparisonMatrix() {
  return (
    <div style={{
      maxWidth: 960,
      margin: '0 auto',
      background: 'oklch(12% 0.018 250)',
      color: '#fff',
      borderRadius: 'var(--radius-xl)',
      padding: '48px 40px',
    }}>
      <div className="comp-head" style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 1fr 1fr',
        borderBottom: '2px solid color-mix(in oklch, var(--fg) 12%, transparent)',
        paddingBottom: 16,
        marginBottom: 4,
      }}>
        <span style={{ padding: '0 16px 0 0', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Capability
        </span>
        <span className="comp-col-starter" style={{ padding: '0 16px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'color-mix(in oklch, var(--fg) 60%, transparent)' }}>
          Starter
        </span>
        <span style={{ padding: '0 16px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'color-mix(in oklch, var(--fg) 60%, transparent)' }}>
          Growth
        </span>
        <span style={{ padding: '0 16px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'color-mix(in oklch, var(--fg) 60%, transparent)' }}>
          Scale
        </span>
      </div>

      {COMPARISON_MATRIX.map((section) => (
        <div key={section.label}>
          <div className="comp-section-label" style={{
            padding: '20px 0 8px',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--teal)',
          }}>
            {section.label}
          </div>
          {section.rows.map((row) => (
            <div
              key={row.label}
              className="comp-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr 1fr',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ padding: '0 16px 0 0', fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>
                {row.label}
              </span>
              <span style={{ padding: '0 16px', fontSize: 14, color: 'var(--muted)' }}>
                <Cell state={row.starter} text={row.starterText} />
              </span>
              <span style={{ padding: '0 16px', fontSize: 14, color: 'var(--muted)' }}>
                <Cell state={row.growth} text={row.growthText} />
              </span>
              <span style={{ padding: '0 16px', fontSize: 14, color: 'var(--muted)' }}>
                <Cell state={row.scale} text={row.scaleText} />
              </span>
            </div>
          ))}
        </div>
      ))}

      <style>{`
        .comp-row:hover { background: color-mix(in oklch, var(--fg) 4%, transparent); }
        [data-theme="dark"] .comp-row:hover { background: color-mix(in oklch, var(--fg) 3%, transparent); }
        [data-theme="dark"] .comp-head { border-bottom-color: color-mix(in oklch, var(--fg) 12%, transparent); }
        [data-theme="dark"] .comp-row { border-bottom-color: var(--border); }
      `}</style>
    </div>
  );
}
