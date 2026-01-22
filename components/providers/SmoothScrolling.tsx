'use client';

import { ReactLenis, useLenis } from 'lenis/react'; // Dodano import useLenis
import { useSearchParams } from 'next/navigation';
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
  const lenis = useLenis(); // ✅ Hook zamiast Refa (Klucz do naprawy pierwszego kliknięcia)
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // 1. INTEGRACJA GSAP
  useLayoutEffect(() => {
    // Czekamy aż lenis będzie dostępny z hooka
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Synchronizacja
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenis]); // Uruchom ponownie, gdy lenis będzie gotowy

  // 2. LOGIKA KOTWIC (Double-Check Strategy)
  useEffect(() => {
    const targetSection = searchParams.get('target');

    // Uruchamiamy tylko gdy mamy instancję Lenisa i parametr w URL
    if (targetSection && lenis) {
      const targetId = targetSection.replace('#', '');
      
      // Wyłączamy domyślny scroll przeglądarki na czas operacji
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const performScroll = (attempt = 1) => {
          const elem = document.getElementById(targetId);
          
          // Jeśli elementu nie ma, czekamy (max 15 prób po 100ms)
          if (!elem) {
              if (attempt < 15) setTimeout(() => performScroll(attempt + 1), 100);
              return;
          }

          // --- Faza 1: Przygotowanie ---
          ScrollTrigger.refresh(); // Przeliczamy piny GSAP
          lenis.resize();          // Przeliczamy wysokość Lenisa

          // --- Faza 2: Scroll ---
          lenis.scrollTo(elem, {
            offset: -80, // Offset na header
            duration: 1.5,
            lock: true,
            force: true,
            immediate: false,
            
            // --- Faza 3: Weryfikacja (Double Check) ---
            onComplete: () => {
                const rect = elem.getBoundingClientRect();
                const distance = rect.top - 80;

                // Sprawdzamy czy trafiliśmy (z tolerancją 5px)
                // Jeśli GSAP rozwinął piny w trakcie jazdy, możemy być w złym miejscu
                if (Math.abs(distance) > 5 && attempt < 3) {
                    console.log("Korekta pozycji...", distance);
                    ScrollTrigger.refresh();
                    
                    // Szybka korekta
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
                    // Sukces - czyścimy URL
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
          });
      };

      // Małe opóźnienie startowe dla stabilności DOM
      const timer = setTimeout(() => {
          performScroll(1);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [lenis, searchParams]); // Zależność od 'lenis' gwarantuje start po załadowaniu

  return null;
}