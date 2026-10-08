'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Przełączniki propozycji POZA stroną: stały panel przyklejony do dołu ekranu (portal do <body>, nad treścią, poza
// układem podstrony), zwijany do małej pigułki. Zasada właściciela (2026-09-30): „toggle wyjmij ze strony i daj na
// dole ekranu poza stroną do wyboru, i zawsze tak rób z togglami”. Tylko w `npm run dev` (rodzic renderuje go pod DEV).
const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const KEY = 'avenly-dock-open';

export const Dock = ({ children, title = 'Propozycje' }: { children: ReactNode; title?: string }) => {
  const mounted = useMounted();
  // zapamiętany stan (zwinięty panel nie wraca rozwinięty po przeładowaniu); pierwszy raz: na telefonie zwinięty
  // (inaczej zasłania pół ekranu), na komputerze rozwinięty. Stan nie wpływa na HTML z serwera.
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    try { const v = localStorage.getItem(KEY); if (v) return v === '1'; } catch {}
    return !window.matchMedia('(max-width: 767px)').matches;
  });
  const toggle = () => setOpen((o) => {
    try { localStorage.setItem(KEY, o ? '0' : '1'); } catch {}
    return !o;
  });
  if (!mounted) return null;
  return createPortal(
    <div className="rl-dock" data-open={open ? '' : undefined} role="region" aria-label={`${title} (tylko lokalnie)`}>
      <button type="button" className="rl-dock-btn" aria-expanded={open} onClick={toggle}>
        {title}
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && <div className="rl-dock-in">{children}</div>}
    </div>,
    document.body,
  );
};
