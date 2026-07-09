import type { DashboardData } from '../../../data/features';

interface DashboardPreviewProps {
  data: DashboardData;
}

export default function DashboardPreview({ data }: DashboardPreviewProps) {
  const { metrics, rows } = data;

  return (
    <div className="dashboard-preview" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      overflow: 'hidden',
    }}>
      {metrics && metrics.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${metrics.length <= 3 ? 3 : 4}, 1fr)`,
          gap: 'var(--gap-sm)',
          marginBottom: 'var(--gap-md)',
        }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              padding: 14,
              textAlign: 'center',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{m.val}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.04em' }}>{m.lbl}</div>
            </div>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {rows[0].cols.map((col, i) => {
                const cleaned = col.replace(/^(accent|teal|green|red|yellow|ack|done|pending|bar|muted):/, '');
                return (
                  <th key={i} style={{
                    textAlign: 'left',
                    color: 'var(--muted)',
                    fontWeight: 500,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                    padding: '8px 10px',
                    borderBottom: '1px solid var(--border)',
                  }}>{cleaned}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.cols.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: 10,
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <CellRenderer value={cell} />
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CellRenderer({ value }: { value: string }) {
  if (value.startsWith('done'))
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--green-soft)', color: 'var(--green)' }}>{value.replace(/^done:/, '')}</span>;

  if (value.startsWith('pending'))
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--accent-soft)', color: 'var(--accent)' }}>{value.replace(/^pending:/, '')}</span>;

  if (value.startsWith('red:'))
    return <span style={{ color: 'red', fontWeight: 600 }}>{value.replace('red:', '')}</span>;

  if (value.startsWith('yellow:'))
    return <span style={{ color: '#f0a020' }}>{value.replace('yellow:', '')}</span>;

  if (value.startsWith('accent:'))
    return <span style={{ color: 'var(--accent)' }}>{value.replace('accent:', '')}</span>;

  if (value.startsWith('teal:'))
    return <span style={{ color: 'var(--teal)' }}>{value.replace('teal:', '')}</span>;

  if (value.startsWith('green:'))
    return <span style={{ color: 'var(--green)' }}>{value.replace('green:', '')}</span>;

  if (value.startsWith('bar:')) {
    const width = parseInt(value.replace('bar:', ''));
    return <span style={{ display: 'inline-block', height: 6, borderRadius: 3, background: 'var(--accent)', width }} />;
  }

  if (value.startsWith('ack:'))
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--green-soft)', color: 'var(--green)' }}>{value.replace('ack:', '')}</span>;

  if (value.startsWith('muted:'))
    return <span style={{ color: 'var(--muted)' }}>{value.replace('muted:', '')}</span>;

  if (value === 'done')
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--green-soft)', color: 'var(--green)' }}>Done</span>;

  if (value === 'pending')
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--accent-soft)', color: 'var(--accent)' }}>Pending</span>;

  return <>{value}</>;
}
