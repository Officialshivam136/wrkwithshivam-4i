'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Small illustrations shown at the top of each service card. Decorative only. */

const frame =
  'relative h-36 sm:h-40 overflow-hidden rounded-xl border border-border bg-bg-primary';

const Sparkle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn('h-3 w-3 fill-current', className)} aria-hidden="true">
    <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5zM18.5 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
  </svg>
);

const Pill = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border border-accent/30 bg-bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold text-accent shadow-sm backdrop-blur',
      className
    )}
  >
    {children}
  </span>
);

/** SaaS: a dashboard with a growing bar chart. */
function Dashboard() {
  const bars = [38, 62, 48, 78, 58, 92, 72];
  return (
    <div className={frame}>
      <div className="absolute inset-3 flex gap-3">
        <div className="flex w-9 flex-col gap-2 pt-1">
          <span className="h-2 rounded bg-accent" />
          <span className="h-2 rounded bg-border-light" />
          <span className="h-2 rounded bg-border-light" />
          <span className="h-2 rounded bg-border-light" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-md border border-border bg-bg-secondary p-1.5">
                <span className="block h-1.5 w-6 rounded bg-border-light" />
                <span className={cn('mt-1.5 block h-2.5 rounded', i === 0 ? 'w-9 bg-accent/70' : 'w-7 bg-text-tertiary/40')} />
              </div>
            ))}
          </div>
          <div className="flex min-h-0 flex-1 items-end gap-1.5 rounded-md border border-border bg-bg-secondary px-2 pb-1.5 pt-2">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: `${h}%`, originY: 1 }}
                className={cn('flex-1 rounded-t', i === 5 ? 'bg-accent' : 'bg-accent/35')}
              />
            ))}
          </div>
        </div>
      </div>
      <Pill className="absolute right-3 top-3">
        <Sparkle /> AI insights
      </Pill>
    </div>
  );
}

/** Web: a browser window with a phone, so "responsive" is obvious. */
function Browser() {
  return (
    <div className={frame}>
      <div className="absolute inset-x-3 top-3 bottom-0 overflow-hidden rounded-t-lg border border-b-0 border-border bg-bg-secondary">
        <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 h-3 flex-1 rounded-full bg-bg-elevated px-2 text-[8px] leading-3 text-text-tertiary">yourbrand.com</span>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr] gap-3 p-3">
          <div className="space-y-1.5">
            <span className="block h-2.5 w-4/5 rounded bg-text-primary/70" />
            <span className="block h-2.5 w-3/5 rounded bg-text-primary/70" />
            <span className="mt-2 block h-1.5 w-full rounded bg-border-light" />
            <span className="block h-1.5 w-5/6 rounded bg-border-light" />
            <span className="mt-2.5 block h-5 w-16 rounded-md bg-accent" />
          </div>
          <div className="h-16 rounded-lg bg-gradient-to-br from-accent/60 via-cyan-400/50 to-pink-400/50" />
        </div>
      </div>
      {/* Phone */}
      <div className="absolute -bottom-1 right-5 h-[88px] w-[46px] rounded-xl border-2 border-border-light bg-bg-secondary p-1 shadow-lg">
        <span className="block h-1.5 w-full rounded bg-accent/70" />
        <span className="mt-1 block h-5 w-full rounded bg-gradient-to-br from-accent/50 to-pink-400/50" />
        <span className="mt-1 block h-1 w-full rounded bg-border-light" />
        <span className="mt-1 block h-1 w-3/4 rounded bg-border-light" />
        <span className="mt-1.5 block h-3 w-full rounded bg-accent" />
      </div>
    </div>
  );
}

