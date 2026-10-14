'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { OnCraft, OnFaq, nn } from '../parts';

// Propozycja "MANIFEST": pięć zasad dużą typografią. Słowa zapalają się w tempie czytania -
// gdy linia tekstu dojdzie do ok. 2/3 wysokości ekranu, jej słowa przechodzą z przygaszonych
// w białe (kaskadą od lewej), a sedno zdania w kolor marki. Linia po lewej rośnie z postępem.
// Przewijanie w górę gasi je z powrotem. Bez JS i przy ograniczonym ruchu: wszystko zapalone.

const READ = 0.68; // linia czytania: ułamek wysokości ekranu

const Words = ({ text, accent = false }: { text: string; accent?: boolean }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          {w ? <span className={`on-mf-w${accent ? ' on-mf-w--a' : ''}`}>{w}</span> : null}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
};

const Manifest = ({ t }: { t: ONasDict }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = Array.from(sec.querySelectorAll<HTMLElement>('.on-mf-w'));
    const nums = Array.from(sec.querySelectorAll<HTMLElement>('.on-mf-line'));
    const body = sec.querySelector<HTMLElement>('.on-mf-lines');
    sec.dataset.live = '';
    let tops: number[] = [], lineTops: number[] = [], start = 0, end = 1, raf = 0;
    const lit = new Set<HTMLElement>();

    const measure = () => {
      const sy = window.scrollY;
      tops = words.map((w) => {
        const r = w.getBoundingClientRect();
        const p = w.parentElement!.getBoundingClientRect();
        // kaskada od lewej w obrębie linii tekstu
        w.style.setProperty('--d', `${Math.round(((r.left - p.left) / Math.max(1, p.width)) * 320)}ms`);
        return r.top + sy + r.height * 0.5;
      });
      lineTops = nums.map((l) => l.getBoundingClientRect().top + sy + 24);
      if (body) {
        const b = body.getBoundingClientRect();
        start = b.top + sy;
        end = b.bottom + sy;
      }
    };
    const update = () => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * READ;
      words.forEach((w, i) => {
        const on = tops[i] < line;
        if (on === lit.has(w)) return;
        if (on) { lit.add(w); w.dataset.on = ''; } else { lit.delete(w); delete w.dataset.on; }
      });
      nums.forEach((l, i) => {
        const on = lineTops[i] < line;
        if (on !== ('on' in l.dataset)) { if (on) l.dataset.on = ''; else delete l.dataset.on; }
      });
      const prog = Math.min(1, Math.max(0, (line - start) / Math.max(1, end - start)));
      sec.style.setProperty('--prog', prog.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    measure();
    update();
    const ro = new ResizeObserver(onResize);
    ro.observe(sec);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section ref={ref} className="on-sec on-mf" aria-labelledby="on-mf-h">
      <div className="container mx-auto px-6">
        <div className="on-body">
          <h2 id="on-mf-h" className="on-mf-h">{t.manifest.heading}</h2>
          <div className="on-mf-lines">
            <i className="on-mf-rule" aria-hidden="true" />
            {t.manifest.lines.map((l, i) => (
              <p key={i} className="on-mf-line" style={{ '--i': i } as CSSProperties}>
                <span className="on-num on-mf-num" aria-hidden="true">{nn(i)}</span>
                <span className="on-mf-text">
                  <Words text={l.pre.trimEnd()} />
                  {l.pre.endsWith(' ') ? ' ' : null}
                  <Words text={l.accent} accent />
                  {l.post ? <>{l.post.startsWith(' ') ? ' ' : null}<Words text={l.post.trimStart()} /></> : null}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ManifestPage = ({ t }: { t: ONasDict }) => (
  <>
    <Manifest t={t} />
    <OnCraft t={t} />
    <OnFaq t={t} />
  </>
);
