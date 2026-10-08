'use client';

import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { BellRing, Calculator, Contact, ListOrdered, NotebookPen, Reply, type LucideIcon } from 'lucide-react';
import type { AiSceneCopy } from '@/lib/i18n/uslugi/system-crm-ai';
import { lin, seg } from '../../_usluga/shared';
import { PinShell, Reel, flag, put, useStill, wipe } from './aiscene-parts';
import type { SceneProps } from './types';
import { Win } from './ui';
import './aiscene.css'; // style sekcji we własnym pliku (praca równoległa), prefiks cr6-

// SEKCJA „AI TO OPCJA, NIE OBOWIĄZEK” - scena „TORY” (przypięta, sterowana wyłącznie przewijaniem, nic do klikania).
// Wybór właściciela 2026-10-04: „wybieram tory, ale zrób ładniej to” - wersje „Dwa dni” i „Do akceptacji” usunięte.
// POJAWIANIE SIĘ = „ROZEJŚCIE” (właściciel 2026-10-05: „te wszystkie animacje linii, która leci… wywal i zrób
// animację taką pojawiania płynną, tak jak się nebula rozchodzi”): wszystko, co się pojawia, ma wspólną klasę
// .cr-bloom (generowany bloom.css). Bez linii światła i przycięć prostą krawędzią. Prawdziwy ruch zostaje: jazda
// karty, przesuwanie kolejki, liczniki-bębny, gałka znacznika.
// Jedno okno systemu, dwa tory: „Robisz Ty” i „Robi AI”. Zadania to karty (ikona, tytuł, skąd przyszło). Opowieść:
//   1. stan wyjściowy bez AI - wszystkie zadania na torze człowieka, tor AI ciemny, licznik 0,
//   2. znacznik „Opcja: AI” włącza się sam (gałka jedzie z przewijaniem) i wtedy rozchodzi się tor AI: linia toru
//      w kolorze podstrony, szyny z punktami na końcach i punkty miejsc na zadania,
//   3. zadania, które AI może przejąć, przejeżdżają na jego tor jedno po drugim, z postojem po każdym. Karta naprawdę
//      jedzie; ślad przejazdu (puste miejsce po zadaniu, szyna i obrys miejsca na torze AI w kolorze podstrony)
//      rozchodzi się, a szara szyna i punkty miejsca w tym samym rozejściu znikają.
//      Po dojeździe stan przewija się na „Do akceptacji”, a liczniki-bębny się przekręcają. Reszta kart na ten czas
//      przygasa (jedno miejsce akcji),
//   4. decyzje zostają u człowieka: przy dwóch kartach, które nie pojechały, rozchodzi się biała linia i biały punkt
//      w znaku, stan przewija się na „Twoja decyzja”,
//   5. „AI przygotowuje, Ty akceptujesz”: w znakach na torze AI po kolei rozchodzi się wypełnienie („Zaakceptowane”).
// KOMPUTER (od 1024 px): tory obok siebie, wiersz w wierszu - karta jedzie w bok po szynie między torami.
// TELEFON I TABLET (poniżej 1024 px): tory jeden pod drugim w jednej kolejce o stałej wysokości - karta zjeżdża
//   w dół pod linię między torami, karty nad nią przesuwają się o jedno miejsce w górę, a linia podnosi się razem
//   z nimi. Kolejność przejazdów od dołu (karta mija najwyżej dwie inne), więc na końcu tor AI ma zadania w zwykłej
//   kolejności. Wymiary policzone dla 320-430 px szerokości i od 625 px widocznej wysokości (aiscene.css).
// Bez JS / scena stoi (ograniczony ruch, telefon poziomo, bardzo niski telefon - `useStill`): stan końcowy
//   w zwykłej sekcji - Twoje decyzje, linia między torami, zadania na torze AI.

/** Długość drogi sceny w vh. */
const LEN = 340;
/** Oś opowieści q (po najeździe kamery): gałka znacznika „Opcja: AI”, rozejście toru AI (rusza, gdy gałka mija połowę drogi),
    przejazdy (równe okienka na zadanie), decyzje, akceptacje. Progi narratora: CUTS. */
const SWITCH: [number, number] = [0.085, 0.135];
const BLOOM: [number, number] = [0.11, 0.205];
const RIDES: [number, number] = [0.225, 0.705];
const KEEPS: [number, number] = [0.735, 0.82];
const OKS: [number, number] = [0.86, 0.975];
const CUTS = [0.085, 0.215, 0.725, 0.85];
/** Okienko jednego zadania (0-1): ślad rozchodzi się od startu (trochę wyprzedza kartę), karta jedzie, stan
    i licznik się zmieniają; reszta okienka to postój. */
