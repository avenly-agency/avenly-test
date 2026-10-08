'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Lock } from 'lucide-react';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { useFrame, useReducedPref } from '../../_usluga/shared';
import { Page } from './site';

// SCENA 4 - ZAKRES Z POKAZEM (wzorzec: scope.tsx z one-page; zakres i termin w tych samych miejscach na każdej
// podstronie usługi - drabina): „co otrzymujesz” nie jest listą do przeczytania - każdy punkt POKAZUJE SIĘ w kadrze
// obok. Kadr z przykładową stroną firmową stoi przyklejony, lista przewija się obok; punkt najbliżej linii czytania
// jest aktywny i przełącza pokaz w kadrze (data-demo na .sf-c-stick, przejścia w CSS):
//   0 Kinowy projekt graficzny  - na stronie głównej pojawia się siatka projektu (kolumny),
//   1 Płynne animacje i efekty  - strona zjeżdża do usług, karty usług wjeżdżają kaskadą (w pętli),
//   2 Zbieranie leadów          - kadr przechodzi na podstronę Kontakt (strony stoją obok siebie - struktura),
//                                 pola się wypełniają, przycisk zmienia się w „Wysłane”,
//   3 Perfekcyjne na telefonie  - kadr NAPRAWDĘ zwęża się do telefonu, a strona przechodzi w układ na telefon
//                                 (decyzja właściciela z pilota: „faktyczna zmiana, a nie udawana z opacity”). Na czas
//                                 pokazu pismo strony ma stały rozmiar w px (--sf-fs / --sf-fs-n zamiast cqw), a pomiar
//                                 nie pracuje w trakcie zwężania. Gdy kadr już w spoczynku ma układ na telefon (wąski
//                                 ekran), strona tylko się skaluje (--pw / --ps),
//   4 Google Core Web Vitals    - pod paskiem adresu przelatuje pasek ładowania,
//   5 Pomoc wdrożeniowa         - w pasku adresu wpisuje się domena, zapala się kłódka.
// Nad listą termin na linii wymiarowej. Bez JS / ograniczony ruch: lista + nieruchomy kadr ze stroną główną.

/** Szerokość okna strony w kadrze, od której strona klienta ma układ na telefon (= @container w strona-firmowa.css). */
const BREAK = 430;

