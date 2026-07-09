import { Section, Container } from '../components';

export default function FeatureShowcase() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Feature Showcase</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          See OptiFlow OS in action — real feature transformations with before/after comparisons.
        </p>
      </Container>
    </Section>
  );
}
