'use client';

import { useEffect, useRef } from 'react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { Steps, setSteps } from '../../_usluga/parts';
import { lin, seg, usePin, useReducedPref } from '../../_usluga/shared';

// SCENA 4 - „CZUĆ KAŻDY DETAL.” (trzecia przypięta scena podstrony; tekst z kafla bento pierwotnej podstrony: „Każde
// przewinięcie, najazd i przejście jest dopracowane…”). Zdanie nie jest tu opisane, tylko DO SPRAWDZENIA: odwiedzający
// sam przewija, najeżdża i klika, a kształt z włosowych linii odpowiada na każdy z tych gestów:
//   1 „Przewinięcie” - kula z równoleżników (planeta z hero jako rysunek techniczny) obraca się razem z przewijaniem,
//   2 „Najazd”       - linie wychodzą kursorowi naprzeciw (soczewka pod kursorem / palcem); bez kursora po kuli wędruje
//                      punkt pokazowy, żeby animacja tłumaczyła się sama,
//   3 „Przejście”    - równoleżniki rozwijają się w tkaninę z nici („szyta na miarę”); kliknięcie / stuknięcie
//                      przełącza kształt i puszcza przez linie falę (fale się nakładają, do pięciu naraz).
// Płótno 2D (44 linie x 90 punktów), ~30 fps, tylko gdy scena jest na ekranie; ostre linie bez poświat.
// Bez JS / ograniczony ruch: nagłówek, tekst i lista trzech gestów; kształt jako jedna nieruchoma klatka (albo wcale).

const K = 44, M = 90, MAX_WAVES = 5;

