'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import { TiltCard } from '@/components/ui/TiltCard';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/data/projects';

type ScenarioId = 'groceries' | 'flights' | 'trains' | 'movies';

interface Scenario {
  id: ScenarioId;
  label: string;
  icon: React.ReactNode;
  voice: string;
  seconds: string;
  reply: string;
  action: string;
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'w-4 h-4',
};

// Illustrative conversations only — the product is still being built.
const scenarios: Scenario[] = [
  {
    id: 'groceries',
    label: 'Groceries',
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.6 11.6a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L21 7H6" />
      </svg>
    ),
    voice: 'Order milk, eggs and bread for tomorrow morning',
    seconds: '0:04',
    reply: 'Added to your cart: milk 1 L, eggs ×12, bread. Delivery tomorrow, 8–9 AM.',
    action: 'Confirm order',
  },
  {
    id: 'flights',
    label: 'Flights',
    icon: (
      <svg {...iconProps}>
        <path d="M10.2 13.8 3 11l1.5-1.5 9 1.2 4.8-4.8a1.8 1.8 0 0 1 2.5 2.5l-4.8 4.8 1.2 9-1.5 1.5-2.8-7.2-3.6 3.6-1.4-.4-.4-1.4Z" />
      </svg>
    ),
    voice: 'Book a flight from Delhi to Mumbai on Friday evening',
    seconds: '0:05',
    reply: 'Found 3 options. Best pick: 6:40 PM, non-stop. Shall I book it?',
    action: 'Book this flight',
  },
  {
    id: 'trains',
    label: 'Trains',
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="3" width="14" height="14" rx="3" />
        <path d="M5 11h14M9 21l2-4M15 21l-2-4" />
        <circle cx="9" cy="14" r=".6" fill="currentColor" />
        <circle cx="15" cy="14" r=".6" fill="currentColor" />
      </svg>
    ),
    voice: 'Is there a train to Lucknow on Sunday night?',
    seconds: '0:03',
    reply: 'Yes — a 9:15 PM departure with seats in 3AC. Want me to reserve one?',
    action: 'Reserve seat',
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 5v14M17 5v14M3 9.5h4M17 9.5h4M3 14.5h4M17 14.5h4" />
      </svg>
    ),
    voice: 'Two tickets for tonight’s 9 PM show',
    seconds: '0:03',
    reply: 'The 9:00 PM show has two seats together in row F. Ready to pay?',
    action: 'Pay & confirm',
  },
];

const WAVE = [6, 12, 8, 16, 10, 18, 7, 14, 20, 9, 15, 6, 12, 17, 8, 13, 10, 5];

function VoiceBubble({ seconds }: { seconds: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-white">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
      <span className="flex h-5 items-center gap-[2px]" aria-hidden="true">
        {WAVE.map((h, i) => (
          <span key={i} className="w-[2px] rounded-full bg-white/70" style={{ height: h }} />
        ))}
      </span>
      <span className="text-[10px] text-white/60">{seconds}</span>
    </div>
  );
}

function Phone({ scenario, reduceMotion }: { scenario: Scenario; reduceMotion: boolean }) {
  // 0 = empty, 1 = voice note, 2 = typing, 3 = reply, 4 = action button
  const [stage, setStage] = useState(reduceMotion ? 4 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setStage(4);
      return;
    }
    setStage(0);
    const timers = [
      setTimeout(() => setStage(1), 250),
      setTimeout(() => setStage(2), 1100),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [scenario.id, reduceMotion]);

  const pop = { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.25 } };

  return (
    <div className="relative mx-auto w-[270px] sm:w-[290px] rounded-[2.4rem] border border-white/15 bg-[#0b141a] p-2.5 shadow-[0_30px_80px_-20px_rgba(37,211,102,0.35)]">
      <div className="absolute left-1/2 top-3 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="overflow-hidden rounded-[1.9rem] bg-[#0b141a]">
        {/* Chat header */}
        <div className="flex items-center gap-2.5 bg-[#202c33] px-4 pb-3 pt-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-black">
            V
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-white">VoiceAI Assistant</p>
            <p className="text-[10px] text-emerald-400">online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="relative h-[300px] space-y-2.5 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.03),transparent_40%)] px-3 py-4">
          <AnimatePresence mode="popLayout">
            {stage >= 1 && (
              <motion.div key={`${scenario.id}-voice`} {...pop} className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2.5">
                <VoiceBubble seconds={scenario.seconds} />
                <p className="mt-2 border-t border-white/10 pt-1.5 text-[11px] italic leading-snug text-white/75">
                  &ldquo;{scenario.voice}&rdquo;
                </p>
              </motion.div>
            )}
            {stage === 2 && (
              <motion.div key={`${scenario.id}-typing`} {...pop} exit={{ opacity: 0 }} className="flex w-14 items-center justify-center gap-1 rounded-xl rounded-tl-sm bg-[#202c33] py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-white/60"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
            {stage >= 3 && (
              <motion.div key={`${scenario.id}-reply`} {...pop} className="max-w-[88%] rounded-xl rounded-tl-sm bg-[#202c33] px-3 py-2.5">
                <p className="text-[12px] leading-snug text-white/90">{scenario.reply}</p>
              </motion.div>
            )}
            {stage >= 4 && (
              <motion.div key={`${scenario.id}-action`} {...pop}>
                <span className="inline-block rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-300">
                  {scenario.action}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2.5">
          <span className="flex-1 rounded-full bg-[#2a3942] px-3 py-1.5 text-[11px] text-white/40">Hold to speak…</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-black" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroProject({ project }: { project: Project }) {
  const reduceMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);

  // Rotate through the four examples until the visitor picks one themselves.
  useEffect(() => {
    if (!inView || manual || reduceMotion) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scenarios.length), 6500);
    return () => clearTimeout(timer);
  }, [index, inView, manual, reduceMotion]);

  const scenario = scenarios[index];

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="mb-8 md:mb-10"
    >
      <TiltCard max={2.5} className="rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-bg-primary">
          {/* Glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(128,128,140,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,140,0.09)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

          <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:p-14">
            {/* Text */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
                  Flagship project
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-secondary/80 px-3 py-1 text-xs font-medium text-text-secondary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                  </span>
                  In development &middot; Coming soon
                </span>
              </div>

              <h3 className="mt-6 font-heading text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                VoiceAI <span className="text-gradient">WhatsApp</span> Assistant
              </h3>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                One assistant, right inside WhatsApp. Just say what you need &mdash; it books your
                groceries, flights, trains and movies, all in one chat.
              </p>

              {/* What it handles — pick one to preview it */}
              <div className="mt-7" role="group" aria-label="Preview what the assistant can book">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
                  Try a preview
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {scenarios.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={i === index}
                      onClick={() => {
                        setManual(true);
                        setIndex(i);
                      }}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                        i === index
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-400/10 dark:text-emerald-300'
                          : 'border-border-light bg-bg-secondary/70 text-text-secondary hover:border-emerald-400/40 hover:text-text-primary'
                      )}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" href="#contact" className="!bg-emerald-500 !text-black hover:!bg-emerald-400 !shadow-emerald-500/25">
                  Get early access
                </Button>
                <p className="text-sm text-text-tertiary">Be the first to know when it launches.</p>
              </div>

              {project.technologies.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-text-tertiary">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Phone preview */}
            <div className="relative">
              <Phone scenario={scenario} reduceMotion={reduceMotion} />
              <p className="mt-4 text-center text-[11px] text-text-tertiary">
                Illustrative preview &mdash; the assistant is still being built.
              </p>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
