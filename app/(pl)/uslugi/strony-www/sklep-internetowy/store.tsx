'use client';

import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { ArrowRight, Check, Lock, Minus, MousePointer2, Plus, ShoppingBag } from 'lucide-react';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { Product } from './products';

// PRZYKŁADOWY SKLEP KLIENTA w kadrze („twoj-sklep.pl”) - MINI SKLEP, KTÓRY DA SIĘ KLIKNĄĆ (wyróżnik podstrony sklepu:
// odwiedzający sam zmienia wariant i rozmiar, dodaje do koszyka, wybiera dostawę i płatność).
// RUNDA 2 (właściciel 2026-10-02: „chcę, żeby też było pokazane, że to nie template sklep, tylko customowy pod markę”):
// sklep ma WŁASNĄ MARKĘ - szeryfowy krój nagłówków (fonts.ts), scenę produktu jak z sesji zdjęciowej (tło, postument,
// cień), produkty z cieniowaniem (products.tsx), spis kolekcji zamiast siatki kafli. Jedna marka: ceramika
// (redakcyjny układ: tekst | scena | spis kolekcji); stroje palarni i kosmetyków z rundy 2 usunięte.
// RUNDA 5 (właściciel: „zrób te makiety mniej pastelowe i pasujące do całej strony, żeby nikt nie pomyślał, że to
// jest ta strona, tylko makieta”): ciemna, ciepła paleta (czerń, kość, glina) zamiast jasnej kremowej - sklep,
// kasa, panel i strona operatora są ciemne jak cała strona; w pasku kadru etykieta „Przykładowy sklep”.
// PŁATNOŚĆ (właściciel: „bezpośrednio w sklepie nie podaje się kodu, tylko przekierowuje do Stripe albo Przelewy24”):
// w kasie klient wybiera BLIK albo kartę i klika „Zapłać”; kod BLIK / dane karty podaje na stronie OPERATORA
// (ScreenGate: Przelewy24 dla BLIK-a, Stripe dla karty), a po płatności wraca do sklepu z potwierdzeniem.
// Wymiary w em od jednej wielkości liczonej z rozmiaru okna kadru (kontenerem jest OKNO kadru .sk-fr-view),
// wąskie okno (telefon, stacja) = układ w jednej kolumnie (@container w sklep.css).
// Stan zakupu = React (ShopProvider); ruch scen (lot produktu, kod BLIK, kursor) = zmienne CSS pisane przez scenę
// z postępu przewijania; przyciski sklepu wołają `go(akt)` - scena przewija film do tego aktu.
// data-sk = wskazówki dla szkicu (app/(pl)/uslugi/_usluga/sketch.tsx).

export const PRICES = [129, 149, 79, 199];
export const SHIP = [15, 12, 0];
export const ORDER_NO = '#2026-0042';
export const CODE = '482913';
/** Marki przykładowego sklepu: identyfikator (data-brand) i kolory wariantów produktu. */
export const BRANDS = [
  { id: 'ceramika', colors: ['#c25a2e', '#6f7f4f', '#d8c8ad'] },
] as const;
export const zl = (n: number) => `${n} zł`;

export interface Cart { brand: number; color: number; size: number; qty: number; ship: number; pay: number }
interface Ctx {
  t: ShopCopy['store']; b: ShopCopy['store']['brands'][number]; c: Cart; set: (p: Partial<Cart>) => void;
  /** Przejście do aktu: 0 produkt, 1 koszyk, 2 kasa, 3 płatność u operatora, 4 zamówienie. */
  go: (act: number) => void;
  sum: number; total: number;
}
const ShopCtx = createContext<Ctx | null>(null);
export const useShop = () => {
  const c = useContext(ShopCtx);
  if (!c) throw new Error('useShop poza ShopProvider');
  return c;
};

export const ShopProvider = ({ t, go, brand = 0, children }: { t: ShopCopy['store']; go: (act: number) => void; brand?: number; children: ReactNode }) => {
  const [c, setC] = useState<Cart>({ brand, color: 0, size: 1, qty: 1, ship: 1, pay: 0 });
  const set = useCallback((p: Partial<Cart>) => setC((o) => ({ ...o, ...p })), []);
  const v = useMemo<Ctx>(() => {
    const sum = PRICES[0] * c.qty;
    return { t, b: t.brands[c.brand], c, set, go, sum, total: sum + SHIP[c.ship] };
  }, [t, c, set, go]);
  const look = BRANDS[c.brand];
  return (
    <ShopCtx.Provider value={v}>
      <div className="sk-ctx" data-brand={look.id} style={{ '--prod': look.colors[c.color] } as CSSProperties}>{children}</div>
    </ShopCtx.Provider>
  );
};

