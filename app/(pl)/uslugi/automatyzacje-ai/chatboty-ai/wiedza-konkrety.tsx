'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { seg } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, Words, setNarr, setVar, type SparkState } from './talk';
import { FAR, KnowList, NEAR, Plane, useCalm, useScene } from './wiedza';
import './wiedza-konkrety.css'; // style tej wersji (prefiks ch-kf-); wspólne części przypiętych scen: wiedza.css

// SEKCJA „WIEDZA”, wersja „KONKRETY” (runda 4 sekcji Wiedza - właściciel odrzucił sześć scen-diagramów z dokumentami:
// „nie czuję tej sekcji”; wybiera sceny pełnoekranowe, WIELKIE i czytelne od razu, jak zegar w noc.tsx).
// Jeden pomysł na cały ekran: bohaterem jest sam KONKRET. Jedno pytanie naraz, a kluczowy fakt odpowiedzi stoi
// OGROMNY - pełny, ciężki, przy lewej krawędzi kontenera (zegar nocy jest cienki i wyśrodkowany - to jego rodzeństwo
// w skali, nie kopia). Pod nim pełne zdanie odpowiedzi i podpis źródła.
// Tablica (.ch-kf-slot) = okno na jedno pole; w nim pionowy pasek czterech pól (trzy konkrety + znak zapytania).
// Przy następnym pytaniu pasek PRZEWIJA SIĘ jak tablica odjazdów: stara wartość wychodzi górą, nowa wjeżdża od dołu
// (prawdziwy ruch w oknie, nigdy przenikanie). To, co asystent wie, jest pełne i białe; to, czego nie wie, jest
// PUSTE W ŚRODKU (sam obrys znaku zapytania). Wtedy mówi, że nie będzie zgadywać, a pytanie trafia do człowieka.
// Przypięta scena (100svh + 300vh), trzy takty narratora:
//   1. tablica przewija się powoli przez konkrety i wraca na pierwszy (asystent poznaje materiały) - bez pytania,
//   2. trzy pytania po kolei: tablica staje na konkrecie, konkret zapala się na biało, obok zdanie i źródło,
//   3. pytanie spoza wiedzy: tablica staje na pustym znaku zapytania -> odpowiedź -> przekazanie człowiekowi.
// Zmienne pisane z przewijania (na .ch-kf-pin): --roll położenie paska (0-3, każdy krok z miękkim startem i końcem),
// --p postęp sceny (plany gwiazd). Reszta to stan Reacta `act`, zmieniany tylko na progach ACT:
//   0 nauka · 1 pytanie 1 · 2 konkret 1 + odpowiedź · 3 pytanie 2 · 4 konkret 2 · 5 pytanie 3 · 6 konkret 3 ·
//   7 pytanie spoza wiedzy · 8 znak zapytania zapalony (gwiazda dalej szuka) · 9 odpowiedź · 10 u człowieka.
// Oś czasu jest rozpisana pod TRZY konkrety (`know.big`) - po zmianie ich liczby trzeba poprawić progi.
// Bez JS / ograniczony ruch / niski ekran: nagłówek, lista pytań z odpowiedziami (KnowList), narrator jako lista.
// Rozmowa to PRZYKŁAD (etykieta `sample`, wymyślona firma).

type P = { t: ChatbotsCopy; locale: Locale };

const NARR_AT = [0.02, 0.2, 0.66, 1];
const ACT = [0.2, 0.28, 0.36, 0.45, 0.52, 0.61, 0.68, 0.78, 0.83, 0.9];
/** `act`, od którego trwa pytanie spoza wiedzy (+1 znak zapytania zapalony, +2 odpowiedź, +3 u człowieka). */
const MISS = 7;
/** Przewinięcia tablicy o jedno pole [początek, koniec postępu]: po pytaniu 2, po pytaniu 3 i po pytaniu spoza wiedzy. */
const ROLLS: ReadonlyArray<readonly [number, number]> = [[0.38, 0.44], [0.54, 0.6], [0.7, 0.78]];

