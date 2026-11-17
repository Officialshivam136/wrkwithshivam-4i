export interface Service {
  number: string;
  title: string;
  description: string;
  icon: string;
  /** What is included — shown as a checklist on the card. */
  points: string[];
}

export const services: Service[] = [
  {
    number: '01',
    title: 'SaaS Development',
    description:
      'Build production-ready SaaS products from idea to deployment.',
    icon: 'layers',
    points: ['Login, roles & subscriptions', 'Dashboards & admin panels', 'AI features & automated workflows', 'Scalable cloud architecture'],
  },
  {
    number: '02',
    title: 'Web Development',
    description:
      'Build fast, modern and conversion-focused websites for businesses and startups.',
    icon: 'globe',
    points: ['Responsive, mobile-first design', 'Fast loading & SEO-ready', 'AI chat & automated lead follow-up', 'Stores, blogs & CMS'],
  },
  {
    number: '03',
    title: 'AI Integration',
    description:
      'Integrate AI, LLMs, RAG and intelligent features into modern applications.',
    icon: 'brain',
    points: ['Chatbots & voice assistants', 'RAG on your own documents', 'WhatsApp & app integrations', 'Smart search & summaries'],
  },
  {
    number: '04',
    title: 'AI Automation',
    description:
      'Automate repetitive work with AI agents, APIs and modern automation tools, so your team can focus on growth.',
    icon: 'zap',
    points: ['AI agents for routine tasks', 'Lead capture & instant replies', 'Reports, alerts & data syncing', 'Connect your tools & APIs'],
  },
];
