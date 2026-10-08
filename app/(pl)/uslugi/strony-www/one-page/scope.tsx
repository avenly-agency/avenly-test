'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Lock } from 'lucide-react';
import type { OnePageCopy } from '@/lib/i18n/uslugi/one-page';
import { useFrame, useReducedPref } from '../../_usluga/shared';
import { Site } from './site';

// SCENA 3 - ZAKRES Z POKAZEM: „co dostajesz” nie jest listą do przeczytania - każdy punkt POKAZUJE SIĘ w kadrze obok.
// Kadr ze stroną klienta stoi przyklejony, lista przewija się obok; punkt najbliżej środka okna jest aktywny
// i przełącza pokaz w kadrze (data-demo na kadrze, przejścia w CSS):
//   0 Projekt od zera       - na stronie pojawia się siatka projektu (kolumny, linie pomocnicze),
//   1 Sekcje pod branżę     - strona zjeżdża do oferty, nad nią po kolei zapalają się sekcje do wyboru,
//   2 Formularz             - strona zjeżdża do kontaktu, pola się wypełniają, przycisk zmienia się w „Wysłane”,
//   3 Telefon               - kadr NAPRAWDĘ zwęża się do telefonu, a strona w nim przechodzi w układ na telefon jak
//                             przy zwężaniu okna przeglądarki (właściciel: „zrób faktyczną zmianę, a nie udawaną
//                             z opacity”). Żeby to nie przycinało: na czas pokazu pismo strony ma stały rozmiar w px
//                             (--one-fs / --one-fs-n zamiast cqw - bez przeliczania stylów i rastrowania tekstu co
//                             klatkę), a pomiar poniżej nie pracuje w trakcie zwężania. Gdy kadr już w spoczynku ma
//                             układ na telefon (wąski ekran), strona tylko się skaluje (--pw / --ps, kompozytor),
//   4 Szybkie ładowanie     - pod paskiem adresu przelatuje pasek ładowania,
//   5 Wsparcie techniczne   - w pasku adresu wpisuje się domena, zapala się kłódka (tekst punktu od 2026-10-02 mówi
//                             o wsparciu technicznym, bez wyliczania domeny / hostingu / SSL - prośba właściciela).
// Nad listą termin na linii wymiarowej (te same miejsca na każdej podstronie usługi - drabina).
// Bez JS / ograniczony ruch: lista + nieruchomy kadr z gotową stroną.

/** Szerokość okna strony w kadrze, od której strona klienta ma układ na telefon (= @container w one-page.css). */
const BREAK = 430;

