import { Section, Container } from '../components';

export default function DemoBooking() {
  return (
    <Section>
      <Container width="narrow" style={{ textAlign: 'center' }}>
        <h1>Book a Demo</h1>
        <p className="lead" style={{ margin: '12px auto 0' }}>
          Book a free personalized demo of OptiFlow OS and see how our Business Operating System transforms your MSME operations.
        </p>
      </Container>
    </Section>
  );
}
