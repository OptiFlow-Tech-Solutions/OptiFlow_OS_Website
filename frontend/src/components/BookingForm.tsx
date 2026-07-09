import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Button from './Button';

const TEAM_SIZES = ['1–10', '11–25', '26–50', '51–100', '101–250', '250+'];
const INDUSTRIES = ['Textile', 'Manufacturing', 'Trading', 'Warehousing', 'Distribution', 'Logistics', 'Service', 'Other'];

interface BookingFormData {
  name: string;
  company: string;
  mobile: string;
  email: string;
  team_size: string;
  industry: string;
  challenges: string;
  preferred_date?: string;
  preferred_time_slot?: string;
}

interface FieldErrors {
  [key: string]: string;
}

export interface BookingFormHandle {
  submit: () => void;
  setDateAndSlot: (preferred_date?: string, preferred_time_slot?: string) => void;
}

const API_URL = '/api/demo-bookings/';

function validate(data: BookingFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim() || data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  }
  if (!data.company.trim() || data.company.trim().length < 2) {
    errors.company = 'Company name must be at least 2 characters.';
  }
  if (!/^[6-9]\d{9}$/.test(data.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!TEAM_SIZES.includes(data.team_size)) {
    errors.team_size = 'Please select a team size.';
  }
  if (!INDUSTRIES.includes(data.industry)) {
    errors.industry = 'Please select your industry.';
  }

  return errors;
}

const BookingForm = forwardRef<BookingFormHandle, object>((_props, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'default' | 'submitting' | 'success' | 'error'>('default');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [calendarData, setCalendarData] = useState<{ preferred_date?: string; preferred_time_slot?: string }>({});

  useImperativeHandle(ref, () => ({
    submit: () => {
      formRef.current?.requestSubmit();
    },
    setDateAndSlot,
  }));

  const setDateAndSlot = (preferred_date?: string, preferred_time_slot?: string) => {
    setCalendarData({ preferred_date, preferred_time_slot });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    const formData = new FormData(e.currentTarget);
    const data: BookingFormData = {
      name: String(formData.get('name') || ''),
      company: String(formData.get('company') || ''),
      mobile: String(formData.get('mobile') || ''),
      email: String(formData.get('email') || ''),
      team_size: String(formData.get('team_size') || ''),
      industry: String(formData.get('industry') || ''),
      challenges: String(formData.get('challenges') || ''),
      preferred_date: calendarData.preferred_date,
      preferred_time_slot: calendarData.preferred_time_slot,
    };

    const clientErrors = validate(data);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});

    setFormState('submitting');

    try {
      const payload: Record<string, string> = {
        name: data.name.trim(),
        company: data.company.trim(),
        mobile: data.mobile.trim(),
        email: data.email.trim(),
        team_size: data.team_size,
        industry: data.industry,
        challenges: data.challenges.trim(),
        preferred_date: data.preferred_date || '',
        preferred_time_slot: data.preferred_time_slot || '',
        _hp: String(formData.get('_hp') || ''),
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (res.ok) {
        setFormState('success');
      } else {
        if (body && typeof body === 'object') {
          const fieldErrors: FieldErrors = {};
          for (const [key, val] of Object.entries(body)) {
            fieldErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
          }
          setErrors(fieldErrors);
        } else {
          setServerError('Something went wrong. Please try again.');
        }
        setFormState('error');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setFormState('error');
    }
  };

  const handleRetry = () => {
    setFormState('default');
    setErrors({});
    setServerError('');
  };

  const fieldError = (key: string) => (errors[key] ? { borderColor: 'oklch(55% 0.16 25)' } : undefined);

  return (
    <div className="form-card" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '40px',
      boxShadow: '0 8px 32px color-mix(in oklch, var(--fg) 4%, transparent)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, var(--accent), var(--teal), var(--green))',
      }} />

      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        />

        <div className="form-fields" style={{
          opacity: formState === 'submitting' ? 0.6 : 1,
          pointerEvents: formState === 'submitting' ? 'none' : 'auto',
          transition: 'opacity 0.3s',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-md) var(--gap-lg)' }}>
            <Field label="Full Name" required error={errors.name}>
              <input name="name" placeholder="Your full name" required style={fieldError('name')} />
            </Field>
            <Field label="Company Name" required error={errors.company}>
              <input name="company" placeholder="Your company name" required style={fieldError('company')} />
            </Field>
            <Field label="Mobile Number" required error={errors.mobile}>
              <input type="tel" name="mobile" placeholder="+91 00000 00000" required style={fieldError('mobile')} />
            </Field>
            <Field label="Email Address" required error={errors.email}>
              <input type="email" name="email" placeholder="you@company.com" required style={fieldError('email')} />
            </Field>
            <Field label="Team Size" required error={errors.team_size}>
              <select name="team_size" required style={fieldError('team_size')}>
                <option value="">Select team size</option>
                {TEAM_SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Industry" required error={errors.industry}>
              <select name="industry" required style={fieldError('industry')}>
                <option value="">Select your industry</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ marginTop: '16px' }} className="form-group">
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>
                Current Operational Challenges
                <span style={{ color: 'var(--muted)', fontWeight: 400 }}> (optional)</span>
              </span>
              <textarea
                name="challenges"
                rows={3}
                placeholder="Tell us about your biggest operational pain points — WhatsApp dependency, missed tasks, attendance tracking, reporting gaps, etc."
                style={{
                  padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: '15px',
                  outline: 'none', width: '100%', resize: 'vertical',
                }}
              />
            </label>
          </div>

          {serverError && (
            <div style={{
              marginTop: '12px', padding: '12px 16px', borderRadius: 'var(--radius)',
              background: 'var(--teal-soft)', color: 'var(--fg)',
              fontSize: '14px', fontWeight: 500,
            }}>
              {serverError}
            </div>
          )}

          <div style={{ marginTop: '28px' }}>
            <Button type="submit" size="lg" glow style={{ width: '100%', justifyContent: 'center' }}>
              Book Free Demo
            </Button>
          </div>
        </div>

        {formState === 'success' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--green-soft)', color: 'var(--green)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '28px', height: '28px' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Demo Request Received</h4>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
              We'll contact you within one business day to schedule your personalized demo. Check your email for confirmation.
            </p>
          </div>
        )}

        {formState === 'error' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>
              {serverError || 'Something went wrong submitting your request.'}
            </p>
            <Button variant="secondary" onClick={handleRetry}>Try Again</Button>
          </div>
        )}
      </form>
    </div>
  );
});

function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '14px', fontWeight: 600 }}>
        {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ color: 'oklch(55% 0.16 25)', fontSize: '13px' }}>{error}</span>
      )}
    </div>
  );
}

BookingForm.displayName = 'BookingForm';
export default BookingForm;
