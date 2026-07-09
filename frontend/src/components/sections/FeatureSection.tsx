import Card from '../Card';
import Section from '../Section';

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /></svg>,
    title: 'Delegation', desc: 'WWHWE framework — every task has What, Who, How, When, and Evidence.', roi: 'Save 3 hrs/day on status follow-ups',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    title: 'Attendance', desc: 'GPS, selfie, office IP, and shift-based attendance with payroll-ready reports.', roi: 'Eliminate 100% of attendance disputes',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>,
    title: 'SOPs', desc: 'Version-controlled SOP library with department-level access and acknowledgement tracking.', roi: '80% reduction in process deviations',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
    title: 'Dashboard', desc: 'Real-time KPI dashboard with task completion, attendance, and department performance.', roi: 'Spot problems in minutes, not weeks',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>,
    title: 'Helpdesk', desc: 'Internal ticketing with department routing, priority levels, and resolution time-tracking.', roi: '50% faster issue resolution',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: 'Analytics', desc: 'Department-level analytics with trend detection, comparisons, and exportable reports.', roi: 'Better decisions, faster growth',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    title: 'Leave', desc: 'Buddy replacement, auto-task reassignment, leave calendar, and approval workflow.', roi: 'Zero work stoppage when people are away',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'Audit Logs', desc: 'Full activity trail — every task, approval, and change timestamped and attributable.', roi: '100% audit-ready, zero panic',
  },
];

export default function FeatureSection() {
  return (
    <Section background="surface"
      heading="Built For The Way MSMEs Actually Operate"
      lead="Every feature was designed after studying how textile, manufacturing, trading, and distribution businesses really work — not how software companies think they should work."
    >
      <div className="feature-grid stagger-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="feature-item reveal">
            <div className="feature-mark">{f.icon}</div>
            <h3>{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
            <div className="feature-roi">{f.roi}</div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
