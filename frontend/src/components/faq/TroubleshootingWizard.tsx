import { useState } from 'react';
import { TROUBLESHOOTING_TREE } from '../../data';

const categoryOptions = Object.entries(TROUBLESHOOTING_TREE).map(([key, cat]) => ({
  value: key,
  label: cat.label,
}));

export default function TroubleshootingWizard() {
  const [category, setCategory] = useState('');
  const [problemIdx, setProblemIdx] = useState('');
  const [selectedCat, setSelectedCat] = useState(categoryOptions[0]?.value || '');

  const problems = selectedCat && TROUBLESHOOTING_TREE[selectedCat]
    ? Object.entries(TROUBLESHOOTING_TREE[selectedCat].problems)
    : [];

  const resolution = selectedCat && problemIdx !== ''
    ? TROUBLESHOOTING_TREE[selectedCat]?.problems[problemIdx]?.resolution
    : null;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSelectedCat(value);
    setProblemIdx('');
  };

  const handleProblemChange = (value: string) => {
    setProblemIdx(value);
  };

  return (
    <div
      style={{
        maxWidth: 740,
        margin: '0 auto',
        padding: 40,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">-- Select Issue Category --</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={problemIdx}
          onChange={(e) => handleProblemChange(e.target.value)}
          disabled={!selectedCat}
          style={selectStyle}
        >
          <option value="">-- Select Specific Problem --</option>
          {problems.map(([key, prob]) => (
            <option key={key} value={key}>{prob.label}</option>
          ))}
        </select>
      </div>

      {resolution && (
        <div
          style={{
            marginTop: 24,
            padding: '20px 24px',
            background: 'var(--bg)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h4 style={{ fontSize: 18, marginBottom: 8 }}>{resolution.title}</h4>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
            {resolution.desc}
          </p>
          <a
            href={resolution.cta}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            {resolution.ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontSize: 15,
  fontFamily: 'var(--font-body)',
  cursor: 'pointer',
  appearance: 'none' as React.CSSProperties['appearance'],
  WebkitAppearance: 'none' as React.CSSProperties['WebkitAppearance'],
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 18px center',
};
