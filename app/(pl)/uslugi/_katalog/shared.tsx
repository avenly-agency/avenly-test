'use client';

import { useEffect, useState } from 'react';

// Elementy wspólne katalogu usług. Klasy z prefiksem us- (uslugi.css).

export const nn = (i: number) => String(i + 1).padStart(2, '0');

/** prefers-reduced-motion (false na serwerze i w pierwszym renderze - bez rozjazdu hydratacji). */
export const useReducedPref = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    const id = requestAnimationFrame(on);
    mq.addEventListener('change', on);
    return () => { cancelAnimationFrame(id); mq.removeEventListener('change', on); };
  }, []);
  return reduced;
};
