'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Mail } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { OnePageCopy } from '@/lib/i18n/uslugi/one-page';
import { ServiceHead, Steps, setSteps } from '../../_usluga/parts';
import { Sketch } from '../../_usluga/sketch';
import { lin, seg, usePin, useReducedPref, useSeen } from '../../_usluga/shared';
import { Site } from './site';

// SCENA 1 - „FILM”: pierwszy ekran i jedna przypięta scena z ruchem kamery (wzór: Plansze na Realizacjach + hero).
// OPOWIEŚĆ = DROGA KLIENTA PRZEZ GOTOWĄ STRONĘ („jedna strona, jeden cel”). Właściciel 2026-10-02: „nie zaczyna się
// strona od szkicu, więc trzeba przebudować logikę i opowieść”, a po przebudowie: „zostaw ten szkic w hero pierwotnie,
// żeby był i też się odsłaniał, ale już nie jako opowieść, tylko wizualna część”. Czyli: SZKIC I UKOŚNA ODSŁONA SĄ
// TYLKO OBRAZEM (kadr w hero zaczyna jako rysunek techniczny strony, przy najeździe kamery linia światła zamienia go
// w gotową stronę), a podpisy, etykiety w pasku adresu i kolejność aktów mówią wyłącznie o drodze klienta. NIE wracać
// do podpisów i etykiet o szkicu („Zaczyna się od szkicu…”, „Szkic / Gotowa strona”).
// SZKIC JEST BAZĄ CAŁEJ STRONY W KADRZE (właściciel: „dodaj te wireframe i tak bazowo, żeby się odkryciem tak fajnie
// odkryło”): pod gotową stroną leży jej szkic, a gotowa strona ma maskę z czterech pasów (pierwszy ekran / oferta /
// opinia / kontakt, granice --b1..3 z pomiaru). Każdy pas odsłania się własną ukośną linią światła (--r1..4, --o1..4),
// gdy film do niego dojeżdża - sekcje nie wjeżdżają już same z siebie.
//   Start: wielki nagłówek przy lewej krawędzi, po prawej duży kadr ze szkicem strony klienta (z pomiaru prawdziwej
//          strony w kadrze - sketch.tsx), linie rysują się po wejściu.
//   Najazd kamery: nagłówek maleje w lewy górny róg, opis i przycisk gasną, kadr prostuje się i rośnie na cały ekran,
//          a ukośna linia światła odsłania gotową, kolorową stronę (site.tsx).
//   Akt 1 „Pierwszy ekran”: klient od razu widzi, co oferujesz i dla kogo.
//   Akt 2 „Oferta”: strona przewija się w kadrze - oferta i opinia przyjeżdżają jako szkic i odsłaniają się po kolei.
//   Akt 3 „Kontakt”: formularz odsłania się ze szkicu, kursor go wypełnia i wysyła; z kadru wyskakuje „Nowe zapytanie”.
// W pasku adresu po prawej nazwa miejsca na stronie (data-state 0-2). Pod kadrem trzy podpisy z paskami.
// Wszystko sterowane przewijaniem (usePin). Kadr na starcie: „duży, za krawędź ekranu” (wybór właściciela; zmienne
// --h-* w CSS). W spoczynku (data-still) kadr nie ma will-change - przeglądarka rastruje go w rzeczywistej skali.
// Bez JS / ograniczony ruch: nagłówek, kadr z gotową stroną, lista kroków - bez przypięcia.

