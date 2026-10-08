'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';

// Wspólne klocki strony O nas (wszystkie propozycje): nagłówek strony, liczby, "Co robimy", FAQ,
// wejście stref (useInView) i "kamera" przy przewijaniu (useDepth - paralaksa warstw).
// Style: ./o-nas.css (prefiks .on-). Zasady: PRACA-ROWNOLEGLA.md "Wspólny język podstron".

export const nn = (i: number) => String(i + 1).padStart(2, '0');

const noop = () => () => {};
/** false na serwerze i w pierwszym renderze, true po hydratacji (bez setState w efekcie). */
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * Wejście strefy: po hydratacji `data-live` (stany startowe z CSS), gdy strefa wjedzie w ekran -
 * `data-in` (przejścia do stanu końcowego). Bez JS nic nie jest ukryte. Strefa widoczna już przy
 * starcie (przeładowanie w połowie strony) dostaje oba atrybuty naraz - bez migania.
 */
export const useInView = <T extends HTMLElement>(margin = '0px 0px -14% 0px') => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.dataset.live = '';
    if (r.top < window.innerHeight * 0.86 && r.bottom > 0) {
      el.dataset.in = '';
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.dataset.in = ''; io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
};

// "Kamera": jeden nasłuch przewijania dla wszystkich stref z useDepth. Każda dostaje `--v` = 0, gdy
// jej górna krawędź dotyka dołu okna, 1, gdy dolna krawędź mija górę okna (0,5 = środek strefy na
// środku okna). CSS przesuwa z niego warstwy z różną prędkością (głębia) albo rysuje kreski.
const depthEls = new Set<HTMLElement>();
let depthRaf = 0;
const depthTick = () => {
  depthRaf = 0;
  const vh = window.innerHeight;
  depthEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -80 || r.top > vh + 80) return;
    const v = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const s = v.toFixed(4);
    if (el.style.getPropertyValue('--v') !== s) el.style.setProperty('--v', s);
  });
};
const depthKick = () => { if (!depthRaf) depthRaf = requestAnimationFrame(depthTick); };

/** Podpina strefę pod "kamerę" (`data-dv` + `--v`). Ograniczony ruch: nic (CSS pokazuje stan końcowy). */
export const useDepth = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.dataset.dv = '';
    if (depthEls.size === 0) {
      window.addEventListener('scroll', depthKick, { passive: true });
      window.addEventListener('resize', depthKick);
    }
    depthEls.add(el);
    depthKick();
    return () => {
      depthEls.delete(el);
      delete el.dataset.dv;
      el.style.removeProperty('--v');
      if (depthEls.size === 0) {
        window.removeEventListener('scroll', depthKick);
        window.removeEventListener('resize', depthKick);
      }
    };
  }, [ref]);
};

/** Nagłówek strony: etykieta "Gwiazda", h1 (.im-title, akcent w kolorze marki), podtytuł, jedno CTA.
    Linijki h1 wysuwają się spod maski (.on-h1-l > .on-h1-i). `accent` podmienia drugą linię
    (propozycja Korekta). Renderuje go wejście (intro.tsx): w trybie filmowym jako plansza tytułowa
    sterowana przewijaniem, poza nim - zwykła strefa pod napisem AVENLY (useInView). */
