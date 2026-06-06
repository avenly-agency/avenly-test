'use client';

import dynamic from 'next/dynamic';

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
  return (
    <>
      <LifecycleManager />
      <Chatbot />
      <CookieConsent />
    </>
  );
}
