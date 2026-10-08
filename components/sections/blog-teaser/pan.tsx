'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogTeaserDict } from '@/lib/i18n/home/blog-teaser';
import type { BtPost } from './data';
import { BlogCards } from './cards';
import { BtFoot, BtHead, BtMeta, useReducedPref, useStickyProgress } from './shared';

// Układ PANORAMA (wybór właściciela 2026-09-29). Przewijanie = jazda kamery w bok (ujęcie z wózka) wzdłuż
// panoramy dużych okładek. Zdjęcia w ramkach przesuwają się wolniej niż same ramki (głębia), okładka w kadrze
// jest w pełnym świetle, kolejne przygasają. Scena przyklejona do ekranu (sticky) na czas przejazdu, zwykłe
// przewijanie - bez blokowania. CSS liczy wszystko z --t (0-1) i indeksu okładki. Style .bw-* w blog-teaser.css.
// Nagłówek sekcji jest częścią sceny, a wszystko stoi przy krawędziach wrappera (kontenera strony): nagłówek
// jak w innych sekcjach ("Wszystkie wpisy" przy prawej krawędzi), okładka, tytuł wpisu i licznik przy lewej
// (właściciel: "dosuń po prostu do lewej wszystko do skrajności wrappera"). Następne okładki wystają z prawej.
// Ograniczony ruch = nagłówek + zwykłe karty; bez JS = pierwszy wpis bez przejazdu (<noscript>).

const pad2 = (n: number) => String(n).padStart(2, '0');
const NOSCRIPT = '.bw{height:auto}.bw-stick{position:static;height:auto}';

export const PanSection = ({ posts, t }: { posts: BtPost[]; t: BlogTeaserDict }) => {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const reduced = useReducedPref();
  const n = posts.length;

  // --x0 = lewa krawędź treści wrappera w scenie (scena ma pełną szerokość ekranu), --w = szerokość okładki:
  // tak duża, żeby nagłówek + okładka + tytuł wpisu + licznik zmieściły się w oknie, maks. szerokość wrappera
  // (telefon 90%, żeby następna okładka wystawała). Tytuły łamią się inaczej przy innej szerokości, więc 2-3
  // przybliżenia. Pomiar tylko przy zmianie rozmiaru i po wczytaniu fontów.
  useEffect(() => {
    const st = stick.current;
    if (!st) return;
    let raf = 0;
    const fit = () => {
      raf = 0;
      const top = st.firstElementChild as HTMLElement | null;
      const bottom = st.lastElementChild as HTMLElement | null;
      const frame = st.querySelector<HTMLElement>('.bw-frame');
      if (!top || !bottom || !frame || !frame.offsetHeight) return;
      const wcs = getComputedStyle(top);
      const padL = parseFloat(wcs.paddingLeft);
      const inner = top.clientWidth - padL - parseFloat(wcs.paddingRight);
      st.style.setProperty('--x0', `${Math.round(top.getBoundingClientRect().left - st.getBoundingClientRect().left + padL)}px`);
      const wide = window.innerWidth >= 1024;
      const max = wide ? inner : inner * 0.9;
      const min = Math.min(max, wide ? 520 : 260);
      const cs = getComputedStyle(st);
      const avail = st.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      for (let k = 0; k < 4; k++) {
        const rest = bottom.offsetTop + bottom.offsetHeight - top.offsetTop - frame.offsetHeight;
        const w = Math.floor(Math.min(max, Math.max(min, (avail - rest) * (frame.offsetWidth / frame.offsetHeight))));
        if (Math.abs(w - frame.offsetWidth) < 1) break;
        st.style.setProperty('--w', `${w}px`);
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(fit); };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(st);
    document.fonts?.ready.then(schedule);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [reduced]);

  useStickyProgress(ref, (tt, el) => {
    // Krótki postój na początku i na końcu przejazdu (pierwsza / ostatnia okładka stoi chwilę w kadrze).
    const e = Math.min(1, Math.max(0, (tt - 0.08) / 0.84));
    const s = e * e * (3 - 2 * e) * 0.35 + e * 0.65; // miękki start i koniec
    el.style.setProperty('--t', s.toFixed(4));
    const a = Math.min(n - 1, Math.max(0, Math.round(s * (n - 1))));
    if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
  });

  if (reduced) return <><BtHead t={t} /><BlogCards posts={posts} t={t} /></>;

  return (
    <div className="bw" ref={ref} style={{ '--n': n } as CSSProperties}>
      <noscript><style>{NOSCRIPT}</style></noscript>
      <div className="bw-stick" ref={stick}>
        <div className="bw-wrap container mx-auto px-6">
          <BtHead t={t} className="bw-head" />
        </div>
        <ol className="bw-strip" aria-label={t.listAria}>
          {posts.map((p, i) => (
            <li key={p.id} className="bw-item" style={{ '--i': i } as CSSProperties} data-on={i === active ? '' : undefined}>
              <article className="bw-card">
                <div className="bw-frame">
                  <div className="bw-par">
                    <Image src={p.image} alt="" fill sizes="(max-width: 1023px) 90vw, 70vw" className="bt-img" loading="lazy" />
                  </div>
                  <i className="bw-shade" aria-hidden="true" />
                </div>
                <div className="bw-copy">
                  <BtMeta post={p} />
                  <h3 className="bw-title"><Link href={p.href} prefetch={false} className="bt-link">{p.title}</Link></h3>
                  <BtFoot post={p} t={t} />
                </div>
              </article>
            </li>
          ))}
        </ol>
        <div className="bw-wrap container mx-auto px-6" aria-hidden="true">
          <div className="bw-nav">
            <span className="bw-count"><b>{pad2(active + 1)}</b> / {pad2(n)}</span>
            <i className="bw-track"><i /></i>
          </div>
        </div>
      </div>
    </div>
  );
};
