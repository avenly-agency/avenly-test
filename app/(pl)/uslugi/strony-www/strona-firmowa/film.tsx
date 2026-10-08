'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Mail } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { ConsultLink, Proof, Steps, setSteps } from '../../_usluga/parts';
import { lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Page, PAGES, pageUrl, type PageId } from './site';

// SCENA 1 - „FILM / PIĘTRA”: pierwszy ekran i przypięta scena z ruchem kamery (wzorzec: film.tsx z one-page, poziom
// wyżej). One-page pokazuje JEDNĄ stronę przewijaną do formularza. Strona firmowa pokazuje STRUKTURĘ: stronę z menu
// i podstronami, w której każda usługa ma swoje miejsce - widowiskiem jest RUCH KAMERY MIĘDZY PODSTRONAMI.
// WYBÓR WŁAŚCICIELA 2026-10-02: „piętra zajebiste”, po rundzie 2 „banger” (z trzech propozycji: Przelot / Piętra /
// Trzy wejścia - pozostałe dwie i przełącznik usunięte, nie przywracać bez prośby). Każda podstrona przykładowej
// strony klienta (site.tsx) ma własny kadr z własnym adresem w pasku; kadry leżą JEDEN ZA DRUGIM jak piętra budynku:
//   pierwszy ekran - rozsunięty stos pięter w rzucie aksonometrycznym, DUŻY I CZĘŚCIOWO ZA KRAWĘDZIĄ EKRANU, skręcony
//                    w MINI SPIRALĘ (każde piętro obrócone o kilka stopni względem poprzedniego - właściciel:
//                    „żeby ten stos był jakby częściowo za ekranem… jakaś mini spirala”),
//   najazd kamery  - spirala się rozkręca, stos obraca się na wprost, strona główna wypełnia ekran,
//   film           - kamera ZJEŻDŻA przez piętra jak winda: minięte piętro odpływa w górę i gaśnie, następne podpływa
//                    z dołu i z głębi (CSS: .sf-fr w strona-firmowa.css).
// OPOWIEŚĆ = droga klienta: otwiera menu i wybiera trzecią usługę -> kamera zjeżdża przez podstrony dwóch pierwszych
// usług (każda usługa ma własne piętro) na podstronę trzeciej -> klient pyta o tę usługę -> piętro niżej czeka kontakt
// z już wybraną usługą -> „Nowe zapytanie · Pyta o: Usługa trzecia”.
// TEMPO (poprawka właściciela 2026-10-02: „zbyt szybko i zbyt harsh się zmieniają te podstrony usług”): kamera
// zjeżdża ZAWSZE O JEDNO PIĘTRO NARAZ, z miękkim startem i końcem i z przystankiem na każdym piętrze - żadna
// podstrona nie „przelatuje” w pół sekundy. Scena ma 600vh drogi. NIE wracać do zjazdu przez dwa-trzy piętra jednym
// ruchem ani do przelotu na wprost z przenikaniem dwóch podstron (pierwsza wersja).
// BEZ KLIKANIA W MAKIECIE (decyzja właściciela 2026-10-02: „zrób tak, żeby nie można było na makiecie klikać”):
// scena jest tylko do oglądania, steruje nią wyłącznie przewijanie. Dawne kliknięcia w menu kadru (przejmowanie
// kamery, podpowiedź „Kliknij w menu…”) usunięte - nie przywracać bez prośby.
// Wszystko sterowane przewijaniem (usePin): funkcja pisze zmienne CSS, resztę robi CSS (strona-firmowa.css).
// Bez JS / ograniczony ruch: nagłówek, kadr ze stroną główną, lista kroków - bez przypięcia.
// NAGŁÓWEK ma własny znacznik (ten sam układ i klasy co ServiceHead ze szkieletu), bo tytuł jest pocięty na części:
// na telefonie po najeździe kamery zmniejszony tytuł stoi w DWÓCH liniach - ostatnie słowo („zaufanie.”) gaśnie
// w trzeciej linii i zapala się na końcu drugiej (--tx / --ty z pomiaru, --tp / --to z postępu kamery), a skala (--hs-fit) jest dobrana tak, żeby
// tytuł był jak największy i mieścił się nad kadrem (właściciel 2026-10-02: „za mały jest ten tekst na telefonach
// i zrób w dwóch liniach, a nie w trzech, minimalnie odsuń od makiety”).

