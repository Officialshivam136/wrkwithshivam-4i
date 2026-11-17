export const siteConfig = {
  name: 'Shivam Singh',
  title: 'Shivam Singh — Full-Stack Developer | SaaS & AI',
  description:
    'Shivam Singh is a full-stack developer and founder of Ki2 Technologies, building modern websites, SaaS products, AI automations and AI-powered systems for startups and businesses.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shivamsingh.dev',
  ogImage: '/og-image.png',
  logo: 'SHIVAM.S',
  tagline: 'Full-Stack Developer • SaaS • AI',
  email: 'shivam.klg136@gmail.com',
  bookingUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1234567890',
  // The studio Shivam founded. Change the name or add the Instagram URL here
  // and it updates everywhere on the site (experience, about, contact, footer).
  company: {
    name: 'Ki2 Technologies',
    location: 'Bijnor, Uttar Pradesh',
    instagram: 'https://www.instagram.com/ki2technologies/',
    google: 'https://share.google/z8NbUFlty3HBB5QBh',
  },
  social: {
    github: 'https://github.com/Officialshivam136',
    linkedin: 'https://www.linkedin.com/in/shivamsingh7443/',
  },
  navItems: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
  capabilities: [
    'Full-Stack Development',
    'SaaS Products',
    'AI Integration',
    'AI Automation',
    'Cloud Deployment',
  ],
};
