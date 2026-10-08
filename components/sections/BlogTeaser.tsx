'use client';

import { blogTeaserDict } from '@/lib/i18n/home/blog-teaser';
import { LATEST } from './blog-teaser/data';
import { useLive } from './blog-teaser/shared';
import { PanSection } from './blog-teaser/pan';
import './blog-teaser/blog-teaser.css'; // style sekcji we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Sekcja "Blog" na stronie głównej (tylko PL - HomeClient nie pokazuje jej na /en/). Trzy najnowsze
// wpisy z app/data/posts.ts (tylko odczyt). Układ PANORAMA (wybór właściciela 2026-09-29 z trzeciej rundy
// propozycji: Okładka / Przelot / Kamera / Panorama / Okładka w ruchu): przewijanie = jazda kamery w bok
// wzdłuż dużych okładek, nagłówek sekcji w tej samej przyklejonej scenie. Nagłówek i ograniczony ruch
// (nagłówek + zwykłe karty) renderuje PanSection. Notatki i historia rund: docs/sekcje/blog.md.

const t = blogTeaserDict.pl;

export function BlogTeaser() {
  const ref = useLive<HTMLElement>(); // wejście nagłówka (data-live / data-in)

  return (
    <section ref={ref} className="bt" aria-labelledby="bt-title">
      <div className="container mx-auto px-6">
        <PanSection posts={LATEST} t={t} />
      </div>
    </section>
  );
}
