import { LOGO_LETTERS, LOGO_STAR, LOGO_VIEWBOX, SYGNET_LETTER, SYGNET_STAR, SYGNET_VIEWBOX } from '@/lib/brand/logo';

// Logo Avenly (od 2026-10-09: wersja „cięcie” - AVENLY przecięte linią z gwiazdą). Litery w kolorze tekstu
// (`currentColor` na <svg>), linia z gwiazdą w kolorze `accentClassName` (domyślnie niebieski marki; nawigacja i czat
// podają kolor podstrony). Grafika jest dekoracją - nazwę dla czytników daje rodzic (np. sr-only w linku).

type Props = {
  className?: string;
  /** Klasa koloru linii z gwiazdą (fill = currentColor ścieżki). */
  accentClassName?: string;
};

export function AvenlyLogo({ className, accentClassName = 'text-[#3b82f6]' }: Props) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={LOGO_LETTERS} />
      <path fill="currentColor" className={accentClassName} d={LOGO_STAR} />
    </svg>
  );
}

/** Sygnet: sama litera A z linią i gwiazdą. */
export function AvenlySygnet({ className, accentClassName = 'text-[#3b82f6]' }: Props) {
  return (
    <svg viewBox={SYGNET_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={SYGNET_LETTER} />
      <path fill="currentColor" className={accentClassName} d={SYGNET_STAR} />
    </svg>
  );
}
