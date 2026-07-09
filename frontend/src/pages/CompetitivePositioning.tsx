import { Section, Container } from '../components';

export default function CompetitivePositioning() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Competitive Positioning</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          See how OptiFlow OS compares against WhatsApp chaos, generic SaaS tools, traditional ERPs, and manual systems.
        </p>
      </Container>
    </Section>
  );
}
