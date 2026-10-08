'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { CrmRow, CrmSection, SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import type { HeroPointsCopy } from '@/lib/i18n/uslugi/system-crm-hero-points';

// Wnętrze okna przykładowego systemu „Pracowni Dąb” dla sceny głównej „Z punktów” (hero-points.tsx - scena wybrana
// przez właściciela 2026-10-04; style cr1c- w hero-points.css, wymiary w em - okno skaluje się z ekranem).
// Pulpit firmy: zakładki modułów i zespół, tablica zleceń w etapach (kolumny), zapytania i zadania (wiersze
// z kropką), tydzień w kalendarzu (kafle). Terminy na kartach (.cr1c-note) pojawiają się w finale sceny wspólnym
// „rozejściem” podstrony (klasa .cr-bloom z system-crm.css, od 2026-10-05 jedyny sposób pojawiania się rzeczy).
// Dane: wiersze z głównego słownika (`mess` - to samo, co w scenach „Porządek” i „Biurko”), karty zleceń i tydzień
// ze słownika sceny - ułożone tak, żeby się zgadzały (wycena stołu do piątku, pomiar w czwartek o 10:00).
// ZNACZNIKI DLA PŁÓTNA (hero-points.tsx mierzy je w układzie i zamienia w cele punktów):
//   data-pt="box"   obrys elementu (karta, kafel dnia),
//   data-pt="line"  dolna krawędź elementu (linia wiersza, nagłówka; data-acc = w kolorze podstrony),
//   data-pt="vline" lewa krawędź elementu (podział kolumn tablicy),
//   data-pt="dot"   kropka w kolorze podstrony - punkt ląduje dokładnie na niej, w jej rozmiarze,
//   data-pt="mark"  środek elementu (inicjał osoby) - punkt ląduje jako mała kropka,
//   data-g          grupa = kolejność zbierania: 0 kolumny, 1 wiersze, 2 kafle, 3 karty, 4 okno i paski.
// To makieta interfejsu, nie treść strony: bez nagłówków h2 / h3 (kolejność nagłówków strony zostaje h1 -> h2).

const rowsOf = (t: SystemCrmCopy, to: CrmSection): CrmRow[] => t.mess.items.filter((it) => it.to === to).flatMap((it) => it.rows);
const labelOf = (t: SystemCrmCopy, id: CrmSection) => t.mess.sections.find((s) => s.id === id)?.label ?? '';

const Rows = ({ rows, g }: { rows: CrmRow[]; g: number }) => (
  <ul className="cr1c-rows">
    {rows.map((row) => (
      <li key={row.t} className="cr1c-row" data-pt="line" data-g={g}>
        <span className="cr1c-dot" data-pt="dot" data-g={g} aria-hidden="true" />
        <span className="cr1c-row-t">{row.t}</span>
        <span className="cr1c-row-s">{row.s}</span>
      </li>
    ))}
  </ul>
);

const Pan = ({ kind, title, count, g, children }: { kind: string; title: string; count: number; g: number; children: ReactNode }) => (
  <div className={`cr1c-pan cr1c-pan--${kind}`}>
    <p className="cr1c-pan-h" data-pt="line" data-g={g}><span>{title}</span><b>{count}</b></p>
    {children}
  </div>
);

export const PointsSystem = ({ t, x }: { t: SystemCrmCopy; x: HeroPointsCopy }) => {
  const inq = rowsOf(t, 'inq'), tasks = rowsOf(t, 'task'), terms = rowsOf(t, 'cal');
  const stages = t.board.stages;
  /** Numer karty na całej tablicy (kolejność pojawiania się terminów w finale). */
  const before = stages.map((_, i) => x.board.slice(0, i).reduce((sum, col) => sum + col.length, 0));
  const jobs = x.board.reduce((sum, col) => sum + col.length, 0);
  return (
    <>
      <div className="cr1c-tabs" data-pt="line" data-g="4">
        <ul className="cr1c-tablist">
          {t.roles.modules.map((m, i) => <li key={m} data-cur={i === 0 ? '' : undefined}>{m}</li>)}
        </ul>
        <div className="cr1c-team" aria-hidden="true">
          {t.team.map((p) => <span key={p.name} className="cr1c-av" data-pt="mark" data-g="4">{p.name.charAt(0)}</span>)}
        </div>
      </div>

      <div className="cr1c-body">
        <Pan kind="board" title={t.roles.owner.listTitle} count={jobs} g={3}>
          <ol className="cr1c-cols" aria-label={t.board.stagesAria} style={{ '--n': stages.length } as CSSProperties}>
            {stages.map((stage, i) => {
              const cards = x.board[i] ?? [];
              return (
                <li key={stage} className="cr1c-col" data-pt={i > 0 ? 'vline' : undefined} data-g="0">
                  <div className="cr1c-col-h" data-pt="line" data-g="0" data-acc=""><span>{stage}</span><b>{cards.length}</b></div>
                  {cards.map((c, j) => {
                    const who = t.team[c.who] ?? t.team[0];
                    return (
                      <div key={c.t} className="cr1c-card" data-pt="box" data-g="3" data-more={j > 0 ? '' : undefined}>
                        <b className="cr1c-card-t">{c.t}</b>
                        <span className="cr1c-card-s">
                          <span className="cr1c-av" data-pt="mark" data-g="3" aria-hidden="true">{who.name.charAt(0)}</span>
                          {/* poniżej 1024 px zostaje sam klient - kto prowadzi, mówi inicjał obok (wąska karta ucinałaby napis) */}
                          <span className="cr1c-card-who">{c.c}<span className="cr1c-card-by"> · {who.name}</span></span>
                        </span>
                        <span className="cr1c-note cr-bloom" style={{ '--i': before[i] + j } as CSSProperties}>{c.note}</span>
                      </div>
                    );
                  })}
                </li>
              );
            })}
          </ol>
        </Pan>

        <div className="cr1c-low">
          <Pan kind="inq" title={labelOf(t, 'inq')} count={inq.length} g={1}>
            <Rows rows={inq} g={1} />
          </Pan>
          <Pan kind="task" title={labelOf(t, 'task')} count={tasks.length} g={1}>
            <Rows rows={tasks} g={1} />
          </Pan>
          <Pan kind="cal" title={labelOf(t, 'cal')} count={x.cal.marks.length} g={2}>
            <ol className="cr1c-days">
              {x.cal.days.map((day, i) => {
                const mark = x.cal.marks.find((m) => m.day === i);
                return (
                  <li key={day} className="cr1c-day" data-pt="box" data-g="2" data-on={mark ? '' : undefined}>
                    <span className="cr1c-day-n">{day}</span>
                    {mark && (
                      <span className="cr1c-day-m">
                        <i className="cr1c-dot" data-pt="dot" data-g="2" aria-hidden="true" />
                        <span>{mark.label}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <Rows rows={terms} g={2} />
          </Pan>
        </div>
      </div>
    </>
  );
};
