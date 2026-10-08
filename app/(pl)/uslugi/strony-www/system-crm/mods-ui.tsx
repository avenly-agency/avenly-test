'use client';

import { useEffect, type CSSProperties } from 'react';
import { BarChart3, Bell, CalendarDays, DoorOpen, FileText, Inbox, ListChecks, Lock, Mail, Users, type LucideIcon } from 'lucide-react';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import type { ModsCopy } from '@/lib/i18n/uslugi/system-crm-mods';
import { clamp01 } from '../../_usluga/shared';
import { Av } from './ui';

// WSPÓLNE CZĘŚCI sekcji modułów (runda 4: mods-rise.tsx, mods-menu.tsx, mods-down.tsx; style cr8- w mods.css).
//
// MINI-EKRANY MODUŁÓW (`ModScreen`). Każdy moduł ma własny ekran z danymi przykładowej firmy („Pracownia Dąb”):
// te same zlecenia, osoby i etapy co w pozostałych scenach podstrony, więc system czyta się jak jeden.
//   0 Zlecenia            wiersze: zlecenie, klient i opiekun, kreski etapu, stan,
//   1 Klienci             osoby z inicjałem i ich zleceniem + historia kontaktu pierwszej osoby (oś z punktami),
//   2 Kalendarz           tydzień roboczy: w kolumnach dni wpisy z godziną i nazwą, wyróżniony termin podpisany,
//   3 Zadania             lista do odhaczenia (dwa zadania odhaczone),
//   4 Role i uprawnienia  tabela: kto ma dostęp do których modułów (punkt = dostęp, kłódka = zamknięte); na wąskich
//                         ekranach ta sama tabela obrócona - moduły w wierszach, role w kolumnach (pełne nazwy),
//   5 Powiadomienia       to, co system wysłał sam: do kogo, którędy i w jakim stanie,
//   6 Raporty             liczniki zleceń według etapu jako włosowe linie z punktem + linia „tydzień po tygodniu”,
//   7 Portal klienta      zlecenie klientki, oś etapów, wiadomość i dokumenty.
// Ekrany są statyczne (stan końcowy) - nic się w nich nie rysuje ani nie dorasta. Wymiary w em od pisma ekranu
// (--fs), więc ten sam ekran działa w trzech wielkościach (`data-size` na `ModFrame`):
//   s  pole w oknie („Rośnie”): jedno pismo, bez dopisków (po odjeździe kamery zostaje >= 12 px),
//   m  kolumna albo piętro („W dół”, trzy ekrany w „Menu rośnie”),
//   l  cały widok („Menu rośnie”).
// Mini-ekrany to ilustracja (aria-hidden) - nazwa modułu i zdanie o nim stoją obok jako zwykły tekst.
//
// POJAWIANIE SIĘ = „ROZEJŚCIE” (decyzja właściciela 2026-10-05: „te wszystkie animacje linii, która leci i zmienia
// wireframe na coś… wywal i zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi”). Usunięte: szkielet
// z punktów i włosowych linii, lot punktów, ostra linia światła i odsłona przycięciem. Moduł pojawia się wspólną klasą
// podstrony `.cr-bloom` (generowany bloom.css): kilka kłębów gazu pojawia się od lewej do prawej, rośnie i zlewa się.
// Wolne miejsce zaznacza spokojny znak (`Spot`: gwiazdka w lewym górnym rogu i punkty w pozostałych rogach) - znika
// tym samym rozejściem (`.cr-bloom-out` - dokładne dopełnienie), a w pustym miejscu na końcu zostaje. Postęp pisze
// scena: `bloomTo` (z przewijania) albo przejście CSS zmiennej --bloom („W dół”: gra samo do końca).

/** Ile modułów działa od początku („trzy ekrany”). */
export const START = 3;
export const MOD_ICONS: LucideIcon[] = [Inbox, Users, CalendarDays, ListChecks, Lock, Bell, BarChart3, DoorOpen];

