import { Section, Container } from '../components';

export default function Features() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Features</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Detailed feature breakdown of OptiFlow OS — task management, attendance tracking, SOPs, checklists, reports, and more.
        </p>
      </Container>
    </Section>
  );
}
