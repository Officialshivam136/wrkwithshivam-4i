import { NextRequest, NextResponse } from 'next/server';
import {
  appendToSubmissions,
  cleanText,
  createRateLimiter,
  escapeHtml,
  getClientIp,
  isValidEmail,
  readJsonBody,
} from '@/lib/api-security';
import { ownerEmail, sendMail } from '@/lib/email';

const allowRequest = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

const PROJECT_TYPES = ['Website', 'SaaS Product', 'AI Integration', 'Automation', 'Existing Product', 'Other'];

interface Submission {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
}

async function sendEmail(data: Submission): Promise<boolean> {
  // Everything below came from a visitor, so it is escaped before going into HTML.
  const e = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    company: data.company ? escapeHtml(data.company) : '—',
    projectType: escapeHtml(data.projectType),
    budget: data.budget ? escapeHtml(data.budget) : '—',
    timeline: data.timeline ? escapeHtml(data.timeline) : '—',
    message: escapeHtml(data.message),
  };

  return sendMail({
    to: ownerEmail(),
    replyTo: data.email,
    fromName: 'Portfolio Contact',
    subject: `New Project Enquiry from ${data.name} — ${data.projectType}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#2563eb;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 4px;color:#888;width:120px;">Name</td><td style="padding:8px 4px;font-weight:600;">${e.name}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Email</td><td style="padding:8px 4px;"><a href="mailto:${e.email}">${e.email}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Company</td><td style="padding:8px 4px;">${e.company}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Project Type</td><td style="padding:8px 4px;">${e.projectType}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Budget</td><td style="padding:8px 4px;">${e.budget}</td></tr>
          <tr><td style="padding:8px 4px;color:#888;">Timeline</td><td style="padding:8px 4px;">${e.timeline}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:8px;">
          <p style="color:#888;margin:0 0 8px;font-size:13px;">Message</p>
          <p style="margin:0;white-space:pre-wrap;">${e.message}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#aaa;">Reply to this email to answer ${e.name} directly.</p>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  if (!body) {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — pretend it worked, store nothing.
  if (body.website) {
    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  }

  if (!allowRequest(getClientIp(request))) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const projectType = cleanText(body.projectType, 40);
  const message = cleanText(body.message, 5000, true);
  const company = body.company ? cleanText(body.company, 100) : '';
  const budget = body.budget ? cleanText(body.budget, 40) : '';
  const timeline = body.timeline ? cleanText(body.timeline, 40) : '';

  if (!name || !email || !projectType || !message) {
    return NextResponse.json({ success: false, message: 'Missing or invalid fields.' }, { status: 400 });
  }
  if (company === undefined || budget === undefined || timeline === undefined) {
    return NextResponse.json({ success: false, message: 'One of the fields is too long.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, message: 'Invalid email format.' }, { status: 400 });
  }
  if (!PROJECT_TYPES.includes(projectType)) {
    return NextResponse.json({ success: false, message: 'Invalid project type.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { success: false, message: 'Message must be at least 10 characters long.' },
      { status: 400 }
    );
  }

  const submission: Submission = {
    name,
    email,
    company: company || undefined,
    projectType,
    budget: budget || undefined,
    timeline: timeline || undefined,
    message,
  };

  const [saved, emailed] = await Promise.all([
    appendToSubmissions('contact-submissions.json', { ...submission, submittedAt: new Date().toISOString() }),
    sendEmail(submission),
  ]);

  // If neither worked the enquiry is lost — tell the visitor instead of pretending.
  if (saved !== 'saved' && !emailed) {
    console.error('Contact submission could not be stored or emailed.');
    return NextResponse.json(
      { success: false, message: 'Could not send your message right now. Please email me directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Message sent successfully! I'll get back to you within 24 hours.",
  });
}
