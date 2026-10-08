// Pełny zrzut żywej strony klienta EKRAN PO EKRANIE (runda 12, zamiast jednego ujęcia z fullpage.mjs, które łapało
// animacje „przy wejściu” w połowie i nie doładowywało leniwych obrazów, karuzel i widżetu opinii - strona Mcentrum
// wyglądała na rozjechaną). Każdy ekran 1440 × 900 @2x jest na ekranie, zanim go sfotografujemy (lazy-load, animacje
// wejścia i karuzele zdążą się odpalić), elementy przyklejone (nagłówek, przyciski „do góry”, czaty) są ukryte od
// drugiego ekranu, a przeglądarka nie przedstawia się jako headless (widżety opinii potrafią ją blokować).
// Uruchomienie z katalogu avenly-web: node docs/podstrony/realizacje-skrypty/fullpage-tiles.mjs <slug> <url>
// Wynik: %TEMP%/pages/<slug>-tiles.png (przegląd); master assets/realizacje/<slug>-page-2880.webp robi page-images.mjs
// z zakresów PAGES (wycięte puste pasy), potem kadry 800 / 1600.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const [slug, url] = process.argv.slice(2);
if (!slug || !url) { console.log('użycie: node fullpage-tiles.mjs <slug> <url>'); process.exit(1); }
const W = 1440, VH = 900, DPR = 2;
const TMP = process.env.TEMP || '.';
const port = 9400 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(TMP, 'prof-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--disable-blink-features=AutomationControlled',
  '--hide-scrollbars', '--no-first-run', '--mute-audio', '--lang=pl-PL', `--window-size=${W},${VH}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

try {
  let target;
  for (let k = 0; k < 50; k++) {
    try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); target = l.find((t) => t.type === 'page'); if (target) break; } catch {}
    await sleep(200);
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
  });
  await send('Page.enable'); await send('Runtime.enable');
  const ua = (await send('Browser.getVersion')).userAgent.replace('HeadlessChrome', 'Chrome');
  await send('Emulation.setUserAgentOverride', { userAgent: ua, acceptLanguage: 'pl-PL,pl;q=0.9' });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });" });
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: VH, deviceScaleFactor: DPR, mobile: false });
  await send('Page.navigate', { url });
  await sleep(7000);
  const clicked = await evalJs(`(() => { const re = /akceptuj|zaakceptuj|zgadzam|accept|rozumiem|odrzuć/i; const b = [...document.querySelectorAll('button, a')].filter(x => x.offsetParent && re.test(x.textContent.trim()) && x.textContent.trim().length < 40); b.slice(0,1).forEach(x => x.click()); return b.map(x => x.textContent.trim()).slice(0,3); })()`);
  console.log('cookie:', clicked);
  await sleep(1000);
  // wtyczki typu LiteSpeed wstrzymują skrypty (np. widżet opinii) do pierwszej interakcji - ruch myszy i kółko
  for (const [x, y] of [[120, 120], [480, 300], [720, 460]]) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await sleep(120); }
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 720, y: 460, deltaX: 0, deltaY: 120 });
  await sleep(4000);
  // 1. przejazd w dół małymi krokami (leniwe obrazy, animacje wejścia, widżety), na dole postój, powrót na górę
  let H = await evalJs('document.documentElement.scrollHeight');
  for (let y = 0; y < H; y += 360) { await evalJs(`window.scrollTo(0, ${y})`); await sleep(420); H = await evalJs('document.documentElement.scrollHeight'); }
  await evalJs('window.scrollTo(0, document.documentElement.scrollHeight)'); await sleep(3000);
  await evalJs('window.scrollTo(0, 0)'); await sleep(3000);
  H = await evalJs('document.documentElement.scrollHeight');
  console.log('height', H);
  // 2. ekran po ekranie. Ukrywamy tylko pływające elementy fixed: nagłówek od drugiego ekranu, przyciski / popupy zawsze.
  //    Zostają elementy sticky (np. kolumna ze zdjęciem) i stopka odsłaniana spod strony (fixed, na dole). display: none,
  //    nie visibility (dzieci z własnym visibility: visible zostawały widoczne); fixed nie zajmuje miejsca - układ się nie zmienia.
  const hideFixed = (all) => evalJs(`(() => { let n = 0; for (const el of document.querySelectorAll('body *')) { if (el.tagName === 'FOOTER' || el.closest('footer')) continue; const cs = getComputedStyle(el); if (cs.position !== 'fixed') continue; const r = el.getBoundingClientRect(); const header = r.top < 40 && r.width > 900 && r.height < 200; if (header && !${all}) continue; el.style.setProperty('display', 'none', 'important'); n++; } return n; })()`);
  const tiles = [];
  for (let y = 0; ; y += VH) {
    const top = Math.min(y, H - VH);
    await evalJs(`window.scrollTo(0, ${top})`);
    await sleep(1800);
    console.log('tile', top, 'hidden', await hideFixed(y > 0));
    await sleep(150);
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    tiles.push({ input: Buffer.from(data, 'base64'), top: top * DPR, left: 0 });
    if (top >= H - VH) break;
  }
  // PNG do przeglądu (WebP ma limit 16 383 px wysokości); master WebP po wycięciu pustych pasów: page-images.mjs --from-png
  const out = join(TMP, 'pages', `${slug}-tiles.png`);
  mkdirSync(join(TMP, 'pages'), { recursive: true });
  await sharp({ create: { width: W * DPR, height: H * DPR, channels: 3, background: '#fff' } }).composite(tiles).png({ compressionLevel: 6 }).toFile(out);
  console.log('saved', out, W * DPR, H * DPR);
} catch (e) { console.error('ERR', e); }
finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  for (let k = 0; k < 10; k++) { try { await sleep(700); rmSync(prof, { recursive: true, force: true }); break; } catch (e) { if (k === 9) console.log('rm prof fail', e.message); } }
}
