import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug, projects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import Link from 'next/link';
import Image from 'next/image';
import { withBase } from '@/lib/runtime';

interface ProjectPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return projects
    .filter((p) => p.status === 'published')
    .map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.shortDescription,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project || project.status === 'coming-soon') {
    notFound();
  }

  return (
    <article className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <Link
            href="/#work"
            className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-12"
          >
            ← Back to Work
          </Link>

          <div className="max-w-4xl">
            {project.category && (
              <span className="text-xs uppercase tracking-[0.15em] text-accent mb-4 block font-semibold">
                {project.category}
              </span>
            )}

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              {project.title}
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-2xl leading-relaxed">
              {project.shortDescription}
            </p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-bg-elevated border border-border text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {(project.liveUrl || project.githubUrl) && (
              <div className="flex flex-wrap gap-4 mt-10">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover transition-colors"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg border border-border-light text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="px-6 md:px-8 -mt-12 md:-mt-16 relative z-10 mb-20">
        <div className="max-w-5xl mx-auto">
          {project.image ? (
            <Image
              src={withBase(project.image)}
              alt={project.title}
              width={1200}
              height={750}
              className="w-full rounded-2xl border border-border aspect-video object-cover bg-bg-secondary shadow-2xl"
              priority
            />
          ) : (
            <div className="w-full rounded-2xl border border-border aspect-video bg-bg-secondary flex items-center justify-center shadow-2xl">
              <span className="text-text-tertiary font-medium">
                Image Coming Soon
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {project.description && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Overview
              </h2>
              <div className="text-text-secondary leading-relaxed space-y-4">
                {project.description.split('\n').map((paragraph, i) =>
                  paragraph.trim() ? <p key={i}>{paragraph}</p> : null
                )}
              </div>
            </div>
          )}

          {project.problem && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                The Problem
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {project.goal && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                The Goal
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.goal}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                The Solution
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Key Features
              </h2>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.architecture && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Architecture
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.architecture}
              </p>
            </div>
          )}

          {project.challenges && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Challenges
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {project.implementation && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Implementation Details
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.implementation}
              </p>
            </div>
          )}

          {project.results && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Results & Impact
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.results}
              </p>
            </div>
          )}

          {project.screenshots && project.screenshots.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Screenshots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.screenshots.map((screenshot, i) => (
                  <Image
                    key={i}
                    src={screenshot}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={800}
                    height={500}
                    className="w-full rounded-xl border border-border object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 pt-10 border-t border-border flex justify-center">
            <Link
              href="/#work"
              className="px-6 py-3 rounded-lg border border-border-light text-text-primary hover:bg-bg-elevated transition-colors font-medium"
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
