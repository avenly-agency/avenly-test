// Słownik sekcji „Nic już nie ginie” podstrony „System CRM” - RUNDA 4 (właściciel 2026-10-04 po rundzie 3: „to 2.
// zlecenie zrób inne, trochę bardziej uniwersalne dla każdych CRM”). Zastępuje `system-crm-flow.ts` (droga jednego
// zlecenia stolarni). Trzy propozycje sceny: app/(pl)/uslugi/strony-www/system-crm/lead*.tsx.
// Same dane, bez funkcji i JSX. Z głównego słownika sceny biorą tylko: `t.app` (pasek okna przykładowej firmy),
// `t.team` (imiona osób - `who` = indeks) i `t.film.stepsAria`.
// TREŚĆ JEST CELOWO BEZ BRANŻY: to, co robi każdy system CRM w każdej firmie - zapytania z kilku kanałów w jednym
// miejscu, karta klienta z historią, sprawa w etapach o ogólnych nazwach, system sam przypisuje osobę, termin
// i przypomina o sprawie, która stoi. Żadnych słów w rodzaju szafa, pomiar, montaż. AI tu nie występuje.
// Zasady (PRODUCT.md): głos korzyści, sentence case, bez myślników em / en, bez liczb wyglądających jak wyniki i bez
// cen; klienci to zwykłe imiona z inicjałem albo neutralna nazwa firmy z głównego słownika („Biuro Linia”).
// `{name}` w tekstach = imię osoby z zespołu (zdania ułożone tak, żeby nie zależały od rodzaju).
// Twarde spacje w PL dokłada koordynator (`typo()` w system-crm.ts).

export type LeadChannel = 'form' | 'mail' | 'phone';

export interface LeadCopy {
  /** Nagłówek sekcji: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). */
  title: string;
  lead: string;
  /** Kanały, którymi przychodzą zapytania. */
  channels: Record<LeadChannel, string>;
  /** Wersja „Kanały” (lead-channels.tsx): trzy źródła, jedna lista. `who` = indeks w `t.team`, `due` = termin,
      który system ustawia sam, `done` = to, co system zrobił na koniec. Zdań narratora dokładnie trzy. */
  inbox: {
    steps: string[];
    sourcesAria: string;
    listTitle: string;
    listAria: string;
    rows: { ch: LeadChannel; name: string; time: string; text: string; who: number; due: string; done: string }[];
  };
}

export const leadCopy: { pl: LeadCopy; en: LeadCopy } = {
  pl: {
    // tytuł = scenka Oferty („Wpada zapytanie i nic już nie ginie.”)
    title: 'Nic już nie ginie',
    lead: 'Każde zapytanie trafia w jedno miejsce i od razu ma swoją osobę oraz termin. O sprawie, która stoi, system przypomni sam.',
    channels: { form: 'Formularz na stronie', mail: 'E-mail', phone: 'Telefon' },
    inbox: {
      steps: [
        // pierwsze i ostatnie zdanie = scenka Oferty
        'Wpada zapytanie z formularza, e-maila albo telefonu i nic już nie ginie.',
        'Każde od razu dostaje osobę i termin odpowiedzi.',
        'Klient dostaje potwierdzenie, a Ty masz wolną głowę.',
      ],
      sourcesAria: 'Skąd przychodzą zapytania',
      listTitle: 'Zapytania',
      listAria: 'Zapytania w systemie',
      rows: [
        { ch: 'form', name: 'Marta W.', time: '9:12', text: 'Proszę o ofertę i termin rozmowy.', who: 0, due: 'odpowiedź do 12:00', done: 'Potwierdzenie wysłane' },
        { ch: 'mail', name: 'Biuro Linia', time: '9:40', text: 'Czy możemy umówić spotkanie w tym tygodniu?', who: 1, due: 'odpowiedź do jutra', done: 'Potwierdzenie wysłane' },
        { ch: 'phone', name: 'Piotr S.', time: '10:05', text: 'Prosi o oddzwonienie w sprawie wyceny.', who: 0, due: 'oddzwonić do 11:00', done: 'Przypomnienie ustawione' },
        { ch: 'form', name: 'Julia P.', time: '11:30', text: 'Czy mają Państwo wolne terminy?', who: 2, due: 'odpowiedź do 14:00', done: 'Potwierdzenie wysłane' },
        { ch: 'mail', name: 'Adam L.', time: '12:15', text: 'Przesyłam szczegóły w załączniku.', who: 1, due: 'odpowiedź do jutra', done: 'Potwierdzenie wysłane' },
      ],
    },
  },
  en: {
    title: 'Nothing gets lost anymore',
    lead: 'Every inquiry lands in one place and gets a person and a deadline right away. If a case stalls, the system reminds you by itself.',
    channels: { form: 'Website form', mail: 'Email', phone: 'Phone' },
    inbox: {
      steps: [
        'An inquiry comes in by form, email or phone and nothing gets lost.',
        'Each one gets a person and a reply deadline right away.',
        'Your client gets a confirmation, and your mind is free.',
      ],
      sourcesAria: 'Where inquiries come from',
      listTitle: 'Inquiries',
      listAria: 'Inquiries in the system',
      rows: [
        { ch: 'form', name: 'Martha W.', time: '9:12', text: 'Please send me an offer and a time to talk.', who: 0, due: 'reply by 12:00', done: 'Confirmation sent' },
        { ch: 'mail', name: 'Linia Office', time: '9:40', text: 'Can we set up a meeting this week?', who: 1, due: 'reply by tomorrow', done: 'Confirmation sent' },
        { ch: 'phone', name: 'Peter S.', time: '10:05', text: 'Asks for a call back about a quote.', who: 0, due: 'call back by 11:00', done: 'Reminder set' },
        { ch: 'form', name: 'Julia P.', time: '11:30', text: 'Do you have any free dates?', who: 2, due: 'reply by 14:00', done: 'Confirmation sent' },
        { ch: 'mail', name: 'Adam L.', time: '12:15', text: 'I am sending the details in the attachment.', who: 1, due: 'reply by tomorrow', done: 'Confirmation sent' },
      ],
    },
  },
};
