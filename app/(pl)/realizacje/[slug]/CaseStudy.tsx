import { JsonLd } from '@/components/seo/JsonLd';
import { caseStudySchema, breadcrumbSchema } from '@/lib/schemas';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import { workByLocale, type RealizacjeDict, type ProjectsData } from '@/lib/i18n/projects';
import { CaseView } from '../_rl/case';

type Props = {
  project: ProjectsData[number];
  t: RealizacjeDict;
  locale: Locale;
};

/**
 * Współdzielony widok case study (PL + EN). Server component: dane strukturalne (CreativeWork + Breadcrumb,
 * `@id` spójne z ItemList na stronie głównej) + kliencki widok `CaseView` (praca równoległa, etap 2 - chat 5).
 * Treść z `project` (już per-locale) i `workByLocale` (nazwa, rodzaj, akcent, domena, zakres); wewnętrzne
 * linki prefiksowane przez localizeHref. „Następna realizacja” = kolejne case study w kolejności listy.
 */
export default function CaseStudy({ project, t, locale }: Props) {
  const work = workByLocale[locale];
  const item = work.find((w) => w.slug === project.slug)!;
  const withCase = work.filter((w) => w.slug !== 'wirtualny-asystent-ai');
  const next = withCase[(withCase.indexOf(item) + 1) % withCase.length];
  const realizacjeHref = localizeHref('/realizacje', locale);

  return (
    <div className="min-h-dvh bg-[#050505] text-white">
      {/* JSON-LD: CreativeWork (case study) + Breadcrumb - niewidoczne, czytane przez Google */}
      <JsonLd
        id="ld-casestudy"
        data={caseStudySchema(project, { path: localizeHref(`/realizacje/${project.slug}`, locale), name: item.name, language: locale === 'en' ? 'en' : undefined })}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: t.breadcrumbHome, url: locale === 'en' ? '/en/' : '/' },
          { name: t.breadcrumbList, url: realizacjeHref },
          { name: item.name, url: localizeHref(`/realizacje/${project.slug}`, locale) },
        ])}
      />
      <CaseView
        project={project} item={item} num={work.indexOf(item) + 1}
        next={next} nextNum={work.indexOf(next) + 1} t={t} locale={locale}
      />
    </div>
  );
}
