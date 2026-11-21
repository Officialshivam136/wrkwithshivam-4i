'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { ServiceGraphic } from '@/components/ui/ServiceGraphic';
import { services } from '@/data/services';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const icons: Record<string, React.ReactNode> = {
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </>
  ),
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
};

// Full class names so Tailwind can see them.
const tones = {
  blue: { tile: 'from-blue-500/25 to-blue-500/5 text-blue-600 ring-blue-500/30 dark:text-blue-400', check: 'text-blue-600 dark:text-blue-400', link: 'text-blue-600 dark:text-blue-400', hover: 'hover:border-blue-500/50', num: 'text-blue-600/80 dark:text-blue-400/80' },
  emerald: { tile: 'from-emerald-500/25 to-emerald-500/5 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400', check: 'text-emerald-600 dark:text-emerald-400', link: 'text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-500/50', num: 'text-emerald-600/80 dark:text-emerald-400/80' },
  amber: { tile: 'from-amber-500/25 to-amber-500/5 text-amber-600 ring-amber-500/30 dark:text-amber-400', check: 'text-amber-600 dark:text-amber-400', link: 'text-amber-700 dark:text-amber-400', hover: 'hover:border-amber-500/50', num: 'text-amber-600/80 dark:text-amber-400/80' },
  rose: { tile: 'from-rose-500/25 to-rose-500/5 text-rose-600 ring-rose-500/30 dark:text-rose-400', check: 'text-rose-600 dark:text-rose-400', link: 'text-rose-600 dark:text-rose-400', hover: 'hover:border-rose-500/50', num: 'text-rose-600/80 dark:text-rose-400/80' },
} as const;

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-bg-primary">
      <Container className="max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="What We Build."
          description="Four ways we can help — from a first website to a full product."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-12 md:mt-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {services.map((service) => (
            <motion.div key={service.number} variants={fadeInUp} className="h-full">
              <TiltCard max={2.5} className="rounded-2xl">
                <article className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8 transition-colors duration-300 ${tones[service.tone].hover}`}>

                  <div className="relative mb-6">
                    <ServiceGraphic kind={service.icon} />
                  </div>

                  <div className="relative flex items-center gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-105 ${tones[service.tone].tile}`}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-7 w-7"
                        aria-hidden="true"
                      >
                        {icons[service.icon]}
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
                      {service.title}
                    </h3>
                    <span aria-hidden="true" className={`ml-auto self-start font-heading text-sm font-bold ${tones[service.tone].num}`}>
                      {service.number}
                    </span>
                  </div>

                  <p className="relative mt-5 leading-relaxed text-text-secondary">
                    {service.description}
                  </p>

                  <ul className="relative mt-6 grid gap-x-6 gap-y-3 border-t border-border pt-6 sm:grid-cols-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`mt-0.5 h-4 w-4 shrink-0 ${tones[service.tone].check}`}
                          aria-hidden="true"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`relative mt-auto inline-flex items-center gap-1.5 self-start pt-7 pb-1 text-sm font-semibold transition-all hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm ${tones[service.tone].link}`}
                  >
                    Discuss this project <span aria-hidden="true">→</span>
                  </a>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
