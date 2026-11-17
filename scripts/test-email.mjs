// Checks that your email settings work, and sends you a test message.
//   npm run test:email
// Reads .env.local (the same file the website uses).

import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('✗ No .env.local file found.\n  Copy .env.example to .env.local, then fill in SMTP_PASS (see the comments inside).');
  process.exit(1);
}

for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !line.trim().startsWith('#')) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
}

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, CONTACT_EMAIL = SMTP_USER } = process.env;
const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`✗ Missing in .env.local: ${missing.join(', ')}`);
  process.exit(1);
}
if (/^your-|app-password-here/i.test(SMTP_PASS)) {
  console.error('✗ SMTP_PASS is still the placeholder. Put your Gmail app password there.');
  process.exit(1);
}

const nodemailer = await import('nodemailer');
const port = parseInt(SMTP_PORT, 10);
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  connectionTimeout: 10000,
});

try {
  await transporter.verify();
  console.log(`✓ Logged in to ${SMTP_HOST}:${port} as ${SMTP_USER}`);
  await transporter.sendMail({
    from: `"Portfolio test" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    subject: 'Portfolio email test — it works',
    text: 'If you can read this, enquiries and call bookings from your website will reach this inbox.',
  });
  console.log(`✓ Test email sent to ${CONTACT_EMAIL} — check the inbox (and spam folder).`);
} catch (err) {
  console.error('✗ Failed:', err.message);
  if (/Invalid login|535|Username and Password/i.test(err.message)) {
    console.error('  Gmail needs an App Password (not your normal password): https://myaccount.google.com/apppasswords');
  }
  process.exit(1);
}
