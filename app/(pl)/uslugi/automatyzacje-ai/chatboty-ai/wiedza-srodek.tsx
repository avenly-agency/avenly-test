'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, Words, setNarr, setVar } from './talk';
import { FAR, KnowList, NEAR, Plane, SRC, useCalm, useScene } from './wiedza';
import './wiedza-srodek.css'; // style tej wersji (prefiks ch-ki-); części wspólne: wiedza.css i chatboty.css

// SEKCJA „WIEDZA” (runda 3, propozycja „W środku”) - „Zna Twoją ofertę. Nie zmyśla.” jako opowieść KAMERY.
// Przypięta scena (100svh + 300vh), trzy takty narratora:
//   1. Zaczynamy W ŚRODKU asystenta: pięć dokumentów firmy wypełnia ekran (przy wjeździe sceny przylatują po kolei).
//      Kamera się cofa - dokumenty maleją i zbiegają się w jeden punkt: gwiazdę asystenta (jest z nich zrobiona).
//   2. Kamera cofa się dalej: gwiazda okazuje się autorem odpowiedzi w rozmowie - pytanie klienta, odpowiedź słowo
//      po słowie, linia z impulsem od gwiazdy do podpisu źródła.
//   3. Pytanie spoza wiedzy: kamera nurkuje z powrotem W gwiazdę, dokumenty wracają przygaszone, linia przegląda je
//      po kolei (biel, nie kolor podstrony - nic nie pasuje), kamera wychodzi, asystent mówi, że nie będzie zgadywać,
//      a linia z impulsem prowadzi od gwiazdy do człowieka.
// Dwie warstwy skalowane wokół JEDNEGO punktu - punktu gwiazdy (--sx / --sy w px sceny, liczy scena z pomiaru):
//   .ch-ki-docs - gromada dokumentów, scale(--mz); nad nią nieskalowane promienie do środka (.ch-ki-spokes),
//   .ch-ki-talk - rozmowa: gwiazda w punkcie 0 x 0, scale(--cz). Kolumna rozmowy leży na BLIŻSZYM planie
//                 (.ch-ki-near - jeszcze raz scale(--cz)): przy najeździe ucieka za krawędź ekranu szybciej, niż rośnie
//                 gwiazda, więc „w gwieździe” nie widać nic poza nią, a oddalenie odsłania rozmowę zza krawędzi
//                 (bez przenikania).
// `act` (stan Reacta, zmieniany tylko na progach ACT_AT): 1 pytanie 1 (jeszcze za krawędzią ekranu) · 2 odpowiedź 1 ·
// 3 źródło · 4 gwiazda milknie · 5 pytanie 2 w tym samym miejscu · 6 kamera nurkuje (gwiazda myśli) · 7 odpowiedź 2 ·
// 8 przekazanie zespołowi.
// Bez JS / ograniczony ruch / niski ekran: nagłówek, lista pytań z odpowiedziami (KnowList) i narrator jako lista.

type P = { t: ChatbotsCopy; locale: Locale };
type Pt = { x: number; y: number };
type Geo = { vw: number; vh: number; ok: boolean; cx: number; cy: number; ax: number; ay: number; tall: boolean };

const NARR_AT = [0.02, 0.22, 0.64, 1];
const ACT_AT = [0.21, 0.36, 0.42, 0.47, 0.62, 0.66, 0.93, 0.955];
/** Dwie wypowiedzi w jednym miejscu: pytanie z materiałów (Cennik) i pytanie spoza wiedzy. */
const TURNS = [0, 3];
/** Skala gromady po zbiegnięciu w gwiazdę i skala rozmowy, gdy kamera jest „w gwieździe”. */
const MZ_MIN = 0.05, CZ_MAX = 3.4;
/** Skala gromady przy przeglądzie dokumentów (szeroko mniejsza niż w takcie 1; na telefonie stos i tak mieści się cały). */
const SCAN_WIDE = 0.62, SCAN_TALL = 0.88;
const SCAN_FROM = 0.76, SCAN_TO = 0.87;
/** Środki kart względem punktu gwiazdy - szeroko w (vw, vh): Cennik, Opisy produktów, Regulamin, Godziny, FAQ. */
const WIDE: Pt[] = [{ x: -27, y: -13 }, { x: 0, y: -22 }, { x: 27, y: -11 }, { x: -13, y: 12 }, { x: 15, y: 14 }];
/** Poniżej 1024 px: luźny stos schodzący kaskadą (każda nazwa zostaje odsłonięta) - przesunięcie karty w bok [vw]. */
const TALL_X = [-10, 11, -13, 9, -2];
/** Stos na telefonie - te same liczby co w wiedza-srodek.css: góra pierwszej karty, pole stosu, krok kaskady. */
const PILE_TOP = 100, PILE_STEP = [40, 60], PILE_HALF = 70;
/** Własny obrót karty [deg] i głębia (karta zbiega się odrobinę wcześniej albo później niż gromada). */
const ROT = [-4, 3, 5, -3, 2];
const DEPTH = [0.18, -0.22, 0.26, -0.14, 0.1];
/** Gwiazda przy rozmowie (miejsce autora). Szeroko: 6% szerokości sceny od krawędzi kontenera (w readGeo), na 42%
    wysokości. Poniżej 1024 px: 46 px od lewej krawędzi, na 34% wysokości (nie wyżej niż 196 px) - pytanie mieści się
    nad gwiazdą pod nawigacją, a odpowiedź z podpisem nad zdaniem narratora. */
