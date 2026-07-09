import { useState } from 'react';
import { primaryModules, secondaryModules } from '../../data/productOverview';
import type { ModuleData } from '../../data/productOverview';

const moduleIconSvgs: Record<string, React.ReactNode> = {
  check:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  clock:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  doc:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  chart:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  list:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  shield:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  star:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>,
  mail:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/><path d="M15 17v2a3 3 0 0 1-6 0v-2"/></svg>,
  sun:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  checklist: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 12 11 14 15 10"/></svg>,
  box:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  verify:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
};

function ModuleCard({ module: m }: { module: ModuleData }) {
  return (
    <div className="module-card" style={{ display: 'flex', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease' }}>
      <div className="module-icon" style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'color-mix(in oklch, var(--accent) 10%, transparent)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0, color: 'var(--accent)' }}>
        {moduleIconSvgs[m.icon]}
      </div>
      <div className="module-body" style={{ flex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>{m.name}</h4>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.5 }}>{m.desc}</p>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)' }}>{m.benefit}</div>
      </div>
    </div>
  );
}

export default function ModuleSpotlight() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Primary 6 modules */}
      <div className="module-spotlight" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--gap-md)' }}>
        {primaryModules.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>

      {/* Toggle button */}
      <div style={{ textAlign: 'center' }}>
        <button
          className={`show-all-btn${expanded ? ' open' : ''}`}
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            margin: '28px auto 0', padding: '12px 28px',
            borderRadius: 'var(--radius)', border: '1px solid var(--accent)',
            color: 'var(--accent)', fontWeight: 600, fontSize: 14,
            background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          {expanded ? 'Show less' : 'Show all 12 modules'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, transition: 'transform 0.3s ease', transform: expanded ? 'rotate(180deg)' : 'none' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Expandable secondary 6 modules */}
      <div
        className="module-expand-wrap"
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap-md)',
            marginTop: 'var(--gap-md)',
          }}>
            {secondaryModules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ponytail: responsive handled by ProductOverviewStyles, not inline here
