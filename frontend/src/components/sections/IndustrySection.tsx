import Card from '../Card';
import Section from '../Section';

const INDUSTRIES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>,
    title: 'Textile', challenge: 'Challenge: QC checklists skipped, dye batch variance, shift handover gaps.', solution: 'Solution: SOP library + shift-wise checklists + real-time compliance dashboard.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>,
    title: 'Manufacturing', challenge: 'Challenge: Machine maintenance missed, purchase approvals delayed, production delays invisible.', solution: 'Solution: WWHWE tasks + approval workflow + live production KPI dashboard.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    title: 'Trading', challenge: 'Challenge: Sales follow-ups forgotten, client commitments missed, invoice tracking scattered.', solution: 'Solution: Task automation + deadline alerts + payment tracking workflow.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 21 13 16 18 16 8" /></svg>,
    title: 'Warehousing', challenge: 'Challenge: Dispatch pick-lists outdated, inventory visibility low, stock mismatch errors.', solution: 'Solution: Checklist management + real-time task tracking + audit-ready reports.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    title: 'Distribution', challenge: 'Challenge: Multi-location visibility absent, field team accountability gaps, delivery delays.', solution: 'Solution: GPS attendance + multi-branch reporting + automated task delegation.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    title: 'Logistics', challenge: 'Challenge: Driver attendance, vehicle checklist compliance, delivery confirmation delays.', solution: 'Solution: Selfie attendance + daily checklists + mobile task confirmation.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    title: 'Services', challenge: 'Challenge: Team utilization invisible, client project progress untracked, billing delayed.', solution: 'Solution: Worklist management + time tracking + automated reporting.',
  },
];

export default function IndustrySection() {
  return (
    <Section
      heading="Built For Seven Industries. Proven In All Of Them."
      lead="OptiFlow is not generic software. It's designed around how textile units, factories, trading firms, warehouses, distribution networks, logistics operators, and service companies actually work."
    >
      <div className="industry-grid stagger-4">
        {INDUSTRIES.map((ind) => (
          <Card key={ind.title} className="industry-card reveal">
            <div className="industry-icon">{ind.icon}</div>
            <h3>{ind.title}</h3>
            <p className="ind-challenge">{ind.challenge}</p>
            <div className="ind-solution">{ind.solution}</div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
