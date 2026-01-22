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
        duration: 1.2,
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
    
    // Synchronizacja Lenis -> ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    // Wyłączenie lagów GSAP (Lenis to ogarnia)
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]);

  // 2. LOGIKA KOTWIC Z KOREKTĄ DLA PINOWANYCH SEKCJI
  useEffect(() => {
    const targetSection = searchParams.get('target');
    const lenis = lenisRef.current?.lenis;

    if (targetSection && lenis && isMounted) {
      const targetId = targetSection.replace('#', '');
      
      // Funkcja wykonująca scroll z korektą
      const scrollToTarget = (attempt = 1) => {
          const elem = document.getElementById(targetId);
          
          if (!elem) {
              // Jeśli elementu jeszcze nie ma, próbujemy za chwilę (max 5 prób)
              if (attempt < 5) setTimeout(() => scrollToTarget(attempt + 1), 200);
              return;
          }

          // KROK KLUCZOWY: Wymuszamy na GSAP przeliczenie wysokości WSZYSTKICH sekcji
          // (w tym karuzeli portfolio) zanim zaczniemy scrollować.
          ScrollTrigger.refresh();
          lenis.resize();

          lenis.scrollTo(elem, {
            offset: -80, // Offset na navbar
            duration: 1.5,
            lock: true,  // Blokujemy scroll użytkownika podczas animacji
            force: true, // Wymuszamy scroll nawet jak Lenis myśli, że jest blisko
            
            // KROK KOREKCYJNY (Double Check)
            onComplete: () => {
                // Sprawdzamy, gdzie fizycznie wylądowaliśmy względem elementu
                const rect = elem.getBoundingClientRect();
                const distanceToHeader = rect.top - 80; // Powinno być bliskie 0

                // Jeśli różnica jest większa niż 5px (np. bo karuzela się rozwinęła w trakcie)
                // wykonujemy scrolla jeszcze raz (korekta)
                if (Math.abs(distanceToHeader) > 5 && attempt < 3) {
                    console.log("Korekta scrolla...", distanceToHeader);
                    scrollToTarget(attempt + 1);
                } else {
                    // Sukces - czyścimy URL
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }
            }
          });
      };

      // Dajemy lekkie opóźnienie na start, żeby React wyrenderował komponenty
      // a GSAP zdążył zainicjować piny.
      const timer = setTimeout(() => {
          scrollToTarget(1);
      }, 500); // 500ms to bezpieczny czas dla ciężkich animacji

      return () => clearTimeout(timer);
    }
  }, [searchParams, lenisRef, isMounted]);

  return null;
}