// Obrazy realizacji na podstronie /realizacje i w case study (praca równoległa, etap 2 - chat 5).
//
// 1. Kadry 16:9 - wspólne z sekcją Realizacje na stronie głównej (public/portfolio/stage, tylko odczyt;
//    generuje je scripts/realizacje-images.mjs z masterów assets/screenshots). Nazwy plików = slug projektu.
// 2. Całe strony klientów (public/realizacje/<slug>-page-<szer>-<nr>.{avif,webp}) - zrzuty żywych stron
//    1440 px CSS @2x z 2026-09-29 (Mcentrum: nowy zrzut ekran po ekranie z 2026-09-30 - z animacjami, karuzelami
//    i opiniami), bez pustych pasów (blok-zaślepka „Poznasz ich wkrótce” na stronie RKS, jasny pas przed stopką na
//    stronie Mcentrum), przeskalowane do 800 (karty, nagłówek) i 1600 px (plansze, case study) i pocięte na plastry
//    ≤ 2000 px, żeby przeglądarka nie dekodowała jednego ogromnego obrazu. `cssH` = wysokość sklejonej strony w px CSS
//    przy szerokości 1440. Mastery: assets/realizacje/*-page-2880.webp (wysoki master w częściach: -2880-2.webp),
//    skrypty: docs/podstrony/realizacje-skrypty/ (fullpage-tiles.mjs = zrzut ekran po ekranie, page-images.mjs =
//    cięcie i formaty; fullpage.mjs = dawny zrzut jednym ujęciem).

export const STAGE_WIDTHS = [720, 1200, 1800, 2400, 3200] as const;

export const stageSet = (slug: string, ext: 'avif' | 'webp') =>
  STAGE_WIDTHS.map((w) => `/portfolio/stage/${slug}-${w}.${ext} ${w}w`).join(', ');

export const stageSrc = (slug: string, w = 1200) => `/portfolio/stage/${slug}-${w}.webp`;

export interface PageMedia {
  /** Wysokość całej (sklejonej) strony w px CSS przy szerokości 1440. */
  cssH: number;
  /** Wysokości plastrów w px obrazu dla każdej szerokości. */
  slices: Record<800 | 1600, number[]>;
}

export const PAGE_MEDIA: Record<string, PageMedia> = {
  'grawerstwo-kardys': { cssH: 6364, slices: { 800: [2000, 1536], 1600: [2000, 2000, 2000, 1071] } },
  'klub-sportowy': { cssH: 4650, slices: { 800: [2000, 583], 1600: [2000, 2000, 1167] } },
  mcentrumfizjoterapia: { cssH: 8317, slices: { 800: [2000, 2000, 621], 1600: [2000, 2000, 2000, 2000, 1241] } },
};

export const pageSlice = (slug: string, w: 800 | 1600, i: number, ext: 'avif' | 'webp') =>
  `/realizacje/${slug}-page-${w}-${i}.${ext}`;
