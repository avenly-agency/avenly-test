'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { HeroPointsCopy } from '@/lib/i18n/uslugi/system-crm-hero-points';
import { ServiceHead, Steps, setSteps } from '../../_usluga/parts';
import { lin, usePin, useReducedPref } from '../../_usluga/shared';
import { BLOOM_TEXTURES } from './bloom-layers';
import { createField, type Beat, type Field, type FieldBox, type FieldDot, type FieldSeg } from './hero-points-field';
import { PointsSystem } from './hero-points-system';
import { offsetTo } from './scene';
import type { SceneProps, SceneVersion } from './types';
import { Win } from './ui';
import './hero-points.css'; // style sceny we własnym pliku (praca równoległa), prefiks cr1c-

// SCENA GŁÓWNA „Z PUNKTÓW” (WYBRANA przez właściciela 2026-10-04; „Porządek” i „Jedno okno” usunięte) - pierwszy
// ekran podstrony i jej przypięta scena, sterowana wyłącznie przewijaniem (nic do klikania). Pomysł wyrasta ze strony
// głównej Avenly: tam logotyp zbiera się z tysięcy cząstek, a usługi są konstelacją na niebie. Tu punkty-gwiazdy to
// dane firmy rozsypane po arkuszach, skrzynkach i głowach - a system zbiera je w jeden układ.
//   Pierwszy ekran  nagłówek podstrony, pod nim wielka chmura punktów z głębią (bliższe większe i jaśniejsze),
//                   wychodzi za krawędzie ekranu; gwiazdki w kolorze podstrony łączy cienka linia konstelacji.
//   Najazd kamery   nagłówek odjeżdża w górę i gaśnie, kamera wlatuje w chmurę (bliskie punkty uciekają za krawędzie
//                   szybciej niż dalekie), pojawia się narrator.
//   Zbieranie       punkty płyną łukami na swoje miejsca w pochylonej płaszczyźnie: najpierw kolumny tablicy,
//                   potem wiersze list, kafle kalendarza, karty i obrys okna; za punktami rysują się włosowe linie.
//                   Płaszczyzna prostuje się na wprost kamery.
//   Rozejście       prawdziwe okno systemu „Pracowni Dąb” odsłania się od lewej do prawej nierównym, miękkim
//                   czołem z kłębów - jak gaz mgławicy w tle (wspólna klasa .cr-bloom z system-crm.css, postęp --bloom).
//                   Punkty i linie układu gasną pod nim dopełnieniem tej samej maski (liczy płótno). Punkty stoją
//                   dokładnie na kropkach wierszy, inicjałach i narożnikach kart (cele z pomiaru DOM), więc kropka
//                   z płótna przechodzi w kropkę okna.
//   Finał           czyste okno systemu w skali 1; na kartach pojawiają się terminy (to samo rozejście, w małej skali).
// 2026-10-05, decyzja właściciela dla całej podstrony: „te wszystkie animacje linii, która leci i zmienia wireframe
// na coś (…) wywal i zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi” - dawna ukośna kurtyna
// z linią światła USUNIĘTA (NIE wracać do lecących linii ani przycięć prostą krawędzią).
// RUCH (2026-10-05, właściciel: „jak się scrolluje i gwiazdy się tak przesuwają (…) zrób bardziej premium i ładniej,
// bo tak clanky jest strasznie”): przewijanie podaje tylko CEL postępu (usePin -> field.seek). Płótno
// (hero-points-field.ts) ma jedną własną pętlę klatek: dochodzi do celu z bezwładnością (sprężyna krytycznie
// tłumiona), a z tego samego wygładzonego postępu woła `apply` - stąd idą --cam, --s, --bloom, --fin, data-far,
// data-bloomed i narrator, więc DOM i punkty zawsze pokazują ten sam stan. W spoczynku chmura żyje (wolne kołysanie
// kamery, mruganie gwiazd, ok. 30 kl./s) - tylko gdy scena jest na ekranie i zanim okno się rozejdzie. Stałe do
// strojenia: blok „STROJENIE RUCHU” w hero-points-field.ts. NIE wracać do rysowania wprost z postępu przewijania.
// Własna powłoka zamiast FilmShell: płótno leży na całym przyklejonym ekranie (poza kontenerem), a okno ma skalę
// kamery i rozejście wspólne z płótnem. Mechanika FilmShell przeniesiona: --copy-h, data-far, wejście .sv-late
// na elemencie wewnętrznym.
// Bez JS / ograniczony ruch: nagłówek, gotowe okno systemu i lista zdań narratora - bez płótna i bez przypięcia.
// TELEFON (2026-10-05, właściciel: „dostosuj całą podstronę do urządzeń mobilnych”; rachunek ekranów w komentarzach
// hero-points.css): scena jest przypięta tylko, gdy sekcja ma data-pin - ustawiany, gdy ekran jest dość wysoki
// (PIN_MIN_H, mierzone po 100svh, więc chowanie paska adresu niczego nie przełącza). Telefon poziomo i bardzo
// niskie ekrany dostają zwykły układ jak przy ograniczonym ruchu (`flat`). Pomiar celów nie przebudowuje chmury,
// gdy nic się nie zmieniło (`sig`). Krótsza bezwładność i mniej klatek w spoczynku na dotyku: hero-points-field.ts.