type Site = CompanyCopy['site'];

/** Piętra, na których dzieje się akcja (indeksy w PAGES): podstrona trzeciej usługi i kontakt. */
const FLOOR = { svc: PAGES.indexOf('s2'), contact: PAGES.indexOf('contact') };

const pulse = (p: number, a: number, b: number, c: number) => Math.min(lin(p, a, b), 1 - lin(p, b, c));
/** Położenie elementu w układzie strony (px, bez przekształceń sceny). */
const topIn = (el: HTMLElement | null, root: HTMLElement) => {
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
};

const Frame = ({ t, id, i }: { t: Site; id: PageId; i: number }) => (
  <div className="sf-fr" data-page={id} style={{ '--i': i } as CSSProperties}>
    <div className="sf-fr-rim">
      <div className="sf-fr-bar">
        <span className="sf-fr-url"><i />{pageUrl(t, id)}</span>
      </div>
      <div className="sf-fr-view">
        <div className="sf-fr-page"><Page t={t} id={id} /></div>
      </div>
    </div>
  </div>
);

/** Nagłówek: jak ServiceHead ze szkieletu (układ, klasy, wejście), ale tytuł w częściach - pierwsza linia, druga linia
    bez ostatniego słowa i ostatnie słowo z kropką (na telefonie to ono przenosi się do drugiej linii przy najeździe kamery). */
const Head = ({ t, locale }: { t: CompanyCopy['head']; locale: Locale }) => {
  const [l1, l2 = ''] = t.title.split('\n');
  const cut = l2.lastIndexOf(' ');
  const mid = cut > 0 ? l2.slice(0, cut) : '', last = cut > 0 ? l2.slice(cut + 1) : l2;
  return (
    <header className="sv-head" data-align="start">
      <h1 id="sv-h1" className="im-title sv-title">
        <span className="sv-mask">
          <span className="sv-line">
            <span className="sf-a-t1">{l1}</span>{' '}
            <span className="sf-a-t2">{mid}</span>{' '}
            <span className="sf-a-t3">{last}<span className="im-accent">.</span></span>
          </span>
        </span>
      </h1>
      <p className="im-lead sv-lead sv-in" style={{ '--d': 3 } as CSSProperties}>{t.lead}</p>
      <div className="sv-actions sv-in" style={{ '--d': 4 } as CSSProperties}>
        <ConsultLink label={t.cta} locale={locale} />
      </div>
      <Proof items={t.proof} className="sv-in" style={{ '--d': 5 } as CSSProperties} />
    </header>
  );
};

