/**
 * Post-build: podmienia out/404.html (domyślna strona Next) na customowy
 * NotFound wyrenderowany pod out/nie-znaleziono/index.html (trasa app/(pl)/404/).
 *
 * Powód: przy dwóch root layoutach (route groups (pl)/(en) dla i18n) Next
 * generuje globalny /_not-found BEZ naszego not-found.tsx z grupy - 404.html
 * dostawał generyczny "404: This page could not be found" bez lang/brandingu.
 * Apache serwuje /404.html przez ErrorDocument (.htaccess), więc wystarczy
 * podmienić plik po buildzie.
 */
import { copyFileSync, existsSync } from 'node:fs';

const src = 'out/nie-znaleziono/index.html';
// Next emituje default 404 w trzech miejscach - podmieniamy wszystkie
// (Apache serwuje /404.html, ale /404/ i /_not-found/ też są osiągalne z URL-a).
const targets = ['out/404.html', 'out/404/index.html', 'out/_not-found/index.html'];

if (!existsSync(src)) {
  console.error('[copy-404] BRAK out/nie-znaleziono/index.html - trasa app/(pl)/nie-znaleziono/ usunięta?');
  process.exit(1);
}
for (const dst of targets) {
  if (existsSync(dst) || dst === 'out/404.html') copyFileSync(src, dst);
}
console.log('[copy-404] default 404 podmienione na customowy NotFound (pl):', targets.join(', '));