/** Miniatura produktu na tle sceny marki (koszyk, kasa, spis kolekcji). */
export const Thumb = ({ k = 0, color }: { k?: number; color?: string }) => {
  const { c } = useShop();
  return (
    <span className="sk-thumb" data-sk="img">
      <Product brand={c.brand} k={k} style={color ? ({ '--prod': color } as CSSProperties) : undefined} />
    </span>
  );
};

/** Kursor (komputer) / dotknięcie (wąskie okno) na przycisku, w który „klika” film. n = numer celu (zmienne --co{n}…). */
const Cur = ({ n }: { n: number }) => (
  <span className="sk-cur" data-n={n} data-sk="skip" aria-hidden="true"><MousePointer2 /><i /></span>
);

/** Rama okna: pasek z adresem + okno (kontener układu sklepu). */
export const Frame = ({ url, right, children, className, viewRef, phone }: {
  url: ReactNode; right?: ReactNode; children: ReactNode; className?: string; viewRef?: Ref<HTMLDivElement>; phone?: boolean;
}) => (
  <div className={`sk-fr-rim${phone ? ' sk-fr-rim--phone' : ''}${className ? ` ${className}` : ''}`}>
    <div className="sk-fr-bar">
      <span className="sk-fr-url"><i />{url}</span>
      {right}
    </div>
    <div ref={viewRef} className="sk-fr-view">{children}</div>
  </div>
);

/** Adres w pasku kadru: domena sklepu, a w akcie płatności domena operatora z kłódką (data-act na scenie). */
export const FrameUrl = () => {
  const { t, c } = useShop();
  return (
    <span className="sk-url">
      <span className="sk-url-shop">{t.domain}</span>
      <span className="sk-url-gate"><Lock aria-hidden="true" />{t.gate.domains[c.pay]}</span>
    </span>
  );
};

const Wordmark = () => {
  const { b } = useShop();
  return <span className="sk-st-logo"><i data-sk="skip" />{b.wordmark}</span>;
};

