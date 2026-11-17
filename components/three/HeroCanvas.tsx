'use client';

import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '@/lib/theme';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

/** Shown while the 3D scene loads, when WebGL is unavailable, or for reduced motion. */
function StaticOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,#a5b4fc,#6366f1_45%,#1e1b4b_80%)] opacity-70 blur-[2px] shadow-[0_0_120px_30px_rgba(99,102,241,0.35)]" />
    </div>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticOrb /> : this.props.children;
  }
}

export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const theme = useTheme();
  const [inView, setInView] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    // Stop rendering frames once the hero is scrolled away.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {!mounted || reduceMotion ? (
        <StaticOrb />
      ) : (
        <SceneBoundary>
          <HeroScene active={inView} theme={theme} />
        </SceneBoundary>
      )}
    </div>
  );
}
