import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik strony /kontakt (PL) i /en/contact (EN).
 * - interface KontaktDict z samymi stringami / obiektami / tablicami (zero JSX),
 * - PL i EN wg PRODUCT.md: głos korzyści, sentence case, bez myślników em / en, "i" zamiast "&",
 *   jedyne CTA serwisu "Bezpłatna konsultacja" (przycisk formularza to akcja "Wyślij wiadomość").
 * - Dane firmy (e-mail, telefony, godziny) NIE są w słowniku - komponent bierze je z lib/seo-data.ts.
 *
 * ServiceSelect: `value` KAŻDEJ opcji musi zostać identyczne w pl i en i identyczne jak przed
 * restylingiem 2026-09-29 (trafia do Web3Forms jako `subject`, prefill audytu z hero używa
 * `auditOption.value`) - tłumaczymy tylko `label`. Etykiety = nazwy usług z sekcji Oferta
 * (`servicesSectionDict` w lib/i18n/services.ts). Klucze kategorii (`key`) są stabilne,
 * niezależne od języka (kolor kropki kategorii w komponencie).
 */

export interface ServiceOption {
  /** Wartość wysyłana w formularzu - IDENTYCZNA w pl i en (nie tłumaczyć, nie zmieniać). */
  value: string;
  /** Etykieta wyświetlana - tłumaczona. */
  label: string;
}

export interface ServiceCategory {
  /** Stabilny klucz (język-niezależny) - do lookupu koloru kategorii w komponencie. */
  key: string;
  /** Nazwa kategorii wyświetlana - tłumaczona. */
  name: string;
  options: ServiceOption[];
}

export interface ServiceSelectDict {
  label: string;
  placeholder: string;
  requiredMessage: string;
  categories: ServiceCategory[];
  /** Audyt strony - cel uśpionego prefillu z hero (/kontakt/?audyt=...) + zwykła opcja na liście. */
  auditOption: ServiceOption;
  otherOption: ServiceOption;
}

type DayKey = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

export interface KontaktDict {
  /** Etykieta strony (SectionLabel nad h1). */
  label: string;
  /** h1 bez kropki - kropkę w kolorze marki dopisuje komponent (jak kropka w logo "AVENLY."). */
  title: string;
  lead: string;
  info: {
    /** Nagłówek bloku z danymi kontaktu (tylko dla czytników ekranu). */
    heading: string;
    mailLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    /** Skróty dni do godzin pracy z CONTACT.hours ("Mo-Fr 09:00-17:00" → "pon-pt, 9:00-17:00"). */
    days: Record<DayKey, string>;
  };
  form: {
    heading: string;
    meta: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    privacyPrefix: string;
    privacyLink: string;
    privacySuffix: string;
    submit: string;
    submitting: string;
    errors: {
      required: string;
      emailPattern: string;
      messageMin: string;
      privacyRequired: string;
    };
  };
  success: {
    title: string;
    body: string;
    again: string;
  };
  send: {
    serverError: string;
    networkError: string;
  };
  /** Treść wiadomości wstawiana, gdy użytkownik przyszedł z hero z adresem strony ({url}). */
  auditPrefill: string;
  serviceSelect: ServiceSelectDict;
}

