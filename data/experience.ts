export interface Experience {
  id: string;
  role: string;
  company: string;
  type: 'full-time' | 'internship' | 'freelance';
  startDate: string;
  endDate: string;
  location: string;
  highlights: string[];
}

export const experience: Experience[] = [
  {
    id: '1',
    role: 'Freelance Website Developer',
    company: 'Modom Grooming',
    type: 'freelance',
    startDate: 'Jul 2024',
    endDate: 'Present',
    location: 'Remote',
    highlights: [
      'Built, launched and maintained the business website on WordPress, owning setup, customization, content structure and deployment.',
      'Customized the theme with custom CSS (child-theme approach) to deliver a responsive, mobile-first design across all devices.',
      'Configured plugins for SEO, contact forms and performance — keeping the stack lean to protect speed and security.',
      'Applied on-page SEO (meta titles, descriptions, heading hierarchy, image alt text) to improve search visibility.',
      'Improved page speed through image compression, caching and asset optimization for faster loading on mobile networks.',
    ],
  },
  {
    id: '2',
    role: 'Angular Developer (Intern)',
    company: 'Zenskar',
    type: 'internship',
    startDate: 'Jan 2024',
    endDate: 'Jun 2024',
    location: 'On-site',
    highlights: [
      'Delivered healthcare analytics modules in Angular by collaborating with UX designers, backend engineers and product managers.',
      'Built reusable, modular components with TypeScript following clean-code practices to improve maintainability.',
      'Integrated microservice-based modules with REST APIs independently with minimal supervision.',
      'Participated in Agile sprint planning, stand-ups and code reviews; debugged and resolved defects to keep releases on track.',
      'Maintained precise documentation and Git version control, achieving zero delivery lapses across sprints.',
    ],
  },
  {
    id: '3',
    role: 'React Developer (Intern)',
    company: 'Verizon',
    type: 'internship',
    startDate: 'Dec 2022',
    endDate: 'Jun 2023',
    location: 'On-site',
    highlights: [
      'Managed multiple concurrent features in a fast-paced environment while consistently maintaining high quality.',
      'Built reusable React components using hooks and props for responsive UI that worked across all screen sizes.',
      'Integrated front-end with REST APIs, handled asynchronous data, state management and error scenarios.',
      'Partnered with developers and stakeholders to meet deadlines, backed by thorough testing and QA.',
      'Used Git branching, pull requests and code reviews to fix bugs identified during QA cycles.',
    ],
  },
];
