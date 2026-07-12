import { useState, useEffect, useMemo } from 'react';
import { Section, Container } from '../components';
import ArticleCard, { type Article } from '../components/blog/ArticleCard';
import CategoryFilterBar from '../components/blog/CategoryFilterBar';
import PopularArticles from '../components/blog/PopularArticles';
import NewsletterSignup from '../components/blog/NewsletterSignup';
import ResourceCard from '../components/blog/ResourceCard';
import FeaturedArticle from '../components/blog/FeaturedArticle';
import EmptyState from '../components/blog/EmptyState';

interface Resource {
  id: number;
  title: string;
  description: string;
  file_type: string;
  file_url: string;
  category: string;
  download_count: number;
}

type Status = 'loading' | 'error' | 'success';

export default function Newsletter() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [popular, setPopular] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [articleStatus, setArticleStatus] = useState<Status>('loading');
  const [popularStatus, setPopularStatus] = useState<Status>('loading');
  const [resourceStatus, setResourceStatus] = useState<Status>('loading');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/articles/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setArticles(data.results ?? data);
        setArticleStatus('success');
      })
      .catch(() => setArticleStatus('error'));

    fetch('/api/articles/popular/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setPopular(Array.isArray(data) ? data : []);
        setPopularStatus('success');
      })
      .catch(() => setPopularStatus('error'));

    fetch('/api/resources/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setResources(Array.isArray(data) ? data : []);
        setResourceStatus('success');
      })
      .catch(() => setResourceStatus('error'));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category_name));
    return Array.from(cats).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter((a) => a.category_name.toLowerCase() === activeCategory.toLowerCase());
  }, [articles, activeCategory]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.is_featured) ?? articles[0];
  }, [articles]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      counts[a.category_name] = (counts[a.category_name] ?? 0) + 1;
    });
    return counts;
  }, [articles]);

  if (articleStatus === 'loading') {
    return (
      <Section>
        <Container width="narrow" className="text-center py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-[var(--fg-soft)] rounded mx-auto" />
            <div className="h-4 w-96 bg-[var(--fg-soft)] rounded mx-auto" />
            <div className="grid grid-cols-3 gap-6 mt-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-[var(--fg-soft)] rounded-lg" />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (articleStatus === 'error') {
    return (
      <Section>
        <Container width="narrow" className="text-center py-24">
          <h2>Unable to load articles</h2>
          <p className="lead mt-3 mb-6" style={{ color: 'var(--muted)' }}>
            Something went wrong. Please check your connection and try again.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* SECTION 01: HERO */}
      <section className="section relative overflow-hidden" style={{ paddingTop: 'calc(var(--nav-h) + 60px)', paddingBottom: 80 }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, color-mix(in oklch, var(--accent) 6%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 70%, color-mix(in oklch, var(--teal) 5%, transparent) 0%, transparent 60%)
            `,
          }}
        />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid items-center gap-16" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="hero-content">
              <div className="eyebrow reveal">THE OFFICIAL OPTIFLOW NEWSLETTER</div>
              <h1 className="reveal reveal-delay-1" style={{ marginBottom: 20 }}>
                Insights For Building Better Businesses
              </h1>
              <p className="lead reveal reveal-delay-2" style={{ color: 'var(--muted)', marginBottom: 32 }}>
                Practical strategies, operational frameworks, leadership lessons, and business systems
                designed to help MSMEs scale with accountability and operational excellence.
              </p>
              <div className="hero-cta reveal reveal-delay-3 flex gap-3 flex-wrap mb-8">
                <a href="#articles" className="btn btn-primary btn-lg">Explore Articles</a>
                <a href="#newsletter-signup" className="btn btn-secondary btn-lg">Subscribe</a>
              </div>
              <div className="hero-trust reveal reveal-delay-3 grid grid-cols-2 gap-3">
                {['MSME Focused', 'Actionable Insights', 'Real Business Experience', 'Proven Frameworks'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3 3 7-7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-visual reveal reveal-delay-2 relative" style={{ height: 380 }}>
              {articles.slice(0, 3).map((article, i) => {
                const positions = [
                  { top: 0, left: '10%', width: 280, delay: '0s' },
                  { top: 80, right: '5%', width: 260, delay: '0.6s' },
                  { bottom: 20, left: '25%', width: 240, delay: '1.2s' },
                ];
                const pos = positions[i];
                return (
                  <a
                    key={article.slug}
                    href={`/os/newsletter/${article.slug}`}
                    className="float-card absolute"
                    style={{
                      ...pos,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px 20px',
                      boxShadow: '0 8px 32px color-mix(in oklch, var(--fg) 8%, transparent)',
                      animation: `floatCard 5s ease-in-out infinite`,
                      animationDelay: pos.delay,
                      textDecoration: 'none',
                    }}
                  >
                    <div className="fc-cat" style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {article.category_name}
                    </div>
                    <div className="fc-title" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 8, color: 'var(--fg)' }}>
                      {article.title}
                    </div>
                    <div className="fc-meta" style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {article.read_time} min read — {article.view_count.toLocaleString()} views
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar py-12 border-y overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <Container>
          <div className="trust-metrics grid grid-cols-4 gap-8 text-center mb-6 stagger-4">
            {[
              { value: '500', label: 'Businesses Served' },
              { value: '10,000', label: 'Active Users' },
              { value: '500,000', label: 'Tasks Managed' },
              { value: '1,200', label: 'Departments Managed' },
            ].map((m) => (
              <div key={m.label}>
                <div className="trust-metric-value font-mono text-4xl font-bold" style={{ color: 'var(--accent)' }}>
                  {m.value}
                </div>
                <div className="trust-metric-label text-sm mt-1" style={{ color: 'var(--muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* SECTION 02: FEATURED ARTICLE */}
      {featuredArticle && (
        <Section>
          <Container>
            <div className="section-header reveal mb-10">
              <div className="eyebrow">Editor's Pick</div>
              <h2>Featured Insight</h2>
              <p className="lead" style={{ color: 'var(--muted)' }}>
                Our most impactful piece on building process-driven operations in Indian manufacturing.
              </p>
            </div>
            <div className="reveal">
              <FeaturedArticle article={featuredArticle} />
            </div>
          </Container>
        </Section>
      )}

      {/* SECTION 03: CATEGORIES */}
      <Section>
        <Container>
          <div className="section-header reveal mb-10">
            <h2>Explore By Topic</h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              Curated insights across pillars of operational excellence.
            </p>
          </div>
          <div className="grid-3 stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="cat-card text-center p-6 rounded-lg border transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="cc-icon w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: 'var(--fg)' }}>
                  {cat}
                </h4>
                <p className="cc-count text-sm" style={{ color: 'var(--muted)' }}>
                  {categoryCounts[cat] ?? 0} articles
                </p>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 04: LATEST ARTICLES */}
      <Section id="articles">
        <Container>
          <div className="section-header reveal mb-10">
            <h2>Latest Articles</h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              Fresh perspectives on operations, accountability, and business growth for MSMEs.
            </p>
          </div>
          <div className="reveal">
            <CategoryFilterBar
              categories={categories}
              active={activeCategory}
              onFilter={setActiveCategory}
            />
          </div>
          {filteredArticles.length > 0 ? (
            <div className="stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)' }}>
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => setActiveCategory('all')} />
          )}
        </Container>
      </Section>

      {/* SECTION 05: POPULAR ARTICLES */}
      <Section>
        <Container width="narrow" style={{ maxWidth: 800 }}>
          <div className="section-header reveal mb-10">
            <h2>Most Read This Month</h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              The articles MSME owners and operations leaders are reading most.
            </p>
          </div>
          {popularStatus === 'success' && popular.length > 0 ? (
            <PopularArticles articles={popular} />
          ) : popularStatus === 'loading' ? (
            <div className="animate-pulse" style={{ height: 300, background: 'var(--fg-soft)', borderRadius: 'var(--radius-xl)' }} />
          ) : (
            <p className="text-center" style={{ color: 'var(--muted)' }}>Popular articles coming soon.</p>
          )}
        </Container>
      </Section>

      {/* SECTION 06: NEWSLETTER SIGNUP */}
      <Section id="newsletter-signup">
        <Container>
          <NewsletterSignup />
        </Container>
      </Section>

      {/* SECTION 07: RESOURCES */}
      <Section>
        <Container>
          <div className="section-header reveal mb-10">
            <h2>Free Resources For Growing Businesses</h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              Practical templates, checklists, and frameworks you can use today.
            </p>
          </div>
          {resourceStatus === 'success' && resources.length > 0 ? (
            <div className="stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-md)' }}>
              {resources.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          ) : resourceStatus === 'loading' ? (
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse h-32 rounded-lg" style={{ background: 'var(--fg-soft)' }} />
              ))}
            </div>
          ) : (
            <p className="text-center" style={{ color: 'var(--muted)' }}>Resources coming soon.</p>
          )}
        </Container>
      </Section>

      {/* SECTION 08: FINAL CTA */}
      <section
        className="text-center relative overflow-hidden"
        style={{
          paddingBlock: 'clamp(56px, 8vw, var(--gap-2xl))',
          background: 'linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent) 60%, var(--teal)), var(--teal))',
          color: 'white',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 60%)
            `,
          }}
        />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="reveal" style={{ color: 'white' }}>Ready To Build A More Accountable And Scalable Business?</h2>
          <p className="lead reveal reveal-delay-1 mx-auto mb-8 opacity-90" style={{ maxWidth: '52ch', color: 'white' }}>
            See how OptiFlow helps MSMEs turn operational knowledge into measurable business results.
          </p>
          <div className="cta-row reveal reveal-delay-2 flex justify-center gap-3 flex-wrap mb-8">
            <a href="/os/demo-booking/" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--accent)' }}>
              Book Free Demo
            </a>
            <a href="/os/product-overview/" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>
              Explore OptiFlow
            </a>
          </div>
          <div className="cta-trust reveal reveal-delay-3 flex justify-center gap-6 flex-wrap">
            {['MSME Focused', 'Operational Expertise', 'Business Systems Expertise', 'Dedicated Support'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm opacity-90">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
