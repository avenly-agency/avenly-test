// Generuje kadry 16:9 dla sekcji "Realizacje" (homepage, wariant 8b "Kurtyna") z masterów
// w assets/screenshots (zrzuty Full HD 1920x1080 @2x = 3840x2160, WebP q95; NIE w public/,
// żeby nie szły na produkcję). Sekcja pokazuje kadr 1200x675 (object-fit: cover, top), więc
// serwujemy dokładnie taki wycinek w 5 szerokościach (srcset), każdą jako AVIF (główny) i WebP
// (zapas w <picture>) + miniatury indeksu (96x54 @1x/2x/4x, WebP).
//
// Nowy zrzut strony: headless Chrome 1920x1080 @ deviceScaleFactor 2, zamknięty baner cookies,
// scroll 0, po zakończeniu animacji wejścia (wzorzec: notatka avenly-web-headless-testing).
// Uruchom po podmianie mastera: `node scripts/realizacje-images.mjs`
// (sharp jest zależnością Next.js - bez instalacji). Nazwy plików z sufiksem szerokości =
// nowy plik przy zmianie rozmiaru; podmiana pod TĄ SAMĄ nazwą wymaga purge cache Cloudflare (30 dni).

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets/screenshots';
const OUT = 'public/portfolio/stage';

/** slug wyjściowy → master (kolejność jak w lib/i18n/home/realizacje.ts) */
const ITEMS = {
  'klub-sportowy': 'klub-sportowy-3840x2160.webp',
  'grawerstwo-kardys': 'grawerstwo-kardys-3840x2160.webp',
  mcentrumfizjoterapia: 'mcentrumfizjoterapia-3840x2160.webp',
  'wirtualny-asystent-ai': 'wirtualny-asystent-ai-3840x2160.webp',
};

/** 720 flow · 1200 FullHD · 1800 laptop @2x · 2400 4K/2K · 3200 2K @2x (5K iMac). Musi zgadzać się ze STAGE_WIDTHS w słowniku. */
const STAGE_WIDTHS = [720, 1200, 1800, 2400, 3200];
const THUMB_WIDTHS = [96, 192, 384];
/** Jakość: kadry są treścią sekcji (screenshoty UI z drobnym tekstem) - q90 + lekkie wyostrzenie po skalowaniu. */
const STAGE_QUALITY = 90;
const THUMB_QUALITY = 85;
const SHARPEN = { sigma: 0.5, m1: 0.5, m2: 0.3 };
/** AVIF (2026-09-24, "jakość realizacji w kadrze" - właściciel): główny format kadrów, WebP zostaje
    jako zapas w <picture>. Pomiar na kadrze 1060 px: AVIF 1800 q70 = 95-100% ostrości wzorca
    z mastera przy ~60 KB (WebP 1200 q90: ~85% przy ~80 KB). Chroma 4:2:0 = profil Main AV1 -
    4:4:4 (profil High) byłby ostrzejszy, ale jego dekodowanie w Safari nie jest pewne, a pusty
    kadr to gorzej niż odrobinę miększe krawędzie kolorowego tekstu. Większe szerokości są
    pokazywane z mocniejszym zmniejszeniem - niższa jakość wystarcza. */
const AVIF_QUALITY = (w) => (w <= 1800 ? 70 : 64);

await mkdir(OUT, { recursive: true });

for (const [slug, file] of Object.entries(ITEMS)) {
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  // Wycinek 16:9 od GÓRY obrazu (jak object-position: top w makiecie) - obrazy węższe niż
  // 16:9 (portret) tracą dół, szersze tracą boki symetrycznie.
  const cropW = Math.min(meta.width, Math.floor((meta.height * 16) / 9));
  const cropH = Math.min(meta.height, Math.floor((cropW * 9) / 16));
  const left = Math.floor((meta.width - cropW) / 2);
  const base = sharp(input).extract({ left, top: 0, width: cropW, height: cropH });

  // Nie skalujemy w górę (rozmyty kadr = gorzej niż mniejszy plik): zamiast pierwszej
  // szerokości większej od źródła emitujemy JEDEN wariant w natywnej szerokości wycinka.
  const widths = [];
  for (const w of STAGE_WIDTHS) {
    if (w <= cropW * 1.05) widths.push(Math.min(w, cropW));
    else { if (cropW > widths[widths.length - 1] * 1.1) widths.push(cropW); break; }
  }
  for (const w of widths) {
    const out = path.join(OUT, `${slug}-${w}.webp`);
    const scaled = () => base.clone().resize({ width: w, height: Math.round((w * 9) / 16), fit: 'cover', kernel: 'lanczos3' })
      .sharpen(SHARPEN);
    await scaled().webp({ quality: STAGE_QUALITY, effort: 6, smartSubsample: true }).toFile(out);
    console.log('stage', out);
    const outAvif = path.join(OUT, `${slug}-${w}.avif`);
    await scaled().avif({ quality: AVIF_QUALITY(w), effort: 6, chromaSubsampling: '4:2:0' }).toFile(outAvif);
    console.log('stage', outAvif);
  }
  for (const w of THUMB_WIDTHS) {
    const out = path.join(OUT, `${slug}-thumb-${w}.webp`);
    await base.clone().resize({ width: w, height: Math.round((w * 9) / 16), fit: 'cover', kernel: 'lanczos3' })
      .sharpen(SHARPEN)
      .webp({ quality: THUMB_QUALITY, effort: 6 }).toFile(out);
    console.log('thumb', out);
  }
}
