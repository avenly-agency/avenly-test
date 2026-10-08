import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ServicesSectionDict } from '@/lib/i18n/services';

// Wspólne elementy sekcji "Oferta" (2026-09-27, praca równoległa - chat 3; wybrany układ: Plan).
// Model danych buduje Services.tsx (tam zostaje mapowanie linków CATEGORY_HREF / cardHref),
// warianty dostają gotowe pozycje z już zlokalizowanymi adresami.

export type ArtId = 'onepage' | 'company' | 'custom' | 'store' | 'crm' | 'uiux' | 'chat' | 'audit';

export interface OfferItem {
  /** Stabilny klucz = `href` karty z app/data/services.ts. */
  id: string;
  i: number;
  cat: string;
  catLabel: string;
  name: string;
  short: string;
  line: string;
  points: string[];
  /** Podpisy trzech kroków scenki na rysunku. */
  story: string[];
  /** Adres po mapowaniu (cardHref) i lokalizacji. */
  href: string;
  /** Strona usługi jeszcze nie istnieje (audyt) - "Wkrótce", link do katalogu usług. */
  soon: boolean;
  /** Akcent usługi "r g b" - jasny odcień koloru jej podstrony (lib/service-theme.ts, Navbar). */
  acc: string;
  art: ArtId;
}

export interface OfferCategory {
  id: string;
  label: string;
  href: string;
  items: OfferItem[];
}

export interface OfferModel {
  items: OfferItem[];
  cats: OfferCategory[];
  allHref: string;
  ctaHref: string;
}

export interface VariantProps {
  t: ServicesSectionDict;
  m: OfferModel;
  locale: Locale;
  reduced: boolean;
}

/** Wygląd usługi (klucz = href karty): akcent jak motyw jej podstrony + rysunek. */
export const LOOK: Record<string, { acc: string; art: ArtId }> = {
  '/uslugi/strony-www/one-page': { acc: '147 197 253', art: 'onepage' },
  '/uslugi/strony-www/strona-firmowa': { acc: '110 231 183', art: 'company' },
  '/uslugi/strony-www/strona-szyta-na-miare': { acc: '253 164 175', art: 'custom' },
  '/uslugi/strony-www/sklep-internetowy': { acc: '252 211 77', art: 'store' },
  '/uslugi/strony-www/system-crm': { acc: '125 211 252', art: 'crm' },
  '/uslugi/design/ui-ux': { acc: '190 242 100', art: 'uiux' },
  '/uslugi/automatyzacje-ai/chatboty-ai': { acc: '253 186 116', art: 'chat' },
  '/uslugi/marketing/audyt-wydajnosci-seo': { acc: '94 234 212', art: 'audit' },
};

export const nn = (i: number) => String(i + 1).padStart(2, '0');

/** Link do podstrony usługi albo - dla usługi "wkrótce" - znacznik i link do katalogu usług. */
export const ItemLink = ({ item, t, allHref, className = '' }: { item: OfferItem; t: ServicesSectionDict; allHref: string; className?: string }) =>
  item.soon ? (
    <span className={`of-go-row ${className}`}>
      <span className="of-soon">{t.soon}</span>
      <Link href={allHref} prefetch={false} className="of-go">
        {t.all}
        <ArrowRight aria-hidden="true" />
      </Link>
    </span>
  ) : (
    <Link href={item.href} prefetch={false} className={`of-go ${className}`} aria-label={`${t.details}: ${item.name}`}>
      {t.details}
      <ArrowRight aria-hidden="true" />
    </Link>
  );

/** Zakończenie sekcji: podpowiedź z jedynym CTA serwisu + link do pełnego katalogu usług. */
export const OfferFoot = ({ t, m }: { t: ServicesSectionDict; m: OfferModel }) => (
  <div className="of-foot">
    <p className="of-foot-q">
      <span>{t.undecided}</span>
      <Link href={m.ctaHref} prefetch={false} className="of-foot-cta">
        {t.cta}
        <ArrowRight aria-hidden="true" />
      </Link>
    </p>
    <Link href={m.allHref} prefetch={false} className="of-btn">
      {t.all}
      <ArrowUpRight aria-hidden="true" />
    </Link>
  </div>
);
