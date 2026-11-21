import { Hero } from '@/components/Hero';
import { Capabilities } from '@/components/Capabilities';
import { Services } from '@/components/Services';
import { WorldMapSection } from '@/components/WorldMapSection';
import { Projects } from '@/components/Projects';
import { Process } from '@/components/Process';
import { About } from '@/components/About';
import { ExperienceSection } from '@/components/Experience';
import { TechStack } from '@/components/TechStack';
import { Testimonials } from '@/components/Testimonials';
import { CTA } from '@/components/CTA';
import { Contact } from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Services />
      <WorldMapSection />
      <Projects />
      <Process />
      <About />
      <ExperienceSection />
      <TechStack />
      <Testimonials />
      <CTA />
      <Contact />
    </>
  );
}
