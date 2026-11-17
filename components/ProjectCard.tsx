'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fadeInUp } from '@/lib/animations';
import { type Project } from '@/data/projects';
import { TiltCard } from '@/components/ui/TiltCard';
import { withBase } from '@/lib/runtime';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isComingSoon = project.status === 'coming-soon';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
      className="h-full"
    >
      <TiltCard max={4} className="rounded-2xl">
      <div className="group h-full rounded-2xl border border-border bg-bg-primary overflow-hidden flex flex-col hover:border-accent/40 transition-colors duration-300">
      {/* Image Area */}
      <div className="w-full aspect-[16/10] relative overflow-hidden bg-bg-elevated">
        {project.image ? (
          <>
            <Image
              src={withBase(project.image)}
              alt={project.title}
              fill
              unoptimized
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isComingSoon && (
              <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-4 py-1.5 rounded-full bg-bg-elevated/80 border border-border-light text-text-secondary text-sm font-medium">
                  In Progress
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-elevated to-bg-secondary flex items-center justify-center">
            <span className="text-text-tertiary font-medium">
              {isComingSoon ? 'Coming Soon' : 'Image Coming Soon'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="text-xs uppercase tracking-[0.15em] text-accent font-medium">
          {project.category}
        </div>
        <h3 className="font-heading text-xl md:text-2xl font-bold text-text-primary mt-2">
          {project.title}
        </h3>
        <p className="text-text-secondary mt-2 text-sm flex-grow">
          {project.shortDescription}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full border border-border text-text-tertiary"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {!isComingSoon && (
          <div className="flex gap-3 mt-6">
            {project.slug && (
              <Link
                href={`/work/${project.slug}`}
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors flex items-center gap-1 py-3 -my-3"
              >
                View Project <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors flex items-center gap-1 py-3 -my-3"
              >
                Live Demo <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
      </div>
      </TiltCard>
    </motion.div>
  );
}
