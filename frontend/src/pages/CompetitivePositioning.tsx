import { Link } from 'react-router-dom';
import { Section, Container, Button, Card } from '../components';
import ComparisonTable from '../components/sections/ComparisonTable';
import QuadrantGrid from '../components/sections/competitive/QuadrantGrid';
import CostComparison from '../components/sections/competitive/CostComparison';
import {
  quadrantEntries,
  matrixColumns,
  matrixRows,
  costCardEntries,
  standoutEntries,
} from '../data';

export default function CompetitivePositioning() {
  return (
    <>
      <style>{`
        .cp-hero { padding-top: calc(var(--nav-h) + 72px); padding-bottom: 72px; position: relative; overflow: hidden; }
        .cp-hero::before { content: ''; position: absolute; top: -40%; right: -15%; width: 70%; height: 150%; background: radial-gradient(ellipse at center, color-mix(in oklch, var(--accent) 6%, transparent) 0%, color-mix(in oklch, var(--teal) 4%, transparent) 40%, transparent 70%); pointer-events: none; }
        .cp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .cp-hero-content { position: relative; z-index: 2; }
        .cp-hero-content h1 { margin-bottom: 20px; }
        .cp-hero-content .lead { margin-bottom: 32px; }
        .cp-hero-cta { display: flex; gap: var(--gap-sm); flex-wrap: wrap; }
        .cp-standout-icon { width: 52px; height: 52px; display: grid; place-items: center; background: color-mix(in oklch, var(--accent) 12%, transparent); border-radius: var(--radius-lg); margin: 0 auto 18px; color: var(--accent); }
        .cp-standout-icon svg { width: 24px; height: 24px; }
        .cp-standout-card { text-align: center; padding: 36px 24px; }
        .cp-standout-card h3 { font-size: 17px; margin-bottom: 8px; color: var(--fg); }
        .cp-standout-card p { font-size: 14px; color: var(--muted); line-height: 1.5; }

        [data-theme="dark"] .cp-standout-icon { background: rgba(39,141,159,.18); color: var(--teal); }
        [data-theme="dark"] .cp-standout-card h3 { color: var(--fg); }

        @media (max-width: 1024px) {
          .cp-hero-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>

      {/* Hero */}
      <section className="cp-hero">
        <Container className="cp-hero-grid reveal">
          <div className="cp-hero-content">
            <h1>How OptiFlow OS compares to the alternatives</h1>
            <p className="lead">Every MSME grapples with the same question: stick with familiar chaos, try a generic tool, invest in a heavy ERP — or choose something built for operators. Here's the honest comparison.</p>
            <div className="cp-hero-cta">
              <Button as={Link} to="/os/demo-booking/" size="lg">Book a Free Demo</Button>
              <Button as={Link} to="/os/pricing/" variant="secondary" size="lg">See Pricing</Button>
            </div>
          </div>
          <div className="hero-visual">
            <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 400 }}>
              <rect x="40" y="20" width="140" height="80" rx="8" fill="color-mix(in oklch, var(--accent) 15%, transparent)" stroke="var(--accent)" strokeWidth="1.5" />
              <text x="110" y="65" textAnchor="middle" fontFamily="system-ui" fontSize="13" fontWeight="700" fill="var(--fg)">OptiFlow OS</text>
              <rect x="220" y="20" width="140" height="38" rx="8" fill="color-mix(in oklch, oklch(55% 0.22 25) 12%, transparent)" stroke="oklch(55% 0.22 25)" strokeWidth="1" strokeDasharray="4 2" />
              <text x="290" y="44" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="color-mix(in oklch, var(--fg) 50%, transparent)">WhatsApp/Excel</text>
              <rect x="220" y="62" width="140" height="38" rx="8" fill="color-mix(in oklch, oklch(65% 0.18 45) 12%, transparent)" stroke="oklch(65% 0.18 45)" strokeWidth="1" strokeDasharray="4 2" />
              <text x="290" y="86" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="color-mix(in oklch, var(--fg) 50%, transparent)">Generic SaaS</text>
              <rect x="40" y="140" width="140" height="38" rx="8" fill="color-mix(in oklch, var(--muted) 12%, transparent)" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 2" />
              <text x="110" y="164" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="color-mix(in oklch, var(--fg) 50%, transparent)">Traditional ERP</text>
              <rect x="220" y="140" width="140" height="38" rx="8" fill="color-mix(in oklch, var(--muted) 12%, transparent)" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 2" />
              <text x="290" y="164" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="color-mix(in oklch, var(--fg) 50%, transparent)">Manual Paper</text>
              <line x1="110" y1="100" x2="110" y2="140" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="290" y1="100" x2="290" y2="140" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="200" y="210" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="var(--muted)">One platform. All solved.</text>
            </svg>
          </div>
        </Container>
      </section>

      {/* Quadrant Grid */}
      <Section>
        <Container>
          <div className="section-header reveal">
            <h2>The Competitive Landscape</h2>
            <p className="lead" style={{ maxWidth: 680, margin: '0 auto' }}>MSMEs typically rely on one of four approaches. Each solves part of the problem — none solves it all.</p>
          </div>
          <QuadrantGrid
            entries={quadrantEntries}
            centerTitle="OptiFlow OS"
            centerSubtitle="All 4 solved\nin one platform"
          />
        </Container>
      </Section>

      {/* Feature Matrix */}
      <Section>
        <Container>
          <div className="section-header reveal">
            <h2>Feature-by-Feature Comparison</h2>
            <p className="lead" style={{ maxWidth: 720, margin: '0 auto' }}>A transparent look at how OptiFlow OS stacks up across the capabilities that matter for daily operations.</p>
          </div>
          <ComparisonTable columns={matrixColumns} rows={matrixRows} />
        </Container>
      </Section>

      {/* Cost Comparison */}
      <section className="section section-dark reveal">
        <Container>
          <CostComparison
            entries={costCardEntries}
            sectionHeading="What You Actually Pay — Annual Cost Comparison"
            sectionLead="Based on a typical 25-employee MSME. Real numbers, no surprises."
          />
          <p style={{
            textAlign: 'center', marginTop: 24,
            color: 'color-mix(in oklch, white 78%, transparent)',
            fontSize: 14,
          }}>
            Want the full pricing breakdown?{' '}
            <Link to="/os/pricing/" style={{ color: 'var(--lime)', fontWeight: 600 }}>See detailed pricing plans</Link>
          </p>
        </Container>
      </section>

      {/* Standout Cards */}
      <Section>
        <Container>
          <div className="section-header reveal">
            <h2>Why OptiFlow OS Stands Apart</h2>
            <p className="lead" style={{ maxWidth: 640, margin: '0 auto' }}>Three things no competitor offers — and why they matter for your business.</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap-md)',
          }} className="stagger-3">
            {standoutEntries.map((entry, i) => (
              <Card key={i} className="cp-standout-card reveal">
                <div className="cp-standout-icon">
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  )}
                </div>
                <h3>{entry.heading}</h3>
                <p>{entry.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <section className="cta-section reveal">
        <Container style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: 16 }}>See the difference yourself</h2>
          <p style={{ color: 'color-mix(in oklch, white 78%, transparent)', maxWidth: 560, margin: '0 auto 32px', fontSize: 18, lineHeight: 1.6 }}>
            Book a free personalized demo. We'll show you how OptiFlow OS replaces chaos with clarity — in 30 minutes.
          </p>
          <div style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button as={Link} to="/os/demo-booking/" size="lg">Book a Free Demo</Button>
            <Button as={Link} to="/os/contact/" variant="secondary" size="lg">Talk to Sales</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
