import { Section, Container } from '../components';

export default function Contact() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Contact</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Get in touch with the OptiFlow OS team for demos, sales inquiries, support, or partnership discussions.
        </p>
      </Container>
    </Section>
  );
}
