import Section from '../Section';
import { useCardTilt } from '../../hooks/useCardTilt';

const IMPACTS = [
  { title: 'Revenue Leakage', desc: 'Delayed invoicing, unbilled work, missed payment follow-ups', cost: '₹8—15L/yr' },
  { title: 'Productivity Drain', desc: '2—4 hrs/day wasted on chasing status updates', cost: '₹12—20L/yr' },
  { title: 'Delivery Penalties', desc: 'Late orders, client escalations, lost repeat business', cost: '₹5—10L/yr' },
  { title: 'Key-Person Risk', desc: 'Operations depend on 2—3 people — losing one halts everything', cost: '₹10—25L/yr' },
  { title: 'Founder Burnout', desc: "You're the bottleneck. Every problem escalates to you.", cost: 'Growth Ceiling' },
];

export default function CostOfInaction() {
  const tilt = useCardTilt();

  return (
    <Section background="dark"
      heading="Every Day Without A System, Money Leaks"
      lead="The real cost isn't software — it's the revenue, productivity, and growth you lose every day you operate without structure."
    >
      <div className="impact-grid stagger-5">
        {IMPACTS.map((item) => (
          <div key={item.title} className="reveal card-tilt" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
            <div className="card-base impact-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="impact-cost num">{item.cost}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
