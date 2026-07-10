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
              <div className="flex items-center gap-4 mb-4 p-3 bg-bg rounded-[var(--radius)]">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">ST</div>
                <div>
                  <div className="font-semibold text-sm">Sanjay Tiwari → Ruchi Mehta</div>
                  <div className="text-xs text-muted">3 active tasks reassigned</div>
                </div>
                <span className="ml-auto inline-block px-[10px] py-0.5 rounded-[20px] text-[11px] font-semibold bg-green-soft text-green">Done</span>
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
          <div className="flex gap-[var(--gap-sm)] justify-center flex-wrap">
            <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
          <div className="grid grid-cols-4 justify-items-center mt-7">
            <span className="flex items-center gap-2 text-sm text-muted">
              <CheckIcon /> MSME Focused
            </span>
            <span className="flex items-center gap-2 text-sm text-muted">
              <CheckIcon /> Fast Deployment
            </span>
            <span className="flex items-center gap-2 text-sm text-muted">
              <CheckIcon /> Easy Adoption
            </span>
            <span className="flex items-center gap-2 text-sm text-muted">
              <CheckIcon /> Dedicated Support
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
