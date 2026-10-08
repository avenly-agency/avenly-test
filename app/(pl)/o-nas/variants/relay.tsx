'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { OnCraft, OnFacts, OnFaq, OnSecHead } from '../parts';

// Propozycja "BEZ POŚREDNIKÓW": droga jednej wiadomości. U góry duża agencja - wiadomość
// przechodzi przez pięć osób, na każdej czeka. Niżej Avenly - leci prosto do nas, a odpowiedź
// wraca w 24 h. Trzy kroki z podpisami (PRODUCT.md, zasada 6), pauza przyciskiem (WCAG 2.2.2),
// pauza poza ekranem. Bez JS / ograniczony ruch: stan końcowy obu dróg i wszystkie kroki.

const HOP = 1, WAIT = 0.6, START = 0.4;
const US_GO = [6.7, 7.7] as const;
const US_BACK = [9.6, 10.6] as const;
const STEPS = [[0, 6.4], [6.4, 9.4], [9.4, 13.4]] as const;
const FADE = [13.4, 14.2] as const;
const CYCLE = FADE[1];

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const span = (t: number, [a, b]: readonly [number, number]) => ease((t - a) / (b - a));

/** Pozycja wiadomości w dużej agencji: 4 przeskoki, na każdej osobie chwila czekania. */
const agencyP = (t: number) => {
  const x = t - START;
  if (x <= 0) return 0;
  const k = Math.floor(x / (HOP + WAIT));
  if (k >= 4) return 1;
  const r = x - k * (HOP + WAIT);
  return (k + (r >= HOP ? 1 : ease(r / HOP))) / 4;
};

const Track = ({ kind, name, nodes, reply }: { kind: 'agency' | 'us'; name: string; nodes: string[]; reply?: string }) => (
  <div className={`on-rl-track on-rl-track--${kind}`}>
    <p className="on-rl-name">{name}</p>
    <div className="on-rl-rail" data-rail={kind}>
      <i className="on-rl-line" />
      <i className="on-rl-fill" />
      {nodes.map((label, i) => (
        <span
          key={label}
          className="on-rl-node"
          data-node={i}
          style={{ '--a': i / (nodes.length - 1) } as CSSProperties}
        >
          {label}
        </span>
      ))}
      <i className="on-rl-dot" />
      {kind === 'us' && <i className="on-rl-dot on-rl-dot--back" />}
      {reply && <span className="on-rl-tag">{reply}</span>}
    </div>
  </div>
);

const Relay = ({ t }: { t: ONasDict }) => {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // stan końcowy z CSS
    sec.dataset.live = '';
    const agency = sec.querySelector<HTMLElement>('[data-rail="agency"]');
    const us = sec.querySelector<HTMLElement>('[data-rail="us"]');
    const steps = Array.from(sec.querySelectorAll<HTMLElement>('.on-rl-step'));
    if (!agency || !us) return;
    const aNodes = Array.from(agency.querySelectorAll<HTMLElement>('[data-node]'));
    const uNodes = Array.from(us.querySelectorAll<HTMLElement>('[data-node]'));
    // Zapis do DOM tylko przy zmianie wartości.
    const cache = new WeakMap<HTMLElement, Record<string, string>>();
    const put = (el: HTMLElement, key: string, v: string) => {
      let c = cache.get(el);
      if (!c) { c = {}; cache.set(el, c); }
      if (c[key] === v) return;
      c[key] = v;
      if (key.startsWith('--')) el.style.setProperty(key, v);
      else if (v) el.setAttribute(key, v === '1' ? '' : v);
      else el.removeAttribute(key);
    };

    let time = 0, last = 0, raf = 0, visible = false;
    const render = () => {
      const t = time % CYCLE;
      const fade = 1 - span(t, FADE);
      const pa = agencyP(t);
      put(agency, '--p', pa.toFixed(4));
      put(agency, '--o', fade.toFixed(3));
      aNodes.forEach((el, k) => put(el, 'data-hit', t >= START && pa >= k / 4 - 1e-3 && fade > 0.5 ? '1' : ''));
      const pu = span(t, US_GO);
      const back = span(t, US_BACK);
      put(us, '--p', pu.toFixed(4));
      put(us, '--q', (1 - back).toFixed(4));
      put(us, '--o', fade.toFixed(3));
      put(us, 'data-go', t >= US_GO[0] && fade > 0.5 ? '1' : '');
      put(us, 'data-back', t >= US_BACK[0] && t < US_BACK[1] + 0.2 ? '1' : '');
      put(us, 'data-done', back >= 1 && fade > 0.5 ? '1' : '');
      put(uNodes[0], 'data-hit', t >= US_GO[0] && fade > 0.5 ? '1' : '');
      put(uNodes[1], 'data-hit', pu >= 1 && fade > 0.5 ? '1' : '');
      steps.forEach((el, i) => {
        const [a, b] = STEPS[i];
        put(el, 'data-state', t >= b ? 'done' : t >= a ? 'on' : '');
        put(el, '--b', Math.min(1, Math.max(0, (t - a) / (b - a))).toFixed(3));
      });
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || pausedRef.current || document.hidden) { last = 0; return; }
      if (last) time += Math.min(0.1, (now - last) / 1000);
      last = now;
      render();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && visible && !pausedRef.current && !document.hidden) raf = requestAnimationFrame(tick); };
    render();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(sec);
    const onVis = () => wake();
    document.addEventListener('visibilitychange', onVis);
    const onResume = () => wake();
    sec.addEventListener('on-rl-resume', onResume);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      sec.removeEventListener('on-rl-resume', onResume);
    };
  }, []);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    pausedRef.current = next;
    if (!next) ref.current?.dispatchEvent(new Event('on-rl-resume'));
  };

  return (
    <section ref={ref} className="on-sec on-rl" aria-labelledby="on-rl-h" data-paused={paused ? '' : undefined}>
      <div className="container mx-auto px-6">
        <div className="on-body">
          <OnSecHead id="on-rl-h" heading={t.relay.heading} accent={t.relay.headingAccent} lead={t.relay.lead} className="on-rl-head" />
          <div className="on-rl-stage" aria-hidden="true">
            <Track kind="agency" name={t.relay.agency} nodes={t.relay.roles} />
            <Track kind="us" name={t.relay.studio} nodes={[t.relay.you, t.relay.us]} reply={t.relay.reply} />
          </div>
          <div className="on-rl-story">
            <ol className="on-rl-steps">
              {t.relay.steps.map((s, i) => (
                <li key={s} className="on-rl-step">
                  <i className="on-rl-bar" aria-hidden="true"><i /></i>
                  <span className="on-rl-step-n" aria-hidden="true">{i + 1}</span>
                  <span className="on-rl-step-t">{s}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="on-rl-pause"
              aria-label={paused ? t.relay.play : t.relay.pause}
              onClick={toggle}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const RelayPage = ({ t }: { t: ONasDict }) => (
  <>
    <Relay t={t} />
    <OnFacts t={t} />
    <OnCraft t={t} />
    <OnFaq t={t} />
  </>
);
