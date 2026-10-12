'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, className, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn(
        'mb-16 md:mb-20',
        align === 'center' && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <div className={cn(
          'flex items-center gap-3 mb-5',
          align === 'center' && 'justify-center'
        )}>
          <span className="h-px w-6 bg-accent" />
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent">
            {eyebrow}
          </p>
        </div>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className={cn(
          'mt-4 max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed',
          align === 'center' && 'mx-auto'
        )}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
