import Section from '../Section';

const ROWS = [
  { capability: 'Task Ownership', traditional: 'Verbal / WhatsApp — lost', optiflow: 'Clear owner + deadline + evidence' },
  { capability: 'Accountability', traditional: 'Blame culture, no audit trail', optiflow: 'WWHWE + verification workflow' },
  { capability: 'Visibility', traditional: 'Month-end discovery', optiflow: 'Real-time dashboard, every device' },
  { capability: 'Attendance', traditional: 'Registers / WhatsApp photos', optiflow: 'GPS + selfie + IP, payroll-ready' },
  { capability: 'Approvals', traditional: 'Chased in person or on call', optiflow: 'In-app workflow, instant notification' },
  { capability: 'Reporting', traditional: "One person's Excel, once a month", optiflow: 'Automated, live, exportable' },
  { capability: 'SOPs', traditional: "In someone's head", optiflow: 'Version-controlled SOP library' },
  { capability: 'Scalability', traditional: 'More people = more chaos', optiflow: 'Processes scale, not dependency' },
  { capability: 'MSME Fit', traditional: 'Enterprise software, MSME price', optiflow: 'Built for MSMEs from day one' },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7l3 3 6-6" stroke="#54B89A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function WhyOptiflowComparison() {
  return (
    <Section
      background="dark"
      heading="Why Businesses Choose OptiFlow Over The Status Quo"
      lead="The choice isn't between OptiFlow and another tool. It's between systems that scale and chaos that compounds."
    >
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Capability</th>
              <th className="traditional">Traditional</th>
              <th className="optiflow-col">OptiFlow OS</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.capability}>
                <td>{r.capability}</td>
                <td className="traditional">{r.traditional}</td>
                <td className="optiflow-col">
                  <span className="check"><CheckIcon /></span> {r.optiflow}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
