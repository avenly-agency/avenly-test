'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { lin, seg } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, Words, setNarr, setVar } from './talk';
import { FAR, KnowList, NEAR, Plane, SRC, useCalm, useScene } from './wiedza';
import './wiedza-warstwy.css'; // style tej wersji (prefiks ch-kl-); części wspólne: wiedza.css, chatboty.css

// SEKCJA „WIEDZA” - wersja „WARSTWY” (runda 3: „bardziej premium animacje”). Przypięta scena (100svh + 280vh).
// Materiały firmy = rozłożony stos pięciu szklanych płyt (po jednej na źródło, kolejność `k.sheets`), DUŻY, w rzucie
// równoległym („izometria” bez perspektywy: każda płyta stoi w 2D na osi i sama ma obrót rotateX + rotateZ).
// Nad stosem wisi gwiazda asystenta, pod nim stoi człowiek. Pytanie = punkt światła (sonda), który schodzi z gwiazdy
// pionową osią przez płyty:
//   1. budowa: płyty opadają od dołu stosu ku górze, potem rysuje się oś i pojawia gwiazda,
//   2. dwa pytania ze źródłem: sonda zatrzymuje się na płycie z odpowiedzią - płyta wysuwa się ze stosu jak szuflada
//      (w swojej płaszczyźnie), jej krawędź zapala się kolorem podstrony, a linijki dostają zakreślenie markerem;
//      płyty mijane po drodze błyskają białą krawędzią,
//   3. pytanie spoza wiedzy: sonda przechodzi przez WSZYSTKIE płyty bez postoju (każda tylko błyska), wychodzi ze
//      stosu i ląduje u człowieka. „Nie zmyśla” widać bez słów.
// Obok JEDNO miejsce rozmowy (pytanie -> odpowiedź -> podpis źródła); narrator w lewym dolnym rogu.
// Jednostka osi = odstęp płyt na ekranie (--gs w CSS): gwiazda -3,35 · płyta i = i - 2 · człowiek 3,45.
// `act` (stan Reacta, tylko na progach ACT): 0 budowa · 1 pytanie 1 · 2 odpowiedź 1 · 3 pytanie 2 · 4 odpowiedź 2 ·
// 5 pytanie spoza wiedzy (sonda leci) · 6 sonda u człowieka · 7 odpowiedź z przekazaniem.
// Cała geometria (rozmiary, kąt kamery, układ telefonu) żyje w CSS - scena pisze tylko zmienne z przewijania.

type P = { t: ChatbotsCopy; locale: Locale };

const NARR_AT = [0.02, 0.2, 0.66, 1];
const ACT = [0.2, 0.3, 0.455, 0.56, 0.68, 0.86, 0.88];
/** Położenia na osi w jednostkach --gs (takie same liczby stoją w wiedza-warstwy.css). */
const STAR = -3.35, TEAM = 3.45;
/** Pytania sceny (indeksy w `k.items`): dwa ze źródłem (płyty SRC[0] i SRC[1]) i jedno spoza wiedzy. */
const ASKS = [0, 1, 3];
/** Początek kolejnych pytań w postępie sceny. */
const ASK_AT = [0.2, 0.455, 0.68];
/** Lot sondy dla kolejnych pytań: [start, koniec]. Ostatni lot jest wolny - przez cały stos do człowieka. */
const FLY: readonly (readonly [number, number])[] = [[0.215, 0.27], [0.465, 0.53], [0.7, 0.86]];
/** Płyta z odpowiedzią: [wysuwa się od, do, wraca od, do]. */
const OUT: readonly (readonly [number, number, number, number])[] = [[0.27, 0.33, 0.4, 0.44], [0.53, 0.59, 0.63, 0.66]];
/** Zasięg błysku mijanej płyty (w jednostkach osi po obu stronach płyty). */
const BLINK = 0.45;

