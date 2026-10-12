import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BookingData {
  name: string;
  email: string;
  date: string;
  time: string;
  timeLabel?: string;
  dateLabel?: string;
  duration: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<BookingData>;

    const { name, email, date, time, duration } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email.' },
        { status: 400 }
      );
    }

    // Save booking to file
    const submissionsDir = path.join(process.cwd(), 'submissions');
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    const filePath = path.join(submissionsDir, 'bookings.json');
    let bookings: Record<string, unknown>[] = [];
    if (fs.existsSync(filePath)) {
      bookings = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const booking = {
      name,
      email,
      date,
      time,
      timeLabel: body.timeLabel,
      dateLabel: body.dateLabel,
      duration: duration || 30,
      bookedAt: new Date().toISOString(),
    };

    bookings.push(booking);
    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));

    console.log('--- NEW BOOKING ---');
    console.log(JSON.stringify(booking, null, 2));
    console.log('-------------------');

    // Try sending email notification
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const contactEmail = process.env.CONTACT_EMAIL || 'shivam.klg136@gmail.com';

      if (smtpHost && smtpUser && smtpPass) {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Portfolio Booking" <${smtpUser}>`,
          to: contactEmail,
          replyTo: email,
          subject: `📅 New Call Booking — ${name} on ${body.dateLabel} at ${body.timeLabel}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
              <h2 style="color:#6366f1;">New Call Booking</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 4px;color:#888;width:100px;">Name</td><td style="padding:8px 4px;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:8px 4px;color:#888;">Email</td><td style="padding:8px 4px;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 4px;color:#888;">Date</td><td style="padding:8px 4px;">${body.dateLabel || date}</td></tr>
                <tr><td style="padding:8px 4px;color:#888;">Time</td><td style="padding:8px 4px;">${body.timeLabel || time}</td></tr>
                <tr><td style="padding:8px 4px;color:#888;">Duration</td><td style="padding:8px 4px;">30 minutes</td></tr>
              </table>
              <p style="margin-top:16px;font-size:12px;color:#aaa;">Remember to accept the calendar invite and start the Google Meet at the scheduled time.</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Booking email notification failed:', emailErr);
    }

    return NextResponse.json(
      { success: true, message: 'Booking confirmed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
