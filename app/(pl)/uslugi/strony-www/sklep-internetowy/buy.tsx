'use client';

import { useCallback, useEffect, useMemo, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useLenis } from 'lenis/react';
import { Check, CreditCard, LayoutList, Lock, MousePointerClick, Package, ShoppingBag, ShoppingCart, Truck } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { ServiceHead, Steps, setSteps } from '../../_usluga/parts';
import { Sketch } from '../../_usluga/sketch';
import { lin, seg, usePin, useSeen } from '../../_usluga/shared';
import { useCalm } from './calm';
import { Product } from './products';
import { Frame, FrameUrl, ORDER_NO, PanelUI, ScreenCart, ScreenDone, ScreenGate, ScreenPay, ScreenShop, ShopProvider, useShop, zl, type PanelRow } from './store';

// SCENA 1 - ZAKUP (pierwszy ekran + przypięta scena). Oś „sprzedaż”: w kadrze dzieje się TRANSAKCJA - produkt wpada
// do koszyka, klient wybiera dostawę, sklep przekierowuje go do operatora płatności (Przelewy24 / Stripe), tam wpisuje
// kod BLIK, wraca do sklepu z potwierdzeniem, paczka rusza, u właściciela pojawia się zamówienie.
// Wyróżnik podstrony: sklep w kadrze DA SIĘ KLIKNĄĆ. Wariant, rozmiar, ilość, dostawa i płatność zmieniają się od razu
// (stan w ShopProvider), a przyciski sklepu („Do koszyka”, „Przejdź do kasy”, „Zapłać”, „Płacę”) przewijają film do
// następnego aktu - odwiedzający może przejść zakup przewijaniem albo klikaniem.
// Trzy sceny do wyboru (przełącznik w panelu na dole ekranu, tylko dev):
//   BuyFrame („Witryna”)    - jeden duży kadr przeglądarki za krawędź ekranu, najazd kamery, ekrany sklepu zmieniają
//                             się w kadrze (koszyk wysuwa się z boku, kasa wjeżdża, strona operatora wjeżdża od dołu
//                             i zmienia adres w pasku), produkt leci do koszyka, z kadru wyskakuje powiadomienie
//                             właściciela. Szkic sklepu tylko jako obraz.
//   BuyDuo („Dwa ekrany”)   - telefon klienta i panel właściciela obok siebie: zakup dzieje się w telefonie, a w chwili
//                             zapłaty światło biegnie do panelu i wpada tam zamówienie ze statusem.
//   BuyStrip („Taśma”)      - ścieżka zakupu jako rząd sześciu ekranów (produkt, koszyk, dostawa, płatność, paczka,
//                             panel): kamera jedzie w bok, po linii wymiarowej nad ekranami jedzie znacznik zamówienia.
// Podpisy kroków = scenka sklepu z Oferty na stronie głównej (zaakceptowane 2026-09-28).
// Bez JS / ograniczony ruch: nagłówek, kadr ze sklepem (klikanie przełącza ekrany bez ruchu), lista kroków.

type T = ShopCopy;
type Props = { t: T; locale: Locale };

const setVar = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
const n3 = (v: number) => v.toFixed(3);
/** Okno 0-1-0: rośnie na a-b, gaśnie na c-d. */
const win = (p: number, a: number, b: number, c: number, d: number) => Math.min(lin(p, a, b), 1 - lin(p, c, d));

/** Akt -> które ekrany sklepu są aktywne (reszta `inert`: bez fokusu i kliknięć). */
const setAct = (root: HTMLElement, act: number) => {
  const v = String(act);
  if (root.dataset.act === v) return;
  root.dataset.act = v;
  root.querySelectorAll<HTMLElement>('[data-layers] [data-screen]').forEach((s) => { s.inert = s.dataset.screen !== v; });
};

/** `go(akt)`: przycisk sklepu przewija film do aktu (`marks` = postęp sceny dla aktów 0-4). Bez przypięcia
    (ograniczony ruch): przełącza ekran od razu. */
