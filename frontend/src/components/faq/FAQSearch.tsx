import { useState, useEffect, useRef, useCallback } from 'react';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '../../data';

interface FAQSearchProps {
  onResultClick: (faqId: number) => void;
}

export default function FAQSearch({ onResultClick }: FAQSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof FAQ_ITEMS>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doSearch = useCallback((q: string) => {
    const trimmed = q.toLowerCase().trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const matches = FAQ_ITEMS.filter((item) =>
      item.question.toLowerCase().includes(trimmed)
    );
    setResults(matches);
    setIsOpen(true);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 200);
  };

  const handleResultClick = (faqId: number) => {
    onResultClick(faqId);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    doSearch(suggestion);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const suggestions = ['Implementation time', 'Per-user pricing', 'Attendance tracking', 'Data security', 'Mobile app', 'Integration'];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto 48px', position: 'relative' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 6,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 24px color-mix(in oklch, var(--fg) 5%, transparent)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder='Search FAQs — e.g. "How long does implementation take?"'
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          autoComplete="off"
          style={{
            flex: 1,
            border: 0,
            background: 'transparent',
            padding: '14px 18px',
            fontSize: 16,
            fontFamily: 'var(--font-body)',
            color: 'var(--fg)',
            outline: 'none',
            WebkitAppearance: 'none' as React.CSSProperties['WebkitAppearance'],
          }}
        />
        <button
          onClick={() => doSearch(query)}
          aria-label="Search"
          style={{
            width: 48,
            height: 48,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--accent)',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            flexShrink: 0,
            border: 0,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            marginTop: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 0',
            boxShadow: 'var(--shadow-card)',
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--muted)', padding: '0 16px 8px' }}>
            {results.length} match{results.length !== 1 ? 'es' : ''} found
          </p>
          {results.map((item) => {
            const category = FAQ_CATEGORIES.find((c) => c.slug === item.categorySlug);
            return (
              <div
                key={item.id}
                onClick={() => handleResultClick(item.id)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {category?.name}
                </span>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{item.question}</div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && results.length === 0 && query.trim().length >= 2 && (
        <div
          style={{
            marginTop: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 16,
            textAlign: 'center',
            color: 'var(--muted)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          No matching questions found. Try a different search term.
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
        {suggestions.map((s) => (
          <span
            key={s}
            onClick={() => handleSuggestionClick(s)}
            style={{
              padding: '6px 14px',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              borderRadius: 999,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
