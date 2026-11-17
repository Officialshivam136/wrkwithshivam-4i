// One place for sending email, so the contact form and the booking route behave the same.

export interface MailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  fromName?: string;
  attachments?: MailAttachment[];
  /** Sent as an inline calendar invite so mail apps show "Add to calendar". */
  icalEvent?: { method: string; content: string };
}

/** The address that receives enquiries and bookings. */
export function ownerEmail(): string {
  return process.env.CONTACT_EMAIL || 'shivam.klg136@gmail.com';
}

/** True once SMTP_HOST, SMTP_USER and a real SMTP_PASS are set. */
export function emailConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  return !/^your-|app-password-here/i.test(SMTP_PASS); // the placeholder from .env.example
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  if (!emailConfigured()) return false;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Never leave a visitor waiting on a slow mail server.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transporter.sendMail({
      from: `"${options.fromName || 'Shivam Singh'}" <${process.env.SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject.replace(/[\r\n]+/g, ' '),
      html: options.html,
      text: options.text,
      attachments: options.attachments,
      icalEvent: options.icalEvent,
    });
    return true;
  } catch (err) {
    console.error('Email failed:', err instanceof Error ? err.message : err);
    return false;
  }
}
