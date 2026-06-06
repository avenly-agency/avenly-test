'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

// CSS-only reveal - IntersectionObserver triggers compositor-only CSS transition
// (transform + opacity). Zero main thread work podczas animacji → Lenis nie zacina się
// na scroll'u gdy wiele elementów jednocześnie wjeżdża w viewport.
//
// Poprzednia wersja używała Framer Motion `whileInView` która robiła per-frame
// MotionValue updates na main thread = scroll lag przy wielu reveals jednocześnie.
export const Reveal = ({ children, width = "100%", delay = 0.2 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect prefers-reduced-motion - natychmiast pokaż bez animacji
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect(); // one-shot - fire once, never again
        }
      },
      { rootMargin: '-50px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width,
        overflow: 'visible',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 50px, 0)',
        transition: `opacity 600ms ease-out ${delay}s, transform 600ms ease-out ${delay}s`,
        // willChange tylko przed animacją (gdy hidden) - po animacji 'auto' żeby
        // zwolnić GPU layer (per Reveal element to dużo layerów jak zostawimy on)
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};