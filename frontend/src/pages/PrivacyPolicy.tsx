import { Section, Container } from '../components';

export default function PrivacyPolicy() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Privacy Policy</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Learn how we collect, use, store, and protect your business and employee data.
        </p>
      </Container>
    </Section>
  );
}
