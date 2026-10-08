/**
 * Słownik sekcji modułów podstrony „System CRM” („Trzy ekrany to początek. System rośnie z Tobą.”) - runda 4,
 * trzy nowe propozycje: „Rośnie”, „Menu rośnie”, „W dół” (app/(pl)/uslugi/strony-www/system-crm/mods*.tsx).
 *
 * Same dane, bez funkcji i JSX. Nagłówek, opis, nazwy modułów, zdania o nich, licznik i puste miejsce idą z głównego
 * słownika podstrony (`systemCrmCopy.grow`), przykładowe dane mini-ekranów z `systemCrmCopy.roles` / `board` / `team`
 * (te same zlecenia, osoby i etapy, które odwiedzający widzi w pozostałych scenach) - tu są tylko NOWE napisy.
 * Zasady (PRODUCT.md): głos korzyści, sentence case, bez myślników em / en, bez liczb wyglądających jak wyniki,
 * AI nie jest tu modułem. Twarde spacje w PL dokłada koordynator podstrony (`typo()`).
 */

export interface ModsCopy {
  /** Mini-ekrany modułów (mods-ui.tsx) - napisy, których nie ma w głównym słowniku. */
  ui: {
    /** Klienci: nagłówek historii pierwszej osoby z listy i jej wpisy (`t` = co, `s` = kiedy). */
    clients: { title: string; history: { t: string; s: string }[] };
    /** Kalendarz: skróty pięciu dni roboczych (2 znaki), `today` = indeks dzisiejszego dnia, wpisy (`day` = indeks
        dnia, `label` = jedno słowo - mieści się w kolumnie dnia, `hot` = wyróżniony termin) i podpis wyróżnionego. */
    cal: { title: string; days: string[]; today: number; items: { day: number; time: string; label: string; hot?: boolean }[]; note: string };
    /** Role i uprawnienia: nagłówek tabeli dostępu (role i moduły idą z `roles`). */
    access: { title: string };
    /** Powiadomienia: to, co system wysyła sam. `kind` = ikona (poczta / powiadomienie w systemie), `to` = do kogo
        i którędy, `state` = stan, `wait` = jeszcze niewysłane (zaplanowane). */
    notes: { title: string; items: { kind: 'mail' | 'note'; text: string; to: string; state: string; wait?: boolean }[] };
    /** Raporty: nagłówek liczników według etapu i podpis linii (sam kształt, bez liczb). */
    reports: { title: string; trend: string };
  };
}

export const modsCopy: { pl: ModsCopy; en: ModsCopy } = {
  pl: {
    ui: {
      clients: {
        title: 'Historia kontaktu',
        history: [
          { t: 'Zapytanie ze strony', s: 'poniedziałek' },
          { t: 'Wycena zaakceptowana', s: 'środa' },
          { t: 'Montaż szafy', s: 'dziś, 10:00' },
        ],
      },
      cal: {
        title: 'Ten tydzień',
        days: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt'],
        today: 0,
        items: [
          { day: 0, time: '10:00', label: 'Montaż', hot: true },
          { day: 0, time: '14:30', label: 'Pomiar' },
          { day: 2, time: '9:00', label: 'Dostawa' },
          { day: 3, time: '12:00', label: 'Odbiór' },
          { day: 4, time: '16:00', label: 'Wycena' },
        ],
        note: 'Dziś, 10:00 · montaż szafy u Anny K.',
      },
      access: { title: 'Kto co widzi' },
      notes: {
        title: 'Wysłane przez system',
        items: [
          { kind: 'mail', text: 'Przypomnienie: montaż dziś o 10:00', to: 'Anna K. · e-mail', state: 'wysłany' },
          { kind: 'note', text: 'Nowe zadanie: montaż szafy', to: 'Marek · w systemie', state: 'odczytane' },
          { kind: 'mail', text: 'Podziękowanie po montażu', to: 'Anna K. · e-mail', state: 'zaplanowany', wait: true },
        ],
      },
      reports: { title: 'Zlecenia według etapu', trend: 'Nowe zlecenia tydzień po tygodniu' },
    },
  },
  en: {
    ui: {
      clients: {
        title: 'Contact history',
        history: [
          { t: 'Inquiry from the website', s: 'Monday' },
          { t: 'Quote accepted', s: 'Wednesday' },
          { t: 'Wardrobe fitting', s: 'today, 10:00' },
        ],
      },
      cal: {
        title: 'This week',
        days: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
        today: 0,
        items: [
          { day: 0, time: '10:00', label: 'Fitting', hot: true },
          { day: 0, time: '14:30', label: 'Measure' },
          { day: 2, time: '9:00', label: 'Delivery' },
          { day: 3, time: '12:00', label: 'Pick up' },
          { day: 4, time: '16:00', label: 'Quote' },
        ],
        note: 'Today, 10:00 · fitting the wardrobe at Anna K.',
      },
      access: { title: 'Who sees what' },
      notes: {
        title: 'Sent by the system',
        items: [
          { kind: 'mail', text: 'Reminder: fitting today at 10:00', to: 'Anna K. · email', state: 'sent' },
          { kind: 'note', text: 'New task: wardrobe fitting', to: 'Mark · in the system', state: 'read' },
          { kind: 'mail', text: 'Thank you note after the fitting', to: 'Anna K. · email', state: 'scheduled', wait: true },
        ],
      },
      reports: { title: 'Jobs by stage', trend: 'New jobs, week by week' },
    },
  },
};
