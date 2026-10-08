import type { Locale } from '@/lib/i18n/locale';
import { heroDict, type HeroDict } from './hero';
import { techStackDict, type TechStackDict } from './tech-stack';
import { realizacjeDict, type RealizacjeDict } from './realizacje';
import { impactDict, type ImpactDict } from './impact';
import { processDict, type ProcessDict } from './process';
import { testimonialsDict, type TestimonialsDict } from './testimonials';
import { servicesSectionDict, type ServicesSectionDict } from '@/lib/i18n/services';

/**
 * Zbiorczy słownik homepage - importowany WYŁĄCZNIE w server page
 * (app/(pl)/page.tsx i app/(en)/en/page.tsx), podawany do HomeClient przez
 * props. Do RSC payload trafia tylko wybrany język.
 */

export interface HomeDict {
  hero: HeroDict;
  /** 2. sekcja pod hero (handoff 8b "Kurtyna") - zastąpiła dawne Portfolio (teaser). */
  realizacje: RealizacjeDict;
  techStack: TechStackDict;
  impact: ImpactDict;
  process: ProcessDict;
  testimonials: TestimonialsDict;
  services: ServicesSectionDict;
  // (cta: sekcja "Gotowy na cyfrową dominację?" usunięta 2026-09-27 - decyzja właściciela)
}

const build = (locale: Locale): HomeDict => ({
  hero: heroDict[locale],
  realizacje: realizacjeDict[locale],
  techStack: techStackDict[locale],
  impact: impactDict[locale],
  process: processDict[locale],
  testimonials: testimonialsDict[locale],
  services: servicesSectionDict[locale],
});

export const homeDict: Record<Locale, HomeDict> = {
  pl: build('pl'),
  en: build('en'),
};