/** Długość drogi sceny w vh. */
const LEN = 360;
/** Narrator na osi postępu: początek paska pierwszego zdania, zmiany zdań, koniec paska ostatniego.
    Drugie zdanie wchodzi, gdy zbieranie już wyraźnie trwa; trzecie tuż przed rozejściem okna (oś: `beat` w hero-points-field.ts). */
const BOUNDS = [0.1, 0.32, 0.63, 0.96];
/** Zmienne pisane przez scenę na sekcji (czyszczone przy ograniczonym ruchu). */
const VARS = ['--copy-h', '--cam', '--s', '--bloom', '--fin'];
/** Bok, w którym płótno czyta tekstury kłębów „rozejścia” (kanał alfa) - miękka maska nie potrzebuje więcej. */
const MASK_N = 128;
/** Najniższy ekran (100svh), na którym scena jest przypięta. Niżej okno systemu i narrator nie mają jak się zmieścić
    (telefon poziomo, bardzo niski telefon albo okno przeglądarki) - wtedy zwykły układ bez przypięcia i bez płótna,
    jak przy ograniczonym ruchu. Rachunek: nawigacja 84 + najmniejsze okno + narrator 142 (168 poniżej 360 px
    szerokości); od 768 px okno jest w układzie komputera i potrzebuje więcej. */
const PIN_MIN_H = 550, PIN_MIN_H_NARROW = 580, PIN_MIN_H_WIDE = 590;