const STAR_TALL_X = 46;
const starY = (h: number, tall: boolean) => (tall ? Math.max(h * 0.34, 196) : h * 0.42);

/** Geometria z pomiaru (raz na rozmiar okna): środek sceny, miejsce gwiazdy przy rozmowie, promienie do kart.
    Zanim scena dostanie rozmiar (przed data-live), zwraca przybliżenie z okna z `ok: false` - bez zapamiętania. */
const readGeo = (pin: HTMLElement, scene: HTMLElement | null, box: HTMLElement | null, vw: number, vh: number): Geo => {
  const tall = vw < 1024;
  const w = scene?.clientWidth ?? 0, h = scene?.clientHeight ?? 0;
  if (!w || !h) return { vw, vh, ok: false, cx: vw / 2, cy: vh / 2, ax: tall ? STAR_TALL_X : vw * 0.14, ay: starY(vh, tall), tall };
  // lewa krawędź treści kontenera (px-6 = 24 px) względem sceny
  const left = box ? box.getBoundingClientRect().left - pin.getBoundingClientRect().left + 24 : 24;
  const step = Math.min(PILE_STEP[1], Math.max(PILE_STEP[0], (h * 0.58 - 250) / 4));
  pin.querySelectorAll<HTMLElement>('.ch-ki-spoke').forEach((s, i) => {
    const dx = ((tall ? TALL_X[i] : WIDE[i].x) * vw) / 100;
    const dy = tall ? PILE_TOP - h / 2 + i * step + PILE_HALF : (WIDE[i].y * vh) / 100;
    setVar(s, '--a', ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(2));
    setVar(s, '--l', Math.hypot(dx, dy).toFixed(1));
  });
  return { vw, vh, ok: true, cx: w / 2, cy: h / 2, ax: tall ? STAR_TALL_X : left + w * 0.06, ay: starY(h, tall), tall };
};