/** AI Integration: a chat that answers from your own documents. */
function Chat() {
  return (
    <div className={frame}>
      <div className="absolute inset-3 flex flex-col justify-center gap-2.5">
        <div className="ml-auto flex w-[50%] flex-col gap-1 rounded-xl rounded-tr-sm bg-accent px-3 py-2">
          <span className="block h-1.5 w-full rounded bg-white/80" />
          <span className="block h-1.5 w-2/3 rounded bg-white/60" />
        </div>
        <div className="flex w-[68%] items-start gap-2 rounded-xl rounded-tl-sm border border-border bg-bg-secondary px-3 py-2">
          <span className="mt-0.5 text-accent">
            <Sparkle />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <span className="block h-1.5 w-full rounded bg-text-tertiary/50" />
            <span className="block h-1.5 w-11/12 rounded bg-text-tertiary/50" />
            <span className="block h-1.5 w-1/2 rounded bg-text-tertiary/50" />
          </div>
        </div>
        <div className="flex items-center gap-1 pl-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-accent/70"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
      {/* Your documents feeding the answer */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
        <Pill>RAG</Pill>
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-7 w-5 rounded-[3px] border border-border-light bg-bg-secondary shadow-sm"
              style={{ transform: `rotate(${(i - 1) * 8}deg)` }}
            >
              <span className="mx-auto mt-1.5 block h-0.5 w-3 rounded bg-text-tertiary/50" />
              <span className="mx-auto mt-1 block h-0.5 w-3 rounded bg-text-tertiary/50" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** AI Automation: trigger → AI agent → action, with data flowing along the lines. */
function Workflow() {
  return (
    <div className={frame}>
      <svg viewBox="0 24 320 92" className="absolute inset-0 h-full w-full" role="presentation" aria-hidden="true">
        {/* Connectors */}
        <path d="M92 70 H122" className="flow-line stroke-accent" strokeWidth="1.5" fill="none" />
        <path d="M198 70 H228" className="flow-line stroke-accent" strokeWidth="1.5" fill="none" />
        <path d="M120 66 l5 4 -5 4 z M226 66 l5 4 -5 4 z" className="fill-accent" />

        {/* Trigger */}
        <rect x="14" y="44" width="78" height="52" rx="10" className="fill-bg-secondary stroke-border-light" strokeWidth="1" />
        <text x="53" y="64" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontWeight="600" letterSpacing="0.6">TRIGGER</text>
        <text x="53" y="80" textAnchor="middle" className="fill-text-primary" fontSize="10" fontWeight="600">New lead</text>
        <text x="53" y="90" textAnchor="middle" className="fill-text-tertiary" fontSize="7.5">form · WhatsApp</text>

        {/* AI agent */}
        <rect x="122" y="40" width="76" height="60" rx="12" className="fill-accent/15 stroke-accent" strokeWidth="1.5" />
        <path d="M160 49l1.6 4.6 4.6 1.6-4.6 1.6L160 61.4l-1.6-4.6-4.6-1.6 4.6-1.6z" className="fill-accent" />
        <text x="160" y="76" textAnchor="middle" className="fill-text-primary" fontSize="10" fontWeight="700">AI agent</text>
        <text x="160" y="87" textAnchor="middle" className="fill-text-secondary" fontSize="7.5">qualifies &amp; decides</text>

        {/* Action */}
        <rect x="228" y="44" width="78" height="52" rx="10" className="fill-bg-secondary stroke-border-light" strokeWidth="1" />
        <text x="267" y="64" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontWeight="600" letterSpacing="0.6">ACTION</text>
        <text x="267" y="80" textAnchor="middle" className="fill-text-primary" fontSize="10" fontWeight="600">Auto reply</text>
        <text x="267" y="90" textAnchor="middle" className="fill-text-tertiary" fontSize="7.5">CRM · email · chat</text>

        {/* Done tick */}
        <circle cx="296" cy="50" r="7" className="fill-emerald-500" />
        <path d="M292.5 50l2.5 2.5 4-5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Pill className="absolute bottom-2.5 left-3">
        <Sparkle /> Runs 24/7
      </Pill>
    </div>
  );
}

const graphics: Record<string, () => React.ReactElement> = {
  layers: Dashboard,
  globe: Browser,
  brain: Chat,
  zap: Workflow,
};

export function ServiceGraphic({ kind }: { kind: string }) {
  const Graphic = graphics[kind];
  return Graphic ? <Graphic /> : null;
}
