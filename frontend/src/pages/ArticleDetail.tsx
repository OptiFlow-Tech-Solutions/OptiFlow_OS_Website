import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components';
import ReadingProgressBar from '../components/blog/ReadingProgressBar';

interface ArticleDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: { id: number; name: string; slug: string };
  author: string;
  read_time: number;
  featured_image: string;
  published_at: string;
  view_count: number;
}

type Status = 'loading' | 'error' | 'success' | 'not-found';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!slug) return;
    setStatus('loading');
    fetch(`/api/articles/${slug}/`)
      .then((res) => {
        if (res.status === 404) {
          setStatus('not-found');
          return null;
        }
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setArticle(data);
          setStatus('success');
        }
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="py-24">
        <ReadingProgressBar />
        <Container width="narrow" style={{ maxWidth: 780 }}>
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 bg-[var(--fg-soft)] rounded" />
            <div className="h-10 w-full bg-[var(--fg-soft)] rounded" />
            <div className="h-4 w-64 bg-[var(--fg-soft)] rounded" />
            <div className="space-y-3 mt-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-4 bg-[var(--fg-soft)] rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="py-24 text-center">
        <Container width="narrow">
          <h2>Article Not Found</h2>
          <p className="lead mt-3 mb-6" style={{ color: 'var(--muted)' }}>
            This article could not be found. It may have been removed or the link may be incorrect.
          </p>
          <Link to="/newsletter" className="btn btn-primary">
            Back to Newsletter
          </Link>
        </Container>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-24 text-center">
        <Container width="narrow">
          <h2>Unable to load article</h2>
          <p className="lead mt-3 mb-6" style={{ color: 'var(--muted)' }}>
            Something went wrong. Please try again.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </Container>
      </div>
    );
  }

  if (!article) return null;

  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <ReadingProgressBar />
      <main id="content" role="main">
        <article className="py-16" style={{ paddingTop: 'calc(var(--nav-h) + 40px)' }}>
          <Container width="narrow" style={{ maxWidth: 780 }}>
            <Link
              to="/newsletter"
              className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Newsletter
            </Link>

            <div
              className="article-cat font-mono text-xs tracking-widest uppercase font-semibold mb-3"
              style={{ color: 'var(--teal)' }}
            >
              {article.category.name}
            </div>
            <h1
              style={{
                fontSize: 'clamp(28px, 4.5vw, 44px)',
                marginBottom: 16,
                letterSpacing: '-0.02em',
              }}
            >
              {article.title}
            </h1>

            <div
              className="article-meta flex gap-4 items-center flex-wrap mb-8 pb-6"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="meta text-sm" style={{ color: 'var(--muted)' }}>{article.author}</span>
              <span className="meta text-sm" style={{ color: 'var(--muted)' }}>&mdash;</span>
              <span className="meta text-sm" style={{ color: 'var(--muted)' }}>{article.read_time} min read</span>
              <span className="meta text-sm" style={{ color: 'var(--muted)' }}>&mdash;</span>
              <span className="meta text-sm" style={{ color: 'var(--muted)' }}>{date}</span>
              <span className="meta text-sm ml-auto" style={{ color: 'var(--muted)' }}>{article.view_count.toLocaleString()} views</span>
            </div>

            <div
              className="article-content"
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: 'var(--fg)',
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </Container>
        </article>

        {/* Newsletter CTA */}
        <section className="section">
          <Container width="narrow" style={{ maxWidth: 780 }}>
            <div
              className="newsletter-box text-center p-10 rounded-2xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ marginBottom: 12 }}>Enjoyed this article?</h3>
              <p className="lead mb-6" style={{ color: 'var(--muted)' }}>
                Get weekly operational insights delivered to your inbox.
              </p>
              <form
                className="form-capture flex gap-3 max-w-md mx-auto"
                name="newsletter"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  try {
                    const res = await fetch('/api/newsletter/subscribe/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, source: 'article' }),
                    });
                    if (res.ok) {
                      form.innerHTML = '<div style="font-size:48px;margin-bottom:16px">&#10003;</div><h3>Subscribed!</h3><p style="color:var(--muted)">Check your inbox for our next issue.</p>';
                    }
                  } catch {}
                }}
              >
                <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' }} />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3.5 text-sm border rounded-lg focus:outline-none"
                  style={{ background: 'var(--bg)', color: 'var(--fg)', borderColor: 'var(--border)', fontFamily: 'inherit' }}
                />
                <button type="submit" className="btn btn-primary whitespace-nowrap">Subscribe</button>
              </form>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section
          className="text-center relative overflow-hidden mt-16"
          style={{
            paddingBlock: 'clamp(56px, 8vw, var(--gap-2xl))',
            background: 'linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent) 60%, var(--teal)), var(--teal))',
            color: 'white',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
          <Container style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: 'white' }}>Ready To Build A More Accountable Business?</h2>
            <p className="lead mx-auto mb-8 opacity-90" style={{ maxWidth: '52ch', color: 'white' }}>
              See how OptiFlow helps MSMEs turn operational knowledge into measurable business results.
            </p>
            <div className="flex justify-center gap-3 flex-wrap mb-8">
              <a href="/os/demo-booking/" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--accent)' }}>Book Free Demo</a>
              <a href="/os/product-overview/" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>Explore OptiFlow</a>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
