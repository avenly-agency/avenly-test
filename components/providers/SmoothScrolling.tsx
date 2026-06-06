'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useSearchParams, usePathname } from 'next/navigation'; // 1. Dodano usePathname
import { useEffect, Suspense, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  // syncTouch off na mobile - iOS Safari + Lenis syncTouch + momentum scroll
  // okazjonalnie traci sync i snapuje scroll do 0 (random "skok na górę").
  // Na mobile zostawiamy natywny scroll touch, Lenis nadal działa na wheel (desktop).
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        syncTouch: !isMobile,
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
  // Guard na pierwszy mount - pathname useEffect odpalał scroll reset także
  // przy pierwszym render (mount). Jeśli mount złapał się na środek touch scroll
  // na mobile, jechał reset do (0,0). Pierwszy render NIE wymaga resetu - browser
  // zaczyna już na (0,0). Reset tylko przy realnej nawigacji między pathname.
  const prevPathnameRef = useRef<string | null>(null);

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

  // 2. GLOBALNY RESET SCROLLA PRZY ZMIANIE STRONY
  // Reset scroll do (0,0) bez ScrollTrigger.refresh (refresh w trakcie navigation
  // racował z unmountującymi się GSAP pinami homepage - Hero scale 50, Portfolio 300vh,
  // Process timeline - powodując glitche w nawigacji z homepage).
  // ScrollTrigger sam wykryje nowe targety po remount następnej strony.
  // GUARD: pierwszy mount NIE resetuje (browser i tak zaczyna na 0). Reset tylko gdy
  // pathname RZECZYWIŚCIE się zmienił - eliminuje random scroll-to-top przy initial
  // mount na środku scrolla mobile.
  useEffect(() => {
    if (!lenis) return;
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    // Odłożymy reset do następnego frame'a - daje Reactowi czas na unmount starych
    // ScrollTrigger'ów i mount nowych przed Lenis scrollTo (eliminuje race condition)
    const id = requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true, force: true, lock: false });
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

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