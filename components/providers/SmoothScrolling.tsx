'use client';

// ZMIANA TUTAJ: import z 'lenis/react', a nie '@lenis/react'
import { ReactLenis } from 'lenis/react';

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}