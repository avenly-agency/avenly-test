'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { Steps, setSteps } from '../../_usluga/parts';
import { clamp01, lin, seg, useFrame } from '../../_usluga/shared';
import { useCalm } from './calm';
import { ScreenShop, ShopProvider } from './store';

// SEKCJA „Nie szablon. Twoja marka.” - „NA TLE SZABLONÓW” (wybór właściciela 2026-10-02 z pięciu propozycji:
// „wybieram na tle szablonów, tylko dodaj motion, perspektywę i żeby było zajebiście”). Pozostałe propozycje
// (Zbliżenia, Warstwy, Zestaw marki, Suwak, wcześniej Trzy marki) są USUNIĘTE - nie przywracać bez prośby.
// Scena przypięta, ujęcie z kamerą w trzech taktach (jedno zdanie narratora naraz):
//   1. Plan ogólny: ściana identycznych sklepów z szablonu leży w perspektywie (pochylona jak makieta na stole,
//      gaśnie w dal), lekko pływa i przechyla się za kursorem. PRZY PRZEWIJANIU kafle żyją („w 1 daj przy scrollu
//      motion tych bazowych”): rzędy suną na przemian w lewo i w prawo jak taśmy, a od środka rozchodzi się fala
//      (kafle unoszą się i opadają). Ruch zaczyna się już przy wjeździe sekcji na ekran, przed przypięciem.
//   2. Środkowy sklep „ubiera się” w markę (szablon odjeżdża za linią światła) i UNOSI SIĘ nad ścianę (cień pod
//      spodem), reszta przygasa.
//   3. Kamera wlatuje w sklep marki: ściana prostuje się, szablony rozjeżdżają się poza ekran, sklep staje na wprost
//      i wypełnia kadr - na końcu jest ostry i da się w nim klikać.
// Szablony to lekkie kafle rysowane samym CSS (.sk-w-mini) - jest ich 98, więc bez drzewa DOM w środku.
// Bez JS / ograniczony ruch: nagłówek, kadr ze sklepem marki, lista zdań.

type T = ShopCopy;
const noop = () => {};
const setVar = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };

/** Ściana 11 × 9 bez środka (środek = sklep marki). Kafel: kolumna i rząd od środka, krycie w spoczynku (kafle gasną
    w dal), kierunek jazdy rzędu (środkowy stoi - w nim leży sklep marki), opóźnienie fali (odległość od środka). */
const TILES: { cx: number; cy: number; o: number; dir: number; d: number }[] = [];
for (let cy = -4; cy <= 4; cy++) {
  for (let cx = -5; cx <= 5; cx++) {
    if (!cx && !cy) continue;
    const dist = Math.hypot(cx * 0.27, cy * 0.29);
    // krycie w spoczynku (zapas bez hypot() w CSS): gaśnie w dal i ku dołowi ekranu, gdzie stoi zdanie narratora
    const sy = cy - 0.5 * cx, fall = Math.min(Math.max(0, Math.min(1, 1 - (sy - 0.4) * 0.65)), Math.max(0, Math.min(1, 1 + (sy + 1.5) * 0.3)));
    TILES.push({ cx, cy, o: +(Math.max(0, Math.min(1, 1.18 - dist * 0.78)) * fall).toFixed(3), dir: cy === 0 ? 0 : cy % 2 ? 1 : -1, d: +(Math.hypot(cx, cy) * 0.85).toFixed(2) });
  }
}

/** Narrator sceny: jedno zdanie naraz (.sk-narr), zmiana na granicach `at`, pasek zdania wypełnia się z postępem. */
const narr = (steps: HTMLElement[], p: number, at: number[]) => {
  let on = 0;
  for (let i = 1; i < at.length - 1; i++) if (p >= at[i]) on = i;
  setSteps(steps, on, steps.map((_, i) => lin(p, at[i], at[i + 1])));
};

