'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Check, Lock, MousePointer2 } from 'lucide-react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { useFrame, useReducedPref } from '../../_usluga/shared';
import { Site, type Horizon } from './site';

// SCENA 4 - ZAKRES Z POKAZEM (wzorzec pilota: one-page/scope.tsx): „Od konceptu po wdrożenie.” - lista sześciu etapów
// (teksty z pierwotnej podstrony), a obok przyklejony kadr ze stroną klienta, w którym każdy etap SAM SIĘ POKAZUJE.
// Punkt najbliżej linii czytania jest aktywny i przełącza pokaz (data-demo na .sm-c-stick, przejścia w CSS):
//   0 Architektura i logika - cztery ekrany strony (pierwszy ekran, oferta, realizacje, kontakt) zjeżdżają się w plan
//                             (pomniejszają się i stają obok siebie, połączone linią) - prawdziwe przekształcenie
//                             tych samych ekranów, nie podmiana obrazu,
//   1 Prototypowanie (UX)   - kursor podjeżdża do plakietki „Akceptuję”, plakietka zapala się ze znakiem,
//   2 Nowoczesny frontend   - strona gra swój ruch: ekran oferty rozchodzi się od słońca, kamera jedzie wzdłuż kart,
//   3 Integracje            - przy stronie pojawiają się po kolei narzędzia (Płatności, CRM, ERP),
//   4 Quality assurance     - zapalają się po kolei znaki „Bezpieczeństwo” i „Wydajność” (bez linii przeglądu jadącej
//                             przez stronę - właściciel 2026-10-05: bez „linii, która leci”),
//   5 Deploy i utrzymanie   - na stronie wstaje świt (--m), w pasku adresu wpisuje się domena, zapala kłódka i „Strona działa”.
// Nad listą termin na linii wymiarowej (to samo miejsce na każdej podstronie usługi - drabina). WARTOŚĆ TERMINU jest
// tymczasowa - liczba dopiero po potwierdzeniu właściciela.
// Bez JS / ograniczony ruch: lista + nieruchomy kadr z gotową stroną.

export const Scope = ({ t, site, hz = 'ridge' }: { t: CustomCopy['scope']; site: CustomCopy['site']; hz?: Horizon }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  // blask mgławicy siedzi przy kadrze tylko na komputerze (kadr obok listy) - na telefonie lista stoi tuż pod kadrem
  useEffect(() => {
    const frame = stickRef.current?.querySelector<HTMLElement>('.sm-c-frame');
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
      c.items = Array.from(root.querySelectorAll<HTMLElement>('.sm-c-item'));
      c.fade = Array.from(root.querySelectorAll<HTMLElement>('.sm-c-list > .sv-h2, .sm-c-list > .sm-term, .sm-c-item'));
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
    const frameEl = stick.firstElementChild as HTMLElement | null;
    const edge = wide || !frameEl ? -Infinity : frameEl.getBoundingClientRect().bottom - 6;
    const gone = c.fade.map((el) => edge > -Infinity && el.getBoundingClientRect().top < edge);
    c.items.forEach((li, i) => li.toggleAttribute('data-on', i === best));
    c.fade.forEach((el, i) => el.toggleAttribute('data-gone', gone[i]));
    const demo = best < 0 ? '' : String(best);
    if ((stick.dataset.demo ?? '') !== demo) { if (demo) stick.dataset.demo = demo; else delete stick.dataset.demo; }
  }, !reduced);

  return (
    <section ref={ref} className="sm-c" aria-labelledby="sm-c-h">
      <div className="sm-c-in container mx-auto px-6">
        <div className="sm-c-list">
          <h2 id="sm-c-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
          <div className="sm-term">
            <span className="sm-term-l">{t.termLabel}</span>
            <span className="sm-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
          </div>
          <ol className="sm-c-items">
            {t.items.map((it, i) => (
              <li key={it.title} className="sm-c-item" style={{ '--i': i } as CSSProperties}>
                <span className="sm-c-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="sm-c-t">{it.title}</span>
                <span className="sm-c-d">{it.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stickRef} className="sm-c-stick" aria-hidden="true">
          <div className="sm-c-frame">
            <div className="sm-fr-rim">
              <div className="sm-fr-bar">
                <span className="sm-fr-url"><Lock className="sm-c-lock" /><span className="sm-c-domain">{site.domain}</span></span>
                <span className="sm-c-live"><i />{t.demo.live}</span>
              </div>
              <div className="sm-fr-port">
                <div className="sm-fr-view">
                  <Site t={site} scene={hz} uid="s" />
                  <span className="sm-c-map"><i /><i /><i /></span>
                  <span className="sm-c-ok"><i><Check /></i>{t.demo.accept}</span>
                  <span className="sm-c-cur"><MousePointer2 /></span>
                  <span className="sm-c-chips">{t.demo.chips.map((c, i) => <b key={c} style={{ '--ci': i } as CSSProperties}><i />{c}</b>)}</span>
                  <span className="sm-c-checks">{t.demo.checks.map((c, i) => <b key={c} style={{ '--ci': i } as CSSProperties}><i><Check /></i>{c}</b>)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