export const OnHead = ({ t, locale, accent, className = '' }: { t: ONasDict; locale: Locale; accent?: ReactNode; className?: string }) => {
  const ref = useInView<HTMLElement>('0px 0px -20% 0px');
  return (
    <header ref={ref} className={`on-head ${className}`}>
      <div className="container mx-auto px-6">
        <p className="im-label on-a on-a1"><SectionLabel align="start">{t.label}</SectionLabel></p>
        <h1 className="im-title on-h1">
          <span className="on-h1-l on-l1"><span className="on-h1-i">{t.title}</span></span>{' '}
          {accent ?? <span className="on-h1-l on-l2"><span className="on-h1-i im-accent">{t.titleAccent}</span></span>}
        </h1>
        <p className="im-lead on-lead on-a on-a4">{t.lead}</p>
        <div className="on-a on-a5">
          <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="on-btn">
            {t.cta}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
};

/** Nagłówek sekcji (h2 + opis) przy lewej krawędzi kontenera; h2 wysuwa się spod maski. */
export const OnSecHead = ({ id, heading, accent, lead, className = '' }: {
  id: string; heading: string; accent?: string; lead?: string; className?: string;
}) => {
  const ref = useInView<HTMLElement>('0px 0px -12% 0px');
  return (
    <header ref={ref} className={`on-sec-head ${className}`}>
      <h2 id={id} className="on-h2">
        <span className="on-h2-i">
          {heading}{accent ? <> <span className="im-accent">{accent}</span></> : null}
        </span>
      </h2>
      {lead ? <p className="on-sub">{lead}</p> : null}
    </header>
  );
};

/** Liczby obronne (98/100, 24 h, około dwa tygodnie) - duże cyfry w głębi (wolniej niż strona). */
export const OnFacts = ({ t }: { t: ONasDict }) => {
  const ref = useInView<HTMLElement>();
  useDepth(ref);
  return (
    <section ref={ref} className="on-sec on-facts" aria-labelledby="on-facts-h">
      <div className="container mx-auto px-6">
        <div className="on-body">
          <h2 id="on-facts-h" className="on-h2 on-h2--sm">{t.facts.heading}</h2>
          <ul className="on-facts-list">
            {t.facts.items.map((f, i) => (
              <li key={f.value} className="on-fact" style={{ '--i': i } as CSSProperties}>
                <strong className="on-fact-v">{f.value}</strong>
                <span className="on-fact-l">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/** "Co robimy": cztery obszary pracy w siatce 2 × 2 (telefon: lista). */
export const OnCraft = ({ t }: { t: ONasDict }) => {
  const ref = useInView<HTMLElement>();
  useDepth(ref);
  return (
    <section ref={ref} className="on-sec on-craft" aria-labelledby="on-craft-h">
      <div className="container mx-auto px-6">
        <div className="on-body on-split">
          <OnSecHead id="on-craft-h" heading={t.craft.heading} lead={t.craft.lead} className="on-split-head" />
          <ol className="on-craft-list">
            {t.craft.items.map((it, i) => (
              <li key={it.title} className="on-craft-item" style={{ '--i': i } as CSSProperties}>
                <span className="on-num" aria-hidden="true">{nn(i)}</span>
                <h3 className="on-h3">{it.title}</h3>
                <p className="on-p">{it.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

/** FAQ: akordeon na liniach (bez JS wszystkie odpowiedzi otwarte) + pytanie do asystenta AI
    (otwiera czat zdarzeniem `avenly:open-chat` - mechanizm czatu bez zmian). */
export const OnFaq = ({ t }: { t: ONasDict }) => {
  const ref = useInView<HTMLElement>();
  const [open, setOpen] = useState<number | null>(null);
  const hydrated = useHydrated();
  return (
    <section ref={ref} className="on-sec on-faq" aria-labelledby="on-faq-h">
      <div className="container mx-auto px-6">
        <div className="on-body on-split">
          <div className="on-split-head">
            <OnSecHead id="on-faq-h" heading={t.faqSection.heading} lead={t.faqSection.lead} />
            <div className="on-ask">
              <p className="on-ask-t">{t.faqSection.askTitle}</p>
              <p className="on-ask-d">{t.faqSection.askDesc}</p>
              <button type="button" className="on-ghost" onClick={() => window.dispatchEvent(new Event('avenly:open-chat'))}>
                <MessageCircle aria-hidden="true" />
                {t.faqSection.askButton}
              </button>
            </div>
          </div>
          <div className="on-faq-list">
            {t.faq.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.question} className="on-faq-item" data-open={isOpen ? '' : undefined}>
                  <h3 className="on-faq-q">
                    <button
                      type="button"
                      id={`on-faq-b${i}`}
                      className="on-faq-btn"
                      aria-expanded={isOpen}
                      aria-controls={`on-faq-a${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span>{f.question}</span>
                      <span className="on-faq-ico" aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`on-faq-a${i}`} role="region" aria-labelledby={`on-faq-b${i}`} className="on-faq-a" inert={(hydrated && !isOpen) || undefined}>
                    <div><p>{f.answer}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
