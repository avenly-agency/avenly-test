'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Panel przełączników PROPOZYCJI dla podstron usług (tylko `npm run dev` - rodzic renderuje go pod warunkiem DEV).
// Zasada właściciela (2026-09-30): przełączniki zawsze POZA stroną, w jednym stałym, zwijanym panelu przyklejonym do
// dołu okna (portal do <body>), nigdy w treści. Kopia wzoru app/(pl)/realizacje/_rl/dock.tsx z własnym prefiksem
// (.sv-dock w usluga.css) - dla one-page i całej fali 2. Na telefonie zostawia wolny prawy dolny róg (bąbel czatu).
const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const KEY = 'avenly-dock-open';

export const Dock = ({ children, title = 'Propozycje' }: { children: ReactNode; title?: string }) => {
  const mounted = useMounted();
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
    <div className="sv-dock" data-open={open ? '' : undefined} role="region" aria-label={`${title} (tylko lokalnie)`}>
      <button type="button" className="sv-dock-btn" aria-expanded={open} onClick={toggle}>
        {title}
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && <div className="sv-dock-in">{children}</div>}
    </div>,
    document.body,
  );
};
