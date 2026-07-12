import type { PanelData } from '../../data/productOverview';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: 'var(--green)', flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function PanelSection({ data }: { data: PanelData }) {
  const { heading, features, dashboardRows, benefits, badge, reverse } = data;

  return (
    <div>
      <div className="panel-layout" style={reverse ? { direction: 'rtl' } : undefined}>
        {/* Features list */}
        <div className="panel-features" style={reverse ? { direction: 'ltr' } : undefined}>
          {features.map((f, i) => (
            <div key={i} className="panel-feat" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)', fontSize: 14 }}>
              <CheckIcon />
              <span dangerouslySetInnerHTML={{ __html: f.text }} />
            </div>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className="panel-visual" style={reverse ? { direction: 'ltr' } : undefined}>
          <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: 'var(--accent)' }}>
            {heading.includes('Admin') ? 'Admin Dashboard Preview' : heading.includes('Clarity') ? 'Captain Dashboard Preview' : 'Doer Workspace Preview'}
          </h4>

          {badge && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {badge.map((b, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: `color-mix(in oklch, ${b.color} 10%, transparent)`,
                  color: b.color, fontWeight: 600,
                }}>
                  {b.text}
                </span>
              ))}
            </div>
          )}

          {dashboardRows.map((row, i) => (
            <div key={i} className="vis-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)', fontSize: 13,
            }}>
              <span dangerouslySetInnerHTML={{ __html: row.label }} />
              <span style={row.label.includes('Next Deadline') ? { display: 'flex', alignItems: 'center', gap: 6 } : { fontFamily: 'var(--font-mono)', fontSize: 12, color: row.value === 'Present' ? 'var(--green)' : 'var(--muted)' }}>
                {row.label.includes('Next Deadline') ? (
                  <>
                    {'\u26A1'} {row.value}
                  </>
                ) : (
                  row.value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefit cards */}
      <div className="panel-benefits" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)', marginTop: 'var(--gap-lg)' }}>
        {benefits.map((b, i) => (
          <div key={i} className="panel-benefit" style={{ textAlign: 'center', padding: 16, borderRadius: 'var(--radius)', background: 'color-mix(in oklch, var(--teal) 5%, transparent)' }}>
            <div className="pb-icon" style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
            <h5 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{b.title}</h5>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
