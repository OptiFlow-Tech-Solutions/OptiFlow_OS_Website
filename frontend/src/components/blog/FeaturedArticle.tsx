import type { Article } from './ArticleCard';

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <a
      href={`/os/newsletter/${article.slug}`}
      className="featured-card grid overflow-hidden transition-shadow duration-300 hover:shadow-xl"
      style={{
        gridTemplateColumns: '1.1fr 1fr',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        textDecoration: 'none',
      }}
    >
      <div
        className="featured-img flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--accent-soft), var(--teal-soft))',
          minHeight: 320,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, color-mix(in oklch, var(--accent) 20%, transparent), transparent 70%)',
          }}
        />
        <span
          className="fi-label font-bold tracking-tight relative z-10"
          style={{
            fontSize: 48,
            color: 'color-mix(in oklch, var(--accent) 40%, transparent)',
            letterSpacing: '-0.03em',
          }}
        >
          {article.title.slice(0, 3).toUpperCase()}
        </span>
      </div>
      <div className="featured-body flex flex-col justify-center p-10">
        <div
          className="fb-cat font-mono text-xs tracking-widest uppercase font-semibold mb-3"
          style={{ color: 'var(--teal)' }}
        >
          {article.category_name}
        </div>
        <h3 style={{ fontSize: 28, marginBottom: 12, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
          {article.title}
        </h3>
        <p className="lead mb-5 leading-relaxed" style={{ color: 'var(--muted)', fontSize: 'var(--fs-lead)' }}>
          {article.excerpt}
        </p>
        <div className="fb-meta flex gap-4 items-center flex-wrap">
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>{article.author}</span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>&mdash;</span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>{article.read_time} min read</span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>&mdash;</span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>{date}</span>
        </div>
        <span className="btn btn-primary mt-4 inline-flex items-center gap-2" style={{ marginTop: 16 }}>
          Read Article
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="5,3 10,7 5,11" />
          </svg>
        </span>
      </div>
    </a>
  );
}
