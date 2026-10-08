'use client';

import dynamic from 'next/dynamic';
import type { Locale } from '@/lib/i18n/locale';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { heroPoints } from './hero-points';
// Style wszystkich scen są w arkuszu strony od razu (nie czekają na doładowanie kodu sceny) - prefiksy:
// cr- wspólne, cr1c- scena główna (import w hero-points.tsx), cr7- „Kanały”, cr3- „Klucz”, cr8- „W dół”, cr6- „Tory”.
import './system-crm.css';
import './bloom.css'; // GENEROWANE (scripts/crm-bloom.mjs): tekstury i reguły „rozejścia” (.cr-bloom / .cr-bloom-out)
import './lead.css';
import './eyes.css';
import './mods.css';
import './aiscene.css';

// Podstrona usługi „System CRM” - przebudowa (praca równoległa, etap 3 - chat 11, od 2026-10-04).
// INNA USŁUGA NIŻ STRONY WWW (właściciel 2026-10-04: „CRM i chatboty mają być inne, bo to inna usługa”): bohaterem jest
// NARZĘDZIE - przykładowy system wymyślonej firmy („Pracownia Dąb”), a nie strona klienta w kadrze przeglądarki.
// ŻADNA scena nie jest interaktywna (właściciel: „nie rób interaktywnych”) - wszystkim steruje przewijanie.
// Każda scena renderuje CAŁĄ swoją sekcję (kontrakt: types.ts) i ma własny plik CSS oraz własny słownik.
// Wersje wybrane przez właściciela (2026-10-04 / 05) - pozostałe usunięte, kopie w docs/archiwum/usluga-system-crm/:
//   1. Scena główna                  „Z punktów”  hero-points
//   2. „Nic już nie ginie”           „Kanały”     lead-channels (to, co robi każdy CRM, bez słów jednej branży)
//   3. „Każdy widzi to, co powinien” „Klucz”      eyes-key (tylko role wewnątrz firmy: właściciel, biuro, pracownik)
//   4. Twój proces                   „Bębny”      reels (bez widocznego tytułu i opisu sekcji)
//   5. „System rośnie z Tobą”        „W dół”      mods-down
//   6. AI jako opcja                 „Tory”       aiscene-lanes
//   zakończenie „Zacznijmy od rozmowy.” (szkielet). Sekcji zakresu i terminu nie ma („zakres usuń”).
// Notatki: docs/podstrony/usluga-system-crm.md. Pierwotna wersja: AppWebClient.tsx (nieimportowany, źródło tekstów).
//
// WYDAJNOŚĆ (właściciel 2026-10-05: „zoptymalizuj całą podstronę względem wydajności”): kod scen poniżej pierwszego
// ekranu jest w osobnych kawałkach i wczytuje się po pierwszej bezczynności przeglądarki - ten sam wzorzec co sekcje
// strony głównej (components/home/HomeClient.tsx). HTML sekcji jest w statycznym eksporcie i React trzyma go, aż kod
// się doładuje (dynamic z ssr: true = lazy + Suspense), więc na ekranie nic się nie zmienia - przesuwa się tylko
// hydratacja, żeby nie biła się z wejściem sceny głównej (budowa chmury punktów na płótnie).
let idleGate: Promise<void> | null = null;
const afterFirstIdle = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!idleGate) {
    idleGate = new Promise<void>((resolve) => {
      type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
      const ric = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback;
      if (ric) ric(() => resolve(), { timeout: 1800 });
      else window.setTimeout(resolve, 1200);
    });
  }
  return idleGate;
};

const LeadChannels = dynamic(() => afterFirstIdle().then(() => import('./lead-channels')).then((m) => m.LeadChannels));
const EyesKey = dynamic(() => afterFirstIdle().then(() => import('./eyes-key')).then((m) => m.EyesKey));
const FitReels = dynamic(() => afterFirstIdle().then(() => import('./reels')).then((m) => m.FitReels));
const ModsDown = dynamic(() => afterFirstIdle().then(() => import('./mods-down')).then((m) => m.ModsDown));
const AiLanes = dynamic(() => afterFirstIdle().then(() => import('./aiscene-lanes')).then((m) => m.AiLanes));

export function SystemCrm({ t, locale = 'pl' }: { t: SystemCrmCopy; locale?: Locale }) {
  return (
    <ServiceShell className="cr">
      <heroPoints.Scene t={t} x={t.x.heroPoints} locale={locale} headId="sv-h1" />
      <LeadChannels t={t} x={t.x.lead} locale={locale} headId="cr-lead-h" />
      <EyesKey t={t} x={t.x.eyes} locale={locale} headId="cr-eyes-h" />
      <FitReels t={t} headId="cr-fit-h" />
      <ModsDown t={t} x={t.x.mods} locale={locale} headId="cr-mods-h" />
      <AiLanes t={t} x={t.x.ai} locale={locale} headId="cr-ai-h" />
      <ServiceEnding t={t.ending} locale={locale} />
    </ServiceShell>
  );
}
