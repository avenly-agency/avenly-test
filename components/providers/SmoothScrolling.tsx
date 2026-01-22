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
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]);

  // 2. PANCERNA LOGIKA KOTWIC (Polling Strategy)
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || !isMounted) return;

    const targetSection = searchParams.get('target');

    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      
      // WYMUSZENIE MANUALNEGO SCROLLA PRZEGLĄDARKI
      // To zapobiega "szarpnięciu" na górę przez przeglądarkę
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      // METODA POLLINGU (Sprawdzamy co 100ms czy element jest gotowy)
      // To rozwiązuje problem ładowania nowej podstrony
      let attempts = 0;
      const maxAttempts = 20; // Próbujemy przez 2 sekundy (20 * 100ms)

      const checkForElement = setInterval(() => {
        attempts++;
        const elem = document.getElementById(targetId);

        // Jeśli element istnieje LUB skończyły się próby
        if (elem) {
          clearInterval(checkForElement); // Przestajemy szukać

          // 1. Wymuś przeliczenie wymiarów strony (ważne po zmianie URL!)
          lenis.resize(); 
          ScrollTrigger.refresh();

          // 2. Wykonaj scroll
          lenis.scrollTo(elem, {
            offset: -80, // Offset na header
            duration: 1.5,
            lock: true, // Zablokuj scrollowanie użytkownika podczas jazdy
            force: true, // Ignoruj obecną pozycję
            
            onComplete: () => {
                // Po dojechaniu - czyścimy URL dla czystości
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
          });
        } else if (attempts >= maxAttempts) {
           // Jeśli po 2 sekundach nie ma elementu, poddajemy się
           clearInterval(checkForElement);
        }
      }, 100); // Sprawdzaj co 100ms

      return () => clearInterval(checkForElement);
    } 
  }, [lenisRef, searchParams, isMounted]);

  return null;
}