/** Akt 0 - sklep: nawigacja z koszykiem, produkt na scenie z wariantami (kolor, rozmiar), „Do koszyka”, spis kolekcji. */
export const ScreenShop = ({ pageRef }: { pageRef?: Ref<HTMLDivElement> }) => {
  const { t, b, c, set, go } = useShop();
  const colors = BRANDS[c.brand].colors;
  return (
    <div ref={pageRef} className="sk-st sk-st--shop" data-screen="0">
      <div className="sk-st-in">
        <div className="sk-st-nav">
          <Wordmark />
          <span className="sk-st-links">
            {b.nav.map((x) => <span key={x} className="sk-st-navlink">{x}</span>)}
            <span className="sk-st-cart" data-sk="box">
              <ShoppingBag data-sk="skip" />{t.cart}
              <b className="sk-st-count" data-sk="skip">{c.qty}</b>
            </span>
          </span>
        </div>
        <div className="sk-st-pdp">
          <div className="sk-st-info">
            <p className="sk-st-eyebrow"><i data-sk="skip" />{b.eyebrow}</p>
            <p className="sk-st-h1">{b.product}</p>
            <p className="sk-st-p">{b.text}</p>
            <p className="sk-st-price">{zl(PRICES[0])}</p>
            <div className="sk-st-opts">
              <div className="sk-st-opt">
                <span className="sk-st-lab">{b.colorLabel}: <b>{b.colors[c.color]}</b></span>
                <span className="sk-st-sws" role="group" aria-label={b.colorLabel} data-sk="skip">
                  {colors.map((col, i) => (
                    <button key={col} type="button" className="sk-st-sw" aria-pressed={c.color === i} aria-label={b.colors[i]} style={{ '--sw': col } as CSSProperties} onClick={() => set({ color: i })} />
                  ))}
                </span>
              </div>
              <div className="sk-st-opt">
                <span className="sk-st-lab">{b.sizeLabel}</span>
                <span className="sk-st-sizes" role="group" aria-label={b.sizeLabel}>
                  {b.sizes.map((s, i) => (
                    <button key={s} type="button" className="sk-st-size" aria-pressed={c.size === i} onClick={() => set({ size: i })} data-sk="box">{s}</button>
                  ))}
                </span>
              </div>
            </div>
            <button type="button" className="sk-st-btn sk-st-add" data-sk="btn" onClick={() => go(1)}>
              <span className="sk-st-add-a">{t.addToCart}<ArrowRight data-sk="skip" /></span>
              <span className="sk-st-add-b" data-sk="skip"><Check />{t.inCart}</span>
              <Cur n={1} />
            </button>
          </div>
          <div className="sk-st-stage" data-sk="img">
            <i className="sk-st-arc" data-sk="skip" />
            <i className="sk-st-plinth" data-sk="skip" />
            <Product brand={c.brand} className="sk-st-hero" />
            <span className="sk-st-no" data-sk="skip">01</span>
          </div>
          <div className="sk-st-index">
            <p className="sk-st-index-h">{b.index}</p>
            {b.items.map((name, i) => (
              <p key={name} className="sk-st-item" data-on={i === 0 ? '' : undefined} data-sk="box">
                <Thumb k={i} color={i === 0 ? undefined : colors[i % colors.length]} />
                <span className="sk-st-item-t">{name}</span>
                <span className="sk-st-s">{zl(PRICES[i])}</span>
              </p>
            ))}
            <p className="sk-st-all">{t.seeAll}<ArrowRight data-sk="skip" /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Akt 1 - koszyk: pozycja z wariantem, ilość (+ / -), podsumowanie, „Przejdź do kasy”. */
export const ScreenCart = ({ coupon }: { coupon?: boolean }) => {
  const { t, b, c, set, go, sum } = useShop();
  const off = Math.round(sum * 0.1);
  return (
    <div className="sk-st sk-st--cart" data-screen="1">
      <div className="sk-st-in">
        <p className="sk-st-h2">{t.yourCart}</p>
        <div className="sk-st-line">
          <Thumb />
          <div className="sk-st-line-t">
            <p className="sk-st-h3">{b.product}</p>
            <p className="sk-st-s">{b.colors[c.color]} · {b.sizes[c.size]}</p>
          </div>
          <span className="sk-st-qty" role="group" aria-label={t.qty}>
            <button type="button" aria-label={t.less} onClick={() => set({ qty: Math.max(1, c.qty - 1) })}><Minus /></button>
            <b>{c.qty}</b>
            <button type="button" aria-label={t.more} onClick={() => set({ qty: Math.min(9, c.qty + 1) })}><Plus /></button>
          </span>
          <b className="sk-st-amt">{zl(sum)}</b>
        </div>
        {coupon && (
          <div className="sk-st-coupon">
            <span className="sk-st-lab">{t.coupon}</span>
            <span className="sk-st-coupon-f"><b>{t.couponCode}</b><i><Check /></i></span>
          </div>
        )}
        <div className="sk-st-sum">
          <p><span>{t.items}</span><b>{zl(sum)}</b></p>
          {coupon && <p className="sk-st-off"><span>{t.discount}</span><b>-{zl(off)}</b></p>}
          <p><span>{t.delivery}</span><span>{t.deliveryLater}</span></p>
          <p className="sk-st-tot">
            <span>{t.total}</span>
            {coupon ? <b className="sk-st-swap"><i>{zl(sum)}</i><i>{zl(sum - off)}</i></b> : <b>{zl(sum)}</b>}
          </p>
        </div>
        <button type="button" className="sk-st-btn sk-st-next" onClick={() => go(2)}>
          {t.goToCheckout}<ArrowRight />
          <Cur n={2} />
        </button>
      </div>
    </div>
  );
};

/** Akt 2 - kasa: dostawa (kurier / paczkomat), metoda płatności (BLIK / karta), „Zapłać” -> przekierowanie do operatora. */
export const ScreenPay = ({ demo }: { demo?: boolean }) => {
  const { t, b, c, set, go, sum, total } = useShop();
  return (
    <div className="sk-st sk-st--pay" data-screen="2">
      <div className="sk-st-in">
        <p className="sk-st-top"><Wordmark /><span className="sk-st-s">{t.yourOrder}: {zl(total)}</span></p>
        <div className="sk-st-cols">
          <div className="sk-st-col">
            <p className="sk-st-h2">{t.delivery}</p>
            <div className="sk-st-ships" role="group" aria-label={t.delivery}>
              {t.ship.map((s, i) => (
                <button key={s.name} type="button" className="sk-st-ship" aria-pressed={c.ship === i} onClick={() => set({ ship: i })}>
                  <i className="sk-st-radio" />
                  <span><b>{s.name}</b><small>{s.note}</small></span>
                  <em>{zl(SHIP[i])}</em>
                </button>
              ))}
              {demo && (
                <button type="button" className="sk-st-ship" aria-pressed={c.ship === 2} onClick={() => set({ ship: 2 })}>
                  <i className="sk-st-radio" />
                  <span><b>{t.pickup}</b></span>
                  <em>{zl(SHIP[2])}</em>
                </button>
              )}
            </div>
          </div>
          <div className="sk-st-col">
            <p className="sk-st-h2">{t.payment}</p>
            <div className="sk-st-pays" role="group" aria-label={t.payment}>
              {t.pays.map((p, i) => (
                <button key={p} type="button" className="sk-st-pay" aria-pressed={c.pay === i} onClick={() => set({ pay: i })}>{p}</button>
              ))}
            </div>
            <p className="sk-st-note"><Lock aria-hidden="true" />{t.payNote} <b>{t.gate.operators[c.pay]}</b></p>
            <button type="button" className="sk-st-btn sk-st-payb" onClick={() => go(3)}>
              {t.pay} {zl(total)}<ArrowRight />
              <Cur n={3} />
            </button>
          </div>
          <aside className="sk-st-order">
            <p className="sk-st-h3">{t.yourOrder}</p>
            <div className="sk-st-oline">
              <Thumb />
              <div>
                <p className="sk-st-h4">{b.product}</p>
                <p className="sk-st-s">{b.colors[c.color]} · {b.sizes[c.size]} · ×{c.qty}</p>
              </div>
            </div>
            <div className="sk-st-sum">
              <p><span>{t.items}</span><b>{zl(sum)}</b></p>
              <p><span>{t.delivery}</span><b>{zl(SHIP[c.ship])}</b></p>
              <p className="sk-st-tot"><span>{t.total}</span><b>{zl(total)}</b></p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/** Akt 3 - strona OPERATORA płatności (Przelewy24 dla BLIK-a, Stripe dla karty): celowo inny, neutralny wygląd -
    klient jest poza sklepem. Kod BLIK / dane karty wpisują się tutaj, „Płacę” -> „Płatność przyjęta” -> powrót. */
export const ScreenGate = () => {
  const { t, b, c, go, total } = useShop();
  const g = t.gate;
  return (
    <div className="sk-gt" data-screen="3">
      <div className="sk-gt-in">
        <p className="sk-gt-top"><span className="sk-gt-op"><Lock aria-hidden="true" />{g.operators[c.pay]}</span><span>{g.secure}</span></p>
        <div className="sk-gt-card">
          <dl className="sk-gt-rows">
            <div><dt>{g.to}</dt><dd>{b.wordmark} · {t.domain}</dd></div>
            <div><dt>{t.order}</dt><dd>{ORDER_NO}</dd></div>
          </dl>
          <p className="sk-gt-amt"><span>{g.amount}</span><b>{zl(total)}</b></p>
          {c.pay === 0 ? (
            <div className="sk-gt-f">
              <span className="sk-gt-lab">{g.blik}</span>
              <span className="sk-gt-code">
                {CODE.split('').map((d, i) => <i key={i} style={{ '--i': i } as CSSProperties}><b>{d}</b></i>)}
              </span>
            </div>
          ) : (
            <div className="sk-gt-f sk-gt-f--card">
              {g.card.map((l, i) => (
                <span key={l} className="sk-gt-fld" data-w={i}>
                  <span className="sk-gt-lab">{l}</span>
                  <i style={{ '--i': i } as CSSProperties} />
                </span>
              ))}
            </div>
          )}
          <button type="button" className="sk-gt-btn" onClick={() => go(4)}>
            <span className="sk-gt-btn-a">{g.confirm} {zl(total)}</span>
            <span className="sk-gt-btn-b"><Check />{g.accepted}</span>
            <Cur n={4} />
          </button>
          <p className="sk-gt-back"><i /><span>{g.returning}</span></p>
        </div>
      </div>
    </div>
  );
};

/** Akt 4 - zamówienie: podziękowanie, numer, płatność i dostawa wybrane przez klienta, paczka. */
export const ScreenDone = () => {
  const { t, c, go } = useShop();
  return (
    <div className="sk-st sk-st--done" data-screen="4">
      <div className="sk-st-in">
        <p className="sk-st-top"><Wordmark /><span className="sk-st-s">{t.order} {ORDER_NO}</span></p>
        <div className="sk-st-thanks">
          <div className="sk-st-thanks-t">
            <span className="sk-st-ok"><Check /></span>
            <p className="sk-st-h1">{t.thankYou}</p>
            <p className="sk-st-p">{t.mail}</p>
            <dl className="sk-st-rows">
              <div><dt>{t.rows[0]}</dt><dd>{ORDER_NO}</dd></div>
              <div><dt>{t.rows[1]}</dt><dd>{t.pays[c.pay]} · {t.gate.operators[c.pay]}</dd></div>
              <div><dt>{t.rows[2]}</dt><dd>{t.ship[c.ship]?.name ?? t.pickup}</dd></div>
            </dl>
            <button type="button" className="sk-st-ghost" onClick={() => go(0)}>{t.back}</button>
          </div>
          <Parcel />
        </div>
      </div>
    </div>
  );
};

/** Paczka z etykietą. */
export const Parcel = ({ className }: { className?: string }) => (
  <span className={className ? `sk-parcel ${className}` : 'sk-parcel'} aria-hidden="true">
    <i className="sk-parcel-box" /><i className="sk-parcel-tape" /><i className="sk-parcel-lab"><b /><b /><b /></i>
  </span>
);

export interface PanelRow { no: string; time: string; who: string; ship: string; amt: string; pay: string; st?: number; /** wiersz wpada do listy (data-new; pokazuje go data-in) */ fresh?: boolean }

/** Panel właściciela: lista zamówień ze statusami (Opłacone -> Spakowane -> Wysłane). Wiersze i liczniki steruje
    scena atrybutami (data-in na wierszu, data-st 0-2) - bez renderów Reacta. `onStatus` = klik w status wiersza. */
export const PanelUI = ({ t, rows, onStatus, hint }: {
  t: ShopCopy['panel']; rows: PanelRow[]; onStatus?: (i: number) => void; hint?: string;
}) => (
  <div className="sk-pn">
    <div className="sk-pn-in">
      <div className="sk-pn-side">
        <span className="sk-pn-logo"><i />{t.brand}</span>
        {t.menu.map((m, i) => <span key={m} className="sk-pn-menu" data-on={i === 0 ? '' : undefined}>{m}</span>)}
      </div>
      <div className="sk-pn-main">
        <div className="sk-pn-top">
          <p className="sk-pn-h">{t.title}</p>
          <p className="sk-pn-stats">
            <span>{t.newOrders}<b data-k="new">{rows.some((r) => r.fresh) ? rows.filter((r) => r.fresh).length : rows.filter((r) => (r.st ?? 0) < 2).length}</b></span>
            <span>{t.toShip}<b data-k="ship">{rows.filter((r) => (r.st ?? 0) < 2).length}</b></span>
          </p>
        </div>
        <div className="sk-pn-table">
          <p className="sk-pn-row sk-pn-row--head">{t.cols.map((c, i) => <span key={c} data-c={i}>{c}</span>)}</p>
          {rows.map((r, i) => (
            <p key={r.no} className="sk-pn-row" data-row={i} data-st={r.st ?? 0} data-new={r.fresh ? '' : undefined} style={{ '--i': i } as CSSProperties}>
              <span data-c="0"><b>{r.no}</b></span>
              <span data-c="1">{r.time}</span>
              <span data-c="2">{r.who}</span>
              <span data-c="3">{r.ship}</span>
              <span data-c="4"><b>{r.amt}</b><small>{r.pay}</small></span>
              <span data-c="5">
                {onStatus ? (
                  <button type="button" className="sk-pn-st" onClick={() => onStatus(i)} title={hint}>
                    {t.statuses.map((s, k) => <i key={s} data-k={k}>{s}</i>)}
                  </button>
                ) : (
                  <span className="sk-pn-st">{t.statuses.map((s, k) => <i key={s} data-k={k}>{s}</i>)}</span>
                )}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>
);
