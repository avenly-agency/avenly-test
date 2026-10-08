'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * Client wrapper który ładuje Chatbot i LifecycleManager dynamic z ssr: false.
 *
 * Dlaczego ssr: false:
 * - Chatbot bubble visually pojawia się dopiero po user interaction (kliknięcie) - nie ma sensu w SSR HTML
 * - LifecycleManager to czysty side-effect (nasłuchuje visibilitychange) - brak UI, brak SSR potrzeby
 *
 * Dzięki ssr: false te komponenty:
 * - NIE są w initial bundle (osobny chunk)
 * - Ładują się dopiero po hydration (po Hero LCP)
 * - Nie blokują FCP/LCP/TTI
 */

const Chatbot = dynamic(
  () => import('@/components/chatbot/Chatbot').then((m) => m.Chatbot),
  { ssr: false, loading: () => null }
);

const LifecycleManager = dynamic(
  () => import('@/components/utils/LifecycleManager').then((m) => m.LifecycleManager),
  { ssr: false, loading: () => null }
);

// Baner zgody cookies (RODO) - ssr:false bo czyta localStorage; pojawia się po hydration.
// Żadne skrypty analityczne/marketingowe nie ładują się przed zgodą, więc opóźniony
// mount nie narusza zgodności (nic do bramkowania nie startuje wcześniej).
const CookieConsent = dynamic(
  () => import('@/components/cookie/CookieConsent').then((m) => m.CookieConsent),
  { ssr: false, loading: () => null }
);

export function DeferredClientWidgets() {
  // Mount dopiero po idle - dynamic z ssr:false startuje fetch + parse chunków
  // natychmiast po hydration, czyli w środku okna intro Hero (0-1.5s: Framer Motion
  // text intro + fade-in aurory). requestIdleCallback przesuwa chatbot/cookie/lifecycle
  // za intro; timeout 1500ms gwarantuje że baner cookies i tak pojawi się szybko.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
    const w = window as unknown as {
      requestIdleCallback?: IdleCb;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => setReady(true);
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 800);
    return () => {
      if (w.requestIdleCallback && w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <LifecycleManager />
      <Chatbot />
      <CookieConsent />
    </>
  );
}
