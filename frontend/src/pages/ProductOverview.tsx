import { Section, Container } from '../components';

export default function ProductOverview() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Product Overview</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Explore every module of OptiFlow OS — the complete Business Execution platform for MSMEs.
        </p>
      </Container>
    </Section>
  );
}
