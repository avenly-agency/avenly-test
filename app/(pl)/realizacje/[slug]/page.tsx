import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projectsByLocale, realizacjeDict, workByLocale } from '@/lib/i18n/projects';
import { i18nAlternates } from '@/lib/i18n/locale';
import CaseStudy from './CaseStudy';

const LOCALE = 'pl' as const;
const t = realizacjeDict[LOCALE];
const projects = projectsByLocale[LOCALE];

export function generateStaticParams() {
  return projects
    .filter((p) => p.hasCaseStudy)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Projekt nie znaleziony' };

  const ogImage = project.mockupImage || project.mainImage;
  // Nazwa wyświetlana jak na liście realizacji (np. „Klub Sportowy RKS”); pole `title` zostaje w słowach kluczowych i danych strukturalnych.
  const work = workByLocale[LOCALE].find((w) => w.slug === project.slug);
  const name = work?.name ?? project.title;
  // SEO: w tytule obok nazwy stoi rodzaj realizacji (np. „strona i aplikacja klubowa”) - fraza, której ktoś szuka
  const kind = work ? work.kind.charAt(0).toLowerCase() + work.kind.slice(1) : "";

  return {
    // absolute: szablon „%s | Avenly” z root layoutu nie dochodzi do tej trasy (layout listy ma własny tytuł) - markę dopisujemy tutaj
    title: { absolute: `${name} - ${kind ? `${kind} · ` : ""}${t.metaTitleSuffix} | Avenly` },
    // opis do ok. 160 znaków (dłuższy Google ucina): opis realizacji + dla kogo; technologie są w słowach kluczowych
    description: `${project.description} ${t.metaProjectFor} ${project.client}.`,
    alternates: i18nAlternates(`/realizacje/${project.slug}`, LOCALE),
    keywords: [
      project.title,
      project.client,
      project.category,
      'case study',
      'portfolio Avenly',
      ...(project.techStack || []),
    ],
    openGraph: {
      type: 'article',
      locale: 'pl_PL',
      siteName: 'Avenly',
      title: `${name} - ${t.metaTitleSuffix} Avenly`,
      description: project.description,
      url: `/realizacje/${project.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${t.metaOgAltPrefix} ${project.title} ${t.metaOgAltFor} ${project.client}`,
        },
      ],
      publishedTime: `${project.year}-01-01`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - Avenly`,
      description: project.description,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project || !project.hasCaseStudy) {
    notFound();
  }

  return <CaseStudy project={project} t={t} locale={LOCALE} />;
}
