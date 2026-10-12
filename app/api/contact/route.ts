import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  website?: string; // honeypot
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

function saveSubmission(data: Record<string, string | undefined>) {
  try {
    const submissionsDir = path.join(process.cwd(), 'submissions');
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }
    const filePath = path.join(submissionsDir, 'contact-submissions.json');
    let submissions: Record<string, string | undefined>[] = [];
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, 'utf-8');
      submissions = JSON.parse(existing);
    }
    submissions.push({
      ...data,
      submittedAt: new Date().toISOString(),
    });
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
  } catch (err) {
    console.error('Failed to save submission:', err);
  }
}

async function sendEmail(data: Record<string, string | undefined>) {
  // Only attempt if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactEmail = process.env.CONTACT_EMAIL || 'shivam.klg136@gmail.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('SMTP not configured — submission saved to file only.');
    return false;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: contactEmail,
      replyTo: data.email,
      subject: `New Project Enquiry from ${data.name} — ${data.projectType}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#6366f1;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 4px;color:#888;width:120px;">Name</td><td style="padding:8px 4px;font-weight:600;">${data.name}</td></tr>
            <tr><td style="padding:8px 4px;color:#888;">Email</td><td style="padding:8px 4px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:8px 4px;color:#888;">Company</td><td style="padding:8px 4px;">${data.company || '—'}</td></tr>
            <tr><td style="padding:8px 4px;color:#888;">Project Type</td><td style="padding:8px 4px;">${data.projectType}</td></tr>
            <tr><td style="padding:8px 4px;color:#888;">Budget</td><td style="padding:8px 4px;">${data.budget || '—'}</td></tr>
            <tr><td style="padding:8px 4px;color:#888;">Timeline</td><td style="padding:8px 4px;">${data.timeline || '—'}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:8px;">
            <p style="color:#888;margin:0 0 8px;font-size:13px;">Message</p>
            <p style="margin:0;white-space:pre-wrap;">${data.message}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#aaa;">Sent from your portfolio contact form</p>
        </div>
      `,
    });
    console.log('Email sent successfully to', contactEmail);
    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactFormData>;

    // Honeypot check — silently accept but ignore
    if (body.website) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 200 }
      );
    }

    // Rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const submissionData = {
      name,
      email,
      company: body.company,
      projectType,
      budget: body.budget,
      timeline: body.timeline,
      message,
    };

    // Always save to local file
    saveSubmission(submissionData);

    // Log to console
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(JSON.stringify(submissionData, null, 2));
    console.log('-----------------------------------');

    // Try to send email (if SMTP configured)
    await sendEmail(submissionData);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully! We\'ll get back to you within 24 hours.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