const useGo = (ref: RefObject<HTMLElement | null>, marks: number[], reduced: boolean) => {
  const lenis = useLenis();
  return useCallback((act: number) => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { setAct(el, act); return; }
    const r = el.getBoundingClientRect();
    const y = r.top + window.scrollY + (r.height - window.innerHeight) * marks[act];
    const far = Math.abs(y - window.scrollY) / window.innerHeight;
    if (lenis) lenis.scrollTo(y, { duration: Math.min(2.4, 0.9 + far * 0.7), easing: (x: number) => 1 - Math.pow(1 - x, 3) });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }, [ref, marks, reduced, lenis]);
};

/** Położenie elementu z układu (offsetLeft / offsetTop) względem przodka - bez przekształceń sceny. */
const offsetIn = (el: HTMLElement, root: HTMLElement) => {
  let x = 0, y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

/** Lot produktu do koszyka: start = produkt na scenie, cel = koszyk w nawigacji sklepu (zmienne --fx0.. na oknie). */
const useFly = (viewRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const measure = () => {
      const stage = view.querySelector<HTMLElement>('.sk-st--shop .sk-st-stage');
      const to = view.querySelector<HTMLElement>('.sk-st--shop .sk-st-cart');
      if (!stage || !to) return;
      const a = offsetIn(stage, view), b = offsetIn(to, view);
      // produkt stoi w scenie: wysokość 62% sceny, dół na 21% od dołu (jak .sk-st-hero w sklep.css)
      const h = a.h * 0.62, cx = a.x + a.w / 2, cy = a.y + a.h * (1 - 0.21) - h / 2;
      view.style.setProperty('--fx0', `${cx.toFixed(1)}px`);
      view.style.setProperty('--fy0', `${cy.toFixed(1)}px`);
      view.style.setProperty('--fh0', `${h.toFixed(1)}px`);
      view.style.setProperty('--fdx', `${(b.x + b.w / 2 - cx).toFixed(1)}px`);
      view.style.setProperty('--fdy', `${(b.y + b.h / 2 - cy).toFixed(1)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    return () => ro.disconnect();
  }, [viewRef]);
};

/** Warstwy sklepu w jednym oknie (Witryna, telefon w Dwóch ekranach): sklep, koszyk (szuflada / arkusz), kasa,
    strona operatora płatności, potwierdzenie, lecący produkt. Położenia warstw = zmienne CSS sceny. */
const StoreLayers = ({ pageRef, sketch }: { pageRef?: RefObject<HTMLDivElement | null>; sketch?: ReactNode }) => {
  const { c } = useShop();
  return (
    <>
      {sketch}
      <div className="sk-ly" data-layers="">
        <div className="sk-ly-base">
          <ScreenShop pageRef={pageRef} />
          <i className="sk-ly-beam" aria-hidden="true" />
        </div>
        <i className="sk-ly-dim" aria-hidden="true" />
        <div className="sk-ly-drawer"><ScreenCart /></div>
        <div className="sk-ly-full sk-ly-full--pay"><ScreenPay /><i className="sk-ly-load" aria-hidden="true" /></div>
        <div className="sk-ly-full sk-ly-full--done"><ScreenDone /></div>
        <div className="sk-ly-full sk-ly-full--gate"><ScreenGate /></div>
        <span className="sk-fly" aria-hidden="true"><Product brand={c.brand} /></span>
      </div>
    </>
  );
};

/** Zmienne zakupu wspólne dla Witryny i Dwóch ekranów (ta sama kolejność zdarzeń w jednym oknie). Zwraca akt 0-4. */
const writeBuy = (p: number, el: HTMLElement) => {
  const set = (k: string, v: string) => setVar(el, k, v);
  // akt 0: kursor -> „Do koszyka”, klik, produkt leci do koszyka, licznik podskakuje; na ten czas wszystko poza
  // produktem, przyciskiem i koszykiem przygasa (--sp: wzrok ma jedno miejsce akcji)
  set('--sp', n3(win(p, 0.125, 0.165, 0.27, 0.292)));
  set('--co1', n3(win(p, 0.14, 0.158, 0.232, 0.25)));
  set('--cx1', n3(seg(p, 0.14, 0.2)));
  set('--ck1', n3(win(p, 0.2, 0.21, 0.21, 0.228)));
  const fly = seg(p, 0.215, 0.288);
  set('--fly', fly.toFixed(4));
  set('--flyy', (fly - Math.sin(Math.PI * fly) * 0.5).toFixed(4));
  set('--flyo', p > 0.215 && p < 0.289 ? '1' : '0');
  set('--in', n3(lin(p, 0.208, 0.224)));
  set('--cnt', p < 0.283 ? '0' : (1 + 0.45 * (1 - lin(p, 0.283, 0.325))).toFixed(3));
  // akt 1: koszyk wysuwa się, kursor -> „Przejdź do kasy”
  set('--dr', n3(seg(p, 0.292, 0.362)));
  set('--co2', n3(win(p, 0.375, 0.393, 0.455, 0.47)));
  set('--cx2', n3(seg(p, 0.375, 0.43)));
  set('--ck2', n3(win(p, 0.43, 0.44, 0.44, 0.456)));
  // akt 2: kasa (dostawa, metoda płatności), kursor -> „Zapłać”
  set('--pay', n3(seg(p, 0.452, 0.522)));
  set('--co3', n3(win(p, 0.545, 0.563, 0.628, 0.642)));
  set('--cx3', n3(seg(p, 0.545, 0.6)));
  set('--ck3', n3(win(p, 0.6, 0.61, 0.61, 0.626)));
  // akt 3: przekierowanie do operatora - pasek ładowania, strona operatora wjeżdża od dołu, kod BLIK, „Płacę”
  set('--load', n3(lin(p, 0.612, 0.655)));
  const gt = seg(p, 0.645, 0.71);
  set('--gt', n3(gt));
  set('--dn0', gt > 0.999 ? '1' : '0');
  set('--b', (lin(p, 0.725, 0.8) * 6).toFixed(2));
  set('--co4', n3(win(p, 0.805, 0.822, 0.872, 0.886)));
  set('--cx4', n3(seg(p, 0.805, 0.85)));
  set('--ck4', n3(win(p, 0.85, 0.858, 0.858, 0.872)));
  set('--paid', n3(lin(p, 0.858, 0.874)));
  set('--ret', n3(lin(p, 0.872, 0.908)));
  // akt 4: powrót do sklepu - strona operatora zjeżdża, pod nią potwierdzenie; paczka rusza
  set('--dn', n3(seg(p, 0.905, 0.955)));
  set('--ship', n3(seg(p, 0.96, 1)));
  return p < 0.292 ? 0 : p < 0.452 ? 1 : p < 0.645 ? 2 : p < 0.908 ? 3 : 4;
};
const BUY_MARKS = [0.13, 0.37, 0.535, 0.72, 0.99];
/** Narrator: jedno zdanie na akt (granice aktów jak w writeBuy), w danej chwili widać tylko bieżące. */
const beats = (steps: HTMLElement[], p: number, at: number[]) => {
  let on = 0;
  for (let i = 1; i < at.length - 1; i++) if (p >= at[i]) on = i;
  setSteps(steps, on, steps.map((_, i) => lin(p, at[i], at[i + 1])));
};
const BUY_BEATS = [0.04, 0.292, 0.452, 0.645, 0.908, 0.995];
const buySteps = (steps: HTMLElement[], p: number) => beats(steps, p, BUY_BEATS);
const NARR = { '--n': 5 } as CSSProperties;

const Hint = ({ text }: { text: string }) => (
  <p className="sk-hint sv-in" style={{ '--d': 6 } as CSSProperties}><MousePointerClick aria-hidden="true" />{text}</p>
);

/** Wysokość nagłówka z opisem i przyciskiem (telefon: kadr stoi zawsze POD nimi) -> --copy-h na scenie. */
const useCopyHeight = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const root = ref.current;
    const copy = root?.querySelector<HTMLElement>('.sk-copy');
    if (!root || !copy) return;
    const fit = () => root.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(copy);
    return () => ro.disconnect();
  }, [ref]);
};

/** Podpisy kroków + początkowe `inert` ekranów poza aktem. */
const useStage = (ref: RefObject<HTMLElement | null>, stepsRef: RefObject<HTMLElement[]>) => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    stepsRef.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    root.querySelectorAll<HTMLElement>('[data-layers] [data-screen]').forEach((s) => { s.inert = s.dataset.screen !== (root.dataset.act ?? '0'); });
  }, [ref, stepsRef]);
};

// ══ A. WITRYNA ═══════════════════════════════════════════════════════════════════════════════════════════════
const FrameScene = ({ t, locale, reduced }: Props & { reduced: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  const seen = useSeen(frameRef, 0.05);
  const { total, c, t: st } = useShop();
  useFly(viewRef);
  useCopyHeight(ref);
  useStage(ref, steps);

  usePin(ref, (p, el) => {
    const cam = seg(p, 0, 0.11);
    setVar(el, '--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    // szkic -> gotowy sklep (sam obraz): ukośna linia światła przy najeździe kamery
    const r = lin(p, 0.04, 0.15);
    setVar(el, '--r1', (-4 + r * 112).toFixed(2));
    setVar(el, '--o1', n3(Math.min(1, r * 12, (1 - r) * 12)));
    // po odsłonie maska sklepu jest już w całości otwarta, a linia światła niewidoczna - CSS je zdejmuje (data-rv)
    el.toggleAttribute('data-rv', r >= 1);
    const act = writeBuy(p, el);
    setVar(el, '--note', n3(seg(p, 0.95, 0.99)));
    setAct(el, act);
    buySteps(steps.current, p);
  }, !reduced);

  return (
    <section ref={ref} className="sk-buy sk-a" data-act="0" data-still="">
      <div className="sk-stage">
        <div className="sk-stage-in container mx-auto px-6">
          <div className="sk-copy">
            <ServiceHead t={t.head} locale={locale} align="start"><Hint text={t.buy.hint} /></ServiceHead>
          </div>
          <div className="sk-a-cam" role="group" aria-label={t.buy.frameAria}>
            <div ref={frameRef} className="sk-a-frame sv-late" data-sky="scene" style={{ '--d': 1 } as CSSProperties}>
              <Frame url={<FrameUrl />} viewRef={viewRef} right={<span className="sk-fr-tag">{t.store.sample}</span>}>
                <StoreLayers
                  pageRef={pageRef}
                  sketch={<div className="sk-a-sketch" aria-hidden="true"><Sketch target={pageRef} draw={seen} /></div>}
                />
              </Frame>
              <div className="sk-note" aria-hidden="true">
                <p className="sk-note-h"><ShoppingBag />{t.buy.noteTitle}<span>{t.buy.noteTime}</span></p>
                <p className="sk-note-from">{ORDER_NO} · {zl(total)}</p>
                <p className="sk-note-msg">{st.pays[c.pay]}, {t.buy.noteMsg} · {st.ship[c.ship].name}</p>
              </div>
            </div>
          </div>
          <div className="sk-steps sk-narr" style={NARR}><Steps items={t.buy.steps} label={t.buy.stepsAria} /></div>
        </div>
      </div>
    </section>
  );
};

// ══ B. DWA EKRANY ════════════════════════════════════════════════════════════════════════════════════════════
/** Lista zamówień w panelu: na górze zamówienie odwiedzającego (jego dostawa, płatność i kwota), niżej wcześniejsze. */
const AMOUNTS = [164, 91, 211, 141, 276, 94, 164, 226, 91];
const useOrderRows = (t: T, n: number) => {
  const { total, c, t: st } = useShop();
  return useMemo<PanelRow[]>(() => [
    { no: ORDER_NO, time: t.buy.noteTime, who: t.panel.customers[0], ship: st.ship[c.ship].name, amt: zl(total), pay: st.pays[c.pay], st: 0, fresh: true },
    ...Array.from({ length: n }, (_, i): PanelRow => ({
      no: `#2026-00${41 - i}`, time: t.panel.older, who: t.panel.customers[(i + 1) % t.panel.customers.length],
      ship: st.ship[(i * 2 + 1) % 3 === 0 ? 0 : 1].name, amt: zl(AMOUNTS[i % AMOUNTS.length]), pay: st.pays[i % 3 === 0 ? 1 : 0], st: 2,
    })),
  ], [t, st, c.ship, c.pay, total, n]);
};
const DuoPanel = ({ t, n }: { t: T; n: number }) => <PanelUI t={t.panel} rows={useOrderRows(t, n)} />;

