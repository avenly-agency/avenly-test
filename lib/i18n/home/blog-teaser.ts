import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji "Blog" na stronie głównej (components/sections/BlogTeaser.tsx).
 * Sekcja jest dziś TYLKO w wersji PL (blog nie ma wersji EN, HomeClient nie pokazuje jej na /en/),
 * więc komponent bierze `blogTeaserDict.pl`. Wersja EN jest gotowa na dzień, w którym blog
 * dostanie tłumaczenia. Zasady copy: PRODUCT.md (głos korzyści, pisownia zdaniowa, bez myślników
 * em/en, bez wymyślonych liczb). Tytuły, zajawki, zdjęcia i daty wpisów pochodzą z app/data/posts.ts.
 *
 * Wzorce z {klucz} wypełnia `fill()` z components/sections/blog-teaser/data.ts.
 */

export interface BlogTeaserDict {
  label: string;
  title: string;
  titleAccent: string;
  lead: string;
  /** Link do /blog. */
  all: string;
  /** "Czytaj wpis" w stopce karty. */
  read: string;
  /** "{n} min czytania" */
  minutes: string;
  listAria: string;
}

export const blogTeaserDict: Record<Locale, BlogTeaserDict> = {
  pl: {
    label: 'Blog',
    title: 'Konkretna wiedza.',
    titleAccent: 'Bez żargonu.',
    lead: 'Krótkie artykuły o tym, jak strona, jej szybkość i AI wpływają na Twój biznes. Każdy przeczytasz w kilka minut.',
    all: 'Wszystkie wpisy',
    read: 'Czytaj wpis',
    minutes: '{n} min czytania',
    listAria: 'Najnowsze wpisy na blogu',
  },
  en: {
    label: 'Blog',
    title: 'Practical know-how.',
    titleAccent: 'No jargon.',
    lead: 'Short articles on how your website, its speed and AI affect your business. Each one takes a few minutes to read.',
    all: 'All articles',
    read: 'Read the article',
    minutes: '{n} min read',
    listAria: 'Latest blog articles',
  },
};
