import { useState, useEffect, useCallback } from 'react';
import Button from './Button';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarWidgetProps {
  onDateSlotChange?: (date?: string, slot?: string) => void;
  onConfirm?: () => void;
}

export default function CalendarWidget({ onDateSlotChange, onConfirm }: CalendarWidgetProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const fetchSlots = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    setSlotError('');
    const dateStr = date.toISOString().split('T')[0];
    try {
      const res = await fetch(`/api/demo-bookings/slots/?date=${dateStr}`);
      if (res.ok) {
        const slots: string[] = await res.json();
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
        setSlotError('Could not load available slots.');
      }
    } catch {
      setAvailableSlots([]);
      setSlotError('Could not load available slots. Check your connection.');
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleSelectDate = (d: number) => {
    const cellDate = new Date(currentYear, currentMonth, d);
    cellDate.setHours(0, 0, 0, 0);

    if (cellDate.getTime() < today.getTime()) return;

    setSelectedDate(cellDate);
    setSelectedSlot(null);
    const dateStr = cellDate.toISOString().split('T')[0];
    onDateSlotChange?.(dateStr, undefined);
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    const dateStr = selectedDate?.toISOString().split('T')[0];
    onDateSlotChange?.(dateStr, slot);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.();
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const days: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="cal-day empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(currentYear, currentMonth, d);
    cellDate.setHours(0, 0, 0, 0);
    const isPast = cellDate.getTime() < today.getTime();
    const isToday = cellDate.getTime() === today.getTime();
    const isSelected = selectedDate && cellDate.getTime() === selectedDate.getTime();

    let cls = 'cal-day';
    if (isPast) cls += ' past';
    if (isToday) cls += ' today';
    if (isSelected) cls += ' selected';

    days.push(
      <button
        key={d}
        className={cls}
        onClick={() => handleSelectDate(d)}
        disabled={isPast}
        aria-label={`${MONTHS[currentMonth]} ${d}, ${currentYear}`}
        {...(isSelected ? { 'aria-selected': true } as never : {})}
      >
        {d}
      </button>
    );
  }

  const dayName = selectedDate ? WEEKDAY_NAMES[selectedDate.getDay()] : '';
  const dateStr = selectedDate
    ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : '';

  return (
    <>
      <style>{`
        .cal-day {
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border-radius: var(--radius);
          font-size: 14px;
          cursor: pointer;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          border: 1px solid transparent;
          font-family: var(--font-mono);
          background: none;
          color: var(--fg);
        }
        .cal-day:hover:not(.empty):not(.past) {
          background: var(--accent-soft);
          color: var(--accent);
        }
        .cal-day.empty, .cal-day.past {
          opacity: 0.3;
          cursor: default;
        }
        .cal-day.today {
          border-color: var(--teal);
          font-weight: 700;
        }
        .cal-day.selected {
          background: var(--accent);
          color: white;
          font-weight: 700;
        }
        .time-slot {
          padding: 10px 12px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          background: var(--bg);
          font-family: var(--font-mono);
          color: var(--fg);
        }
        .time-slot:hover {
          border-color: var(--teal);
          background: var(--teal-soft);
        }
        .time-slot.selected {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        [data-theme="dark"] .time-slot {
          background: var(--surface);
          border-color: var(--border);
        }
        [data-theme="dark"] .time-slot:hover {
          border-color: var(--teal);
        }
        @media (max-width: 768px) {
          .slots-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="cal-panels" style={{ opacity: confirmed ? 0 : 1, pointerEvents: confirmed ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-lg)' }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', margin: 0 }}>{MONTHS[currentMonth]} {currentYear}</h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={prevMonth} className="cal-nav-btn" aria-label="Previous month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button onClick={nextMonth} className="cal-nav-btn" aria-label="Next month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
            <style>{`
              .cal-nav-btn {
                width: 32px; height: 32px; border-radius: var(--radius);
                display: grid; place-items: center;
                border: 1px solid var(--border); background: none;
                color: var(--muted); cursor: pointer;
              }
              .cal-nav-btn:hover { border-color: var(--fg); color: var(--fg); }
            `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>
              {WEEKDAY_NAMES.map((d) => <span key={d}>{d}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {days}
            </div>
          </div>

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '24px',
          }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>
              {!selectedDate
                ? 'Select a date first'
                : loadingSlots
                  ? 'Loading...'
                  : 'Available Time Slots'}
            </h3>

            {!selectedDate && (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                Pick a date from the calendar to see available time slots.
              </p>
            )}

            {slotError && (
              <p style={{ color: 'oklch(55% 0.16 25)', fontSize: '14px' }}>{slotError}</p>
            )}

            {selectedDate && !loadingSlots && !slotError && (
              <>
                {availableSlots.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    No time slots available for this date.
                  </p>
                ) : (
                  <div className="slots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {availableSlots.map((slot) => (
                      <div
                        key={slot}
                        className={`time-slot${selectedSlot === slot ? ' selected' : ''}`}
                        onClick={() => handleSelectSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                )}

                {selectedSlot && (
                  <div style={{
                    background: 'var(--teal-soft)', borderRadius: 'var(--radius)',
                    padding: '16px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '15px', fontWeight: 600, color: 'var(--teal)',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {dayName}, {dateStr} at {selectedSlot}
                  </div>
                )}

                {selectedSlot && (
                  <div style={{ marginTop: '20px' }}>
                    <Button size="lg" onClick={handleConfirm} style={{ width: '100%', justifyContent: 'center' }}>
                      Confirm Booking
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '12px', textAlign: 'center' }}>
          All times in IST (Indian Standard Time)
        </p>
      </div>

      {confirmed && (
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
          <h3>Demo Scheduled</h3>
          <p className="lead" style={{ maxWidth: '320px', margin: '8px auto 0', fontSize: '15px' }}>
            Your calendar invite will arrive within minutes. We're looking forward to showing you OptiFlow.
          </p>
        </div>
      )}
    </>
  );
}