export const Scope = ({ t, site }: { t: OnePageCopy['scope']; site: OnePageCopy['site'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  // pomiar w spoczynku (kadr na pełną szerokość): dokąd strona ma zjechać w pokazach 1 i 2 (oferta, kontakt)
  // oraz stałe rozmiary pisma / skala strony na czas zwężania do telefonu
  useEffect(() => {
    const stick = stickRef.current;
    const frame = stick?.querySelector<HTMLElement>('.one-c-frame');
    const view = frame?.querySelector<HTMLElement>('.one-fr-view');
    const page = frame?.querySelector<HTMLElement>('.one-c-page');
    if (!stick || !frame || !view || !page) return;
    const set = (k: string, v: string | null) => { if (v === null) frame.style.removeProperty(k); else if (frame.style.getPropertyValue(k) !== v) frame.style.setProperty(k, v); };
    const measure = () => {
      const cs = getComputedStyle(stick);
      const rest = stick.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // w trakcie zwężania / rozszerzania nic nie mierzymy (ostatnia klatka przejścia wywoła pomiar jeszcze raz)
      if (stick.dataset.demo === '3' || Math.abs(frame.offsetWidth - rest) > 1.5) return;
      const w0 = view.clientWidth;
      const phone = (parseFloat(cs.getPropertyValue('--phw')) || 300) - 2 * (parseFloat(cs.getPropertyValue('--php')) || 9);
      if (w0 > BREAK) {
        // szeroki układ: prawdziwe przejście układu przy stałym piśmie
        set('--one-fs', (w0 * 0.013).toFixed(2) + 'px'); set('--one-fs-n', (phone * 0.042).toFixed(2) + 'px');
        set('--pw', null); set('--ps', null);
      } else {
        // kadr już w układzie na telefon: strona o stałej szerokości, w telefonie tylko mniejsza
        set('--one-fs', null); set('--one-fs-n', null);
        set('--pw', w0 + 'px'); set('--ps', (phone / w0).toFixed(4));
      }
      const max = Math.max(0, page.offsetHeight - view.clientHeight);
      const at = (name: string, pad: number) => {
        const el = page.querySelector<HTMLElement>(`[data-anchor="${name}"]`);
        if (!el) return 0;
        const y = el.getBoundingClientRect().top - page.getBoundingClientRect().top;
        return -Math.min(max, Math.max(0, y - pad));
      };
      set('--y1', at('offer', view.clientHeight * 0.2).toFixed(1) + 'px');
      set('--y2', at('contact', view.clientHeight * 0.08).toFixed(1) + 'px');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stick); ro.observe(view); ro.observe(page);
    return () => ro.disconnect();
  }, []);

  // blask mgławicy siedzi przy kadrze tylko na komputerze (kadr obok listy). Na telefonie kadr stoi u góry, a lista
  // tuż pod nim - blask rozjaśniałby tło pod tekstem (niebieski akcent nagłówka na niebieskiej chmurze był nieczytelny),
  // więc tam mgławica zostaje w spoczynku (wschodzi zza dolnej krawędzi, tekst stoi na ciemnym niebie)
  useEffect(() => {
    const frame = stickRef.current?.querySelector<HTMLElement>('.one-c-frame');
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
    const root = ref.current, frame = stickRef.current;
    if (!root || !frame) return;
    const vh = window.innerHeight;
    const sr = root.getBoundingClientRect();
    const c = live.current;
    const far = sr.bottom - frac < -vh || sr.top - frac > vh * 2;
    if (far && c.far) return;
    c.far = far;
    if (!c.items.length || !c.items[0].isConnected) {
      c.items = Array.from(root.querySelectorAll<HTMLElement>('.one-c-item'));
      c.fade = Array.from(root.querySelectorAll<HTMLElement>('.one-c-list > .sv-h2, .one-c-list > .one-term, .one-c-item'));
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
    // przed sceną i po niej kadr wraca do stanu spoczynku
    if (sr.top - frac > vh * 0.7 || sr.bottom - frac < vh * 0.3) best = -1;
    // telefon / tablet: kadr jest przyklejony u góry, a lista przewija się pod nim - to, co wjechało pod kadr, gaśnie
    // (zamiast czarnego pasa za kadrem; przy zwężonym kadrze-telefonie tekst nie wystaje po bokach)
    const frameEl = frame.firstElementChild as HTMLElement | null;
    const edge = wide || !frameEl ? -Infinity : frameEl.getBoundingClientRect().bottom - 6;
    const gone = c.fade.map((el) => edge > -Infinity && el.getBoundingClientRect().top < edge);
    c.items.forEach((li, i) => li.toggleAttribute('data-on', i === best));
    c.fade.forEach((el, i) => el.toggleAttribute('data-gone', gone[i]));
    const demo = best < 0 ? '' : String(best);
    if ((frame.dataset.demo ?? '') !== demo) { if (demo) frame.dataset.demo = demo; else delete frame.dataset.demo; }
  }, !reduced);

  return (
    <section ref={ref} className="one-c" aria-labelledby="one-c-h">
      <div className="one-c-in container mx-auto px-6">
        <div className="one-c-list">
          <h2 id="one-c-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
          <div className="one-term">
            <span className="one-term-l">{t.termLabel}</span>
            <span className="one-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
          </div>
          <ol className="one-c-items">
            {t.items.map((it, i) => (
              <li key={it.title} className="one-c-item" style={{ '--i': i } as CSSProperties}>
                <span className="one-c-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="one-c-t">{it.title}</span>
                <span className="one-c-d">{it.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stickRef} className="one-c-stick" aria-hidden="true">
          <div className="one-c-frame">
            <div className="one-fr-rim">
              <i className="one-c-notch" />
              <div className="one-fr-bar">
                <span className="one-fr-url"><Lock className="one-c-lock" /><span className="one-c-domain">{site.domain}</span></span>
                <span className="one-c-load"><i /></span>
              </div>
              <div className="one-fr-view">
                <div className="one-c-page"><Site t={site} chips={t.chips} /></div>
                <i className="one-c-grid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
