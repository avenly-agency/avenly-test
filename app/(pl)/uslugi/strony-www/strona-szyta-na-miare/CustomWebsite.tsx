'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { createChoice, ProposalSwitcher, useChoice } from '@/components/utils/proposals';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { Dock } from '../../_usluga/dock';
import { Detail } from './detail';
import { Letters, Specimen } from './detail-alt';
import { Film } from './film';
import { Scope } from './scope';
import { ScopeAxis, ScopeGrid } from './scope-alt';
import type { Horizon } from './site';
import { Stars } from './stars';
import { TechBoard, TechStrips, TechWorlds, type TechLook } from './tech';
import './strona-szyta-na-miare.css'; // style podstrony we własnym pliku (praca równoległa), prefiks sm-

// Podstrona usługi „Strona interaktywna” (do 2026-10-05 „Strona szyta na miarę” - właściciel 2026-10-06: „trzeba zmienić
// nazwę szyta na miarę, bo każda firma tak pisze i jest to cringe”; wybrał „Strona interaktywna”. Adres podstrony,
// nazwy plików, prefiks sm- i hasło zadania w planie pracy równoległej zostają bez zmian - adres zmienimy po zakończeniu
// pracy równoległej, z przekierowaniem 301). Przebudowa na wzorcu one-page (praca równoległa, etap 3 - chat 9, fala 2).
// POZIOM 3 hierarchii podstron usług („pełne widowisko”). Właściciel 2026-10-02: to „praktycznie to samo co strona
// firmowa, tylko bardziej zaawansowana w animacje, design” - przykładem takiej strony jest sama avenly.pl. To była
// INFORMACJA DLA NAS, nie treść: na podstronie NIE porównujemy tej usługi ze stroną firmową („nie chcę, żebyś
// bezpośrednio porównywał firmową do szytej na miarę”) i nie powtarzamy tego, co obowiązuje w każdej usłudze stron
// (kod od zera, bez szablonów i wtyczek, szybkość - „napisanie oczywistości, która jest w poprzednich”). Podstrona
// pokazuje stronę firmy zrobioną jak strona z najwyższej półki (makieta w kadrze w palecie podstrony) i mówi tylko
// o tym, co daje TEN poziom: nastrój, ruch, gest, sceny pisane dla marki, funkcje i integracje bez limitu.
//   1. Film        (film.tsx)    - pierwszy ekran „Horyzont” + przypięta scena: nastrój -> ruch -> gest (scenka Oferty),
//   2. Możliwości  (stars.tsx)   - „Nić”: nić prowadzi przez gwiazdy z funkcjami, kamera jedzie za igłą,
//   3. Technologia (tech.tsx)    - trzy treści w jednej z trzech scen: Deska / Światy / Kadry,
//   4. Detal       (detail*.tsx) - „Czuć każdy detal”: odwiedzający sam sprawdza przewinięcie, najazd i przejście,
//   5. Zakres      (scope*.tsx)  - etapy z terminem na linii wymiarowej,
//   zakończenie - „Zacznijmy od rozmowy.” (szkielet).
// Tło = mgławica szkieletu (kursor jako czarna dziura, fale po kliknięciach). Nić za kursorem i gwiazdy przypinane
// kliknięciem (własna warstwa tła z rundy 1) USUNIĘTE na prośbę właściciela - NIE wracać.
// WYBORY WŁAŚCICIELA 2026-10-05 (runda 5): „wybieram nić w 2., ale dopracuj to bardziej; w 1. wybieram horyzont, ale
// zrób ładniej to i daj kilka propozycji samego horyzontu; 3. zrób kilka innych, bo te mi się nie podobają”.
//   -> scena 1: Horyzont zostaje, w panelu cztery KRAJOBRAZY horyzontu (Moodboard i Scena usunięte),
//   -> scena 2: Nić zostaje i jest dopracowana (Taśmy i Orbity usunięte),
//   -> scena 3: Stos / Panorama / Siatka usunięte, w panelu trzy nowe sceny,
//   -> sceny 4 i 5: bez decyzji - dalej po trzy propozycje.
// Po kolejnych wyborach pozostałe warianty, ich style i przełączniki są do usunięcia.
// Notatki: docs/podstrony/usluga-strona-szyta-na-miare.md. Stary DedicatedWebsiteClient.tsx zostaje na dysku
// (nieimportowany, źródło tekstów) - usuwa go koordynator za zgodą właściciela.

const DEV = process.env.NODE_ENV === 'development';

