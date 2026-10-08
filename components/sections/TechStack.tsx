import {
  Gauge, Smartphone, CreditCard, MessageCircle, CalendarCheck, LayoutDashboard, ShieldCheck, MapPin,
  type LucideIcon,
} from 'lucide-react';
import type { TechStackDict } from '@/lib/i18n/home/tech-stack';

// Pasek pod hero (2026-09-24, nowa odsłona; wariant "Ikony w szkle" wybrany przez właściciela
// z 7 propozycji). Style .ts-* w app/globals.css: spokojny rząd konkretów zwykłym Inter,
// przy każdej pozycji okrągła plakietka z ikoną w granatowym szkle (język bąbla czatu),
// gwiazdki-separatory jak "klejnoty" nieba w hero.
// Pętla bez szwu: 4 identyczne kopie, animacja o -50% toru = dokładnie 2 kopie. Czytnik ekranu
// czyta tylko pierwszą kopię (reszta aria-hidden).

/** Ikony pozycji - KOLEJNOŚĆ jak `items` w słowniku (PageSpeed, telefon, płatności, asystent AI
    - ten sam dymek co bąbel czatu, rezerwacje, panel, hosting, lokalne SEO). */
const ITEM_ICONS: LucideIcon[] = [Gauge, Smartphone, CreditCard, MessageCircle, CalendarCheck, LayoutDashboard, ShieldCheck, MapPin];

/** Czteroramienna gwiazdka - separator (ten sam motyw co jasne gwiazdy nieba w hero). */
const Star = () => (
  <svg className="ts-star" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d="M5 0C5.35 3.3 6.7 4.65 10 5C6.7 5.35 5.35 6.7 5 10C4.65 6.7 3.3 5.35 0 5C3.3 4.65 4.65 3.3 5 0Z" fill="currentColor" />
  </svg>
);

const COPIES = [0, 1, 2, 3];

export const TechStack = ({ t }: { t: TechStackDict }) => (
  <section className="ts" aria-label={t.label}>
    <div className="ts-viewport">
      <div className="ts-track">
        {COPIES.map((copy) => (
          <ul key={copy} className={copy ? 'ts-group ts-dup' : 'ts-group'} aria-hidden={copy ? true : undefined}>
            {t.items.map((text, i) => {
              const Icon = ITEM_ICONS[i];
              return (
                <li key={text} className="ts-item">
                  {Icon && (
                    <span className="ts-ico" aria-hidden="true">
                      <Icon strokeWidth={1.7} />
                    </span>
                  )}
                  {text}
                  <Star />
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  </section>
);
