'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { MotionGlobalConfig } from 'framer-motion';

export const LifecycleManager = () => {
  const lenis = useLenis();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 1. UŻYTKOWNIK UCIEKŁ: Zatrzymaj scroll i ciężkie obliczenia
        if (lenis) lenis.stop();
        
        // Opcjonalnie: Można wyłączyć animacje Framera globalnie (dla hardkorowych przypadków)
        // MotionGlobalConfig.skipAnimations = true; 
        
      } else {
        // 2. UŻYTKOWNIK WRÓCIŁ: Resetujemy wszystko
        
        // Mały timeout, żeby przeglądarka zdążyła przerysować klatkę
        setTimeout(() => {
            if (lenis) {
                lenis.start();
                lenis.resize(); // Kluczowe: Mówi Lenisowi "przelicz wszystko od nowa"
            }
            // MotionGlobalConfig.skipAnimations = false;
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Obsługa focusu okna (dla drugiego monitora)
    window.addEventListener('focus', () => handleVisibilityChange());

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [lenis]);

  return null; // Ten komponent nic nie renderuje
};