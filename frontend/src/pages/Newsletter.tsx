import { Section, Container } from '../components';

export default function Newsletter() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Newsletter</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Practical strategies, operational frameworks, and business systems for Indian MSMEs.
        </p>
      </Container>
    </Section>
  );
}
