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
      autoRaf={true} // ✅ PRZYWRACAMY TRUE: To gwarantuje, że scroll ruszy
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

  // 1. INTEGRACJA GSAP (Wersja Bezpieczna)
  useLayoutEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Synchronizacja: Kiedy Lenis scrolluje, informujemy o tym ScrollTriggera
    lenis.on('scroll', ScrollTrigger.update);
    
    // Zapobiegamy lagom, wyłączając wewnętrzne wygładzanie GSAP (bo Lenis już wygładza)
    gsap.ticker.lagSmoothing(0);

    setIsMounted(true);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [lenisRef]);

  // 2. LOGIKA KOTWIC (Hunt & Kill Strategy - BEZ ZMIAN)
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis || !isMounted) return;

    const targetSection = searchParams.get('target');

    if (targetSection) {
      const targetId = targetSection.replace('#', '');
      
      const huntTarget = (attempt = 1) => {
          if (attempt > 5) return;

          const elem = document.getElementById(targetId);
          if (!elem) {
              setTimeout(() => huntTarget(attempt), 100);
              return;
          }

          // Ważne: Odświeżamy układ przed ruchem
          ScrollTrigger.refresh();

          lenis.scrollTo(elem, {
            offset: -80,
            duration: 1.5,
            lock: true,
            force: true,
            
            onComplete: () => {
                const rect = elem.getBoundingClientRect();
                const distance = Math.abs(rect.top - 80);

                if (distance > 20) {
                    huntTarget(attempt + 1);
                }
            }
          });
      };

      const initialDelay = setTimeout(() => {
          ScrollTrigger.refresh();
          huntTarget(1);
      }, 500);

      return () => clearTimeout(initialDelay);
    } 
  }, [lenisRef, searchParams, isMounted]);

  return null;
}