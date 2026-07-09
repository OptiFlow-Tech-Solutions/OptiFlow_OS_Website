import { Section, Container } from '../components';

export default function FAQ() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>FAQ & Self-Service</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Find answers about OptiFlow OS or use self-service tools.
        </p>
      </Container>
    </Section>
  );
}