export const Film = ({ t, locale }: { t: CompanyCopy; locale: Locale }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  const frames = useRef<HTMLElement[]>([]);
  /** Dokąd przewija się strona w kadrze [px]: do treści podstrony, do przycisku „Zapytaj…”, do formularza. */
  const meas = useRef<{ body: number; ask: number; form: number }[]>([]);
  /** Czy ostatnie słowo tytułu stoi w osobnej linii (telefon) - wtedy przy najeździe kamery przenosi się wyżej. */
  const wrapped = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    steps.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    frames.current = Array.from(root.querySelectorAll<HTMLElement>('.sf-fr'));
    const measure = () => {
      meas.current = frames.current.map((fr) => {
        const view = fr.querySelector<HTMLElement>('.sf-fr-view'), page = fr.querySelector<HTMLElement>('.sf-fr-page');
        if (!view || !page) return { body: 0, ask: 0, form: 0 };
        const vh = view.clientHeight, max = Math.max(0, page.offsetHeight - vh);
        const fit = (y: number) => Math.min(max, Math.max(0, y));
        const bodyEl = page.querySelector<HTMLElement>('[data-anchor="body"]');
        const askEl = page.querySelector<HTMLElement>('.sf-st-ask');
        const formEl = page.querySelector<HTMLElement>('[data-anchor="form"]');
        const body = bodyEl ? fit(topIn(bodyEl, page) - vh * 0.14) : 0;
        const ask = askEl ? Math.max(body, fit(topIn(askEl, page) + askEl.offsetHeight - vh * 0.86)) : 0;
        const form = formEl ? fit(topIn(formEl, page) + formEl.offsetHeight - vh * 0.94) : 0;
        return { body, ask, form };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    frames.current.forEach((fr) => { const v = fr.querySelector('.sf-fr-view'), pg = fr.querySelector('.sf-fr-page'); if (v) ro.observe(v); if (pg) ro.observe(pg); });
    // wysokość nagłówka z opisem i przyciskiem: na telefonie scena zaczyna się zawsze POD nimi
    const copy = root.querySelector<HTMLElement>('.sf-a-copy');
    const title = root.querySelector<HTMLElement>('.sv-title');
    const t2 = root.querySelector<HTMLElement>('.sf-a-t2'), t3 = root.querySelector<HTMLElement>('.sf-a-t3');
    const fit = () => {
      if (!copy) return;
      root.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
      if (!title || !t2 || !t3) return;
      // zmniejszony tytuł: ostatnie słowo, jeśli spadło do osobnej linii, przenosi się na koniec poprzedniej (o --tx / --ty)
      const wrap = t3.offsetTop > t2.offsetTop + 4;
      wrapped.current = wrap;
      const space = parseFloat(getComputedStyle(title).fontSize) * 0.2;
      const dx = wrap ? t2.offsetLeft + t2.offsetWidth + space - t3.offsetLeft : 0, dy = wrap ? t2.offsetTop - t3.offsetTop : 0;
      root.style.setProperty('--tx', `${dx.toFixed(1)}px`);
      root.style.setProperty('--ty', `${dy.toFixed(1)}px`);
      // skala: jak największa, ale połączona linia mieści się na szerokość, a cały tytuł w pasie nad kadrem
      const lineW = wrap ? t2.offsetLeft + t2.offsetWidth + space + t3.offsetWidth : title.scrollWidth;
      const s = Math.min(0.6, copy.clientWidth / Math.max(1, lineW), 54 / Math.max(1, title.offsetHeight + dy));
      root.style.setProperty('--hs-fit', (1 - s).toFixed(3));
    };
    fit();
    const rc = new ResizeObserver(fit);
    if (copy) rc.observe(copy);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => { ro.disconnect(); rc.disconnect(); };
  }, []);

  usePin(ref, (p, el) => {
    const set = (k: string, v: string, node: HTMLElement = el) => { if (node.style.getPropertyValue(k) !== v) node.style.setProperty(k, v); };
    // najazd kamery: nagłówek maleje w lewy górny róg, spirala pięter rozkręca się, stos staje na wprost i rośnie
    const cam = seg(p, 0, 0.11);
    set('--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    el.toggleAttribute('data-focus', cam > 0.985);
    // telefon: ostatnie słowo tytułu gaśnie w trzeciej linii i zapala się na końcu drugiej (bez przejazdu przez tekst)
    set('--tp', wrapped.current && cam >= 0.5 ? '1' : '0');
    set('--to', wrapped.current ? Math.min(1, Math.abs(cam - 0.5) * 5).toFixed(3) : '1');
    // zjazd przez piętra: zawsze o JEDNO piętro, miękko, z przystankiem (strona główna -> usługa 1 -> 2 -> 3 -> kontakt)
    set('--pos', (seg(p, 0.3, 0.39) + seg(p, 0.43, 0.52) + seg(p, 0.56, 0.65) + seg(p, 0.78, 0.87)).toFixed(4));
    // strona główna: kursor jedzie do „Usługi”, menu się rozwija, kursor wybiera trzecią usługę
    set('--co1', Math.min(lin(p, 0.12, 0.14), 1 - lin(p, 0.285, 0.3)).toFixed(3));
    set('--m1', seg(p, 0.13, 0.18).toFixed(3));
    set('--k1', pulse(p, 0.175, 0.186, 0.207).toFixed(3));
    set('--menu', Math.min(lin(p, 0.186, 0.21), 1 - lin(p, 0.288, 0.305)).toFixed(3));
    set('--m2', seg(p, 0.215, 0.258).toFixed(3));
    set('--k2', pulse(p, 0.262, 0.272, 0.292).toFixed(3));
    // podstrona trzeciej usługi: treść przewija się, kursor jedzie do „Zapytaj o tę usługę”
    const svc = meas.current[FLOOR.svc], con = meas.current[FLOOR.contact];
    const svcEl = frames.current[FLOOR.svc], conEl = frames.current[FLOOR.contact];
    if (svc && svcEl) set('--py', `${(-(svc.body * seg(p, 0.665, 0.705) + (svc.ask - svc.body) * seg(p, 0.705, 0.735))).toFixed(1)}px`, svcEl);
    set('--co2', Math.min(lin(p, 0.69, 0.705), 1 - lin(p, 0.782, 0.795)).toFixed(3));
    set('--q', seg(p, 0.7, 0.75).toFixed(3));
    set('--k3', pulse(p, 0.754, 0.764, 0.784).toFixed(3));
    // kontakt: usługa jest już wybrana w formularzu, pola się wypełniają, wysłanie, powiadomienie
    if (con && conEl) set('--py', `${(-con.form * seg(p, 0.87, 0.9)).toFixed(1)}px`, conEl);
    set('--f3', lin(p, 0.868, 0.885).toFixed(3));
    set('--f1', lin(p, 0.89, 0.912).toFixed(3));
    set('--f2', lin(p, 0.912, 0.936).toFixed(3));
    set('--co3', Math.min(lin(p, 0.895, 0.91), 1 - lin(p, 0.972, 0.985)).toFixed(3));
    set('--cx', seg(p, 0.895, 0.945).toFixed(3));
    set('--k', pulse(p, 0.945, 0.953, 0.968).toFixed(3));
    set('--sent', lin(p, 0.953, 0.965).toFixed(3));
    set('--n0', seg(p, 0.96, 0.99).toFixed(3));
    const state = p < 0.3 ? 0 : p < 0.78 ? 1 : 2;
    if (el.dataset.state !== String(state)) el.dataset.state = String(state);
    setSteps(steps.current, state, [lin(p, 0.03, 0.3), lin(p, 0.3, 0.78), lin(p, 0.78, 0.98)]);
  }, !reduced);

  return (
    <section ref={ref} className="sf-a" data-state="0" data-still="">
      <div className="sf-a-stage">
        <div className="sf-a-in container mx-auto px-6">
          <div className="sf-a-copy">
            <Head t={t.head} locale={locale} />
          </div>
          {/* wejście (.sv-late) na elemencie z perspektywą, NIE na scenie 3D: animacja przezroczystości na przodku kadrów
              spłaszcza ich głębię w Chrome (piętra leżały wtedy w jednej płaszczyźnie) */}
          <div className="sf-a-cam sv-late" aria-hidden="true" style={{ '--d': 1 } as CSSProperties}>
            <div className="sf-a-rig" data-sky="scene">
              <div className="sf-a-wall">
                {PAGES.map((id, i) => <Frame key={id} t={t.site} id={id} i={i} />)}
              </div>
            </div>
            <div className="sf-a-notes">
              <div className="sf-a-note" style={{ '--n': 'var(--n0, 1)' } as CSSProperties}>
                <p className="sf-a-note-h"><Mail />{t.film.note.title}<span>{t.film.note.time}</span></p>
                <p className="sf-a-note-from">{t.film.note.from}</p>
                <p className="sf-a-note-msg"><i />{t.film.note.about} {t.site.services[2].name}</p>
              </div>
            </div>
          </div>
          <div className="sf-a-steps">
            <Steps items={t.film.steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
