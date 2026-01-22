'use client';

import { ReactLenis } from 'lenis/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useLayoutEffect } from 'react';
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

  // 1. Integracja GSAP
  useLayoutEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]);

  // 2. Obsługa nawigacji między stronami
  useEffect(() => {
    const targetSection = searchParams.get('target');
    const lenis = lenisRef.current?.lenis;

    if (targetSection && lenis) {
      const targetId = targetSection.replace('#', '');
      
      // Magiczne opóźnienie - dajemy przeglądarce 100ms na render nowej strony
      // Dzięki scroll={false} w Linku, strona zostanie w miejscu, a potem Lenis płynnie zjedzie
      const timer = setTimeout(() => {
          const elem = document.getElementById(targetId);
          
          if (elem) {
              // Wymuszamy odświeżenie Lenisa i ScrollTriggera po załadowaniu nowej strony
              lenis.resize();
              ScrollTrigger.refresh();

              lenis.scrollTo(elem, {
                  offset: -80, // Offset na header
                  duration: 1.5,
                  lock: true,
                  force: true,
                  immediate: false, // Ważne: false oznacza "animuj", true oznacza "teleportuj"
                  onComplete: () => {
                      // Opcjonalnie: wyczyść URL
                      window.history.replaceState({}, '', window.location.pathname);
                  }
              });
          }
      }, 300); // 300ms to bezpieczny czas dla Next.js na pełne załadowanie DOM

      return () => clearTimeout(timer);
    }
  }, [searchParams, lenisRef]); // Uruchom ponownie, gdy zmienią się parametry URL

  return null;
}