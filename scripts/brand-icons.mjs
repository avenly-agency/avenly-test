// Ikony strony i obrazek udostępniania z NOWEGO LOGO (2026-10-09, wersja „cięcie”).
// Źródło ikon: public/logo/avenly-kafel-ciemny.svg (sygnet A z linią i gwiazdą na czarnym kaflu).
// Uruchom: node scripts/brand-icons.mjs  (potrzebny sharp - jest w node_modules; Node 22.18+ / 24 czyta lib/brand/logo.ts
// bez kompilacji). Nadpisuje:
//   app/icon.png (512, zaokrąglony kafel; Next podaje go jako /icon.png - JSON-LD Organization.logo i awatar czatu),
//   public/favicon-16.png, favicon-32.png, icon-192.png, icon-512.png (zaokrąglony kafel),
//   public/favicon.ico (16 / 32 / 48 - o ten plik pytają niektóre przeglądarki i wyszukiwarki same z siebie),
//   public/apple-touch-icon.png (180, kwadrat bez zaokrągleń - iOS zaokrągla sam),
//   public/og-default.png (1200 x 630, podgląd linku - KADR Z HERO, patrz niżej).
// Poprzednie pliki: Desktop/avenly/logo/stare logo/strona avenly.pl do 2026-10-09/.
//
// Podgląd linku (2026-10-14, właściciel: „zrób z hero to, jak się z linku wyświetla”): ten sam kadr co pierwszy ekran
// strony głównej na komputerze, w stanie po wejściu - planeta z renderu hero (public/hero-planet-3-wide-2560.webp,
// ten sam obraz co element LCP), nad nią napis AVENLY po łuku orbity (każda litera obrócona prostopadle do krawędzi
// planety), przecięty po okręgu drogi gwiazdy, z górnymi połówkami zsuniętymi po łuku cięcia i linią z gwiazdą wzdłuż
// orbity - geometria przepisana z components/sections/hero/logo.ts (stan końcowy wejścia: kerfHalf, delta, bend),
// niebo z pyłem gwiazd i „klejnotami” jak w hero/sky.ts. Bez tekstu (obrazek służy też wersji EN; tytuł i opis
// podglądu daje sam link). Jednostki sceny = px kadru hero 1440 x 900 (horyzont 602, promień planety 1300);
// rysowane w 2x i zmniejszane - ostre krawędzie liter.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  GEM, LOGO_BOX, LOGO_CUT_SHIFT, LOGO_LETTERS_BOX, LOGO_PIECES, LOGO_STAR, LOGO_WHOLE_FILLS,
} from '../lib/brand/logo.ts';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const p = (...a) => path.join(root, ...a);

const tile = fs.readFileSync(p('public/logo/avenly-kafel-ciemny.svg'), 'utf8');
const square = tile.replace(/rx="[\d.]+"/, 'rx="0"');
const png = (svg, size, out) =>
  sharp(Buffer.from(svg), { density: Math.max(72, (72 * size) / 512 * 4) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(p(out))
    .then(() => console.log('ok', out, size));

// --- favicon.ico: kontener ICO z obrazami PNG 16 / 32 / 48 ---------------------------------------------------------
const ico = async () => {
  const sizes = [16, 32, 48];
  const imgs = await Promise.all(sizes.map((s) =>
    sharp(Buffer.from(tile), { density: Math.max(72, (72 * s) / 512 * 4) }).resize(s, s).png({ compressionLevel: 9 }).toBuffer()));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let off = head.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(imgs[i].length, e + 8); head.writeUInt32LE(off, e + 12);
    off += imgs[i].length;
  });
  fs.writeFileSync(p('public/favicon.ico'), Buffer.concat([head, ...imgs]));
  console.log('ok public/favicon.ico', sizes.join(' / '));
};

