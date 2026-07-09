import { Section, Container } from '../components';

export default function Pricing() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Pricing & Plans</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Simple, transparent pricing for OptiFlow OS. No per-user charges.
        </p>
      </Container>
    </Section>
  );
}
