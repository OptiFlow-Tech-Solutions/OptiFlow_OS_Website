interface CategoryFilterBarProps {
  categories: string[];
  active: string;
  onFilter: (category: string) => void;
}

export default function CategoryFilterBar({ categories, active, onFilter }: CategoryFilterBarProps) {
  const allCats = ['all', ...categories];

  return (
    <div className="cat-filter-bar flex gap-2 flex-wrap justify-center mb-8">
      {allCats.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilter(cat)}
          className="cat-filter"
          style={{
            padding: '8px 18px',
            border: `1px solid ${active === cat ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 9999,
            background: active === cat ? 'var(--accent)' : 'var(--surface)',
            color: active === cat ? 'white' : 'var(--muted)',
            fontSize: 13,
            fontWeight: active === cat ? 600 : 500,
            cursor: 'pointer',
            transition: 'color 0.2s, background 0.2s, border-color 0.2s',
            fontFamily: 'inherit',
          }}
        >
          {cat === 'all' ? 'All' : cat}
        </button>
      ))}
    </div>
  );
}
