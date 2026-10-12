'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const steps = [
  { number: '01', title: 'DISCOVER', description: 'Understand the business, users and requirements.' },
  { number: '02', title: 'DESIGN', description: 'Plan the experience, architecture and product flow.' },
  { number: '03', title: 'BUILD', description: 'Develop, integrate, test and iterate.' },
  { number: '04', title: 'LAUNCH', description: 'Deploy, monitor and improve.' },
];

export function Process() {
  return (
    <section id="process" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <SectionHeading eyebrow="Process" title="FROM IDEA TO PRODUCTION" />
        
        <div className="mt-16 md:mt-24 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border-light -z-0" />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={step.number} 
                variants={fadeInUp}
                className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0 relative"
              >
                {/* Mobile connecting line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-12 bottom-[-2rem] left-[1.4rem] w-px bg-border-light -z-10" />
                )}

                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-accent bg-bg-secondary flex items-center justify-center text-accent font-heading font-bold text-sm relative z-10">
                  {step.number}
                </div>
                
                <div className="md:text-center md:mt-6 flex flex-col md:items-center pt-2 md:pt-0">
                  <h3 className="font-heading font-bold text-lg text-text-primary tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed md:max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
