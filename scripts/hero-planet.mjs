// Statyczny render planety hero (element LCP; na telefonie jedyna planeta, na komputerze pierwsze sekundy przed
// shaderem). Uruchomienie: node scripts/hero-planet.mjs  →  public/hero-planet-3-*.{avif,webp}
//
// Dlaczego skrypt (2026-10-13): dawne pliki hero-planet-*.webp były zrzutem shadera zapisanym jako stratny WebP
// (8-49 KB). Stratny WebP zamienia łagodne, ciemne przejścia (granat w czerń, poświata nad krawędzią) w płaskie
// klocki po 8-16 px - właściciel: „patrz, jaka pikseloza na telefonie”. Podniesienie jakości WebP (próba „-2-”, q88)
// tego nie zmieniło: przy ciemnych poziomach kodek i tak spłaszcza bloki. Dlatego:
//   - obraz liczony jest wprost z wzorów shadera (components/sections/hero/planet.ts, klatka t = 0, kursor na środku),
//     w pełnej precyzji, bez przeglądarki,
//   - główny format to AVIF (8 bitów, 4:2:0 = profil Main, dekoduje go każda przeglądarka z obsługą AVIF) w jakości
//     95: trzyma gładkie przejścia bez klocków przy pliku mniejszym niż dawny WebP. Sprawdzone na powiększeniu
//     ciemnego pola z podbitą jasnością: WebP q88 i AVIF q80 = klocki, AVIF q92-97 = gładko jak zapis bezstratny
//     (wersji 10-bitowej gotowe binaria sharp nie kodują),
//   - zapas dla przeglądarek bez AVIF: WebP w jakości 97 (większy plik, mało kto go pobiera; q88 dawało klocki).
// Zmiana shadera planety = uruchomić ponownie; zmiana wyglądu obrazu = nowy numer w nazwie plików (nagłówek cache
// w public/_headers trzyma je 30 dni) i w components/sections/Hero.tsx.
//
// Kadry (jednostki sceny, jak w globals.css .hero-planet-img): telefon 1440 × 907, komputer 2560 × 907; horyzont
// 302 jedn. od góry, promień planety 1300, środek w osi kadru. Tło #050505 (obraz nieprzezroczysty).

import sharp from 'sharp';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const OUT = [
  { name: 'hero-planet-3-840', frameW: 1440, w: 840 },
  { name: 'hero-planet-3-1280', frameW: 1440, w: 1280 },
  { name: 'hero-planet-3-1920', frameW: 1440, w: 1920 },
  { name: 'hero-planet-3-wide-1920', frameW: 2560, w: 1920 },
  { name: 'hero-planet-3-wide-2560', frameW: 2560, w: 2560 },
  { name: 'hero-planet-3-wide-3840', frameW: 2560, w: 3840 },
];
const FRAME_H = 907, HORIZON = 302, R = 1300;
const BG = 5 / 255;
export const AVIF = { quality: 95, effort: 6, chromaSubsampling: '4:2:0' };
export const WEBP = { quality: 97, effort: 6, smartSubsample: true };

// ── wzory z planet.ts (GLSL → JS) ─────────────────────────────────────────────────────────────────────────────
const fract = (v) => v - Math.floor(v);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const hash = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
const noise = (x, y) => {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  return mix(mix(hash(ix, iy), hash(ix + 1, iy), fx), mix(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx), fy);
};
const fbm = (x, y) => {
  let v = 0, a = 0.5;
  for (let i = 0; i < 5; i++) { v += a * noise(x, y); x = x * 2.05 + 1.7; y = y * 2.05 + 0.9; a *= 0.5; }
  return v;
};
const norm3 = (x, y, z) => { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; };
const L1 = norm3(-0.45, -0.85, 0.55), L2 = norm3(0.75, -0.35, 0.5);
const DEEP = [0.02, 0.02, 0.03], BODY = [0.043, 0.075, 0.196], MID = [0.067, 0.169, 0.51];
const LITE = [0.184, 0.357, 0.922], RIM = [0.647, 0.706, 0.988], GLOW = [0.376, 0.647, 0.98];
const SHEEN = [0.85, 0.9, 1];