// --- obrazek udostępniania: kadr z hero -----------------------------------------------------------------------------
// geometria sceny hero na komputerze (components/sections/hero/layout.ts): środek planety x 720, horyzont 602, R 1300,
// szerokość logo 1190, odstęp liter od krawędzi planety 28
const CX = 720, HOR = 602, R = 1300, LOGO_W = 1190, GAP = 28, SPAN = 1.04;
const LINE_Y = 62.5, EXT = 0.35;
const LETTERS = ['A', 'V', 'E', 'N', 'L', 'Y'];
const sc = (LOGO_W * SPAN) / LOGO_BOX.w;
const Rb = R + GAP, Cy = HOR + R, rLine = Rb + LINE_Y * sc;
const delta = (LOGO_CUT_SHIFT * sc) / (Rb + 82 * sc); // zsunięcie górnych połówek po łuku cięcia (rad)
const MID = LOGO_BOX.x + LOGO_BOX.w / 2;
const angle = (x) => ((x - MID) * sc) / Rb;
const polar = (th, r) => [CX + r * Math.sin(th), Cy - r * Math.cos(th)];
const bend = (x, y) => polar(angle(x), Rb - y * sc);
const kerfHalf = (x) => 2.56 + 0.005708 * (x - 55);
const kerfR = (th, side) => rLine + side * kerfHalf(MID + (th * Rb) / sc) * sc;
const f = (v) => v.toFixed(2);
const pts = (list) => list.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');

// kadr podglądu: cała szerokość sceny, od 110 jednostek nad sceną (horyzont na ok. 65% wysokości obrazka)
const OG_W = 1200, OG_H = 630, Q = 2; // rysowane w 2x
const K = OG_W / 1440, T0 = 110;

/** Ścieżka złożona z M / C / Z → wielokąty (jak flatten w hero/logo.ts). */
function flatten(d) {
  const tok = d.match(/[MCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const polys = [];
  let cur = [], i = 0, x = 0, y = 0;
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') { x = num(); y = num(); cur = [[x, y]]; polys.push(cur); }
    else if (c === 'C') {
      while (i < tok.length && !/[MCZ]/i.test(tok[i])) {
        const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num();
        const n = Math.max(8, Math.ceil(Math.hypot(x3 - x, y3 - y) / 3));
        for (let s = 1; s <= n; s++) {
          const t = s / n, u = 1 - t;
          cur.push([
            u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
            u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
          ]);
        }
        x = x3; y = y3;
      }
    }
  }
  return polys;
}

const pieces = Object.fromEntries(LETTERS.map((l) => [l, {
  up: LOGO_PIECES.find((pc) => pc.letter === l && pc.part === 'up').d,
  down: LOGO_PIECES.find((pc) => pc.letter === l && pc.part === 'down').d,
}]));
// wypełnienia szczeliny z zakładką (litera „cała” = dolna połówka + wypełnienie + górna połówka cofnięta)
const fills = (l) => LOGO_WHOLE_FILLS[l].map((poly) => poly.map(([x, y, pi]) => {
  if (pi === undefined) return [x, y];
  const [px, py] = poly[pi];
  const k = EXT / Math.max(0.5, Math.abs(y - py));
  return [x + (x - px) * k, y + (y - py) * k];
}));

const letterGroup = (l) => {
  const xc = LOGO_LETTERS_BOX[l].cx, th = angle(xc), [px, py] = polar(th, Rb);
  const fl = fills(l).map((poly) => `M${pts(poly)}Z`).join('');
  return `<g transform="translate(${f(px)} ${f(py)}) rotate(${f((th * 180) / Math.PI)}) scale(${sc.toFixed(5)}) translate(${f(-xc)} 0)">` +
    `<path fill="url(#lg)" d="${pieces[l].down}"/><path fill="url(#lg)" d="${fl}"/>` +
    `<path fill="url(#lg)" transform="translate(${-LOGO_CUT_SHIFT} 0)" d="${pieces[l].up}"/></g>`;
};

const aLeft = angle(LOGO_BOX.x - 80), aRight = angle(LOGO_BOX.x + LOGO_BOX.w + 120);
const band = (side) => {
  const n = Math.ceil((aRight - aLeft) / 0.002), out = [];
  for (let s = 0; s <= n; s++) { const th = aLeft + ((aRight - aLeft) * s) / n; out.push(polar(th, kerfR(th, side))); }
  return out;
};
const far = Rb + 400 * sc;
const belowClip = `M${f(CX)} ${f(Cy)} L${pts(band(-1))}Z`;
const outer = band(1), farArc = Array.from({ length: 48 }, (_, i) => polar(aRight + ((aLeft - aRight) * i) / 47, far));
const aboveClip = `M${pts([...outer, ...farArc])}Z`;
const starPath = flatten(LOGO_STAR).map((poly) => `M${pts(poly.map(([x, y]) => bend(x, y)))}Z`).join('');

// niebo: pył i „klejnoty” (jak hero/sky.ts) - poza tarczą planety i poza pasem liter
let seed = 20261014;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const sceneY0 = T0, sceneY1 = T0 + OG_H / K;
const free = (x, y, pad = 0) => {
  const r = Math.hypot(x - CX, Cy - y), th = Math.atan2(x - CX, Cy - y);
  if (r < R + 26 + pad) return false; // tarcza planety i jej poświata
  if (th > angle(LOGO_BOX.x - 40) && th < angle(LOGO_BOX.x + LOGO_BOX.w + 40) && r > Rb - 14 - pad && r < Rb + 112 * sc + pad) return false;
  return true;
};
const dust = [];
for (let i = 0; i < 520 && dust.length < 360; i++) {
  const x = rnd() * 1440, y = sceneY0 + rnd() * (sceneY1 - sceneY0);
  if (!free(x, y)) continue;
  const big = rnd() > 0.88;
  const r = big ? 1.1 + rnd() * 0.8 : 0.45 + rnd() * 0.65;
  const warm = rnd();
  const col = warm > 0.92 ? '#f6e7c8' : warm > 0.7 ? '#dbe7ff' : '#ffffff';
  dust.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${r.toFixed(2)}" fill="${col}" fill-opacity="${(0.2 + rnd() * (big ? 0.6 : 0.45)).toFixed(2)}"/>`);
}
const gemSpots = [[170, 220, 0.5], [1250, 180, 0.62], [372, 150, 0.32], [1080, 300, 0.36], [96, 420, 0.3], [1350, 440, 0.34], [640, 132, 0.26]]
  .filter(([x, y]) => free(x, y, 30));
const gems = gemSpots.map(([x, y, s]) =>
  `<g transform="translate(${x} ${y})"><circle r="${f(26 * s)}" fill="#cfe0ff" fill-opacity=".16" filter="url(#bloom)"/>` +
  `<path d="${GEM}" fill="#fff" transform="scale(${s})"/></g>`).join('');

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W * Q}" height="${OG_H * Q}" viewBox="0 0 ${OG_W} ${OG_H}">
<defs>
  <linearGradient id="lg" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="0">
    <stop offset="0" stop-color="rgb(248,250,252)"/><stop offset=".55" stop-color="rgb(238,242,249)"/><stop offset="1" stop-color="rgb(207,220,246)"/>
  </linearGradient>
  <clipPath id="below"><path d="${belowClip}"/></clipPath>
  <clipPath id="above"><path d="${aboveClip}"/></clipPath>
  <filter id="bloom" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="6"/></filter>
  <g id="letters">${LETTERS.map(letterGroup).join('')}</g>
