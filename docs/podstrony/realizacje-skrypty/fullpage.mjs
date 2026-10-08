// Pełny zrzut żywej strony klienta: node docs/podstrony/realizacje-skrypty/fullpage.mjs <slug> <url> desktop (Chrome headless, 1440 px @2x).
// Pełne zrzuty stron klientów (desktop 1440 @2x, telefon 390 @3x) przez CDP.
// node fullpage.mjs <slug> <url> [desktop|mobile|both]
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SCR = process.env.TEMP || '.'; // profil Chrome i zrzuty PNG w katalogu tymczasowym - po zrzucie przekonwertuj PNG do assets/realizacje/<slug>-page-2880.webp
const OUT = join(SCR, 'pages');
mkdirSync(OUT, { recursive: true });
const [slug, url, mode = 'both'] = process.argv.slice(2);
const port = 9400 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(SCR, 'prof-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  '--hide-scrollbars', '--no-first-run', '--mute-audio', '--lang=pl-PL', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

async function shoot(kind) {
  const d = kind === 'desktop' ? { w: 1440, h: 900, dpr: 2, mobile: false } : { w: 390, h: 844, dpr: 3, mobile: true };
  await send('Emulation.setDeviceMetricsOverride', { width: d.w, height: d.h, deviceScaleFactor: d.dpr, mobile: d.mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: d.mobile });
  if (d.mobile) await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  await send('Page.navigate', { url });
  await sleep(6000);
  // cookie bannery: kliknij "Akceptuj"/"Odrzuć"/"Zgadzam" jeśli są
  const clicked = await evalJs(`(() => { const re = /akceptuj|zaakceptuj|zgadzam|accept|rozumiem|ok, rozumiem|odrzuć/i; const b = [...document.querySelectorAll('button, a')].filter(x => x.offsetParent && re.test(x.textContent.trim()) && x.textContent.trim().length < 40); b.slice(0,1).forEach(x => x.click()); return b.map(x => x.textContent.trim()).slice(0,3); })()`);
  console.log(kind, 'cookie:', clicked);
  await sleep(800);
  // przewiń w dół krokami (animacje wejścia), potem na górę
  const H = await evalJs('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');
  for (let y = 0; y < H; y += Math.round(d.h * 0.6)) { await evalJs(`window.scrollTo(0, ${y})`); await sleep(350); }
  await evalJs('window.scrollTo(0, document.documentElement.scrollHeight)'); await sleep(1500);
  await evalJs('window.scrollTo(0, 0)'); await sleep(2500);
  const H2 = await evalJs('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');
  console.log(kind, 'height', H, H2);
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: d.w, height: H2, scale: 1 } });
  const f = join(OUT, `${slug}-${kind}.png`);
  writeFileSync(f, Buffer.from(data, 'base64'));
  console.log('saved', f);
}

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
  if (mode === 'both' || mode === 'desktop') await shoot('desktop');
  if (mode === 'both' || mode === 'mobile') await shoot('mobile');
} catch (e) { console.error('ERR', e); }
finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  for (let k = 0; k < 10; k++) { try { await sleep(700); rmSync(prof, { recursive: true, force: true }); break; } catch (e) { if (k === 9) console.log('rm prof fail', e.message); } }
}
