interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category_name: string;
  category_slug: string;
  author: string;
  read_time: number;
  is_featured: boolean;
  published_at: string;
  view_count: number;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const excerpt =
    article.excerpt.length > 120
      ? article.excerpt.slice(0, 120) + '...'
      : article.excerpt;

  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <a
      href={`/os/newsletter/${article.slug}`}
      className="article-card block group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
      }}
    >
      <div
        className="ac-img relative flex items-center justify-center overflow-hidden"
        style={{
          height: 180,
          background: `linear-gradient(135deg, var(--accent-soft), var(--teal-soft))`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 40% 50%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 70%)`,
          }}
        />
        <span style={{ fontSize: 36, opacity: 0.35, position: 'relative', zIndex: 1 }}>
          {article.category_name.charAt(0)}
        </span>
      </div>
      <div className="ac-body" style={{ padding: 20 }}>
        <div
          className="ac-cat"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {article.category_name}
        </div>
        <h4
          className="group-hover:text-accent transition-colors"
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 8,
            color: 'var(--fg)',
          }}
        >
          {article.title}
        </h4>
        <p
          className="ac-excerpt"
          style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}
        >
          {excerpt}
        </p>
        <div className="ac-meta flex gap-3 items-center flex-wrap">
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {article.author}
          </span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>
            &mdash;
          </span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {article.read_time} min read
          </span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>
            &mdash;
          </span>
          <span className="meta" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {date}
          </span>
        </div>
      </div>
    </a>
  );
}

export type { Article };
