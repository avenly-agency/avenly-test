import type { CSSProperties } from 'react';

// Rysunek boxu „Nie wiesz, co wybrać?” (2026-09-30, właściciel: „w ostatnim boxie też zrób coś ciekawego, bo nie
// pasuje, też zrób motion jak w każdym”). Ten sam język i ruch co rysunki usług z Oferty
// (components/sections/services/drawings.tsx - zamrożony, więc własny rysunek tutaj, te same klasy .of-*):
// reveal linia po linii z piórem, potem scenka w 3 krokach z najazdem kamery i podpisem kroku.
// Historia bezpłatnej konsultacji: (1) opowiadasz o firmie i celu - w dymku pisze się tekst, (2) dobieramy usługi
// do celu - impuls biegnie do siatki usług, zapalają się trzy, (3) dostajesz plan - impuls do planu, odhaczają się
// punkty, podświetla się wycena i termin, na końcu pieczątka. Płótno 640 × 360 jednostek jak w Ofercie.

type Kind = 'main' | 'soft' | 'acc' | 'dash' | 'bar' | 'barHi' | 'barXL' | 'barAcc' | 'fill' | 'lit' | 'dot';
type Part = [Kind, string, 'pen'?];
type Track = [number, number | string][];
interface Live { k: Kind; d: string; o?: [number, number]; op?: Track; tf?: Track; dash?: Track }

