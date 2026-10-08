'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { ServiceHead, Steps, setSteps } from '../../_usluga/parts';
import { lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Site, type Horizon } from './site';

// SCENA 1 - „FILM”: pierwszy ekran „HORYZONT” i przypięta scena z kamerą (poziom 3 hierarchii).
// PIERWSZY EKRAN (wybór właściciela 2026-10-05: „w 1. wybieram horyzont, ale zrób ładniej to i daj kilka propozycji
// samego horyzontu”): pod nagłówkiem, na całą szerokość ekranu, stoi krajobraz ze strony w kadrze - słońce tuż przed
// wschodem. Niebo krajobrazu rozpuszcza się w mgławicy podstrony (bez prostokątnego pasa), w lewym dolnym rogu podpis
// „twoja-marka.pl · Przykładowa strona”. Cztery krajobrazy do wyboru (`hz`: Grzbiety / Tafla / Orbita / Szczyt -
// site.tsx, przełącznik w panelu na dole ekranu).
// FILM - trzy akty to trzy ujęcia z ruchem kamery, podpisy = scenka Oferty:
//   Akt 1 „Nastrój”: kamera odjeżdża, wokół krajobrazu zamyka się kadr przeglądarki; potem powoli najeżdża (plany
//                    rosną w różnym tempie), słońce wstaje, nagłówek strony wysuwa się spod maski,
//   Akt 2 „Ruch”:    dwa ujęcia. (a) kamera wlatuje w słońce, ekran oferty rozchodzi się od niego miękką plamą; jazda
//                    w bok wzdłuż kart usług. (b) „GŁĘBIA” - RUNDA 6 (właściciel 2026-10-05: „w mockupie pierwszym po
//                    usługach dodaj coś ciekawego jeszcze, jakąś sekcję cinematic, żeby ludzie widzieli”): ekran
//                    realizacji nadchodzi z prawej kilkoma obłokami, kamera leci w głąb kolumnady łuków z postojem
//                    przy każdej realizacji i dolatuje do światła na jej końcu,
//   Akt 3 „Gest”:    światło na końcu kolumnady JEST kształtem ekranu kontaktu (cięcie na dopasowanie) - ekran
//                    realizacji zbiega się na nim; kursor (na telefonie palec) dotyka kształtu,
//                    kamera robi krótki najazd, kształt odpowiada falą; potem „Twoja kolej” - kadr odpowiada na
//                    prawdziwy kursor / palec odwiedzającego (paralaksa planów, fale po kliknięciach - nakładają się).
// W pasku adresu kadru cztery nazwy ujęć (Nastrój / Ruch / Głębia / Gest), pod kadrem trzy kroki scenki Oferty.
// Usunięte, NIE wracać bez prośby: „Moodboard” i „Scena” (inne pierwsze ekrany - właściciel wybrał Horyzont),
// „Poziom wyżej” (porównanie z firmową: „nie chcę, żebyś bezpośrednio porównywał firmową do szytej na miarę”),
// „Warstwy”, nastroje Świt / Noc / Złoto; koło z linią na krawędzi jako przejście między ekranami (właściciel
// 2026-10-05: bez „linii, która leci i zmienia coś na coś” - rzeczy pojawiają się „tak, jak się nebula rozchodzi”).
// Wszystko sterowane przewijaniem (usePin pisze zmienne CSS), CSS robi resztę.
// Bez JS / ograniczony ruch: nagłówek, kadr z pierwszym ekranem w pełnym świetle, lista kroków - bez przypięcia.