export const KnowInside = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know;
  const sheets = k.sheets.slice(0, WIDE.length);
  const pin = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);
  const geo = useRef<Geo | null>(null);
  const actRef = useRef(0);
  const [act, setAct] = useState(0);

  useScene(pin, (p, e, el) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    let g = geo.current;
    if (!g || g.vw !== vw || g.vh !== vh) {
      g = readGeo(el, scene.current, box.current, vw, vh);
      geo.current = g.ok ? g : null;
    }
    if (!cards.current[0]?.isConnected) cards.current = Array.from(el.querySelectorAll<HTMLElement>('.ch-ki-card'));
    const n = cards.current.length;

    // gromada dokumentów: takt 1 - z pełnego ekranu do punktu (wykładniczo, jak oddalenie kamery); takt 3 - wynurza
    // się z gwiazdy do skali przeglądu i po przeglądzie znów się w nią zbiega
    const mz = p < 0.5
      ? Math.pow(MZ_MIN, seg(p, 0.04, 0.2))
      : MZ_MIN * Math.pow((g.tall ? SCAN_TALL : SCAN_WIDE) / MZ_MIN, seg(p, 0.72, 0.765) * (1 - seg(p, 0.87, 0.9)));
    // ostatni odcinek zbiegania: gromada gaśnie dokładnie wtedy, gdy gwiazda się z niej skrapla
    const cond = clamp01((0.12 - mz) / (0.12 - MZ_MIN));
    // kamera rozmowy: 0 = w gwieździe (gwiazda na środku ekranu), 1 = rozmowa (gwiazda na swoim miejscu autora).
    // Drugie wyjście kończy się przed progiem odpowiedzi 2 - słowa zaczynają się w ułożonej już kompozycji.
    const far = p < 0.5 ? seg(p, 0.2, 0.34) : 1 - seg(p, 0.66, 0.76) * (1 - seg(p, 0.88, 0.935));
    const cz = Math.pow(CZ_MAX, 1 - far);
    // nurkowanie: kamera przelatuje przez gwiazdę (rośnie i gaśnie); w pozostałych miejscach gwiazda się skrapla
    const into = p >= 0.6 && p < 0.82;
    const inDocs = Math.log(mz / MZ_MIN) / Math.log(1 / MZ_MIN);
    const scan = lin(p, SCAN_FROM, SCAN_TO);
    const hot = p >= SCAN_FROM && p < SCAN_TO ? Math.min(n - 1, Math.floor(scan * n)) : -1;

    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--b', lin(e, 0.25, 1).toFixed(4));
    setVar(el, '--mz', mz.toFixed(4));
    setVar(el, '--do', (1 - cond).toFixed(3));
    setVar(el, '--sp', (clamp01((0.5 - mz) / 0.25) * (1 - cond)).toFixed(3));
    setVar(el, '--ss', (into ? 1 + (1 - cond) * 1.8 : 0.2 + cond * 0.8).toFixed(3));
    setVar(el, '--so', Math.min(1, cond * 3).toFixed(3));
    setVar(el, '--cz', cz.toFixed(4));
    setVar(el, '--sx', (g.cx + (g.ax - g.cx) * far).toFixed(2));
    setVar(el, '--sy', (g.cy + (g.ay - g.cy) * far).toFixed(2));
    setVar(el, '--cam', ((inDocs + 1 - far) / 2).toFixed(4));
    setVar(el, '--dim', p >= 0.5 ? '1' : '0');
    setVar(el, '--sc', (scan * n).toFixed(3));
    cards.current.forEach((c, j) => {
      if (c.hasAttribute('data-hot') !== (j === hot)) c.toggleAttribute('data-hot', j === hot);
    });
    setNarr(el, p, NARR_AT);
    let a = 0;
    for (const x of ACT_AT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  const spark = act < 2 || act === 6 ? 'think' : act === 4 || act === 5 ? 'idle' : 'speak';

  return (
    <section className="ch-sec ch-k ch-ki" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-ki-pin">
        <div className="ch-k-stage">
          <div ref={scene} className="ch-k-scene" aria-hidden="true">
            <Plane items={FAR} depth="far" />

            {/* promienie od kart do punktu gwiazdy: widać je tylko, gdy gromada jest mała (czytelne zbieganie) */}
            <div className="ch-ki-spokes">
              {sheets.map((s) => <i key={s.name} className="ch-ki-spoke" />)}
            </div>

            <div className="ch-ki-docs">
              {sheets.map((s, i) => (
                <div
                  key={s.name}
                  className="ch-ki-card"
                  style={{ '--i': i, '--xw': WIDE[i].x, '--yw': WIDE[i].y, '--xt': TALL_X[i], '--r': ROT[i], '--pz': DEPTH[i] } as CSSProperties}
                >
                  <div className="ch-ki-sheet ch-lit">
                    <b>{s.name}</b>
                    <div className="ch-ki-lines">
                      {s.lines.map((l) => <span key={l}>{l}</span>)}
                      <i className="ch-ki-scan" />
                    </div>
                    <i /><i /><i /><i />
                  </div>
                </div>
              ))}
            </div>

            <div className="ch-ki-talk">
              {/* gwiazda = punkt 0 x 0 kompozycji; pole wokół niej to cel blasku mgławicy (ma własny rozmiar) */}
              <div className="ch-ki-core" data-sky=""><Spark state={spark} /></div>
              <div className="ch-ki-near">
                <div className="ch-ki-col">
                  <p className="ch-k-meta ch-ki-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
                  <div className="ch-k-turns">
                    {TURNS.map((i, j) => {
                      const x = k.items[i];
                      const hand = SRC[i] < 0;
                      const on = j ? act >= 5 : act >= 1 && act < 5;
                      const said = j ? act >= 7 : act >= 2;
                      const cited = j ? act >= 8 : act >= 3;
                      return (
                        <div key={i} className="ch-k-turn" data-on={on ? '' : undefined}>
                          <Msg who="client" label={t.speakers.client} text={x.q} state={on ? 'on' : 'off'} />
                          <div className="ch-ki-reply" data-on={cited ? '' : undefined} data-hand={hand ? '' : undefined}>
                            <div className="ch-ki-say">
                              <p className="ch-k-ans ch-say" data-say={said ? '1' : '0'}><Words text={x.a} /></p>
                              <i className="ch-ki-rail" />
                              <i className="ch-ki-drop" />
                            </div>
                            <div className="ch-ki-foot">
                              <p className="ch-k-src" data-on={cited ? '' : undefined}>
                                <span>{hand ? k.handLabel : k.sourceLabel}</span> {x.src}
                              </p>
                              {hand && (
                                <span className="ch-k-node ch-k-team ch-ki-team" data-on={cited ? '' : undefined}>
                                  <i><User /></i>
                                  {k.team}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Plane items={NEAR} depth="near" />
          </div>
          <div ref={box} className="ch-k-stage-in container mx-auto px-6">
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