export const kontaktDict: Record<Locale, KontaktDict> = {
  pl: {
    label: 'Kontakt',
    title: 'Zacznijmy',
    // twarde spacje (U+00A0) po jednoliterowych słowach i w "24 godzin" - bez sierotek na końcu linii
    lead: 'Strona, sklep czy chatbot AI? Napisz, czego potrzebujesz. W ciągu 24 godzin dostaniesz konkretną odpowiedź, wycenę i termin.',
    info: {
      heading: 'Dane kontaktowe',
      mailLabel: 'E-mail',
      phoneLabel: 'Telefon',
      hoursLabel: 'Godziny pracy',
      days: { Mo: 'pon', Tu: 'wt', We: 'śr', Th: 'czw', Fr: 'pt', Sa: 'sob', Su: 'ndz' },
    },
    form: {
      heading: 'Opowiedz o projekcie',
      meta: '5 pól, około minuty',
      nameLabel: 'Imię i nazwisko',
      emailLabel: 'E-mail',
      phoneLabel: 'Telefon (opcjonalnie)',
      messageLabel: 'Wiadomość',
      messagePlaceholder: 'Kilka zdań o Twojej firmie i o tym, czego potrzebujesz',
      privacyPrefix: 'Akceptuję',
      privacyLink: 'politykę prywatności',
      privacySuffix: '.',
      submit: 'Wyślij wiadomość',
      submitting: 'Wysyłanie…',
      errors: {
        required: 'To pole jest wymagane',
        emailPattern: 'Sprawdź adres e-mail',
        messageMin: 'Napisz co najmniej 10 znaków',
        privacyRequired: 'Zaznacz zgodę, żeby wysłać wiadomość',
      },
    },
    success: {
      title: 'Wiadomość wysłana',
      body: 'Odpowiedź dostaniesz w ciągu 24 godzin. Jeśli jej nie widzisz, zajrzyj do folderu spam.',
      again: 'Wyślij kolejną wiadomość',
    },
    send: {
      serverError: 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.',
      networkError: 'Brak połączenia z internetem. Sprawdź sieć i spróbuj ponownie.',
    },
    auditPrefill: 'Proszę o bezpłatny audyt strony: {url}',
    serviceSelect: {
      label: 'Usługa, która Cię interesuje',
      placeholder: 'Wybierz usługę',
      requiredMessage: 'Wybierz usługę',
      categories: [
        {
          key: 'strony-www',
          name: 'Strony WWW',
          options: [
            { value: 'One-Page', label: 'Strona one-page' },
            { value: 'Strona firmowa', label: 'Strona firmowa' },
            { value: 'Strona Szyta na Miarę', label: 'Strona interaktywna' },
            { value: 'Sklep Internetowy', label: 'Sklep internetowy' },
            { value: 'System CRM i automatyzacje AI', label: 'System CRM i automatyzacje AI' },
          ],
        },
        {
          key: 'ai',
          name: 'Automatyzacja AI',
          options: [
            { value: 'Chatboty AI', label: 'Chatboty AI' },
          ],
        },
      ],
      auditOption: { value: 'Audyt strony', label: 'Audyt wydajności i SEO' },
      otherOption: { value: 'Inne / nie wiem jeszcze', label: 'Coś innego lub jeszcze nie wiem' },
    },
  },
  en: {
    label: 'Contact',
    title: "Let's begin",
    lead: 'Website, online store or AI chatbot? Tell us what you need. Within 24 hours you get a clear answer, a quote and a timeline.',
    info: {
      heading: 'Contact details',
      mailLabel: 'Email',
      phoneLabel: 'Phone',
      hoursLabel: 'Working hours',
      days: { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' },
    },
    form: {
      heading: 'Tell us about your project',
      meta: '5 fields, about a minute',
      nameLabel: 'Full name',
      emailLabel: 'Email',
      phoneLabel: 'Phone (optional)',
      messageLabel: 'Message',
      messagePlaceholder: 'A few sentences about your business and what you need',
      privacyPrefix: 'I accept the',
      privacyLink: 'privacy policy',
      privacySuffix: '.',
      submit: 'Send message',
      submitting: 'Sending…',
      errors: {
        required: 'This field is required',
        emailPattern: 'Check the email address',
        messageMin: 'Write at least 10 characters',
        privacyRequired: 'Tick the consent to send your message',
      },
    },
    success: {
      title: 'Message sent',
      body: 'You get a reply within 24 hours. If you cannot see it, check your spam folder.',
      again: 'Send another message',
    },
    send: {
      serverError: 'Your message could not be sent. Please try again in a moment.',
      networkError: 'No internet connection. Check your network and try again.',
    },
    auditPrefill: 'Please run a free audit of my website: {url}',
    serviceSelect: {
      label: 'Service you are interested in',
      placeholder: 'Select a service',
      requiredMessage: 'Select a service',
      categories: [
        {
          key: 'strony-www',
          name: 'Websites',
          options: [
            { value: 'One-Page', label: 'One page website' },
            { value: 'Strona firmowa', label: 'Company website' },
            { value: 'Strona Szyta na Miarę', label: 'Interactive website' },
            { value: 'Sklep Internetowy', label: 'Online store' },
            { value: 'System CRM i automatyzacje AI', label: 'CRM system and AI automation' },
          ],
        },
        {
          key: 'ai',
          name: 'AI automation',
          options: [
            { value: 'Chatboty AI', label: 'AI chatbots' },
          ],
        },
      ],
      auditOption: { value: 'Audyt strony', label: 'Performance and SEO audit' },
      otherOption: { value: 'Inne / nie wiem jeszcze', label: 'Something else or not sure yet' },
    },
  },
};
