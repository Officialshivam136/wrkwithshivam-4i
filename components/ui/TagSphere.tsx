'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SphereTag {
  label: string;
  group: string;
}

interface TagSphereProps {
  tags: SphereTag[];
  /** Tags in this group are highlighted; null highlights everything. */
  activeGroup: string | null;
  className?: string;
}

type Vec = [number, number, number];

/** Evenly spread points on a unit sphere. */
function fibonacciSphere(count: number): Vec[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return [Math.cos(theta) * r, y, Math.sin(theta) * r];
  });
}

/** A globe of words that spins on its own and can be dragged around. */
export function TagSphere({ tags, activeGroup, className }: TagSphereProps) {
  const container = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const basePoints = useMemo(() => fibonacciSphere(tags.length), [tags.length]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const points = basePoints.map((p) => [...p] as Vec);
    const idle = reduceMotion ? 0 : 0.0035;
    let vx = idle; // spin around the vertical axis
    let vy = idle * 0.4; // spin around the horizontal axis
    let radius = el.clientWidth * 0.38;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let frame = 0;

    const draw = () => {
      const cosY = Math.cos(vx);
      const sinY = Math.sin(vx);
      const cosX = Math.cos(vy);
      const sinX = Math.sin(vy);

      points.forEach((p, i) => {
        const x1 = p[0] * cosY + p[2] * sinY;
        const z1 = -p[0] * sinY + p[2] * cosY;
        const y1 = p[1] * cosX - z1 * sinX;
        const z2 = p[1] * sinX + z1 * cosX;
        p[0] = x1;
        p[1] = y1;
        p[2] = z2;

        const node = items.current[i];
        if (!node) return;
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        node.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y1 * radius).toFixed(1)}px, 0) scale(${(0.6 + depth * 0.55).toFixed(3)})`;
        node.style.opacity = (0.2 + depth * 0.8).toFixed(2);
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const tick = () => {
      if (!dragging) {
        // Ease back to the idle spin after a drag.
        vx += (Math.sign(vx || 1) * idle - vx) * 0.03;
        vy += (Math.sign(vy || 1) * idle * 0.4 - vy) * 0.03;
      }
      draw();
      if (visible) frame = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      vx = (e.clientX - lastX) * 0.006;
      vy = (lastY - e.clientY) * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    const resize = new ResizeObserver(() => {
      radius = el.clientWidth * 0.38;
    });
    resize.observe(el);

    // Only animate while the sphere is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) frame = requestAnimationFrame(tick);
    });
    observer.observe(el);

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [basePoints, reduceMotion]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className={cn(
        'relative aspect-square w-full select-none cursor-grab active:cursor-grabbing touch-pan-y',
        className
      )}
    >
      {/* Glow + faint globe outline */}
      <div className="absolute inset-[12%] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute inset-[10%] rounded-full border border-border-light/60" />
      <div className="absolute inset-[10%] rounded-full border border-border-light/40 [transform:rotateX(70deg)]" />

      {tags.map((tag, i) => {
        const lit = !activeGroup || tag.group === activeGroup;
        return (
          <span
            key={tag.label}
            ref={(node) => {
              items.current[i] = node;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <span
              className={cn(
                'block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300',
                lit
                  ? 'border-accent/50 bg-bg-elevated text-text-primary shadow-[0_0_18px_rgba(99,102,241,0.25)]'
                  : 'border-border bg-bg-primary text-text-tertiary'
              )}
            >
              {tag.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
