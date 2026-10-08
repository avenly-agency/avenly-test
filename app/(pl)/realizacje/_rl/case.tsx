'use client';

import { useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ProjectsData, RealizacjeDict, WorkItem } from '@/lib/i18n/projects';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import { nn, SIZES } from './cards';
import { Frame } from './frame';
import { Rv, useEnter, useIntro, useLiveRoot } from './shared';
import { Sky } from './sky';
import './realizacje.css';
import './case.css';

// Case study (/realizacje/[slug] i /en/work/[slug]) - „KLASYCZNA” (wybór właściciela 2026-10-08: „wybieram klasyczną”,
// z dziesięciu propozycji całej podstrony; pozostałe dziewięć: docs/archiwum/realizacje-case-study/propozycje-2026-10-08/).
// Układ dawnej wersji w dzisiejszym języku:
//   1. nagłówek - numer, rodzaj i rok, nazwa, obok opis z linkiem do strony klienta (bez liczb „w skrócie”: właściciel
//      uznał je za wypełniacz - „nie dodawaj niepotrzebnych rzeczy typu grupy w akademii”),
//   2. „Strona na żywo” - kadr przyklejony do ekranu na szerokość wrappera, w nim przewija się CAŁA strona klienta
//      (wysokość sekcji liczy useLivePage; style .rl-cs-live w realizacje.css + .rl-cf-kl-fr w case.css),
//   3. punkt wyjścia i rozwiązanie - dwie równe kolumny na jednej linii, tekst w spokojnych akapitach,
//   4. zakres i technologia w tych samych kolumnach, galeria w kadrach,
//   5. pytanie z „Bezpłatną konsultacją” i zapowiedź następnej realizacji (jej nazwa i góra jej kadru - mgławica
//      przechodzi w jej barwy).
// Mgławica w barwach realizacji (Sky), wejście jak na liście: czerń → mgławica → tekst po kolei (useIntro).
// Ograniczony ruch i brak JS: wszystko widać od razu, kadr pokazuje górę strony klienta.

type Project = ProjectsData[number];

/** Długa jednowyrazowa nazwa: miejsce łamania na wąskim ekranie (jak na planszach listy). */
const BREAK: Record<string, number> = { mcentrumfizjoterapia: 8 };
const nameOf = (w: WorkItem) => {
  const at = BREAK[w.slug];
  const words = w.name.split(' ');
  const cut = at && words.length === 1 && w.name.length > at ? [w.name.slice(0, at), w.name.slice(at)] : null;
  return {
    node: cut ? <>{cut[0]}<wbr />{cut[1]}</> : w.name,
    /** cała nazwa w jednej linijce (zapowiedź następnej realizacji od 1024 px) */
    len: w.name.length,
    /** najdłuższy kawałek, gdy nazwa się łamie */
    lenS: Math.max(...(cut ?? words).map((s) => s.length)),
  };
};

