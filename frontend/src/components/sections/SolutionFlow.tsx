import Section from '../Section';

export default function SolutionFlow() {
  return (
    <Section
      heading="From Operational Chaos To Predictable Growth"
      lead="OptiFlow OS replaces disconnected tools with one unified platform — so your business runs on processes, not people."
    >
      <div className="solution-visual reveal">
        <div className="solution-stage chaos">Scattered WhatsApp · Excel · Memory</div>
        <div className="solution-arrow" style={{ fontSize: 20, color: 'var(--muted)' }}>↓</div>
        <div className="solution-stage optiflow">OptiFlow OS — Unified Operations</div>
        <div className="solution-arrow" style={{ fontSize: 20, color: 'var(--green)' }}>↓</div>
        <div className="solution-stage excellence">Predictable · Accountable · Scalable</div>
        <div className="solution-modules">
          {['Tasks', 'Attendance', 'SOPs', 'Reports', 'Teams', 'Checklists', 'Leaves', 'Analytics'].map((m) => (
            <span key={m} className="solution-module">{m}</span>
          ))}
        </div>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 20, textAlign: 'center', maxWidth: 500 }}>
          One platform. Eight integrated modules. Zero chaos.
        </p>
      </div>
    </Section>
  );
}
