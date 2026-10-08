'use client';

import { Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CatalogModel } from './model';
import { Sky } from './sky';
import { ArtCard, CtaCard } from './art-card';
import { useReducedPref } from './shared';
import './uslugi.css'; // style katalogu we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Katalog usług (/uslugi) i strona kategorii /uslugi/strony-www + wersje EN (/uslugi/design usunięte 2026-10-01).
// Praca równoległa, etap 2 - chat 2. Prośby właściciela (2026-09-29, kolejno): "u góry tekst, jakieś shadery,
// pod spodem w boxach te animacje motion, które są na stronie głównej"; "zamysł rozmieszczenia taki jak na
// pierwotnej wersji"; wybór wersji "Galeria"; "cinematic cała podstrona"; "nie shiftuj pozycji boxów",
// "pierwsza sekcja to tylko dodatek do boxów - zajmuje trochę ekranu, ale widać usługi".
//   Układ pierwotnej wersji: niski wyśrodkowany nagłówek (h1, opis), filtr kategorii, galeria kart z animowanymi
//   rysunkami Oferty (art-card.tsx); box "Nie wiesz, co wybrać?" z własnym rysunkiem konsultacji (cta-art.tsx).
//   Kinowo: nagłówek wysuwa się linijkami spod maski, przy przewijaniu odjeżdża (unosi się i gaśnie), karty
//   pojawiają się bez przesuwania pozycji.
// Wybory właściciela (2026-09-29 / 30): karty "Plan" (od 2026-10-01 w wyglądzie „Kadr” - uslugi.css); bez widocznej ścieżki (ścieżka tylko w JSON-LD na page.tsx);
// bez etykiety nad nagłówkiem; tło = MGŁAWICA z podstrony Realizacje (sky.tsx + nebula.ts) za całą podstroną
// ("podkradnij tło, które jest na podstronie Realizacje" -> "wybieram tło mgławicę"); góra podstrony = „Kropka”,
// wyśrodkowana, filtr też pośrodku (z 4 propozycji: "kropka najlepsze, ale wycentruj tak samo nawigację z kategoriami"):
// jedno wielkie zdanie z kropką w kolorze marki (jak w logo "AVENLY." i "Zacznijmy." na Kontakcie), pod nim krótki
// opis. Notatki: docs/podstrony/uslugi.md.
// WEJŚCIE (2026-09-30, właściciel: „najpierw czerń kosmosu, dopiero potem tło się pojawia i tekst potem po kolei”):
// czerń -> mgławica rodzi się (sky.tsx, onReady = pierwsza klatka) -> po TEXT_AFTER tekst po kolei (data-go: zdanie,
// opis, filtr) -> po CARDS_AFTER karty (data-cards). Gdy shader się spóźnia, tekst rusza po FALLBACK_MS od hydratacji.
// Galeria hydratuje się osobno (Suspense), więc góra strony i mgławica startują bez czekania na 8 rysunków kart.
// Karty wchodzą efektem „Obrys” (wybór właściciela 2026-10-01 z Obrys / Kropka / Kurtyna / Skan): kontur rysuje się z punktem
// światła w kolorze usługi, potem tło, deska i rysunek (art-card.tsx, uslugi.css).
// Bez JS: <noscript> pokazuje wszystko od razu; gdyby hydratacja się nie powiodła, CSS pokazuje tekst po 6 s, karty po 8 s.
const TEXT_AFTER = 650;
const CARDS_AFTER = 750;
const FALLBACK_MS = 1500;

/** Pasek kategorii. Gdy kategorie nie mieszczą się w pasku (telefon), tor przycisków przewija się w poziomie, a krawędź
    z ukrytymi kategoriami łagodnie gaśnie (--fl / --fr, maska w uslugi.css) zamiast ucinać słowo; wybrana kategoria
    przewija się na środek paska. Osobny komponent, bo galeria hydratuje się w Suspense (efekt musi biec z nią). */
