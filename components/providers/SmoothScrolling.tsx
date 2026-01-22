'use client';

import { ReactLenis } from 'lenis/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<any>(null);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1.2, // Nieco wolniej dla płynności przy dużych skokach
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
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
  const [isMounted, setIsMounted] = useState(false);

  // 1. INTEGRACJA GSAP
  useLayoutEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Kluczowe: manualna aktualizacja ScrollTriggera przez Lenis
    lenis.on('scroll', ScrollTrigger.update);
    
    // Wyłączamy "wygładzanie" GSAP, bo Lenis to robi
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]);

  // 2. LOGIKA KOTWIC Z KOREKTĄ LAYOUT SHIFT (PINNING)
  useEffect(() => {
    const targetSection = searchParams.get('target');
    const lenis = lenisRef.current?.lenis;

    if (targetSection && lenis && isMounted) {
      const targetId = targetSection.replace('#', '');
      
      // Wyłączamy domyślny scroll przeglądarki
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      // Funkcja wykonująca scroll z weryfikacją pozycji
      const performScroll = (attempt = 1) => {
          const elem = document.getElementById(targetId);
          
          // Jeśli elementu nie ma, czekamy (max 10 prób po 100ms)
          if (!elem) {
              if (attempt < 10) setTimeout(() => performScroll(attempt + 1), 100);
              return;
          }

          // KROK 1: Wymuś przeliczenie layoutu PRZED ruchem
          ScrollTrigger.refresh();
          lenis.resize();

          // KROK 2: Jedź do celu
          lenis.scrollTo(elem, {
            offset: -80, // Twój offset na header
            duration: 1.5,
            lock: true,  // Zablokuj usera
            force: true, // Ignoruj obecną pozycję
            immediate: false,
            
            // KROK 3: Weryfikacja po dojechaniu (Recursion Check)
            onComplete: () => {
                // Sprawdzamy, gdzie JESTEŚMY vs gdzie jest ELEMENT
                // Po scrollu GSAP mógł rozwinąć piny, więc pozycja elementu mogła uciec
                const rect = elem.getBoundingClientRect();
                const distance = rect.top - 80; // Powinno być ~0

                // Jeśli różnica jest duża (>5px) i nie próbowaliśmy za dużo razy
                if (Math.abs(distance) > 5 && attempt < 3) {
                    // console.log("GSAP Pin Shift wykryty! Korekta scrolla...", distance);
                    
                    // Wymuszamy ponowne przeliczenie, bo jesteśmy w nowym miejscu scrolla
                    ScrollTrigger.refresh(); 
                    
                    // Jedziemy jeszcze raz (KOREKTA) - tym razem krócej
                    lenis.scrollTo(elem, {
                        offset: -80,
                        duration: 0.8, // Szybsza korekta
                        lock: true,
                        force: true,
                        onComplete: () => {
                           // Czyścimy URL po sukcesie
                           window.history.replaceState({}, '', window.location.pathname);
                        }
                    });
                } else {
                    // Sukces (lub poddajemy się po 3 korektach)
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
          });
      };

      // Start z opóźnieniem (aby React wyrenderował DOM)
      // 500ms to bezpieczny margines dla ciężkich stron z animacjami
      const initialTimer = setTimeout(() => {
          performScroll(1);
      }, 500);

      return () => clearTimeout(initialTimer);
    }
  }, [searchParams, lenisRef, isMounted]);

  return null;
}