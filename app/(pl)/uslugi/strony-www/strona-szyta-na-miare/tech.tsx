'use client';

import { useRef, type CSSProperties } from 'react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { Depth } from './depth';
import { Drawing, setPlay } from './drawings';
import { clamp01, seg, useFrame, useReducedPref } from '../../_usluga/shared';

// SCENA 3 - „Technologia liderów.”: TRZY NOWE PROPOZYCJE (runda 5, 2026-10-05). Właściciel o poprzednich (Stos /
// Panorama / Siatka - trzy układy tych samych kart z rysunkami): „zrób kilka innych, bo te mi się nie podobają” -
// tamte układy i ich style są USUNIĘTE, NIE wracać bez prośby. Nowe propozycje to trzy różne SCENY, nie trzy
// ustawienia kart (`look`, przełącznik w panelu na dole ekranu):
//   board  „Deska”  - scena przypięta, jedna duża czarna deska (jak deska rysunków w Ofercie strony głównej): trzy
//                     rysunki techniczne powstają na niej jeden po drugim razem z przewijaniem (linie rysują się,
//                     rysunek gra swoją scenkę, zwija się, powstaje następny); obok jeden tekst naraz,
//   worlds „Światy” - scena przypięta bez kart i rysunków: cały ekran jest światem świecących linii (Posadzka / Węzły /
//                     Smugi z depth.tsx w pełnej skali, wprost na mgławicy podstrony), po lewej duży tekst rozdziału;
//                     kolejny świat rozchodzi się miękką plamą, poprzedni tak samo się zbiega,
//   strips „Kadry”  - bez przypięcia: trzy szerokie pasy od krawędzi do krawędzi ekranu, w każdym żyje jego świat
//                     linii, na pasie duży tytuł i opis; świat „wschodzi”, gdy pas wjeżdża w okno.
// Teksty we wszystkich wersjach te same (słownik `cases`): numer i hasło, tytuł, opis, podpis rysunku (tylko Deska).
// Rzeczy pojawiają się miękko, „tak jak się nebula rozchodzi” (maska .sm-bloom) - bez linii światła i kurtyn.
// Bez JS / ograniczony ruch: nagłówek i trzy pozycje jedna pod drugą (rysunki w całości, bez scenek i światów).

export type TechLook = 'board' | 'worlds' | 'strips';
type T = CustomCopy['cases'];
type Item = T['items'][number];

const nn = (i: number) => String(i + 1).padStart(2, '0');
const put = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };

/** Postęp przypiętej sceny (p 0-1), wejście sekcji w okno (enter 0-1: od 80% wysokości okna do góry) i czy jest na ekranie. */
const progress = (el: HTMLElement, frac: number) => {
  const r = el.getBoundingClientRect(), vh = window.innerHeight;
  return {
    p: clamp01(-(r.top - frac) / Math.max(1, r.height - vh)),
    enter: clamp01((vh * 0.8 - (r.top - frac)) / (vh * 0.8)),
    on: r.top < vh && r.bottom > 0,
  };
};
/** Rozdział sceny: który z n jest na ekranie (at) i jak daleko w nim jesteśmy (q 0-1). */
const chapter = (p: number, n: number) => {
  const f = Math.min(n - 1e-4, p * n), at = Math.floor(f);
  return { at, q: f - at };
};

const Meta = ({ it, i, n }: { it: Item; i: number; n: number }) => (
  <p className="sm-b-meta">
    <span className="sm-b-n" aria-hidden="true"><b>{nn(i)}</b><i> / {nn(n - 1)}</i></span>
    <span className="sm-b-tag">{it.tag}</span>
  </p>
);
const Head = ({ t }: { t: T }) => (
  <>
    <h2 id="sm-b-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
    <p className="im-lead sm-b-lead">{t.lead}</p>
  </>
);
/** Trzy odcinki postępu sceny (jak pasek „stories”): --f 0-1 na każdym. */
const Ticks = ({ n }: { n: number }) => (
  <span className="sm-b-ticks" aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>
);
const ticks = (root: HTMLElement, at: number, q: number) => {
  root.querySelectorAll<HTMLElement>('.sm-b-ticks i').forEach((el, i) => put(el, '--f', (i < at ? 1 : i === at ? q : 0).toFixed(3)));
};

