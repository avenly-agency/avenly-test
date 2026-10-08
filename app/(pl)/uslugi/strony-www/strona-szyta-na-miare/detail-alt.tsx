'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { clamp01, useFrame, useReducedPref } from '../../_usluga/shared';

// SCENA 4 - „Czuć każdy detal.”: DWIE KOLEJNE PROPOZYCJE (runda 2, 2026-10-02). Trzecia to kula z linii (detail.tsx).
// Zdanie z pierwotnej podstrony („Każde przewinięcie, najazd i przejście jest dopracowane”) odwiedzający sprawdza sam:
//   Letters  „Litery”  - sam nagłówek jest obiektem: wielkie litery unoszą się pod kursorem / palcem, falują przy
//                        przewijaniu, a kliknięcie puszcza przez nie falę (fale się nakładają). Typografia w ruchu,
//                        jak na stronach z najwyższej półki.
//   Specimen „Próbki”  - trzy żywe próbki interfejsu obok siebie, po jednej na gest: mała strona, która przewija się
//                        razem z Twoją (przewinięcie), przycisk, który wychodzi kursorowi naprzeciw (najazd), karta,
//                        która płynnie przechodzi w drugi stan po kliknięciu (przejście; bez dotknięcia gra sama).
// Sekcje nieprzypięte („whole section”, da się najeżdżać). Bez JS / ograniczony ruch: nagłówek, tekst i lista gestów.
// TELEFON (bez kursora): w „Literach” dotknięcie unosi litery pod palcem i puszcza falę, przewijanie je faluje;
// w „Próbkach” kafle stoją jeden pod drugim, mała strona przewija się z drogą własnego kafla przez ekran, przycisk
// gra sam (punkt dotyku podchodzi, przycisk wychodzi mu naprzeciw - CSS) i odpowiada na przyłożenie palca,
// karta przechodzi sama albo po stuknięciu.

type T = CustomCopy['detail'];

