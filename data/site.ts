export const siteConfig = {
  name: 'Shivam Singh',
  title: 'Shivam Singh — Full-Stack Developer | SaaS & AI',
  description:
    'Shivam Singh is a full-stack developer building modern websites, SaaS products and AI-powered systems for startups and businesses.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shivamsingh.dev',
  ogImage: '/og-image.png',
  logo: 'SHIVAM.S',
  tagline: 'Full-Stack Developer • SaaS • AI',
  email: 'shivam.klg136@gmail.com',
  bookingUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1234567890',
  social: {
    github: 'https://github.com/shivamsingh',
    linkedin: 'https://www.linkedin.com/in/shivamsingh7443/',
  },
  navItems: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  capabilities: [
    'Full-Stack Development',
    'SaaS Products',
    'AI Integration',
    'Automation',
    'Cloud Deployment',
  ],
};
