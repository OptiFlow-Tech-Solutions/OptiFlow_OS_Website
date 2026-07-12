import type { ReactNode } from 'react';
import { Section, Card } from '../../index';
import type { FeatureEntry } from '../../../data/features';
import FeatureProblem from './FeatureProblem';
import FeatureBenefits from './FeatureBenefits';
import FeatureCTA from './FeatureCTA';
import DashboardPreview from './DashboardPreview';
import PhoneFrame from './PhoneFrame';

interface FeatureSectionProps {
  entry: FeatureEntry;
  children?: ReactNode;
}

export default function FeatureSection({ entry, children }: FeatureSectionProps) {
  const { id, heading, lead, problem, cards, benefits, cta, dashboard, processSteps, phoneFrames, layout, dashboardSide } = entry;

  const renderCards = (cols: number) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 'var(--gap-md)',
    }}>
      {cards.map((c, i) => (
        <Card key={i}>
          <h3 style={{ fontSize: 15, marginBottom: 4 }}>{c.heading}</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>{c.body}</p>
        </Card>
      ))}
    </div>
  );

  const renderContent = () => (
    <div>
      {problem && <FeatureProblem>{problem}</FeatureProblem>}
      {cards.length > 0 && renderCards(2)}
      {benefits && <FeatureBenefits items={benefits} />}
    </div>
  );

  if (layout === 'process-steps') {
    return (
      <Section heading={heading} lead={lead}>
        <div id={id} />
        {processSteps && (
          <div style={{
            display: 'flex', gap: 0, position: 'relative',
            maxWidth: 800, margin: '0 auto 44px',
          }}>
            {processSteps.map((step, i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', position: 'relative', paddingTop: 32,
              }}>
                <div style={{
                  position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
                  width: 22, height: 22, borderRadius: '50%',
                  background: step.active ? 'var(--accent)' : 'var(--border)',
                  boxShadow: step.active ? '0 0 12px color-mix(in oklch, var(--accent) 35%, transparent)' : undefined,
                  zIndex: 1,
                }} />
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{step.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.3 }}>{step.example}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)',
        }}>
          {cards.map((c, i) => (
            <Card key={i}>
              <h3>{c.heading}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{c.body}</p>
            </Card>
          ))}
        </div>
        <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
      </Section>
    );
  }

  if (layout === 'grid-only') {
    return (
      <Section heading={heading} lead={lead}>
        <div id={id} />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)',
        }}>
          {cards.map((c, i) => (
            <Card key={i}>
              <h3>{c.heading}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{c.body}</p>
            </Card>
          ))}
        </div>
        <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
      </Section>
    );
  }

  if (layout === 'dashboard-top') {
    return (
      <Section heading={heading} lead={lead}>
        <div id={id} />
        {dashboard && <DashboardPreview data={dashboard} />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)', marginTop: 'var(--gap-lg)' }}>
          {cards.map((c, i) => (
            <Card key={i}>
              <h3>{c.heading}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{c.body}</p>
            </Card>
          ))}
        </div>
        <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
      </Section>
    );
  }

  if (layout === 'mobile') {
    return (
      <Section heading={heading} lead={lead}>
        <div id={id} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-xl)', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)' }}>
              {cards.map((c, i) => (
                <Card key={i} style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>{c.heading}</h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{c.body}</p>
                </Card>
              ))}
            </div>
            {benefits && <FeatureBenefits items={benefits} />}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phoneFrames?.map((pf, i) => (
              <PhoneFrame key={i} {...pf} />
            ))}
          </div>
        </div>
        <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
      </Section>
    );
  }

  return (
    <Section heading={heading} lead={lead}>
      <div id={id} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--gap-xl)',
        alignItems: 'start',
      }}>
        {dashboardSide === 'left' && dashboard && (
          <>
            {children}
            <DashboardPreview data={dashboard} />
          </>
        )}
        {dashboardSide === 'left' && dashboard && renderContent()}
        {(!dashboard || dashboardSide === 'right') && renderContent()}
        {dashboardSide === 'right' && dashboard && <DashboardPreview data={dashboard} />}
      </div>
      <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
    </Section>
  );
}
