// Uruchomienie z katalogu avenly-web (docelowo scripts/ - decyzja koordynatora):
//   node docs/podstrony/realizacje-skrypty/page-images.mjs [slug]              - kadry z mastera (wszystkie albo jedna strona)
//   node docs/podstrony/realizacje-skrypty/page-images.mjs <slug> --from-png   - nowy master z %TEMP%/pages/<slug>-tiles.png
//                                                                               (fullpage-tiles.mjs) + kadry
// Obrazy całych stron klientów do kadrów /realizacje (chat 5). Wycinamy puste pasy (zakresy PAGES), sklejamy, skalujemy do
// 800 (karty, nagłówek) i 1600 (plansze, case study) i tniemy na plastry ≤ 2000 px (dekodowanie). Master = zrzut 1440 CSS
// @2x po wycięciu pasów; WebP ma limit 16 383 px wysokości, więc wysoki master jest w częściach: <slug>-page-2880.webp,
// <slug>-page-2880-2.webp, …
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'assets/realizacje';
const OUT = 'public/realizacje';
mkdirSync(OUT, { recursive: true });
const NOLIMIT = { limitInputPixels: false };

/** Zakresy w px CSS (1440 szer.), które zostają - liczone na surowym zrzucie (--from-png) albo na masterze. */
const PAGES = {
  'grawerstwo-kardys': { ranges: [[0, 5860], [6720, 7224]] },
  'klub-sportowy': { ranges: [[0, 2300], [4580, 6932]] },
  // 2026-09-30 (runda 12): nowy zrzut ekran po ekranie (fullpage-tiles.mjs); wycięty jasny pas przed stopką
  // odsłanianą spod strony (7940-8060). Master już przycięty - z mastera bierzemy całość.
  mcentrumfizjoterapia: { ranges: [[0, 99999]], raw: [[0, 7940], [8060, 8437]] },
};
const WIDTHS = [800, 1600];
const SLICE = 2000;
const PART = 16000;

const [only, flag] = process.argv.slice(2);
const fromPng = flag === '--from-png';

/** Sklejenie wybranych zakresów (px CSS) obrazu 2880 px szerokości w jeden bufor PNG. */
const cut = async (input, ranges) => {
  const meta = await sharp(input, NOLIMIT).metadata();
  const parts = [];
  let H = 0;
  for (const [a, b] of ranges) {
    const top = a * 2, h = Math.min(b * 2, meta.height) - top;
    if (h <= 0) continue;
    parts.push({ input: await sharp(input, NOLIMIT).extract({ left: 0, top, width: meta.width, height: h }).png().toBuffer(), top: H, left: 0 });
    H += h;
  }
  const buf = await sharp({ create: { width: meta.width, height: H, channels: 3, background: '#000' }, ...NOLIMIT }).composite(parts).png().toBuffer();
  return { buf, width: meta.width, height: H };
};

/** Master w częściach po PART px (WebP ≤ 16 383 px). */
const masterFiles = (slug) => {
  const list = [];
  for (let i = 0; ; i++) {
    const f = join(SRC, i ? `${slug}-page-2880-${i + 1}.webp` : `${slug}-page-2880.webp`);
    if (!existsSync(f)) break;
    list.push(f);
  }
  return list;
};
const readMaster = async (slug) => {
  const files = masterFiles(slug);
  const metas = await Promise.all(files.map((f) => sharp(f, NOLIMIT).metadata()));
  const H = metas.reduce((s, m) => s + m.height, 0);
  let y = 0;
  const parts = [];
  for (const [i, f] of files.entries()) { parts.push({ input: await sharp(f, NOLIMIT).png().toBuffer(), top: y, left: 0 }); y += metas[i].height; }
  return sharp({ create: { width: metas[0].width, height: H, channels: 3, background: '#000' }, ...NOLIMIT }).composite(parts).png().toBuffer();
};
const writeMaster = async (slug, buf, width, height) => {
  for (let i = 0, y = 0; y < height; i++, y += PART) {
    const f = join(SRC, i ? `${slug}-page-2880-${i + 1}.webp` : `${slug}-page-2880.webp`);
    await sharp(buf, NOLIMIT).extract({ left: 0, top: y, width, height: Math.min(PART, height - y) }).webp({ quality: 90 }).toFile(f);
    console.log('master', f);
  }
};

for (const [slug, cfg] of Object.entries(PAGES)) {
  if (only && slug !== only) continue;
  let src;
  if (fromPng) {
    const raw = join(process.env.TEMP || '.', 'pages', `${slug}-tiles.png`);
    const { buf, width, height } = await cut(raw, cfg.raw ?? cfg.ranges);
    await writeMaster(slug, buf, width, height);
    src = buf;
  } else {
    src = await readMaster(slug);
  }
  const { buf: joined, height: H } = await cut(src, fromPng ? [[0, 99999]] : cfg.ranges);
  const manifest = { cssH: H / 2, widths: {} };
  for (const w of WIDTHS) {
    const scaled = await sharp(joined, NOLIMIT).resize({ width: w, kernel: 'lanczos3' }).sharpen({ sigma: 0.5, m1: 0.5, m2: 0.3 }).png().toBuffer();
    const sm = await sharp(scaled, NOLIMIT).metadata();
    const slices = [];
    for (let y = 0, i = 0; y < sm.height; y += SLICE, i++) {
      const h = Math.min(SLICE, sm.height - y);
      const piece = sharp(scaled, NOLIMIT).extract({ left: 0, top: y, width: w, height: h });
      await piece.clone().avif({ quality: w <= 800 ? 62 : 58, effort: 5 }).toFile(join(OUT, `${slug}-page-${w}-${i}.avif`));
      await piece.clone().webp({ quality: 84 }).toFile(join(OUT, `${slug}-page-${w}-${i}.webp`));
      slices.push(h);
    }
    manifest.widths[w] = { h: sm.height, slices };
  }
  console.log(slug, JSON.stringify(manifest));
}
console.log('Przepisz cssH i wysokości plastrów do PAGE_MEDIA w app/(pl)/realizacje/_rl/media.ts');
