import Section from '../Section';

const STEPS = [
  { num: '01', title: 'Create Process', desc: 'Define the workflow: what, who, when, and how verification works.', outcome: 'Clarity in under 60 seconds' },
  { num: '02', title: 'Assign Doer', desc: 'Delegate work with clear ownership. No ambiguity. No "I thought someone else..."', outcome: 'Accountability from day one' },
  { num: '03', title: 'Track Work', desc: 'Monitor progress in real time. See every task, every department, every stage.', outcome: 'Full visibility, zero follow-ups' },
  { num: '04', title: 'Generate Reports', desc: 'Automated reports for owners, managers, and auditors. One click, always ready.', outcome: 'Data-driven decisions, not gut feel' },
];

export default function HowItWorks() {
  return (
    <Section
      heading="Go From Chaos To Clarity In Four Steps"
      lead="OptiFlow is designed for speed — your team starts using it within days, not weeks."
    >
      <div className="steps stagger-4">
        {STEPS.map((s) => (
          <div key={s.num} className="step reveal">
            <div className="step-number">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="step-outcome">{s.outcome}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
