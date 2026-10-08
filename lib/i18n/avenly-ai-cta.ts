import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik CTA "Masz pytania?" (components/AvenlyAICta.tsx).
 *
 * Komponent WSPÓŁDZIELONY ('use client', renderowany na 5 podstronach usług,
 * ServicesHub i ChatbotsAIClient) - nie dostaje propsów. Locale wykrywa sam
 * przez localeFromPathname(usePathname()), słownik importuje bezpośrednio
 * (oba języki w bundlu - same krótkie stringi).
 *
 * Opis jest rozbity na trzy części, bo w środku jest podświetlony <span>
 * z nazwą asystenta (assistantName) - JSX zostaje w komponencie.
 *
 * PL = 1:1 (bajt w bajt) z komponentu sprzed ekstrakcji.
 * EN = naturalny angielski wg PRODUCT.md (benefit voice, sentence case,
 * bez em/en dashes). Zero JSX.
 */

export interface AvenlyAiCtaDict {
  heading: string;
  /** Tekst przed podświetloną nazwą asystenta (kończy się spacją). */
  descriptionPre: string;
  /** Nazwa asystenta renderowana w podświetlonym <span>. */
  assistantName: string;
  /** Tekst po podświetlonej nazwie asystenta (zaczyna się spacją). */
  descriptionPost: string;
  buttonLabel: string;
}

export const avenlyAiCtaDict: Record<Locale, AvenlyAiCtaDict> = {
  pl: {
    heading: 'Masz pytania?',
    descriptionPre: 'Nie musisz czekać na maila. Nasz asystent ',
    assistantName: 'Avenly AI',
    descriptionPost:
      ' zna szczegóły techniczne i wyceni wstępnie Twój projekt.',
    buttonLabel: 'Zapytaj Avenly AI',
  },
  en: {
    heading: 'Have questions?',
    descriptionPre: "You don't have to wait for an email. Our assistant ",
    assistantName: 'Avenly AI',
    descriptionPost:
      ' knows the technical details and can give your project an initial estimate.',
    buttonLabel: 'Ask Avenly AI',
  },
};