export const Letters = ({ t }: { t: T }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    const head = root?.querySelector<HTMLElement>('.sm-dl-title');
    if (!root || !head || reduced) return;
    const ls = Array.from(head.querySelectorAll<HTMLElement>('.sm-dl-c'));
    let raf = 0, vis = false, lastY = window.scrollY, vel = 0, phase = 0;
    const ptr = { x: -1e5, y: -1e5, on: 0, goal: 0 };
    const waves: { x: number; y: number; t: number }[] = [];
    const frame = (now: number) => {
      raf = 0;
      if (!vis || document.hidden) return;
      const hr = head.getBoundingClientRect();
      const sy = window.scrollY;
      vel += (Math.min(60, Math.abs(sy - lastY)) - vel) * 0.14; phase += (sy - lastY) * 0.012; lastY = sy;
      ptr.on += (ptr.goal - ptr.on) * 0.14;
      while (waves.length && now - waves[0].t > 1800) waves.shift();
      const sig = Math.max(90, hr.width * 0.11);
      let alive = vel > 0.2 || waves.length > 0 || Math.abs(ptr.goal - ptr.on) > 0.01 || ptr.on > 0.01;
      ls.forEach((el, i) => {
        // położenie litery z układu (bez jej własnego przekształcenia)
        const cx = hr.left + el.offsetLeft + el.offsetWidth / 2, cy = hr.top + el.offsetTop + el.offsetHeight / 2;
        const dx = cx - ptr.x, dy = cy - ptr.y;
        const k = Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig)) * ptr.on;
        let y = -k * el.offsetHeight * 0.2 + Math.sin(i * 0.55 - phase) * Math.min(1, vel / 26) * el.offsetHeight * 0.07;
        for (const w of waves) {
          const d = Math.hypot(cx - w.x, cy - w.y), age = (now - w.t) / 1000;
          y -= Math.exp(-((d - age * 1100) ** 2) / (2 * 110 ** 2)) * Math.exp(-age * 1.5) * el.offsetHeight * 0.26;
        }
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${(1 + k * 0.16).toFixed(3)}) rotate(${(k * Math.max(-1, Math.min(1, dx / sig)) * -5).toFixed(2)}deg)`;
        el.style.setProperty('--k', Math.min(1, k * 1.5 + Math.abs(y) / (el.offsetHeight * 0.3)).toFixed(3));
        if (Math.abs(y) > 0.3) alive = true;
      });
      if (alive) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && vis) raf = requestAnimationFrame(frame); };
    const move = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.goal = 1; kick(); };
    const leave = () => { ptr.goal = 0; kick(); };
    const down = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('a, button')) return;
      // palec nie ma „najazdu”: dotknięcie od razu unosi litery pod palcem (opadają po puszczeniu) i puszcza falę
      ptr.x = e.clientX; ptr.y = e.clientY; ptr.goal = 1;
      waves.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (waves.length > 5) waves.shift();
      kick();
    };
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; kick(); }, { rootMargin: '80px 0px' });
    io.observe(root);
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave, { passive: true });
    root.addEventListener('pointercancel', leave, { passive: true });
    root.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('scroll', kick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', leave);
      root.removeEventListener('pointerdown', down);
      window.removeEventListener('scroll', kick);
      ls.forEach((el) => { el.style.transform = ''; el.style.removeProperty('--k'); });
    };
  }, [reduced]);

  const word = (w: string, accent: boolean, key: string) => (
    <span key={key} className="sm-dl-w" data-accent={accent ? '' : undefined}>
      {Array.from(w).map((c, i) => <span key={i} className="sm-dl-c">{c}</span>)}
    </span>
  );
  return (
    <section ref={ref} className="sm-d2 sm-dl" aria-labelledby="sm-dl-h">
      <div className="container mx-auto px-6">
        <h2 id="sm-dl-h" className="im-title sm-dl-title" aria-label={`${t.title} ${t.titleAccent}`}>
          <span aria-hidden="true">
            {t.title.split(' ').map((w, i) => word(w, false, `a${i}`))}
            {t.titleAccent.split(' ').map((w, i) => word(w, true, `b${i}`))}
          </span>
        </h2>
        <div className="sm-dl-foot">
          <p className="im-lead sm-d-lead">{t.text}</p>
          <ol className="sm-dl-list">
            {t.stepsLetters.map((s, i) => <li key={s}><span aria-hidden="true">{i + 1}</span>{s}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
};

export const Specimen = ({ t, site }: { t: T; site: CustomCopy['site'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);

  // 1 - przewinięcie: mała strona w kaflu przewija się razem ze stroną. Postęp liczony z drogi SAMEGO KAFLA przez
  // okno (nie całej sekcji): na telefonie kafle stoją jeden pod drugim i sekcja jest kilka razy wyższa od kafla -
  // liczona z sekcji strona w kaflu ledwo drgała, zanim kafel zjechał z ekranu
  useFrame((frac) => {
    const el = ref.current;
    const tile = el?.querySelector<HTMLElement>('.sm-ds-tile[data-k="0"]');
    if (!el || !tile) return;
    const r = tile.getBoundingClientRect(), vh = window.innerHeight;
    const v = clamp01((vh - (r.top - frac)) / (vh + r.height)).toFixed(4);
    if (el.style.getPropertyValue('--sp') !== v) el.style.setProperty('--sp', v);
  }, !reduced);

  useEffect(() => {
    const root = ref.current;
    const magnet = root?.querySelector<HTMLElement>('.sm-ds-tile[data-k="1"]');
    const morph = root?.querySelector<HTMLElement>('.sm-ds-tile[data-k="2"]');
    if (!root || !magnet || !morph || reduced) return;
    // 2 - najazd: przycisk wychodzi kursorowi naprzeciw
    const mv = (e: PointerEvent) => {
      const r = magnet.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2, y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      magnet.style.setProperty('--mx', x.toFixed(3)); magnet.style.setProperty('--my', y.toFixed(3));
      magnet.setAttribute('data-near', '');
    };
    const lv = () => { magnet.style.setProperty('--mx', '0'); magnet.style.setProperty('--my', '0'); magnet.removeAttribute('data-near'); };
    // 3 - przejście: kliknięcie przełącza stan karty; bez dotknięcia karta gra sama (pauza po kliknięciu i poza ekranem)
    let vis = false, hold = 0;
    const flip = () => morph.toggleAttribute('data-open');
    const click = () => { flip(); hold = performance.now() + 9000; };
    const id = window.setInterval(() => { if (vis && !document.hidden && performance.now() > hold) flip(); }, 3200);
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; }, { threshold: 0.3 });
    io.observe(morph);
    magnet.addEventListener('pointermove', mv, { passive: true });
    // dotyk: samo przyłożenie palca ciągnie przycisk (na telefonie nie ma ruchu kursora przed dotknięciem);
    // bez dotyku próbka gra sama - punkt dotyku w CSS (.sm-ds-finger)
    magnet.addEventListener('pointerdown', mv, { passive: true });
    magnet.addEventListener('pointerleave', lv, { passive: true });
    magnet.addEventListener('pointercancel', lv, { passive: true });
    morph.addEventListener('click', click);
    return () => {
      window.clearInterval(id); io.disconnect();
      magnet.removeEventListener('pointermove', mv);
      magnet.removeEventListener('pointerdown', mv);
      magnet.removeEventListener('pointerleave', lv);
      magnet.removeEventListener('pointercancel', lv);
      morph.removeEventListener('click', click);
    };
  }, [reduced]);

  return (
    <section ref={ref} className="sm-d2 sm-ds" aria-labelledby="sm-ds-h">
      <div className="container mx-auto px-6">
        <div className="sm-ds-head">
          <h2 id="sm-ds-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
          <p className="im-lead sm-d-lead">{t.text}</p>
        </div>
        <ol className="sm-ds-grid">
          <li>
            <div className="sm-ds-tile" data-k="0" aria-hidden="true">
              <span className="sm-ds-bar"><i /></span>
              <span className="sm-ds-page">
                <b className="sm-ds-h" /><b className="sm-ds-h" /><i className="sm-ds-l" /><i className="sm-ds-l" />
                <u className="sm-ds-img"><em /></u>
                <b className="sm-ds-h" /><i className="sm-ds-l" /><i className="sm-ds-l" /><i className="sm-ds-l" />
                <u className="sm-ds-img"><em /></u>
                <b className="sm-ds-h" /><i className="sm-ds-l" /><i className="sm-ds-l" />
              </span>
            </div>
            <p className="sm-ds-cap"><span aria-hidden="true">1</span>{t.stepsSamples[0]}</p>
          </li>
          <li>
            <div className="sm-ds-tile" data-k="1" aria-hidden="true">
              <span className="sm-ds-btn"><span>{site.cta}<ArrowUpRight /></span></span>
              <i className="sm-ds-finger" />
            </div>
            <p className="sm-ds-cap"><span aria-hidden="true">2</span>{t.stepsSamples[1]}</p>
          </li>
          <li>
            <div className="sm-ds-tile" data-k="2" aria-hidden="true">
              <span className="sm-ds-morph">
                <u className="sm-ds-thumb"><em /></u>
                <span className="sm-ds-txt"><b>{site.project} 01</b><i className="sm-ds-l" /><i className="sm-ds-l" /></span>
                <span className="sm-ds-go" style={{ '--i': 0 } as CSSProperties}><ArrowUpRight /></span>
              </span>
            </div>
            <p className="sm-ds-cap"><span aria-hidden="true">3</span>{t.stepsSamples[2]}</p>
          </li>
        </ol>
      </div>
    </section>
  );
};
