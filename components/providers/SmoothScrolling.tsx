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
      autoRaf={false} // WAŻNE: Wyłączamy autoRaf, bo sterujemy tym ręcznie przez GSAP
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

  // 1. OPTYMALIZACJA WYDAJNOŚCI (GSAP + LENIS TICKER)
  // Ten efekt uruchamia się TYLKO RAZ po załadowaniu komponentu.
  // Zapobiega to nakładaniu się pętli i lagowaniu po czasie.
  useLayoutEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Główna funkcja aktualizująca klatkę
    // GSAP Ticker steruje Lenisem -> idealna synchronizacja animacji i scrolla
    const update = (time: number) => {
      lenis.raf(time * 1000); 
    };

    // Podpinamy się pod zegar GSAP
    gsap.ticker.add(update);
    
    // Wyłączamy wygładzanie lagów GSAP (bo Lenis ma swoje) - to kluczowe dla płynności
    gsap.ticker.lagSmoothing(0);

    // Integracja ScrollTriggera - ręczna aktualizacja nie jest konieczna w pętli tickera, 
    // ScrollTrigger sam nasłuchuje zmian, ale możemy wymusić aktualizację przy scrollu Lenisa
    // dla pewności przy sekcjach Pinned.
    lenis.on('scroll', ScrollTrigger.update);

    setIsMounted(true);

    // CZYSZCZENIE (Kluczowe, żeby nie było wycieków pamięci)
    return () => {
      gsap.ticker.remove(update);
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]); // Zależność tylko od refa, bardzo stabilna

  // 2. LOGIKA KOTWIC (Hunt & Kill Strategy)
  // To odpowiada za celowanie w sekcje, nawet jeśli layout się przesuwa
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || !isMounted) return;

    const targetSection = searchParams.get('target');

    // SCENARIUSZ A: Mamy cel w URL (np. kliknięcie z innej podstrony)
    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      
      const huntTarget = (attempt = 1) => {
          // Limit prób, żeby nie zajechać procesora
          if (attempt > 5) return;

          const elem = document.getElementById(targetId);
          if (!elem) {
              setTimeout(() => huntTarget(attempt), 100);
              return;
          }

          // Wymuszamy przeliczenie układu przed ruchem
          ScrollTrigger.refresh();

          lenis.scrollTo(elem, {
            offset: -80,
            duration: 1.5,
            lock: true, // Blokujemy interakcję użytkownika podczas auto-scrolla
            force: true,
            
            onComplete: () => {
                // Sprawdzamy czy trafiliśmy
                const rect = elem.getBoundingClientRect();
                const distance = Math.abs(rect.top - 80);

                // Jeśli cel uciekł (bo sekcja pinned się rozwinęła), poprawiamy
                if (distance > 20) {
                    huntTarget(attempt + 1);
                }
            }
          });
      };

      // Startujemy z lekkim opóźnieniem
      const initialDelay = setTimeout(() => {
          ScrollTrigger.refresh();
          huntTarget(1);
      }, 500);

      return () => clearTimeout(initialDelay);
    } 
    
    // USUNIĘTO blok else resetujący scrolla, aby F5 działało naturalnie

  }, [lenisRef, searchParams, isMounted]);

  return null;
}