export const Detail = ({ t }: { t: CustomCopy['detail'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const prog = useRef(0);
  const kickRef = useRef<() => void>(() => {});
  const steps = useRef<HTMLElement[]>([]);

  usePin(ref, (p, el) => {
    prog.current = p;
    if (!steps.current.length) steps.current = Array.from(el.querySelectorAll<HTMLElement>('.sv-step'));
    const beat = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    if (el.dataset.beat !== String(beat)) el.dataset.beat = String(beat);
    setSteps(steps.current, beat, [lin(p, 0.02, 0.33), lin(p, 0.33, 0.66), lin(p, 0.66, 0.98)]);
    kickRef.current();
  }, !reduced);

  useEffect(() => {
    const root = ref.current, cv = cvRef.current;
    const ctx = cv?.getContext('2d');
    if (!root || !cv || !ctx) return;
    const ac = (getComputedStyle(root).getPropertyValue('--sv-ac').trim() || '244 63 94').split(/\s+/).map(Number);
    const rose = `${Math.round(ac[0] + (255 - ac[0]) * 0.22)}, ${Math.round(ac[1] + (255 - ac[1]) * 0.22)}, ${Math.round(ac[2] + (255 - ac[2]) * 0.22)}`;
    let w = 0, h = 0, dpr = 1, raf = 0, vis = false, last = 0, morph = 0, flipped = false;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, on: 0, at: -1e9 };
    const waves: { x: number; y: number; t: number }[] = [];
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };

    const draw = (now: number) => {
      const p = reduced ? 0.12 : prog.current, time = reduced ? 0 : now / 1000;
      const R = Math.min(w, h) * 0.4;
      // 1 - przewinięcie obraca kulę, 3 - przejście rozwija ją w tkaninę (kliknięcie odwraca kształt)
      const spin = p * Math.PI * 2.4 + time * 0.1;
      const base = seg(p, 0.66, 0.94);
      morph += ((flipped ? 1 - base : base) - morph) * (reduced ? 1 : 0.1);
      const e = morph * morph * (3 - 2 * morph);
      // 2 - najazd: prawdziwy kursor albo punkt pokazowy wędrujący po kuli
      const auto = now - ptr.at > 2600;
      if (auto) {
        const b = lin(p, 0.3, 0.68) * Math.PI * 2;
        ptr.tx = Math.cos(b + 0.6) * R * 0.5; ptr.ty = Math.sin(b * 1.3) * R * 0.34;
      }
      const goal = reduced ? 0 : auto ? Math.min(lin(p, 0.3, 0.36), 1 - lin(p, 0.62, 0.68)) : 1;
      ptr.x += (ptr.tx - ptr.x) * 0.16; ptr.y += (ptr.ty - ptr.y) * 0.16; ptr.on += (goal - ptr.on) * 0.12;
      while (waves.length && now - waves[0].t > 1700) waves.shift();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1; ctx.lineJoin = 'round';
      const cx = w / 2, cy = h / 2, sig = R * 0.3;
      const ct = Math.cos(0.42), st = Math.sin(0.42), cs = Math.cos(spin), sn = Math.sin(spin);
      const aFront = 0.66 - 0.14 * e, aBack = 0.13 + 0.2 * e;
      for (let k = 0; k < K; k++) {
        const lat = ((-80 + (160 * k) / (K - 1)) * Math.PI) / 180, cl = Math.cos(lat), sl = Math.sin(lat);
        const yB = (k / (K - 1) - 0.5) * R * 1.9;
        const col = k % 7 === 3 ? rose : '226, 232, 240';
        let front: boolean | null = null, px = 0, py = 0;
        ctx.beginPath();
        for (let j = 0; j <= M; j++) {
          const u = j / M, phi = u * Math.PI * 2;
          // kula: równoleżnik, obrót wokół osi i pochylenie ku widzowi
          const x = cl * Math.cos(phi), z = cl * Math.sin(phi);
          const x1 = x * cs + z * sn, z1 = -x * sn + z * cs;
          const y2 = sl * ct - z1 * st, z2 = sl * st + z1 * ct;
          // tkanina: pozioma nić z łagodną falą
          const wv = Math.sin(u * 7 + k * 0.33 + time * 1.1) * 0.5 + Math.sin(u * 3.1 - time * 0.7 + k * 0.12) * 0.5;
          let X = x1 * R + ((u - 0.5) * R * 2.7 - x1 * R) * e;
          let Y = -y2 * R + (yB + wv * R * 0.045 + y2 * R) * e;
          const Z = z2 + (wv - z2) * e;
          // soczewka pod kursorem: linie rozsuwają się ku widzowi
          const dx = X - ptr.x, dy = Y - ptr.y;
          const g = Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig)) * ptr.on * 0.42;
          X += dx * g; Y += dy * g;
          // fale po kliknięciach (nakładają się)
          for (const wave of waves) {
            const ddx = X - wave.x, ddy = Y - wave.y, d = Math.hypot(ddx, ddy) || 1, age = (now - wave.t) / 1000;
            const a = Math.exp(-age * 1.9) * Math.exp(-((d - age * R * 1.7) ** 2) / (2 * (R * 0.11) ** 2)) * R * 0.09;
            X += (ddx / d) * a; Y += (ddy / d) * a;
          }
          const sx = cx + X, sy = cy + Y, f = Z >= 0;
          if (front !== null && f !== front) {
            ctx.strokeStyle = `rgba(${col}, ${front ? aFront : aBack})`;
            ctx.stroke(); ctx.beginPath(); ctx.moveTo(px, py);
          }
          if (j === 0 || front === null) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
          front = f; px = sx; py = sy;
        }
        ctx.strokeStyle = `rgba(${col}, ${front ? aFront : aBack})`;
        ctx.stroke();
      }
      // punkt pokazowy (kursor), gdy odwiedzający sam nie rusza kursorem
      if (auto && ptr.on > 0.04) {
        const x = cx + ptr.x, y = cy + ptr.y;
        ctx.globalAlpha = Math.min(1, ptr.on * 1.4);
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, y + 17); ctx.lineTo(x + 4.6, y + 12.6); ctx.lineTo(x + 8, y + 20); ctx.lineTo(x + 11, y + 18.7); ctx.lineTo(x + 7.8, y + 11.4); ctx.lineTo(x + 13.6, y + 11.4);
        ctx.closePath();
        ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#050505'; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!vis || document.hidden) return;
      if (now - last >= 30) { last = now; draw(now); }
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && vis) raf = requestAnimationFrame(frame); };
    kickRef.current = kick;

    const local = (cxp: number, cyp: number) => { const r = cv.getBoundingClientRect(); return [cxp - r.left - r.width / 2, cyp - r.top - r.height / 2]; };
    const onMove = (e: PointerEvent) => { [ptr.tx, ptr.ty] = local(e.clientX, e.clientY); ptr.at = performance.now(); };
    const onDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('a, button')) return;
      const [x, y] = local(e.clientX, e.clientY);
      ptr.tx = x; ptr.ty = y; ptr.at = performance.now();
      waves.push({ x, y, t: performance.now() });
      if (waves.length > MAX_WAVES) waves.shift();
      flipped = !flipped;
      kick();
    };
    // blask mgławicy siada przy kształcie tylko na komputerze - na telefonie tekst stoi tuż nad kształtem i jasna
    // chmura pod nim odbierała mu czytelność (ta sama lekcja co w zakresie pilota)
    const fig = cv.parentElement;
    const mq = window.matchMedia('(min-width: 1024px)');
    const sky = () => { if (mq.matches) fig?.setAttribute('data-sky', 'scene'); else fig?.removeAttribute('data-sky'); };
    sky();
    mq.addEventListener('change', sky);
    // wysokość nagłówka z opisem: na telefonie kształt zaczyna się tuż pod nim (CSS, --dh) - na niskich ekranach
    // stałe 30% wysokości wypadało jeszcze w opisie
    const headEl = root.querySelector<HTMLElement>('.sm-d-head');
    const fitHead = () => { if (headEl) root.style.setProperty('--dh', `${headEl.offsetHeight}px`); };
    fitHead();
    const rh = new ResizeObserver(fitHead);
    if (headEl) rh.observe(headEl);
    size();
    const ro = new ResizeObserver(() => { size(); if (reduced) draw(performance.now()); else kick(); });
    ro.observe(cv);
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis) { if (reduced) draw(performance.now()); else kick(); } }, { rootMargin: '120px 0px' });
    io.observe(cv);
    const stage = root.querySelector<HTMLElement>('.sm-d-stage') ?? root;
    if (!reduced) {
      stage.addEventListener('pointermove', onMove, { passive: true });
      stage.addEventListener('pointerdown', onDown, { passive: true });
    }
    document.addEventListener('visibilitychange', kick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); rh.disconnect();
      root.style.removeProperty('--dh');
      mq.removeEventListener('change', sky);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', kick);
      kickRef.current = () => {};
    };
  }, [reduced]);

  return (
    <section ref={ref} className="sm-d" data-beat="0" aria-labelledby="sm-d-h">
      <div className="sm-d-stage">
        <div className="sm-d-in container mx-auto px-6">
          <div className="sm-d-head">
            <h2 id="sm-d-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
            <p className="im-lead sm-d-lead">{t.text}</p>
          </div>
          <div className="sm-d-fig" aria-hidden="true"><canvas ref={cvRef} /></div>
          <div className="sm-d-steps">
            <Steps items={t.steps} label={t.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
