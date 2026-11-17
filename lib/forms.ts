import { FORMS_ENDPOINT, IS_STATIC } from '@/lib/runtime';
import { siteConfig } from '@/data/site';

/**
 * How a submission travelled:
 *  server   – our own API route (normal hosting)
 *  endpoint – a form service configured for the static site
 *  mailto   – the visitor's email app was opened with the message filled in
 */
export type SubmitMode = 'server' | 'endpoint' | 'mailto';

export interface SubmitResult {
  ok: boolean;
  mode: SubmitMode;
  status?: number;
  message?: string;
  confirmationSent?: boolean;
}

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

async function postToServer(url: string, body: unknown): Promise<SubmitResult> {
  const res = await fetch(url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, mode: 'server', status: res.status, message: data?.message, confirmationSent: data?.confirmationSent };
}

async function postToEndpoint(fields: Record<string, string>, subject: string, replyTo: string): Promise<SubmitResult> {
  const res = await fetch(FORMS_ENDPOINT, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ ...fields, _subject: subject, _replyto: replyTo }),
  });
  return { ok: res.ok, mode: 'endpoint', status: res.status };
}

function openEmailApp(subject: string, lines: string[]): SubmitResult {
  const body = lines.filter(Boolean).join('\n');
  window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { ok: true, mode: 'mailto' };
}

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export async function submitContact(data: ContactPayload): Promise<SubmitResult> {
  if (!IS_STATIC) return postToServer('/api/contact', data);

  const subject = `New Project Enquiry from ${data.name} — ${data.projectType}`;
  if (FORMS_ENDPOINT) return postToEndpoint({ ...data }, subject, data.email);

  return openEmailApp(subject, [
    data.message,
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company && `Company: ${data.company}`,
    `Project type: ${data.projectType}`,
    data.budget && `Budget: ${data.budget}`,
    data.timeline && `Timeline: ${data.timeline}`,
  ]);
}

export interface BookingPayload {
  name: string;
  email: string;
  date: string; // YYYY-MM-DD (India)
  time: string; // HH:mm (India)
  dateLabel: string;
  timeLabel: string;
  timeZone: string;
}

export async function submitBooking(data: BookingPayload): Promise<SubmitResult> {
  if (!IS_STATIC) {
    return postToServer('/api/booking', {
      name: data.name,
      email: data.email,
      date: data.date,
      time: data.time,
      timeZone: data.timeZone,
    });
  }

  const subject = `Call request — ${data.name}, ${data.dateLabel} ${data.timeLabel} IST`;
  if (FORMS_ENDPOINT) {
    return postToEndpoint(
      {
        name: data.name,
        email: data.email,
        date: data.dateLabel,
        time: `${data.timeLabel} IST`,
        visitorTimeZone: data.timeZone,
        message: `Please confirm a 30-minute call on ${data.dateLabel} at ${data.timeLabel} IST.`,
      },
      subject,
      data.email
    );
  }

  return openEmailApp(subject, [
    `Hi Shivam, I would like to book a 30-minute call.`,
    '',
    `Date: ${data.dateLabel}`,
    `Time: ${data.timeLabel} IST (India)`,
    data.timeZone && `My time zone: ${data.timeZone}`,
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ]);
}
