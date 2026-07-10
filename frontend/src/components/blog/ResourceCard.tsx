interface Resource {
  id: number;
  title: string;
  description: string;
  file_type: string;
  file_url: string;
  category: string;
  download_count: number;
}

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeColors: Record<string, { bg: string; color: string }> = {
  PDF: { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  Excel: { bg: 'var(--green-soft)', color: 'var(--green)' },
  Guide: { bg: 'var(--teal-soft)', color: 'var(--teal)' },
  Template: { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  Toolkit: { bg: 'var(--green-soft)', color: 'var(--green)' },
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const colors = fileTypeColors[resource.file_type] ?? fileTypeColors.PDF;

  return (
    <a
      href={resource.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card flex items-start gap-4 p-6 group transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        textDecoration: 'none',
      }}
    >
      <div
        className="rc-icon flex items-center justify-center flex-shrink-0 rounded-lg"
        style={{ width: 44, height: 44, background: colors.bg, color: colors.color }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <div className="rc-body flex-1">
        <h4 className="font-semibold leading-tight mb-1" style={{ fontSize: 15, color: 'var(--fg)' }}>
          {resource.title}
        </h4>
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
          {resource.description}
        </p>
        <span
          className="rc-type font-mono text-xs font-semibold tracking-wider"
          style={{ color: 'var(--teal)' }}
        >
          {resource.file_type === 'Excel' ? 'Template — Excel' : `${resource.file_type} — Download`}
        </span>
      </div>
    </a>
  );
}
