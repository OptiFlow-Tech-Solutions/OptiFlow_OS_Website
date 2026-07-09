import { Container, Section } from '../components';

export default function Home() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>OptiFlow OS</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          The Business Operating System for Indian MSMEs. Move from people-dependent operations to process-driven growth.
        </p>
      </Container>
    </Section>
  );
}
