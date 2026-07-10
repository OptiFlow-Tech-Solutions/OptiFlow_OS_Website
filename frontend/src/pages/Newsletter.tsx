import { Section, Container } from '../components';

export default function Newsletter() {
  return (
    <Section>
      <Container width="narrow" className="text-center">
        <h1>Newsletter</h1>
        <p className="lead mt-3 mx-auto">
          Practical strategies, operational frameworks, and business systems for Indian MSMEs.
        </p>
      </Container>
    </Section>
  );
}
