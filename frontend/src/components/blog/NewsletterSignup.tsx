import { useState, type FormEvent } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog' }),
      });

      if (res.status === 201) {
        setStatus('success');
        setMessage('Welcome aboard! Check your inbox for our next issue.');
      } else if (res.status === 409) {
        setStatus('error');
        setMessage("You're already subscribed!");
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.email || data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="newsletter-card text-center" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
        <h3 style={{ marginBottom: 8, color: 'var(--fg)' }}>You're subscribed!</h3>
        <p style={{ color: 'var(--muted)' }}>{message}</p>
      </div>
    );
  }

  return (
    <div
      className="newsletter-card text-center reveal"
      style={{
        maxWidth: 560,
        margin: '0 auto',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 44,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 8 }}>Weekly Newsletter</div>
      <h2 style={{ marginBottom: 12 }}>Get Weekly Operational Insights</h2>
      <p className="lead" style={{ margin: '12px auto 0', color: 'var(--muted)' }}>
        Join 5,000+ MSME owners receiving practical frameworks every Saturday.
      </p>
      <div className="nl-benefits flex justify-center gap-5 mb-7 flex-wrap">
        {['Weekly Insights', 'Templates', 'Frameworks', 'No Spam'].map((b) => (
          <span key={b} className="nl-benefit flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3 3 7-7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </span>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="nl-form flex gap-3 max-w-md mx-auto">
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' as const }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3.5 text-sm border rounded-lg focus:outline-none transition-colors"
          style={{
            background: 'var(--bg)',
            color: 'var(--fg)',
            borderColor: 'var(--border)',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-3 text-sm" style={{ color: 'var(--danger, oklch(50% 0.18 25))' }} role="alert">
          {message}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setStatus('idle')}
            style={{ color: 'inherit' }}
          >
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
