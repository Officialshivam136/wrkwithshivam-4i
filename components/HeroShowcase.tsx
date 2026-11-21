'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { projects } from '@/data/projects';
import { withBase } from '@/lib/runtime';

// The projects with real screenshots, best-looking first.
const ORDER = ['bmb-bijnor', 'sunteck-realty', 'modom-grooming', 'codeplaced'];

const host = (url?: string) => (url ? url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '');

/** Your real projects as a 3D deck of browser windows: the front one slides back, the next comes forward. */
export function HeroShowcase({ className }: { className?: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-60px' });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () => ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p && p.image)),
    []
  );
  const n = items.length;

  // Move to the next project every few seconds, unless the visitor is looking closely.
  useEffect(() => {
    if (!inView || paused || reduceMotion || n < 2) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % n), 3800);
    return () => clearTimeout(timer);
  }, [active, inView, paused, reduceMotion, n]);

  // The whole deck leans toward the mouse.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 16, mass: 0.7 };
  const rotateY = useSpring(px, spring);
  const rotateX = useSpring(py, spring);
  const chipX = useSpring(useMotionValue(0), spring);
  const chipY = useSpring(useMotionValue(0), spring);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    px.set(-16 + nx * 14);
    py.set(7 - ny * 10);
    chipX.set(nx * 40);
    chipY.set(ny * 30);
  };
  const onLeave = () => {
    px.set(-16);
    py.set(7);
    chipX.set(0);
    chipY.set(0);
    setPaused(false);
  };
  useEffect(() => {
    px.set(-16);
    py.set(7);
  }, [px, py]);

  if (n === 0) return null;
  const current = items[active];

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onPointerMove={onMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={onLeave}
    >

      <div className="relative mx-auto aspect-[10/8.2] w-full max-w-[540px] [perspective:1500px]">
        <motion.div
          className="absolute inset-0"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          role="group"
          aria-label="My recent work"
        >
          {items.map((project, i) => {
            const p = (i - active + n) % n; // 0 = front
            const front = p === 0;
            return (
              <motion.button
                key={project.slug}
                type="button"
                aria-label={front ? `${project.title}: view my work` : `Show ${project.title}`}
                onClick={() => {
                  if (front) document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                  else setActive(i);
                }}
                initial={false}
                animate={{
                  x: p * 38,
                  y: p * -30,
                  z: p * -90,
                  opacity: p > 3 ? 0 : 1 - p * 0.14,
                  scale: 1,
                }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
                style={{ zIndex: n - p, transformStyle: 'preserve-3d', filter: `brightness(${1 - p * 0.14})` }}
                className="absolute left-0 top-[14%] block w-[78%] cursor-pointer overflow-hidden rounded-xl border border-border-light bg-bg-secondary text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {/* Browser bar */}
                <span className="flex items-center gap-1.5 border-b border-border bg-bg-elevated px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-bg-primary px-3 py-0.5 text-[10px] text-text-tertiary">
                    {host(project.liveUrl) || project.title}
                  </span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase(project.image)}
                  alt={`${project.title} website`}
                  draggable={false}
                  className="block aspect-[16/10] w-full select-none object-cover object-top"
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Floating chips at different depths, they drift with the mouse */}
        <motion.div style={{ x: chipX, y: chipY }} className="pointer-events-none absolute inset-0 hidden sm:block">
          <span className="absolute -left-2 top-[6%] rounded-full border border-emerald-400/60 bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            Web
          </span>
          <span className="absolute right-[2%] top-[2%] rounded-full border border-accent/40 bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg shadow-lg">
            AI Automation
          </span>
          <span className="absolute -right-2 bottom-[12%] rounded-full border border-amber-300/70 bg-amber-400 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-lg">
            SaaS
          </span>
        </motion.div>
      </div>

      {/* What is in front right now */}
      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="h-10 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-semibold text-text-primary"
            >
              {current.title}
              <span className="block text-xs font-normal text-text-tertiary">{current.category}</span>
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a project">
          {items.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={project.title}
              onClick={() => setActive(i)}
              className="flex h-6 items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className={cn('block h-1.5 rounded-full transition-all', i === active ? 'w-6 bg-accent' : 'w-1.5 bg-border-light hover:bg-text-tertiary')} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