/** Zdania tekstu: granica = kropka, spacja i wielka litera („1. miejsce” zostaje w zdaniu). Bez lookbehind - Safari 15. */
const sentences = (s: string) => {
  const parts = s.split(/([.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ])/);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) out.push(parts[i] + (parts[i + 1] ?? ''));
  return out.filter(Boolean);
};
/** Akapity po ok. dwa zdania (do ~330 znaków) - długi opis nie stoi jedną ścianą tekstu. Treść bez zmian. */
const paras = (s: string) => {
  const out: string[] = [];
  for (const x of sentences(s)) {
    const last = out[out.length - 1];
    if (last !== undefined && last.length + x.length <= 330) out[out.length - 1] = `${last} ${x}`;
    else out.push(x);
  }
  return out;
};
/** Twarda spacja po jednoliterowym słowie („i”, „w”, „z”, „a”…) - pojedyncza litera nie zostaje na końcu linii (telefon). */
const nb = (s: string) => {
  const one = /(^|[\s(„])([aiouwzAIOUWZ])\s/g;
  return s.replace(one, '$1$2 ').replace(one, '$1$2 '); // drugi przebieg: dwa takie słowa pod rząd („i w”)
};

export const CaseView = ({
  project, item, num, next, nextNum, t, locale,
}: {
  project: Project; item: WorkItem; num: number; next: WorkItem; nextNum: number; t: RealizacjeDict; locale: Locale;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLElement>(null);
  useLiveRoot(rootRef);
  const onSky = useIntro(rootRef);
  const tech = project.techStack ?? [];
  const shots = (project.gallery ?? []).slice(0, 2);
  const alt = `${t.cardAltPrefix} ${item.name}`;

  return (
    <div ref={rootRef} className="rl rl-cf" data-v="klasyczna" style={{ '--ac': item.accent } as CSSProperties}>
      {/* bez JS wszystko widać od razu (kolejność wejścia czeka na data-go) */}
      <noscript><style>{'.rl .rl-line,.rl .rl-in{animation:none!important;transform:none!important;opacity:1!important}'}</style></noscript>
      {/* mgławica w barwach tej realizacji: blask idzie za kadrem, na końcu przechodzi w barwy następnej realizacji */}
      <Sky tint={item.slug} onReady={onSky} />

      <section className="rl-cf-kl-hero" aria-labelledby="rl-cf-h1">
        <div className="rl-cf-kl-top container mx-auto px-6">
          <div className="rl-cf-kl-copy" style={{ '--len-s': nameOf(item).lenS } as CSSProperties}>
            <p className="rl-cf-meta">
              <span className="rl-in" style={{ '--d': 1 } as CSSProperties}>
                <span className="rl-card-num">{nn(num)}</span>
                <span>{item.kind}</span>
                <span className="rl-proof-dot" aria-hidden="true">·</span>
                <span>{project.year}</span>
              </span>
            </p>
            <h1 id="rl-cf-h1" className="rl-cf-ob-name">
              <span className="rl-mask"><span className="rl-line" style={{ '--d': 2 } as CSSProperties}>{nameOf(item).node}</span></span>
            </h1>
          </div>
          <div className="rl-cf-kl-side">
            <p className="im-lead rl-cf-lead rl-in" style={{ '--d': 4 } as CSSProperties}>{nb(project.description)}</p>
            {item.domain && (
              <div className="rl-cf-actions rl-in" style={{ '--d': 5 } as CSSProperties}>
                <a href={`https://${item.domain}`} target="_blank" rel="noopener noreferrer" className="rl-ghost rl-cf-site">
                  {t.viewOnline}
                  {/* czytnik ekranu: dokąd prowadzi link i że otwiera nową kartę (widoczny napis zostaje początkiem nazwy) */}
                  <span className="sr-only"> ({item.domain}, {t.newTabHint})</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <span className="rl-cf-domain" aria-hidden="true">{item.domain}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Strona na żywo: kadr przyklejony do ekranu, strona klienta przewija się w nim (wysokość sekcji liczy useLivePage) */}
      <section ref={liveRef} className="rl-cs-live rl-cf-kl-live" aria-labelledby="rl-cf-live-h">
        <div className="rl-cs-stick" data-rl-stick="">
          <div className="container mx-auto px-6">
            <div className="rl-cs-live-head">
              <h2 id="rl-cf-live-h" className="rl-cf-rail-l">{t.liveLabel}</h2>
              <p className="rl-cs-hint">{t.liveHint}</p>
            </div>
            <div className="rl-cf-kl-fr">
              <Frame
                slug={item.slug} alt={alt} accent={item.accent} domain={item.domain}
                size="case" sizes={SIZES.case} hostRef={liveRef} eager sky={item.slug}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rl-cf-story" aria-label={t.storyAria}>
        <div className="container mx-auto px-6">
          <div className="rl-cf-kl-pair">
            <Part no="01" label={t.challengeLabel} text={project.challenge} />
            <Part no="02" label={t.solutionLabel} text={project.solution} i={1} />
          </div>
          {/* zakres pod punktem wyjścia, technologia pod rozwiązaniem (nagłówki h2 - kolejność nagłówków bez przeskoków) */}
          <Rv className="rl-cf-kl-facts">
            <div className="rl-cf-lists">
              <div>
                <h2 className="rl-cf-lh">{t.scopeLabel}</h2>
                <ul className="rl-cf-list">{item.scope.map((s) => <li key={s}>{nb(s)}</li>)}</ul>
              </div>
              {tech.length > 0 && (
                <div>
                  <h2 className="rl-cf-lh">{t.techLabel}</h2>
                  <ul className="rl-cf-list">{tech.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              )}
            </div>
          </Rv>
          {shots.length > 0 && (
            <div className="rl-cf-kl-gal">
              <h2 className="rl-cf-kl-sub">{t.galleryLabel}</h2>
              <div className="rl-cf-ch-shots" data-n={shots.length}>
                {shots.map((src, k) => {
                  const shotAlt = `${t.galleryAltPrefix} ${item.name} (${k + 1})`;
                  return (
                    <Frame key={src} slug="" alt={shotAlt} accent={item.accent} domain={item.domain} size="lg" sizes="" live={false}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- statyczny eksport, obraz bez optymalizacji */}
                      <img className="rl-stage" src={src} alt={shotAlt} loading="lazy" decoding="async" draggable={false} />
                    </Frame>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6">
        <Rv className="rl-cf-ask">
          <p className="rl-cf-ask-t">{nb(t.midCtaTitle)}</p>
          <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="rl-cta">
            {t.cta}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Rv>
      </div>
      <NextPlate next={next} num={nextNum} t={t} locale={locale} />
      <div className="rl-sky-end" aria-hidden="true" />
    </div>
  );
};

/** Punkt wyjścia / rozwiązanie: numer, tytuł i spokojny tekst w akapitach. */
const Part = ({ no, label, text, i = 0 }: { no: string; label: string; text: string; i?: number }) => (
  <Rv className="rl-cf-kl-part" style={{ '--i': i } as CSSProperties}>
    <p className="rl-cf-kl-no" aria-hidden="true">{no}</p>
    <h2 className="rl-cf-kl-h">{label}</h2>
    {paras(text).map((p, k) => <p key={k} className="rl-cf-kl-p">{nb(p)}</p>)}
  </Rv>
);

/** Następna realizacja: jej nazwa jak plansza i góra jej kadru gasnąca w czerń końca strony. */
const NextPlate = ({ next, num, t, locale }: { next: WorkItem; num: number; t: RealizacjeDict; locale: Locale }) => {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, 0.15);
  const name = nameOf(next);
  const href = localizeHref(`/realizacje/${next.slug}`, locale);
  return (
    <nav ref={ref} className="rl-cf-next" aria-label={t.nextProject} style={{ '--ac': next.accent } as CSSProperties}>
      <div className="rl-cf-next-in container mx-auto px-6">
        <div className="rl-cf-next-box" style={{ '--len': name.len, '--len-s': name.lenS } as CSSProperties}>
          <p className="rl-cf-next-label">{t.nextProject}</p>
          <Link href={href} prefetch={false} className="rl-cf-next-link">
            <span className="rl-cf-next-meta"><span className="rl-card-num">{nn(num)}</span><span>{next.kind}</span></span>
            <span className="rl-cf-next-name"><span className="rl-mask"><span className="rl-cf-next-line">{name.node}</span></span></span>
            <ArrowRight className="rl-arrow rl-cf-next-arrow" aria-hidden="true" />
          </Link>
          <div className="rl-cf-next-fr" aria-hidden="true">
            <Frame
              slug={next.slug} alt="" accent={next.accent} domain={next.domain} size="case" sizes={SIZES.case} live={false} sky={next.slug}
              hit={<Link href={href} prefetch={false} className="rl-frame-hit" tabIndex={-1} aria-hidden="true" />}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