export const BrandCrowd = ({ t }: { t: T }) => {
  const reduced = useCalm();
  const pinRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLElement | null>(null);
  const steps = useRef<HTMLElement[]>([]);

  // Postęp liczony w każdej klatce przewijania (nie usePin): ruch kafli zaczyna się już przy WJEŹDZIE sekcji na ekran
  // (e: 0 = góra sceny przy dole okna, 1 = scena przypięta), potem biegnie postęp przypiętej sceny p.
  useFrame((frac) => {
    const el = pinRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    const top = r.top - frac;
    if (top > vh * 1.3 || r.bottom - frac < -vh * 0.3) return; // poza ekranem: nic nie piszemy
    const e = clamp01(1 - top / vh);
    const p = clamp01(-top / Math.max(1, r.height - vh));
    const dress = seg(p, 0.2, 0.38), z = seg(p, 0.5, 0.93);
    setVar(el, '--dress', dress.toFixed(4));
    setVar(el, '--z', z.toFixed(4));
    // pochylenie ściany: pełne w planie ogólnym, prostuje się w locie kamery
    setVar(el, '--tilt', (1 - seg(p, 0.5, 0.9)).toFixed(4));
    // sklep marki unosi się nad ścianę, a przy dolocie kamery wraca na płaszczyznę (na końcu leży dokładnie w kadrze)
    setVar(el, '--lift', (dress * (1 - seg(p, 0.56, 0.9))).toFixed(4));
    // zmienne kafli piszemy na samej ścianie (.sk-w-wall - czytają je tylko kafle): zmieniają się co klatkę, a zapis
    // na całej scenie przeliczał też sklep marki, ramkę i podpisy (wydajność, 2026-10-05)
    const wall = (wallRef.current ??= el.querySelector<HTMLElement>('.sk-w-wall')) ?? el;
    // szablony przygasają, gdy sklep ubiera się w markę, i znikają przy dolocie kamery
    setVar(wall, '--wd', ((1 - dress * 0.55) * (1 - z * z)).toFixed(3));
    // RUCH KAFLI: jazda rzędów (w odstępach kafli - szybko w planie ogólnym, potem wolniej), faza fali, siła fali
    setVar(wall, '--gl', (e * 0.55 + lin(p, 0, 0.2) * 0.8 + lin(p, 0.2, 0.5) * 0.3).toFixed(4));
    setVar(wall, '--wv', (e * 3.2 + p * 27).toFixed(3));
    setVar(wall, '--am', ((1 - seg(p, 0.2, 0.36) * 0.6) * (1 - seg(p, 0.46, 0.6))).toFixed(3));
    narr(steps.current, p, [0.02, 0.27, 0.6, 0.98]);
  }, !reduced);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    steps.current = Array.from(el.querySelectorAll<HTMLElement>('.sv-step'));
    if (reduced) return;
    // pływanie ściany tylko, gdy scena jest na ekranie
    const io = new IntersectionObserver(([e]) => { el.toggleAttribute('data-vis', e.isIntersecting); });
    io.observe(el);
    // kursor przechyla ścianę (wygładzone; tylko mysz)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => io.disconnect();
    // zapis wprost na pływającej ścianie (zmienne nie dziedziczą - sklep.css): ruch myszy nie przelicza stylów całej sceny
    const float = el.querySelector<HTMLElement>('.sk-w-float') ?? el;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0;
    const tick = () => {
      raf = 0;
      x += (tx - x) * 0.07; y += (ty - y) * 0.07;
      setVar(float, '--sk-mx', x.toFixed(3)); setVar(float, '--sk-my', y.toFixed(3));
      if (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1; ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointermove', move, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); };
  }, [reduced]);

  return (
    <section className="sk-m sk-w" aria-labelledby="sk-m-h">
      <div className="container mx-auto px-6">
        <div className="sk-m-head">
          <h2 id="sk-m-h" className="im-title sv-h2">{t.brand.title} <span className="im-accent">{t.brand.titleAccent}</span></h2>
          <p className="im-lead sk-m-lead">{t.brand.lead}</p>
        </div>
      </div>
      <div ref={pinRef} className="sk-m-pin">
        <div className="sk-m-stage">
          <div className="sk-m-stage-in container mx-auto px-6">
            <div className="sk-m-cam">
              <div className="sk-w-float">
                <div className="sk-w-rig">
                  <div className="sk-w-wall" aria-hidden="true">
                    {TILES.map(({ cx, cy, o, dir, d }) => (
                      <i key={`${cx}:${cy}`} className="sk-w-tile sk-w-mini" style={{ '--cx': cx, '--cy': cy, '--o': o, '--dir': dir, '--d': d } as CSSProperties} />
                    ))}
                  </div>
                  <i className="sk-w-drop" aria-hidden="true" />
                  <div className="sk-w-me" data-sky="scene">
                    <div className="sk-fr-rim">
                      <div className="sk-fr-bar">
                        <span className="sk-fr-url"><i />{t.store.domain}</span>
                        <span className="sk-fr-tag">{t.store.sample}</span>
                      </div>
                      <div className="sk-fr-view">
                        <ShopProvider t={t.store} go={noop}><ScreenShop /></ShopProvider>
                        <i className="sk-w-cover sk-w-mini" aria-hidden="true" />
                        <i className="sk-w-beam" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sk-m-steps sk-narr" style={{ '--n': t.brand.crowd.length } as CSSProperties}>
              <Steps items={t.brand.crowd} label={t.brand.stepsAria} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
