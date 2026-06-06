'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Płynne wejście treści przy zmianie podstrony - wrapper keyed po pathname z CSS fade-in
 * (`.page-transition` w globals.css). Maskuje instant-skok wysokości/scrolla przy nawigacji.
 *
 * - Pierwsze wczytanie BEZ animacji (żeby nie nakładać się na intro Hero) - animacja dopiero przy nawigacji.
 * - Opacity-only → NIE tworzy containing block dla `position: fixed/sticky` → piny GSAP nietknięte.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirst = useRef(true);
  useEffect(() => {
    isFirst.current = false;
  }, []);
  return (
    <div key={pathname} className={isFirst.current ? undefined : 'page-transition'}>
      {children}
    </div>
  );
}
