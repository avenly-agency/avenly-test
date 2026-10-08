'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import type { Locale } from '@/lib/i18n/locale';
import type { HomeDict } from '@/lib/i18n/home';

// --- KONFIGURACJA LAZY LOADING ---

// Bramka idle dla chunków below-the-fold. Bez niej wszystkie 8 sekcji fetchowało,
// parsowało i hydratowało się natychmiast po load - dokładnie w oknie intro Hero
// (stagger tekstu 0.05-0.45s + powiadomienia 1.25-2.65s). Framer Motion animuje
// z main threadu, więc hydration burst = gubione klatki = "szarpany" stagger.
// SSR HTML sekcji jest w statycznym exporcie i React trzyma go aż chunk się
// załaduje (dynamic z ssr:true = lazy + Suspense) - wizualnie zero zmiany,
// przesuwa się TYLKO hydratacja. Singleton promise: przy nawigacji client-side
// idle następuje niemal od razu, więc opóźnienie dotyczy tylko initial load.
let idleGate: Promise<void> | null = null;
const afterFirstIdle = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!idleGate) {
    idleGate = new Promise<void>((resolve) => {
      type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
      const ric = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback;
      if (ric) ric(() => resolve(), { timeout: 1800 });
      else window.setTimeout(resolve, 1200);
    });
  }
  return idleGate;
};

const SectionLoader = ({ height = "h-screen" }: { height?: string }) => (
  <div className={`w-full ${height} bg-[#050505] flex items-center justify-center`}>
      {/* Placeholder */}
  </div>
);

// 1. Realizacje (handoff 8b "Kurtyna") - po hero i pasku TechStack. Zastąpiła dawne
// Portfolio (teaser z poziomym scrollem). SSR HTML (kadr 01 + indeks z linkami) jest w
// statycznym exporcie; sam chunk komponentu wchodzi po idle, a scena (WebGL, pętla, automat
// zmiany kadrów) to osobny dynamic import wewnątrz komponentu - dopiero gdy sekcja zbliża się
// do viewportu. Placeholder (.rz-placeholder) ma wysokość sekcji w obu układach (100vh / 100svh),
// żeby nawigacja client-side nie przesuwała sekcji poniżej.
const Realizacje = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/Realizacje')).then(mod => mod.Realizacje), {
  loading: () => <div className="rz-placeholder" />
});

// 2. TechStack (pasek pod hero) - placeholder .ts-placeholder ma wysokość paska (globals.css), bez CLS
const TechStack = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/TechStack')).then(mod => mod.TechStack), {
  loading: () => <div className="ts-placeholder" />
});

// 3. Process
const Process = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/Process')).then(mod => mod.Process), {
  loading: () => <SectionLoader height="h-[300vh]" />
});

// 4. Impact
const Impact = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/Impact')).then(mod => mod.Impact), {
  loading: () => <SectionLoader height="h-screen" />
});

// 5. (Sekcja "Asystent AI" / AiConsultant usunięta 2026-09-27 - decyzja właściciela: zbędna,
//    asystent jest już w "Dlaczego Avenly", Realizacjach, Ofercie i w prawdziwym czacie w rogu.)

// 6. Services
const Services = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/Services')).then(mod => mod.Services), {
  loading: () => <div className="h-[800px] bg-[#050505]" />
});

// 7. Testimonials (Opinie)
const Testimonials = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/Testimonials')).then(mod => mod.Testimonials), {
  loading: () => <div className="h-[600px] bg-[#050505]" />
});

// 8. BlogTeaser (tylko PL - blog nie ma wersji EN)
const BlogTeaser = dynamic(() => afterFirstIdle().then(() => import('@/components/sections/BlogTeaser')).then(mod => mod.BlogTeaser), {
  loading: () => <div className="h-[600px] bg-[#050505]" />
});

// 9. (Sekcja CTA "Gotowy na cyfrową dominację?" / CallToAction usunięta 2026-09-27 - decyzja właściciela:
//    zbędna, CTA "Bezpłatna konsultacja" są w hero, Procesie i Ofercie. Przycisk w nawigacji i link
//    "Kontakt" w stopce prowadzą prosto na /kontakt, zamiast przewijać do dawnej kotwicy #kontakt.)

export function HomeClient({ t, locale }: { t: HomeDict; locale: Locale }) {
  return (
    <main className="bg-[#050505] min-h-screen">

      {/* HERO (Start) */}
      <Hero t={t.hero} locale={locale} />

      {/* Pasek marquee TechStack tuż pod hero (decyzja właściciela, Sesja 30) */}
      <div className="render-optimize">
        <TechStack t={t.techStack} />
      </div>

      {/* REALIZACJE (scena "Kurtyna": kadry zmieniają się same, klik w indeks wybiera). */}
      <Realizacje t={t.realizacje} locale={locale} />

      <div className="render-optimize">
        <Impact t={t.impact} locale={locale} />
      </div>

      {/* PROCES (Kotwica #proces) */}
      <div className="render-optimize" id="proces">
        <Process t={t.process} locale={locale} />
      </div>

      {/* OPINIE */}
      <div className="render-optimize" id="opinie">
        <Testimonials t={t.testimonials} />
      </div>

      {/* OFERTA (Kotwica #oferta) */}
      <div className="render-optimize" id="oferta">
        <Services t={t.services} locale={locale} />
      </div>

      {/* BLOG TEASER - tylko PL (blog bez wersji EN w v1) */}
      {locale === 'pl' && (
        <div className="render-optimize">
          <BlogTeaser />
        </div>
      )}

    </main>
  );
}
