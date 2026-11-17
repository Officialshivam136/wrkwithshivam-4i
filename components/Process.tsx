'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const steps = [
  { number: '01', title: 'DISCOVER', description: 'Understand the business, users and requirements.' },
  { number: '02', title: 'DESIGN', description: 'Plan the experience, architecture and product flow.' },
  { number: '03', title: 'BUILD', description: 'Develop, integrate, test and iterate.' },
  { number: '04', title: 'LAUNCH', description: 'Deploy, monitor and improve.' },
];

export function Process() {
  const track = useRef<HTMLDivElement>(null);
  // The connecting line fills in as the section scrolls through the screen.
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <SectionHeading eyebrow="Process" title="From Idea to Production." />

        <div ref={track} className="mt-16 md:mt-24 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border-light" />
          <motion.div
            style={{ scaleX: progress }}
            className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px origin-left bg-gradient-to-r from-accent via-cyan-400 to-pink-400"
          />
          {/* Mobile connecting line */}
          <div className="md:hidden absolute top-6 bottom-6 left-6 w-px bg-border-light" />
          <motion.div
            style={{ scaleY: progress }}
            className="md:hidden absolute top-6 bottom-6 left-6 w-px origin-top bg-gradient-to-b from-accent via-cyan-400 to-pink-400"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="group flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-accent bg-bg-secondary flex items-center justify-center text-accent-hover font-heading font-bold text-sm transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]">
                  {step.number}
                </div>

                <div className="md:text-center md:mt-6 flex flex-col md:items-center pt-2 md:pt-0">
                  <h3 className="font-heading font-bold text-lg text-text-primary tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed md:max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
