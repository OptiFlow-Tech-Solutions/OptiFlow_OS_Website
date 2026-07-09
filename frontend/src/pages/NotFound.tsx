import { Link } from 'react-router-dom';
import { Section, Container, Button } from '../components';

export default function NotFound() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--fs-display, 4rem)', margin: 0 }}>404</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          The page you're looking for doesn't exist. Navigate back to explore OptiFlow OS.
        </p>
        <div style={{ display: 'flex', gap: 'var(--gap-md, 12px)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--gap-lg, 24px)' }}>
          <Button as={Link} to="/" variant="primary">Go to Homepage</Button>
          <Button as={Link} to="/demo-booking" variant="secondary">Book a Demo</Button>
        </div>
        <div style={{ marginTop: 'var(--gap-xl, 32px)' }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Suggested pages:</p>
          <div style={{ display: 'flex', gap: 'var(--gap-md, 12px)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--gap-sm, 8px)' }}>
            <Link to="/product-overview">Product Overview</Link>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
