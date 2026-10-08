'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { TestimonialsDict } from '@/lib/i18n/home/testimonials';

// Elementy sekcji "Opinie" (Redakcja, wybór właściciela 2026-09-27).

export const GOOGLE_PROFILE = 'https://www.google.com/search?hl=pl&authuser=4&sxsrf=ANbL-n4_Dj5ouwzlPtWTQBfgkDkMID5EiQ:1768411940244&q=Avenly&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQ4PrWAsOBw8i-AdENLDMltPyDfnixmqcoeh5B8zB5N_Xy6umInAzO7tr22xmuyk4yXqH7M%3D&uds=ALYpb_mEM8gY9NEgOivIwhaEBbWUwxFOjCVFdTOsh8L5T8WVn81-xdUIVD8rxXLGYn-Q6zPJdnxoUppquz3vpQBLul3HisvdFxGwoZauBn-pxflujIOdCZA&aic=0';

export const nn = (i: number) => String(i + 1).padStart(2, '0');

/** Nagłówek sekcji: etykieta "Gwiazda", h2 (.im-title / .im-accent) i podtytuł (.im-lead). */
export const OpHead = ({ t, align = 'center', className = '' }: { t: TestimonialsDict; align?: 'center' | 'start'; className?: string }) => (
  <header className={`op-head op-head--${align} ${className}`}>
    <p className="im-label"><SectionLabel align={align}>{t.badge}</SectionLabel></p>
    <h2 id="op-title" className="im-title">
      {t.headingLead} <span className="im-accent">{t.headingAccent}</span>
    </h2>
    <p className="im-lead">{t.lead}</p>
  </header>
);

/** Link do profilu Google (zewnętrzny): tekstowy, bez konkurowania z "Bezpłatną konsultacją". Ostatnie
    słowo i strzałka są niełamliwe - przy zawinięciu strzałka nie zostaje sama na końcu wiersza. */
export const ProfileLink = ({ t, className = '' }: { t: TestimonialsDict; className?: string }) => {
  const words = t.ctaProfile.split(' ');
  const last = words.pop();
  return (
    <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" className={`op-link ${className}`}>
      <FcGoogle aria-hidden="true" className="op-link-g" />
      {words.length > 0 && <span className="op-link-text">{words.join(' ')} </span>}
      <span className="op-link-end">
        <span className="op-link-text">{last}</span>
        <ArrowUpRight aria-hidden="true" className="op-link-arrow" />
      </span>
      <span className="sr-only"> {t.newTab}</span>
    </a>
  );
};

const WORD = /^(\P{L}*)(\p{L}+)(\P{L}*)$/u;

/** Tekst podzielony na słowa (każde może wejść osobno). Czytnik ekranu czyta całość jednym ciągiem.
    Cudzysłowy są częścią pierwszego / ostatniego słowa (bez złamania wiersza przed nimi); otwierający
    ma klasę .op-open (wysunięcie na margines). `mark` = słowo wyróżnione (.op-hl, bez interpunkcji). */
export const Words = ({ text, open = '', close = '', mark = '', className = '' }: { text: string; open?: string; close?: string; mark?: string; className?: string }) => {
  const words = text.split(' ');
  const last = words.length - 1;
  const key = mark.toLocaleLowerCase();
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {words.map((w, i) => {
          const m = key ? WORD.exec(w) : null;
          const body = m && m[2].toLocaleLowerCase() === key
            ? <>{m[1]}<span className="op-hl">{m[2]}</span>{m[3]}</>
            : w;
          return (
            <Fragment key={i}>
              <span className="op-w" style={{ '--i': i } as CSSProperties}>
                {i === 0 && open ? <span className="op-open">{open}</span> : null}
                {body}
                {i === last ? close : null}
              </span>
              {i < last ? ' ' : null}
            </Fragment>
          );
        })}
      </span>
    </>
  );
};

/**
 * Wejście sekcji: po hydratacji dopisuje `data-live` (ukryte stany startowe z CSS), a gdy element
 * wjedzie w ekran - `data-in` (przejścia do stanu końcowego). Bez JS nic nie jest ukryte. Jeśli
 * element jest już na ekranie przy starcie (przeładowanie w połowie strony), oba atrybuty wchodzą
 * naraz - bez migania i bez animacji od zera. `data-vis` = element jest w ekranie (pauza pętli
 * CSS poza nim), `onVisible` = to samo dla JS.
 */
export const useReveal = <T extends HTMLElement>(opts: { onVisible?: (v: boolean, el: T) => void } = {}) => {
  const ref = useRef<T>(null);
  const optsRef = useRef(opts);
  useEffect(() => { optsRef.current = opts; });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const already = r.top < window.innerHeight * 0.85 && r.bottom > 0;
    el.dataset.live = '';
    if (already) el.dataset.in = '';
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !('in' in el.dataset)) el.dataset.in = '';
    }, { rootMargin: '0px 0px -18% 0px' });
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.dataset.vis = ''; else delete el.dataset.vis;
      optsRef.current.onVisible?.(e.isIntersecting, el);
    }, { rootMargin: '80px 0px' });
    io.observe(el);
    vis.observe(el);
    return () => { io.disconnect(); vis.disconnect(); };
  }, []);
  return ref;
};
