interface ComparisonColumn {
  key: string;
  label: string;
  highlight?: boolean;
}

interface ComparisonCell {
  type: 'check' | 'cross' | 'text';
  value?: string;
}

type ComparisonRow = Record<string, ComparisonCell>;

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}

const CheckSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--green, #54B89A)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,8 7,12 13,5" />
  </svg>
);

const CrossSvg = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="3" x2="11" y2="11" />
    <line x1="11" y1="3" x2="3" y2="11" />
  </svg>
);

function CellContent({ cell }: { cell: ComparisonCell }) {
  if (cell.type === 'check') return <CheckSvg />;
  if (cell.type === 'cross') return <CrossSvg />;
  return <>{cell.value ?? ''}</>;
}

export default function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <>
      <style>{`
        .comp-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 40px; border-radius: var(--radius-lg); }
        .comp-table { width: 100%; border-collapse: collapse; min-width: 900px; table-layout: fixed; }
        .comp-table th, .comp-table td { padding: 14px 16px; text-align: center; vertical-align: middle; }
        .comp-table th { position: sticky; top: 0; z-index: var(--z-content, 1); }
        .comp-table th:first-child, .comp-table td:first-child { text-align: left; }
        .comp-table td:first-child { width: 30%; }
        .comp-table th:not(:first-child), .comp-table td:not(:first-child) { width: 14%; }
        .comp-table td.cross { color: var(--muted); }
        .comp-table td.check svg, .comp-table td.cross svg { display: inline-block; vertical-align: middle; }
        .comp-table .highlight-col { background: var(--accent-soft); font-weight: 600; }
        [data-theme="dark"] .comp-table .highlight-col { background: color-mix(in oklch, var(--accent) 20%, transparent); }
        [data-theme="dark"] .comp-table th:first-child { color: rgba(255,255,255,.90); }
        [data-theme="dark"] .comp-table td:first-child { color: rgba(255,255,255,.90); font-weight: 600; }
        [data-theme="dark"] .comp-table td.cross { color: oklch(65% 0.12 20); }
        [data-theme="dark"] .comp-table td.cross svg { color: inherit; }
        [data-theme="dark"] .comp-table td.check svg { color: var(--green); }
        [data-theme="dark"] .comp-table td { color: var(--muted); }
      `}</style>
      <div className="comp-wrap">
        <table className="comp-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.highlight ? 'highlight-col' : ''}
                  style={col.highlight ? { color: 'var(--fg)' } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {columns.map((col) => {
                  const cell = row[col.key];
                  if (!cell) return <td key={col.key} />;
                  return (
                    <td
                      key={col.key}
                      className={
                        (col.highlight ? 'highlight-col' : '') +
                        (cell.type === 'check' ? ' check' : '') +
                        (cell.type === 'cross' ? ' cross' : '')
                      }
                    >
                      <CellContent cell={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
