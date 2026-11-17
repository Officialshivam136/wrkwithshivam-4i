export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marco Bianchi',
    role: 'Founder',
    company: 'MODOM Grooming',
    quote:
      'Shivam built our entire e-commerce website from scratch and handles our social media presence. He understood our brand vision perfectly and delivered a site that our customers love. Very reliable and always available when we need updates.',
  },
  {
    id: '2',
    name: 'Rajesh Mehta',
    role: 'Project Manager',
    company: 'Sunteck Realty',
    quote:
      'Working with Shivam on our corporate website was a smooth experience. He delivered a clean, professional site that reflects our luxury brand positioning. The SEO improvements he implemented also helped drive more organic enquiries.',
  },
  {
    id: '3',
    name: 'Ankit Sharma',
    role: 'Engineering Lead',
    company: 'Zenskar',
    quote:
      'Shivam joined us as an intern and quickly became a key contributor. He built complex Angular modules independently, wrote clean TypeScript code, and never missed a sprint deadline. Highly recommend him for any frontend project.',
  },
];