/** Kolor piksela (0-1, już na tle strony) dla punktu sceny (dx, dy) względem środka planety. */
const shade = (dx, dy, out) => {
  const r = Math.hypot(dx, dy), dist = r - R;
  const dd = Math.max(dist, 0);
  const glow = Math.exp(-dd / 70) * 0.42 + Math.exp(-dd / 14) * 0.35;
  let cr = GLOW[0] * glow, cg = GLOW[1] * glow, cb = GLOW[2] * glow;
  let alpha = clamp01(glow * 1.6);
  if (dist < 1.5) {
    const inside = 1 - smooth(-1.2, 1.2, dist);
    const z = Math.sqrt(Math.max(R * R - r * r, 0));
    const n = norm3(dx, dy, z);
    const ux = n[0] * 4.2, uy = n[1] * 4.2;
    const n1 = fbm(ux, uy), n2 = fbm(ux + 7.3, uy + 2.1);
    const st = fbm(ux * 2.3 + n1 * 1.5, uy * 2.3 + n1 * 1.5);
    const nn = norm3(n[0] + (n1 - 0.5) * 0.22, n[1] + (n2 - 0.5) * 0.22, n[2]);
    const fres = Math.pow(1 - Math.max(nn[2], 0), 3.2);
    const d1 = nn[0] * L1[0] + nn[1] * L1[1] + nn[2] * L1[2];
    const d2 = nn[0] * L2[0] + nn[1] * L2[1] + nn[2] * L2[2];
    const spec1 = Math.pow(Math.max(2 * d1 * nn[2] - L1[2], 0), 110);
    const spec2 = Math.pow(Math.max(2 * d2 * nn[2] - L2[2], 0), 36) * 0.45;
    const dif = Math.max(d1, 0);
    const depth = smooth(0, 340, -dist);
    const toDeep = smooth(0.45, 1, depth);
    const light = 0.6 + dif * 0.5;
    const rimK = fres * 1.25 * (1 - depth * 0.55) + Math.exp(-Math.abs(dist + 1.5) / 2.2) * 0.95;
    const spec = (spec1 + spec2) * (1 - depth * 0.75);
    const streak = smooth(0.56, 0.9, st) * (1 - depth) * 0.32;
    const sheen = smooth(0.2, 0, Math.abs(nn[0] * 0.6 - nn[1] * 0.8 - 0.25)) * (1 - depth) * 0.12;
    const c = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const base = mix(mix(mix(LITE[i], MID[i], 0.55), BODY[i], depth), DEEP[i], toDeep);
      c[i] = base * light + RIM[i] * rimK + spec + LITE[i] * streak + SHEEN[i] * sheen;
    }
    cr = mix(cr, c[0], inside); cg = mix(cg, c[1], inside); cb = mix(cb, c[2], inside);
    alpha = Math.max(alpha, inside);
  }
  out[0] = clamp01(cr) * alpha + BG * (1 - alpha);
  out[1] = clamp01(cg) * alpha + BG * (1 - alpha);
  out[2] = clamp01(cb) * alpha + BG * (1 - alpha);
};

/** Kadr o szerokości `w` px: wartości 16-bitowe (zaokrąglenie do 8 bitów dopiero w koderze) i wymiary. */
export const render = (frameW, w) => {
  const k = w / frameW; // px na jednostkę sceny
  const h = Math.round(FRAME_H * k);
  const data = new Uint16Array(w * h * 3);
  const px = [0, 0, 0];
  const cx = frameW / 2, cy = HORIZON + R;
  for (let y = 0; y < h; y++) {
    const dy = (y + 0.5) / k - cy;
    for (let x = 0; x < w; x++) {
      shade((x + 0.5) / k - cx, dy, px);
      const o = (y * w + x) * 3;
      data[o] = Math.round(px[0] * 65535); data[o + 1] = Math.round(px[1] * 65535); data[o + 2] = Math.round(px[2] * 65535);
    }
  }
  return { data, w, h };
};
/** Obraz 16-bitowy → sharp (bez utraty precyzji przed kodowaniem). */
export const image = ({ data, w, h }) => sharp(data, { raw: { width: w, height: h, channels: 3 } }).toColourspace('rgb16');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const { name, frameW, w } of OUT) {
    const frame = render(frameW, w);
    const a = await image(frame).avif(AVIF).toFile(resolve(root, 'public', `${name}.avif`));
    const b = await image(frame).webp(WEBP).toFile(resolve(root, 'public', `${name}.webp`));
    console.log(`${name}  ${frame.w} × ${frame.h}  avif ${(a.size / 1024).toFixed(1)} KB  webp ${(b.size / 1024).toFixed(1)} KB`);
  }
}
