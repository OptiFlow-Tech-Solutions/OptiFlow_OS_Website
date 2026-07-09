import { Link } from 'react-router-dom';
import { useScrollSpy } from '../hooks';
import { features } from '../data';
import { Container, Button } from '../components';
import EcosystemHub from '../components/sections/features/EcosystemHub';
import FeatureNav from '../components/sections/features/FeatureNav';
import FeatureSection from '../components/sections/features/FeatureSection';
import FeaturesStyles from '../components/sections/features/FeaturesStyles';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 15, height: 15, color: 'var(--green)', flexShrink: 0, strokeWidth: 2 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const navItems = features.map((f) => ({ id: f.id, label: f.label }));

export default function Features() {
  const activeId = useScrollSpy(features.map((f) => f.id));

  return (
    <>
      <FeaturesStyles />

      {/* Feature Nav */}
      <FeatureNav items={navItems} activeId={activeId} />

      {/* Hero */}
      <section className="hero" data-screen-label="01 Hero">
        <div className="hero-grid container">
          <div className="hero-content reveal">
            <div className="eyebrow">Business Operating System For MSMEs</div>
            <h1>Everything Your Business Needs To Run Smoothly.</h1>
            <p className="lead">
              From Task Management and SOPs to Attendance, Reporting, Accountability, and Team Execution — OptiFlow OS brings every operational process into one unified platform built for Indian MSMEs.
            </p>
            <div className="hero-cta">
              <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
              <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Product Tour</Button>
            </div>
            <div className="hero-trust">
              <span><CheckIcon /> Built For MSMEs</span>
              <span><CheckIcon /> Fast Deployment</span>
              <span><CheckIcon /> Easy Adoption</span>
              <span><CheckIcon /> Process Driven Operations</span>
            </div>
          </div>
          <div className="hero-visual reveal">
            <EcosystemHub />
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((entry) => {
        if (entry.id === 'leave') {
          return (
            <FeatureSection key={entry.id} entry={entry}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                marginBottom: 16, padding: 12,
                background: 'var(--bg)', borderRadius: 'var(--radius)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14,
                }}>ST</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Sanjay Tiwari → Ruchi Mehta</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>3 active tasks reassigned</div>
                </div>
                <span style={{
                  marginLeft: 'auto', display: 'inline-block', padding: '2px 10px',
                  borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: 'var(--green-soft)', color: 'var(--green)',
                }}>Done</span>
              </div>
            </FeatureSection>
          );
        }
        return <FeatureSection key={entry.id} entry={entry} />;
      })}

      {/* Bottom CTA */}
      <section className="cta-section" data-screen-label="14 CTA">
        <Container className="reveal">
          <h2>Ready To See Every Feature In Action?</h2>
          <p className="lead">
            Discover how OptiFlow helps MSMEs improve accountability, visibility, productivity, and growth through one powerful operating system.
          </p>
          <div style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center',
            marginTop: 28, color: 'color-mix(in oklch, white 80%, transparent)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <CheckIcon /> MSME Focused
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <CheckIcon /> Fast Deployment
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <CheckIcon /> Easy Adoption
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <CheckIcon /> Dedicated Support
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