const DuoScene = ({ t, locale, reduced }: Props & { reduced: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const duoRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  useFly(viewRef);
  useCopyHeight(ref);
  useStage(ref, steps);

  usePin(ref, (p, el) => {
    const cam = seg(p, 0, 0.11);
    setVar(el, '--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    const act = writeBuy(p, el);
    setAct(el, act);
    // zapłata: światło biegnie z telefonu do panelu, wpada wiersz zamówienia, potem statusy
    setVar(el, '--wire', n3(seg(p, 0.872, 0.915)));
    setVar(el, '--wo', n3(win(p, 0.866, 0.876, 0.915, 0.93)));
    setVar(el, '--pn', n3(seg(p, 0.875, 0.93)));
    const row = el.querySelector<HTMLElement>('.sk-pn-row[data-row="0"]');
    if (row) {
      row.toggleAttribute('data-in', p > 0.912);
      const s = p > 0.99 ? '2' : p > 0.965 ? '1' : '0';
      if (row.dataset.st !== s) row.dataset.st = s;
    }
    const nw = el.querySelector<HTMLElement>('.sk-pn-stats [data-k="new"]'), sh = el.querySelector<HTMLElement>('.sk-pn-stats [data-k="ship"]');
    const a = p > 0.912 ? '1' : '0', b = p > 0.912 && p <= 0.99 ? '1' : '0';
    if (nw && nw.textContent !== a) nw.textContent = a;
    if (sh && sh.textContent !== b) sh.textContent = b;
    buySteps(steps.current, p);
  }, !reduced);

  return (
    <section ref={ref} className="sk-buy sk-b" data-act="0" data-still="">
      <div className="sk-stage">
        <div className="sk-stage-in container mx-auto px-6">
          <div className="sk-copy">
            <ServiceHead t={t.head} locale={locale} align="start"><Hint text={t.buy.hint} /></ServiceHead>
          </div>
          <div className="sk-b-cam">
            <div ref={duoRef} className="sk-b-duo sv-late" style={{ '--d': 1 } as CSSProperties}>
              <div className="sk-b-phone" role="group" aria-label={t.buy.frameAria} data-sky="scene">
                <p className="sk-b-who"><i />{t.buy.duo[0]}</p>
                <Frame phone url={<FrameUrl />} viewRef={viewRef}><StoreLayers /></Frame>
              </div>
              <div className="sk-b-wire" aria-hidden="true"><i /><b /></div>
              <div className="sk-b-panel" aria-hidden="true">
                <p className="sk-b-who"><i />{t.buy.duo[1]}</p>
                <Frame url={t.panel.domain} right={<span className="sk-fr-tag">{t.panel.sample}</span>}><DuoPanel t={t} n={9} /></Frame>
              </div>
            </div>
          </div>
          <div className="sk-steps sk-narr" style={NARR}><Steps items={t.buy.steps} label={t.buy.stepsAria} /></div>
        </div>
      </div>
    </section>
  );
};

// ══ C. TAŚMA ═════════════════════════════════════════════════════════════════════════════════════════════════
const ICONS = [ShoppingBag, ShoppingCart, Truck, CreditCard, Package, LayoutList];
/** Postęp sceny, przy którym kamera stoi na stacji aktu 0-4 (dla przycisków sklepu). */
const STOPS = [0.125, 0.285, 0.425, 0.57, 0.79];
/** Przejazdy kamery między stacjami. */
const LEGS: [number, number][] = [[0.2, 0.265], [0.345, 0.41], [0.49, 0.555], [0.7, 0.765], [0.855, 0.92]];
const LAST = LEGS.length;
/** Zdania narratora: zmiana w połowie przejazdu do stacji 2-5 (paczka i panel = ostatnie zdanie). */
const STRIP_BEATS = [0.04, 0.2325, 0.3775, 0.5225, 0.7325, 0.995];

const GateUrl = () => {
  const { t, c } = useShop();
  return <span className="sk-url-gate" data-on=""><Lock aria-hidden="true" />{t.gate.domains[c.pay]}</span>;
};

const StripScene = ({ t, locale, reduced }: Props & { reduced: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLElement[]>([]);
  /** Lewe krawędzie stacji w pasku [px] i położenia znacznika. */
  const geo = useRef<{ x: number[]; mid: number[] }>({ x: [0, 0, 0, 0, 0, 0], mid: [0, 0, 0, 0, 0, 0] });
  useCopyHeight(ref);

  useEffect(() => {
    const root = ref.current, strip = stripRef.current;
    if (!root || !strip) return;
    steps.current = Array.from(root.querySelectorAll<HTMLElement>('.sv-step'));
    const measure = () => {
      const sts = Array.from(strip.querySelectorAll<HTMLElement>('.sk-c-st'));
      const cam = strip.parentElement as HTMLElement;
      // ostatnia stacja (panel) nie może uciec za lewą krawędź dalej, niż trzeba, żeby zmieściła się w oknie
      const maxX = Math.max(0, strip.scrollWidth - cam.clientWidth);
      geo.current = { x: sts.map((s) => Math.min(maxX, s.offsetLeft)), mid: sts.map((s) => s.offsetLeft + 14) };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(strip);
    return () => ro.disconnect();
  }, []);

  usePin(ref, (p, el) => {
    const set = (k: string, v: string) => setVar(el, k, v);
    const cam = seg(p, 0, 0.1);
    set('--cam', cam.toFixed(4));
    el.toggleAttribute('data-still', cam < 0.002);
    // jazda kamery: postój na stacji, przejazd do następnej
    let k = 0;
    LEGS.forEach(([a, b]) => { k += seg(p, a, b); });
    const i0 = Math.min(LAST - 1, Math.floor(k)), f = k - i0;
    const { x, mid } = geo.current;
    set('--x', `${(-(x[i0] + (x[i0 + 1] - x[i0]) * f)).toFixed(1)}px`);
    // znacznik zamówienia na linii: wyprzedza kamerę (rusza po kliknięciu, dojeżdża przed końcem przejazdu)
    let tk = 0;
    LEGS.forEach(([a, b]) => { tk += seg(p, a - 0.012, b - 0.02); });
    const j0 = Math.min(LAST - 1, Math.floor(tk)), g = tk - j0;
    set('--tk', `${(mid[j0] + (mid[j0 + 1] - mid[j0]) * g).toFixed(1)}px`);
    const on = Math.round(k);
    if (el.dataset.on !== String(on)) {
      el.dataset.on = String(on);
      el.querySelectorAll<HTMLElement>('.sk-c-st').forEach((s, i) => {
        s.toggleAttribute('data-on', i === on);
        s.toggleAttribute('data-past', i < on);
        if (i === on) s.setAttribute('data-sky', 'scene'); else s.removeAttribute('data-sky');
      });
    }
    const tkAt = String(Math.round(tk));
    if (el.dataset.tk !== tkAt) el.dataset.tk = tkAt;
    // stacja 1: dotknięcie „Do koszyka”
    set('--co1', n3(win(p, 0.125, 0.142, 0.192, 0.205)));
    set('--cx1', n3(seg(p, 0.125, 0.168)));
    set('--ck1', n3(win(p, 0.168, 0.176, 0.176, 0.19)));
    set('--in', n3(lin(p, 0.176, 0.19)));
    // stacja 2: pozycja wpada do koszyka, dotknięcie „Przejdź do kasy”
    set('--li', n3(seg(p, 0.245, 0.285)));
    set('--cnt', p < 0.245 ? '0' : '1');
    set('--co2', n3(win(p, 0.29, 0.305, 0.338, 0.35)));
    set('--cx2', n3(seg(p, 0.29, 0.322)));
    set('--ck2', n3(win(p, 0.322, 0.33, 0.33, 0.342)));
    // stacja 3: dostawa i metoda płatności, dotknięcie „Zapłać”
    set('--co3', n3(win(p, 0.43, 0.445, 0.484, 0.496)));
    set('--cx3', n3(seg(p, 0.43, 0.466)));
    set('--ck3', n3(win(p, 0.466, 0.474, 0.474, 0.486)));
    // stacja 4: strona operatora - kod BLIK, „Płacę” -> „Płatność przyjęta”
    set('--b', (lin(p, 0.575, 0.642) * 6).toFixed(2));
    set('--co4', n3(win(p, 0.646, 0.658, 0.69, 0.7)));
    set('--cx4', n3(seg(p, 0.646, 0.672)));
    set('--ck4', n3(win(p, 0.672, 0.679, 0.679, 0.69)));
    set('--paid', n3(lin(p, 0.679, 0.694)));
    set('--ret', n3(lin(p, 0.69, 0.72)));
    // stacja 5: potwierdzenie, paczka rusza; stacja 6: wiersz w panelu i statusy
    set('--ok', n3(seg(p, 0.755, 0.795)));
    set('--ship', n3(seg(p, 0.8, 0.868)));
    const row = el.querySelector<HTMLElement>('.sk-pn-row[data-row="0"]');
    if (row) {
      row.toggleAttribute('data-in', p > 0.925);
      const s = p > 0.985 ? '2' : p > 0.958 ? '1' : '0';
      if (row.dataset.st !== s) row.dataset.st = s;
    }
    const chips = p < 0.19 ? 0 : p < 0.694 ? 1 : p < 0.868 ? 2 : 3;
    if (el.dataset.chips !== String(chips)) el.dataset.chips = String(chips);
    beats(steps.current, p, STRIP_BEATS);
  }, !reduced);

  const screens = [<ScreenShop key="0" />, <ScreenCart key="1" />, <ScreenPay key="2" />, <ScreenGate key="3" />, <ScreenDone key="4" />];
  /** Stan przy stacji: 1 „W koszyku” (koszyk), 2 „Opłacone” (płatność), 3 „Wysłane” (paczka). */
  const chipOf: Record<number, number> = { 1: 1, 3: 2, 4: 3 };

  return (
    <section ref={ref} className="sk-buy sk-c" data-act="0" data-on="0" data-tk="0" data-chips="0" data-still="">
      <div className="sk-stage">
        <div className="sk-stage-in container mx-auto px-6">
          <div className="sk-copy">
            <ServiceHead t={t.head} locale={locale} align="start"><Hint text={t.buy.hint} /></ServiceHead>
          </div>
          <div className="sk-c-cam">
            <div ref={stripRef} className="sk-c-strip sv-late" role="group" aria-label={t.buy.frameAria} style={{ '--d': 1 } as CSSProperties}>
              <div className="sk-c-rail" aria-hidden="true">
                <i className="sk-c-rail-fill" />
                <span className="sk-c-token">{ICONS.map((Ic, i) => <Ic key={i} data-i={i} />)}</span>
              </div>
              {t.buy.stations.map((name, i) => (
                <div key={name} className="sk-c-st" data-i={i} data-wide={i === LAST ? '' : undefined} data-on={i === 0 ? '' : undefined} data-sky={i === 0 ? 'scene' : undefined}>
                  <p className="sk-c-name">
                    <b>0{i + 1}</b><span>{name}</span>
                    {chipOf[i] && <em data-chip={chipOf[i]}><Check aria-hidden="true" />{t.buy.chips[chipOf[i] - 1]}</em>}
                  </p>
                  {i < LAST
                    ? <Frame phone url={i === 3 ? <GateUrl /> : t.store.domain}>{screens[i]}</Frame>
                    : <Frame url={t.panel.domain}><DuoPanel t={t} n={9} /></Frame>}
                </div>
              ))}
            </div>
          </div>
          <div className="sk-steps sk-narr" style={NARR}><Steps items={t.buy.steps} label={t.buy.stepsAria} /></div>
        </div>
      </div>
    </section>
  );
};

// ── Opakowania: stan zakupu + `go` (przyciski sklepu przewijają film) ──
const wrap = (Scene: (p: Props & { reduced: boolean }) => ReactNode, marks: number[], cls: string) => {
  const Wrapped = ({ t, locale }: Props) => {
    const reduced = useCalm();
    const host = useRef<HTMLDivElement>(null);
    const target = useRef<HTMLElement | null>(null);
    useEffect(() => { target.current = host.current?.querySelector<HTMLElement>(`.${cls}`) ?? null; }, []);
    const go = useGo(target, marks, reduced);
    return (
      <div ref={host} className="sk-buy-host">
        <ShopProvider t={t.store} go={go}><Scene t={t} locale={locale} reduced={reduced} /></ShopProvider>
      </div>
    );
  };
  return Wrapped;
};

export const BuyFrame = wrap(FrameScene, BUY_MARKS, 'sk-a');
export const BuyDuo = wrap(DuoScene, BUY_MARKS, 'sk-b');
export const BuyStrip = wrap(StripScene, STOPS, 'sk-c');