export const TechBoard = ({ t }: { t: T }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const n = t.items.length;
  const farRef = useRef(false);

  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    // wydajność (2026-10-05): sekcja daleko od ekranu nic nie liczy (po wyjściu z zasięgu jeszcze jedno pełne przeliczenie)
    const sr = el.getBoundingClientRect(), vh = window.innerHeight;
    const far = sr.bottom - frac < -vh || sr.top - frac > vh * 2;
    if (far && farRef.current) return;
    farRef.current = far;
    const { p, enter, on } = progress(el, frac);
    const { at, q } = chapter(p, n);
    el.querySelectorAll<HTMLElement>('.sm-bd-item').forEach((li, i) => li.toggleAttribute('data-on', i === at));
    el.querySelectorAll<HTMLElement>('.sm-bd-fig').forEach((fig, i) => {
      let d = 0, b = 0;
      if (i === at) {
        // rysunek rysuje się w pierwszej połowie rozdziału, potem gra scenkę; świat w tle rozchodzi się od rysunku.
        // Pierwszy rysunek zaczyna powstawać już przy wjeździe sekcji - deska nie stoi pusta, gdy scena się przypina
        d = seg(q, 0.05, 0.46); b = seg(q, 0, 0.34);
        if (i === 0) { d = Math.max(d, seg(enter, 0.45, 1)); b = Math.max(b, seg(enter, 0.2, 0.9)); }
        // przed końcem rozdziału rysunek się zwija, a świat zbiega (ostatni zostaje)
        if (i < n - 1) { d = Math.min(d, 1 - seg(q, 0.86, 0.99)); b = Math.min(b, 1 - seg(q, 0.88, 1)); }
      }
      put(fig, '--d', d.toFixed(3));
      put(fig, '--b', b.toFixed(3));
      put(fig, '--dp', on && b > 0.004 ? '0' : '1');
      // trzy rysunki leżą jeden na drugim, każdy z płótnem pod maską: rysunek, którego nie widać (d = b = 0), nie jest
      // rysowany ani składany (data-off), a przy w pełni otwartej plamie (b = 1) maska płótna schodzi (data-clear) -
      // reguły w CSS, obraz bez zmian (wydajność, 2026-10-05)
      fig.toggleAttribute('data-off', d <= 0 && b <= 0);
      fig.toggleAttribute('data-clear', b >= 1);
      const play = on && d > 0.985;
      if ((fig.dataset.play === '1') !== play) { fig.dataset.play = play ? '1' : '0'; setPlay(fig.querySelector('.sm-b-svg'), play); }
    });
    ticks(el, at, q);
  }, !reduced);

  return (
    <section ref={ref} className="sm-b sm-bd" aria-labelledby="sm-b-h">
      <div className="sm-bd-stage">
        <div className="sm-bd-in container mx-auto px-6">
          <div className="sm-bd-copy">
            <Head t={t} />
            <ol className="sm-bd-list">
              {t.items.map((it, i) => (
                <li key={it.title} className="sm-bd-item">
                  <Meta it={it} i={i} n={n} />
                  <h3 className="sm-b-t">{it.title}</h3>
                  <p className="sm-b-d">{it.text}</p>
                </li>
              ))}
            </ol>
            <Ticks n={n} />
          </div>
          <div className="sm-bd-board" aria-hidden="true">
            {t.items.map((it, i) => (
              <figure key={it.title} className="sm-bd-fig" data-dh="">
                <Depth scene={i} />
                <div className="sm-bd-art" data-df=""><Drawing index={i} /></div>
                <figcaption>{it.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const TechWorlds = ({ t }: { t: T }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const n = t.items.length;

  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    const { p, enter, on } = progress(el, frac);
    const { at, q } = chapter(p, n);
    el.querySelectorAll<HTMLElement>('.sm-bw-item').forEach((li, i) => li.toggleAttribute('data-on', i === at));
    el.querySelectorAll<HTMLElement>('.sm-bw-world').forEach((w, i) => {
      let b = 0;
      if (i === at) {
        // świat rozchodzi się miękką plamą; pierwszy już przy wjeździe sekcji, ostatni zostaje do końca
        b = seg(q, 0, 0.36);
        if (i === 0) b = Math.max(b, seg(enter, 0.25, 1));
        if (i < n - 1) b = Math.min(b, 1 - seg(q, 0.84, 1));
      }
      put(w, '--b', b.toFixed(3));
      put(w, '--d', b.toFixed(3));
      put(w, '--dp', on && b > 0.004 ? '0' : '1');
    });
    ticks(el, at, q);
  }, !reduced);

  return (
    <section ref={ref} className="sm-b sm-bw" aria-labelledby="sm-b-h">
      <div className="sm-bw-stage">
        <div className="sm-bw-worlds" aria-hidden="true">
          {t.items.map((it, i) => (
            <div key={it.title} className="sm-bw-world sm-bloom" data-dh="">
              <Depth scene={i} />
              <i className="sm-bw-focus" data-df="" />
            </div>
          ))}
        </div>
        <div className="sm-bw-in container mx-auto px-6">
          <div className="sm-bw-head"><Head t={t} /></div>
          <ol className="sm-bw-list">
            {t.items.map((it, i) => (
              <li key={it.title} className="sm-bw-item">
                <Meta it={it} i={i} n={n} />
                <h3 className="sm-bw-t">{it.title}</h3>
                <p className="sm-b-d">{it.text}</p>
              </li>
            ))}
          </ol>
          <Ticks n={n} />
        </div>
      </div>
    </section>
  );
};

export const TechStrips = ({ t }: { t: T }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const n = t.items.length;

  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight;
    el.querySelectorAll<HTMLElement>('.sm-bs-strip').forEach((li) => {
      // pas „wschodzi”, gdy wjeżdża w okno od dołu (świat linii podnosi się, tekst dojeżdża na miejsce)
      const r = li.getBoundingClientRect();
      put(li, '--d', clamp01((vh * 0.96 - (r.top - frac)) / (vh * 0.62)).toFixed(3));
    });
  }, !reduced);

  return (
    <section ref={ref} className="sm-b sm-bs" aria-labelledby="sm-b-h">
      <div className="container mx-auto px-6"><Head t={t} /></div>
      <ol className="sm-bs-list">
        {t.items.map((it, i) => (
          <li key={it.title} className="sm-bs-strip" data-dh="" style={{ '--i': i } as CSSProperties}>
            <Depth scene={i} />
            <i className="sm-bs-focus" data-df="" aria-hidden="true" />
            <div className="sm-bs-in container mx-auto px-6">
              <Meta it={it} i={i} n={n} />
              <h3 className="sm-bs-t">{it.title}</h3>
              <p className="sm-b-d">{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
