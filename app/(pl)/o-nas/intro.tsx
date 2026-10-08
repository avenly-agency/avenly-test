'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { OnHead } from './parts';
import { FLIGHT, VS, fragmentFor, type Look } from './intro-looks';

// Wejście strony O nas - „przelot”. Decyzje właściciela (2026-09-29): „zostaw ten efekt scrolla
// w avenly”, potem „dostosuj tą animację do nowego nurtu i powiększ poziom tej całej podstrony
// cinematic”, potem „daj kilka propozycji … PASUJĄCYCH DO MARKI”. Scena przypięta do okna (sticky),
// trzy ujęcia sterowane przewijaniem:
//   1. znak „AVENLY.” jak w nawigacji (Inter 700, niebieska kropka marki) - litery są oknami na pole
//      światła (warstwa #050505 w trybie multiply), kropka to osobna warstwa; zapłon przy wejściu,
//   2. przelot kamery (power2.inOut, lekki obrót) w cel propozycji: kropkę albo kreskę litery E
//      (punkt mierzony z DOM, FLIGHT w ./intro-looks.ts); potem światło gaśnie do czerni,
//   3. plansza tytułowa - nagłówek strony wyłania się linijkami spod maski (w Korekcie pióro
//      skreśla „wykonawcą”), scena się odpina i strona płynie dalej.
// Pole światła (WebGL, propozycje w ./intro-looks.ts): biel, czerń i niebieski marki, bez mgły;
// 30 fps, DPR ≤ 1,5 (dotyk 1), start po idle, pauza poza ekranem. Bez WebGL / Save-Data / słaby
// telefon: statyczne tło marki. Ograniczony ruch, brak JS i niskie okno (< 560 px): jeden ekran
// z napisem, nagłówek pod nim w zwykłym przepływie.

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2); // power2.inOut
const out = (x: number) => 1 - Math.pow(1 - x, 4);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Wspólny stan sceny: przewijanie (DOM) → pole światła (WebGL). */
type Scene = { push: number; dim: number; box: [number, number, number, number]; dot: [number, number] };

const GL_QUERY = '(prefers-reduced-motion: no-preference)';
const glOk = () => {
  if (!window.matchMedia(GL_QUERY).matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  return !(nav.deviceMemory && nav.deviceMemory <= 2);
};
const subscribeGl = (cb: () => void) => {
  const mq = window.matchMedia(GL_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const useGl = () => useSyncExternalStore(subscribeGl, glOk, () => false);

/** Pole światła w literach. `onState` = 'ready' po pierwszej klatce, 'fail' bez WebGL. */
const Field = ({ look, scene, onState }: { look: Look; scene: RefObject<Scene>; onState: (s: 'ready' | 'fail') => void }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const onStateRef = useRef(onState);
  useEffect(() => { onStateRef.current = onState; });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null, fs: WebGLShader | null = null, buf: WebGLBuffer | null = null;
    let raf = 0, visible = true, lastDraw = 0, disposed = false, readyAt = 0;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const t0 = performance.now();
    const FRAME = 1000 / 30;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const draw = (now: number) => {
      raf = 0;
      if (disposed || !gl || !visible || document.hidden) return;
      if (now - lastDraw >= FRAME) {
        lastDraw = now;
        if (!readyAt) readyAt = now;
        const s = scene.current;
        gl.uniform1f(u.time, (now - t0) / 1000);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.push, s?.push ?? 0);
        gl.uniform1f(u.dim, s?.dim ?? 0);
        if (s) { gl.uniform4f(u.box, s.box[0], s.box[1], s.box[2], s.box[3]); gl.uniform2f(u.dot, s.dot[0], s.dot[1]); }
        // Zapłon: 0,25 s ciemności, potem front światła przez 1,9 s.
        gl.uniform1f(u.reveal, out(clamp((now - readyAt - 250) / 1900)));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!canvas.dataset.ready) { canvas.dataset.ready = ''; onStateRef.current('ready'); }
      }
      raf = requestAnimationFrame(draw);
    };
    const wake = () => { if (!raf && gl && visible && !document.hidden) raf = requestAnimationFrame(draw); };

    const setup = () => {
      if (disposed) return;
      gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false });
      if (!gl) { onStateRef.current('fail'); return; }
      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type);
        if (!s) return null;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return s;
      };
      vs = compile(gl.VERTEX_SHADER, VS);
      fs = compile(gl.FRAGMENT_SHADER, fragmentFor(look));
      program = gl.createProgram();
      if (!vs || !fs || !program) { onStateRef.current('fail'); return; }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('o-nas field:', gl.getProgramInfoLog(program));
        gl = null;
        onStateRef.current('fail');
        return;
      }
      gl.useProgram(program);
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      for (const k of ['time', 'res', 'push', 'dim', 'reveal', 'box', 'dot']) u[k] = gl.getUniformLocation(program, `u_${k}`);
      resize();
      wake();
    };

    // Kompilacja po idle - nie w oknie ładowania strony.
    const idle = 'requestIdleCallback' in window;
    const ric = idle ? window.requestIdleCallback(setup, { timeout: 700 }) : window.setTimeout(setup, 200);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: '100px' });
    io.observe(canvas);
    const onVis = () => wake();
    document.addEventListener('visibilitychange', onVis);
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; gl = null; onStateRef.current('fail'); };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      disposed = true;
      if (idle) window.cancelIdleCallback(ric);
      else window.clearTimeout(ric);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [scene, look]);

  return <canvas ref={ref} className="on-intro-gl" />;
};