</defs>
<g transform="scale(${K.toFixed(6)}) translate(0 ${-T0})">
  ${dust.join('')}${gems}
  <use href="#letters" clip-path="url(#below)"/>
  <g transform="rotate(${f((delta * 180) / Math.PI)} ${CX} ${Cy})"><use href="#letters" clip-path="url(#above)"/></g>
  <path fill="#3B82F6" d="${starPath}"/>
</g></svg>`;

const og = async () => {
  // planeta z renderu hero: kadr 2560 x 907 jednostek sceny (1 px = 1 jednostka), środek planety x 1280, horyzont 302
  const W2 = OG_W * Q, H2 = OG_H * Q, k2 = K * Q;
  const rw = Math.round(2560 * k2);
  const planet = await sharp(p('public/hero-planet-3-wide-2560.webp')).resize(rw).toBuffer();
  const meta = await sharp(planet).metadata();
  const left = Math.round((1280 - CX) * k2), top = Math.round((HOR - 302 - T0) * k2);
  const cut = await sharp(planet)
    .extract({ left, top: Math.max(0, -top), width: W2, height: Math.min(meta.height - Math.max(0, -top), H2 - Math.max(0, top)) })
    .toBuffer();
  const big = await sharp({ create: { width: W2, height: H2, channels: 3, background: '#050505' } })
    .composite([{ input: cut, left: 0, top: Math.max(0, top) }, { input: Buffer.from(overlay), left: 0, top: 0 }])
    .png()
    .toBuffer();
  await sharp(big).resize(OG_W, OG_H, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(p('public/og-default.png'));
  console.log('ok public/og-default.png');
};

await Promise.all([
  png(tile, 512, 'app/icon.png'),
  png(tile, 16, 'public/favicon-16.png'),
  png(tile, 32, 'public/favicon-32.png'),
  png(tile, 192, 'public/icon-192.png'),
  png(tile, 512, 'public/icon-512.png'),
  png(square, 180, 'public/apple-touch-icon.png'),
  ico(),
  og(),
]);
