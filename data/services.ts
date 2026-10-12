export interface Service {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    number: '01',
    title: 'SaaS Development',
    description:
      'Build production-ready SaaS products from idea to deployment.',
    icon: 'layers',
  },
  {
    number: '02',
    title: 'Web Development',
    description:
      'Build fast, modern and conversion-focused websites for businesses and startups.',
    icon: 'globe',
  },
  {
    number: '03',
    title: 'AI Integration',
    description:
      'Integrate AI, LLMs, RAG and intelligent features into modern applications.',
    icon: 'brain',
  },
  {
    number: '04',
    title: 'Automation',
    description:
      'Automate repetitive business workflows using APIs, AI and modern automation tools.',
    icon: 'zap',
  },
];
