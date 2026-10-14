// Strony klientów do kadru „Portalu” na /o-nas (sekcja „Dla kogo pracujemy”, app/(pl)/o-nas/sec-clients-portal.tsx).
// Uruchomienie z katalogu avenly-web:  node scripts/o-nas-portal-pages.mjs
//
// Po co osobne pliki (2026-10-13, właściciel o stronach w kadrze: „z jakiegoś powodu te screeny trochę są zbyt sharpen
// i jakby jakość traciły”, potem o drobnych napisach: „w tych miejscach jest ciśnięte (…) jakby takie zbyt ostre”):
//   1. kadr brał dotąd plastry z /realizacje (public/realizacje/<slug>-page-1600-0) - wyostrzone po skalowaniu i mocno
//      skompresowane (AVIF q58), a przeglądarka pomniejszała je prawie dwukrotnie zwykłym próbkowaniem dwuliniowym,
//   2. każde DRUGIE skalowanie w przeglądarce (nawet o 10%) nierówno rozkłada kreski drobnego pisma - napisy wyglądają
//      na ściśnięte i przeostrzone (sprawdzone na powiększonych wycinkach: scratchpad cmp4.mjs).
// Dlatego obraz jest pokazywany DOKŁADNIE 1:1: tu powstaje góra strony (dwa ekrany okna 16:10 = wysokość 1,25
// szerokości) prosto z mastera 2880 px w wielu szerokościach co ok. 6%, a kadr dopasowuje swoją szerokość do
// najbliższego mniejszego pliku (sec-clients-portal.tsx). Skalowanie raz, tutaj, miękkim jądrem Mitchella (bez
// „dzwonienia” wokół liter, które daje lanczos) i BEZ wyostrzania.
// Zmiana strony klienta = nowy master (docs/podstrony/realizacje-skrypty) i ten skrypt.
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'assets/realizacje';
const OUT = 'public/o-nas/portal';
/** Szerokości plików w px ekranu (co ok. 6%). Musi zgadzać się z PORTAL_W w sec-clients-portal.tsx. */
const WIDTHS = [
  480, 510, 540, 572, 606, 642, 660, 680, 720, 764, 800, 810, 858, 910, 964, 1000, 1022, 1084, 1150, 1220, 1294, 1372, 1454, 1542, 1634, 1732,
  1836, 1946, 2062, 2186, 2318,
];
/** Zapas WebP dla przeglądarek bez AVIF (jeden plik na klienta; tam obraz jest skalowany przez przeglądarkę). */
const FALLBACK_W = 1294;
const SLUGS = ['klub-sportowy', 'grawerstwo-kardys', 'mcentrumfizjoterapia'];
const RATIO = 1.25; // wysokość / szerokość
const NOLIMIT = { limitInputPixels: false };

mkdirSync(OUT, { recursive: true });
// stare pliki (inne szerokości) - katalog zawiera tylko wynik tego skryptu
for (const f of readdirSync(OUT)) if (/\.(avif|webp)$/.test(f)) unlinkSync(join(OUT, f));

let total = 0;
for (const slug of SLUGS) {
  const master = join(SRC, `${slug}-page-2880.webp`);
  const meta = await sharp(master, NOLIMIT).metadata();
  const height = Math.min(meta.height, Math.round(meta.width * RATIO));
  const top = await sharp(master, NOLIMIT).extract({ left: 0, top: 0, width: meta.width, height }).png().toBuffer();
  let sum = 0;
  for (const w of WIDTHS) {
    const scaled = sharp(top, NOLIMIT).resize({ width: w, height: Math.round(w * RATIO), fit: 'fill', kernel: 'mitchell' });
    const avif = join(OUT, `${slug}-${w}.avif`);
    // AVIF 4:2:0 (profil Main - pewne dekodowanie w Safari)
    await scaled.clone().avif({ quality: w <= 1300 ? 76 : 70, effort: 6, chromaSubsampling: '4:2:0' }).toFile(avif);
    sum += statSync(avif).size;
    if (w === FALLBACK_W) await scaled.clone().webp({ quality: 90, effort: 6, smartSubsample: true }).toFile(join(OUT, `${slug}-${w}.webp`));
  }
  total += sum;
  console.log(`${slug}: ${WIDTHS.length} plików AVIF, razem ${(sum / 1048576).toFixed(2)} MB`);
}
console.log(`razem AVIF ${(total / 1048576).toFixed(2)} MB`);
