import { getServiceTheme, type ServiceColor } from '@/lib/service-theme';

// Kolor podstrony usługi wchodzi PARAMETREM (lib/service-theme.ts - tylko odczyt): akcent „r g b” dla CSS (--sv-ac)
// i barwy mgławicy [jasna, głęboka]. Barwy mgławicy = te same, którymi katalog /uslugi świeci wokół karty danej usługi
// (app/(pl)/uslugi/_katalog/sky.tsx), więc przejście z katalogu na podstronę zachowuje kolor.

type RGB = [number, number, number];
export type SkyTint = [RGB, RGB];

const TINTS: Record<ServiceColor, SkyTint> = {
  blue: [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]],
  emerald: [[0.06, 0.72, 0.5], [0.02, 0.2, 0.16]],
  rose: [[0.95, 0.25, 0.38], [0.34, 0.03, 0.12]],
  amber: [[0.96, 0.62, 0.06], [0.42, 0.14, 0.02]],
  sky: [[0.06, 0.64, 0.92], [0.03, 0.14, 0.36]],
  teal: [[0.08, 0.72, 0.65], [0.02, 0.2, 0.2]],
  orange: [[0.98, 0.45, 0.1], [0.4, 0.1, 0.02]],
};

export interface ServiceLook {
  /** Akcent podstrony „r g b” (zmienna --sv-ac). */
  accent: string;
  tint: SkyTint;
}

export const serviceLook = (pathname: string | null): ServiceLook => {
  const th = getServiceTheme(pathname);
  return { accent: th.rgb.replace(/,\s*/g, ' '), tint: TINTS[th.color] };
};