export const KnowLayers = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know;
  const pin = useRef<HTMLDivElement>(null);
  const plates = useRef<HTMLElement[]>([]);
  const actRef = useRef(0);
  const [act, setAct] = useState(0);

  useScene(pin, (p, e, el) => {
    if (!plates.current[0]?.isConnected) plates.current = Array.from(el.querySelectorAll<HTMLElement>('.ch-kl-plate'));
    // bieżące pytanie, cel sondy (płyta ze źródłem albo człowiek) i jej położenie na osi
    const n = p < ASK_AT[1] ? 0 : p < ASK_AT[2] ? 1 : 2;
    const stop = SRC[ASKS[n]] ?? -1;
    const [a, b] = FLY[n];
    const f = stop < 0 ? lin(p, a, b) * 0.6 + seg(p, a, b) * 0.4 : seg(p, a, b);
    const py = STAR + ((stop < 0 ? TEAM : stop - 2) - STAR) * f;
    const seen = lin(p, a - 0.004, a + 0.008);
    const po = seen * (1 - lin(p, b, b + 0.014));
    const outs = OUT.map(([i0, i1, o0, o1]) => seg(p, i0, i1) * (1 - seg(p, o0, o1)));
    // ślad sondy na osi zostaje, póki płyta z odpowiedzią jest wysunięta (przy przekazaniu człowiekowi - do końca)
    const hold = n < 2 ? 1 - seg(p, OUT[n][2], OUT[n][3]) : 1;

    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--b', (lin(e, 0.25, 1) * 0.55 + lin(p, 0, 0.14) * 0.45).toFixed(4));
    setVar(el, '--ax', seg(p, 0.1, 0.18).toFixed(4));
    setVar(el, '--st', seg(p, 0.1, 0.16).toFixed(4));
    setVar(el, '--tm', seg(p, 0.15, 0.19).toFixed(4));
    setVar(el, '--talk', seg(p, 0.13, 0.2).toFixed(4));
    setVar(el, '--py', py.toFixed(4));
    setVar(el, '--po', po.toFixed(3));
    setVar(el, '--pt', Math.min(1, (py - STAR) / 0.75).toFixed(3));
    setVar(el, '--tr', ((py - STAR) / (TEAM - STAR)).toFixed(4));
    setVar(el, '--to', (seen * hold).toFixed(3));
    setVar(el, '--any', Math.max(...outs).toFixed(4));
    setVar(el, '--up', seg(p, 0.76, 0.88).toFixed(4));
    plates.current.forEach((pl, i) => {
      let o = 0;
      outs.forEach((v, j) => { if (SRC[ASKS[j]] === i) o = Math.max(o, v); });
      // mijana płyta błyska białą krawędzią; płyta, na której sonda staje, od razu przechodzi w kolor podstrony
      const blink = i === stop ? 0 : Math.max(0, 1 - Math.abs(py - (i - 2)) / BLINK) * po;
      setVar(pl, '--o', o.toFixed(4));
      setVar(pl, '--k', blink.toFixed(3));
    });
    setNarr(el, p, NARR_AT);
    let x = 0;
    for (const at of ACT) if (p >= at) x++;
    if (x !== actRef.current) { actRef.current = x; setAct(x); }
  }, !calm);

  const spark = act === 2 || act === 4 || act >= 7 ? 'speak' : act === 1 || act === 3 || act === 5 ? 'think' : 'idle';

  return (
    <section className="ch-sec ch-k ch-kl" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-kl-pin">
        <div className="ch-k-stage">
          <div className="ch-k-scene" aria-hidden="true">
            <Plane items={FAR} depth="far" />
            <div className="ch-kl-rig">
              {/* pole blasku mgławicy: stos jest punktem 0 x 0, więc cel tła ma własny rozmiar */}
              <i className="ch-kl-sky" data-sky="" />
              {k.sheets.map((s, i) => (
                <div key={s.name} className="ch-kl-plate ch-lit" style={{ '--i': i } as CSSProperties}>
                  <i className="ch-kl-edge" />
                  <div className="ch-kl-rows"><i /><i /><i /><i /></div>
                  <div className="ch-kl-doc">
                    <b>{s.name}</b>
                    {s.lines.map((l, j) => (
                      <span key={l} className="ch-kl-ln" style={{ '--j': j } as CSSProperties}><span>{l}</span></span>
                    ))}
                  </div>
                </div>
              ))}
              <i className="ch-kl-axis" />
              <i className="ch-kl-trail" />
              {k.sheets.map((s, i) => <i key={s.name} className="ch-kl-tick" style={{ '--i': i } as CSSProperties} />)}
              <i className="ch-kl-probe" />
              <span className="ch-k-node ch-k-team ch-kl-team" data-on={act >= 6 ? '' : undefined}>
                <i><User /></i>
                {k.team}
              </span>
              <span className="ch-k-core ch-kl-core"><Spark state={spark} /></span>
            </div>
            <Plane items={NEAR} depth="near" />
          </div>
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-only ch-kl-side" aria-hidden="true">
              <p className="ch-k-meta ch-kl-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
              <div className="ch-k-turns">
                {ASKS.map((i, j) => {
                  const it = k.items[i];
                  const on = j === 0 ? act >= 1 && act < 3 : j === 1 ? act >= 3 && act < 5 : act >= 5;
                  const said = j === 0 ? act === 2 : j === 1 ? act === 4 : act >= 7;
                  return (
                    <div key={it.q} className="ch-k-turn" data-on={on ? '' : undefined}>
                      <Msg who="client" label={t.speakers.client} text={it.q} state={on ? 'on' : 'off'} />
                      <p className="ch-k-ans ch-say" data-say={said ? '1' : '0'}><Words text={it.a} /></p>
                      <p className="ch-k-src" data-on={said ? '' : undefined}>
                        <span>{SRC[i] < 0 ? k.handLabel : k.sourceLabel}</span> {it.src}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
