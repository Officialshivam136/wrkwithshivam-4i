'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  label: string;
}

const DURATION = 30; // minutes

const TIME_SLOTS: TimeSlot[] = [
  { time: '10:00', label: '10:00 AM' },
  { time: '10:30', label: '10:30 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '11:30', label: '11:30 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '14:30', label: '2:30 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '15:30', label: '3:30 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '16:30', label: '4:30 PM' },
  { time: '17:00', label: '5:00 PM' },
];

function getNext14Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip Sundays (0)
    if (d.getDay() !== 0) {
      days.push(d);
    }
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function buildGoogleCalendarUrl(date: string, time: string, name: string, email: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + DURATION * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `30-Min Call — ${name} & Shivam Singh`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Free 30-minute consultation call.\n\nBooked by: ${name} (${email})\n\nJoin via Google Meet (add this event to generate a Meet link).`,
    add: `${email},shivam.klg136@gmail.com`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

type Step = 'date' | 'time' | 'details' | 'confirmed';

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');

  const days = getNext14Days();

  const reset = useCallback(() => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
    setName('');
    setEmail('');
    setError('');
    setCalendarUrl('');
    setIsSubmitting(false);
  }, []);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email.'); return; }
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setError('');

    try {
      const dateStr = formatDateISO(selectedDate);
      const slot = TIME_SLOTS.find((s) => s.time === selectedTime);

      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          date: dateStr,
          time: selectedTime,
          timeLabel: slot?.label,
          dateLabel: formatDate(selectedDate),
          duration: DURATION,
        }),
      });

      const url = buildGoogleCalendarUrl(dateStr, selectedTime, name.trim(), email.trim());
      setCalendarUrl(url);
      setStep('confirmed');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSlotLabel = TIME_SLOTS.find((s) => s.time === selectedTime)?.label;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-bg-primary border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">Book a Free Call</h3>
                <p className="text-xs text-text-tertiary mt-0.5">30-minute consultation &bull; Google Meet</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-1 px-6 pt-4">
              {(['date', 'time', 'details'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    step === s || (['time', 'details', 'confirmed'].indexOf(step) > ['date', 'time', 'details'].indexOf(s))
                      ? 'bg-accent text-white'
                      : 'bg-bg-elevated text-text-tertiary'
                  )}>
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[320px]">
              {/* Step 1: Select Date */}
              {step === 'date' && (
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-4">Select a date</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {days.map((day) => {
                      const isSelected = selectedDate && formatDateISO(day) === formatDateISO(selectedDate);
                      const isSat = day.getDay() === 6;
                      return (
                        <button
                          key={formatDateISO(day)}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            'flex flex-col items-center py-3 px-2 rounded-xl border text-sm transition-all',
                            isSelected
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-elevated text-text-secondary',
                            isSat && 'opacity-80'
                          )}
                        >
                          <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-bold mt-0.5">{day.getDate()}</span>
                          <span className="text-[10px] opacity-60">
                            {day.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={!selectedDate}
                    onClick={() => setStep('time')}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Select Time */}
              {step === 'time' && (
                <div>
                  <button onClick={() => setStep('date')} className="text-xs text-accent hover:underline mb-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {selectedDate && formatDate(selectedDate)}
                  </button>
                  <p className="text-sm font-medium text-text-secondary mb-4">Pick a time slot</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={cn(
                            'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all',
                            isSelected
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-elevated text-text-secondary'
                          )}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep('details')}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 3: Your Details */}
              {step === 'details' && (
                <div>
                  <button onClick={() => setStep('time')} className="text-xs text-accent hover:underline mb-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {selectedDate && formatDate(selectedDate)} at {selectedSlotLabel}
                  </button>
                  <p className="text-sm font-medium text-text-secondary mb-4">Your details</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-tertiary mb-1.5">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-tertiary mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Booking...
                      </>
                    ) : 'Confirm Booking'}
                  </button>
                </div>
              )}

              {/* Step 4: Confirmed */}
              {step === 'confirmed' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-text-primary">Call Booked!</h4>
                  <p className="text-sm text-text-secondary mt-2">
                    {selectedDate && formatDate(selectedDate)} at {selectedSlotLabel}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">30 minutes &bull; Google Meet</p>

                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Add to Google Calendar
                  </a>
                  <p className="text-xs text-text-tertiary mt-4 max-w-xs mx-auto">
                    A Google Meet link will be auto-generated when you add the event to your calendar.
                  </p>

                  <button
                    onClick={onClose}
                    className="mt-6 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
