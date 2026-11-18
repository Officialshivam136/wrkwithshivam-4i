export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  status: 'published' | 'coming-soon' | 'draft';
  /** Shown as the large flagship card above the project grid. */
  hero?: boolean;
  /** When a coming-soon project launches (ISO date with offset). Shows a live countdown on its card. */
  launchDate?: string;
  problem?: string;
  goal?: string;
  solution?: string;
  features?: string[];
  architecture?: string;
  screenshots?: string[];
  challenges?: string;
  implementation?: string;
  results?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'sunteck-realty',
    title: 'Sunteck Realty',
    category: 'Web Development',
    shortDescription:
      'Corporate website for Sunteck Realty — one of Mumbai\'s leading luxury real estate developers.',
    description:
      'Built the corporate website for Sunteck Realty, a publicly listed luxury real estate development company based in Mumbai. The website serves as the primary digital presence for the brand, showcasing their premium residential and commercial properties across Mumbai.',
    image: '/projects/sunteck-realty.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://www.sunteckindia.com/',
    featured: true,
    status: 'published',
    goal: 'Create a premium, conversion-focused corporate website that reflects the luxury positioning of the Sunteck Realty brand and drives property enquiries.',
    features: [
      'Responsive design optimized for all devices',
      'Property showcase with detailed project pages',
      'Lead generation forms and enquiry system',
      'SEO-optimized structure for real estate keywords',
      'Performance-focused build for fast page loads',
    ],
  },
  {
    id: '2',
    slug: 'modom-grooming',
    title: 'MODOM Grooming',
    category: 'Web Development',
    shortDescription:
      'E-commerce website and social media management for a premium grooming brand based in Zürich, Switzerland.',
    description:
      'Built and manage the full e-commerce website and social media presence for MODOM Grooming — a premium haircare and grooming brand based in Zürich, Switzerland. The website features a complete online store with product catalog, shopping cart, user accounts, and secure checkout.',
    image: '/projects/modom-grooming.jpg',
    technologies: ['WordPress', 'WooCommerce', 'CSS', 'JavaScript'],
    liveUrl: 'https://modomgrooming.com/',
    featured: true,
    status: 'published',
    goal: 'Build a premium e-commerce experience for a grooming brand that reflects the quality of their products, drives online sales, and supports B2B wholesale partnerships.',
    features: [
      'Full e-commerce store with WooCommerce integration',
      'Product catalog with categories — Hair Care, Beard Care, Bold Care',
      'User accounts, order tracking, and address management',
      'B2B wholesale portal for partner access',
      'Social media strategy and content management',
      'Responsive design optimized for mobile shopping',
      'SEO-optimized product pages and blog',
    ],
  },
  {
    id: '3',
    slug: 'movix',
    title: 'Movix',
    category: 'Web Development',
    shortDescription:
      'A movie trailer watching platform — browse, search and watch trailers for the latest and trending movies.',
    description:
      'Movix is a movie trailer watching website that lets users discover, search and watch trailers for trending, popular and upcoming movies. The platform pulls real-time data from movie databases to keep content fresh and up-to-date.',
    image: '/projects/movix.jpg',
    technologies: ['React', 'JavaScript', 'CSS', 'API Integration'],
    featured: true,
    status: 'coming-soon',
    goal: 'Build a sleek, content-rich movie discovery platform where users can browse trending films, search by title, and watch trailers — all in one place.',
    features: [
      'Browse trending and popular movie trailers',
      'Search functionality to find any movie',
      'Real-time data from movie database APIs',
      'Responsive design for all devices',
      'Clean, modern UI for seamless browsing',
    ],
  },
  {
    id: '4',
    slug: 'leavecode-technologies',
    title: 'LeaveCode Technologies',
    category: 'Web Development',
    shortDescription:
      'Corporate website for a digital product engineering agency — premium design with service showcases, case studies and lead generation.',
    description:
      'Built the corporate website for LeaveCode Technologies, a full-stack product engineering agency offering web and mobile application development, cloud infrastructure, and data-driven SEO solutions. The site positions the brand as an enterprise-grade partner for startups and businesses.',
    image: '/projects/leavecode-technologies.jpg',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript'],
    liveUrl: 'https://leavecodetech.netlify.app/',
    featured: true,
    status: 'published',
    goal: 'Create a premium corporate website that positions LeaveCode Technologies as a high-end digital product engineering agency and drives B2B lead generation.',
    features: [
      'Premium agency-grade design with smooth animations',
      'Service showcase with detailed capability breakdowns',
      'Case study and portfolio presentation',
      'Lead generation forms and conversion-focused CTAs',
      'Fully responsive design across all devices',
      'SEO-optimized structure for organic visibility',
    ],
  },
  {
    id: '5',
    slug: 'codeplaced',
    title: 'CodePlaced',
    category: 'Web Development',
    shortDescription:
      'Website for a fractional EdTech growth team — specializing in server-side tracking, paid acquisition audits, and RevOps for scaling SaaS.',
    description:
      'Built the website for CodePlaced, a fractional growth engineering team that helps EdTech and SaaS companies scale through server-side tracking, paid acquisition audits, and RevOps consulting. The site communicates their niche expertise and drives qualified inbound leads.',
    image: '/projects/codeplaced.jpg',
    technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Netlify'],
    liveUrl: 'https://codeplaced-test.netlify.app/',
    featured: true,
    status: 'published',
    goal: 'Build a focused landing site that clearly communicates CodePlaced\'s niche growth engineering services and converts EdTech/SaaS visitors into consultation bookings.',
    features: [
      'Clean, conversion-focused landing page design',
      'Service breakdowns for tracking, acquisition and RevOps',
      'Responsive layout optimized for all screen sizes',
      'Fast static deployment on Netlify',
      'Clear call-to-action flows for lead capture',
    ],
  },
  {
    id: '6',
    slug: 'bmb-bijnor',
    title: 'Bikaner Misthan Bhandar',
    category: 'Web Development',
    shortDescription:
      'Full-stack e-commerce website for a traditional sweet shop in Bijnor — online menu, ordering system, and patron rewards program.',
    description:
      'Built a complete e-commerce website for Bikaner Misthan Bhandar (BMB), a beloved sweet shop in Civil Lines, Bijnor known for their pure desi ghee mithai and snacks. The site features an online menu with categorized sweets, a patron rewards loyalty program, promotional coupons, and a modern ordering experience — bringing a traditional local business into the digital age.',
    image: '/projects/bmb-bijnor.jpg',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    liveUrl: 'https://bmb-civil-lines-bijnor.vercel.app/',
    githubUrl: 'https://github.com/Officialshivam136/bmb-civil-lines-bijnor',
    featured: true,
    status: 'published',
    goal: 'Digitize a traditional Bijnor sweet shop with a modern e-commerce website that showcases their menu, enables online ordering, and builds customer loyalty through a VIP patron rewards system.',
    features: [
      'Categorized menu — Traditional Mithai, Kaju & Dry Fruits, Barfi & Milk Sweets, Laddu, Snacks & Chaat, Festive Gift Boxes',
      'VIP Patron Rewards program with order tracking and flat 10% discount',
      'Promotional offers and festive coupon system',
      'Responsive design optimized for mobile ordering',
      'Fast, SEO-optimized Next.js build deployed on Vercel',
      'Local business branding with premium visual design',
    ],
  },
  {
    id: '7',
    slug: 'voiceai-whatsapp-assistant',
    title: 'VoiceAI WhatsApp Assistant',
    category: 'AI Product',
    shortDescription:
      'One voice-powered assistant on WhatsApp that books your groceries, flights, trains and movies — all in a single chat.',
    description:
      'VoiceAI WhatsApp Assistant is an AI assistant that lives inside WhatsApp. Instead of juggling separate apps for groceries, flights, trains and movie tickets, you simply tell it what you need — by voice or text — and it handles the booking for you in one conversation. Currently in development.',
    image: '',
    technologies: ['Voice AI', 'WhatsApp', 'Automation'],
    featured: true,
    hero: true,
    launchDate: '2026-11-20T00:00:00+05:30', // 20 Nov 2026, 12:00 AM IST
    status: 'coming-soon',
    goal: 'Replace a phone full of booking apps with one assistant you can talk to on WhatsApp.',
    features: [
      'Voice and text requests, straight from WhatsApp',
      'Grocery orders in a single message',
      'Flight and train booking',
      'Movie ticket booking',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getPublishedProjects(): Project[] {
  return projects.filter((p) => p.status === 'published');
}
