'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GEM } from '@/lib/brand/logo';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { seg } from './shared';
import './ending.css'; // prefiks on-e2-

// ZAKOŃCZENIE - „PRZEZ GWIAZDĘ”: wybór właściciela 2026-10-14 („ostatnia to przez gwiazdę wybieram”) z trzech wersji
// (dotychczasowa „Linia z gwiazdą”, „Przez gwiazdę”, „Horyzont” - pozostałe w docs/archiwum/o-nas-2026-10/
// zakonczenie-wersje/). Strona kończy się tak, jak się zaczęła: na środku czeka mała gwiazda z logo; gdy sekcja wejdzie
// na ekran, gwiazda otwiera się w okno (jak w „Portalu” i we wjeździe wejścia), przed nią lecą dwa obrysy-powidoki,
// a w oknie stoi wyśrodkowany nagłówek z przyciskiem. Raz, na czas (1,5 s). Teksty ze słownika: „Zacznijmy od
// rozmowy.”, opis, „Bezpłatna konsultacja”. Tło: mgławica podstrony (data-sky na środku okna).
// Bez JS / ograniczony ruch: okno otwarte od razu, bez gwiazdki i obrysów.
// Runda 44 (2026-10-14, „dostosuj pod SEO, wydajność, responsywność na mobile”): nagłówek, opis i przycisk to
// prawdziwy tekst i link w HTML z serwera (okno chowa je tylko w pełnym ruchu do chwili otwarcia); wymiary okna
// czytane raz na starcie otwierania (w klatce tylko zapisy), po otwarciu obrysy znikają z układu (data-done);
// wygląd nagłówka niezależny od kolejności arkuszy (dawniej .on-h2 z o-nas.css nadpisywał .on-e2-h).

const d = (n: number) => ({ '--d': n }) as CSSProperties;

const STAR_WAIST = 7.884;      // wcięcie gwiazdy (promień 20): okno zakrywa pole, gdy wcięcia wyjdą poza jego rogi
const STAR_FROM = 0.7;         // skala gwiazdy na starcie = czekająca gwiazdka 28 px
const ECHO = [1, 1.22, 1.5];   // obrys okna i dwa powidoki przed nim
const OPEN_MS = 1500;
/** Gwiazda logo (GEM) jako ścieżka w pikselach pola: środek (cx, cy), skala s. */
const starD = (cx: number, cy: number, s: number) => {
  const P = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  return `M${P(0, -20)}C${P(1.4, -6.8)} ${P(6.8, -1.4)} ${P(20, 0)}C${P(6.8, 1.4)} ${P(1.4, 6.8)} ${P(0, 20)}` +
    `C${P(-1.4, 6.8)} ${P(-6.8, 1.4)} ${P(-20, 0)}C${P(-6.8, -1.4)} ${P(-1.4, -6.8)} ${P(0, -20)}Z`;
};

export function Ending({ t, locale, live }: { t: ONasDict['ending']; locale: Locale; live: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const rings = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const sec = ref.current, w = win.current, rg = rings.current;
    if (!sec || !w || !rg || !live) return;
    const paths = Array.from(rg.querySelectorAll('path'));
    let raf = 0, t0 = -1, W = 0, H = 0;
    const run = (now: number) => {
      if (t0 < 0) { t0 = now; W = w.clientWidth; H = w.clientHeight; } // wymiary raz, na starcie (bez odczytów w klatce)
      const x = Math.min(1, (now - t0) / OPEN_MS);
      if (x >= 1) {
        // okno otwarte: bez przycięcia (zmiana rozmiaru okna niczego nie utnie), obrysy zgaszone
        w.style.clipPath = 'none';
        paths.forEach((ph) => { ph.style.opacity = '0'; });
        sec.setAttribute('data-done', '');
        return;
      }
      const cx = W / 2, cy = H / 2;
      const full = (Math.hypot(W / 2, H / 2) / STAR_WAIST) * 1.04;
      // wzrost wykładniczy = równy „najazd”; miękki start i koniec
      const s = STAR_FROM * Math.pow(full / STAR_FROM, x * x * (3 - 2 * x));
      w.style.clipPath = `path("${starD(cx, cy, s)}")`;
      const fade = (1 - seg(x, 0.62, 1)).toFixed(3);
      paths.forEach((ph, i) => {
        ph.setAttribute('d', starD(cx, cy, s * ECHO[i]));
        ph.style.opacity = fade;
      });
      raf = requestAnimationFrame(run);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      sec.setAttribute('data-in', '');
      run(performance.now()); // pierwsza klatka od razu - okno nigdy nie pokaże się bez przycięcia
    }, { threshold: 0.3 });
    io.observe(sec);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      w.style.clipPath = '';
      sec.removeAttribute('data-in');
      sec.removeAttribute('data-done');
    };
  }, [live]);

  return (
    <section ref={ref} className="on-sec on-e2" aria-labelledby="on-end-h">
      <div className="on-e2-stage">
        <div ref={win} className="on-e2-win">
          <div className="on-e2-light" aria-hidden="true" />
          <span className="on-e2-core" data-sky="" aria-hidden="true" />
          <div className="container mx-auto px-6 on-e2-in">
            <h2 id="on-end-h" className="on-h2 on-e2-h">
              <span className="on-mask"><span className="on-rise" style={d(7)}>{t.heading}</span></span>
            </h2>
            <p className="on-lead on-in" style={d(10)}>{t.text}</p>
            <div className="on-in" style={d(11)}>
              <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="on-cta">
                {t.cta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <svg ref={rings} className="on-e2-rings" aria-hidden="true" focusable="false">
          {ECHO.map((e) => <path key={e} />)}
        </svg>
        <svg className="on-e2-seed" viewBox="-20 -20 40 40" aria-hidden="true" focusable="false"><path d={GEM} /></svg>
      </div>
    </section>
  );
}
