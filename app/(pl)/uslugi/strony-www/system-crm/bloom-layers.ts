// GENEROWANE: node scripts/crm-bloom.mjs - NIE edytować ręcznie. Lista warstw maski „rozejścia” (ta sama, z której
// liczy się CSS w bloom.css) dla płótna sceny głównej: hero-points-field.ts gasi punkty dopełnieniem tej maski.

/** Zmienne CSS z teksturami kłębów (na korzeniu .cr), w kolejności indeksów tekstur. */
export const BLOOM_TEXTURES = ['--cr-bloom-a', '--cr-bloom-b', '--cr-bloom-c'] as const;

/** [tekstura, środek x, środek y, dryf x, dryf y, szerokość, wysokość (ułamki elementu), start, czas, przebieg:
    0 = miękki start i koniec (p * p * (3 - 2p)), 1 = wolny start (p do sześcianu)]. */
export type BloomLayer = readonly [number, number, number, number, number, number, number, number, number, 0 | 1];

export const BLOOM_LAYERS: ReadonlyArray<BloomLayer> = [
  [0, 0.1, 0.27, 0.05, 0.02, 0.86, 0.9, 0, 0.46, 0],
  [1, 0.15, 0.8, 0.04, -0.03, 0.74, 0.86, 0.05, 0.46, 0],
  [1, 0.33, 0.16, 0.05, 0.04, 0.72, 0.8, 0.11, 0.46, 0],
  [0, 0.4, 0.72, 0.05, 0.02, 0.88, 0.9, 0.17, 0.46, 0],
  [0, 0.58, 0.3, 0.05, -0.03, 0.8, 0.88, 0.24, 0.46, 0],
  [1, 0.66, 0.84, 0.04, -0.02, 0.76, 0.84, 0.3, 0.46, 0],
  [1, 0.83, 0.2, 0.04, 0.04, 0.78, 0.86, 0.37, 0.46, 0],
  [0, 0.9, 0.72, 0.03, 0.02, 0.86, 0.9, 0.43, 0.46, 0],
  [2, 0.5, 0.5, 0, 0, 4.2, 4.2, 0.42, 0.58, 1],
];

/** Lżejsza maska na ekranach węższych niż BLOOM_SMALL px (w CSS: @media (max-width: 767.98px)). */
export const BLOOM_SMALL = 768;
export const BLOOM_LAYERS_SMALL: ReadonlyArray<BloomLayer> = [
  [0, 0.22, 0.17, 0.05, 0.03, 0.96, 0.6, 0, 0.5, 0],
  [1, 0.78, 0.37, -0.04, 0.03, 0.9, 0.56, 0.1, 0.5, 0],
  [0, 0.24, 0.6, 0.05, 0.02, 0.94, 0.58, 0.2, 0.5, 0],
  [1, 0.76, 0.82, -0.04, -0.02, 0.92, 0.56, 0.3, 0.5, 0],
  [2, 0.5, 0.5, 0, 0, 4.2, 4.2, 0.42, 0.58, 1],
];
