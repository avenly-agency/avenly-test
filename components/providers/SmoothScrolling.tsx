'use client';

import { ReactLenis } from 'lenis/react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  // 2. LOGIKA KOTWIC (Cross-page navigation fix)
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || !isMounted) return;

    const targetSection = searchParams.get('target');

    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      
      // ✅ FIX 1: Wyłączamy domyślne przywracanie scrolla przeglądarki,
      // żeby nie walczyła z Lenisem zaraz po załadowaniu strony.
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const huntTarget = (attempt = 1) => {
          if (attempt > 10) return; // Zwiększamy lekko limit prób

          const elem = document.getElementById(targetId);
          
          // Jeśli elementu nie ma, próbujemy ponownie za 100ms
          if (!elem) {
              setTimeout(() => huntTarget(attempt + 1), 100);
              return;
          }

          // Odświeżamy układ (ważne przy lazy loading)
          ScrollTrigger.refresh();

          lenis.scrollTo(elem, {
            offset: -80,
            duration: 1.5,
            lock: true,
            force: true, // Wymuszamy scroll nawet jak Lenis myśli, że jest na miejscu
            
            onComplete: () => {
                // Sprawdzamy czy trafiliśmy
                const rect = elem.getBoundingClientRect();
                const distance = Math.abs(rect.top - 80);

                if (distance > 20) {
                    // Jak nie trafiliśmy (np. layout się przesunął), poprawiamy
                    huntTarget(attempt + 1);
                } else {
                    // ✅ FIX 2 (Opcjonalny UX): Czyścimy URL po udanym scrollu.
                    // Dzięki temu jak użytkownik odświeży stronę (F5), 
                    // zostanie w tym miejscu, a nie skoczy znowu do animacji.
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    
                    // Przywracamy domyślne zachowanie scrolla dla dalszej nawigacji
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'auto';
                    }
                }
            }
          });
      };

      // Startujemy z minimalnym opóźnieniem, aby React zdążył wyrenderować drzewo DOM
      // Zmniejszyłem z 500ms na 100ms, aby reakcja była szybsza
      const initialDelay = setTimeout(() => {
          ScrollTrigger.refresh();
          huntTarget(1);
      }, 100);

      return () => clearTimeout(initialDelay);
    } 
  }, [lenisRef, searchParams, isMounted]);

  return null;
}