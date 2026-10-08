import type { Locale } from '@/lib/i18n/locale';
import type { CookieCategory } from '@/lib/cookie-consent';

/**
 * Słownik banera zgody na cookies (components/cookie/CookieConsent.tsx).
 *
 * CookieConsent to komponent GLOBALNY ('use client', lazy przez
 * DeferredClientWidgets) - nie dostaje propsów ze stron. Locale wykrywa sam
 * przez localeFromPathname(usePathname()), słownik importuje bezpośrednio.
 *
 * WAŻNE: logika zgody (lib/cookie-consent.ts) jest niezmieniona. Kategorie,
 * ich kolejność i flaga `required` nadal pochodzą z COOKIE_CATEGORIES; tu są
 * TYLKO tłumaczenia tytułu/opisu keyowane po CookieCategory.
 *
 * PL = 1:1 (bajt w bajt) z komponentu i z COOKIE_CATEGORIES.
 * EN = naturalny angielski z poprawną terminologią GDPR
 * (necessary/functional/analytics/marketing), sentence case, bez em/en dashes.
 * Zero JSX.
 *
 * Uwaga: Polityka prywatności ma tylko wersję PL - link w banerze celowo
 * prowadzi do /polityka-prywatnosci w OBU językach (obsłużone w komponencie).
 */

export interface CookieCategoryText {
  title: string;
  desc: string;
}

export interface CookieDict {
  dialogAriaLabel: string;
  title: string;
  /** Tekst przed linkiem do Polityki prywatności (link i kropka w JSX). */
  descriptionBefore: string;
  privacyLinkText: string;
  /** Tekst po linku (kropka kończąca zdanie). */
  descriptionAfter: string;
  categories: Record<CookieCategory, CookieCategoryText>;
  alwaysActive: string;
  rejectAll: string;
  acceptAll: string;
  saveChoice: string;
  customize: string;
  closeAriaLabel: string;
}

export const cookieDict: Record<Locale, CookieDict> = {
  pl: {
    dialogAriaLabel: 'Zgoda na pliki cookies',
    title: 'Szanujemy Twoją prywatność',
    descriptionBefore:
      'Używamy plików cookies, aby strona działała poprawnie, a za Twoją zgodą - również do analityki i marketingu. Szczegóły znajdziesz w',
    privacyLinkText: 'Polityce prywatności',
    descriptionAfter: '.',
    categories: {
      necessary: {
        title: 'Niezbędne',
        desc: 'Wymagane do działania strony: sesja, bezpieczeństwo i zapamiętanie Twojej zgody.',
      },
      functional: {
        title: 'Funkcjonalne',
        desc: 'Zapamiętują Twoje preferencje, np. język czy motyw strony.',
      },
      analytics: {
        title: 'Analityczne',
        desc: 'Pomagają nam zrozumieć, jak korzystasz ze strony (np. Google Analytics).',
      },
      marketing: {
        title: 'Marketingowe',
        desc: 'Pozwalają wyświetlać dopasowane reklamy i mierzyć skuteczność kampanii.',
      },
    },
    alwaysActive: 'Zawsze aktywne',
    rejectAll: 'Odrzuć wszystkie',
    acceptAll: 'Akceptuj wszystkie',
    saveChoice: 'Zapisz wybór',
    customize: 'Dostosuj ustawienia',
    closeAriaLabel: 'Zamknij',
  },
  en: {
    dialogAriaLabel: 'Cookie consent',
    title: 'We respect your privacy',
    descriptionBefore:
      'We use cookies so the site works correctly and, with your consent, also for analytics and marketing. You can find the details in our',
    privacyLinkText: 'Privacy policy',
    descriptionAfter: '.',
    categories: {
      necessary: {
        title: 'Necessary',
        desc: 'Required for the site to work: session, security and remembering your consent.',
      },
      functional: {
        title: 'Functional',
        desc: 'Remember your preferences, such as language or site theme.',
      },
      analytics: {
        title: 'Analytics',
        desc: 'Help us understand how you use the site (for example Google Analytics).',
      },
      marketing: {
        title: 'Marketing',
        desc: 'Allow us to show relevant ads and measure campaign performance.',
      },
    },
    alwaysActive: 'Always on',
    rejectAll: 'Reject all',
    acceptAll: 'Accept all',
    saveChoice: 'Save my choices',
    customize: 'Customize settings',
    closeAriaLabel: 'Close',
  },
};
