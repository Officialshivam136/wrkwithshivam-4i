'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { stack, type TechCategory } from '@/data/stack';

export function TechStack() {
  return (
    <section id="stack" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <SectionHeading 
          eyebrow="Stack" 
          title="Tools I Use to Build Products." 
        />
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16"
        >
          {stack.map((category: TechCategory, index: number) => (
            <motion.div 
              key={category.name} 
              variants={fadeInUp}
              className="flex flex-col"
            >
              <h3 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="px-4 py-2.5 rounded-lg border border-border bg-bg-primary text-sm text-text-secondary font-medium hover:border-border-light hover:text-text-primary hover:bg-bg-elevated transition-all duration-200 cursor-default"
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
