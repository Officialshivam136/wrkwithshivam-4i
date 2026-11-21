'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { experience, type Experience } from '@/data/experience';
import { withBase } from '@/lib/runtime';

const typeBadge: Record<Experience['type'], { label: string; className: string }> = {
  'ai-engineer': { label: 'AI Engineer', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  'full-time': { label: 'Full-Time', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
  internship: { label: 'Internship', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25' },
  freelance: { label: 'Freelance', className: 'bg-accent/10 text-accent-hover border-accent/25' },
};

const period = (exp: Experience) =>
  exp.startDate ? `${exp.startDate} — ${exp.endDate}` : exp.endDate;

export function ExperienceSection() {
  const [activeId, setActiveId] = useState(experience[0]?.id);

  if (!experience || experience.length === 0) return null;

  const active = experience.find((exp) => exp.id === activeId) ?? experience[0];
  const badge = typeBadge[active.type];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = experience[(index + dir + experience.length) % experience.length];
    setActiveId(next.id);
    document.getElementById(`exp-tab-${next.id}`)?.focus();
  };

  return (
    <section id="experience" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeading
            eyebrow="Experience"
            title="Where I&rsquo;ve Worked."
            description="Pick a role to see what I did there."
            className="mb-0 md:mb-0"
          />
          <motion.a
            href={withBase('/shivam-singh-resume.docx')}
            download
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light bg-bg-primary text-sm font-semibold text-text-primary hover:border-accent hover:text-accent-hover transition-all shrink-0 group self-start sm:self-auto"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
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
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid lg:grid-cols-12 gap-6 lg:gap-10"
        >
          {/* Role picker — a timeline on desktop, a swipeable row on mobile */}
          <div
            role="tablist"
            aria-label="Roles"
            className="lg:col-span-4 lg:self-start relative flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0 [scrollbar-width:none]"
          >
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-[19px] top-6 bottom-6 w-px bg-border-light" />

            {experience.map((exp, index) => {
              const isActive = exp.id === active.id;
              return (
                <button
                  key={exp.id}
                  id={`exp-tab-${exp.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="exp-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(exp.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    'relative shrink-0 lg:shrink text-left rounded-xl pl-4 lg:pl-12 pr-5 py-4 min-w-[220px] lg:min-w-0 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'border-accent/40 text-text-primary'
                      : 'border-border bg-bg-primary/40 text-text-secondary hover:text-text-primary hover:border-border-light'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="exp-active"
                      className="absolute inset-0 rounded-xl bg-accent/10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {/* Timeline dot */}
                  <span
                    className={cn(
                      'hidden lg:block absolute left-[14px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full ring-4 ring-bg-secondary transition-colors',
                      isActive ? 'bg-accent-hover shadow-[0_0_14px_3px_rgba(59,130,246,0.6)]' : 'bg-border-light'
                    )}
                  />
                  <span className="relative block font-heading font-semibold text-[15px] leading-snug">
                    {exp.company}
                  </span>
                  <span className="relative block text-xs mt-1 text-text-tertiary">
                    {period(exp)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected role */}
          <div id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${active.id}`} className="lg:col-span-8">
            <TiltCard max={2} className="rounded-2xl">
              <div className="h-full min-h-[420px] p-6 md:p-10 rounded-2xl border border-border bg-bg-primary overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', badge.className)}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-text-tertiary">{period(active)}</span>
                    </div>

                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mt-5">
                      {active.role}
                    </h3>
                    <p className="text-text-secondary mt-2">
                      <span className="text-accent-hover font-medium">{active.company}</span>
                      <span className="text-text-tertiary"> &middot; {active.location}</span>
                    </p>

                    {active.summary && (
                      <p className="text-text-secondary mt-5 leading-relaxed border-l-2 border-accent/50 pl-4">
                        {active.summary}
                      </p>
                    )}

                    <ul className="space-y-3 mt-6">
                      {active.highlights.map((highlight, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                          className="flex gap-3 text-sm md:text-[15px] text-text-secondary leading-relaxed"
                        >
                          <svg className="mt-1 w-4 h-4 shrink-0 text-accent-hover" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>

                    {active.links && active.links.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-8">
                        {active.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-light text-sm font-medium text-text-primary hover:border-accent hover:text-accent-hover transition-colors"
                          >
                            {link.label} <span aria-hidden="true">↗</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
