import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji Process (homepage). 4 kroki (tytuł + opis + "Dostajesz" + jedno słowo etapu) w kolejności
 * zgodnej z komponentem + nagłówek sekcji i zakończenie z jedynym CTA serwisu "Bezpłatna konsultacja".
 * PL = tekst 1:1 sprzed ekstrakcji (tytuły i opisy), EN = copy wg PRODUCT.md (benefit voice,
 * sentence case, bez em/en dashes). `gain` = co konkretnie dostajesz (wyprowadzone z opisów, bez nowych
 * obietnic). 2026-09-27: wybrany układ "Wstęga" (process/ribbon.tsx) - pola odrzuconych propozycji
 * (`stepLabel`, `of`, `mock`) usunięte. 2026-09-28: opisy kroków w głosie korzyści (co Ty masz
 * na danym etapie) zamiast głosu agencji ("słuchamy", "bierzemy na siebie").
 */

export interface ProcessStep {
  title: string;
  description: string;
  /** Co dostajesz w tym kroku (krótko, głos korzyści). */
  gain: string;
  /** Jedno słowo etapu (obok numeru nad tytułem). */
  short: string;
}

export interface ProcessDict {
  sectionAriaLabel: string;
  badge: string;
  headingLead: string;
  headingAccent: string;
  /** Podtytuł pod nagłówkiem. */
  lead: string;
  gainLabel: string;
  steps: ProcessStep[];
  ctaLead: string;
  cta: string;
}

export const processDict: Record<Locale, ProcessDict> = {
  pl: {
    sectionAriaLabel: 'Proces realizacji projektu',
    badge: 'Proces',
    headingLead: 'Jak to ',
    headingAccent: 'działa?',
    lead: 'Cztery kroki od pierwszej rozmowy do strony, która pracuje na Twój biznes.',
    gainLabel: 'Dostajesz',
    steps: [
      {
        title: 'Plan i strategia',
        description:
          'Na starcie wiesz, dla kogo jest Twoja strona i co ma robić. Każda późniejsza decyzja wynika z tego planu, więc nic nie powstaje na wyczucie.',
        gain: 'Plan strony z jasno określonym celem',
        short: 'Plan',
      },
      {
        title: 'Projekt graficzny',
        description:
          'Nie kupujesz kota w worku. Całą stronę widzisz i akceptujesz, zanim powstanie pierwsza linijka kodu, a projekt od pierwszego ekranu pokazuje klientom, dlaczego warto Ci zaufać.',
        gain: 'Pełną wizualizację strony do akceptacji',
        short: 'Projekt',
      },
      {
        title: 'Budowa i technologia',
        description:
          'Serwery, bezpieczeństwo i szybkość to już nie Twoje zmartwienie. Dostajesz stronę, która po prostu działa, a Ty w tym czasie prowadzisz firmę.',
        gain: 'Szybką i bezpieczną stronę, bez technicznych spraw na głowie',
        short: 'Budowa',
      },
      {
        title: 'Start i wsparcie',
        description:
          'Strona startuje sprawdzona na telefonach i komputerach, ze statystykami od pierwszego dnia. Po starcie nie zostajesz sam: zmiany i pytania załatwiasz z tym samym zespołem.',
        gain: 'Stronę gotową na klientów i wsparcie po starcie',
        short: 'Start',
      },
    ],
    ctaLead: 'Zaczynasz od rozmowy. Bezpłatnie i bez zobowiązań.',
    cta: 'Bezpłatna konsultacja',
  },
  en: {
    sectionAriaLabel: 'How we work on your project',
    badge: 'Process',
    headingLead: 'How does it ',
    headingAccent: 'work?',
    lead: 'Four steps from the first conversation to a website that works for your business.',
    gainLabel: 'You get',
    steps: [
      {
        title: 'Plan and strategy',
        description:
          'From the start you know who your website is for and what it has to do. Every later decision follows this plan, so nothing is left to guesswork.',
        gain: 'A website plan with one clear goal',
        short: 'Plan',
      },
      {
        title: 'Visual design',
        description:
          "You're not buying blind. You see and approve the whole website before a single line of code, and from the first screen the design shows clients why they can trust you.",
        gain: 'A full visualization of your website to approve',
        short: 'Design',
      },
      {
        title: 'Build and technology',
        description:
          'Servers, security and speed are no longer your concern. You get a website that simply works, while you run your business.',
        gain: 'A fast, secure website with no tech on your plate',
        short: 'Build',
      },
      {
        title: 'Launch and support',
        description:
          "Your website launches tested on phones and computers, with analytics from day one. After launch you're not on your own: changes and questions go to the same team.",
        gain: 'A website ready for clients, and support after launch',
        short: 'Launch',
      },
    ],
    ctaLead: 'You start with a conversation. Free and with no obligation.',
    cta: 'Free consultation',
  },
};
