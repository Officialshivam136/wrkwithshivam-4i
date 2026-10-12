'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Main Content — takes 7 columns */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs tracking-[0.25em] uppercase text-accent font-semibold">
                Full-Stack Development &bull; SaaS &bull; AI
              </span>
            </motion.div>

            <div className="font-heading font-bold tracking-tight leading-[1.05] text-text-primary">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              >
                I Build Digital Products
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="block text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] mt-1"
              >
                That Solve{' '}
                <span className="text-accent">Real Problems.</span>
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-base md:text-lg text-text-secondary max-w-lg mt-8 leading-relaxed"
            >
              Modern websites, SaaS products and AI-powered systems — designed and
              engineered for startups, businesses and ambitious founders.
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
              <Button variant="secondary" size="lg" href="#contact">
                Start a Project
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex items-center gap-6 mt-14 pt-8 border-t border-border"
            >
              <div>
                <p className="text-2xl font-heading font-bold text-text-primary">End-to-End</p>
                <p className="text-xs text-text-tertiary mt-0.5 uppercase tracking-wider">Development</p>
              </div>
              <div className="w-px h-10 bg-border-light" />
              <div>
                <p className="text-2xl font-heading font-bold text-text-primary">Production</p>
                <p className="text-xs text-text-tertiary mt-0.5 uppercase tracking-wider">Ready Code</p>
              </div>
              <div className="w-px h-10 bg-border-light hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-2xl font-heading font-bold text-text-primary">AI-First</p>
                <p className="text-xs text-text-tertiary mt-0.5 uppercase tracking-wider">Approach</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Terminal Visual — 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden lg:flex lg:col-span-5 items-center justify-end"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-md rounded-xl border border-border-light bg-bg-secondary/80 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden"
            >
              {/* Terminal Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated/40">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-text-tertiary text-[11px] font-mono tracking-wide">
                  index.ts
                </div>
                <div className="w-12" />
              </div>

              {/* Code Content */}
              <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
                <div className="flex flex-col">
                  <div>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-text-primary">builder</span>{' '}
                    <span className="text-text-secondary">=</span>{' '}
                    <span className="text-text-secondary">{`{`}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">name</span>
                    <span className="text-text-secondary">: </span>
                    <span className="text-emerald-400">&quot;Shivam Singh&quot;</span>
                    <span className="text-text-secondary">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">role</span>
                    <span className="text-text-secondary">: </span>
                    <span className="text-emerald-400">&quot;Full-Stack Developer&quot;</span>
                    <span className="text-text-secondary">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">stack</span>
                    <span className="text-text-secondary">: </span>
                    <span className="text-text-secondary">[</span>
                    <span className="text-emerald-400">&quot;SaaS&quot;</span>
                    <span className="text-text-secondary">, </span>
                    <span className="text-emerald-400">&quot;AI&quot;</span>
                    <span className="text-text-secondary">, </span>
                    <span className="text-emerald-400">&quot;Web&quot;</span>
                    <span className="text-text-secondary">],</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">status</span>
                    <span className="text-text-secondary">: </span>
                    <span className="text-orange-400">true</span>
                    <span className="text-text-secondary">,</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">{`};`}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-text-tertiary">{`// Ready to build your next product`}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">export default</span>{' '}
                    <span className="text-text-primary">builder</span>
                    <span className="text-text-secondary">;</span>
                    <span className="inline-block w-2 h-4 ml-1 bg-accent animate-pulse align-middle" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-text-tertiary/40"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
