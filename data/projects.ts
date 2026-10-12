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
    image: 'https://image.thum.io/get/width/800/crop/500/https://www.sunteckindia.com/',
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
    image: 'https://image.thum.io/get/width/800/crop/500/https://modomgrooming.com/',
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
    image: 'https://image.thum.io/get/width/800/crop/500/https://movix-gilt.vercel.app/',
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
    image: 'https://image.thum.io/get/width/800/crop/500/https://leavecodetech.netlify.app/',
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
    image: 'https://image.thum.io/get/width/800/crop/500/https://codeplaced-test.netlify.app/',
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
