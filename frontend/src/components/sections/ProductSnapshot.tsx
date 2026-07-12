import Card from '../Card';
import Section from '../Section';

const MODULES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    title: 'Task Management', desc: 'Every task has an owner, deadline, and status. No ambiguity. No lost work.', benefit: 'Outcome: zero missed deliverables',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    title: 'Worklists', desc: 'Tasks, checklists, approvals, and meetings in one unified list. Zero context switching.', benefit: 'Outcome: 30% faster task completion',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    title: 'Attendance', desc: 'GPS, selfie, office, and IP-based attendance. Real-time workforce visibility.', benefit: 'Outcome: accurate payroll, zero disputes',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    title: 'SOP Library', desc: 'Document, version-control, and deploy standard operating procedures across departments.', benefit: 'Outcome: 80% fewer quality escapes',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: 'Reports & Analytics', desc: 'Task, attendance, department, and audit reports — live, exportable, and decision-ready.', benefit: 'Outcome: data-driven decisions, not gut feel',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'Leave Management', desc: 'Leave requests with buddy replacement, auto-task reassignment, and calendar view.', benefit: 'Outcome: zero work stoppage from absenteeism',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    title: 'Team Management', desc: 'Branch, department, and role-based user management with granular permissions.', benefit: 'Outcome: right person, right access, right work',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
    title: 'Helpdesk', desc: 'Internal support ticketing with routing, priority levels, and resolution tracking.', benefit: 'Outcome: zero lost requests, faster resolutions',
  },
];

export default function ProductSnapshot() {
  return (
    <Section background="surface"
      heading="Every Module Delivers Measurable Business Value"
      lead="Not just features — each module is designed to solve a specific operational challenge and produce a clear business outcome."
    >
      <div className="module-grid stagger-4">
        {MODULES.map((m) => (
          <Card key={m.title} className="module-card reveal">
            <div className="module-icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p className="module-desc">{m.desc}</p>
            <div className="module-benefit">{m.benefit}</div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
