interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className="empty-state-icon" style={{ color: 'var(--muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg)' }}>
        No articles found
      </h3>
      <p style={{ color: 'var(--muted)', maxWidth: '36ch', lineHeight: 1.6 }}>
        No articles match the selected category filter. Try a different topic or view all articles.
      </p>
      <button
        onClick={onReset}
        className="btn btn-primary"
        style={{ marginTop: 8 }}
      >
        View All Articles
      </button>
    </div>
  );
}
