'use client';

import { createContext, useContext, useEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import type { ImpactDict } from '@/lib/i18n/home/impact';

// Wizualizacje kafli sekcji "Dlaczego Avenly" - styl KONSTELACJE (wybór właściciela 2026-09-26
// spośród 7 propozycji). Nakładka HTML (podpisy + grafika zapasowa, gdy shadera nie ma) + scena
// dla shadera (SCENES), którą rysuje VIZ_GLSL w impact/shader.tsx: węzły-gwiazdy, cienkie linie,
// impuls biegnący po liniach, zapalenie węzła, do którego dociera.
//
// Zasady: dekoracja (aria-hidden) - treść niesie tekst kafla; kolory z akcentu kafla (--ic =
// kolor shadera, --ic-hi = jasny odcień); elementy SVG w jednostkach viewBoxa, kontener ma
// proporcje viewBoxa (aspect-ratio inline), więc linie SVG i podpisy HTML skalują się razem;
// czasy w sekundach cyklu (--cyc). Impuls przelatuje odcinek w TRAVEL cyklu, rozbłysk ma szczyt
// w PEAK cyklu - obie stałe MUSZĄ zgadzać się z @keyframes w globals.css (im-pulse / im-flash /
// im-ping / im-ripple / im-tick). Bez rozmycia (decyzja właściciela).
//
// CZYTELNOŚĆ (właściciel: "żeby każdy użytkownik ogarniał, co się dzieje"): każdy kafel opowiada
// historię w 2-3 krokach (STORY) - pod wizualizacją napis bieżącego kroku z numerem i paskiem
// postępu jak w "stories"; podpisy węzłów mają ten sam numer i działają jak stepper (przed swoim
// krokiem przygaszone, w kroku jasne, potem zaliczone); w shaderze przebyte odcinki i osiągnięte
// węzły świecą do końca cyklu. Kroki zmieniają się dokładnie w chwili dotarcia impulsu: napisy
// (WAAPI), shader i animacje CSS nakładki liczą czas od wspólnego VIZ_EPOCH.

/** Wspólny początek czasu wizualizacji (ms, oś performance.now / document.timeline): shader
    kafla, napisy kroków i animacje CSS nakładki liczą od niego fazę cyklu, więc są zgrane. */
export const VIZ_EPOCH = typeof performance === 'undefined' ? 0 : performance.now();
/** Przelot odcinka = 20% cyklu (cykle 8-10,5 s → ok. 2 s). MUSI zgadzać się z @keyframes
    im-pulse w globals.css i z domyślnym przelotem w VIZ_GLSL (shader.tsx). */
const TRAVEL = 0.2;
const PEAK = 0.1;
const STAR_PATH = 'M5 0C5.35 3.3 6.7 4.65 10 5C6.7 5.35 5.35 6.7 5 10C4.65 6.7 3.3 5.35 0 5C3.3 4.65 4.65 3.3 5 0Z';
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
/** Opóźnienie animacji rozbłysku tak, żeby szczyt wypadł w chwili `at` (s) cyklu `cycle`. */
const flashDelay = (at: number, cycle: number) => `${(at - cycle * PEAK).toFixed(2)}s`;
/** Czas przelotu jednego odcinka (s) w cyklu `cycle`. */
const leg = (cycle: number) => cycle * TRAVEL;

type Place = 'r' | 'l' | 'b' | 'tr' | 'tl' | 'br';
type Kind = 'dot' | 'star' | 'ring' | 'alert';

/** Numery kroków historii dla podpisów kafla (lk → numer kroku): podpis zaczyna się tym samym
    numerem co napis kroku pod wizualizacją, więc widać, którego miejsca dotyczy krok. */
const NumCtx = createContext<Partial<Record<number, number>> | null>(null);

/** Węzeł HTML nad SVG: kropka / gwiazda / pierścień + podpis; `flash` = chwila rozbłysku (s),
    `lk` = numer podpisu w historii kafla (STORY.labels) - rozjaśnia się w swoim kroku. */
const VNode = ({ x, y, w, h, kind, label, place = 'r', flash, cycle, lk }: {
  x: number; y: number; w: number; h: number; kind: Kind; label?: string; place?: Place; flash?: number; cycle: number; lk?: number;
}) => {
  const nums = useContext(NumCtx);
  const num = lk !== undefined ? nums?.[lk] : undefined;
  return (
    <span
      className={`im-flow-node im-flow-node--${kind}${flash !== undefined ? ' is-flash' : ''}`}
      style={{
        left: pct(x, w),
        top: pct(y, h),
        ...(flash !== undefined ? { '--fd': flashDelay(flash, cycle) } : {}),
      } as CSSProperties}
    >
      {kind === 'star' ? (
        <svg className="im-flow-star" viewBox="0 0 10 10" focusable="false">
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ) : (
        <span className="im-flow-dot" />
      )}
      {label ? (
        <span className={`im-flow-label im-flow-label--${place}${num ? ' im-flow-label--num' : ''}`} data-lk={lk}>
          {num ? <b className="im-flow-num">{num}</b> : null}
          {label}
        </span>
      ) : null}
    </span>
  );
};

/** Kontener SVG wizualizacji (proporcje viewBoxa, cykl). `frameRef` - shader kafla mierzy ten
    kontener, żeby narysować scenę w jego miejscu. */
const Frame = ({ w, h, cycle, frameRef, children }: {
  w: number; h: number; cycle: number; frameRef?: Ref<HTMLDivElement>; children: ReactNode;
}) => (
  <div
    ref={frameRef}
    className="im-flow iv-topo"
    style={{ '--cyc': `${cycle}s`, aspectRatio: `${w} / ${h}` } as CSSProperties}
  >
    {children}
  </div>
);

// ---------- historia kafla: napis bieżącego kroku + pasek postępu ----------
export interface StoryStep { at: number; text: string; labels: readonly number[] }
export interface Story { cycle: number; steps: StoryStep[] }

const FADE = 0.22; // s - wygaszenie / wejście napisu i podpisu (bez nakładania dwóch napisów)
/** Reset historii: tyle sekund przed końcem cyklu podpisy wracają do stanu "przed" - razem
    z wygaszeniem śladu w shaderze (VIZ_GLSL: fade = smoothstep(cyc - 0.85, cyc - 0.2)). */
const RESET_LEAD = 0.8;
const TEXT_ON: Keyframe = { opacity: 1 };
const TEXT_OFF: Keyframe = { opacity: 0 };
type Stages = Record<'future' | 'active' | 'done', Keyframe>;

/** Klatki WAAPI ze zmian stanu w cyklu: stan początkowy + [chwila (s), nowy stan]; każde
    przejście trwa FADE s (krócej, jeśli kolejna zmiana jest bliżej). */
const timelineFrames = (start: Keyframe, changes: Array<[number, Keyframe]>, cycle: number): Keyframe[] => {
  const at = (s: number) => Math.min(Math.max(s / cycle, 0), 1);
  const out: Keyframe[] = [{ ...start, offset: 0 }];
  let cur = start;
  changes.forEach(([tm, st], i) => {
    const next = i + 1 < changes.length ? changes[i + 1][0] : cycle;
    out.push({ ...cur, offset: at(tm) }, { ...st, offset: at(Math.min(tm + FADE, next)) });
    cur = st;
  });
  out.push({ ...cur, offset: 1 });
  return out;
};

/** Okna aktywności [s, e) w cyklu → klatki WAAPI: wejście w [s, s+FADE], wyjście w [e-FADE, e]. */
const windowFrames = (wins: Array<[number, number]>, cycle: number, on: Keyframe, off: Keyframe): Keyframe[] => {
  const pts: Array<[number, boolean]> = [];
  wins.forEach(([s, e]) => {
    pts.push([s, false], [Math.min(s + FADE, e), true], [Math.max(e - FADE, s), true], [e, false]);
  });
  pts.sort((a, b) => a[0] - b[0]);
  const out: Keyframe[] = [{ ...off, offset: 0 }];
  pts.forEach(([tm, st]) => out.push({ ...(st ? on : off), offset: Math.min(Math.max(tm / cycle, 0), 1) }));
  out.push({ ...off, offset: 1 });
  return out;
};

/** Napis bieżącego kroku pod wizualizacją (z numerem kroku - tym samym co na podpisie węzła).
    Czas czyta z atrybutów (data-cyc / data-st / data-lks), animacje WAAPI startują od VIZ_EPOCH
    (zgrane z shaderem), pauza poza ekranem. Podpisy węzłów działają jak stepper. Bez JS i przed
    startem widać krok 1; reduced motion = wszystkie kroki jako statyczna numerowana lista (CSS). */
const VizStory = ({ story }: { story: Story }) => {
  const ref = useRef<HTMLElement>(null);
  const multi = story.steps.length > 1;
  const sig = `${story.cycle}|${story.steps.map((s) => `${s.at}:${s.labels.join(',')}`).join(';')}`;

  useEffect(() => {
    const cap = ref.current;
    const fig = cap?.parentElement;
    if (!cap || !fig || typeof cap.animate !== 'function') return;
    const C = Number(cap.dataset.cyc);
    const texts = Array.from(cap.querySelectorAll<HTMLElement>('[data-st]'));
    if (!(C > 0) || texts.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wins = texts.map((el, i): [number, number] => [
      Number(el.dataset.st),
      i + 1 < texts.length ? Number(texts[i + 1].dataset.st) : C,
    ]);
    const anims: Animation[] = [];
    const run = (el: Element, frames: Keyframe[]) => {
      const a = el.animate(frames, { duration: C * 1000, iterations: Infinity });
      a.startTime = VIZ_EPOCH;
      anims.push(a);
    };
    texts.forEach((el, i) => run(el, windowFrames([wins[i]], C, TEXT_ON, TEXT_OFF)));
    cap.querySelectorAll('[data-sb]').forEach((el, i) => {
      const [s, e] = wins[i];
      run(el, [
        { offset: 0, transform: 'scaleX(0)' },
        { offset: s / C, transform: 'scaleX(0)' },
        { offset: e / C, transform: 'scaleX(1)' },
        { offset: 1, transform: 'scaleX(1)' },
      ]);
    });
    const byLabel = new Map<string, Array<[number, number]>>();
    texts.forEach((el, i) => {
      (el.dataset.lks ?? '').split(',').filter(Boolean).forEach((k) => {
        byLabel.set(k, [...(byLabel.get(k) ?? []), wins[i]]);
      });
    });
    const hi = `rgb(${getComputedStyle(fig).getPropertyValue('--ic-hi').trim() || '226 232 240'}`;
    const LABEL: Stages = {
      future: { color: '#7d8899', borderColor: 'rgba(255, 255, 255, 0.07)' },
      active: { color: '#f8fafc', borderColor: `${hi} / 0.5)` },
      done: { color: '#cbd5e1', borderColor: 'rgba(255, 255, 255, 0.12)' },
    };
    const NUM: Stages = {
      future: { backgroundColor: 'rgba(0, 0, 0, 0)', color: '#7d8899', borderColor: 'rgba(125, 136, 153, 0.45)' },
      active: { backgroundColor: `${hi})`, color: '#07080c', borderColor: `${hi})` },
      done: { backgroundColor: 'rgba(0, 0, 0, 0)', color: `${hi})`, borderColor: `${hi} / 0.6)` },
    };
    const reset = C - RESET_LEAD;
    byLabel.forEach((w, k) => {
      const s = Math.min(...w.map((x) => x[0]));
      const e = Math.max(...w.map((x) => x[1]));
      if (s >= reset) return;
      const changes = (st: Stages): Array<[number, Keyframe]> => [
        [s, st.active],
        ...(e < reset - 0.05 ? [[e, st.done] as [number, Keyframe]] : []),
        [reset, st.future],
      ];
      fig.querySelectorAll(`[data-lk="${k}"]`).forEach((el) => {
        run(el, timelineFrames(LABEL.future, changes(LABEL), C));
        const num = el.querySelector('.im-flow-num');
        if (num) run(num, timelineFrames(NUM.future, changes(NUM), C));
      });
    });
    // Grafika zapasowa nakładki (animacje CSS - bez shadera) na tej samej osi czasu co napisy.
    if (typeof CSSAnimation !== 'undefined') {
      fig.getAnimations({ subtree: true }).forEach((a) => {
        if (a instanceof CSSAnimation) a.startTime = VIZ_EPOCH;
      });
    }
    // Poza ekranem stoi; po powrocie start od VIZ_EPOCH = od razu w tej samej fazie co shader.
    const io = new IntersectionObserver(([en]) => {
      anims.forEach((a) => {
        if (en.isIntersecting) a.startTime = VIZ_EPOCH;
        else a.pause();
      });
    }, { rootMargin: '100px' });
    io.observe(fig);
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, [sig]);

  return (
    <figcaption ref={ref} className={`iv-story${multi ? ' iv-story--multi' : ''}`} data-cyc={story.cycle}>
      {multi && (
        <span className="iv-story-bars">
          {story.steps.map((s) => <i key={s.at}><b data-sb="" /></i>)}
        </span>
      )}
      <span className="iv-story-live">
        {story.steps.map((s, i) => (
          <span key={s.at} data-st={s.at} data-lks={s.labels.join(',')}>
            {multi && <b className="iv-num">{i + 1}</b>}
            <span className="iv-story-txt">{s.text}</span>
          </span>
        ))}
      </span>
      {multi && (
        <ol className="iv-story-list">
          {story.steps.map((s) => <li key={s.at}>{s.text}</li>)}
        </ol>
      )}
    </figcaption>
  );
};

const Pulse = ({ d, at, alert = false }: { d: string; at: number; alert?: boolean }) => (
  <path
    className={`im-flow-pulse${alert ? ' im-flow-pulse--alert' : ''}`}
    d={d}
    fill="none"
    pathLength={100}
    style={{ '--pd': `${at}s` } as CSSProperties}
  />
);
const lineD = (a: readonly [number, number], b: readonly [number, number]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;

// =====================================================================================
// KONSTELACJE - dane kafli. Czasy = czasy kroków historii (STORY niżej): krok zaczyna się
// dotarciem impulsu do węzła, a następny impuls rusza tak, żeby dotrzeć na kolejny krok.
// Ok. 3 s na krok - tyle, żeby przeczytać napis.
// =====================================================================================
type CNode = { x: number; y: number; kind: Kind; label?: number; place?: Place; flash?: number };
type CEdge = { a: number; b: number; at: number; alert?: boolean };
type CViz = { w: number; h: number; cycle: number; nodes: CNode[]; edges: CEdge[] };

/** Kafel 1: ruch → zapytanie → nowy klient; kroki co 3 s. */
const G = 9;
const G_AT = [0, 3, 6] as const;
const C_GROWTH: CViz = {
  w: 320, h: 180, cycle: G,
  nodes: [
    { x: 26, y: 146, kind: 'dot', label: 0, flash: G_AT[0] },
    { x: 152, y: 94, kind: 'dot', label: 1, flash: G_AT[1] },
    { x: 290, y: 34, kind: 'star', label: 2, place: 'l', flash: G_AT[2] },
  ],
  edges: [{ a: 0, b: 1, at: G_AT[1] - leg(G) }, { a: 1, b: 2, at: G_AT[2] - leg(G) }],
};
/** Kafel 2: pytania spływają do asystenta (ostatnie dociera na krok 2), asystent wysyła
    gotowe zapytanie do Ciebie (dociera na krok 3). */
const A = 10.5;
const A_AT = [0, 3, 7] as const;
const A_Q = (i: number) => A_AT[1] - leg(A) - (2 - i) * 0.3; // pytanie i rusza (0,3 / 0,6 / 0,9 s)
const C_ASSISTANT: CViz = {
  w: 320, h: 150, cycle: A,
  nodes: [
    { x: 22, y: 24, kind: 'dot', label: 0, place: 'tr', flash: A_Q(0) },
    { x: 22, y: 78, kind: 'dot', flash: A_Q(1) },
    { x: 22, y: 132, kind: 'dot', flash: A_Q(2) },
    { x: 152, y: 78, kind: 'star', label: 1, place: 'b', flash: A_AT[1] },
    { x: 296, y: 78, kind: 'dot', label: 2, place: 'tl', flash: A_AT[2] },
  ],
  edges: [
    { a: 0, b: 3, at: A_Q(0) }, { a: 1, b: 3, at: A_Q(1) }, { a: 2, b: 3, at: A_Q(2) },
    { a: 3, b: 4, at: A_AT[2] - leg(A) },
  ],
};
/** Kafel 4: odwiedzający przechodzą przez Cloudflare do strony (krok 1), potem rusza atak
    (krok 2) i zatrzymuje się na pierścieniu (krok 3: strona działa dalej). */
const S = 10;
const S_IN = 0.2;
const S_ATTACK = 4.4;
const S_AT = [0, S_ATTACK, S_ATTACK + leg(S)] as const;
const C_SHIELD: CViz = {
  w: 320, h: 150, cycle: S,
  nodes: [
    { x: 22, y: 36, kind: 'dot', label: 0, place: 'tr', flash: S_IN },
    { x: 22, y: 122, kind: 'alert', label: 1, place: 'br', flash: S_ATTACK },
    { x: 160, y: 79, kind: 'ring', label: 2, place: 'b', flash: S_AT[2] },
    { x: 296, y: 79, kind: 'star', label: 3, place: 'tl', flash: S_IN + 2 * leg(S) },
  ],
  edges: [
    { a: 0, b: 2, at: S_IN }, { a: 2, b: 3, at: S_IN + leg(S) },
    { a: 1, b: 2, at: S_ATTACK, alert: true },
  ],
};

/** Atak zatrzymuje się NA pierścieniu tarczy (w shaderze promień 11 jedn. + obwódka), a nie w jej
    środku - widać, że dalej nie przechodzi. */
const SHIELD_STOP = 13;
const edgeEnds = (v: CViz, e: CEdge): [[number, number], [number, number]] => {
  const a = v.nodes[e.a];
  const b = v.nodes[e.b];
  if (!e.alert || b.kind !== 'ring') return [[a.x, a.y], [b.x, b.y]];
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return [[a.x, a.y], [b.x - ((b.x - a.x) / len) * SHIELD_STOP, b.y - ((b.y - a.y) / len) * SHIELD_STOP]];
};

const Constellation = ({ viz, labels, frameRef }: { viz: CViz; labels: readonly string[]; frameRef?: Ref<HTMLDivElement> }) => (
  <Frame w={viz.w} h={viz.h} cycle={viz.cycle} frameRef={frameRef}>
    <svg viewBox={`0 0 ${viz.w} ${viz.h}`} focusable="false">
      {viz.edges.map((e, i) => {
        const [a, b] = edgeEnds(viz, e);
        const d = lineD(a, b);
        return (
          <g key={i}>
            <path className={`im-flow-line${e.alert ? ' im-flow-line--alert' : ''}`} d={d} fill="none" />
            <Pulse d={d} at={e.at} alert={e.alert} />
          </g>
        );
      })}
    </svg>
    {viz.nodes.map((n, i) => (
      <VNode key={i} {...n} w={viz.w} h={viz.h} cycle={viz.cycle} label={n.label !== undefined ? labels[n.label] : undefined} lk={n.label} />
    ))}
  </Frame>
);

// Łuk wydajności (kafel 3): kropki równo po długości łuku (próbkowanie krzywej), bo wypełnienie
// (stroke-dasharray z pathLength) też biegnie po długości; gwiazda na 98%.
const ARC = { w: 320, h: 118, cycle: 8, fill: 0.4, p0: [16, 104], p1: [160, -14], p2: [304, 104] } as const;
/** Kafel 3: pomiar (łuk wypełnia się do 98%) → wynik 98 na 100. */
const ARC_STEPS = [0, ARC.cycle * ARC.fill] as const;
const ARC_PATH = `M${ARC.p0.join(' ')} Q${ARC.p1.join(' ')} ${ARC.p2.join(' ')}`;
const arcPoint = (t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * ARC.p0[0] + 2 * u * t * ARC.p1[0] + t * t * ARC.p2[0],
    u * u * ARC.p0[1] + 2 * u * t * ARC.p1[1] + t * t * ARC.p2[1],
  ];
};
const ARC_AT = (() => {
  const steps = 240;
  const lens = [0];
  let prev = arcPoint(0);
  for (let i = 1; i <= steps; i++) {
    const p = arcPoint(i / steps);
    lens.push(lens[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]));
    prev = p;
  }
  const total = lens[steps];
  return (f: number): [number, number] => {
    const target = f * total;
    let i = 1;
    while (i < steps && lens[i] < target) i++;
    const k = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
    return arcPoint((i - 1 + k) / steps);
  };
})();
const ARC_TICKS = Array.from({ length: 10 }, (_, i) => ({ f: i / 10, p: ARC_AT(i / 10) }));
const ARC_GOAL = ARC_AT(0.98);

const GaugeArc = ({ frameRef }: { frameRef?: Ref<HTMLDivElement> }) => {
  const fillTime = ARC.cycle * ARC.fill;
  return (
    <Frame w={ARC.w} h={ARC.h} cycle={ARC.cycle} frameRef={frameRef}>
      <svg viewBox={`0 0 ${ARC.w} ${ARC.h}`} focusable="false">
        <path className="im-flow-line" d={ARC_PATH} fill="none" />
        <path className="im-arc-fill" d={ARC_PATH} fill="none" pathLength={100} />
      </svg>
      {ARC_TICKS.map((tk) => (
        <span
          key={tk.f}
          className="im-flow-node im-flow-node--tick is-flash"
          style={{ left: pct(tk.p[0], ARC.w), top: pct(tk.p[1], ARC.h), '--fd': flashDelay(fillTime * tk.f, ARC.cycle) } as CSSProperties}
        >
          <span className="im-flow-dot" />
        </span>
      ))}
      {/* Skala jak na liczniku: 0 i 100 na końcach łuku, gwiazda z wynikiem na 98. */}
      <span className="im-flow-scale" style={{ left: pct(ARC.p0[0], ARC.w), top: pct(ARC.p0[1], ARC.h) }}>0</span>
      <span className="im-flow-scale" style={{ left: pct(ARC.p2[0], ARC.w), top: pct(ARC.p2[1], ARC.h) }}>100</span>
      <VNode x={ARC_GOAL[0]} y={ARC_GOAL[1]} w={ARC.w} h={ARC.h} kind="star" label="98" place="tl" flash={fillTime * 0.98} cycle={ARC.cycle} lk={0} />
    </Frame>
  );
};

// =====================================================================================
// SCENY DLA SHADERA (jednostki viewBoxa nakładki; rysuje je VIZ_GLSL w shader.tsx).
// =====================================================================================

/** Węzeł: kind 1 kropka, 2 gwiazda, 3 pierścień (tarcza), 4 atak, 5 kropka łuku;
    flash = chwila dotarcia (s) albo -1 (świeci stale). */
export interface SceneNode { x: number; y: number; kind: number; flash: number }
/** Krawędź: type 0 impuls (ze śladem), 1 wypełnienie (od `start` przez `dur` s), 2 sam grzbiet. */
export interface SceneEdge { a: [number, number]; b: [number, number]; start: number; alert: number; type: number; dur: number }
export interface ShaderScene { w: number; h: number; cycle: number; nodes: SceneNode[]; edges: SceneEdge[] }

const KIND_ID: Record<Kind, number> = { dot: 1, star: 2, ring: 3, alert: 4 };

const fromC = (v: CViz): ShaderScene => ({
  w: v.w,
  h: v.h,
  cycle: v.cycle,
  nodes: v.nodes.map((n) => ({ x: n.x, y: n.y, kind: KIND_ID[n.kind], flash: n.flash ?? -1 })),
  edges: v.edges.map((e) => {
    const [a, b] = edgeEnds(v, e);
    return { a, b, start: e.at, alert: e.alert ? 1 : 0, type: 0, dur: 0 };
  }),
});

/** Łuk wydajności: światło wypełnia łuk do 98%, ostatnie 2% zostaje samym grzbietem. */
const ARC_STOPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.98, 1];
const ARC_SCENE: ShaderScene = (() => {
  const fillTime = ARC.cycle * ARC.fill;
  const pts = ARC_STOPS.map((f) => ARC_AT(f));
  return {
    w: ARC.w,
    h: ARC.h,
    cycle: ARC.cycle,
    nodes: [
      ...ARC_TICKS.map((tk) => ({ x: tk.p[0], y: tk.p[1], kind: 5, flash: fillTime * tk.f })),
      { x: ARC_GOAL[0], y: ARC_GOAL[1], kind: 2, flash: fillTime * 0.98 },
    ],
    edges: ARC_STOPS.slice(0, -1).map((f, i) => {
      const tail = ARC_STOPS[i + 1] > 0.98;
      return { a: pts[i], b: pts[i + 1], start: fillTime * f, alert: 0, type: tail ? 2 : 1, dur: fillTime * (ARC_STOPS[i + 1] - f) };
    }),
  };
})();

/** Sceny kafli 1-4. */
export const SCENES: Record<1 | 2 | 3 | 4, ShaderScene> = {
  1: fromC(C_GROWTH),
  2: fromC(C_ASSISTANT),
  3: ARC_SCENE,
  4: fromC(C_SHIELD),
};

// =====================================================================================
// HISTORIA KAFLA - kroki (chwila startu = dotarcie do węzła) i podpisy, które się wtedy
// rozjaśniają (indeksy `lk` w nakładkach: kolejność tekstów cardNFlow w słowniku).
// `nums`: numer kroku na podpisie (Cloudflare w kaflu 4 bierze udział w dwóch krokach - bez
// numeru; w kaflu 3 podpis "98" = krok 2).
// =====================================================================================
type Card = 1 | 2 | 3 | 4;
const STORY: Record<Card, { cycle: number; at: readonly number[]; labels: number[][]; nums: Partial<Record<number, number>> }> = {
  1: { cycle: G, at: G_AT, labels: [[0], [1], [2]], nums: { 0: 1, 1: 2, 2: 3 } },
  2: { cycle: A, at: A_AT, labels: [[0], [1], [2]], nums: { 0: 1, 1: 2, 2: 3 } },
  3: { cycle: ARC.cycle, at: ARC_STEPS, labels: [[], [0]], nums: { 0: 2 } },
  4: { cycle: S, at: S_AT, labels: [[0, 2], [1, 2], [3]], nums: { 0: 1, 1: 2, 3: 3 } },
};

const storyFor = (card: Card, t: ImpactDict): Story => {
  const s = STORY[card];
  const texts: readonly string[] = [t.story.card1, t.story.card2, t.story.card3, t.story.card4][card - 1];
  return { cycle: s.cycle, steps: s.at.map((at, i) => ({ at, text: texts[i], labels: s.labels[i] })) };
};

/** Wizualizacja kafla + historia pod spodem (`frameRef` = pomiar dla shadera). */
export const CardViz = ({ card, t, frameRef }: { card: Card; t: ImpactDict; frameRef?: Ref<HTMLDivElement> }) => (
  <NumCtx.Provider value={STORY[card].nums}>
    <figure className={`iv-fig${card === 3 ? ' im-flow--arc' : ''}`} aria-hidden="true">
      {card === 1 && <Constellation viz={C_GROWTH} labels={t.card1Flow} frameRef={frameRef} />}
      {card === 2 && <Constellation viz={C_ASSISTANT} labels={t.card2Flow} frameRef={frameRef} />}
      {card === 3 && <GaugeArc frameRef={frameRef} />}
      {card === 4 && <Constellation viz={C_SHIELD} labels={t.card4Flow} frameRef={frameRef} />}
      <VizStory story={storyFor(card, t)} />
    </figure>
  </NumCtx.Provider>
);
