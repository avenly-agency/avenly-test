'use client';

import { useEffect, useRef, useSyncExternalStore, type RefObject } from 'react';
import type { CrmRole, SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import type { EyesCopy } from '@/lib/i18n/uslugi/system-crm-eyes';
import { useSeen } from '../../_usluga/shared';

// Wspólne części sekcji „Każdy widzi to, co powinien” (runda 3, style cr3- w eyes.css):
//   EyesHead - nagłówek sekcji w przypiętym ekranie (h2 z kropką w kolorze podstrony + opis), wejście przy pojawieniu,
//   RoleTag  - kto patrzy i co widzi: nazwa roli, osoba, jedna linia zakresu („cała firma”),
//   useFit   - obiekt sceny zawsze mieści się w wysokości pola (skala <= 1, wyśrodkowany w pionie),
//   useShort - ekran za niski na przypiętą scenę (telefon trzymany poziomo, bardzo niski telefon).

export const EyesHead = ({ id, x }: { id: string; x: EyesCopy }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.3);
  return (
    <div ref={ref} className="cr3-head">
      <h2 id={id} className="im-title sv-h2">{x.title}<span className="im-accent">.</span></h2>
      <p className="im-lead cr-sec-lead">{x.lead}</p>
    </div>
  );
};

export const RoleTag = ({ t, x, role, className }: { t: SystemCrmCopy; x: EyesCopy; role: CrmRole; className?: string }) => {
  const who = t.roles.roles.find((r) => r.id === role);
  return (
    <p className={className ? `cr3-tag ${className}` : 'cr3-tag'}>
      <b>{who?.label}</b>
      <span>{who?.who} · {x.sees[role]}</span>
    </p>
  );
};

/** Pisze na obiekcie --fit (skala) i --fy (przesunięcie w pionie), tak żeby mieścił się w polu `view`. */
export const useFit = (viewRef: RefObject<HTMLElement | null>, objRef: RefObject<HTMLElement | null>, on: boolean) => {
  useEffect(() => {
    const view = viewRef.current, obj = objRef.current;
    if (!view || !obj) return;
    if (!on) { obj.style.removeProperty('--fit'); obj.style.removeProperty('--fy'); return; }
    const fit = () => {
      const vh = view.clientHeight, oh = obj.offsetHeight;
      if (!vh || !oh) return;
      const s = Math.min(1, vh / oh);
      obj.style.setProperty('--fit', s.toFixed(4));
      obj.style.setProperty('--fy', `${Math.max(0, (vh - oh * s) / 2).toFixed(1)}px`);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(view); ro.observe(obj);
    return () => ro.disconnect();
  }, [viewRef, objRef, on]);
};

/** Najmniejsza wysokość ekranu (100svh), przy której scena jest przypięta: telefon (do 767 px szerokości - z rachunku
    wysokości okna sceny, skala >= ok. 0,97) i szersze ekrany. Poniżej: zwykły układ bez przypięcia, stan końcowy. */
const PIN_MIN_PHONE = 620, PIN_MIN_WIDE = 560;
let shortNow = false;
/** Mierzy 100svh sondą, a nie window.innerHeight: svh nie zmienia się, gdy telefon chowa pasek adresu, więc scena
    nie przełącza się między układami w trakcie przewijania (innerHeight i zapytania @media o wysokość się zmieniają). */
const readShort = () => {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return h > 0 && h < (window.innerWidth < 768 ? PIN_MIN_PHONE : PIN_MIN_WIDE);
};
const subShort = (cb: () => void) => {
  let raf = 0;
  const check = () => { raf = 0; const v = readShort(); if (v !== shortNow) { shortNow = v; cb(); } };
  const onResize = () => { if (!raf) raf = requestAnimationFrame(check); };
  shortNow = readShort();
  window.addEventListener('resize', onResize);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
};
/** true = ekran za niski na przypięcie (serwer i pierwszy render: false - przypięcie i tak jest tylko pod [data-live]). */
export const useShort = () => useSyncExternalStore(subShort, () => shortNow, () => false);
