import { MetadataRoute } from 'next';
import { blogPosts } from '@/app/data/posts';
import { projects } from '@/app/data/projects';

// Zmień na swój adres URL (bez slesza na końcu)
const BASE_URL = 'https://avenly.pl'; 

export default function sitemap(): MetadataRoute.Sitemap {
  
  // 1. Strony statyczne
  const staticRoutes = [
    '',
    '/o-nas',
    '/realizacje',
    '/blog',
    '/kontakt',
    '/polityka-prywatnosci',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamiczne posty blogowe
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Blog jest ważny!
  }));

  // 3. Dynamiczne projekty (TYLKO te z Case Study)
  const projectRoutes = projects
    .filter((project) => project.hasCaseStudy) // Filtrujemy!
    .map((project) => ({
      url: `${BASE_URL}/realizacje/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}