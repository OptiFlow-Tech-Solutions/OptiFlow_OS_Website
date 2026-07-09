import { useState, useRef, useCallback, useEffect } from 'react';
import { archNodes } from '../../data/productOverview';
import type { ArchNodeData } from '../../data/productOverview';

interface TooltipState {
  visible: boolean;
  data: ArchNodeData;
  x: number;
  y: number;
}

const moduleIcons: Record<string, string> = {
  tasks: '\u2611',
  worklists: '\u2630',
  attendance: '\u270D',
  reports: '\u2699',
  analytics: '\u2630',
  sop: '\u2699',
  training: '\u2605',
  notifications: '\u2709',
  leaves: '\u2600',
  meetings: '\u2611',
  inventory: '\u25A0',
  verification: '\u2713',
};

const nodePositions: Record<string, { top?: string; bottom?: string; left?: string; right?: string }> = {
  tasks:         { top: '44px', left: 'calc(50% - 18px)' },
  worklists:     { top: '70px', left: '90px' },
  attendance:    { top: '70px', right: '90px' },
  reports:       { top: 'calc(50% - 18px)', left: '90px' },
  analytics:     { top: 'calc(50% - 18px)', right: '90px' },
  sop:           { bottom: '54px', left: '90px' },
  training:      { bottom: '34px', left: 'calc(50% - 18px)' },
  notifications: { bottom: '54px', right: '90px' },
  leaves:        { top: '140px', left: '70px' },
  meetings:      { top: '140px', right: '70px' },
  inventory:     { bottom: '140px', left: '70px' },
  verification:  { bottom: '140px', right: '70px' },
};

function TooltipPos({ tooltip, diagramRef }: { tooltip: TooltipState; diagramRef: React.RefObject<HTMLDivElement | null> }) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [adjustedStyle, setAdjustedStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!tooltip.visible || !tipRef.current || !diagramRef.current) return;
    const tip = tipRef.current.getBoundingClientRect();
    const diag = diagramRef.current.getBoundingClientRect();
    const maxX = diag.width - tip.width - 8;
    const maxY = diag.height - tip.height - 8;
    const x = Math.max(8, Math.min(tooltip.x, maxX));
    const y = Math.max(8, Math.min(tooltip.y, maxY));
    setAdjustedStyle({ left: `${x}px`, top: `${y}px` });
  }, [tooltip, diagramRef]);

  return (
    <div
      ref={tipRef}
      className="arch-tooltip"
      style={{
        ...adjustedStyle,
        position: 'absolute',
        zIndex: 10,
        opacity: tooltip.visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px 18px',
        minWidth: 180,
        boxShadow: '0 12px 40px color-mix(in oklch, var(--fg) 10%, transparent)',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: 'var(--accent)' }}>
        {tooltip.data.name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
        {tooltip.data.desc}
      </div>
      <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 6, fontWeight: 500 }}>
        {tooltip.data.benefit}
      </div>
    </div>
  );
}

export default function ArchitectureDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, data: {} as ArchNodeData, x: 0, y: 0 });

  const showTooltip = useCallback((id: string, nodeEl: HTMLElement) => {
    const data = archNodes[id];
    if (!data || !diagramRef.current) return;
    const nodeRect = nodeEl.getBoundingClientRect();
    const diagRect = diagramRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      data,
      x: nodeRect.left - diagRect.left + nodeRect.width + 12,
      y: nodeRect.top - diagRect.top - 10,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div ref={diagramRef} className="arch-diagram" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 420, margin: '40px 0' }}>
      {/* Hub */}
      <div className="arch-hub" style={{ position: 'relative', zIndex: 2, width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--teal))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', lineHeight: 1.2, boxShadow: '0 8px 32px color-mix(in oklch, var(--accent) 35%, transparent)', animation: 'hubPulse 3s ease-in-out infinite' }}>
        OptiFlow<br/>OS
      </div>

      {/* SVG connectors */}
      <svg className="arch-connections" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <line x1="300" y1="220" x2="90" y2="60" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="300" y2="34" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="510" y2="60" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="90" y2="220" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="510" y2="220" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="90" y2="380" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="300" y2="406" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="510" y2="380" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="70" y2="140" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="530" y2="140" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="70" y2="300" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <line x1="300" y1="220" x2="530" y2="300" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4"/>
      </svg>

      {/* Nodes */}
      {Object.entries(nodePositions).map(([id, pos]) => (
        <div
          key={id}
          className="arch-node"
          style={{
            position: 'absolute', zIndex: 3, cursor: 'pointer',
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid var(--border)', background: 'var(--surface)',
            display: 'grid', placeItems: 'center', fontSize: 14,
            transition: 'opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
            ...pos,
          }}
          onMouseEnter={(e) => showTooltip(id, e.currentTarget)}
          onMouseLeave={hideTooltip}
          onFocus={(e) => showTooltip(id, e.currentTarget)}
          onBlur={hideTooltip}
          tabIndex={0}
          role="button"
          aria-label={archNodes[id] ? `${archNodes[id].name} - ${archNodes[id].desc}` : `Node ${id}`}
        >
          {moduleIcons[id] || '\u25CF'}
        </div>
      ))}

      {/* Tooltip */}
      <TooltipPos tooltip={tooltip} diagramRef={diagramRef} />

      {/* Hub pulse keyframes */}
      <style>{`
        @keyframes hubPulse {
          0%, 100% { box-shadow: 0 8px 32px color-mix(in oklch, var(--accent) 35%, transparent); }
          50% { box-shadow: 0 8px 48px color-mix(in oklch, var(--accent) 55%, transparent); }
        }
      `}</style>
    </div>
  );
}
