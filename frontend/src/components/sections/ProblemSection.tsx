import Card from '../Card';
import Section from '../Section';

const PROBLEMS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>,
    title: 'Tasks Get Missed', desc: 'Critical work vanishes into message threads. No one knows what\'s pending, who owns it, or when it was due.', impact: 'Lost Revenue · Delayed Deliveries', roi: 'Fix this: recover ₹5—12L/year in missed billing',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    title: 'No Accountability', desc: 'Without clear ownership, work bounces between people. Blame replaces responsibility when things go wrong.', impact: 'Missed Deadlines · Blame Games', roi: 'Fix this: 40% fewer missed commitments',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    title: 'WhatsApp Chaos', desc: 'Work buried in 20+ groups. Instructions get lost, updates get missed, and nothing is searchable.', impact: 'Duplicated Effort · Confusion', roi: 'Fix this: save 2—4 hours/manager daily',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>,
    title: 'Excel Dependency', desc: 'Spreadsheets live on one person\'s laptop. They break, get overwritten, and can\'t be accessed remotely.', impact: 'Data Loss · Version Conflicts', roi: 'Fix this: one source of truth, always accessible',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    title: 'No Visibility', desc: 'You discover problems at month-end — not in real time. Decisions are based on gut feel, not data.', impact: 'Slow Decisions · Blind Spots', roi: 'Fix this: spot bottlenecks before they cost you',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    title: 'Delayed Follow-Ups', desc: 'Client queries, vendor payments, internal approvals — all slip through when there\'s no tracking.', impact: 'Lost Clients · Late Payments', roi: 'Fix this: eliminate 70% of follow-up delays',
  },
];

export default function ProblemSection() {
  return (
    <Section
      eyebrow="The Problem"
      heading="Growth Stops When Operations Depend On One Person"
      lead="As your business grows, WhatsApp and Excel become liabilities — not tools. Without systems, every new order, employee, and client adds chaos instead of capacity."
    >
      <div className="problem-grid stagger-3">
        {PROBLEMS.map((p) => (
          <Card key={p.title} className="problem-card reveal">
            <div className="problem-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p className="problem-desc">{p.desc}</p>
            <span className="problem-impact">{p.impact}</span>
            <div className="problem-roi">{p.roi}</div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