export const Film = ({ t, locale }: { t: OnePageCopy; locale: Locale }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  /** Przystanki strony w kadrze [px]: oferta, opinia, koniec (formularz). */
  const stops = useRef<[number, number, number]>([0, 0, 0]);
  const steps = useRef<HTMLElement[]>([]);
  const seen = useSeen(frameRef, 0.05);

  useEffect(() => {
    const view = viewRef.current, page = pageRef.current, root = ref.current;
    if (!view || !page || !root) return;
    steps.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    const measure = () => {
      const max = Math.max(0, page.offsetHeight - view.clientHeight);
      // położenie z układu (offsetTop względem strony) - bez przekształceń sceny
      const top = (name: string) => {
        const el = page.querySelector<HTMLElement>(`[data-anchor="${name}"]`);
        if (!el) return page.offsetHeight;
        let y = 0;
        for (let n: HTMLElement | null = el; n && n !== page; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
        return y;
      };
      const stop = (y: number, pad: number) => Math.min(max, Math.max(0, y - view.clientHeight * pad));
      const [o, q, c] = [top('offer'), top('quote'), top('contact')];
      stops.current = [stop(o, 0.12), stop(q, 0.3), max];
      // granice pasów odsłony (px strony): pierwszy ekran | oferta | opinia | kontakt ze stopką
      [o, q, c - view.clientHeight * 0.04].forEach((y, i) => root.style.setProperty(`--b${i + 1}`, `${Math.round(y)}px`));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view); ro.observe(page);
    // wysokość nagłówka z opisem i przyciskiem: na telefonie kadr zaczyna się zawsze POD nimi (na niskich ekranach
    // sama wartość 42vh wjeżdżała kadrem na linię dowodów)
    const copy = root.querySelector<HTMLElement>('.one-a-copy');
    const fit = () => { if (copy) root.style.setProperty('--copy-h', `${copy.offsetHeight}px`); };
    fit();
    const rc = new ResizeObserver(fit);
    if (copy) rc.observe(copy);
    return () => { ro.disconnect(); rc.disconnect(); };
  }, []);

  usePin(ref, (p, el) => {
    const set = (k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
    // najazd kamery
    const cam = seg(p, 0, 0.16);
    set('--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    // strona w kadrze: pierwszy ekran -> oferta -> opinia -> formularz (z postojami)
    const [yo, yq, ye] = stops.current;
    const y = yo * seg(p, 0.27, 0.38) + (yq - yo) * seg(p, 0.45, 0.53) + (ye - yq) * seg(p, 0.58, 0.68);
    set('--y', `${(-y).toFixed(1)}px`);
    // szkic -> gotowa strona (sam obraz), pas po pasie: pierwszy ekran przy najeździe kamery, kolejne sekcje, gdy
    // strona do nich dojedzie; --r = położenie linii światła w % pasa, --o = jej widoczność
    [lin(p, 0.07, 0.23), lin(p, 0.33, 0.44), lin(p, 0.49, 0.57), lin(p, 0.62, 0.71)].forEach((r, i) => {
      set(`--r${i + 1}`, (-4 + r * 112).toFixed(2));
      set(`--o${i + 1}`, Math.min(1, r * 12, (1 - r) * 12).toFixed(3));
    });
    // etykieta miejsca i podpis kroku zmieniają się, gdy strona w kadrze faktycznie dojeżdża do oferty / formularza
    const state = p < 0.31 ? '0' : p < 0.6 ? '1' : '2';
    if (el.dataset.state !== state) el.dataset.state = state;
    // formularz: kursor, pola, wysłanie, powiadomienie
    set('--co', Math.min(lin(p, 0.7, 0.73), 1 - lin(p, 0.95, 0.98)).toFixed(3));
    set('--cx', seg(p, 0.7, 0.875).toFixed(3));
    set('--f1', lin(p, 0.73, 0.76).toFixed(3));
    set('--f2', lin(p, 0.76, 0.8).toFixed(3));
    set('--f3', lin(p, 0.8, 0.86).toFixed(3));
    set('--k', Math.min(lin(p, 0.875, 0.89), 1 - lin(p, 0.89, 0.915)).toFixed(3));
    set('--sent', lin(p, 0.887, 0.905).toFixed(3));
    set('--note', seg(p, 0.905, 0.955).toFixed(3));
    setSteps(steps.current, p < 0.31 ? 0 : p < 0.6 ? 1 : 2, [lin(p, 0.04, 0.31), lin(p, 0.31, 0.6), lin(p, 0.6, 0.94)]);
  }, !reduced);

  return (
    <section ref={ref} className="one-a" data-state="0" data-still="">
      <div className="one-a-stage">
        <div className="one-a-in container mx-auto px-6">
          <div className="one-a-copy">
            <ServiceHead t={t.head} locale={locale} align="start" />
          </div>
          <div className="one-a-cam" aria-hidden="true">
            <div ref={frameRef} className="one-a-frame sv-late" data-sky="scene" style={{ '--d': 1 } as CSSProperties}>
              <div className="one-fr-rim">
                <div className="one-fr-bar">
                  <span className="one-fr-url"><i />{t.site.domain}</span>
                  <span className="one-fr-state">{t.film.states.map((s, i) => <b key={s} data-s={i}>{s}</b>)}</span>
                </div>
                <div ref={viewRef} className="one-fr-view">
                  <div className="one-a-layer one-a-layer--sketch">
                    <div className="one-a-page"><Sketch target={pageRef} draw={seen} /></div>
                  </div>
                  <div className="one-a-layer one-a-layer--final">
                    <div ref={pageRef} className="one-a-page"><Site t={t.site} /><i className="one-a-beam" /></div>
                  </div>
                </div>
              </div>
              <div className="one-a-note">
                <p className="one-a-note-h"><Mail />{t.film.noteTitle}<span>{t.film.noteTime}</span></p>
                <p className="one-a-note-from">{t.film.noteFrom}</p>
                <p className="one-a-note-msg">{t.film.noteMsg}</p>
              </div>
            </div>
          </div>
          <div className="one-a-steps">
            <Steps items={t.film.steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
