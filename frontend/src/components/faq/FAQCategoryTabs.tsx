import { FAQ_CATEGORIES } from '../../data';

interface FAQCategoryTabsProps {
  active: string;
  activeCount: number;
  categoryCounts: Record<string, number>;
  onChange: (category: string) => void;
}

export default function FAQCategoryTabs({
  active,
  activeCount,
  categoryCounts,
  onChange,
}: FAQCategoryTabsProps) {
  const tabs = [
    { slug: 'all', label: 'All Questions', count: activeCount },
    ...FAQ_CATEGORIES.map((cat) => ({
      slug: cat.slug,
      label: cat.name,
      count: categoryCounts[cat.slug] || 0,
    })),
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 4,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: 'max-content',
        margin: '0 auto',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.slug}
          onClick={() => onChange(tab.slug)}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 14,
            fontWeight: 500,
            background: active === tab.slug ? 'var(--accent)' : 'transparent',
            color: active === tab.slug ? 'white' : 'var(--muted)',
            border: 0,
            cursor: 'pointer',
            transition: 'color 0.25s, background 0.25s',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
