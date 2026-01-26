'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useSearchParams, usePathname } from 'next/navigation'; // 1. Dodano usePathname
import { useEffect, Suspense, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
      }}
      autoRaf={true}
    >
      <Suspense fallback={null}>
        <AnchorManager />
      </Suspense>
      {children}
    </ReactLenis>
  );
};

function AnchorManager() {
  const lenis = useLenis();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // 2. Pobieramy aktualną ścieżkę
  const [isMounted, setIsMounted] = useState(false);

  // 1. INTEGRACJA GSAP
  useLayoutEffect(() => {
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenis]);

  // 2. NOWOŚĆ: GLOBALNY RESET SCROLLA PRZY ZMIANIE STRONY
  // To naprawia problem lądowania w połowie strony po kliknięciu linku
  useEffect(() => {
    if (lenis) {
      // Wymuszamy natychmiastowy skok do góry (0,0)
      // immediate: true jest kluczowe - bez animacji, po prostu teleportacja
      lenis.scrollTo(0, { immediate: true, force: true, lock: false });
      window.scrollTo(0, 0);
      
      // Resetujemy też ScrollTriggera, żeby nie pamiętał starych pozycji pinów
      ScrollTrigger.refresh();
    }
  }, [pathname, lenis]); // Odpala się przy każdej zmianie URL (np. /uslugi -> /kontakt)

  // 3. LOGIKA KOTWIC (Double-Check Strategy)
  useEffect(() => {
    const targetSection = searchParams.get('target');

    // Ten kod wykona się PO resecie scrolla (dzięki setTimeout poniżej),
    // więc obliczenia będą poprawne (liczone od góry strony)
    if (targetSection && lenis) {
      const targetId = targetSection.replace('#', '');
      
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const performScroll = (attempt = 1) => {
          const elem = document.getElementById(targetId);
          
          if (!elem) {
              if (attempt < 15) setTimeout(() => performScroll(attempt + 1), 100);
              return;
          }

          ScrollTrigger.refresh();
          lenis.resize();

          lenis.scrollTo(elem, {
            offset: -80,
            duration: 1.5,
            lock: true,
            force: true,
            immediate: false,
            
            onComplete: () => {
                const rect = elem.getBoundingClientRect();
                const distance = rect.top - 80;

                if (Math.abs(distance) > 5 && attempt < 3) {
                    console.log("Korekta pozycji...", distance);
                    ScrollTrigger.refresh();
                    
                    lenis.scrollTo(elem, {
                        offset: -80,
                        duration: 0.5,
                        lock: true,
                        force: true,
                        onComplete: () => {
                           window.history.replaceState({}, '', window.location.pathname);
                        }
                    });
                } else {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
          });
      };

      // Zwiększyłem lekko timeout, żeby upewnić się, że reset scrolla (z punktu 2)
      // zdążył się wykonać zanim zaczniemy szukać elementu
      const timer = setTimeout(() => {
          performScroll(1);
      }, 300); // 300ms powinno być bezpieczne

      return () => clearTimeout(timer);
    }
  }, [lenis, searchParams]); // searchParams jest osobno, żeby działało przy zmianie samego parametru

  return null;
}