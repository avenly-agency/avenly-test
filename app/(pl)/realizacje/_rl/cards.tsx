'use client';

import { useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ProjectsData, RealizacjeDict, WorkItem } from '@/lib/i18n/projects';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import { Frame, type FrameSize } from './frame';
import { openChat, useEnter } from './shared';

// Części kart listy /realizacje, składane w planszach, siatce po planszach i rzędach przy ograniczonym ruchu (_rl/versions.tsx):
// kadr realizacji, tekst karty (numer i rodzaj, nazwa, kreska w kolorze realizacji, skrót, zakres, technologie,
// link do realizacji i domena), pusty kadr „Twoja firma może być następna”. Najechanie na kartę (runda 16, jak w /uslugi):
// mgławica przenosi blask i barwę na tę realizację (sky.tsx), strzałka linku się przesuwa; kadr jest klikalny (FrameHit).

export type Project = ProjectsData[number];

export const nn = (n: number) => String(n).padStart(2, '0');

const AI_SERVICE = '/uslugi/automatyzacje-ai/chatboty-ai';
/** Asystent działa na avenly.pl - ten adres stoi w pasku kadru (bez linku zewnętrznego). */
const AI_HOST = 'avenly.pl';

export const SIZES: Record<FrameSize, string> = {
  sm: '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px',
  lg: '(max-width: 1023px) 100vw, 800px',
  case: '(max-width: 1279px) 100vw, 1232px',
};

/** Klikalny kadr (runda 16, właściciel: „daj normalnie klikalność na zdjęcia”): cały kadr prowadzi do realizacji,
    kadr asystenta otwiera czat. Powtarza link z nazwy - poza kolejnością fokusu i czytnikiem ekranu. */
const FrameHit = ({ item, project, locale }: { item: WorkItem; project: Project; locale: Locale }) => (
  project.openChat
    ? <button type="button" className="rl-frame-hit" onClick={openChat} tabIndex={-1} aria-hidden="true" />
    : <Link href={localizeHref(`/realizacje/${item.slug}`, locale)} prefetch={false} className="rl-frame-hit" tabIndex={-1} aria-hidden="true" />
);

/** Kadr realizacji (strona klienta na żywo albo scena asystenta). Z `locale` kadr jest klikalny (FrameHit). */
export const ProjectFrame = ({ item, project, t, size, manual, anim, eager, className, style, sky = true, locale }: {
  item: WorkItem; project: Project; t: RealizacjeDict; size: FrameSize;
  manual?: boolean; anim?: 'enter' | 'none'; eager?: boolean; className?: string; style?: CSSProperties;
  /** false = kadr nie zgłasza się mgławicy (mgławica świeci wokół kadru z data-sky najbliżej środka okna). */
  sky?: boolean;
  locale?: Locale;
}) => (
  <Frame
    slug={item.slug} alt={`${t.cardAltPrefix} ${item.name}`} accent={item.accent} domain={item.domain ?? AI_HOST}
    size={size} sizes={SIZES[size]} live={!project.openChat} manual={manual} anim={anim} eager={eager} sky={sky ? item.slug : undefined}
    className={className} style={style} hit={locale ? <FrameHit item={item} project={project} locale={locale} /> : undefined}
  />
);

