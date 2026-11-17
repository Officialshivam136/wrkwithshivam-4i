export const BOOKING_DURATION = 30; // minutes

/**
 * Calls happen in India Standard Time (UTC+5:30, no daylight saving).
 * Every slot below is an IST wall-clock time.
 */
export const BOOKING_TZ = 'Asia/Kolkata';
export const BOOKING_TZ_OFFSET = '+05:30';
export const BOOKING_TZ_LABEL = 'IST (India)';

export interface TimeSlot {
  time: string;
  label: string;
}

export const TIME_SLOTS: TimeSlot[] = [
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

/** The moment a slot starts, as a real point in time. */
export function slotToUtc(dateISO: string, time: string): Date {
  return new Date(`${dateISO}T${time}:00${BOOKING_TZ_OFFSET}`);
}

/** "Fri, Nov 20" for a YYYY-MM-DD calendar date (no time zone shifting). */
export function formatDateLabel(dateISO: string): string {
  return new Date(`${dateISO}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export interface BookingDay {
  iso: string;
  weekday: string;
  dayNum: number;
  month: string;
}

/** Today's calendar date in India, as YYYY-MM-DD. */
export function todayInBookingTz(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** The next bookable days (tomorrow onwards in India, Sundays skipped). */
export function getBookingDays(count = 14, now = new Date()): BookingDay[] {
  const [y, m, d] = todayInBookingTz(now).split('-').map(Number);
  const days: BookingDay[] = [];
  for (let i = 1; i <= count; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i, 12));
    if (date.getUTCDay() === 0) continue; // Sunday
    days.push({
      iso: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      dayNum: date.getUTCDate(),
      month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    });
  }
  return days;
}

/** Format a slot in another time zone, e.g. "Thu, Nov 19, 11:30 PM PST". Null if the zone is invalid. */
export function formatSlotInZone(dateISO: string, time: string, timeZone: string): string | null {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(slotToUtc(dateISO, time));
  } catch {
    return null;
  }
}