/** Etap (indeks w `board.stages`), na którym stoją zlecenia z `roles.owner.rows`. */
const STAGE_OF = [2, 2, 1];
/** Dostęp do modułów (`roles.modules`) właściciela, biura i pracownika - jak w sekcji ról (roles.tsx). */
const ACCESS = [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 0, 0], [0, 1, 0, 1, 0, 0]];
/** Raporty: liczba zleceń w kolejnych etapach (neutralne liczniki) i kształt linii „tydzień po tygodniu” (0-1). */
const COUNTS = [2, 3, 5, 4];
const TREND = [0.3, 0.48, 0.4, 0.66, 0.58, 0.84];
const TREND_AT = TREND.map((v, j) => ({ x: ((j * 100) / (TREND.length - 1)).toFixed(1), y: ((1 - v) * 100).toFixed(1) }));
const TREND_LINE = TREND_AT.map((p) => `${p.x},${p.y}`).join(' ');

// ── zapis do DOM tylko przy zmianie wartości (sceny piszą zmienne CSS i atrybuty bez renderów Reacta) ──
export const put = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
export const flag = (el: Element, k: string, on: boolean) => { if (el.hasAttribute(k) !== on) el.toggleAttribute(k, on); };
/** Sprzątanie po scenie (ograniczony ruch, brak przypięcia): zostaje stan końcowy z CSS. */
export const wipe = (el: HTMLElement | null, vars: string[], attrs: string[] = []) => {
  if (!el) return;
  vars.forEach((k) => el.style.removeProperty(k));
  attrs.forEach((a) => el.removeAttribute(a));
};
/** Postęp przypiętej sekcji (0-1) z jej położenia - ten sam wzór co `usePin` w szkielecie. */
export const pinProgress = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
};
/** Jedno dodatkowe przeliczenie dwie klatki po montażu: pierwsze biegnie, zanim korzeń podstrony dostanie data-live
    (jeszcze na układzie „bez JS”). `run` musi być stabilne (useCallback). */
export const useKick = (run: () => void, on: boolean) => {
  useEffect(() => {
    if (!on) return;
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(run); });
    return () => cancelAnimationFrame(id);
  }, [run, on]);
};

// ── rozejście (.cr-bloom / .cr-bloom-out; reguły w generowanym bloom.css, opis w system-crm.css) ──
const LAYERS = '.cr-bloom, .cr-bloom-out';
/** Czy warstwy pola mają już znacznik końca (żeby nie szukać ich w DOM co klatkę). */
const bloomed = new WeakMap<HTMLElement, boolean>();
/** Znacznik końca rozejścia na warstwach pola `box` (i na nim samym, jeśli jest warstwą): data-bloomed = maska
    zdjęta z tego, co weszło, a to, co zeszło, schowane; bez znacznika maskę liczy --bloom. */
export const bloomMark = (box: HTMLElement, done: boolean) => {
  if (box.matches(LAYERS)) flag(box, 'data-bloomed', done);
  box.querySelectorAll(LAYERS).forEach((el) => flag(el, 'data-bloomed', done));
};
/** Postęp rozejścia `v` (0-1, już z łagodnym startem i końcem) na polu `box`: --bloom dziedziczą jego warstwy
    (to, co wchodzi, i znak miejsca, który schodzi). Po dojściu do końca warstwy dostają data-bloomed (maska zdjęta
    z tego, co weszło; to, co zeszło, schowane), przy powrocie znacznik znika. Postęp z przewijania - „Rośnie”
    i „Menu rośnie”; w „W dół” rozejście odgrywa przejście CSS (mods-down.tsx). */