/** Tekst karty. `stretch` = link rozciągnięty na całą kartę (kadr też prowadzi do realizacji). */
export const CardText = ({ item, project, num, t, locale, scope = false, stretch = true, big = false, head = true }: {
  item: WorkItem; project: Project; num: number; t: RealizacjeDict; locale: Locale;
  scope?: boolean; stretch?: boolean; big?: boolean;
  /** false = bez numeru, nazwy i kreski (nazwę pokazuje plansza tytułowa w wersji Plansze). */
  head?: boolean;
}) => {
  const chat = !!project.openChat;
  const href = localizeHref(chat ? AI_SERVICE : `/realizacje/${item.slug}`, locale);
  const tech = project.techStack ?? [];
  const cls = `rl-card-link${stretch ? ' rl-card-link--stretch' : ''}`;
  return (
    <div className="rl-card-body" data-big={big ? '' : undefined} style={{ '--ac': item.accent } as CSSProperties}>
      {head && (
        <>
          <p className="rl-card-meta">
            <span className="rl-card-num">{nn(num)}</span>
            <span>{item.kind}</span>
          </p>
          <h3 className="rl-card-name">
            {chat ? (
              <button type="button" className={cls} onClick={openChat} aria-label={`${item.name} - ${t.chatAria}`}>{item.name}</button>
            ) : (
              <Link href={href} prefetch={false} className={cls}>{item.name}</Link>
            )}
          </h3>
          <i className="rl-card-rule" aria-hidden="true" />
        </>
      )}
      <p className="rl-card-sum">{item.summary}</p>
      {scope && (
        <ul className="rl-card-scope" aria-label={t.scopeLabel}>
          {item.scope.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
      {tech.length > 0 && (
        <p className="rl-card-tech"><span className="sr-only">{t.techLabel}: </span>{tech.join(' · ')}</p>
      )}
      <div className="rl-card-foot">
        {chat ? (
          <button type="button" className="rl-card-go" onClick={openChat} aria-label={t.chatAria} tabIndex={stretch ? -1 : 0}>
            {t.cardChat}
            <ArrowRight className="rl-arrow" aria-hidden="true" />
          </button>
        ) : (
          <Link href={href} prefetch={false} className="rl-card-go" tabIndex={stretch ? -1 : 0} aria-hidden={stretch ? true : undefined}>
            {t.cardCaseStudy}
            <ArrowRight className="rl-arrow" aria-hidden="true" />
          </Link>
        )}
        {chat ? (
          <Link href={href} prefetch={false} className="rl-card-site">{t.cardService}</Link>
        ) : item.domain ? (
          <a href={`https://${item.domain}`} target="_blank" rel="noopener noreferrer" className="rl-card-site" aria-label={`${t.siteAria} ${item.domain}`}>
            {item.domain}
            <ArrowUpRight className="rl-card-site-ico" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

/** Karta: kadr + tekst (siatka po planszach, rzędy przy ograniczonym ruchu). */
export const ProjectCard = ({ id, item, project, num, t, locale, size, scope, className, style }: {
  id?: string; item: WorkItem; project: Project; num: number; t: RealizacjeDict; locale: Locale; size: FrameSize;
  scope?: boolean; className?: string; style?: CSSProperties;
}) => {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, 0.2);
  return (
    <article ref={ref} id={id} className={`rl-card${className ? ` ${className}` : ''}`} style={{ '--ac': item.accent, ...style } as CSSProperties}>
      <ProjectFrame item={item} project={project} t={t} size={size} locale={locale} />
      <CardText item={item} project={project} num={num} t={t} locale={locale} scope={scope} />
    </article>
  );
};

/** Pusty kadr: w pasku adresu wpisuje się „twojafirma.pl”, w oknie przerywany obrys i znak „+”. */
export const EmptyFrame = ({ t, size, anim = 'enter', className, style, sky = true }: {
  t: RealizacjeDict; size: FrameSize; anim?: 'enter' | 'none'; className?: string; style?: CSSProperties; sky?: boolean;
}) => (
  <Frame
    slug="" alt="" accent="var(--brand-rgb)" domain={t.nextDomain} size={size} sizes="" live={false} anim={anim} sky={sky ? 'next' : undefined}
    className={`rl-next-frame${className ? ` ${className}` : ''}`} style={{ '--n': t.nextDomain.length, ...style } as CSSProperties}
  >
    <div className="rl-next-view">
      <i className="rl-next-plus" />
      <span className="rl-next-type">{t.nextDomain}</span>
    </div>
  </Frame>
);

/** Tekst karty „Twoja firma może być następna” (numer 05, jak kolejna realizacja). */
export const NextText = ({ t, locale, num, head = true }: { t: RealizacjeDict; locale: Locale; num: number; head?: boolean }) => (
  <div className="rl-card-body" style={{ '--ac': 'var(--brand-rgb)' } as CSSProperties}>
    {head && (
      <>
        <p className="rl-card-meta">
          <span className="rl-card-num">{nn(num)}</span>
          <span>{t.nextKind}</span>
        </p>
        <h3 className="rl-card-name">{t.nextTitle}</h3>
        <i className="rl-card-rule" aria-hidden="true" />
      </>
    )}
    <p className="rl-card-sum">{t.nextText}</p>
    <div className="rl-next-cta">
      <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="rl-cta">
        {t.cta}
        <ArrowRight aria-hidden="true" />
      </Link>
      <button type="button" className="rl-ghost" onClick={openChat} aria-label={t.chatAria}>{t.chat}</button>
    </div>
  </div>
);

/** Karta domykająca siatkę / listę, gdy zostaje wolne miejsce (jak „Nie wiesz, co wybrać?” w katalogu usług).
    Wygląda jak kolejna realizacja - historia bez tłumaczenia („tu może stanąć Twoja strona”). */
export const NextCard = ({ t, locale, num, size, className, style }: {
  t: RealizacjeDict; locale: Locale; num: number; size: FrameSize; className?: string; style?: CSSProperties;
}) => {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, 0.25);
  return (
    <article ref={ref} className={`rl-card rl-next${className ? ` ${className}` : ''}`} style={{ '--ac': 'var(--brand-rgb)', ...style } as CSSProperties}>
      <EmptyFrame t={t} size={size} />
      <NextText t={t} locale={locale} num={num} />
    </article>
  );
};
