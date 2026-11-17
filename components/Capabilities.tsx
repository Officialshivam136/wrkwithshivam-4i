import { siteConfig } from '@/data/site';

export function Capabilities() {
  // Repeated so the strip is always wider than the screen; the second half is
  // an exact copy of the first, which makes the loop seamless.
  const half = [...siteConfig.capabilities, ...siteConfig.capabilities];

  return (
    <section
      id="capabilities"
      aria-label="Capabilities"
      className="w-full py-8 border-y border-border overflow-hidden scroll-mt-20 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <ul className="sr-only">
        {siteConfig.capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
      <div className="flex w-max animate-marquee" aria-hidden="true">
        {[...half, ...half].map((capability, index) => (
          <div key={index} className="flex items-center gap-4 px-6 md:px-8">
            <div className="w-2 h-2 rotate-45 bg-accent flex-shrink-0" />
            <span className="font-heading text-lg md:text-2xl font-semibold text-text-secondary whitespace-nowrap uppercase tracking-wide">
              {capability}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