const HeroPoints = ({ t, x, locale }: SceneProps<HeroPointsCopy>) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const field = useRef<Field | null>(null);
  const stepEls = useRef<HTMLElement[]>([]);
  /** Ostatni cel postępu z przewijania (-1 = jeszcze nieznany). */
  const lastP = useRef(-1);
  /** Miara ekranu: szerokość sekcji × 100svh (nie zmienia się, gdy telefon chowa pasek adresu). */
  const probeRef = useRef<HTMLElement>(null);
  /** Ekran za niski na przypiętą scenę (patrz PIN_MIN_H). */
  const [short, setShort] = useState(false);
  /** Zwykły układ: scena w stanie końcowym, bez przypięcia i bez płótna. */
  const flat = reduced || short;

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    // obserwator zgłasza się od razu po podpięciu i przy każdej zmianie rozmiaru miary (obrót telefonu, zmiana okna)
    const ro = new ResizeObserver(() => {
      const w = probe.offsetWidth, h = probe.offsetHeight;
      if (w > 0 && h > 0) setShort(h < (w < 360 ? PIN_MIN_H_NARROW : w < 768 ? PIN_MIN_H : PIN_MIN_H_WIDE));
    });
    ro.observe(probe);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current, stage = stageRef.current, copy = copyRef.current, cam = camRef.current, canvas = canvasRef.current;
    if (!root || !stage || !copy || !cam || !canvas) return;
    stepEls.current = Array.from(root.querySelectorAll<HTMLElement>('.cr1c-narr .sv-step'));
    const win = cam.querySelector<HTMLElement>('.cr-win');
    if (flat) {
      // ograniczony ruch albo za niski ekran: zwykła sekcja ze sceną w stanie końcowym - bez płótna i bez śladów po scenie
      VARS.forEach((k) => root.style.removeProperty(k));
      root.removeAttribute('data-far');
      win?.removeAttribute('data-bloomed');
      win?.removeAttribute('data-veil');
      cam.style.removeProperty('transform');
      stepEls.current.forEach((li) => { li.removeAttribute('data-on'); li.style.removeProperty('--f'); });
      return;
    }
    if (!win) return;
    const sv = root.closest<HTMLElement>('.sv');
    const ac = (sv ? getComputedStyle(sv).getPropertyValue('--sv-ac') : '').trim().split(/[\s,]+/).map(Number);
    const accent: [number, number, number] = ac.length >= 3 && ac.slice(0, 3).every(Number.isFinite) ? [ac[0], ac[1], ac[2]] : [56, 189, 248];
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // Stan sceny w DOM dla WYGŁADZONEGO postępu (płótno woła to w tej samej klatce, w której rysuje ten sam stan -
    // punkty nie rozjeżdżają się z kropkami okna): nagłówek, skala i rozejście okna, finał, narrator.
    let scaleNow = '';
    const apply = (b: Beat, p: number) => {
      const set = (k: string, v: string) => { if (root.style.getPropertyValue(k) !== v) root.style.setProperty(k, v); };
      set('--cam', b.cam.toFixed(4));
      // nagłówek po odjeździe nie może łapać kliknięć nad sceną
      const far = b.cam > 0.5;
      if (root.hasAttribute('data-far') !== far) root.toggleAttribute('data-far', far);
      // okno: skala kamery (ta sama, którą płótno rzutuje punkty) i rozejście (ten sam postęp gasi układ na płótnie)
      // wydajność (2026-10-05): skala pisana wprost na elemencie kamery (jedyny, który ją czytał przez --s) - zmienna
      // na korzeniu sekcji przeliczała co klatkę style całej sceny przez prawie całą jej długość
      const sc = `scale(${b.s.toFixed(5)})`;
      if (sc !== scaleNow) { scaleNow = sc; cam.style.transform = sc; }
      set('--bloom', b.bloom.toFixed(4));
      // po rozejściu maska schodzi z okna (data-bloomed), przy powrocie wraca
      const done = b.bloom >= 1;
      if (win.hasAttribute('data-bloomed') !== done) win.toggleAttribute('data-bloomed', done);
      // przed rozejściem (--bloom = 0) okno jest w całości zamaskowane: nie rysujemy go wcale (data-veil w CSS) -
      // dawniej co klatkę rastrowało się od nowa pod maską, której i tak nie było widać
      const veil = b.bloom <= 0;
      if (win.hasAttribute('data-veil') !== veil) win.toggleAttribute('data-veil', veil);
      set('--fin', b.fin.toFixed(3));
      const steps = stepEls.current;
      const active = Math.min(steps.length - 1, p < BOUNDS[1] ? 0 : p < BOUNDS[2] ? 1 : 2);
      setSteps(steps, active, steps.map((_, i) => (i < 3 ? lin(p, BOUNDS[i], BOUNDS[i + 1]) : 0)));
    };

    const f = createField(canvas, apply);
    field.current = f;
    // ponowne utworzenie płótna (np. powrót z ograniczonego ruchu): stan dla znanego postępu od razu, bez dojazdu.
    // Przy pierwszym montażu postęp poda zaraz usePin - pierwszy cel płótno też przyjmuje bez dojazdu.
    if (lastP.current >= 0) f.seek(lastP.current, true);
    let dead = false, frame = 0;

    // Tekstury kłębów „rozejścia” - TE SAME, którymi CSS maskuje okno (zmienne --cr-bloom-* z bloom.css): płótno gasi
    // układ z punktów dopełnieniem tej samej maski, więc szkielet znika dokładnie pod kłębami, którymi wchodzi okno.
    const cs = getComputedStyle(root);
    const sources = BLOOM_TEXTURES.map((k) => cs.getPropertyValue(k).trim().replace(/^url\(\s*(['"]?)(.*)\1\s*\)$/, '$2'));
    if (sources.every(Boolean)) {
      const load = (src: string) => new Promise<HTMLImageElement>((ok, fail) => {
        const im = new Image();
        im.onload = () => ok(im);
        im.onerror = () => fail(new Error('bloom'));
        im.src = src;
      });
      Promise.all(sources.map(load)).then((imgs) => {
        if (dead) return;
        const c = document.createElement('canvas');
        c.width = MASK_N; c.height = MASK_N;
        const g = c.getContext('2d', { willReadFrequently: true });
        if (!g) return;
        const maps = imgs.map((im) => {
          g.clearRect(0, 0, MASK_N, MASK_N);
          g.drawImage(im, 0, 0, MASK_N, MASK_N);
          const d = g.getImageData(0, 0, MASK_N, MASK_N).data;
          const a = new Uint8Array(MASK_N * MASK_N);
          for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
          return a;
        });
        f.setMask(maps, MASK_N);
        f.refresh();
      }).catch(() => { /* bez tekstur płótno gasi układ równym, miękkim czołem */ });
    }

    // Pomiar w układzie (offsetTo - bez przekształceń kamery): okno, nagłówek i oznaczone części systemu -> cele punktów.
    // Chmura jest przebudowywana tylko, gdy zmieniło się coś, od czego zależy (rozmiar sceny, okno, nagłówek) -
    // scena ma 100svh, więc samo schowanie paska adresu na telefonie niczego nie przelicza.
    let sig = '', force = true;
    const measure = () => {
      frame = 0;
      if (dead) return;
      root.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
      const W = stage.clientWidth, H = stage.clientHeight;
      const wr = offsetTo(win, stage);
      if (W < 40 || H < 40 || wr.w < 40 || wr.h < 40) return;
      const hr = offsetTo(copy, stage);
      const now = [W, H, wr.x, wr.y, wr.w, wr.h, hr.y + hr.h].join('|');
      if (!force && now === sig) return;
      sig = now; force = false;
      // tylko to, co naprawdę widać w oknie (na telefonie część kolumn tablicy wychodzi poza okno)
      const inside = (r: { x: number; y: number; w: number; h: number }) => r.w > 0 && r.h > 0
        && r.x >= wr.x - 1 && r.y >= wr.y - 1 && r.x + r.w <= wr.x + wr.w + 1 && r.y + r.h <= wr.y + wr.h + 1;
      const radius = (el: HTMLElement) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const boxes: FieldBox[] = [{ ...wr, r: radius(win), g: 4 }];
      const segs: FieldSeg[] = [];
      const dots: FieldDot[] = [];
      const bar = win.querySelector<HTMLElement>('.cr-win-bar');
      if (bar) {
        const r = offsetTo(bar, stage);
        segs.push({ x1: r.x, y1: r.y + r.h - 0.5, x2: r.x + r.w, y2: r.y + r.h - 0.5, g: 4, acc: false });
      }
      win.querySelectorAll<HTMLElement>('[data-pt]').forEach((el) => {
        const r = offsetTo(el, stage);
        if (!inside(r)) return;
        const g = Number(el.dataset.g) || 0, kind = el.dataset.pt;
        if (kind === 'box') boxes.push({ ...r, r: radius(el), g });
        else if (kind === 'line') {
          const acc = el.hasAttribute('data-acc'), y = r.y + r.h - (acc ? 1 : 0.5);
          segs.push({ x1: r.x, y1: y, x2: r.x + r.w, y2: y, g, acc });
        } else if (kind === 'vline') segs.push({ x1: r.x + 0.5, y1: r.y, x2: r.x + 0.5, y2: r.y + r.h, g, acc: false });
        else if (kind === 'dot') dots.push({ x: r.x + r.w / 2, y: r.y + r.h / 2, r: Math.min(r.w, r.h) / 2, g });
        else if (kind === 'mark') dots.push({ x: r.x + r.w / 2, y: r.y + r.h / 2, r: 2.2, g });
      });
      f.setLayout({ W, H, win: wr, head: hr.y + hr.h, boxes, segs, dots, phone: W < 768, coarse, accent });
      f.refresh();
    };
    const kick = () => { if (!frame && !dead) frame = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(kick);
    ro.observe(stage); ro.observe(win); ro.observe(copy);
    // po wczytaniu pisma napisy w oknie mogą się przesunąć bez zmiany jego rozmiaru - wtedy pomiar zawsze
    document.fonts?.ready.then(() => { force = true; kick(); }).catch(() => {});
    kick();

    // pętla wejścia rysuje tylko, gdy scena jest na ekranie
    const io = new IntersectionObserver(([e]) => f.setVisible(e.isIntersecting), { rootMargin: '120px 0px' });
    io.observe(stage);

    // wejście chmury razem ze sceną podstrony (data-on na korzeniu .sv - po tle i po tekście)
    let mo: MutationObserver | null = null;
    const start = () => {
      if (sv && !sv.hasAttribute('data-on')) return;
      f.intro();
      mo?.disconnect();
    };
    if (sv) {
      mo = new MutationObserver(start);
      mo.observe(sv, { attributes: true, attributeFilter: ['data-on'] });
    }
    start();

    return () => {
      dead = true;
      cancelAnimationFrame(frame);
      ro.disconnect(); io.disconnect(); mo?.disconnect();
      f.destroy();
      field.current = null;
    };
  }, [flat]);

  // Przewijanie podaje tylko CEL postępu. Do celu scena dochodzi z bezwładnością we własnej pętli klatek płótna,
  // a DOM (apply wyżej) i rysunek idą z tego samego, wygładzonego postępu.
  usePin(ref, (p) => {
    lastP.current = p;
    field.current?.seek(p);
  }, !flat);

  return (
    // data-pin = scena jest przypięta (reguły przypięcia w hero-points.css wymagają .sv[data-live] ORAZ data-pin)
    <section ref={ref} className="cr1c" data-pin={flat ? undefined : ''} style={{ '--len': LEN } as CSSProperties} aria-labelledby="sv-h1">
      <i ref={probeRef} className="cr1c-probe" aria-hidden="true" />
      <div ref={stageRef} className="cr1c-stage">
        <canvas ref={canvasRef} className="cr1c-field" aria-hidden="true" />
        <div className="container mx-auto px-6 cr1c-in">
          <div ref={copyRef} className="cr1c-copy">
            <ServiceHead t={t.head} locale={locale} align="start" />
          </div>
          <div className="cr1c-obj">
            <div className="cr1c-obj-in sv-late">
              <div ref={camRef} className="cr1c-wincam">
                <Win app={t.app} className="cr1c-win cr-bloom">
                  <PointsSystem t={t} x={x} />
                </Win>
              </div>
            </div>
          </div>
          {/* .cr-narr (jedno zdanie naraz) tylko w przypiętej scenie - w zwykłym układzie zdania są listą */}
          <div className={flat ? 'cr1c-narr' : 'cr1c-narr cr-narr'} style={{ '--n': x.steps.length } as CSSProperties}>
            <Steps items={x.steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const heroPoints: SceneVersion<HeroPointsCopy> = { id: 'punkty', label: 'Z punktów', Scene: HeroPoints };
