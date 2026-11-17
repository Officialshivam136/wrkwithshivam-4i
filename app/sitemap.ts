import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { projects } from '@/data/projects';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedProjects = projects
    .filter((p) => p.status === 'published')
    .map((p) => ({
      url: `${siteConfig.url}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...publishedProjects,
  ];
}