const TRAIL_END = 0.56;
const GO: [number, number] = [0.16, 0.7];
const LAND: [number, number] = [0.64, 0.8];
/** Czas zaznaczenia jednej decyzji i jednej akceptacji (w jednostkach q). */
const KEEP_LEN = 0.045, OK_LEN = 0.03;
/** O tyle wcześniej (q) zadanie robi się „miejscem akcji”, zanim ruszy jego ślad. */
const LEAD = 0.012;
/** Postęp, od którego rozejście jest skończone (atrybut data-bloomed - patrz „ROZEJŚCIE” w system-crm.css). */
const DONE = 0.9995;
/** Tory jeden pod drugim - ten sam warunek co w aiscene.css. */
const STACK = '(max-width: 1023.98px)';
/** Zmienne i atrybuty pisane przez scenę (zdejmowane, gdy scena stoi). */
const ROOT_VARS = ['--sw', '--lit', '--k', '--gy'];
const ROOT_FLAGS = ['data-ai', 'data-lit', 'data-focus'];
const ROW_VARS = ['--e', '--st', '--ok', '--kp', '--ys', '--hd'];
const ROW_FLAGS = ['data-moved', 'data-kept', 'data-ride', 'data-on'];
/** Ikony zadań (kolejność = `systemCrmCopy.ai.tasks`): odpowiedź, dane klienta, wycena, przypomnienie, notatki, kolejność. */
const ICONS: LucideIcon[] = [Reply, Contact, Calculator, BellRing, NotebookPen, ListOrdered];

/** Jazda karty: bardzo miękki start i dojazd. */
const glide = (v: number) => v * v * v * (v * (v * 6 - 15) + 10);

/** Wiersz zadania i jego części, które się rozchodzą: `way` = wiersz w sieci toru AI (para `pre` / `trail`),
    `ok` = wypełnienie znaku, `mark` = biała linia decyzji. */
interface Row {
  li: HTMLElement; i: number; j: number; d: number;
  way: HTMLElement | null; pre: HTMLElement | null; trail: HTMLElement | null; ok: HTMLElement | null; mark: HTMLElement | null;
}

/** Obrys miejsca na kartę z punktów (zaokrąglony prostokąt, kreska o zerowej długości = punkt). */
const Dots = () => (
  <svg className="cr6-a-dots" aria-hidden="true" focusable="false"><rect width="100%" height="100%" rx="0.9em" /></svg>
);

