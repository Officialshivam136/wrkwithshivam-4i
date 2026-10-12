export interface Technology {
  name: string;
  icon?: string;
}

export interface TechCategory {
  name: string;
  technologies: Technology[];
}

export const stack: TechCategory[] = [
  {
    name: 'Frontend',
    technologies: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    name: 'Backend',
    technologies: [
      { name: 'Node.js' },
      { name: 'Java' },
      { name: 'Spring Boot' },
    ],
  },
  {
    name: 'Databases',
    technologies: [
      { name: 'MongoDB' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'Redis' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    technologies: [
      { name: 'AWS' },
      { name: 'Docker' },
      { name: 'Git' },
      { name: 'GitHub' },
    ],
  },
  {
    name: 'AI',
    technologies: [
      { name: 'OpenAI' },
      { name: 'LangChain' },
      { name: 'RAG' },
      { name: 'Vector Databases' },
    ],
  },
];
