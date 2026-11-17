'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TagSphere } from '@/components/ui/TagSphere';
import { stack } from '@/data/stack';

export function TechStack() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const tags = useMemo(
    () => stack.flatMap((category) => category.technologies.map((tech) => ({ label: tech.name, group: category.name }))),
    []
  );

  return (
    <section id="stack" className="py-24 md:py-32 bg-bg-secondary overflow-hidden">
      <Container className="max-w-7xl">
        <SectionHeading
          eyebrow="Stack"
          title="Tools We Use to Build Products."
          description="Drag the globe to spin it, or pick a category to light up its tools."
          className="mb-10 md:mb-12"
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Categories — the plain, readable list */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-3 order-2 lg:order-1"
          >
            {stack.map((category) => {
              const isActive = activeGroup === category.name;
              return (
                <button
                  key={category.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveGroup(isActive ? null : category.name)}
                  className={cn(
                    'text-left rounded-xl border px-5 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'border-accent/50 bg-accent/10'
                      : 'border-border bg-bg-primary/50 hover:border-border-light'
                  )}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className={cn('text-sm uppercase tracking-[0.18em] font-semibold', isActive ? 'text-accent-hover' : 'text-text-primary')}>
                      {category.name}
                    </span>
                    <span className="text-xs text-text-tertiary">{category.technologies.length} tools</span>
                  </span>
                  <span className="block text-sm text-text-secondary mt-1.5">
                    {category.technologies.map((tech) => tech.name).join(' · ')}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* 3D globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 mx-auto w-full max-w-[520px]"
          >
            <TagSphere tags={tags} activeGroup={activeGroup} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