export const bloomTo = (box: HTMLElement, v: number) => {
  put(box, '--bloom', v.toFixed(4));
  const done = v > 0.9995;
  if (bloomed.get(box) === done) return;
  bloomed.set(box, done);
  bloomMark(box, done);
};
/** Scena stoi (ograniczony ruch, brak przypięcia): pole wraca do stanu końcowego - bez --bloom, warstwy z data-bloomed. */
export const bloomOff = (box: HTMLElement | null) => {
  if (!box) return;
  box.style.removeProperty('--bloom');
  bloomed.delete(box);
  bloomMark(box, true);
};

type P = { t: SystemCrmCopy; x: ModsCopy };

const Jobs = ({ t }: P) => {
  const o = t.roles.owner, stages = t.board.stages, stat = o.stats[1] ?? o.stats[0];
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{o.title}</span>{stat ? <span>{stat.l} <b>{stat.v}</b></span> : null}</p>
      <ul className="cr8-u-rows">
        {o.rows.map((r, j) => (
          <li key={r.t} className="cr8-u-row cr8-ln">
            <i className="cr8-dot" data-on={j === 0 ? '' : undefined} />
            <span className="cr8-u-tx">
              <b className="cr8-u-t">{r.t}</b>
              <span className="cr8-u-s">{r.c} · {(t.team[r.who] ?? t.team[0])?.name}</span>
            </span>
            <span className="cr8-u-steps">
              {stages.map((s, k) => <i key={s} data-on={k <= (STAGE_OF[j] ?? 0) ? '' : undefined} />)}
            </span>
            <span className="cr-chip" data-fresh={j === 0 ? '' : undefined}>{r.st}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

const Clients = ({ t, x }: P) => {
  const rows = t.roles.owner.rows, c = x.ui.clients;
  return (
    <>
      <ul className="cr8-u-rows">
        {rows.map((r) => (
          <li key={r.c} className="cr8-u-row cr8-ln">
            <Av name={r.c} />
            <span className="cr8-u-tx"><b className="cr8-u-t">{r.c}</b></span>
            <span className="cr8-u-tail">{r.t}</span>
          </li>
        ))}
      </ul>
      <p className="cr8-u-h cr8-u-hist-h cr8-ln"><span>{c.title}</span><b>{rows[0]?.c}</b></p>
      <ol className="cr8-u-hist">
        {c.history.map((h, j) => (
          <li key={h.t}>
            <i className="cr8-dot" data-on={j === c.history.length - 1 ? '' : undefined} />
            <span className="cr8-u-t">{h.t}</span>
            <span className="cr8-u-tail">{h.s}</span>
          </li>
        ))}
      </ol>
    </>
  );
};

const Week = ({ x }: P) => {
  const c = x.ui.cal;
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{c.title}</span><b>{c.items.length}</b></p>
      <div className="cr8-u-week">
        {c.days.map((d, j) => (
          <div key={d} className="cr8-u-day" data-now={j === c.today ? '' : undefined}>
            <b>{d}</b>
            <span className="cr8-u-lane">
              {c.items.filter((it) => it.day === j).map((it) => (
                <span key={`${it.time} ${it.label}`} className="cr8-u-ev" data-on={it.hot ? '' : undefined}>
                  <i>{it.time}</i>
                  <span>{it.label}</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="cr8-u-note"><i className="cr8-dot" data-on="" /><span className="cr8-u-t">{c.note}</span></p>
    </>
  );
};

const Tasks = ({ t }: P) => {
  const s = t.roles.staff;
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{s.title}</span><b>{s.tasks.length}</b></p>
      <ul className="cr8-u-rows">
        {s.tasks.map((task, j) => (
          <li key={task.t} className="cr8-u-row cr8-ln" data-do={j < 2 ? '' : undefined}>
            <span className="cr8-box" />
            <span className="cr8-u-tx"><b className="cr8-u-t">{task.t}</b><span className="cr8-u-s">{task.s}</span></span>
          </li>
        ))}
      </ul>
    </>
  );
};

const Access = ({ t, x }: P) => {
  const r = t.roles;
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{x.ui.access.title}</span><b>{r.roles.length}</b></p>
      <div className="cr8-u-acc" style={{ '--n': r.modules.length } as CSSProperties}>
        <p className="cr8-u-acc-h"><span />{r.modules.map((m) => <span key={m}>{m}</span>)}</p>
        {r.roles.map((role, j) => (
          <p key={role.id} className="cr8-u-acc-r cr8-ln">
            <span className="cr8-u-tx"><b className="cr8-u-t">{role.label}</b><span className="cr8-u-s">{role.who}</span></span>
            {r.modules.map((m, c) => (
              <span key={m} className="cr8-u-cell">{ACCESS[j]?.[c] ? <i className="cr8-pt" /> : <Lock />}</span>
            ))}
          </p>
        ))}
      </div>
      {/* ta sama tabela OBRÓCONA (moduły w wierszach, role w kolumnach) - dla wąskich ekranów: sześć kolumn modułów
          bez podpisów byłoby nieczytelne, a tu każda nazwa stoi w całości. Którą widać, decyduje CSS sceny. */}
      <div className="cr8-u-accf" style={{ '--n': r.roles.length } as CSSProperties}>
        <p className="cr8-u-accf-h"><span />{r.roles.map((role) => <span key={role.id}>{role.label}</span>)}</p>
        {r.modules.map((m, c) => (
          <p key={m} className="cr8-u-accf-r cr8-ln">
            <span className="cr8-u-accf-l">{m}</span>
            {r.roles.map((role, j) => (
              <span key={role.id} className="cr8-u-cell">{ACCESS[j]?.[c] ? <i className="cr8-pt" /> : <Lock />}</span>
            ))}
          </p>
        ))}
      </div>
    </>
  );
};

const Notes = ({ x }: P) => {
  const n = x.ui.notes;
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{n.title}</span><b>{n.items.length}</b></p>
      <ul className="cr8-u-rows">
        {n.items.map((it) => {
          const Icon = it.kind === 'mail' ? Mail : Bell;
          return (
            <li key={it.text} className="cr8-u-row cr8-ln">
              <span className="cr8-ico"><Icon /></span>
              <span className="cr8-u-tx"><b className="cr8-u-t">{it.text}</b><span className="cr8-u-s">{it.to}</span></span>
              <span className="cr8-state" data-wait={it.wait ? '' : undefined}>{it.state}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const Reports = ({ t, x }: P) => {
  const stages = t.board.stages;
  const max = Math.max(1, ...COUNTS);
  const sum = stages.reduce((acc, _, j) => acc + (COUNTS[j] ?? 0), 0);
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{x.ui.reports.title}</span><b>{sum}</b></p>
      <div className="cr8-u-rep">
        <ul className="cr8-u-bars">
          {stages.map((s, j) => (
            <li key={s} className="cr8-u-bar" style={{ '--v': ((COUNTS[j] ?? 0) / max).toFixed(3) } as CSSProperties}>
              <span className="cr8-u-bar-l">{s}</span>
              <span className="cr8-u-bar-t cr8-ln"><i className="cr8-u-bar-f" /><i className="cr8-pt" /></span>
              <b>{COUNTS[j] ?? 0}</b>
            </li>
          ))}
        </ul>
        <div className="cr8-u-trend">
          <span className="cr8-u-trend-l">{x.ui.reports.trend}</span>
          <span className="cr8-u-plot cr8-ln">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
              <polyline points={TREND_LINE} vectorEffect="non-scaling-stroke" />
            </svg>
            {TREND_AT.map((p) => <i key={p.x} className="cr8-pt" style={{ left: `${p.x}%`, top: `${p.y}%` }} />)}
          </span>
        </div>
      </div>
    </>
  );
};

const Portal = ({ t }: P) => {
  const c = t.roles.portal;
  const last = Math.max(1, c.stages.length - 1), now = Math.max(0, c.stages.length - 2);
  return (
    <>
      <p className="cr8-u-h cr8-ln"><span>{c.title}</span><b>{t.board.card.client}</b></p>
      <div className="cr8-u-portal">
        <b className="cr8-u-big">{c.order}</b>
        <ol className="cr8-u-axis" style={{ '--n': c.stages.length, '--to': (now / last).toFixed(3) } as CSSProperties}>
          {c.stages.map((s, j) => (
            <li key={s} data-s={j < now ? 'done' : j === now ? 'now' : undefined}>
              <i className="cr8-pt" />
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="cr8-u-note"><i className="cr8-dot" data-on="" /><span className="cr8-u-t">{c.note}</span></p>
        <ul className="cr8-u-docs">{c.docs.map((d) => <li key={d}><FileText />{d}</li>)}</ul>
      </div>
    </>
  );
};

const SCREENS = [Jobs, Clients, Week, Tasks, Access, Notes, Reports, Portal];

/** Mini-ekran modułu `i` (kolejność jak w `grow.modules`). */
export const ModScreen = ({ i, t, x }: { i: number } & P) => {
  const Body = SCREENS[i];
  return <div className="cr8-u" data-m={i}>{Body ? <Body t={t} x={x} /> : null}</div>;
};

/** Mini-ekran w ramce sceny: wielkość (`size`) i ilustracja ukryta przed czytnikami ekranu. */
export const ModFrame = ({ i, t, x, size }: { i: number; size: 's' | 'm' | 'l' } & P) => (
  <div className="cr8-as" data-size={size} aria-hidden="true"><ModScreen i={i} t={t} x={x} /></div>
);

/** Znak wolnego miejsca: gwiazdka w lewym górnym rogu pola i punkty w pozostałych rogach. Stoi spokojnie - to z niej
    rozchodzi się ekran modułu. `out` = znak schodzi tym samym rozejściem, którym wchodzi moduł (dopełnienie);
    bez `out` zostaje (puste miejsce na końcu). */
export const Spot = ({ out = false }: { out?: boolean }) => (
  <span className={out ? 'cr8-slot cr-bloom-out' : 'cr8-slot'} data-bloomed={out ? '' : undefined} aria-hidden="true">
    <i className="cr8-src" />
  </span>
);

/** Puste miejsce „na to, czego potrzebuje Twoja firma”: znak wolnego miejsca (zostaje) oraz przerywany obrys ze
    zdaniem, które rozchodzą się od gwiazdki (scena: `bloomTo` na .cr8-empty). Bez sceny stan końcowy. */
export const Empty = ({ text }: { text: string }) => (
  <div className="cr8-empty">
    <Spot />
    <div className="cr8-empty-in cr-bloom" data-bloomed=""><p className="cr8-more">{text}</p></div>
  </div>
);

/** Licznik „Włączone moduły 3 / 8”: cyfra to bęben (--cn = ile modułów doszło, ułamkowe - pisze scena na przodku),
    znaczniki zapalają się po kolei. Bez --cn stan końcowy; czytnik ekranu dostaje stan końcowy. */
export const ModCount = ({ label, n, from = START, className }: { label: string; n: number; from?: number; className?: string }) => {
  const late = Math.max(0, n - from);
  return (
    <p className={className ? `cr8-count ${className}` : 'cr8-count'}>
      <span>{label}</span>
      <b>
        <span className="cr8-reel" aria-hidden="true">
          <span className="cr8-reel-in" style={{ '--to': late } as CSSProperties}>
            {Array.from({ length: late + 1 }, (_, k) => <span key={k}>{from + k}</span>)}
          </span>
        </span>
        <span className="sr-only">{n}</span>
        <span>/ {n}</span>
      </b>
      <span className="cr8-meter" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => <i key={i} style={{ '--j': i - from } as CSSProperties} />)}
      </span>
    </p>
  );
};
