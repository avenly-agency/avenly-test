'use client';

import { useRef, type ReactNode } from 'react';
import { useSeen } from '../../_usluga/shared';

// Wspólne drobiazgi scen podstrony „System CRM” (sceny rundy 3 mają własne pliki i własne powłoki):
//   SecHead  - nagłówek zwykłej sekcji: zdanie z kropką w kolorze podstrony + opis, wejście przy pojawieniu się
//              na ekranie,
//   offsetTo - położenie elementu w układzie (bez przekształceń) względem przodka - do liczenia lotów i kamery.

/** Położenie w układzie względem `root` (root musi być pozycjonowanym przodkiem). */
export const offsetTo = (el: HTMLElement, root: HTMLElement) => {
  let x = 0, y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

export const SecHead = ({ id, title, accent, lead, children }: {
  id: string; title: string;
  /** Druga część nagłówka w kolorze podstrony; bez niej nagłówek kończy kropka w kolorze podstrony. */
  accent?: string;
  lead: string; children?: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.3);
  return (
    <div ref={ref} className="cr-sec-head">
      <h2 id={id} className="im-title sv-h2">
        {title}
        {accent ? <> <span className="im-accent">{accent}</span></> : <span className="im-accent">.</span>}
      </h2>
      <p className="im-lead cr-sec-lead">{lead}</p>
      {children}
    </div>
  );
};
