import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  appendToSubmissions,
  cleanText,
  createRateLimiter,
  escapeHtml,
  getClientIp,
  isValidEmail,
  readJsonBody,
  readSubmissions,
} from '@/lib/api-security';
import {
  BOOKING_DURATION,
  BOOKING_TZ_LABEL,
  TIME_SLOTS,
  formatDateLabel,
  formatSlotInZone,
  slotToUtc,
} from '@/lib/booking';
import { buildInvite } from '@/lib/ics';
import { emailConfigured, ownerEmail, sendMail } from '@/lib/email';

const allowBooking = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });
const allowLookup = createRateLimiter({ windowMs: 60 * 1000, max: 60 });

const DAY_MS = 24 * 60 * 60 * 1000;
const OWNER_NAME = 'Shivam Singh';

interface StoredBooking {
  date: string;
  time: string;
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Bookable: a real date, not a Sunday, within 60 days. The slot itself must start at least an hour from now. */
function isBookable(dateISO: string, time: string): boolean {
  if (!isRealDate(dateISO)) return false;
  if (new Date(`${dateISO}T12:00:00Z`).getUTCDay() === 0) return false;
  const start = slotToUtc(dateISO, time).getTime();
  return start > Date.now() + 60 * 60 * 1000 && start < Date.now() + 60 * DAY_MS;
}

/** GET /api/booking?date=YYYY-MM-DD → which times are already taken that day. */
export async function GET(request: NextRequest) {
  if (!allowLookup(getClientIp(request))) {
    return NextResponse.json({ booked: [] }, { status: 429 });
  }
  const date = request.nextUrl.searchParams.get('date') || '';
  if (!isRealDate(date)) {
    return NextResponse.json({ booked: [] }, { status: 400 });
  }
  const all = await readSubmissions<StoredBooking>('bookings.json');
  return NextResponse.json({ booked: all.filter((b) => b.date === date).map((b) => b.time) });
}

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  if (!body) {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  if (!allowBooking(getClientIp(request))) {
    return NextResponse.json(
      { success: false, message: 'Too many booking requests. Please try again later.' },
      { status: 429 }
    );
  }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const dateValue = cleanText(body.date, 10);
  const timeValue = cleanText(body.time, 5);
  const visitorZone = cleanText(body.timeZone, 64) || '';

  if (!name || !email || !dateValue || !timeValue) {
    return NextResponse.json({ success: false, message: 'Missing or invalid fields.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, message: 'Invalid email.' }, { status: 400 });
  }

  const slot = TIME_SLOTS.find((s) => s.time === timeValue);
  if (!slot || !isBookable(dateValue, timeValue)) {
    return NextResponse.json(
      { success: false, message: 'That time is not available. Please choose another.' },
      { status: 400 }
    );
  }

  // Labels are built here, not taken from the client.
  const dateLabel = formatDateLabel(dateValue);
  const timeLabel = `${slot.label} ${BOOKING_TZ_LABEL}`;
  const localTime = visitorZone ? formatSlotInZone(dateValue, timeValue, visitorZone) : null;
  const id = randomUUID();

  const booking = {
    id,
    name,
    email,
    date: dateValue,
    time: timeValue,
    timeLabel: slot.label,
    dateLabel,
    visitorTimeZone: localTime ? visitorZone : undefined,
    duration: BOOKING_DURATION,
    bookedAt: new Date().toISOString(),
  };

  // Check-and-save in one step so the same slot cannot be taken twice.
  const saved = await appendToSubmissions('bookings.json', booking, (existing) =>
    existing.some((b) => b.date === dateValue && b.time === timeValue)
  );
  if (saved === 'rejected') {
    return NextResponse.json(
      { success: false, slotTaken: true, message: 'Sorry, that slot was just booked. Please pick another time.' },
      { status: 409 }
    );
  }

  const start = slotToUtc(dateValue, timeValue);
  const end = new Date(start.getTime() + BOOKING_DURATION * 60 * 1000);
  const owner = ownerEmail();
  const meetingLink = process.env.MEETING_LINK || '';

  const description = [
    `${BOOKING_DURATION}-minute consultation call between ${OWNER_NAME} and ${name}.`,
    meetingLink ? `Join: ${meetingLink}` : 'A Google Meet link will be shared by email before the call.',
    `Contact: ${name} <${email}>`,
  ].join('\n');

  const invite = buildInvite({
    uid: `${id}@shivamsingh.dev`,
    start,
    end,
    summary: `${BOOKING_DURATION}-min call — ${name} & ${OWNER_NAME}`,
    description,
    location: meetingLink || 'Google Meet (link shared by email)',
    organizer: { name: OWNER_NAME, email: owner },
    attendee: { name, email },
  });
  const attachments = [{ filename: 'call-invite.ics', content: invite, contentType: 'text/calendar; method=REQUEST' }];

  const e = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    date: escapeHtml(dateLabel),
    time: escapeHtml(timeLabel),
    local: localTime ? escapeHtml(localTime) : '',
  };

  // 1) You: who booked, when, and the invite to accept.
  const ownerSent = await sendMail({
    to: owner,
    replyTo: email,
    fromName: 'Portfolio Booking',
    subject: `📅 New call booked — ${name}, ${dateLabel} ${slot.label} IST`,
    attachments,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#6366f1;">New call booked</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 4px;color:#888;width:110px;">Name</td><td style="padding:8px 4px;font-weight:600;">${e.name}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Email</td><td style="padding:8px 4px;"><a href="mailto:${e.email}">${e.email}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Date</td><td style="padding:8px 4px;">${e.date}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Time</td><td style="padding:8px 4px;font-weight:600;">${e.time}</td></tr>
          ${e.local ? `<tr><td style="padding:8px 4px;color:#888;">Their time</td><td style="padding:8px 4px;">${e.local}</td></tr>` : ''}
          <tr><td style="padding:8px 4px;color:#888;">Duration</td><td style="padding:8px 4px;">${BOOKING_DURATION} minutes</td></tr>
        </table>
        <p style="margin-top:16px;font-size:13px;color:#555;">The attached <b>call-invite.ics</b> adds this to your calendar. Reply to this email to reach ${e.name}${meetingLink ? '' : ' and send them the Google Meet link'}.</p>
      </div>`,
  });

  // 2) The visitor: confirmation with the same invite.
  const visitorSent = await sendMail({
    to: email,
    replyTo: owner,
    fromName: OWNER_NAME,
    subject: `Your call with ${OWNER_NAME} is booked — ${dateLabel}, ${slot.label} IST`,
    attachments,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#6366f1;">You're booked ✓</h2>
        <p>Hi ${e.name}, your ${BOOKING_DURATION}-minute call with ${OWNER_NAME} is confirmed.</p>
        <p style="font-size:16px;"><b>${e.date}</b> at <b>${e.time}</b>${e.local ? `<br><span style="color:#666;font-size:14px;">That is ${e.local} where you are.</span>` : ''}</p>
        <p>${meetingLink ? `Join here: <a href="${escapeHtml(meetingLink)}">${escapeHtml(meetingLink)}</a>` : 'A Google Meet link will be shared with you by email before the call.'}</p>
        <p style="font-size:13px;color:#555;">Open the attached <b>call-invite.ics</b> to add it to your calendar. Need to change the time? Just reply to this email.</p>
      </div>`,
  });

  // A booking only counts if you can find out about it: it was saved, or you were emailed.
  if (saved === 'failed' && !ownerSent) {
    console.error('Booking could not be stored or emailed.');
    return NextResponse.json(
      { success: false, message: 'Could not record your booking right now. Please email me directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Booking confirmed!',
    confirmationSent: visitorSent,
    emailConfigured: emailConfigured(),
  });
}
