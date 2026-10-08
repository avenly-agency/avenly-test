'use client';

import { useSyncExternalStore } from 'react';

// Przełączniki PROPOZYCJI projektu (widoczne tylko w `npm run dev`): wybór zapamiętany
// w localStorage, produkcja zawsze dostaje wartość domyślną (serwer i pierwszy render też),
// więc nic nie miga ani nie rozjeżdża hydratacji. Używane w sekcjach "Dlaczego Avenly"
// (styl wizualizacji + układ) i "Proces" (układ). Po wyborze właściciela przełącznik
// i nieużywane warianty są do usunięcia.

export interface Choice<T extends string> {
  def: T;
  get: () => T;
  subscribe: (cb: () => void) => () => void;
  set: (v: T) => void;
}

export const createChoice = <T extends string>(key: string, ids: ReadonlyArray<{ id: T }>, def: T): Choice<T> => {
  let current: T = def;
  let loaded = false;
  const listeners = new Set<() => void>();
  return {
    def,
    get: () => current,
    subscribe: (cb) => {
      if (!loaded) {
        loaded = true;
        try {
          const v = window.localStorage.getItem(key);
          const hit = ids.find((s) => s.id === v);
          if (hit) current = hit.id;
        } catch { /* prywatne okno / zablokowana pamięć - zostaje domyślny */ }
      }
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    set: (v) => {
      current = v;
      try { window.localStorage.setItem(key, v); } catch { /* bez zapamiętania */ }
      listeners.forEach((l) => l());
    },
  };
};

export const useChoice = <T extends string>(c: Choice<T>): T =>
  useSyncExternalStore(c.subscribe, c.get, () => c.def);

/** Pigułka z wariantami (styl `.iv-switch` w globals.css). */
export const ProposalSwitcher = <T extends string>({ label, items, value, pick }: {
  label: string; items: ReadonlyArray<{ id: T; label: string }>; value: T; pick: (v: T) => void;
}) => (
  <div className="iv-switch" role="group" aria-label={`${label} (tylko lokalnie)`}>
    <span className="iv-switch-label">{label}</span>
    {items.map((s) => (
      <button key={s.id} type="button" className="iv-switch-btn" aria-pressed={value === s.id} onClick={() => pick(s.id)}>
        {s.label}
      </button>
    ))}
  </div>
);
