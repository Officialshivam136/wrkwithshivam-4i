'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { slideInLeft, slideInRight } from '@/lib/animations';
import { Container } from '@/components/ui/Container';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-bg-primary overflow-hidden">
      <Container className="max-w-7xl">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column: Text */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col"
          >
            <motion.h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
              <span className="block">Turning Ideas Into</span>
              <span className="block">Production-Ready <span className="text-accent">Products.</span></span>
            </motion.h2>

            <p className="mt-6 text-text-secondary text-lg leading-relaxed">
              Founded by Shivam Singh — a Computer Science Engineer and full-stack
              developer specializing in modern web applications, SaaS products
              and AI-powered systems.
            </p>

            <p className="mt-4 text-text-secondary leading-relaxed">
              I partner with startups and businesses to take ideas from concept
              to production — delivering clean code, scalable architecture and
              real business value.
            </p>

            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                Education
              </h3>
              <div className="border-l-2 border-border-light pl-4 mb-4">
                <h4 className="font-medium text-text-primary">B.Tech in Computer Science Engineering</h4>
                <p className="text-sm text-text-secondary">Ajay Kumar Garg Engineering College, Ghaziabad</p>
              </div>
              <div className="border-l-2 border-border-light pl-4 mb-4">
                <h4 className="font-medium text-text-primary">Diploma in Computer Science</h4>
                <p className="text-sm text-text-secondary">Government Polytechnic</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Photo */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="hidden lg:flex justify-center mt-12 lg:mt-0"
          >
            <div className="relative">
              {/* Accent glow behind photo */}
              <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-border-light overflow-hidden bg-bg-secondary shadow-2xl shadow-black/20">
                <img
                  src="/shivam-singh.jpg"
                  alt="Shivam Singh — Full-Stack Developer"
                  className="w-[380px] h-[460px] object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
