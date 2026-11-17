import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { testimonials, type Testimonial } from '@/data/testimonials';
import { fadeInUp } from '@/lib/animations';
import { TiltCard } from '@/components/ui/TiltCard';

export function Testimonials() {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-bg-primary">
      <Container className="max-w-7xl">
        <SectionHeading 
          eyebrow="Testimonials" 
          title="What Clients Say." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <AnimateIn 
              key={testimonial.id}
              variants={fadeInUp}
              delay={index * 0.1}
              className="h-full"
            >
              <TiltCard max={3} className="rounded-2xl">
              <div className="p-8 rounded-2xl border border-border bg-bg-secondary h-full flex flex-col">
                {/* Quote Icon */}
                <svg
                  className="w-8 h-8 text-accent opacity-30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <p className="text-text-secondary leading-relaxed flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="font-medium text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-text-tertiary mt-1">
                    {testimonial.role}{testimonial.company ? ` at ${testimonial.company}` : ''}
                  </p>
                </div>
              </div>
              </TiltCard>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
