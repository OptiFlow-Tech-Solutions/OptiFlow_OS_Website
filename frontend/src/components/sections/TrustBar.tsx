import Section from '../Section';
import CountUpMetric from './CountUpMetric';

const LOGOS = ['Textile', 'Manufacturing', 'Trading', 'Warehousing', 'Distribution', 'Logistics', 'Services'];

export default function TrustBar() {
  return (
    <Section background="surface" className="trust-bar">
      <div className="trust-metrics stagger-4">
        <CountUpMetric target={10000} suffix="+" label="Tasks Managed Daily" />
        <CountUpMetric target={500} suffix="+" label="Businesses Onboarded" />
        <CountUpMetric target={95} suffix="%" label="On-Time Completion" />
        <div className="reveal">
          <div className="trust-metric-value num">4.8/5</div>
          <div className="trust-metric-label">Customer Rating</div>
        </div>
      </div>
      <div className="trust-logos-wrap">
        <div className="trust-logos">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} className="trust-logo">{logo}</span>
          ))}
        </div>
      </div>
    </Section>
  );
}
