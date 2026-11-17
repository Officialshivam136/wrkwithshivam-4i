'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/data/site';

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-bg-primary relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      </div>

      <Container className="max-w-4xl text-center relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-sm tracking-[0.25em] uppercase text-accent font-semibold mb-6">
            Ready to Start?
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
            Have an Idea?<br />
            Let&apos;s Build It.
          </h2>
          <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto mt-6 leading-relaxed">
            Tell me what you&apos;re trying to build. I&apos;ll figure out the right
            approach to turn your idea into a working product.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button variant="primary" size="lg" href="#contact">
              Start a Project
            </Button>
            <Button variant="secondary" size="lg" href={`mailto:${siteConfig.email}`}>
              Email Me
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
