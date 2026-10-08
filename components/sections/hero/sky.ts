// Warstwa 5 handoffu: nocne niebo + konstelacja usług (canvas 2D).
// Konstelacja wg hero-12a.html (węzły, linie z impulsem, spadająca gwiazda). Różnice produkcyjne:
// - ETYKIETY węzłów to prawdziwe linki DOM (SEO + klawiatura + czytniki) - canvas rysuje tylko
//   grafikę, a ten moduł co klatkę ustawia im transform (dryf/paralaksa węzła),
// - GWIAZDY w 3 klasach (decyzja właściciela: "bardziej luksusowe" niż płaskie kropki z makiety):
//     pył   - gęsta, statyczna warstwa mikro-punktów, renderowana RAZ do bitmapy (1 drawImage/klatkę),
//     gwiazdy - sprite z miękką poświatą (rdzeń + halo), wolne mruganie, 4 temperatury barwowe,
//     klejnoty - kilkanaście najjaśniejszych: bloom + 4 cienkie promienie dyfrakcyjne, oddychają,
//   pokrywają CAŁE tło sekcji (także rogi obok planety); tarcza planety i pole logotypu są czyste,
// - stany hover są PŁYNNE: każdy węzeł/linia ma wygładzane "ciepło" (0..1), a faza impulsu
//   na linii jest akumulowana (zmiana prędkości nie powoduje skoku pozycji),
// - mgławica z makiety jest statycznym gradientem CSS (.hero-nebula), nie wypełnieniem canvasa.

import type { HeroLayout, HeroPointer } from './layout';

interface Star { x: number; y: number; size: number; a: number; ph: number; sp: number; c: number; gem: boolean }

export interface SkyLayer {
  resize(layout: HeroLayout): void;
  /** Zwraca false, gdy warstwa jest statyczna i nie potrzebuje kolejnych klatek. */
  frame(now: number, pointer: HeroPointer): boolean;
  /** Węzeł wymuszony przez hover/focus linku (-1 = brak). */
  setFocusNode(dictIndex: number): void;
  /** true, gdy na niebie dzieje się coś szybkiego (wejście, podświetlony węzeł, spadająca gwiazda) - scena rysuje
      wtedy niebo w pełnym tempie; w spoczynku (mruganie, wolne impulsy) wystarcza połowa klatek. */
  readonly busy: boolean;
  destroy(): void;
}

const ease = (v: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const DPR_CLAMP = 1.5;
const DPR_CLAMP_MOBILE = 1.25; // gwiazdy są miękkie - mniej pikseli do rasteryzacji na telefonie
const HEAT_MS = 170; // stała czasowa wygładzania hovera (~0,4 s do pełnego stanu)

// Temperatury barwowe: chłodna biel · lodowy błękit · lazur · szampańska (rzadka, "drogi" akcent).
const COLORS = ['226,232,240', '186,200,255', '125,180,252', '255,234,208'];
const pickColor = () => { const r = Math.random(); return r < 0.56 ? 0 : r < 0.8 ? 1 : r < 0.9 ? 2 : 3; };
// Gęstości na jednostkę² kadru 1440x900 (mobile ma jednostkę = px CSS → mnożnik w makeStars).
const DENSITY = { dust: 4.2e-4, star: 1.35e-4, gem: 1.3e-5 };

const makeSprite = (size: number, paint: (c: CanvasRenderingContext2D, s: number) => void) => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  paint(cv.getContext('2d')!, size);
  return cv;
};

