'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';

// --- EFEKT PREMIUM ---
// Funkcja matematyczna, która sprawia, że scroll "ląduje" miękko jak samolot
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

    // 1. BLOKADA NATYWNEGO SKOKU
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    // 2. LOGIKA SCROLLA (HYBRYDA: TIMERY + EASING)
    useEffect(() => {
        const targetSection = searchParams.get('target');

        if (targetSection && lenis) {
            const targetId = targetSection.replace('#', '');
            
            const performScroll = (forceDuration: number, useEasing: boolean) => {
                const elem = document.getElementById(targetId);
                if (elem) {
                    lenis.scrollTo(elem, { 
                        offset: -120, 
                        duration: forceDuration, 
                        // Tu jest magia: Pierwszy strzał ma easing, korekty są liniowe
                        easing: useEasing ? easeOutExpo : undefined, 
                        lock: false,
                        force: true, 
                    });
                }
            };

            // KROK A: Reset na górę
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });

            // KROK B: Główny strzał (Smooth & Premium)
            // Używamy easeOutExpo i dłuższego czasu (2.2s)
            const timer1 = setTimeout(() => {
                performScroll(2.2, true); 
            }, 100);

            // KROK C: Korekta I (Safety Net)
            // Bez easingu, żeby szybko dociągnąć, jeśli layout uciekł
            const timer2 = setTimeout(() => {
                performScroll(1.0, false);
            }, 1500);

            // KROK D: Korekta II (Dla wolnego internetu)
            const timer3 = setTimeout(() => {
                performScroll(0.5, false);
            }, 2500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [searchParams, lenis]);

    return null;
}