const HORIZONS = [
  { id: 'ridge', label: 'Grzbiety' },
  { id: 'sea', label: 'Tafla' },
  { id: 'orbit', label: 'Orbita' },
  { id: 'peak', label: 'Szczyt' },
] as const satisfies ReadonlyArray<{ id: Horizon; label: string }>;
const hzChoice = createChoice<Horizon>('avenly-na-miare-horyzont', HORIZONS, 'ridge');

const TECHS = [
  { id: 'board', label: 'Deska' },
  { id: 'worlds', label: 'Światy' },
  { id: 'strips', label: 'Kadry' },
] as const satisfies ReadonlyArray<{ id: TechLook; label: string }>;
const techChoice = createChoice<TechLook>('avenly-na-miare-technologia', TECHS, 'board');

type DetailLook = 'sphere' | 'letters' | 'specimen';
const DETAILS = [
  { id: 'sphere', label: 'Kula' },
  { id: 'letters', label: 'Litery' },
  { id: 'specimen', label: 'Próbki' },
] as const satisfies ReadonlyArray<{ id: DetailLook; label: string }>;
const detailChoice = createChoice<DetailLook>('avenly-na-miare-detal', DETAILS, 'sphere');

type ScopeLook = 'show' | 'axis' | 'grid';
const SCOPES = [
  { id: 'show', label: 'Pokaz w kadrze' },
  { id: 'axis', label: 'Oś' },
  { id: 'grid', label: 'Plan' },
] as const satisfies ReadonlyArray<{ id: ScopeLook; label: string }>;
const scopeChoice = createChoice<ScopeLook>('avenly-na-miare-zakres', SCOPES, 'show');

/** WYDAJNOŚĆ (2026-10-06, właściciel: „zoptymalizuj całą podstronę pod względem wydajności”): sekcja, która jest daleko
    od ekranu (ponad 60% wysokości okna), dostaje `data-idle` - jej animacje CSS stoją (reguła w CSS: migotanie gwiazd
    i dryf chmur w makiecie, „oddychanie” gwiazd nici, pokazy zakresu). Jeden obserwator na całą podstronę; `k` zmienia
    się, gdy przełącznik propozycji podmienia sekcję (wtedy lista sekcji jest zbierana od nowa). */
const IdleWatch = ({ k }: { k: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.toggleAttribute('data-idle', !e.isIntersecting)), { rootMargin: '60% 0px' });
    const secs = Array.from(root.querySelectorAll(':scope > section'));
    secs.forEach((s) => io.observe(s));
    return () => { io.disconnect(); secs.forEach((s) => s.removeAttribute('data-idle')); };
  }, [k]);
  return <span ref={ref} hidden />;
};

export function CustomWebsite({ t, locale = 'pl' }: { t: CustomCopy; locale?: Locale }) {
  const hz = useChoice(hzChoice);
  const tech = useChoice(techChoice);
  const detail = useChoice(detailChoice);
  const scope = useChoice(scopeChoice);
  return (
    <ServiceShell className="sm">
      <Film t={t} locale={locale} hz={hz} />
      <Stars t={t.stars} />
      {tech === 'board' && <TechBoard t={t.cases} />}
      {tech === 'worlds' && <TechWorlds t={t.cases} />}
      {tech === 'strips' && <TechStrips t={t.cases} />}
      {detail === 'sphere' && <Detail t={t.detail} />}
      {detail === 'letters' && <Letters t={t.detail} />}
      {detail === 'specimen' && <Specimen t={t.detail} site={t.site} />}
      {scope === 'show' && <Scope t={t.scope} site={t.site} hz={hz} />}
      {scope === 'axis' && <ScopeAxis t={t.scope} />}
      {scope === 'grid' && <ScopeGrid t={t.scope} />}
      <ServiceEnding t={t.ending} locale={locale} />
      <IdleWatch k={`${tech} ${detail} ${scope}`} />
      {DEV && (
        <Dock>
          <ProposalSwitcher label="1. Horyzont" items={HORIZONS} value={hz} pick={hzChoice.set} />
          <ProposalSwitcher label="3. Technologia" items={TECHS} value={tech} pick={techChoice.set} />
          <ProposalSwitcher label="4. Detal" items={DETAILS} value={detail} pick={detailChoice.set} />
          <ProposalSwitcher label="5. Zakres" items={SCOPES} value={scope} pick={scopeChoice.set} />
        </Dock>
      )}
    </ServiceShell>
  );
}
