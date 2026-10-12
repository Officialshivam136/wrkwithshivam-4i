import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getFeaturedProjects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';

export function Projects() {
  const projects = getFeaturedProjects();

  return (
    <section id="work" className="py-24 md:py-32 bg-bg-secondary">
      <Container className="max-w-7xl">
        <SectionHeading eyebrow="Portfolio" title="SELECTED WORK" />

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-text-tertiary text-center mt-12 text-sm">
            Projects coming soon.
          </p>
        )}

        {projects.length > 0 && (
          <p className="text-text-tertiary text-sm mt-12 text-center">
            More projects coming soon.
          </p>
        )}
      </Container>
    </section>
  );
}