export const Film = ({ t, locale, hz }: { t: CustomCopy; locale: Locale; hz: Horizon }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  const f = t.film;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    steps.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    // --copy-h = wysokość nagłówka z opisem i przyciskiem (krajobraz zaczyna się względem niej),
    // --bleed = ile razy okno jest szersze od kadru (krajobraz na całą szerokość ekranu)
    const copy = root.querySelector<HTMLElement>('.sm-a-copy');
    const frame = frameRef.current;
    const fit = () => {
      if (copy) root.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
      if (frame && frame.offsetWidth) root.style.setProperty('--bleed', (document.documentElement.clientWidth / frame.offsetWidth).toFixed(4));
    };
    fit();
    const rc = new ResizeObserver(fit);
    if (copy) rc.observe(copy);
    if (frame) rc.observe(frame);
    window.addEventListener('resize', fit);
    return () => { rc.disconnect(); window.removeEventListener('resize', fit); };
  }, []);

  // GEST ODWIEDZAJĄCEGO: kursor = paralaksa planów (--px / --py, wygładzane), kliknięcie / stuknięcie w kadrze = fala
  // (do sześciu naraz - nakładają się, nie restartują)
  useEffect(() => {
    const root = ref.current, view = viewRef.current;
    if (!root || !view || reduced) return;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0, sx = '', sy = '';
    const tick = () => {
      raf = 0;
      x += (tx - x) * 0.1; y += (ty - y) * 0.1;
      // zapis tylko przy zmianie (wydajność, 2026-10-06): każda zmiana tych zmiennych przelicza style całego kadru
      const nx = x.toFixed(3), ny = y.toFixed(3);
      if (nx !== sx) { sx = nx; root.style.setProperty('--px', nx); }
      if (ny !== sy) { sy = ny; root.style.setProperty('--py', ny); }
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tx = (e.clientX / window.innerWidth) * 2 - 1; ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };
    const timers: number[] = [];
    const down = (e: PointerEvent) => {
      const r = view.getBoundingClientRect();
      if (!r.width) return;
      const el = document.createElement('span');
      el.className = 'sm-rp';
      el.style.left = `${((e.clientX - r.left) / r.width) * 100}%`;
      el.style.top = `${((e.clientY - r.top) / r.height) * 100}%`;
      el.append(document.createElement('i'), document.createElement('i'));
      view.appendChild(el);
      const all = view.querySelectorAll('.sm-rp');
      if (all.length > 6) all[0].remove();
      timers.push(window.setTimeout(() => el.remove(), 2000));
    };
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave, { passive: true });
    root.addEventListener('pointercancel', leave, { passive: true });
    view.addEventListener('pointerdown', down, { passive: true });
    kick();
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', leave);
      view.removeEventListener('pointerdown', down);
      view.querySelectorAll('.sm-rp').forEach((n) => n.remove());
    };
  }, [reduced]);

  usePin(ref, (p, el) => {
    const set = (k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
    // Oś sceny: 600vh drogi (do rundy 5: 430vh; ujęcie „Głębia” dołożyło 170vh - wcześniejsze ujęcia mają tę samą
    // długość w vh co dotąd, progi tylko przeliczone).
    // odjazd kamery od krajobrazu na cały ekran do kadru przeglądarki
    const cam = seg(p, 0, 0.1075);
    set('--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    el.toggleAttribute('data-deep', cam > 0.4);
    el.toggleAttribute('data-full', cam > 0.998);
    // akt 1 - nastrój: kamera powoli najeżdża na krajobraz (plany rosną w różnym tempie), słońce wschodzi,
    // nagłówek strony w kadrze wysuwa się spod maski
    set('--z', seg(p, 0.0358, 0.258).toFixed(4));
    set('--mf', seg(p, 0.0502, 0.1935).toFixed(3));
    set('--hf', seg(p, 0.1003, 0.215).toFixed(3));
    // akt 2 - ruch, ujęcie pierwsze: wlot w słońce (ekran oferty rozchodzi się od niego miękką plamą), jazda w bok
    // wzdłuż kart, przycisk się zapala. Gdy ekran realizacji zasłoni ofertę w całości (p > .553), oferta znika
    // (--iris = 0) - inaczej prześwitywałaby na miękkiej krawędzi, gdy realizacje zbiegają się na kontakcie
    const iris = p > 0.553 ? 0 : seg(p, 0.2508, 0.344);
    set('--iris', iris.toFixed(4));
    set('--fly', iris.toFixed(4));
    set('--mv', seg(p, 0.3297, 0.4443).toFixed(4));
    set('--gp', seg(p, 0.43, 0.473).toFixed(4));
    // akt 2 - ruch, ujęcie drugie „głębia”: ekran realizacji nadchodzi z prawej kilkoma obłokami (--rz), kamera leci
    // w głąb kolumnady (--fc = położenie kamery w krokach realizacji: dojazd -0,35 -> 0, postój przy każdej z trzech
    // realizacji, na końcu dolot do światła = 3,4 - tam leży kształt ekranu kontaktu)
    const rz = seg(p, 0.4767, 0.55);
    set('--rz', rz.toFixed(4));
    const fc = -0.35 + 0.35 * seg(p, 0.4833, 0.5533) + seg(p, 0.5733, 0.6233) + seg(p, 0.6433, 0.6933) + 1.4 * seg(p, 0.7133, 0.7833);
    set('--fc', fc.toFixed(4));
    // akt 3 - gest: ekran kontaktu staje pod realizacjami (zasłonięty), realizacje zbiegają się na kształcie z kręgów,
    // do którego właśnie doleciała kamera (kształt jest ten sam - bez dojazdu ekranu kontaktu, --o3 = 1);
    // kursor dotyka kształtu, fale
    const dusk = lin(p, 0.7333, 0.7367), out = seg(p, 0.7633, 0.85);
    set('--dusk', dusk.toFixed(3));
    set('--out', out.toFixed(4));
    set('--o3', '1');
    // WYDAJNOŚĆ (2026-10-05): ekrany makiety leżą jeden na drugim (kolejność w DOM: s1 < s3 < s2 < s4). Ekran, którego
    // nie widać, nie jest rysowany (data-v* = '0' -> visibility: hidden w CSS): maska zamknięta (oferta przy iris = 0,
    // kontakt przy dusk = 0, realizacje przy krycie 0) albo ekran w całości zasłonięty przez nieprzezroczysty ekran nad
    // nim z w pełni otwartą maską (pierwszy ekran pod ofertą przy iris = 1 i pod kontaktem przy dusk = 1). Przy w pełni
    // otwartej masce ('2') maska schodzi. Progi to dokładnie 0 i 1 tych samych liczb, które dostaje CSS - obraz bez zmian.
    const sv = (k: string, s: string) => { if (el.dataset[k] !== s) el.dataset[k] = s; };
    sv('v1', iris >= 1 || dusk >= 1 ? '0' : '1');
    sv('v2', iris <= 0 ? '0' : iris >= 1 ? '2' : '1');
    sv('v3', dusk <= 0 ? '0' : dusk >= 1 ? '2' : '1');
    sv('v4', rz <= 0 || out >= 1 ? '0' : rz >= 1 && out <= 0 ? '2' : '1');
    // wydajność (2026-10-06): maska obłoków wewnątrz ekranu realizacji jest potrzebna tylko, gdy ekran nadchodzi
    // (rz < 1); potem schodzi (CSS, data-m4) - w czasie lotu kamery zawartość ekranu zmienia się w każdej klatce
    sv('m4', rz >= 1 ? '0' : '1');
    set('--co', lin(p, 0.85, 0.8717).toFixed(3));
    set('--cur', seg(p, 0.85, 0.9073).toFixed(3));
    set('--k', Math.min(lin(p, 0.9073, 0.918), 1 - lin(p, 0.918, 0.936)).toFixed(3));
    set('--glow', seg(p, 0.9108, 0.9503).toFixed(3));
    set('--rip1', lin(p, 0.9145, 0.979).toFixed(3));
    set('--rip2', lin(p, 0.9323, 0.9967).toFixed(3));
    // nazwa ujęcia w pasku adresu (4: nastrój / ruch / głębia / gest); kroki pod kadrem zostają trzy (scenka Oferty) -
    // „Ruch płynnie prowadzi jego wzrok” obejmuje jazdę w bok i lot w głąb
    const state = p < 0.247 ? 0 : p < 0.478 ? 1 : p < 0.7633 ? 2 : 3;
    if (el.dataset.state !== String(state)) el.dataset.state = String(state);
    el.toggleAttribute('data-play', p > 0.9503);
    setSteps(steps.current, state === 3 ? 2 : state === 0 ? 0 : 1, [lin(p, 0.0287, 0.247), lin(p, 0.247, 0.7633), lin(p, 0.7633, 0.9713)]);
  }, !reduced);

  return (
    <section ref={ref} className="sm-a" data-state="0" data-still="">
      <div className="sm-a-stage">
        <div className="sm-a-in container mx-auto px-6">
          <div className="sm-a-copy">
            <ServiceHead t={t.head} locale={locale} align="start" />
          </div>
          <div className="sm-a-cam" aria-hidden="true">
            <div ref={frameRef} className="sm-a-frame sv-late" data-sky="scene" style={{ '--d': 1 } as CSSProperties}>
              <div className="sm-fr-rim">
                <div className="sm-fr-bar">
                  <span className="sm-fr-url"><i />{t.site.domain}</span>
                  <span className="sm-fr-state">{f.states.map((s, i) => <b key={s} data-s={i}>{s}</b>)}</span>
                  <span className="sm-fr-tag">{f.sample}</span>
                </div>
                <div className="sm-fr-port">
                  <div ref={viewRef} className="sm-fr-view">
                    <Site t={t.site} scene={hz} uid="f" />
                    <p className="sm-a-hint"><span className="sm-a-hint-m">{f.hint}</span><span className="sm-a-hint-t">{f.hintTouch}</span></p>
                  </div>
                </div>
              </div>
              <span className="sm-a-tag"><i />{t.site.domain}<span>·</span>{f.sample}</span>
            </div>
          </div>
          <div className="sm-a-steps">
            <Steps items={f.steps} label={f.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
