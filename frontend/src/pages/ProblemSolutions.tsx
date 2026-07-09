import { Section, Container } from '../components';

export default function ProblemSolutions() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Problems & Solutions</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          See how OptiFlow OS solves the 6 biggest operational challenges Indian MSMEs face daily.
        </p>
      </Container>
    </Section>
  );
}
