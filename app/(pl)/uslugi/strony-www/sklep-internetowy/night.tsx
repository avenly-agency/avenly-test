'use client';

import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Moon, MousePointerClick, Sun } from 'lucide-react';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { Steps, setSteps } from '../../_usluga/parts';
import { lin, seg, usePin } from '../../_usluga/shared';
import { useCalm } from './calm';
import { Frame, PanelUI, zl, type PanelRow } from './store';

// SCENA 3 - „Gotowy na każdą skalę”: to samo, co klient zrobił w scenie 1, oczami WŁAŚCICIELA sklepu. Przypięta scena:
// nad panelem linia wymiarowa nocy (22:00 -> 8:00) ze znacznikiem godziny; przewijanie przesuwa zegar, a zamówienia
// wpadają do panelu o swoich godzinach („sklep sprzedaje także wtedy, gdy Ty odpoczywasz” - chwyt z Oferty). Panel
// jest w nocy przygaszony (nikt przy nim nie siedzi). Rano zasłona znika, a zamówienia po kolei przechodzą statusy
// Opłacone -> Spakowane -> Wysłane; licznik „Do wysłania” spada do zera.
// Elementy do kliknięcia: status każdego zamówienia to przycisk - odwiedzający może sam przestawić status.
// Tytuł i opis = sekcja „Gotowy na każdą skalę” z pierwotnej podstrony (bez porównania WooCommerce / Headless).
// Bez JS / ograniczony ruch: nagłówek, panel ze wszystkimi zamówieniami (statusy dalej klikalne), lista kroków.

/** Minuty od 22:00, o których wpadają zamówienia (wiersze od najnowszego). */
const ARRIVE = [485, 372, 216, 118, 47];
const NIGHT = 600; // 22:00 -> 8:00
const AMOUNTS = [141, 276, 94, 164, 226];
/** Liczniki panelu: „Nowe zamówienia” = te, które już wpadły (`all` = wszystkie - widok bez ruchu), „Do wysłania”. */
const counters = (el: HTMLElement, all: boolean) => {
  const fresh = Array.from(el.querySelectorAll<HTMLElement>('.sk-pn-row[data-new]'));
  const arrived = fresh.filter((r) => all || r.hasAttribute('data-in'));
  const a = String(arrived.length), b = String(arrived.filter((r) => r.dataset.st !== '2').length);
  const nw = el.querySelector<HTMLElement>('.sk-pn-stats [data-k="new"]'), sh = el.querySelector<HTMLElement>('.sk-pn-stats [data-k="ship"]');
  if (nw && nw.textContent !== a) nw.textContent = a;
  if (sh && sh.textContent !== b) sh.textContent = b;
};
const clock = (min: number) => {
  const m = (22 * 60 + Math.round(min)) % 1440;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
};

