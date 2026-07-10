import type { Article } from './ArticleCard';

interface PopularArticlesProps {
  articles: Article[];
}

export default function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <div
      className="stagger-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
      }}
    >
      {articles.map((article, i) => (
        <a
          key={article.slug}
          href={`/os/newsletter/${article.slug}`}
          className="pop-item flex items-center gap-4 py-4 border-b last:border-b-0 hover:opacity-80 transition-opacity"
          style={{
            borderColor: 'var(--border)',
            textDecoration: 'none',
          }}
        >
          <span
            className="pi-rank font-mono text-xl font-bold flex-shrink-0"
            style={{ color: 'var(--accent)', minWidth: 32 }}
          >
            {(i + 1).toString().padStart(2, '0')}
          </span>
          <div className="pi-body flex-1">
            <div
              className="pi-cat"
              style={{
                fontSize: 11,
                color: 'var(--teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {article.category_name}
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, marginBottom: 4, color: 'var(--fg)' }}>
              {article.title}
            </h4>
            <div className="pi-meta" style={{ fontSize: 12, color: 'var(--muted)' }}>
              {article.read_time} min read
            </div>
          </div>
          <span
            className="pi-badge font-mono text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {article.view_count.toLocaleString()} reads
          </span>
        </a>
      ))}
    </div>
  );
}