const Filter = ({ m, cat, pick, reduced }: { m: CatalogModel; cat: string; pick: (id: string) => void; reduced: boolean }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tr = trackRef.current;
    if (!tr) return;
    const update = () => {
      const max = tr.scrollWidth - tr.clientWidth;
      tr.style.setProperty('--fl', tr.scrollLeft > 2 ? '30px' : '0px');
      tr.style.setProperty('--fr', tr.scrollLeft < max - 2 ? '30px' : '0px');
    };
    update();
    tr.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(tr);
    return () => { tr.removeEventListener('scroll', update); ro.disconnect(); };
  }, []);
  const choose = (id: string, el: HTMLButtonElement) => {
    pick(id);
    const tr = trackRef.current;
    if (!tr || tr.scrollWidth <= tr.clientWidth) return;
    const r = el.getBoundingClientRect(), t = tr.getBoundingClientRect();
    tr.scrollTo({ left: tr.scrollLeft + r.left - t.left - (t.width - r.width) / 2, behavior: reduced ? 'auto' : 'smooth' });
  };
  return (
    <div className="us-filter us-in" style={{ '--d': 4 } as CSSProperties}>
      <div className="us-filter-bar" role="group" aria-label={m.t.filterAria}>
        <div ref={trackRef} className="us-filter-track">
          {[{ id: 'all', label: m.t.filterAll }, ...m.cats].map((c) => (
            <button key={c.id} type="button" className="us-filter-btn" aria-pressed={cat === c.id} onClick={(e) => choose(c.id, e.currentTarget)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export const Catalog = ({ m }: { m: CatalogModel }) => {
  const reduced = useReducedPref();
  const [cat, setCat] = useState('all');
  const heroRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<() => void>(() => {});
  const filter = m.scope === 'hub' && m.cats.length > 1;
  const items = cat === 'all' ? m.items : m.items.filter((it) => it.cat === cat);

  // Kolejność wejścia: tekst po pierwszej klatce mgławicy (albo po FALLBACK_MS), karty po tekście.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const timers: number[] = [];
    let started = false;
    const go = (delay: number) => {
      if (started) return;
      started = true;
      timers.push(window.setTimeout(() => root.setAttribute('data-go', ''), delay));
      timers.push(window.setTimeout(() => root.setAttribute('data-cards', ''), delay + CARDS_AFTER));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) go(0);
    goRef.current = () => go(TEXT_AFTER);
    // mgławica mogła już zgłosić gotowość (brak WebGL / słabe urządzenie - efekt dziecka biegnie przed tym efektem)
    if (root.querySelector('.us-sky-neb[data-ready], .us-sky-neb[data-fail]')) go(TEXT_AFTER);
    timers.push(window.setTimeout(() => go(0), FALLBACK_MS));
    return () => { timers.forEach((t) => window.clearTimeout(t)); goRef.current = () => {}; };
  }, []);
  const onSky = useCallback(() => goRef.current(), []);

  // Pasek kategorii przykleja się wyżej (właściciel 2026-09-30): gdy nawigacja jest schowana (przewijanie w dół), pod
  // samą górą okna; gdy wraca (przewijanie w górę), zjeżdża pod nią (--us-stick, przejście w CSS jak nawigacja 0,5 s).
  // Nawigacja jest zamrożona - tylko odczyt jej stanu (klasa -translate-y-full = schowana, Navbar.tsx).
  useEffect(() => {
    const root = rootRef.current;
    const nav = document.querySelector<HTMLElement>('nav.fixed');
    if (!root || !nav) return;
    let t = 0;
    const set = () => {
      const hidden = nav.classList.contains('-translate-y-full');
      root.style.setProperty('--us-stick', hidden ? '12px' : `${nav.offsetHeight + 10}px`);
    };
    // wysokość nawigacji zmienia się z przejściem (py-6 -> py-4) - drugi pomiar po jego końcu
    const update = () => { set(); window.clearTimeout(t); t = window.setTimeout(set, 550); };
    update();
    const mo = new MutationObserver(update);
    mo.observe(nav, { attributes: true, attributeFilter: ['class'] });
    return () => { mo.disconnect(); window.clearTimeout(t); root.style.removeProperty('--us-stick'); };
  }, []);

  // Odjazd nagłówka przy przewijaniu: --hp = postęp wyjazdu (0-1).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduced) return;
    let raf = 0, hp = -1;
    const update = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const n = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      if (Math.abs(n - hp) > 0.001) { hp = n; hero.style.setProperty('--hp', n.toFixed(3)); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      hero.style.removeProperty('--hp');
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="us" data-scope={m.scope}>
      <noscript><style>{'.us .us-line,.us .us-in,.us .us-art{animation:none!important;transform:none!important;opacity:1!important}'}</style></noscript>
      <Sky onReady={onSky} />
      <section ref={heroRef} className="us-hero" aria-labelledby="us-h1">
        <div className="us-hero-in container mx-auto px-6">
          <div className="us-hero-copy">
            {/* Jedno zdanie wysuwa się spod maski (jak w Ofercie), kropka na końcu w kolorze marki. */}
            <h1 id="us-h1" className="im-title us-title">
              <span className="us-mask"><span className="us-line">{m.head.title}<span className="im-accent">.</span></span></span>
            </h1>
            {/* Opis zdaniami: na telefonie każde zdanie od nowej linii, wyważone osobno (.us-lead-s w uslugi.css). */}
            <p className="im-lead us-lead us-in" style={{ '--d': 3 } as CSSProperties}>
              {m.head.lead.split('. ').map((t, k, all) => (
                <span key={k} className="us-lead-s">{k ? ' ' : ''}{k < all.length - 1 ? `${t}.` : t}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Galeria hydratuje się osobno - góra strony i mgławica nie czekają na rysunki kart. */}
      <Suspense>
      <section className="us-list" aria-labelledby="us-list-h">
        <div className="container mx-auto px-6">
          <h2 id="us-list-h" className="sr-only">{m.t.gridTitle}</h2>
          {filter && <Filter m={m} cat={cat} pick={setCat} reduced={reduced} />}

          {/* key = filtr: po zmianie karty montują się od nowa i rysunki rysują się jeszcze raz.
              "Nie wiesz, co wybrać?" domyka siatkę. Strona kategorii z jedną usługą (/uslugi/design, szeroka karta
              + lista „Projekt przygotujesz dla”) usunięta 2026-10-01 razem z usługą „Projekt UI/UX”. */}
          <div key={cat} className="us-grid">
            {items.map((it, k) => <ArtCard key={it.key} it={it} m={m} look="tile" i={k % 3} />)}
            <CtaCard m={m} look="tile" i={items.length % 3} />
          </div>

        </div>
      </section>
      </Suspense>
      <div className="us-sky-end" aria-hidden="true" />
    </div>
  );
};
