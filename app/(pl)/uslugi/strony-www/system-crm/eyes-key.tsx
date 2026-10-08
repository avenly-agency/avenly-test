'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Key } from 'lucide-react';
import type { CrmRole } from '@/lib/i18n/uslugi/system-crm';
import type { EyesCopy } from '@/lib/i18n/uslugi/system-crm-eyes';
import { Steps, setSteps } from '../../_usluga/parts';
import { clamp01, lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { EyesHead, RoleTag, useFit, useShort } from './eyes-ui';
import { RoleBody } from './roles';
import type { SceneProps } from './types';
import { Win } from './ui';
import './eyes.css'; // style sekcji we własnym pliku (praca równoległa), prefiks cr3-

// SEKCJA „KAŻDY WIDZI TO, CO POWINIEN” (punkt Oferty) - „KLUCZ”, wersja WYBRANA przez właściciela 2026-10-04
// („Trzy okna” i „Tryptyk” usunięte). Przypięta, sterowana przewijaniem. Jedno okno, cztery ujęcia: właściciel
// -> biuro -> pracownik -> znów właściciel. Rola jest KLUCZEM: biała płytka z kluczem przesuwa się po szynie ról
// (prawdziwy ruch - przycięcie drugiej warstwy napisów), a gdy siądzie w gnieździe, widok następnej roli ROZCHODZI
// SIĘ, a poprzedni znika w tym samym miejscu jego dopełnieniem.
// DECYZJA WŁAŚCICIELA 2026-10-05 (cała podstrona): „te wszystkie animacje linii, która leci i zmienia (…) coś na coś,
// coś się pojawia - wywal i zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi”. Dlatego BEZ kurtyny,
// przycięć prostą krawędzią i lecących linii (także pod modułami) - NIE przywracać. Podmianę widoków robią wspólne
// klasy „rozejścia” (bloom.css): .cr-bloom (wchodzi) i .cr-bloom-out (schodzi) - oba widoki leżą w tym samym
// prostokącie i dostają ten sam --bloom, więc warstwy się nie sumują. Klasy, --bloom i data-bloomed pisze scena
// wprost w DOM (widok środkowy najpierw wchodzi, potem schodzi - w danej chwili ma jedną rolę).
// ZOSTAJE prawdziwy ruch: płytka klucza, pałąki kłódek opadające po kolei (--lk na każdym module; stan modułu
// otwarty / zamknięty zmienia się razem z kłódką), bęben licznika „6 z 6 otwarte”, znacznik bieżącego modułu.
// Role to WYŁĄCZNIE ludzie z firmy: właściciel -> biuro -> pracownik -> znów właściciel (właściciel 2026-10-05:
// widok klienta na własne zlecenie to nie jest coś, co można obiecać w każdym systemie - NIE wracać do roli klienta).
// Dostęp maleje z każdą rolą (6, 4, 2 otwarte moduły). W ujęciu pracownika montaż odhacza się sam (TICK),
// u właściciela zmieniły się liczby, a kłódki znów się otwierają.
// TELEFON (właściciel 2026-10-05: „dostosuj całą podstronę do urządzeń mobilnych”): ta sama scena, ale okno pokazuje
// mniej i większe - o tym, co się mieści, decyduje wysokość przypiętego ekranu (100svh, zapytania @container
// w eyes.css). SCENA STOI (`still`): ograniczony ruch albo ekran za niski na przypięcie (telefon poziomo, bardzo
// niski telefon - useShort). Wtedy sekcja nie ma atrybutu data-pin: zwykły układ, trzy widoki jeden pod drugim
// w stanie końcowym, bez klas rozejścia i zmiennych sceny. Tak samo bez JS.

const SHOTS: { role: CrmRole; done: boolean | null }[] = [
  { role: 'owner', done: false },
  { role: 'office', done: null }, // w scenie przed odhaczeniem; gdy scena stoi (bez JS, ograniczony ruch) - stan końcowy
  { role: 'staff', done: null },
  { role: 'owner', done: true },
];
/** Oś sceny p: przesunięcia klucza, rozejścia kolejnych widoków (przebieg łagodny - wolny start i koniec),
    chwila odhaczenia montażu, progi narratora. */
const KEYS: [number, number][] = [[0.1, 0.19], [0.42, 0.51], [0.71, 0.83]];
const BLOOMS: [number, number][] = [[0.18, 0.3], [0.5, 0.62], [0.82, 0.93]]; // start, gdy klucz siada w gnieździe (KEYS)
const TICK = 0.66;
const CUTS = [0.2, 0.52, 0.84];
/** Moduły (indeksy w `roles.modules`) zamykane przy pierwszej i przy drugiej zmianie widoku; trzecia otwiera wszystkie. */
const SHUT1 = [4, 5], SHUT2 = [0, 2];

/** Ustawia widok jako wchodzący (.cr-bloom) albo schodzący (.cr-bloom-out) z postępem `v`. Pisze tylko przy zmianie.
    data-bloomed = koniec: wchodzący bez maski, schodzący schowany. */
const bloomTo = (el: HTMLElement, out: boolean, v: number) => {
  const c = el.classList;
  if (!c.contains(out ? 'cr-bloom-out' : 'cr-bloom')) {
    c.remove(out ? 'cr-bloom' : 'cr-bloom-out');
    c.add(out ? 'cr-bloom-out' : 'cr-bloom');
  }
  const s = v.toFixed(4);
  if (el.style.getPropertyValue('--bloom') !== s) el.style.setProperty('--bloom', s);
  const done = v >= 0.999;
  if (el.hasAttribute('data-bloomed') !== done) el.toggleAttribute('data-bloomed', done);
  // wydajność (2026-10-05): widok, który jeszcze nie zaczął wchodzić (--bloom = 0), jest w całości zamaskowany - nie
  // rysujemy go (data-veil -> visibility: hidden w eyes.css); cztery widoki leżą w tym samym prostokącie
  const veil = !out && v <= 0;
  if (el.hasAttribute('data-veil') !== veil) el.toggleAttribute('data-veil', veil);
};

const LockIcon = () => (
  <svg className="cr3-lock" viewBox="0 0 16 16" aria-hidden="true">
    <path className="cr3-lock-sh" d="M5 7.5V5a3 3 0 0 1 6 0v2.5" />
    <rect x="3" y="7.5" width="10" height="7" rx="1.6" />
  </svg>
);

export const EyesKey = ({ t, x, headId }: SceneProps<EyesCopy>) => {
  const r = t.roles;
  const reduced = useReducedPref();
  const short = useShort();
  /** Scena stoi: zwykła sekcja w stanie końcowym (warunek odwrotny do atrybutu data-pin, pod którym są reguły sceny). */
  const still = reduced || short;
  const ref = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const stepEls = useRef<HTMLElement[]>([]);
  const mods = useRef<HTMLElement[]>([]);
  const layers = useRef<HTMLElement[]>([]);
  /** Montaż odhaczony. Start = stan końcowy (bez JS widoki są już „po”). */
  const [ticked, setTicked] = useState(true);
  const tickedRef = useRef(true);
  const steps = t.film.roles;
  const total = r.modules.length;
  const counts = [total, total - SHUT1.length, total - SHUT1.length - SHUT2.length, total];

  const frame = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    const set = (k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
    const w = BLOOMS.map(([a, e]) => seg(p, a, e));
    // klucz: gniazdo 0 (właściciel) -> 1 (biuro) -> 2 (pracownik) -> wraca do 0
    set('--k', (seg(p, KEYS[0][0], KEYS[0][1]) + seg(p, KEYS[1][0], KEYS[1][1]) - 2 * seg(p, KEYS[2][0], KEYS[2][1])).toFixed(4));
    set('--cn', (w[0] + w[1] + w[2]).toFixed(4));
    set('--cur', (w[0] - w[2]).toFixed(4));
    // widoki: widok k wchodzi przy zmianie k (postęp w[k - 1]) i schodzi przy zmianie k + 1 (postęp w[k]); para
    // wchodzący / schodzący dostaje ten sam postęp
    layers.current.forEach((layer, k) => {
      const out = k < w.length && w[k] > 0;
      bloomTo(layer, out, out ? w[k] : k === 0 ? 1 : w[k - 1]);
    });
    // kłódki: zamykają się po kolei razem ze zmianą widoku, przy trzeciej zmianie otwierają
    mods.current.forEach((li, i) => {
      const j1 = SHUT1.indexOf(i), j2 = SHUT2.indexOf(i);
      const shut = j1 >= 0 ? clamp01((w[0] - j1 * 0.18) / 0.5) : j2 >= 0 ? clamp01((w[1] - j2 * 0.22) / 0.5) : 0;
      const raw = clamp01(shut - clamp01((w[2] - i * 0.08) / 0.5));
      const v = (raw * raw * (3 - 2 * raw)).toFixed(3);
      if (li.style.getPropertyValue('--lk') !== v) li.style.setProperty('--lk', v);
      const off = raw > 0.5;
      if (li.hasAttribute('data-shut') !== off) li.toggleAttribute('data-shut', off);
    });
    const now = p > TICK;
    if (now !== tickedRef.current) { tickedRef.current = now; setTicked(now); }
    let active = 0;
    while (active < CUTS.length && p >= CUTS[active]) active++;
    setSteps(stepEls.current, active, steps.map((_, i) => lin(p, i === 0 ? 0 : CUTS[i - 1], i < CUTS.length ? CUTS[i] : 1)));
  }, [steps]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    stepEls.current = Array.from(root.querySelectorAll<HTMLElement>('.cr3-narr .sv-step'));
    mods.current = Array.from(root.querySelectorAll<HTMLElement>('.cr3-b-mod'));
    layers.current = Array.from(root.querySelectorAll<HTMLElement>('.cr3-b-layer'));
    if (!still) return;
    // scena stoi: bez zmiennych, klas rozejścia i stanów zapisanych przez scenę (widoki jeden pod drugim, całe)
    ['--k', '--cn', '--cur'].forEach((k) => root.style.removeProperty(k));
    mods.current.forEach((li) => { li.style.removeProperty('--lk'); li.removeAttribute('data-shut'); });
    layers.current.forEach((layer) => {
      layer.classList.remove('cr-bloom', 'cr-bloom-out');
      layer.removeAttribute('data-bloomed');
      layer.removeAttribute('data-veil');
      layer.style.removeProperty('--bloom');
    });
  }, [still]);

  useFit(viewRef, objRef, !still);
  usePin(ref, frame, !still);

  return (
    <section
      ref={ref}
      className="cr3-pin cr3-b"
      data-pin={still ? undefined : ''}
      style={{ '--len': 300 } as CSSProperties}
      aria-labelledby={headId}
    >
      <div className="cr3-stage">
        <div className="container mx-auto px-6 cr3-in">
          <EyesHead id={headId} x={x} />
          <div ref={viewRef} className="cr3-fitview">
            <div ref={objRef} className="cr3-b-obj">
              <Win app={t.app}>
                {/* szyna ról: dwie identyczne warstwy napisów - jasna i „klucz” (biała płytka przycięta do gniazda) */}
                <div className="cr3-b-rail" aria-hidden="true">
                  {[false, true].map((key) => (
                    <div key={key ? 'key' : 'base'} className={key ? 'cr3-b-slots cr3-b-key' : 'cr3-b-slots'}>
                      {r.roles.map((who) => (
                        <span key={who.id} className="cr3-b-slot">
                          <b>{who.label}</b>
                          <span>{who.who}</span>
                          {key && <Key />}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="cr3-b-body">
                  <div className="cr3-b-mods" aria-hidden="true">
                    <p className="cr3-b-count">
                      <span className="cr3-b-reel"><span>{counts.map((c, i) => <span key={i}>{c}</span>)}</span></span>
                      {' '}{x.key.of} {total} {x.key.open}
                    </p>
                    <ul className="cr3-b-list">
                      <li className="cr3-b-cur" />
                      {r.modules.map((mod) => (
                        <li key={mod} className="cr3-b-mod"><span>{mod}</span><LockIcon /></li>
                      ))}
                    </ul>
                  </div>
                  {/* cztery widoki w jednym polu; klasy rozejścia (.cr-bloom / .cr-bloom-out) dopisuje scena */}
                  <div className="cr3-b-views">
                    {SHOTS.map((shot, k) => (
                      <div key={k} className="cr3-b-layer" data-k={k}>
                        <RoleTag t={t} x={x} role={shot.role} />
                        <RoleBody t={t} role={shot.role} done={shot.done ?? (ticked || still)} />
                      </div>
                    ))}
                  </div>
                </div>
              </Win>
            </div>
          </div>
          <div className="cr-narr cr3-narr" style={{ '--n': steps.length } as CSSProperties}>
            <Steps items={steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
