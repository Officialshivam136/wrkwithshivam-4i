'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experience, type Experience } from '@/data/experience';

const typeBadge: Record<Experience['type'], { label: string; className: string }> = {
  'full-time': { label: 'Full-Time', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  internship: { label: 'Internship', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  freelance: { label: 'Freelance', className: 'bg-accent/10 text-accent border-accent/20' },
};

export function ExperienceSection() {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 md:mb-20">
          <SectionHeading
            eyebrow="Experience"
            title="Where I&rsquo;ve Worked."
            className="mb-0"
          />
          <motion.a
            href="/shivam-singh-resume.docx"
            download
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light bg-bg-primary text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-all shrink-0 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
            </svg>
            Download Resume
          </motion.a>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-12">
            {experience.map((exp) => {
              const badge = typeBadge[exp.type];
              return (
                <motion.div
                  key={exp.id}
                  variants={fadeInUp}
                  className="relative pl-8 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-8 top-1.5 w-2.5 h-2.5 rounded-full bg-accent -translate-x-1/2 ring-4 ring-bg-secondary" />

                  {/* Card */}
                  <div className="p-6 md:p-8 rounded-2xl border border-border bg-bg-primary hover:border-border-light transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-heading text-lg md:text-xl font-bold text-text-primary">
                          {exp.role}
                        </h3>
                        <p className="text-text-secondary text-sm mt-1">
                          {exp.company}
                          <span className="text-text-tertiary"> &middot; {exp.location}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badge.className}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-text-tertiary whitespace-nowrap">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mt-4">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
