import { workflowSteps } from '../../data/productOverview';

const stepColors = ['var(--accent)', 'var(--teal)', 'var(--green)', 'var(--lime)', 'var(--accent)'];

export default function WorkflowEngine() {
  return (
    <div className="workflow-flow" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 12, margin: '40px 0', flexWrap: 'wrap' }}>
      {workflowSteps.map((step, i) => (
        <>
          {i > 0 && (
            <div className="workflow-connector" style={{ display: 'flex', alignItems: 'center', color: 'var(--border)', flexShrink: 0, paddingTop: 42 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          )}
          <div
            key={step.num}
            className={`workflow-step wf-s${step.num}`}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center',
              minWidth: 160, flex: 1, maxWidth: 200,
              transition: 'background 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%', fontFamily: 'var(--font-mono)',
              fontSize: 14, fontWeight: 700, marginBottom: 12,
              background: `color-mix(in oklch, ${stepColors[i]} 12%, transparent)`, color: stepColors[i],
            }}>
              {step.num}
            </span>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>{step.title}</h4>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--teal)', marginTop: 8 }}>{step.example}</div>
          </div>
        </>
      ))}
    </div>
  );
}
