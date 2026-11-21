'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BOOKING_DURATION as DURATION,
  BOOKING_TZ_LABEL,
  TIME_SLOTS,
  formatDateLabel,
  formatSlotInZone,
  getBookingDays,
  slotToUtc,
  type BookingDay,
} from '@/lib/booking';
import { siteConfig } from '@/data/site';
import { submitBooking, type SubmitMode } from '@/lib/forms';
import { IS_STATIC } from '@/lib/runtime';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'date' | 'time' | 'details' | 'confirmed';

function buildGoogleCalendarUrl(dateISO: string, time: string, name: string, email: string): string {
  const start = slotToUtc(dateISO, time);
  const end = new Date(start.getTime() + DURATION * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${DURATION}-Min Call — ${name} & Shivam Singh`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Free ${DURATION}-minute consultation call.\n\nBooked by: ${name} (${email})`,
    add: `${email},${siteConfig.email}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('date');
  const [days, setDays] = useState<BookingDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [sentVia, setSentVia] = useState<SubmitMode>('server');

  const reset = useCallback(() => {
    setStep('date');
    setDays(getBookingDays());
    setSelectedDate(null);
    setSelectedTime(null);
    setBookedTimes([]);
    setName('');
    setEmail('');
    setError('');
    setCalendarUrl('');
    setConfirmationSent(false);
    setSentVia('server');
    setIsSubmitting(false);
  }, []);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /** Ask the server which times are already booked on a day. */
  const loadBooked = useCallback(async (dateISO: string) => {
    if (IS_STATIC) return; // no server to ask on the static site
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/booking?date=${dateISO}`);
      const data = res.ok ? await res.json() : null;
      setBookedTimes(Array.isArray(data?.booked) ? data.booked : []);
    } catch {
      setBookedTimes([]); // the server re-checks on submit anyway
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const chooseDate = (iso: string) => {
    setSelectedDate(iso);
    setSelectedTime(null);
    setError('');
  };

  const goToTimes = () => {
    if (!selectedDate) return;
    setStep('time');
    loadBooked(selectedDate);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email.'); return; }
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitBooking({
        name: name.trim(),
        email: email.trim(),
        date: selectedDate,
        time: selectedTime,
        dateLabel: formatDateLabel(selectedDate),
        timeLabel: TIME_SLOTS.find((s) => s.time === selectedTime)?.label ?? selectedTime,
        timeZone: visitorTimeZone(),
      });

      if (!result.ok) {
        if (result.status === 409) {
          // Someone else took it a moment ago — send them back to pick another time.
          setSelectedTime(null);
          setStep('time');
          loadBooked(selectedDate);
        }
        setError(result.message || 'Something went wrong. Please try again.');
        return;
      }

      setSentVia(result.mode);
      setConfirmationSent(Boolean(result.confirmationSent));
      setCalendarUrl(buildGoogleCalendarUrl(selectedDate, selectedTime, name.trim(), email.trim()));
      setStep('confirmed');
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slotLabel = TIME_SLOTS.find((s) => s.time === selectedTime)?.label;
  const dateLabel = selectedDate ? formatDateLabel(selectedDate) : '';
  const zone = visitorTimeZone();
  const yourTime = selectedDate && selectedTime && zone ? formatSlotInZone(selectedDate, selectedTime, zone) : null;
  const showYourTime = Boolean(yourTime) && zone !== 'Asia/Kolkata' && zone !== 'Asia/Calcutta';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative flex w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex-col bg-bg-primary border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
              <div>
                <h3 id="booking-title" className="font-heading text-lg font-bold text-text-primary">Book a Free Call</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{DURATION}-minute consultation &bull; Google Meet</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 -mr-2 flex shrink-0 items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex shrink-0 items-center gap-1 px-5 sm:px-6 pt-4">
              {(['date', 'time', 'details'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    step === s || (['time', 'details', 'confirmed'].indexOf(step) > ['date', 'time', 'details'].indexOf(s))
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-elevated text-text-tertiary'
                  )}>
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 sm:min-h-[320px]">
              {/* Step 1: Select Date */}
              {step === 'date' && (
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Select a date</p>
                  <p className="text-xs text-text-tertiary mb-4">Monday – Saturday. Times are in {BOOKING_TZ_LABEL}.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {days.map((day) => {
                      const isSelected = selectedDate === day.iso;
                      return (
                        <button
                          key={day.iso}
                          onClick={() => chooseDate(day.iso)}
                          aria-pressed={isSelected}
                          className={cn(
                            'flex flex-col items-center py-3 px-2 rounded-xl border text-sm transition-all',
                            isSelected
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-elevated text-text-secondary'
                          )}
                        >
                          <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">{day.weekday}</span>
                          <span className="text-lg font-bold mt-0.5">{day.dayNum}</span>
                          <span className="text-[10px] opacity-60">{day.month}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={!selectedDate}
                    onClick={goToTimes}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-accent-fg font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Select Time */}
              {step === 'time' && (
                <div>
                  <button onClick={() => setStep('date')} className="text-xs text-accent hover:underline mb-3 flex items-center gap-1 py-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {dateLabel}
                  </button>
                  <p className="text-sm font-medium text-text-secondary mb-1">Pick a time slot</p>
                  <p className="text-xs text-text-tertiary mb-4">All times are in {BOOKING_TZ_LABEL}.</p>
                  <div className={cn('grid grid-cols-3 gap-2 transition-opacity', loadingSlots && 'opacity-50')}>
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      const isTaken = bookedTimes.includes(slot.time);
                      return (
                        <button
                          key={slot.time}
                          disabled={isTaken}
                          onClick={() => { setSelectedTime(slot.time); setError(''); }}
                          aria-pressed={isSelected}
                          className={cn(
                            'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all',
                            isTaken && 'opacity-40 line-through cursor-not-allowed border-border bg-bg-secondary text-text-tertiary',
                            !isTaken && (isSelected
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-elevated text-text-secondary')
                          )}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  {bookedTimes.length > 0 && (
                    <p className="text-xs text-text-tertiary mt-3">Crossed-out times are already booked.</p>
                  )}
                  {error && <p role="alert" className="text-red-600 dark:text-red-400 text-xs mt-3">{error}</p>}
                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep('details')}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-accent-fg font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 3: Your Details */}
              {step === 'details' && (
                <div>
                  <button onClick={() => setStep('time')} className="text-xs text-accent hover:underline mb-3 flex items-center gap-1 py-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {dateLabel} at {slotLabel} {BOOKING_TZ_LABEL}
                  </button>
                  {showYourTime && (
                    <p className="text-xs text-text-tertiary mb-3">That is {yourTime} where you are.</p>
                  )}
                  <p className="text-sm font-medium text-text-secondary mb-4">Your details</p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="booking-name" className="block text-xs font-medium text-text-tertiary mb-1.5">Name</label>
                      <input
                        id="booking-name"
                        autoComplete="name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        placeholder="Your name"
                        maxLength={100}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-email" className="block text-xs font-medium text-text-tertiary mb-1.5">Email</label>
                      <input
                        id="booking-email"
                        autoComplete="email"
                        maxLength={254}
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {error && <p role="alert" className="text-red-600 dark:text-red-400 text-xs mt-3">{error}</p>}

                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full mt-6 py-3 rounded-lg bg-accent text-accent-fg font-semibold text-sm transition-all hover:bg-accent-hover disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Booking...
                      </>
                    ) : IS_STATIC ? 'Send request' : 'Confirm Booking'}
                  </button>
                </div>
              )}

              {/* Step 4: Confirmed */}
              {step === 'confirmed' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-text-primary">{sentVia === 'mailto' ? 'One last step' : sentVia === 'endpoint' ? 'Request received' : 'Call Booked!'}</h4>
                  <p className="text-sm text-text-secondary mt-2">
                    {dateLabel} at {slotLabel} {BOOKING_TZ_LABEL}
                  </p>
                  {showYourTime && <p className="text-xs text-text-tertiary mt-1">{yourTime} where you are</p>}
                  <p className="text-xs text-text-tertiary mt-1">{DURATION} minutes &bull; Google Meet</p>

                  <p className="text-sm text-text-secondary mt-5 max-w-xs mx-auto">
                    {sentVia === 'mailto'
                      ? 'Your email app should have opened with the details. Press send to complete your request. Shivam will confirm the time by email.'
                      : sentVia === 'endpoint'
                        ? 'Shivam will confirm this time with you by email shortly.'
                        : confirmationSent
                          ? `A confirmation with a calendar invite is on its way to ${email.trim()}.`
                          : 'Your slot is reserved. Add it to your calendar below so you don’t miss it.'}
                  </p>

                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-lg bg-accent text-accent-fg font-semibold text-sm hover:bg-accent-hover transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Add to Google Calendar
                  </a>
                  <p className="text-xs text-text-tertiary mt-4 max-w-xs mx-auto">
                    Shivam will share the Google Meet link with you before the call.
                  </p>

                  <button
                    onClick={onClose}
                    className="mt-5 py-2 px-4 text-sm text-text-secondary hover:text-text-primary transition-colors"
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