export const Night = ({ t }: { t: ShopCopy }) => {
  const reduced = useCalm();
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  /** Status ustawiony kliknięciem (-1 = brak, rządzi scena). */
  const manual = useRef<number[]>(ARRIVE.map(() => -1).concat([-1, -1]));
  const lastP = useRef(1);

  const rows = useMemo<PanelRow[]>(() => [
    ...ARRIVE.map((m, i): PanelRow => ({
      no: `#2026-00${47 - i}`, time: clock(m), who: t.panel.customers[i % t.panel.customers.length],
      ship: t.store.ship[i % 2 === 0 ? 1 : 0].name, amt: zl(AMOUNTS[i]), pay: t.store.pays[i === 1 ? 1 : 0], st: 0, fresh: true,
    })),
    { no: '#2026-0042', time: t.panel.older, who: t.panel.customers[0], ship: t.store.ship[1].name, amt: zl(141), pay: t.store.pays[0], st: 2 },
    { no: '#2026-0041', time: t.panel.older, who: t.panel.customers[1], ship: t.store.ship[0].name, amt: zl(164), pay: t.store.pays[1], st: 2 },
  ], [t]);

  useEffect(() => {
    const root = ref.current;
    if (root) steps.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    // blask mgławicy przy panelu tylko na komputerze (na telefonie rozjaśniał tło pod opisem nad panelem)
    const frame = root?.querySelector<HTMLElement>('.sk-n-frame');
    if (!frame) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const sky = () => { if (mq.matches) frame.setAttribute('data-sky', 'scene'); else frame.removeAttribute('data-sky'); };
    sky();
    mq.addEventListener('change', sky);
    return () => mq.removeEventListener('change', sky);
  }, []);

  const apply = useCallback((p: number, el: HTMLElement) => {
    lastP.current = p;
    const set = (k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
    // zegar nocy
    const n = lin(p, 0.04, 0.5);
    const min = n * NIGHT;
    set('--n', n.toFixed(4));
    set('--veil', (0.42 * (1 - seg(p, 0.46, 0.56))).toFixed(3));
    const now = el.querySelector<HTMLElement>('.sk-n-now b');
    const label = clock(min);
    if (now && now.textContent !== label) now.textContent = label;
    const day = min >= 480 ? '1' : '0';
    if (el.dataset.day !== day) el.dataset.day = day;
    // zamówienia wpadają o swoich godzinach; rano statusy po kolei (od najstarszego)
    el.querySelectorAll<HTMLElement>('.sk-pn-row[data-new]').forEach((row, i) => {
      row.toggleAttribute('data-in', min >= ARRIVE[i]);
      const k = ARRIVE.length - 1 - i;
      const auto = p >= 0.67 + k * 0.06 ? 2 : p >= 0.635 + k * 0.06 ? 1 : 0;
      const st = String(manual.current[i] >= 0 ? manual.current[i] : auto);
      if (row.dataset.st !== st) row.dataset.st = st;
    });
    counters(el, false);
    setSteps(steps.current, p < 0.5 ? 0 : p < 0.62 ? 1 : 2, [lin(p, 0.04, 0.5), lin(p, 0.5, 0.62), lin(p, 0.62, 0.94)]);
  }, []);

  usePin(pinRef, apply, !reduced);
  // spokojny tryb (ograniczony ruch / niski ekran): wszystkie zamówienia są na liście - liczniki liczą je wszystkie
  // (scena mogła zdążyć zapisać stan „przed nocą”, zanim tryb został rozpoznany)
  useEffect(() => { if (reduced && pinRef.current) counters(pinRef.current, true); }, [reduced]);

  const onStatus = (i: number) => {
    const el = pinRef.current;
    const row = el?.querySelector<HTMLElement>(`.sk-pn-row[data-row="${i}"]`);
    if (!el || !row) return;
    const next = (Number(row.dataset.st ?? 0) + 1) % 3;
    manual.current[i] = next;
    row.dataset.st = String(next);
    counters(el, reduced);
  };

  return (
    <section ref={ref} className="sk-n" aria-labelledby="sk-n-h">
      <div className="container mx-auto px-6 sk-n-head">
        <h2 id="sk-n-h" className="im-title sv-h2">{t.night.title} <span className="im-accent">{t.night.titleAccent}</span></h2>
        <p className="im-lead sk-n-lead">{t.night.lead}</p>
      </div>
      <div ref={pinRef} className="sk-n-pin" data-day="1">
        <div className="sk-n-stage">
          <div className="sk-n-in container mx-auto px-6">
            <div className="sk-n-ruler" aria-hidden="true">
              <span>{t.night.from}</span>
              <span className="sk-n-line">
                <i />
                <span className="sk-n-now"><Moon /><Sun /><b>{t.night.to}</b></span>
              </span>
              <span>{t.night.to}</span>
            </div>
            <div className="sk-n-frame">
              <Frame url={t.panel.domain} right={<span className="sk-n-hint"><MousePointerClick aria-hidden="true" />{t.night.hint}</span>}>
                <PanelUI t={t.panel} rows={rows} onStatus={onStatus} hint={t.night.hint} />
              </Frame>
            </div>
            <div className="sk-n-steps sk-narr" style={{ '--n': 3 } as CSSProperties}><Steps items={t.night.steps} label={t.night.stepsAria} /></div>
          </div>
        </div>
      </div>
    </section>
  );
};
