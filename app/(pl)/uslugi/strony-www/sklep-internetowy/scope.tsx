'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Lock } from 'lucide-react';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { useFrame } from '../../_usluga/shared';
import { useCalm } from './calm';
import { PanelUI, ScreenCart, ScreenGate, ScreenPay, ScreenShop, ShopProvider, useShop, zl, type PanelRow } from './store';

// SCENA 4 - ZAKRES Z POKAZEM (wzorzec z pilota one-page, prefiks sk-z-): „co dostajesz” nie jest listą do przeczytania -
// każdy punkt POKAZUJE SIĘ w kadrze obok. Kadr ze sklepem stoi przyklejony, lista przewija się obok; punkt najbliżej
// linii czytania jest aktywny i przełącza pokaz w kadrze (data-demo na kadrze, przejścia w CSS, warianty = prawdziwy
// stan sklepu przełączany zegarem):
//   0 Projekt graficzny sklepu - sklep marki w spoczynku,
//   1 Konfiguracja katalogu    - warianty produktu przełączają się same: kolor i rozmiar,
//   2 Optymalizacja konwersji  - koszyk: kod rabatowy wpisuje się, rabat schodzi z sumy,
//   3 Dostawa                  - kasa: kurier / paczkomat / odbiór osobisty, kwota do zapłaty zmienia się z dostawą,
//   4 Bramki płatności         - strona operatora: Przelewy24 z kodem BLIK na zmianę ze Stripe i kartą,
//   5 Wdrożenie i szkolenie    - panel zamówień pod własną domeną: adres wpisuje się w pasku, zapala się kłódka.
// KOLEJNOŚĆ = kolejność zakupu (właściciel 2026-10-02: „poukładaj tak, żeby po prawej się nie wracały elementy,
// chronologicznie”): punkty listy i ekrany w kadrze idą w tę samą stronę - sklep -> koszyk -> kasa -> operator -> panel.
// Przy przewijaniu w dół kadr przesuwa się tylko do przodu (dawniej: sklep -> operator -> kasa -> koszyk -> panel).
// Nad listą termin na linii wymiarowej (te same miejsca na każdej podstronie usługi - drabina).
// Bez JS / ograniczony ruch: lista + nieruchomy kadr ze sklepem.

/** Który ekran pokazuje dany punkt: 0 sklep, 1 koszyk, 2 kasa, 3 strona operatora płatności, 4 panel (rosnąco). */
const SCREEN_OF = [0, 0, 1, 2, 3, 4];
const noop = () => {};

/** Zegar pokazów: przełącza prawdziwy stan sklepu (kolor, rozmiar, płatność, dostawa), gdy dany punkt jest aktywny. */
const Driver = ({ demo }: { demo: number }) => {
  const { set } = useShop();
  useEffect(() => {
    if (demo !== 1 && demo !== 3 && demo !== 4) return;
    let k = 0;
    const tick = () => {
      k++;
      if (demo === 1) set({ color: k % 3, size: (k + 1) % 3 });
      else if (demo === 4) set({ pay: k % 2 });
      else set({ ship: k % 3 });
    };
    const id = window.setInterval(tick, demo === 4 ? 2800 : 1500);
    return () => { window.clearInterval(id); set({ color: 0, size: 1, pay: 0, ship: 1 }); };
  }, [demo, set]);
  return null;
};

export const Scope = ({ t }: { t: ShopCopy }) => {
  const reduced = useCalm();
  const ref = useRef<HTMLElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState(-1);
  const s = t.scope;

  const rows = useMemo<PanelRow[]>(() => [141, 276, 94, 164, 226, 91].map((a, i) => ({
    no: `#2026-00${47 - i}`, time: i < 3 ? `${9 - i}:${['12', '40', '05'][i]}` : t.panel.older, who: t.panel.customers[i % t.panel.customers.length],
    ship: t.store.ship[i % 2 === 0 ? 1 : 0].name, amt: zl(a), pay: t.store.pays[i === 1 ? 1 : 0], st: i < 2 ? i : 2,
  })), [t]);

  // blask mgławicy przy kadrze tylko na komputerze (na telefonie kadr stoi u góry, a lista tuż pod nim)
  useEffect(() => {
    const frame = stickRef.current?.querySelector<HTMLElement>('.sk-z-frame');
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
      c.items = Array.from(root.querySelectorAll<HTMLElement>('.sk-z-item'));
      c.fade = Array.from(root.querySelectorAll<HTMLElement>('.sk-z-list > .sv-h2, .sk-z-list > .sk-z-lead, .sk-z-list > .sk-term, .sk-z-item'));
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
    // telefon / tablet: kadr przyklejony u góry, lista przewija się pod nim - to, co wjechało pod kadr, gaśnie
    const frameEl = stick.firstElementChild as HTMLElement | null;
    const edge = wide || !frameEl ? -Infinity : frameEl.getBoundingClientRect().bottom - 6;
    const gone = c.fade.map((el) => edge > -Infinity && el.getBoundingClientRect().top < edge);
    c.items.forEach((li, i) => li.toggleAttribute('data-on', i === best));
    c.fade.forEach((el, i) => el.toggleAttribute('data-gone', gone[i]));
    const v = best < 0 ? '' : String(best);
    if ((stick.dataset.demo ?? '') !== v) {
      if (v) stick.dataset.demo = v; else delete stick.dataset.demo;
      stick.dataset.screen = String(best < 0 ? 0 : SCREEN_OF[best]);
      setDemo(best);
    }
  }, !reduced);

  return (
    <section ref={ref} className="sk-z" aria-labelledby="sk-z-h">
      <div className="sk-z-in container mx-auto px-6">
        <div className="sk-z-list">
          <h2 id="sk-z-h" className="im-title sv-h2">{s.title} <span className="im-accent">{s.titleAccent}</span></h2>
          <p className="im-lead sk-z-lead">{s.lead}</p>
          <div className="sk-term">
            <span className="sk-term-l">{s.termLabel}</span>
            <span className="sk-term-dim"><i aria-hidden="true" /><b>{s.termValue}</b><i aria-hidden="true" /></span>
          </div>
          <ol className="sk-z-items">
            {s.items.map((it, i) => (
              <li key={it.title} className="sk-z-item" style={{ '--i': i } as CSSProperties}>
                <span className="sk-z-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="sk-z-t">{it.title}</span>
                <span className="sk-z-d">{it.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stickRef} className="sk-z-stick" data-screen="0" aria-hidden="true" inert>
          <div className="sk-z-frame">
            <div className="sk-fr-rim">
              <div className="sk-fr-bar">
                <span className="sk-fr-url"><Lock className="sk-z-lock" /><span className="sk-z-domain">{t.panel.domain}</span><span className="sk-z-domain0">{t.store.domain}</span></span>
                <span className="sk-fr-tag">{t.store.sample}</span>
              </div>
              <div className="sk-fr-view">
                <ShopProvider t={t.store} go={noop}>
                  <Driver demo={demo} />
                  <div className="sk-z-screens">
                    <div className="sk-z-scr"><ScreenShop /></div>
                    <div className="sk-z-scr"><ScreenCart coupon /></div>
                    <div className="sk-z-scr"><ScreenPay demo /></div>
                    <div className="sk-z-scr"><ScreenGate /></div>
                    <div className="sk-z-scr"><PanelUI t={t.panel} rows={rows} /></div>
                  </div>
                </ShopProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
