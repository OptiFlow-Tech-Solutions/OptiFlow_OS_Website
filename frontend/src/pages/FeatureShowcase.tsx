import { Link } from 'react-router-dom';
import { useScrollSpy } from '../hooks';
import { showcase } from '../data';
import { Container, Button } from '../components';
import EcosystemHub from '../components/sections/features/EcosystemHub';
import FeatureNav from '../components/sections/features/FeatureNav';
import ShowcaseTransform from '../components/sections/features/ShowcaseTransform';
import FeaturesStyles from '../components/sections/features/FeaturesStyles';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 15, height: 15, color: 'var(--green)', flexShrink: 0, strokeWidth: 2 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const navItems = showcase.map((s) => ({ id: s.id, label: s.label }));

export default function FeatureShowcase() {
  const activeId = useScrollSpy(showcase.map((s) => s.id));

  return (
    <>
      <FeaturesStyles />

      <FeatureNav items={navItems} activeId={activeId} />

      {/* Hero */}
      <section className="hero" data-screen-label="00 Hero">
        <div className="hero-grid container">
          <div className="hero-content reveal">
            <div className="eyebrow">Feature Transformations</div>
            <h1>See What OptiFlow OS Actually Does For Your Business.</h1>
            <p className="lead">
              Six core features. Real operational problems. Tangible outcomes. See exactly how OptiFlow transforms daily chaos into predictable, measurable results — with actual dashboards, not abstract promises.
            </p>
            <div className="hero-cta">
              <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
              <Button as={Link} to="/os/features/" variant="secondary" size="lg">Explore All Features</Button>
            </div>
            <div className="hero-trust">
              <span><CheckIcon /> 6 Feature Deep-Dives</span>
              <span><CheckIcon /> Before & After Comparisons</span>
              <span><CheckIcon /> Real Outcome Metrics</span>
              <span><CheckIcon /> Dual Device Previews</span>
            </div>
          </div>
          <div className="hero-visual reveal">
            <EcosystemHub />
          </div>
        </div>
      </section>

      {/* Transformation Sections */}
      {showcase.map((entry) => {
        if (entry.id === 'leave') {
          return (
            <ShowcaseTransform key={entry.id} entry={entry}>
              <div className="reveal flex items-center gap-4 mb-4 p-3 bg-bg rounded-[var(--radius)]">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">ST</div>
                <div>
                  <div className="font-semibold text-sm">Sanjay T. → Ruchi M.</div>
                  <div className="text-xs text-muted">3 active tasks reassigned</div>
                </div>
                <span className="ml-auto inline-block px-[10px] py-0.5 rounded-[20px] text-[11px] font-semibold bg-green-soft text-green">Done</span>
              </div>
            </ShowcaseTransform>
          );
        }

        return <ShowcaseTransform key={entry.id} entry={entry} />;
      })}

      {/* Bottom CTA */}
      <section className="cta-section" data-screen-label="07 CTA">
        <Container className="reveal">
          <h2>Ready To See Your Operations Transformed?</h2>
          <p className="lead">
            Every feature shown here is live in OptiFlow OS today. Book a personalized demo and see exactly how these transformations apply to your business.
          </p>
          <div className="flex gap-[var(--gap-sm)] justify-center flex-wrap">
            <Button as={Link} to="/os/demo-booking/" size="lg">Book Free Demo</Button>
            <Button as={Link} to="/os/product-overview/" variant="secondary" size="lg">Watch Product Tour</Button>
          </div>
          <div className="grid grid-cols-4 justify-items-center mt-7">
            <span className="flex items-center gap-2 text-sm text-[color-mix(in_oklch,white_80%,transparent)]">
              <CheckIcon /> Built For MSMEs
            </span>
            <span className="flex items-center gap-2 text-sm text-[color-mix(in_oklch,white_80%,transparent)]">
              <CheckIcon /> Fast Deployment
            </span>
            <span className="flex items-center gap-2 text-sm text-[color-mix(in_oklch,white_80%,transparent)]">
              <CheckIcon /> Easy Adoption
            </span>
            <span className="flex items-center gap-2 text-sm text-[color-mix(in_oklch,white_80%,transparent)]">
              <CheckIcon /> Dedicated Support
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