export const AiLanes = ({ t, x, headId }: SceneProps<AiSceneCopy>) => {
  const a = t.ai;
  /** Miarka wysokości ekranu (element w PinShell) - z niej `useStill` wie, czy scena mieści się w ekranie. */
  const probe = useRef<HTMLElement>(null);
  const still = useStill(probe);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rows = useRef<Row[]>([]);
  /** Sieć toru AI (komputer) i linia między torami (telefon) - rozchodzą się razem z --lit. */
  const lane = useRef<{ net: HTMLElement | null; gate: HTMLElement | null }>({ net: null, gate: null });
  const lastQ = useRef(0);
  const stacked = useRef(false);
  const steps = useMemo(() => [...x.steps, a.note], [x.steps, a.note]);
  /** Miejsce zadania na swoim torze: `j` = które z kolei wśród zadań dla AI, `d` = które wśród decyzji (-1 = nie dotyczy). */
  const places = useMemo(() => a.tasks.map((task, i) => {
    const before = a.tasks.slice(0, i).filter((k) => k.ai === task.ai).length;
    return task.ai ? { j: before, d: -1 } : { j: -1, d: before };
  }), [a.tasks]);
  const n = a.tasks.length;
  const nAi = places.filter((p) => p.j >= 0).length;
  const nYou = n - nAi;
  const youNums = Array.from({ length: nAi + 1 }, (_, i) => String(n - i));
  const aiNums = Array.from({ length: nAi + 1 }, (_, i) => String(i));

  const draw = useCallback((q: number) => {
    lastQ.current = q;
    const root = bodyRef.current, list = rows.current;
    if (!root || !list.length) return;
    const stack = stacked.current;
    const slot = (RIDES[1] - RIDES[0]) / Math.max(1, nAi);
    const keepStep = (KEEPS[1] - KEEPS[0] - KEEP_LEN) / Math.max(1, nYou - 1);
    const okStep = (OKS[1] - OKS[0] - OK_LEN) / Math.max(1, nAi - 1);

    // znacznik i tor AI: gałka jedzie, a tor AI się rozchodzi (--lit = --bloom sieci i linii między torami)
    const sw = seg(q, SWITCH[0], SWITCH[1]), lit = seg(q, BLOOM[0], BLOOM[1]);
    put(root, '--sw', sw.toFixed(4));
    put(root, '--lit', lit.toFixed(4));
    flag(root, 'data-ai', sw > 0.5);
    flag(root, 'data-lit', lit > 0.5);
    const { net, gate } = lane.current;
    if (net) flag(net, 'data-bloomed', lit > DONE);
    if (gate) flag(gate, 'data-bloomed', lit > DONE);

    // `before` = ile zadań z wyższych wierszy zjechało już na tor AI (telefon: o tyle miejsc karta stoi wyżej)
    let before = 0, k = 0, act = -1, actTurn = -1;
    list.forEach(({ li, i, j, d, way, pre, trail, ok: okEl, mark }) => {
      if (j < 0) {
        // decyzja: zostaje na torze człowieka; na końcu rozchodzi się przy niej biała linia i punkt w znaku
        const from = KEEPS[0] + Math.max(0, d) * keepStep, kp = seg(q, from, from + KEEP_LEN);
        put(li, '--kp', kp.toFixed(4));
        put(li, '--st', kp.toFixed(4));
        flag(li, 'data-kept', kp > 0.5);
        if (okEl) flag(okEl, 'data-bloomed', kp > DONE);
        if (mark) flag(mark, 'data-bloomed', kp > DONE);
        if (stack) put(li, '--ys', (i - before).toFixed(4));
        return;
      }
      // komputer: zadania jadą od góry; telefon: od dołu (karta mija wtedy najwyżej dwie inne)
      const turn = stack ? nAi - 1 - j : j, from = RIDES[0] + turn * slot, u = lin(q, from, from + slot);
      const tr = seg(u, 0, TRAIL_END), e = glide(lin(u, GO[0], GO[1])), land = seg(u, LAND[0], LAND[1]);
      const okFrom = OKS[0] + j * okStep, ok = seg(q, okFrom, okFrom + OK_LEN);
      k += land;
      put(li, '--e', e.toFixed(4));
      put(li, '--st', (land + ok).toFixed(4));
      put(li, '--ok', ok.toFixed(4));
      flag(li, 'data-moved', land > 0.5);
      flag(li, 'data-ride', e > 0.001 && e < 0.999);
      // ślad przejazdu rozchodzi się, szara szyna znika (para .cr6-a-pre / .cr6-a-trail z tym samym postępem)
      if (way) put(way, '--bloom', tr.toFixed(4));
      if (pre) flag(pre, 'data-bloomed', tr > DONE);
      if (trail) flag(trail, 'data-bloomed', tr > DONE);
      if (okEl) flag(okEl, 'data-bloomed', ok > DONE);
      // telefon: miejsce w kolejce - z bieżącego na torze człowieka na stałe miejsce na torze AI
      if (stack) {
        const s0 = i - before, s1 = nYou + j;
        put(li, '--ys', (s0 + (s1 - s0) * e).toFixed(4));
        put(li, '--hd', e.toFixed(4));
      }
      // miejsce akcji: zadanie, które ruszyło jako ostatnie (także na postoju po dojeździe)
      if (turn > actTurn && q >= from - LEAD && q < KEEPS[0] - LEAD) { act = i; actTurn = turn; }
      before += e;
    });
    put(root, '--k', k.toFixed(4));
    if (stack) put(root, '--gy', (n - before).toFixed(4));
    // jedno miejsce akcji: zadanie w drodze jasne, reszta przygaszona; przy „decyzjach” jasne są te, które zostają
    const keeping = act < 0 && q >= KEEPS[0] - LEAD && q < OKS[0] - LEAD;
    flag(root, 'data-focus', act >= 0 || keeping);
    list.forEach(({ li, i, j, way }) => {
      const on = act >= 0 ? i === act : keeping && j < 0;
      flag(li, 'data-on', on);
      if (way) flag(way, 'data-on', on);
    });
  }, [n, nAi, nYou]);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const net = root.querySelector<HTMLElement>('.cr6-a-net'), gate = root.querySelector<HTMLElement>('.cr6-a-gate');
    lane.current = { net, gate };
    rows.current = Array.from(root.querySelectorAll<HTMLElement>('.cr6-a-row')).map((li, i) => {
      const way = root.querySelector<HTMLElement>(`.cr6-a-way[data-i="${i}"]`);
      return {
        li, i,
        j: li.dataset.j === undefined ? -1 : Number(li.dataset.j),
        d: li.dataset.d === undefined ? -1 : Number(li.dataset.d),
        way,
        pre: way ? way.querySelector<HTMLElement>('.cr6-a-pre') : null,
        trail: way ? way.querySelector<HTMLElement>('.cr6-a-trail') : null,
        ok: li.querySelector<HTMLElement>('.cr6-a-sign-ok'),
        mark: li.querySelector<HTMLElement>('.cr6-a-mark'),
      };
    });
    if (still) {
      // scena stoi: zostaje stan końcowy z CSS (--bloom = 1, bez atrybutów)
      wipe(root, ROOT_VARS, ROOT_FLAGS);
      wipe(net, [], ['data-bloomed']);
      wipe(gate, [], ['data-bloomed']);
      rows.current.forEach(({ li, way, pre, trail, ok, mark }) => {
        wipe(li, ROW_VARS, ROW_FLAGS);
        wipe(way, ['--bloom'], ['data-on']);
        [pre, trail, ok, mark].forEach((el) => wipe(el, [], ['data-bloomed']));
      });
      return;
    }
    // układ torów (obok siebie / jeden pod drugim) zmienia kolejność przejazdów - po zmianie rysujemy od nowa
    const m = window.matchMedia(STACK);
    const sync = () => { stacked.current = m.matches; draw(lastQ.current); };
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, [still, draw]);

  return (
    <PinShell t={t} headId={headId} len={LEN} steps={steps} cuts={CUTS} onFrame={draw} still={still} probe={probe}>
      <Win app={t.app} className="cr6-a-win">
        <div ref={bodyRef} className="cr6-a" style={{ '--n': n, '--na': nAi, '--ny': nYou } as CSSProperties}>
          <p className="cr6-a-head" data-lane="you" aria-hidden="true">
            <Reel items={youNums} className="cr6-a-num" hidden />
            <span className="cr6-a-name">{a.you}</span>
          </p>
          <p className="cr6-a-head" data-lane="ai" aria-hidden="true">
            <Reel items={aiNums} className="cr6-a-num" hidden />
            <span className="cr6-a-name">{a.ai}</span>
            <span className="cr6-a-opt"><span>{a.switch}</span><span className="cr6-sw"><i /></span></span>
          </p>
          <div className="cr6-a-field">
            {/* komputer: sieć toru AI pod kartami - rozchodzi się, gdy włącza się znacznik; w niej ślady przejazdów */}
            <span className="cr6-a-net cr-bloom" aria-hidden="true">
              <span className="cr6-a-net-in">
                <i className="cr6-a-top" />
                {a.tasks.map((task, i) => (task.ai ? (
                  <span key={task.t} className="cr6-a-way" data-i={i} style={{ '--i': i } as CSSProperties}>
                    <span className="cr6-a-pre cr-bloom-out"><Dots /></span>
                    <span className="cr6-a-trail cr-bloom"><Dots /><i className="cr6-a-dock" /></span>
                  </span>
                ) : null))}
              </span>
            </span>
            {/* telefon: pionowa szyna, na której stoją punkty zadań */}
            <i className="cr6-a-track" aria-hidden="true" />
            <ul className="cr6-a-rows">
              {a.tasks.map((task, i) => {
                const { j, d } = places[i];
                const Icon = ICONS[i % ICONS.length];
                return (
                  <li
                    key={task.t} className="cr6-a-row" data-kind={task.ai ? 'ai' : 'you'}
                    data-j={j >= 0 ? j : undefined} data-d={d >= 0 ? d : undefined} style={{ '--i': i } as CSSProperties}
                  >
                    <div className="cr6-a-card">
                      {!task.ai && <i className="cr6-a-mark cr-bloom" aria-hidden="true" />}
                      <span className="cr6-a-ico" aria-hidden="true"><Icon /></span>
                      <b className="cr6-a-t">{task.t}<span className="sr-only"> ({task.ai ? a.ai : a.you})</span></b>
                      <span className="cr6-a-meta">
                        <span className="cr6-a-ctx">{x.details[i]}</span>
                        <span className="cr6-a-st">
                          <span className="cr6-a-sign" aria-hidden="true">
                            <i className="cr6-a-sign-ok cr-bloom">
                              {task.ai && <svg viewBox="0 0 16 16" focusable="false"><path d="M4 8.4l2.7 2.7L12 5.4" /></svg>}
                            </i>
                          </span>
                          <Reel items={task.ai ? [x.todo, x.ready, x.approved] : [x.todo, x.yours]} />
                        </span>
                      </span>
                    </div>
                  </li>
                );
              })}
              {/* telefon: linia między torami (rozchodzi się, gdy włącza się znacznik) i wisząca na niej szyna toru AI */}
              <li className="cr6-a-gate cr-bloom" aria-hidden="true">
                <i className="cr6-a-gate-ln" />
                <i className="cr6-a-drop" />
              </li>
            </ul>
          </div>
        </div>
      </Win>
    </PinShell>
  );
};
