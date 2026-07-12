import type { ReactNode } from 'react';
import { Card } from '../../index';
import DashboardPreview from './DashboardPreview';
import PhoneFrame from './PhoneFrame';
import FeatureCTA from './FeatureCTA';
import type { ShowcaseEntry } from '../../../data/showcase';

interface ShowcaseTransformProps {
  entry: ShowcaseEntry;
  children?: ReactNode;
}

export default function ShowcaseTransform({ entry, children }: ShowcaseTransformProps) {
  const { id, heading, lead, problem, cost, solutions, metrics, dashboard, phoneFrame, visualSide, cta } = entry;

  const visual = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      <DashboardPreview data={dashboard} />
      {phoneFrame && <PhoneFrame {...phoneFrame} />}
    </div>
  );

  const content = (
    <div>
      {/* Problem Block */}
      <div style={{
        background: 'color-mix(in oklch, oklch(44% 0.16 20) 4%, var(--bg))',
        borderLeft: '3px solid oklch(44% 0.16 20)',
        padding: '16px 20px',
        borderRadius: '0 var(--radius) var(--radius) 0',
        marginBottom: 'var(--gap-md)',
        fontSize: 14,
        color: 'var(--muted)',
      }}>
        <strong style={{ color: 'var(--fg)' }}>The Problem:</strong> {problem}
        <br />
        <span style={{
          display: 'inline-block',
          background: 'color-mix(in oklch, oklch(44% 0.16 20) 10%, transparent)',
          color: 'oklch(44% 0.16 20)',
          padding: '2px 10px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          marginTop: 8,
        }}>{cost}</span>
      </div>

      {/* Solution Cards */}
      <div className="showcase-solutions">
        {solutions.map((s, i) => (
          <Card key={i}>
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.heading}</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>{s.body}</p>
          </Card>
        ))}
      </div>

      {/* Metrics */}
      <div className="showcase-metrics">
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 14,
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{m.val}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.04em' }}>{m.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .showcase-solutions { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gap-xs); margin-bottom: var(--gap-md); }
        .showcase-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-sm); margin-bottom: var(--gap-md); }
        @media (max-width: 1024px) {
          .showcase-solutions, .showcase-metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .showcase-solutions, .showcase-metrics { grid-template-columns: 1fr; }
        }
      `}</style>
      <section className="section feature-section" id={id} data-screen-label={id}>
      <div className="container">
        <div className="section-header reveal">
          <h2>{heading}</h2>
          <p className="lead">{lead}</p>
        </div>

        {children}

        <div className="feature-hero reveal" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--gap-xl)',
          alignItems: 'start',
        }}>
          {visualSide === 'left' && visual}
          {content}
          {visualSide === 'right' && visual}
        </div>

        <FeatureCTA text={cta.text} link={cta.link} label={cta.label} />
      </div>
    </section>
    </>
  );
}
