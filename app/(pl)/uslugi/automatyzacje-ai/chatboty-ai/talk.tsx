'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useLenis } from 'lenis/react';
import { Mail, MessageCircle } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { ConsultLink, Proof } from '../../_usluga/parts';
import { clamp01, openChat, useSeen } from '../../_usluga/shared';

// Wspólne części podstrony „Chatboty AI” (praca równoległa, etap 3, chat 13; style ch- w chatboty.css):
//   Spark    - asystent jako POSTAĆ: czteroramienna gwiazda w kolorze podstrony (jak „klejnoty” nieba w hero i gwiazdki
//              etykiet sekcji). Wniosek z usuniętej sekcji „Asystent AI” (docs/sekcje/asystent-ai.md): sama makieta
//              rozmowy była „bez duszy” - dusza = asystent, który słucha, myśli i odpowiada,
//   Head     - nagłówek w języku szkieletu (klasy sv-) z drugim przyciskiem „Przetestuj na sobie”, który otwiera
//              PRAWDZIWEGO asystenta z rogu strony (lokalna wersja ServiceHead - szkieletu nie zmieniamy),
//   Words    - odpowiedź asystenta słowo po słowie (samo CSS: opóźnienie z --i),
//   Msg      - wypowiedź w przykładowej rozmowie (dymek klienta / dymek asystenta z gwiazdą),
//   useBeats - kroki scenariusza na osi czasu (z góry napisany scenariusz - żadnych wywołań API),
//   SectionHead - nagłówek sekcji (h2 z akcentem w kolorze podstrony + opis) przy lewej krawędzi kontenera,
//   Narr / setNarr - narrator przypiętej sceny: JEDNO zdanie naraz (decyzja właściciela z fali 2: w scenie jedno
//              zdanie i jedno miejsce akcji naraz, bez podpisów rozrzuconych po ekranie),
//   InboxCard - gotowe zapytanie w skrzynce właściciela firmy (pola wypełniają się po kolei).
// Rozmowy w scenach są PRZYKŁADEM (etykieta `sample`), nie drugim czatem: okna czatu (components/chatbot) nie ruszamy.

export type SparkState = 'idle' | 'think' | 'speak';

export const Spark = ({ state = 'idle', className }: { state?: SparkState; className?: string }) => (
  <span className={className ? `ch-spark ${className}` : 'ch-spark'} data-state={state} aria-hidden="true">
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 0C12.7 7.2 16.8 11.3 24 12 16.8 12.7 12.7 16.8 12 24 11.3 16.8 7.2 12.7 0 12 7.2 11.3 11.3 7.2 12 0Z" />
    </svg>
  </span>
);

/** „Przetestuj na sobie”: otwiera prawdziwy czat w rogu strony (zdarzenie avenly:open-chat). */
export const TryButton = ({ label, className }: { label: string; className?: string }) => (
  <button type="button" className={className ? `ch-try ${className}` : 'ch-try'} onClick={openChat}>
    <MessageCircle aria-hidden="true" />
    {label}
  </button>
);

export const Head = ({ t, locale, align = 'start' }: { t: ChatbotsCopy['head']; locale: Locale; align?: 'start' | 'center' }) => (
  <header className="sv-head ch-head" data-align={align}>
    <h1 id="sv-h1" className="im-title sv-title">
      {t.titleLines.map((line, i) => (
        <span key={line} className="sv-mask">
          <span className="sv-line" style={{ '--d': i } as CSSProperties}>
            {line}
            {i === t.titleLines.length - 1 && <span className="im-accent">.</span>}
          </span>
          {i < t.titleLines.length - 1 && ' '}
        </span>
      ))}
    </h1>
    <p className="im-lead sv-lead sv-in" style={{ '--d': 3 } as CSSProperties}>{t.lead}</p>
    <div className="sv-actions sv-in" style={{ '--d': 4 } as CSSProperties}>
      <ConsultLink label={t.cta} locale={locale} />
      <TryButton label={t.tryIt} />
    </div>
    <Proof items={t.proof} className="sv-in" style={{ '--d': 5 } as CSSProperties} />
  </header>
);

/** Tekst rozbity na słowa (spacje zostają między elementami, twarde spacje trzymają zbitki razem). */
export const Words = ({ text }: { text: string }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="ch-w" style={{ '--i': i } as CSSProperties}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
};
/** Czas wypowiedzi słowo po słowie [ms] (42 ms na słowo w chatboty.css) z chwilą na przeczytanie końcówki. */
export const sayMs = (text: string) => text.split(' ').length * 42 + 620;

export type MsgState = 'off' | 'think' | 'on';

export const Msg = ({ who, label, text, state }: { who: 'client' | 'bot'; label: string; text: string; state: MsgState }) => (
  <div className="ch-msg" data-who={who} data-state={state}>
    <span className="sr-only">{label}: </span>
    {who === 'bot' && <Spark state={state === 'think' ? 'think' : state === 'on' ? 'speak' : 'idle'} />}
    <p className="ch-bub ch-say" data-say={state === 'on' ? '1' : '0'}>
      {who === 'bot' ? <Words text={text} /> : text}
    </p>
  </div>
);

/** Kroki scenariusza: krok `i` zaczyna się po sumie czasów kroków 0..i-1. Zmiana `id` = odtworzenie od początku.
    Zwraca numer bieżącego kroku (-1 przed startem albo gdy `on` = false). Stan zmieniają wyłącznie zegary. */
