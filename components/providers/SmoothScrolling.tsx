'use client';

import { ReactLenis } from 'lenis/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- EFEKT PREMIUM ---
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<any>(null);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1, // Ważne: 1 dla mobile
      }}
      autoRaf={true}
    >
      <Suspense fallback={null}>
        <AnchorManager lenisRef={lenisRef} />
      </Suspense>
      {children}
    </ReactLenis>
  );
};

function AnchorManager({ lenisRef }: { lenisRef: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 1. INTEGRACJA GSAP + LENIS
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // Rejestracja ScrollTriggera
    gsap.registerPlugin(ScrollTrigger);

    const handleScroll = (e: any) => {
        ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    return () => {
        lenis.off('scroll', handleScroll);
    };
  }, [lenisRef]);

  // 2. LOGIKA KOTWIC (WERSJA "PANCERNA")
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    const targetSection = searchParams.get('target');

    // SCENARIUSZ A: Mamy cel (kotwicę) w URL
    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      
      const scrollToElement = () => {
          const elem = document.getElementById(targetId);
          if (elem) {
            // KROK KLUCZOWY: Najpierw przeliczamy układ strony (dla sekcji przypiętych jak Portfolio)
            ScrollTrigger.refresh(); 
            
            lenis.scrollTo(elem, {
              offset: -100, // Margines na header
              duration: 2, // Dajemy mu czas na pokonanie długich sekcji (np. 500vh)
              easing: easeOutExpo,
              lock: true, // Blokujemy scrollowanie użytkownika podczas animacji
              force: true, // Wymuszamy scroll nawet jeśli Lenis myśli że tam jest
              onComplete: () => {
                  // Opcjonalnie: Po zakończeniu scrolla odświeżamy jeszcze raz
                  ScrollTrigger.refresh();
              }
            });
          }
      };

      // SEKWENCJA PRÓB (Żeby wygrać z ładowaniem layoutu)
      
      // 1. Szybka próba (jeśli strona jest lekka)
      const t1 = setTimeout(scrollToElement, 100);

      // 2. Główna próba (po załadowaniu cięższych skryptów)
      const t2 = setTimeout(scrollToElement, 500);

      // 3. "Safety Check" (dla wolniejszych łączy/urządzeń)
      // To naprawia problem zatrzymania w połowie Portfolio
      const t3 = setTimeout(scrollToElement, 1200);

      return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
      };
    } 
    // SCENARIUSZ B: Zwykła zmiana strony (np. kliknięcie w logo)
    else {
        // Resetujemy pozycję, ale dopiero w następnej klatce
        const tReset = setTimeout(() => {
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });
        }, 10);
        return () => clearTimeout(tReset);
    }

  }, [lenisRef, searchParams, pathname]);

  // 3. BLOKADA NATYWNEGO POWROTU (Żeby przeglądarka sama nie scrollowała)
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}