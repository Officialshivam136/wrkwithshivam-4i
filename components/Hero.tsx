'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { siteConfig } from '@/data/site';

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: 'End-to-End', label: 'Development' },
  { value: 'Production', label: 'Ready Code' },
  { value: 'AI-First', label: 'Approach' },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle background grid, faded toward the edges */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Gradient glows */}
      <div className="absolute top-1/3 right-[10%] w-[520px] h-[520px] bg-accent/[0.12] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] w-[380px] h-[380px] bg-cyan-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

      {/* 3D scene — a dimmed backdrop on small screens, interactive on desktop */}
      <HeroCanvas className="absolute inset-0 opacity-30 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:left-auto lg:right-0 lg:w-[58%] lg:[mask-image:linear-gradient(90deg,transparent,black_22%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-28 pb-24 pointer-events-none">
        <div className="lg:w-[54%] flex flex-col pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 self-start mb-8 rounded-full border border-border-light bg-bg-secondary/70 backdrop-blur px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs tracking-wide text-text-secondary font-medium">
              Available for new projects
            </span>
          </motion.div>

          <div className="font-heading font-bold tracking-tight leading-[1.05] text-text-primary">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              I Build Digital Products
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="block text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] mt-1"
            >
              That Solve{' '}
              <span className="text-gradient">Real Problems.</span>
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="text-base md:text-lg text-text-secondary max-w-lg mt-8 leading-relaxed"
          >
            I&apos;m Shivam Singh — full-stack developer and AI Engineer at{' '}
            <span className="text-text-primary font-medium">{siteConfig.company.name}</span>.
            I design and engineer modern websites, SaaS products, AI automations and AI-powered
            systems for startups and businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Button variant="primary" size="lg" href="#work">
              View My Work
            </Button>
            <Button variant="secondary" size="lg" href="#contact" className="bg-bg-primary/60 backdrop-blur">
              Start a Project
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="grid grid-cols-3 max-w-lg mt-14 pt-8 border-t border-border"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'border-l border-border-light pl-3 sm:pl-6' : 'pr-2'}>
                <p className="text-[13px] min-[380px]:text-[15px] sm:text-2xl font-heading font-bold text-text-primary">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hint for the 3D scene */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="hidden lg:flex absolute bottom-10 right-[29%] translate-x-1/2 items-center gap-2 rounded-full border border-border-light bg-bg-secondary/70 backdrop-blur px-4 py-2 text-xs text-text-secondary pointer-events-none"
      >
        <svg className="w-3.5 h-3.5 text-accent-hover" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11V5a2 2 0 1 1 4 0v6m0-2a2 2 0 1 1 4 0v2m0-1a2 2 0 1 1 4 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.5L4.5 15a2 2 0 0 1 3.4-2L9 14" />
        </svg>
        Drag to rotate &middot; click the core
      </motion.div>

      {/* Scroll Indicator */}
      <motion.a
        href="#capabilities"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center p-3 text-text-tertiary hover:text-text-secondary transition-colors lg:left-9 lg:translate-x-0"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  );
}
