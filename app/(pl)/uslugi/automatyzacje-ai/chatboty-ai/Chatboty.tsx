'use client';

import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { createChoice, ProposalSwitcher, useChoice } from '@/components/utils/proposals';
import { Dock } from '../../_usluga/dock';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { VoiceTongues } from './glos';
import { Opening } from './hero';
import { Night } from './noc';
import { KnowFacts } from './wiedza-konkrety';
import { KnowWall } from './wiedza-sciana';
import { ScopePlan } from './zakres';
import './chatboty.css'; // style wspólne podstrony (prefiks ch-); style sekcji w plikach obok komponentów sekcji

// Podstrona usługi „Chatboty AI” - przebudowa (praca równoległa, etap 3, fala 2 - chat 13, od 2026-10-04).
// To INNA usługa niż strony WWW (decyzja właściciela 2026-10-04): bez kadru ze stroną klienta i bez stosu kart
// z rysunkami. Bohaterem każdej sceny jest ROZMOWA (dymki, asystent jako gwiazda), a nie makieta strony.
// Decyzje właściciela: runda 4 - tekst hero pośrodku, pytania dookoła, bez linii z gwiazdą; Zakres = Plan,
// Głos = Języki (mgławica przyciemniona). Runda 5 - pytania w hero „bardziej premium”. RUNDA 6 (2026-10-05):
// „usuń ten bounce pod koniec animacji tych pytań w hero, bardziej premium zrób tę animację”; karta „Rano w Twojej
// skrzynce” - „zrób bardziej pasujący do designu, bo trochę odstaje”; Wiedza - „nie czuję tej sekcji jakoś z tych
// propozycji aktualnych, wymyśl coś innego”. Kolejność podstrony:
//   1. Hero   (hero.tsx)   - „Setki pytań każdego dnia. Żadne bez odpowiedzi.”: tekst w wąskiej kolumnie pośrodku,
//                            po bokach kaskady szklanych dymków w planach głębi; pierwszy ekran + przypięty film,
//   2. Noc    (noc.tsx)    - „22:00”: scenka Oferty jako pełnoekranowy film z ogromnym zegarem,
//   3. Wiedza - „Zna Twoją ofertę. Nie zmyśla.” (DO WYBORU, runda 6 - jeden obraz na cały ekran zamiast
//                            schematów z dokumentów): Ściana (wiedza-sciana.tsx) - wielkie pasy faktów firmy,
//                            w których zapalają się fakty z odpowiedzi / Konkrety (wiedza-konkrety.tsx) - konkret
//                            wielkim pismem, pytanie spoza wiedzy = pusty znak zapytania,
//   4. Głos   (glos.tsx)   - „Brzmi jak Twoja marka.”: JĘZYKI (wybór właściciela),
//   5. Zakres (zakres.tsx) - co dostajesz i kiedy: PLAN (wybór właściciela),
//   zakończenie - „Zacznijmy od rozmowy.” (szkielet).
// ODRZUCONE wersje Wiedzy („nie czuję”): Konstelacja, Dokumenty, Granica (wiedza.tsx - plik zostaje, bo eksportuje
// części wspólne nowych wersji), Warstwy, W środku, Przypisy (wiedza-warstwy / -srodek / -przypisy: na dysku,
// nieimportowane - do usunięcia za zgodą właściciela). Nie przywracać bez prośby.
// Usunięte wcześniej: wersje sekcji 4 (Twoja branża, Pokrętło) i 5 (Pokaz, Rozmowa). Na dysku do decyzji właściciela
// (nieimportowane): scena.tsx / scena.css i pytania.tsx / pytania.css (dawne wersje sceny głównej i pytań).
// Ze szkieletu app/(pl)/uslugi/_usluga/ bierzemy język marki: korzeń z kolorem podstrony (pomarańcz, z adresu),
// tło-mgławicę, wejście z czerni, nagłówek-zdanie z kropką, biały przycisk, zakończenie.
// Przycisk „Przetestuj na sobie” otwiera PRAWDZIWEGO asystenta z rogu strony (avenly:open-chat) - okna czatu nie
// ruszamy. Rozmowy w scenach to z góry napisane przykłady (żadnych wywołań API).
// Stary ChatbotsAIClient.tsx i `chatbotsDict` zostają na dysku jako źródło tekstów (nieimportowane).
// Notatki: docs/podstrony/usluga-chatboty-ai.md.

const DEV = process.env.NODE_ENV !== 'production';

// Wiedza, runda 6: nowe propozycje. Nowy klucz wyboru, żeby domyślnie pokazała się nowa wersja.
const KNOWS = [
  { id: 'sciana', label: 'Ściana' },
  { id: 'konkrety', label: 'Konkrety' },
] as const;
type KnowLook = (typeof KNOWS)[number]['id'];
const knowChoice = createChoice<KnowLook>('avenly-chatboty-wiedza-3', KNOWS, 'sciana');

export function Chatboty({ t, locale = 'pl' }: { t: ChatbotsCopy; locale?: Locale }) {
  const know = useChoice(knowChoice);
  return (
    <ServiceShell className="ch">
      <Opening t={t} locale={locale} />
      <Night t={t} locale={locale} />

      {know === 'sciana' && <KnowWall key="sciana" t={t} locale={locale} />}
      {know === 'konkrety' && <KnowFacts key="konkrety" t={t} locale={locale} />}

      <VoiceTongues t={t} locale={locale} />
      <ScopePlan t={t} locale={locale} />

      <ServiceEnding t={t.ending} locale={locale} />
      {DEV && (
        <Dock>
          <ProposalSwitcher label="3. Wiedza" items={KNOWS} value={know} pick={knowChoice.set} />
        </Dock>
      )}
    </ServiceShell>
  );
}