const CYCLE = 5600;
const f = (n: number) => +n.toFixed(2);
const R = (x: number, y: number, w: number, h: number, r = 0) =>
  `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
const L = (x1: number, y1: number, x2: number, y2: number) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
const C = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
const AR = (x: number, y: number, s = 6) => `M${f(x - s)} ${f(y - s * 0.7)}L${f(x)} ${f(y)}L${f(x - s)} ${f(y + s * 0.7)}`;
const T = (x: number, y: number) => `translate(${f(x)}px, ${f(y)}px)`;
const S = (s: number) => `scale(${s})`;
const on = (t0: number, off = 0.92, t1 = t0 + 0.035): Track => [[0, 0], [t0, 0], [t1, 1], [off, 1], [Math.min(off + 0.05, 1), 0], [1, 0]];
const blink = (t0: number, peak: number, t1: number): Track => [[0, 0], [t0, 0], [peak, 1], [t1, 0], [1, 0]];
const type = (t0: number, t1: number): Track => [[0, 1], [t0, 1], [t1, 0], [0.975, 0], [1, 1]];
/** Impuls (kropka) przelatuje z a do b między t0 i t1. */
const pulse = (a: [number, number], b: [number, number], t0: number, t1: number): Live => ({
  k: 'dot', d: C(0, 0, 3.5),
  op: [[0, 0], [t0, 0], [t0 + 0.005, 1], [t1, 1], [t1 + 0.005, 0], [1, 0]],
  tf: [[0, T(...a)], [t0, T(...a)], [t1, T(...b)], [1, T(...b)]],
});

/** Dymek rozmowy z ogonkiem w lewym dolnym rogu. */
const BUBBLE = 'M74 70H216A14 14 0 0 1 230 84V152A14 14 0 0 1 216 166H106L82 190L86 166H74A14 14 0 0 1 60 152V84A14 14 0 0 1 74 70Z';
/** Kafel usługi w siatce 2 × 3. */
const TX = (c: number) => 276 + c * 60, TY = (r: number) => 96 + r * 56;
const tile = (c: number, r: number) => R(TX(c), TY(r), 50, 44, 6);
const ROWS = [128, 156, 184];
const check = (y: number) => `M463.5 ${y}L466.5 ${y + 3.5}L471 ${y - 3.5}`;

const PARTS: Part[] = [
  ['fill', BUBBLE],
  ['main', BUBBLE, 'pen'],
  ['barHi', L(80, 94, 146, 94)],
  ['bar', L(80, 112, 196, 112)],
  ['bar', L(80, 128, 172, 128)],
  ['bar', L(80, 144, 130, 144)],
  ['dash', L(236, 118, 266, 118)],
  ['acc', AR(272, 118)],
  ...[0, 1, 2].flatMap((r) => [0, 1].flatMap((c): Part[] => [
    ['soft', tile(c, r)],
    ['soft', R(TX(c) + 10, TY(r) + 9, 14, 11, 2)],
    ['bar', L(TX(c) + 10, TY(r) + 31, TX(c) + 36, TY(r) + 31)],
  ])),
  ['dash', L(392, 174, 432, 174)],
  ['acc', AR(438, 174)],
  ['fill', R(444, 52, 140, 256, 10)],
  ['main', R(444, 52, 140, 256, 10), 'pen'],
  ['barXL', L(462, 80, 532, 80)],
  ['soft', L(444, 100, 584, 100)],
  ...ROWS.flatMap((y, k): Part[] => [
    ['soft', R(460, y - 7, 14, 14, 3)],
    ['bar', L(484, y, [560, 540, 566][k], y)],
  ]),
  ['soft', L(444, 210, 584, 210)],
  ['bar', L(460, 232, 500, 232)],
  ['barHi', L(530, 232, 568, 232)],
  ['bar', L(460, 254, 492, 254)],
  ['barHi', L(530, 254, 568, 254)],
];

const LIVE: Live[] = [
  // 1. Opowiadasz o firmie i celu: w dymku pisze się tekst, dymek błyska.
  { k: 'barHi', d: L(80, 112, 196, 112), op: on(0.03, 0.92, 0.031), dash: type(0.03, 0.11) },
  { k: 'barHi', d: L(80, 128, 172, 128), op: on(0.12, 0.92, 0.121), dash: type(0.12, 0.19) },
  { k: 'barHi', d: L(80, 144, 130, 144), op: on(0.2, 0.92, 0.201), dash: type(0.2, 0.25) },
  { k: 'lit', d: BUBBLE, op: blink(0.26, 0.29, 0.36) },
  // 2. Dobieramy usługi do celu: impuls do siatki, zapalają się trzy usługi.
  pulse([232, 118], [270, 118], 0.34, 0.4),
  ...([[0, 0, 0.42], [1, 1, 0.48], [0, 2, 0.54]] as const).flatMap(([c, r, t]): Live[] => [
    { k: 'lit', d: tile(c, r), op: blink(t, t + 0.03, t + 0.12) },
    { k: 'acc', d: tile(c, r), op: on(t + 0.01) },
  ]),
  // 3. Dostajesz plan z wyceną i terminem: impuls do planu, odhaczone punkty, wycena i termin, pieczątka.
  pulse([394, 174], [438, 174], 0.67, 0.72),
  ...ROWS.flatMap((y, k): Live[] => {
    const t = 0.74 + k * 0.04;
    return [
      { k: 'acc', d: R(460, y - 7, 14, 14, 3), op: on(t) },
      { k: 'acc', d: check(y), op: on(t, 0.92, t + 0.001), dash: type(t, t + 0.025) },
    ];
  }),
  { k: 'barAcc', d: L(530, 232, 568, 232), op: on(0.85) },
  { k: 'barAcc', d: L(530, 254, 568, 254), op: on(0.87) },
  { k: 'acc', d: `${C(548, 286, 13)}M541.5 286L546 290.5L554.5 281.5`, o: [548, 286], op: on(0.88, 0.95, 0.91), tf: [[0, S(0.4)], [0.88, S(0.4)], [0.92, S(1)], [1, S(1)]] },
];

/** Odnośniki 1-3 (w kaflu galerii schowane, jak w kartach usług). */
const MARKS: [number, number, number, number][] = [[145, 30, 145, 70], [331, 300, 331, 252], [604, 30, 584, 62]];
const DRAWN = new Set<Kind>(['main', 'soft', 'acc', 'bar', 'barHi', 'barXL', 'barAcc']);
const STEP = Math.min(34, 1000 / PARTS.length);
const END = Math.round(PARTS.length * STEP);

const full = (tr: Track): Track => {
  const out = [...tr];
  if (out[0][0] > 0) out.unshift([0, out[0][1]]);
  if (out[out.length - 1][0] < 1) out.push([1, out[out.length - 1][1]]);
  return out;
};

/** Kamera: najazd na miejsce akcji w każdym kroku (jak camFrames w Ofercie). */
const CAMS: [number, number, number][] = [[150, 125, 1.35], [331, 174, 1.4], [514, 190, 1.25]];
const camT = ([cx, cy, z]: [number, number, number]) => {
  const tx = Math.min(0, Math.max(640 - 640 * z, 320 - cx * z));
  const ty = Math.min(0, Math.max(360 - 360 * z, 180 - cy * z));
  return `translate(${f(tx / 6.4)}%, ${f(ty / 3.6)}%) scale(${z})`;
};

/** Ruch rysunku dla art-card.tsx (ten sam kształt co timing / liveFrames / camFrames z Oferty). */
export const CTA_MOTION = {
  cycle: CYCLE,
  end: END,
  live: (j: number): Keyframe[][] => {
    const l = LIVE[j];
    const out: Keyframe[][] = [];
    const add = (prop: 'opacity' | 'transform' | 'strokeDashoffset', tr?: Track) => {
      if (tr) out.push(full(tr).map(([offset, v]) => ({ offset, [prop]: String(v) })));
    };
    add('opacity', l.op);
    add('transform', l.tf);
    add('strokeDashoffset', l.dash);
    return out;
  },
  cam: (boost: number): Keyframe[] => {
    const [a, b, c] = CAMS.map(([x, y, z]) => [x, y, z * boost] as [number, number, number]);
    const wide = 'translate(0%, 0%) scale(1)';
    const io = 'cubic-bezier(.65, 0, .35, 1)';
    return [
      { offset: 0, transform: wide, easing: io },
      { offset: 0.1, transform: camT(a) },
      { offset: 0.31, transform: camT(a), easing: io },
      { offset: 0.42, transform: camT(b) },
      { offset: 0.64, transform: camT(b), easing: io },
      { offset: 0.75, transform: camT(c) },
      { offset: 0.87, transform: camT(c), easing: io },
      { offset: 0.99, transform: wide },
      { offset: 1, transform: wide },
    ];
  },
};

/** Znaczniki jak w Drawing z Oferty (.of-dw, .of-dw-box, .of-dw-cam, .of-k-*, .of-lv, pióro, podpisy kroków). */
export const CtaDrawing = ({ acc, beats }: { acc: string; beats: string[] }) => (
  <div className="of-dw" data-on style={{ '--oc': acc } as CSSProperties} aria-hidden="true">
    <div className="of-dw-box">
      <div className="of-dw-drag">
        <div className="of-dw-cam">
          <svg className="of-dw-svg" viewBox="0 0 640 360" focusable="false">
            {PARTS.map(([k, d, pen], j) => (
              <path key={j} d={d} className={`of-k-${k}`} pathLength={DRAWN.has(k) ? 1 : undefined} data-pen={pen ? j : undefined}
                style={{ '--d': `${Math.round(j * STEP)}ms` } as CSSProperties} />
            ))}
            {LIVE.map((l, j) => (
              <path key={`l${j}`} d={l.d} data-lv={j} className={`of-lv of-k-${l.k}`} pathLength={l.dash ? 1 : undefined}
                style={{ '--d': `${Math.round(END * 0.8)}ms`, transformOrigin: l.o ? `${l.o[0]}px ${l.o[1]}px` : undefined } as CSSProperties} />
            ))}
            {MARKS.map(([x, y, tx, ty], j) => (
              <g key={`m${j}`} className="of-lead" style={{ '--d': `${END + 120 + j * 140}ms` } as CSSProperties}>
                <path d={L(x, y, tx, ty)} pathLength={1} />
                <circle cx={tx} cy={ty} r={2.4} />
              </g>
            ))}
            {PARTS.map(([, , pen], j) => (pen ? <circle key={`p${j}`} className="of-pen" data-pen-dot={j} r={2.6} /> : null))}
          </svg>
        </div>
      </div>
    </div>
    <p className="of-dw-cap">
      <span className="of-dw-beats">
        {beats.map((b, j) => <span key={j} data-beat={j}>{b}</span>)}
      </span>
    </p>
  </div>
);
