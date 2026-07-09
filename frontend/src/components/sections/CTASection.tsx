import { Link } from 'react-router-dom';
import Section from '../Section';
import Button from '../Button';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BULLETS = ['Fast Deployment', 'MSME Focused', 'Dedicated Support', 'Easy Adoption'];

export default function CTASection() {
  return (
    <Section className="cta-section">
      <div className="reveal">
        <h2>Ready To Build A Process-Driven Business?</h2>
      </div>
      <p className="lead reveal reveal-delay-1">
        See how OptiFlow helps MSMEs improve visibility, accountability, execution, and growth — with one operating system.
      </p>
      <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        <Button as={Link} to="/demo-booking" variant="primary" size="lg" glow>Book Free Demo</Button>
        <Button as={Link} to="/product-overview" variant="secondary" size="lg">Watch Product Tour</Button>
      </div>
      <div className="hero-trust reveal reveal-delay-3" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '40px auto 0', justifyContent: 'center', maxWidth: 600 }}>
        {BULLETS.map((b) => (
          <span key={b}><CheckIcon /> {b}</span>
        ))}
      </div>
    </Section>
  );
}
