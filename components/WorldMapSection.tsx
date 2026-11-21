"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";

type Place = {
  city: string;
  note: string;
  lat: number;
  lng: number;
  /** Which side of the dot the label sits on, so close-together points don't overlap. */
  side: "left" | "right";
  home?: boolean;
};

const PLACES: Place[] = [
  { city: "Bijnor, India", note: "Home base", lat: 29.3724, lng: 78.1358, side: "right", home: true },
  { city: "Mumbai, India", note: "Sunteck Realty", lat: 19.076, lng: 72.8777, side: "left" },
  { city: "Zürich, Switzerland", note: "MODOM Grooming", lat: 47.3769, lng: 8.5417, side: "left" },
  { city: "Sydney, Australia", note: "Client", lat: -33.8688, lng: 151.2093, side: "left" },
];

const home = PLACES[0];

// Same projection the map uses, as percentages of the map box.
const pos = (lat: number, lng: number) => ({
  left: `${((lng + 180) / 360) * 100}%`,
  top: `${((90 - lat) / 180) * 100}%`,
});

export function WorldMapSection() {
  const theme = useTheme();
  return (
    <section id="reach" aria-label="Where I work" className="py-24 md:py-32 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center px-6">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Based in India,{" "}
          <span className="text-neutral-400">
            {"serving the world".split("").map((char, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          I live in India and build websites, SaaS products and AI automations
          for clients in India, Switzerland and Australia.
        </p>
      </div>

      <div className="relative">
        <WorldMap
          lineColor={theme === "dark" ? "#60a5fa" : "#2563eb"}
          dots={PLACES.filter((p) => !p.home).map((p) => ({
            start: { lat: home.lat, lng: home.lng },
            end: { lat: p.lat, lng: p.lng },
          }))}
        />

        {/* Place labels, laid over the map at the same coordinates as its dots */}
        <ul className="pointer-events-none absolute inset-0 m-0 list-none p-0">
          {PLACES.map((p) => (
            <li key={p.city} className="absolute" style={pos(p.lat, p.lng)}>
              <span
                className={`absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-semibold leading-tight shadow-sm backdrop-blur sm:px-3 sm:py-1 sm:text-xs ${
                  p.side === "right" ? "left-0 ml-3 sm:ml-4" : "right-0 mr-3 sm:mr-4"
                } ${
                  p.home
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-400/50 bg-white/90 text-neutral-800 dark:bg-black/80 dark:text-neutral-100"
                }`}
              >
                {p.city}
                <span className="hidden font-normal opacity-70 sm:inline"> · {p.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
