'use client';

import { ReactLenis } from 'lenis/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';
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
        // WAŻNE: syncTouch: true czasami pomaga z lagami na hybrydowych laptopach
        syncTouch: true, 
        touchMultiplier: 1,
      }}
      // WAŻNE: autoRaf={true} to domyślne ustawienie, ale upewniamy się, że jest włączone.
      // Usuwamy ręczne lenis.raf() z useEffecta, bo to powodowało desynchronizację po czasie.
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

  // 1. TYLKO AKTUALIZACJA GSAP (Bez napędzania pętli)
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // Mówimy ScrollTriggerowi: "Hej, Lenis się przesunął, przelicz pozycje"
    // Ale NIE sterujemy czasem klatki.
    const handleScroll = (e: any) => {
        ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    return () => {
        lenis.off('scroll', handleScroll);
    };
  }, [lenisRef]);

  // 2. LOGIKA KOTWIC (Bez zmian - działała dobrze)
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    const targetSection = searchParams.get('target');

    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      // Małe opóźnienie, żeby upewnić się, że DOM jest gotowy
      const timer = setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) {
            lenis.scrollTo(elem, {
              offset: -100,
              duration: 1.5,
              lock: false,
              force: true,
            });
          }
      }, 100);
      return () => clearTimeout(timer);
    } 
    else {
      // Reset scrolla przy zmianie podstrony
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
    
    // Refresh ScrollTriggera po zmianie trasy
    const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
    
    return () => clearTimeout(refreshTimer);

  }, [lenisRef, searchParams, pathname]);

  // 3. BLOKADA NATYWNEGO POWROTU
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}