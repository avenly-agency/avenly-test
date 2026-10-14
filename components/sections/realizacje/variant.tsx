'use client';

import { useState, useSyncExternalStore, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { createChoice, ProposalSwitcher } from '@/components/utils/proposals';
import type { RealizacjeTransition } from './scene';

// Sekcja „Realizacje” strony głównej - sposób zmiany kadru (2026-10-13). Właściciel po przejściu „Portal” na /o-nas:
// „portal zajebisty, gdzie można jeszcze ten efekt użyć zmiany z gwiazdami?” i polecenie „wykonaj”.
//   Gwiazda (domyślna, także produkcja) - nowy projekt otwiera się w kadrze przez gwiazdę z logo,
//   Kurtyna                              - dotychczasowe wejście od dołu, zostawione do porównania.
// Przełącznik widać tylko w `npm run dev`, w panelu przyklejonym do dołu okna (zasada z 2026-09-30: przełączniki
// propozycji zawsze poza stroną). Po decyzji właściciela: usunąć ten plik, niewybraną gałąź w scene.ts i opcję
// getTransition.

const ITEMS = [
  { id: 'star', label: 'Gwiazda' },
  { id: 'curtain', label: 'Kurtyna (dotychczasowa)' },
] as const satisfies ReadonlyArray<{ id: RealizacjeTransition; label: string }>;

export const rzTransition = createChoice<RealizacjeTransition>('avenly-realizacje-przejscie', ITEMS, 'star');

const noop = () => () => {};
const KEY = 'avenly-dock-open';

const BOX: CSSProperties = {
  position: 'fixed', left: '50%', bottom: 14, zIndex: 2147483000, transform: 'translateX(-50%)',
  display: 'grid', justifyItems: 'center', gap: 8, width: 'max-content', maxWidth: 'min(96vw, 1100px)',
  padding: 8, borderRadius: 18, background: 'rgba(8, 8, 10, .96)', color: '#e2e8f0',
  boxShadow: '0 0 0 1px rgba(255, 255, 255, .12), 0 18px 50px -20px rgba(0, 0, 0, .9)',
};
const BOX_CLOSED: CSSProperties = { ...BOX, left: 72, transform: 'none', padding: 4, borderRadius: 999 };
const BTN: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8, height: 30, padding: '0 14px', border: 0, borderRadius: 999,
  background: 'none', font: 'inherit', fontSize: 12.5, fontWeight: 600, color: '#cbd5e1', cursor: 'pointer',
};

/** Panel z przełącznikiem przejścia (rodzic renderuje go tylko poza produkcją). */
export function RzTransitionDock({ value }: { value: RealizacjeTransition }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
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
    <div style={open ? BOX : BOX_CLOSED} role="region" aria-label="Propozycje (tylko lokalnie)">
      <button type="button" style={BTN} aria-expanded={open} onClick={toggle}>
        Propozycje
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && (
        <div className="iv-switches" style={{ margin: 0 }}>
          <ProposalSwitcher label="Realizacje - zmiana projektu" items={ITEMS} value={value} pick={rzTransition.set} />
        </div>
      )}
    </div>,
    document.body,
  );
}