export const useBeats = (durs: readonly number[], id: string, on = true) => {
  const [st, setSt] = useState<{ id: string; n: number }>({ id: '', n: -1 });
  const sig = durs.join(',');
  useEffect(() => {
    if (!on) return;
    const timers: number[] = [];
    let at = 0;
    sig.split(',').map(Number).forEach((ms, i) => {
      timers.push(window.setTimeout(() => setSt({ id, n: i }), at));
      at += ms;
    });
    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [sig, id, on]);
  return st.id === id ? st.n : -1;
};

/** Element jest na ekranie (do pauzowania automatu poza ekranem). */
export const useOnScreen = (ref: RefObject<HTMLElement | null>) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
};

/** Przewija do elementu, gdy jego początek jest poniżej `below` wysokości okna (Lenis, bez niego natywnie). */
export const useBringIntoView = () => {
  const lenis = useLenis();
  return useCallback((el: HTMLElement | null, below = 0.5) => {
    if (!el) return;
    const vh = window.innerHeight;
    if (el.getBoundingClientRect().top < vh * below) return;
    if (lenis) lenis.scrollTo(el, { offset: -Math.round(vh * 0.26), duration: 1.2 });
    else el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [lenis]);
};

/** Nagłówek sekcji: h2 „tytuł + akcent w kolorze podstrony” i krótki opis; wchodzi, gdy pojawi się na ekranie. */
export const SectionHead = ({ id, title, accent, lead }: { id: string; title: string; accent?: string; lead?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.3);
  return (
    <div ref={ref} className="ch-sec-head">
      <h2 id={id} className="im-title sv-h2">
        {title}{accent ? <> <span className="im-accent">{accent}</span></> : null}
      </h2>
      {lead ? <p className="im-lead ch-sec-lead">{lead}</p> : null}
    </div>
  );
};

/** Narrator przypiętej sceny: zdania leżą w jednym miejscu, widać jedno naraz, paski pokazują postęp kroków.
    Bez JS / ograniczony ruch: zwykła numerowana lista wszystkich zdań. Aktywne zdanie ustawia setNarr. */
export const Narr = ({ items, label, className }: { items: string[]; label: string; className?: string }) => (
  <ol className={className ? `ch-narr ${className}` : 'ch-narr'} aria-label={label}>
    {items.map((text, i) => (
      <li key={i} className="ch-narr-i" data-on={i === 0 ? '1' : '0'} style={{ '--i': i, '--n': items.length } as CSSProperties}>
        <span className="ch-narr-bar" aria-hidden="true"><i /></span>
        <span className="ch-narr-n" aria-hidden="true">{i + 1}</span>
        <span className="ch-narr-t">{text}</span>
      </li>
    ))}
  </ol>
);
/** Ustawia aktywne zdanie narratora z postępu sceny `p` (0-1) i granic `at` (liczba zdań + 1 wartości rosnąco,
    np. [0.1, 0.4, 0.7, 1]). Pisze do DOM tylko przy zmianie. `root` = element z narratorem w środku. */
export const setNarr = (root: HTMLElement | null, p: number, at: readonly number[]) => {
  if (!root) return;
  let on = 0;
  for (let i = 1; i < at.length - 1; i++) if (p >= at[i]) on = i;
  root.querySelectorAll<HTMLElement>('.ch-narr-i').forEach((li, i) => {
    const state = i === on ? '1' : i < on ? '2' : '0';
    if (li.dataset.on !== state) li.dataset.on = state;
    const fill = clamp01((p - at[i]) / ((at[i + 1] ?? 1) - at[i])).toFixed(3);
    if (li.style.getPropertyValue('--f') !== fill) li.style.setProperty('--f', fill);
  });
};

/** Zmienna CSS na elemencie - zapis tylko przy zmianie (sceny piszą je w każdej klatce przewijania). */
export const setVar = (el: HTMLElement | null, name: string, value: string) => {
  if (el && el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
};

/** Gotowe zapytanie w skrzynce - wygląda jak NOWA WIADOMOŚĆ na liście poczty (właściciel 2026-10-05: dawna karta
    z etykietami w siatce „trochę odstaje” od reszty): to samo ciemne szkło z obwódką świecącą od góry co dymki,
    kropka „nieprzeczytane” w kolorze podstrony, kto + kiedy w pierwszej linii, niżej czego potrzebuje i kontakt.
    Etykiety pól (`t.labels`: kto, czego potrzebuje, kiedy, kontakt) zostają dla czytników ekranu.
    `on` = wypełnione (pola pojawiają się po kolei), przed tym same włosowe kreski. Bez JS / ograniczony ruch:
    wypełnione od razu. Skala karty = jej font-size (wszystkie wymiary w em). */
export const InboxCard = ({ t, values, on, className }: { t: ChatbotsCopy['inbox']; values: string[]; on: boolean; className?: string }) => (
  <div className={className ? `ch-inbox ch-lit ${className}` : 'ch-inbox ch-lit'} data-on={on ? '' : undefined}>
    <p className="ch-inbox-t"><Mail aria-hidden="true" />{t.title}</p>
    <dl className="ch-inbox-mail">
      {t.labels.map((label, i) => (
        <div key={label} className="ch-inbox-f" data-f={i} style={{ '--i': i } as CSSProperties}>
          <dt>{label}</dt>
          <dd>{values[i]}</dd>
        </div>
      ))}
    </dl>
  </div>
);