/** Gwiazda: biały rdzeń → barwa → szerokie, bardzo miękkie halo. */
const starSprite = (rgb: string) => makeSprite(48, (c, s) => {
  const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.1, `rgba(${rgb},.95)`);
  g.addColorStop(0.24, `rgba(${rgb},.32)`);
  g.addColorStop(0.55, `rgba(${rgb},.07)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g; c.fillRect(0, 0, s, s);
});

/** Klejnot: bloom + 4 długie i 4 krótkie promienie dyfrakcyjne (cienkie, gasnące gradientem). */
const gemSprite = (rgb: string) => makeSprite(160, (c, s) => {
  const h = s / 2;
  const bloom = c.createRadialGradient(h, h, 0, h, h, h);
  bloom.addColorStop(0, 'rgba(255,255,255,1)');
  bloom.addColorStop(0.045, `rgba(${rgb},.95)`);
  bloom.addColorStop(0.13, `rgba(${rgb},.3)`);
  bloom.addColorStop(0.36, `rgba(${rgb},.07)`);
  bloom.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = bloom; c.fillRect(0, 0, s, s);
  const ray = (len: number, width: number, alpha: number, angle: number) => {
    c.save(); c.translate(h, h); c.rotate(angle);
    const g = c.createLinearGradient(-len, 0, len, 0);
    g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.5, `rgba(255,255,255,${alpha})`); g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath(); c.moveTo(-len, 0); c.quadraticCurveTo(0, -width, len, 0); c.quadraticCurveTo(0, width, -len, 0); c.fill();
    c.restore();
  };
  ray(h * 0.98, 1.5, 0.9, 0); ray(h * 0.98, 1.5, 0.9, Math.PI / 2);
  ray(h * 0.42, 1.1, 0.4, Math.PI / 4); ray(h * 0.42, 1.1, 0.4, -Math.PI / 4);
});

export function createSky(
  canvas: HTMLCanvasElement,
  labels: HTMLElement[],
  startAt: number,
  reduced: boolean,
  interactive: boolean,
): SkyLayer {
  const ctx = canvas.getContext('2d')!;
  const dust = document.createElement('canvas');
  const starSprites = COLORS.map(starSprite);
  const gemSprites = COLORS.map(gemSprite);
  let L: HeroLayout | null = null;
  let dpr = 1;
  let stars: Star[] = [];
  const shoot = { t0: -1e9, x: 0, y: 0, dx: 0, dy: 0, next: 4000 };
  let px = 0, py = 0;
  let focusNode = -1;
  let lastHot = -2;
  let lastNow = 0;
  let staticDrawn = false;
  let busy = true;
  const shown = new Set<number>();
  let hot: number[] = [], warm: number[] = [], linkHot: number[] = [], phase: number[] = [];

  const makeStars = (layout: HeroLayout) => {
    const { xMin, xMax, yMin, yMax, cx, horizon, R, mobile, logoW, gap, nodes } = layout;
    const w = xMax - xMin, h = yMax - yMin, area = w * h;
    const unit = mobile ? 1.7 : 1; // mobile: jednostka = px CSS, kadr jest mały → gęściej
    const cy = horizon + R, clear = (R + (mobile ? 10 : 34)) ** 2; // margines na paralaksę
    // Pole logotypu z cząstek (pierścień po łuku orbity, nie prostokąt): jasne gwiazdy rysowane
    // NAD literami wyglądałyby jak brud.
    const capH = logoW * 0.193;
    const inLogo = (x: number, y: number) => {
      const r = Math.hypot(x - cx, y - cy);
      return r > R + gap - 10 && r < R + gap + capH * 1.3 && Math.abs(Math.atan2(x - cx, cy - y)) < (logoW / 2 + 40) / (R + gap);
    };
    // Pola etykiet DOM przy węzłach (tekst ~230 jedn. w bok od węzła): promienie klejnotów by je przecinały.
    const inLabel = (x: number, y: number) => nodes.some((nd) => {
      const dx = (x - nd.x) * (nd.flip ? -1 : 1);
      return dx > -30 && dx < 250 / layout.k * layout.labelScale && y > nd.y - 50 && y < nd.y + 30;
    });
    const free = (x: number, y: number) => (x - cx) ** 2 + (y - cy) ** 2 >= clear;
    const spot = () => ({ x: xMin + Math.random() * w, y: yMin + Math.random() * h });

    // 1) Pył - raz do bitmapy (współrzędne urządzenia; paralaksa = przesunięcie całej warstwy).
    dust.width = canvas.width; dust.height = canvas.height;
    const d = dust.getContext('2d')!;
    const s = dpr * layout.k;
    d.setTransform(s, 0, 0, s, layout.ox * dpr, layout.oy * dpr);
    const dustCount = Math.min(900, Math.round(area * DENSITY.dust * unit));
    for (let i = 0; i < dustCount; i++) {
      const p = spot();
      if (!free(p.x, p.y)) continue;
      const big = Math.random() < 0.18;
      d.fillStyle = `rgba(${COLORS[pickColor()]},${(big ? 0.34 : 0.16) + Math.random() * 0.3})`;
      d.beginPath(); d.arc(p.x, p.y, (big ? 0.62 : 0.34) + Math.random() * 0.28, 0, 6.283); d.fill();
    }

    // 2) Gwiazdy z poświatą + 3) klejnoty z promieniami.
    stars = [];
    const starCount = Math.min(320, Math.round(area * DENSITY.star * unit));
    for (let i = 0; i < starCount; i++) {
      const p = spot();
      if (!free(p.x, p.y) || inLogo(p.x, p.y)) continue;
      const core = 0.55 + Math.random() * Math.random() * 1.0; // rozkład z przewagą małych
      stars.push({ ...p, size: core * 9, a: 0.5 + Math.random() * 0.5, ph: Math.random() * 6.28, sp: 1400 + Math.random() * 2400, c: pickColor(), gem: false });
    }
    const gemCount = Math.max(mobile ? 4 : 8, Math.min(22, Math.round(area * DENSITY.gem * unit * (mobile ? 1.5 : 1))));
    for (let i = 0, tries = 0; i < gemCount && tries < gemCount * 12; tries++) {
      const p = spot();
      if (!free(p.x, p.y) || inLogo(p.x, p.y)) continue;
      if (inLabel(p.x, p.y) || nodes.some((nd) => Math.hypot(nd.x - p.x, nd.y - p.y) < 70)) continue; // nie przy węzłach/etykietach
      if (stars.some((q) => q.gem && Math.hypot(q.x - p.x, q.y - p.y) < 150)) continue; // rozrzut
      stars.push({ ...p, size: (mobile ? 30 : 38) + Math.random() * 26, a: 0.75 + Math.random() * 0.25, ph: Math.random() * 6.28, sp: 3800 + Math.random() * 3400, c: pickColor(), gem: true });
      i++;
    }
  };

  const placeLabel = (el: HTMLElement, cssX: number, cssY: number) => {
    el.style.transform = `translate3d(${cssX.toFixed(1)}px,${cssY.toFixed(1)}px,0)`;
  };

  return {
    resize(layout) {
      L = layout;
      dpr = Math.min(window.devicePixelRatio || 1, layout.mobile ? DPR_CLAMP_MOBILE : DPR_CLAMP);
      canvas.style.width = `${layout.W}px`;
      canvas.style.height = `${layout.H}px`;
      canvas.width = Math.max(1, Math.round(layout.W * dpr));
      canvas.height = Math.max(1, Math.round(layout.H * dpr));
      makeStars(layout);
      hot = layout.nodes.map(() => 0); warm = layout.nodes.map(() => 0);
      linkHot = layout.links.map(() => 0);
      phase = layout.links.map((_, k) => (k * 0.41) % 1.7);
      staticDrawn = false;
      lastHot = -2;
      // Etykiety: widoczne tylko te, które mają węzeł w tym layoucie.
      const used = new Set(layout.nodes.map((nd) => nd.index));
      labels.forEach((el, i) => {
        el.hidden = !used.has(i);
        const nd = layout.nodes.find((q) => q.index === i);
        if (nd) {
          // Etykieta nie skaluje się z kadrem tak jak pozycje węzłów - gdy po prawej
          // nie mieści się w ekranie (np. 1024 px, węzeł 06), odbijamy ją na lewo.
          const text = el.querySelector<HTMLElement>('.hero-node-text');
          const textW = text ? text.offsetWidth - 16 : 150;
          const cssX = layout.ox + nd.x * layout.k;
          if (cssX + 44 * layout.labelScale + textW > layout.W - 10) nd.flip = true;
          el.toggleAttribute('data-flip', nd.flip);
          placeLabel(el, cssX, layout.oy + nd.y * layout.k);
        }
      });
    },

    setFocusNode(i) { focusNode = i; staticDrawn = false; },

    frame(now, m) {
      if (!L) return false;
      const el = now - startAt;
      if (el < 0) return true;
      const dt = lastNow ? Math.min(100, now - lastNow) : 16;
      lastNow = now;
      const entering = el < 4200;
      // Reduced motion: po fade-inach jedna statyczna klatka; kolejne tylko przy zmianie "hot".
      if (reduced && !entering && staticDrawn) return false;

      const { k, ox, oy, xMin, xMax, yMin, starsBottom } = L;
      const t = reduced ? 0 : now;
      const s = dpr * k;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const onAll = ease(el / 2400);
      if (interactive && !reduced) { px += (m.x - 0.5 - px) * 0.04; py += (m.y - 0.5 - py) * 0.04; }
      const vw = xMax - xMin, skyH = starsBottom - yMin;

      // Pył: jedna bitmapa, najdalszy plan paralaksy.
      ctx.globalAlpha = onAll;
      ctx.drawImage(dust, px * 6 * s, py * 4 * s);

      // Gwiazdy i klejnoty: sprite'y z poświatą, wolne mruganie (klejnoty dodatkowo "oddychają").
      ctx.setTransform(s, 0, 0, s, ox * dpr, oy * dpr);
      for (const st of stars) {
        const tw = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(t / st.sp + st.ph);
        const dep = st.gem ? 26 : 15;
        const size = st.gem ? st.size * (0.78 + 0.34 * tw) : st.size;
        ctx.globalAlpha = onAll * st.a * (st.gem ? 0.55 + 0.45 * tw : 0.4 + 0.6 * tw);
        ctx.drawImage(st.gem ? gemSprites[st.c] : starSprites[st.c], st.x + px * dep - size / 2, st.y + py * dep * 0.6 - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // Spadająca gwiazda: długi gasnący ogon + mała jasna głowa.
      if (!reduced) {
        const speed = Math.max(300, 560 * Math.min(1, vw / 1440));
        if (now - shoot.t0 > shoot.next) {
          shoot.t0 = now; shoot.next = 6000 + Math.random() * 7000;
          shoot.x = xMin + vw * (0.14 + Math.random() * 0.62); shoot.y = yMin + skyH * (0.06 + Math.random() * 0.3);
          const ang = 0.35 + Math.random() * 0.4;
          shoot.dx = Math.cos(ang) * speed * (Math.random() < 0.5 ? 1 : -1); shoot.dy = Math.sin(ang) * speed;
        }
        const stt = (now - shoot.t0) / 1000;
        if (stt < 1) {
          const f = stt, x = shoot.x + shoot.dx * f, y = shoot.y + shoot.dy * f, a = Math.sin(f * Math.PI) ** 1.5;
          const tx = x - shoot.dx * 0.24, ty = y - shoot.dy * 0.24;
          const g = ctx.createLinearGradient(tx, ty, x, y);
          g.addColorStop(0, 'rgba(186,200,255,0)'); g.addColorStop(0.7, `rgba(226,232,255,${0.35 * a})`); g.addColorStop(1, `rgba(255,255,255,${0.95 * a})`);
          ctx.strokeStyle = g; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
          ctx.globalAlpha = a; ctx.drawImage(starSprites[0], x - 7, y - 7, 14, 14); ctx.globalAlpha = 1;
        }
      }

      // Węzły - pozycje z dryfem i paralaksą
      const nodes = L.nodes;
      const links = L.links;
      const deco = L.deco;
      const pos = nodes.map((nd, i) => ({
        x: nd.x + (reduced ? 0 : Math.sin(t / 2600 + i) * 3) + px * 14,
        y: nd.y + (reduced ? 0 : Math.cos(t / 3100 + i * 1.7) * 3) + py * 8,
        on: ease((el - 300 - i * 260) / 1200),
        born: el - 300 - i * 260,
      }));
      let near = -1, nd2 = 1e9;
      if (interactive && m.px >= 0) pos.forEach((p, i) => { const d = Math.hypot(p.x - m.px, p.y - m.py); if (d < nd2) { nd2 = d; near = i; } });
      if (nd2 > 130) near = -1;
      if (focusNode >= 0) { const fi = nodes.findIndex((q) => q.index === focusNode); if (fi >= 0) near = fi; }

      // Wygładzanie stanów hover: wykładnicze dążenie do celu, niezależne od fps.
      const kHeat = reduced ? 1 : 1 - Math.exp(-dt / HEAT_MS);
      const isWarm = (i: number) => near >= 0 && links.some(([a, b]) => (a === near && b === i) || (b === near && a === i));
      for (let i = 0; i < nodes.length; i++) {
        hot[i] += ((near === i ? 1 : 0) - hot[i]) * kHeat;
        warm[i] += ((near === i || isWarm(i) ? 1 : 0) - warm[i]) * kHeat;
      }

      // Linie
      links.forEach(([a, b], li) => {
        const A = pos[a], B = pos[b];
        if (!A || !B) return;
        const lh = (linkHot[li] += ((near === a || near === b ? 1 : 0) - linkHot[li]) * kHeat);
        const grow = ease((el - 700 - li * 240) / 1300);
        if (grow <= 0 || A.on <= 0) return;
        const ex = A.x + (B.x - A.x) * grow, ey = A.y + (B.y - A.y) * grow;
        const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
        const base = `${Math.round(lerp(148, 96, lh))},${Math.round(lerp(163, 165, lh))},${Math.round(lerp(184, 250, lh))}`;
        const al = lerp(0.3, 0.75, lh) * grow;
        g.addColorStop(0, `rgba(${base},${al * 0.35})`); g.addColorStop(0.5, `rgba(${base},${al})`); g.addColorStop(1, `rgba(${base},${al * 0.35})`);
        ctx.strokeStyle = g; ctx.lineWidth = lerp(1, 1.2, lh);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
        if (grow >= 1 && !reduced) {
          // Faza akumulowana: hover przyspiesza impuls płynnie (bez przeskoku pozycji).
          const cycle = lerp(1.7, 1, lh);
          phase[li] = (phase[li] + dt * lerp(1 / 2600, 1 / 900, lh)) % cycle;
          const f = phase[li];
          if (f < 1) {
            const len = 0.12, f0 = Math.max(0, f - len);
            const edge = Math.min(1, f / 0.08, (1 - f) / 0.08); // miękkie wejście/zejście impulsu
            const x = A.x + (B.x - A.x) * f, y = A.y + (B.y - A.y) * f;
            const x0 = A.x + (B.x - A.x) * f0, y0 = A.y + (B.y - A.y) * f0;
            const tg = ctx.createLinearGradient(x0, y0, x, y);
            tg.addColorStop(0, 'rgba(165,180,252,0)'); tg.addColorStop(1, `rgba(165,180,252,${lerp(0.6, 0.95, lh) * edge})`);
            ctx.strokeStyle = tg; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
            ctx.fillStyle = `rgba(255,255,255,${lerp(0.6, 0.9, lh) * edge})`;
            ctx.beginPath(); ctx.arc(x, y, 1.4, 0, 6.283); ctx.fill();
          }
        }
      });

      // Węzły + leader-line (etykieta tekstowa jest w DOM)
      const labelUnit = L.labelScale / k;
      pos.forEach((p, i) => {
        const label = labels[nodes[i].index];
        if (label) {
          placeLabel(label, ox + p.x * k, oy + p.y * k);
          if (p.on > 0 && !shown.has(nodes[i].index)) { shown.add(nodes[i].index); label.setAttribute('data-on', ''); }
        }
        if (p.on <= 0) return;
        const h = hot[i], w = warm[i], pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t / 1100 + i);
        if (p.born < 1600 && !reduced) {
          const kk = p.born / 1600;
          ctx.strokeStyle = `rgba(96,165,250,${(1 - kk) * (1 - kk) * 0.55})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, (4 + ease(kk) * 46) * deco, 0, 6.283); ctx.stroke();
        }
        const R = lerp(22 + pulse * 4, 40, h) * deco;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        g.addColorStop(0, `rgba(96,165,250,${lerp(lerp(0.28, 0.4, w), 0.55, h) * p.on})`);
        g.addColorStop(0.45, `rgba(59,130,246,${lerp(0.08, 0.18, h) * p.on})`);
        g.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.fillStyle = g; ctx.fillRect(p.x - R, p.y - R, R * 2, R * 2);
        ctx.strokeStyle = `rgba(165,180,252,${lerp(0.35 + pulse * 0.15, 0.9, h) * p.on})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, lerp(6.5, 9, h) * deco, 0, 6.283); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${p.on})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, lerp(2.3, 3.2, h) * deco, 0, 6.283); ctx.fill();
        // Leader w px CSS etykiety (labelScale = --u), przeliczony na jednostki sceny.
        const dir = nodes[i].flip ? -1 : 1, u = labelUnit;
        ctx.strokeStyle = `rgba(148,163,184,${lerp(0.3, 0.7, h) * p.on})`; ctx.lineWidth = u;
        ctx.beginPath();
        ctx.moveTo(p.x + dir * 7 * u, p.y - 7 * u);
        ctx.lineTo(p.x + dir * 16 * u, p.y - 16 * u);
        ctx.lineTo(p.x + dir * 38 * u, p.y - 16 * u);
        ctx.stroke();
      });

      const hotDict = near >= 0 ? nodes[near].index : -1;
      if (hotDict !== lastHot) {
        labels.forEach((lb, i) => lb.toggleAttribute('data-hot', i === hotDict));
        lastHot = hotDict;
      }
      if (reduced && !entering) staticDrawn = true;
      // "Żywe" niebo = wejście, podświetlony węzeł / linia (stany hover) albo lecąca spadająca gwiazda.
      let heat = 0;
      for (let i = 0; i < hot.length; i++) heat = Math.max(heat, hot[i], warm[i]);
      for (let i = 0; i < linkHot.length; i++) heat = Math.max(heat, linkHot[i]);
      busy = entering || heat > 0.01 || (!reduced && now - shoot.t0 < 1000);
      return true;
    },

    get busy() { return busy; },

    destroy() {
      labels.forEach((lb) => { lb.removeAttribute('data-on'); lb.removeAttribute('data-hot'); });
      canvas.width = canvas.height = 1;
      dust.width = dust.height = 1;
    },
  };
}
