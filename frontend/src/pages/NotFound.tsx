import { Link } from 'react-router-dom';
import { Section, Container, Button } from '../components';

export default function NotFound() {
  return (
    <Section>
      <Container width="narrow" className="text-center">
        <h1 className="text-[var(--fs-display,4rem)] m-0">404</h1>
        <p className="lead mt-3 mx-auto">
          The page you're looking for doesn't exist. Navigate back to explore OptiFlow OS.
        </p>
        <div className="flex gap-[var(--gap-md,12px)] justify-center flex-wrap mt-[var(--gap-lg,24px)]">
          <Button as={Link} to="/" variant="primary">Go to Homepage</Button>
          <Button as={Link} to="/demo-booking" variant="secondary">Book a Demo</Button>
        </div>
        <div className="mt-[var(--gap-xl,32px)]">
          <p className="m-0 opacity-80">Suggested pages:</p>
          <div className="flex gap-[var(--gap-md,12px)] justify-center flex-wrap mt-[var(--gap-sm,8px)]">
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
