'use client';

import type { CSSProperties } from 'react';
import { ClipboardList, Mail, Phone, type LucideIcon } from 'lucide-react';
import type { LeadChannel } from '@/lib/i18n/uslugi/system-crm-lead';
import { setSteps } from '../../_usluga/parts';
import { lin } from '../../_usluga/shared';

// Części pomocnicze sceny „Kanały” (lead-channels.tsx, style cr7- w lead.css) - sekcja „Nic już nie ginie”.
// Po wyborze właściciela (2026-10-05: „kanały fajne”) wersje „Lejek” i „Karta klienta” są usunięte razem ze swoimi
// częściami (powłoka sceny przypiętej, dopasowanie skali, rozejście z przewijania); kopie w docs/archiwum/usluga-system-crm/.
//   Reel      - bęben: napis zmienia się prawdziwym ruchem w pionie (położenie = zmienna CSS --rp; bez niej stoi
//               ostatnia pozycja, czyli stan końcowy),
//   narrate   - bieżące zdanie narratora i wypełnienie pasków z postępu,
//   put / flag / wipe - zapis do DOM tylko przy zmianie wartości i sprzątanie po scenie.
// Scena pisze zmienne CSS i atrybuty wprost do DOM - bez stanu Reacta w klatce.

/** Kolejność kanałów = kolejność torów. */
export const CHANNELS: LeadChannel[] = ['form', 'mail', 'phone'];
export const CHANNEL_ICON: Record<LeadChannel, LucideIcon> = { form: ClipboardList, mail: Mail, phone: Phone };

export const put = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
export const flag = (el: Element, k: string, on: boolean) => { if (el.hasAttribute(k) !== on) el.toggleAttribute(k, on); };
/** Ograniczony ruch: scena zdejmuje to, co zapisała - zostaje stan końcowy z CSS. */
export const wipe = (el: HTMLElement | null, keys: string[], attrs: string[] = []) => {
  if (!el) return;
  keys.forEach((k) => el.style.removeProperty(k));
  attrs.forEach((a) => el.removeAttribute(a));
};

/** Zdania narratora w scenie (elementy listy ze szkieletu). */
export const stepsOf = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>('.cr7-narr .sv-step'));
export const clearSteps = (list: HTMLElement[]) => list.forEach((li) => { li.removeAttribute('data-on'); li.style.removeProperty('--f'); });

/** Narrator: `v` = postęp (dowolna jednostka), `cuts` = progi, od których zaczyna się kolejne zdanie (o jeden mniej
    niż zdań), `end` = koniec paska ostatniego zdania. */
export const narrate = (list: HTMLElement[], v: number, cuts: number[], end = 1) => {
  if (!list.length) return;
  let active = 0;
  while (active < cuts.length && v >= cuts[active]) active++;
  active = Math.min(active, list.length - 1);
  setSteps(list, active, list.map((_, i) => {
    const a = i === 0 ? 0 : cuts[i - 1] ?? end, b = cuts[i] ?? end;
    return b > a ? lin(v, a, b) : v >= a ? 1 : 0;
  }));
};

/** Bęben. Czytnik ekranu dostaje tylko ostatnią pozycję (stan po odegraniu sceny). */
export const Reel = ({ items, className }: { items: string[]; className?: string }) => (
  <span className={className ? `cr7-reel ${className}` : 'cr7-reel'}>
    <span className="cr7-reel-in" style={{ '--to': items.length - 1 } as CSSProperties}>
      {items.map((it, i) => <span key={i} aria-hidden={i < items.length - 1 ? true : undefined}>{it}</span>)}
    </span>
  </span>
);
