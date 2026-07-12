import Card from '../Card';
import Section from '../Section';

const TESTIMONIALS = [
  { quote: '"Before OptiFlow, I was spending 3 hours every evening just following up. Now I open the dashboard and see everything. My team completes 92% of tasks on time without me chasing."', name: 'Amit Kumar', role: 'MD, Vertex Manufacturing', outcome: 'Result: 80% fewer follow-ups. Saved 3 hrs/day.' },
  { quote: '"We had 47 employees across two shifts. Attendance reconciliation took 4 hours every month-end. With OptiFlow, it\'s real-time. Payroll disputes dropped to zero."', name: 'Neha Sharma', role: 'HR Head, Apex Textiles', outcome: 'Result: Payroll accuracy 100%. Zero disputes.' },
  { quote: '"We run 3 warehouses across Gujarat and Maharashtra. Before OptiFlow, I had no visibility beyond phone calls. Now every dispatch, every checklist, every SOP is tracked in one place."', name: 'Rajesh Patel', role: 'Owner, SwiftLog Logistics', outcome: 'Result: 40% faster dispatch. 100% multi-location visibility.' },
];

const STATS = [
  { value: '80%', label: 'Fewer Follow-Ups' },
  { value: '95%', label: 'Accountability Score' },
  { value: '92%', label: 'On-Time Completion' },
  { value: '100%', label: 'Audit Readiness' },
];

const AvatarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function TestimonialSection() {
  return (
    <Section
      heading="Real Results From Real Businesses"
      lead="Hear from MSME owners who transformed their operations with OptiFlow."
    >
      <div className="testimonial-grid stagger-3">
        {TESTIMONIALS.map((t, i) => (
          <Card key={i} className="testimonial-card reveal">
            <div className="testimonial-quote">{t.quote}</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar"><AvatarIcon /></div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
            <div className="testimonial-outcome">{t.outcome}</div>
          </Card>
        ))}
      </div>
      <div className="testimonial-stats reveal">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="testimonial-stat-value">{s.value}</div>
            <div className="testimonial-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
