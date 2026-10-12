'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/site';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export function Capabilities() {
  return (
    <section id="capabilities" className="w-full py-16 border-y border-border">
      <Container className="max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-8"
        >
          {siteConfig.capabilities.map((capability, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex items-center gap-2 md:gap-3"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 bg-accent flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-text-secondary tracking-wide uppercase">
                {capability}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
