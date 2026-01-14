'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- EFEKT PREMIUM ---
function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
      }}
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
    const pathname = usePathname(); // Śledzimy zmianę URL (np. przejście z Home na Blog)

    // 1. INTEGRACJA GSAP (Ważne dla animacji ScrollTrigger przy Lenis)
    useEffect(() => {
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }, [lenis]);

    // 2. BLOKADA NATYWNEGO SKOKU
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    // 3. GŁÓWNA LOGIKA NAWIGACJI
    useEffect(() => {
        if (!lenis) return;

        const targetSection = searchParams.get('target');

        // SCENARIUSZ A: Mamy cel (kotwicę) -> Scrolluj do sekcji
        if (targetSection) {
            const targetId = targetSection.replace('#', '');
            
            const performScroll = (forceDuration: number, useEasing: boolean) => {
                const elem = document.getElementById(targetId);
                if (elem) {
                    lenis.scrollTo(elem, { 
                        offset: -120, 
                        duration: forceDuration, 
                        easing: useEasing ? easeOutExpo : undefined, 
                        lock: false,
                        force: true, 
                    });
                }
            };

            // Najpierw reset na górę, żeby "rozbieg" był zawsze z góry (opcjonalne, ale wygląda lepiej)
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });

            // Sekwencja timerów (Twoja logika Premium)
            const timer1 = setTimeout(() => performScroll(2.2, true), 100);   // Start
            const timer2 = setTimeout(() => performScroll(1.0, false), 1500); // Korekta 1
            const timer3 = setTimeout(() => performScroll(0.5, false), 2500); // Korekta 2

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } 
        
        // SCENARIUSZ B: Zwykła zmiana strony (bez kotwicy) -> Reset na górę
        else {
            lenis.scrollTo(0, { immediate: true });
            window.scrollTo(0, 0);
        }

    }, [pathname, searchParams, lenis]); // Uruchom przy zmianie ścieżki LUB parametrów

    return null;
}