export const KnowFacts = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know, miss = k.cite.miss;
  const n = k.big.length;
  const pin = useRef<HTMLDivElement>(null);
  // serwer i pierwszy render: stan końcowy; stan początkowy ustawia pierwsza klatka sceny
  const actRef = useRef(ACT.length);
  const [act, setAct] = useState(ACT.length);

  useScene(pin, (p, e, el) => {
    // takt 1: tablica idzie przez konkrety (pierwszy krok już przy wjeździe sceny) i wraca na pierwszy - staje na nim
    // tuż po pierwszym pytaniu; dalej po jednym polu na pytanie
    let roll = seg(e, 0.3, 1) + seg(p, 0, 0.09) - seg(p, 0.12, 0.26) * 2;
    for (const [from, to] of ROLLS) roll += seg(p, from, to);
    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--roll', roll.toFixed(4));
    setNarr(el, p, NARR_AT);
    let a = 0;
    for (const x of ACT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  // bieżąca wymiana (0-2 konkrety, n = spoza wiedzy) i pole tablicy, które świeci (-1 = wszystkie przygaszone)
  const turn = act < 1 ? -1 : Math.min(n, Math.floor((act - 1) / 2));
  const lit = act > MISS ? n : act > 0 && act % 2 === 0 ? act / 2 - 1 : -1;
  const missOn = turn === n;
  const missSpark: SparkState = !missOn || act >= MISS + 3 ? 'idle' : act >= MISS + 2 ? 'speak' : 'think';

  return (
    <section className="ch-sec ch-k ch-kf" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-kf-pin">
        <div className="ch-k-stage">
          <div className="ch-k-scene" aria-hidden="true">
            <Plane items={FAR} depth="far" />
            <Plane items={NEAR} depth="near" />
          </div>
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-only ch-kf-side" aria-hidden="true">
              <p className="ch-k-meta ch-kf-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
              <div className="ch-kf-stack">
                {/* tablica: kreski = spis tego, co asystent wie (ostatnia pusta w środku), okno i pasek pól */}
                <div className="ch-kf-board">
                  <div className="ch-kf-ticks">
                    {k.big.map((x, i) => <i key={x.q} style={{ '--i': i } as CSSProperties} />)}
                    <i data-void="" style={{ '--i': n } as CSSProperties} />
                  </div>
                  <div className="ch-kf-slot">
                    <div className="ch-kf-strip">
                      {k.big.map((x, i) => (
                        <p key={x.q} className="ch-kf-fact" data-on={lit === i ? '' : undefined} style={{ '--i': i } as CSSProperties}>
                          {x.value}
                          <span className="ch-kf-unit">{x.unit}</span>
                        </p>
                      ))}
                      <p className="ch-kf-fact" data-on={lit === n ? '' : undefined} style={{ '--i': n } as CSSProperties}>
                        <span className="ch-kf-void">?</span>
                        <span className="ch-kf-note">{miss.note}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* jedno miejsce rozmowy: pytanie nad tablicą, odpowiedź ze źródłem pod nią (środkowy wiersz wymiany
                    jest pusty - stoi w nim tablica) */}
                <div className="ch-k-turns">
                  {k.big.map((x, i) => {
                    const on = turn === i, said = act === 2 * i + 2;
                    return (
                      <div key={x.q} className="ch-k-turn ch-kf-turn" data-on={on ? '' : undefined}>
                        <Msg who="client" label={t.speakers.client} text={x.q} state={on ? 'on' : 'off'} />
                        <div className="ch-kf-reply">
                          <Spark state={said ? 'speak' : on ? 'think' : 'idle'} />
                          <p className="ch-k-ans ch-say" data-say={said ? '1' : '0'}><Words text={x.say} /></p>
                          <p className="ch-k-src" data-on={said ? '' : undefined}><span>{k.sourceLabel}</span> {x.src}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="ch-k-turn ch-kf-turn" data-on={missOn ? '' : undefined}>
                    <Msg who="client" label={t.speakers.client} text={miss.q} state={missOn ? 'on' : 'off'} />
                    <div className="ch-kf-reply">
                      <Spark state={missSpark} />
                      <p className="ch-k-ans ch-say" data-say={act >= MISS + 2 ? '1' : '0'}><Words text={miss.text} /></p>
                      <div className="ch-kf-hand" data-on={act >= MISS + 3 ? '' : undefined}>
                        <i><User /></i>
                        {/* samo zdanie o przekazaniu (dawny podpis „bez zgadywania: Twój zespół” nad nim powtarzał to samo) */}
                        <div className="ch-kf-hand-in">
                          <p className="ch-kf-hand-t">{miss.hand}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