// Metryki Inter (em): wysokość wersalików, położenie linii bazowej względem góry pola glifu (Range).
const ASC = 0.969, CAP = 0.727;

/** Znak "AVENLY." - kropka jest przezroczystym znakiem (trzyma odstęp), rysuje ją warstwa kropki. */
const Word = ({ periodRef }: { periodRef: RefObject<HTMLSpanElement | null> }) => (
  <p className="on-intro-word">AVENLY<span ref={periodRef} className="on-intro-period">.</span></p>
);

export const OnIntro = ({ t, locale, accent, look = 'kropka' }: { t: ONasDict; locale: Locale; accent?: ReactNode; look?: Look }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const scene = useRef<Scene>({ push: 0, dim: 0, box: [0.1, 0.4, 0.9, 0.6], dot: [0.9, 0.42] });
  const progress = useRef(0);
  const lookRef = useRef<Look>(look);
  const api = useRef<{ geo: () => void; kick: () => void } | null>(null);
  const gl = useGl();

  // Pole światła gotowe / niedostępne → statyczne tło chowa się albo wchodzi (zapas po 2,6 s).
  const onField = (s: 'ready' | 'fail') => {
    const st = stageRef.current;
    if (st) st.dataset.field = s;
  };
  useEffect(() => {
    const st = stageRef.current;
    if (!gl || !st) return;
    st.dataset.field = 'wait';
    const id = window.setTimeout(() => { if (st.dataset.field === 'wait') st.dataset.field = 'fail'; }, 2600);
    return () => { window.clearTimeout(id); delete st.dataset.field; };
  }, [gl]);

  // Zmiana propozycji: nowy cel przelotu i nowa geometria.
  useEffect(() => {
    lookRef.current = look;
    api.current?.geo();
    api.current?.kick();
  }, [look]);

  useEffect(() => {
    const wrap = wrapRef.current, stage = stageRef.current, text = textRef.current, dotL = dotRef.current, bg = bgRef.current;
    if (!wrap || !stage || !text || !dotL || !bg) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 767.98px)');
    let target = 0, cur = 0, raf = 0, last = 0, on = false;
    const vars: Record<string, string> = {};
    const setVar = (k: string, v: number, unit = '') => {
      const s = v.toFixed(unit ? 2 : 4) + unit;
      if (vars[k] === s) return;
      vars[k] = s;
      wrap.style.setProperty(k, s);
    };
    const layers = () => [text, dotL];

    // Geometria znaku z DOM (bez transformacji): wersaliki, kreska E, kropka → punkt wlotu kamery,
    // położenie kropki i dane dla shadera (uv).
    const geo = () => {
      const word = text.querySelector<HTMLElement>('.on-intro-word');
      const period = periodRef.current;
      const node = word?.firstChild;
      if (!word || !period || !node || node.nodeType !== 3) return;
      const saved = layers().map((el) => el.style.transform);
      layers().forEach((el) => { el.style.transform = 'none'; });
      const sr = text.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(word).fontSize);
      const range = document.createRange();
      range.setStart(node, 0); range.setEnd(node, 6);
      const wr = range.getBoundingClientRect();
      range.setStart(node, 2); range.setEnd(node, 3);
      const er = range.getBoundingClientRect();
      const pr = period.getBoundingClientRect();
      layers().forEach((el, i) => { el.style.transform = saved[i]; });
      if (!sr.width || !sr.height) return;
      const base = wr.top + ASC * fs;
      const capTop = base - CAP * fs;
      const dx = pr.left + 0.125 * fs - sr.left, dy = base - 0.078 * fs - sr.top;
      const f = FLIGHT[lookRef.current];
      const ox = f.target === 'dot' ? dx : er.left + 0.145 * fs - sr.left;
      const oy = f.target === 'dot' ? dy : capTop + f.stemY * CAP * fs - sr.top;
      setVar('--ox', ox, 'px');
      setVar('--oy', oy, 'px');
      setVar('--dx', dx, 'px');
      setVar('--dy', dy, 'px');
      setVar('--dd', 0.15 * fs, 'px');
      scene.current.box = [(wr.left - sr.left) / sr.width, 1 - (base - sr.top) / sr.height, (wr.right - sr.left) / sr.width, 1 - (capTop - sr.top) / sr.height];
      scene.current.dot = [dx / sr.width, 1 - dy / sr.height];
    };

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      target = run > 0 ? clamp(-r.top / run) : 0;
    };
    const apply = (p: number) => {
      progress.current = p;
      const f = FLIGHT[lookRef.current];
      // Ujęcie 1-2: przelot w cel (kropka / kreska E).
      const z = inOut(seg(p, 0, 0.45));
      const max = small.matches ? f.max[1] : f.max[0];
      const tf = `scale(${(1 + (max - 1) * z).toFixed(4)}) rotate(${(-2.4 * z).toFixed(3)}deg)`;
      layers().forEach((el) => { el.style.transform = tf; });
      const textOp = 1 - seg(p, 0.36, 0.46);
      text.style.opacity = textOp.toFixed(4);
      bg.style.transform = `scale(${(1 + 0.16 * seg(p, 0, 0.62)).toFixed(4)})`;
      scene.current.push = seg(p, 0, 0.5);
      scene.current.dim = inOut(seg(p, 0.44, 0.6));
      // Kropka: przy przelocie w kropkę wypełnia ekran kolorem marki i gaśnie z polem światła.
      dotL.style.opacity = (f.target === 'dot' ? 1 - scene.current.dim : textOp).toFixed(4);
      setVar('--dim', scene.current.dim);
      setVar('--hint', 1 - seg(p, 0, 0.05));
      // Ujęcie 3: plansza tytułowa.
      setVar('--k1', out(seg(p, 0.5, 0.6)));
      setVar('--k2', out(seg(p, 0.52, 0.66)));
      setVar('--k3', out(seg(p, 0.57, 0.71)));
      setVar('--k4', out(seg(p, 0.64, 0.76)));
      setVar('--k5', out(seg(p, 0.68, 0.8)));
      setVar('--ks', inOut(seg(p, 0.7, 0.8)));
      setVar('--ki', out(seg(p, 0.76, 0.86)));
      if (p > 0.72) wrap.dataset.cardOn = ''; else delete wrap.dataset.cardOn;
    };
    // Wygładzenie jak `scrub: 1` w GSAP: obraz dogania przewijanie w ok. 1 s.
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      measure();
      cur += (target - cur) * (1 - Math.exp(-dt / 0.26));
      if (Math.abs(target - cur) < 0.0005) cur = target;
      apply(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const onScroll = () => { if (on && !raf) raf = requestAnimationFrame(tick); };

    // Tryb filmowy tylko przy pełnym ruchu i oknie ≥ 560 px wysokości (plansza musi się zmieścić).
    const mode = () => {
      geo();
      const want = !reduce.matches && window.innerHeight >= 560;
      if (want === on) { if (on) apply(cur); onScroll(); return; }
      on = want;
      if (on) {
        wrap.dataset.live = '';
        measure();
        cur = target;
        apply(cur);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        delete wrap.dataset.live;
        delete wrap.dataset.cardOn;
        layers().forEach((el) => { el.style.transform = ''; });
        text.style.opacity = dotL.style.opacity = bg.style.transform = '';
        ['--dim', '--hint', '--k1', '--k2', '--k3', '--k4', '--k5', '--ks', '--ki'].forEach((k) => { wrap.style.removeProperty(k); delete vars[k]; });
        scene.current.push = scene.current.dim = 0;
      }
    };
    api.current = { geo, kick: () => { if (on) apply(cur); } };
    mode();
    document.fonts?.ready.then(() => { geo(); if (on) apply(cur); }).catch(() => {});
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', mode);
    reduce.addEventListener('change', mode);
    small.addEventListener('change', mode);
    return () => {
      api.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', mode);
      reduce.removeEventListener('change', mode);
      small.removeEventListener('change', mode);
    };
  }, []);

  // Klawiatura: fokus w ukrytej jeszcze planszy (np. Tab do „Bezpłatnej konsultacji”) przewija
  // do chwili, w której plansza jest w pełni widoczna.
  const onFocusCapture = () => {
    const wrap = wrapRef.current;
    if (!wrap || !('live' in wrap.dataset) || progress.current > 0.86) return;
    const r = wrap.getBoundingClientRect();
    const run = r.height - window.innerHeight;
    window.scrollTo({ top: window.scrollY + r.top + run * 0.9, behavior: 'smooth' });
  };

  return (
    <div ref={wrapRef} className="on-intro" data-look={look} onFocusCapture={onFocusCapture}>
      <div ref={stageRef} className="on-intro-stage" aria-hidden="true">
        <div ref={bgRef} className="on-intro-bg">
          <div className="on-intro-static" />
          {gl && <Field key={look} look={look} scene={scene} onState={onField} />}
        </div>
        <div ref={textRef} className="on-intro-text">
          <Word periodRef={periodRef} />
        </div>
        <div ref={dotRef} className="on-intro-dotl">
          <i className="on-intro-dot" />
        </div>
        <div className="on-intro-cap">
          <div className="container mx-auto px-6">
            <span>{t.introCaption.left}</span>
            <i />
            <span>{t.introCaption.right}</span>
          </div>
        </div>
        <div className="on-intro-hint">
          <span>{t.scrollHint}</span>
          <i />
        </div>
      </div>
      <OnHead t={t} locale={locale} accent={accent} className="on-intro-card" />
      <div className="on-intro-run" aria-hidden="true" />
    </div>
  );
};