export const Scope = ({ t, site }: { t: CompanyCopy['scope']; site: CompanyCopy['site'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  // pomiar w spoczynku (kadr na pełną szerokość): dokąd strona ma zjechać w pokazach 1 i 2 oraz stałe rozmiary
  // pisma / skala strony na czas zwężania do telefonu
  useEffect(() => {
    const stick = stickRef.current;
    const frame = stick?.querySelector<HTMLElement>('.sf-c-frame');
    const view = frame?.querySelector<HTMLElement>('.sf-fr-view');
    const pages = frame?.querySelectorAll<HTMLElement>('.sf-c-page');
    if (!stick || !frame || !view || !pages || pages.length < 2) return;
    const set = (k: string, v: string | null) => { if (v === null) frame.style.removeProperty(k); else if (frame.style.getPropertyValue(k) !== v) frame.style.setProperty(k, v); };
    const measure = () => {
      const cs = getComputedStyle(stick);
      const rest = stick.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // w trakcie zwężania / rozszerzania nic nie mierzymy (ostatnia klatka przejścia wywoła pomiar jeszcze raz)
      if (stick.dataset.demo === '3' || Math.abs(frame.offsetWidth - rest) > 1.5) return;
      const w0 = view.clientWidth;
      const phone = (parseFloat(cs.getPropertyValue('--phw')) || 300) - 2 * (parseFloat(cs.getPropertyValue('--php')) || 9);
      if (w0 > BREAK) {
        set('--sf-fs', (w0 * 0.013).toFixed(2) + 'px'); set('--sf-fs-n', (phone * 0.042).toFixed(2) + 'px');
        set('--pw', null); set('--ps', null);
      } else {
        set('--sf-fs', null); set('--sf-fs-n', null);
        set('--pw', w0 + 'px'); set('--ps', (phone / w0).toFixed(4));
      }
      const at = (page: HTMLElement, sel: string, pad: number, bottom = false) => {
        const el = page.querySelector<HTMLElement>(sel);
        if (!el) return 0;
        const max = Math.max(0, page.offsetHeight - view.clientHeight);
        const y = el.getBoundingClientRect().top - page.getBoundingClientRect().top + (bottom ? el.offsetHeight - view.clientHeight : 0);
        return -Math.min(max, Math.max(0, y - pad));
      };
      set('--y1', at(pages[0], '.sf-st-svc', view.clientHeight * 0.1).toFixed(1) + 'px');
      set('--y2', at(pages[1], '[data-anchor="form"]', -view.clientHeight * 0.06, true).toFixed(1) + 'px');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stick); ro.observe(view); pages.forEach((pg) => ro.observe(pg));
    return () => ro.disconnect();
  }, []);

  // blask mgławicy przy kadrze tylko na komputerze (na telefonie kadr stoi nad listą - blask rozjaśniałby tło pod tekstem)
  useEffect(() => {
    const frame = stickRef.current?.querySelector<HTMLElement>('.sf-c-frame');
    if (!frame) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => { if (mq.matches) frame.setAttribute('data-sky', 'scene'); else frame.removeAttribute('data-sky'); };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // aktywny punkt listy = najbliżej linii czytania (komputer: 46% wysokości okna, telefon: 76% - kadr stoi u góry)
  // wydajność (2026-10-05): listy elementów i zapytanie o szerokość pobierane raz, sekcja daleko od ekranu nic nie
  // liczy (po wyjściu z zasięgu jeszcze jedno pełne przeliczenie = stan spoczynku), wszystkie odczyty układu przed
  // zapisami, a na komputerze bez pomiarów dla „data-gone” (tam nic nie gaśnie pod kadrem)
  const live = useRef<{ items: HTMLElement[]; fade: HTMLElement[]; mq: MediaQueryList | null; far: boolean }>({ items: [], fade: [], mq: null, far: false });
  useFrame((frac) => {
    const root = ref.current, stick = stickRef.current;
    if (!root || !stick) return;
    const vh = window.innerHeight;
    const sr = root.getBoundingClientRect();
    const c = live.current;
    const far = sr.bottom - frac < -vh || sr.top - frac > vh * 2;
    if (far && c.far) return;
    c.far = far;
    if (!c.items.length || !c.items[0].isConnected) {
      c.items = Array.from(root.querySelectorAll<HTMLElement>('.sf-c-item'));
      c.fade = Array.from(root.querySelectorAll<HTMLElement>('.sf-c-list > .sv-h2, .sf-c-list > .sf-term, .sf-c-item'));
    }
    c.mq ??= window.matchMedia('(min-width: 1024px)');
    const wide = c.mq.matches;
    const line = vh * (wide ? 0.46 : 0.76);
    let best = -1, bd = Infinity;
    c.items.forEach((li, i) => {
      const r = li.getBoundingClientRect();
      const d = Math.abs(r.top - frac + r.height / 2 - line);
      if (d < bd) { bd = d; best = i; }
    });
    if (sr.top - frac > vh * 0.7 || sr.bottom - frac < vh * 0.3) best = -1;
    // telefon / tablet: to, co wjechało pod przyklejony kadr, gaśnie
    const frameEl = stick.firstElementChild as HTMLElement | null;
    const edge = wide || !frameEl ? -Infinity : frameEl.getBoundingClientRect().bottom - 6;
    const gone = c.fade.map((el) => edge > -Infinity && el.getBoundingClientRect().top < edge);
    c.items.forEach((li, i) => li.toggleAttribute('data-on', i === best));
    c.fade.forEach((el, i) => el.toggleAttribute('data-gone', gone[i]));
    const demo = best < 0 ? '' : String(best);
    if ((stick.dataset.demo ?? '') !== demo) { if (demo) stick.dataset.demo = demo; else delete stick.dataset.demo; }
  }, !reduced);

  return (
    <section ref={ref} className="sf-c" aria-labelledby="sf-c-h">
      <div className="sf-c-in container mx-auto px-6">
        <div className="sf-c-list">
          <h2 id="sf-c-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
          <div className="sf-term">
            <span className="sf-term-l">{t.termLabel}</span>
            <span className="sf-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
          </div>
          <ol className="sf-c-items">
            {t.items.map((it, i) => (
              <li key={it.title} className="sf-c-item" style={{ '--i': i } as CSSProperties}>
                <span className="sf-c-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="sf-c-t">{it.title}</span>
                <span className="sf-c-d">{it.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stickRef} className="sf-c-stick" aria-hidden="true">
          <div className="sf-c-frame">
            <div className="sf-fr-rim">
              <i className="sf-c-notch" />
              <div className="sf-fr-bar">
                <span className="sf-fr-url"><Lock className="sf-c-lock" /><span className="sf-c-domain">{site.domain}</span></span>
                <span className="sf-c-load"><i /></span>
              </div>
              <div className="sf-fr-view">
                <div className="sf-c-pages">
                  <div className="sf-c-page"><Page t={site} id="home" /></div>
                  <div className="sf-c-page"><Page t={site} id="contact" /></div>
                </div>
                <i className="sf-c-grid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
