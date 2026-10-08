import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik paska pod hero (TechStack, homepage marquee) - 2026-09-24.
 * Konkrety, które dostajesz (głos korzyści, pisownia zdaniowa, bez myślników em - PRODUCT.md).
 * WYŁĄCZNIE fakty z realizacji / oferty: PageSpeed 98/100 = liczba obronna z PRODUCT.md,
 * BLIK = Grawerstwo Kardyś, rezerwacje / zapisy = Mcentrum (Booksy) i RKS, panel do zarządzania
 * firmą = system CRM z oferty i aplikacja klubowa RKS (2026-09-28: zamiast "Panel do samodzielnej
 * edycji" - bez obietnicy CMS, PRODUCT.md "Co obiecujemy w ofercie"),
 * Cloudflare = hosting realizacji, lokalne SEO = Mcentrum. NIE powtarzać faktów z linii dowodów
 * hero (bezpłatnie, odpowiedź w 24 h) ani oceny Google (usunięta 2026-09-28) i NIE dopisywać metryk bez pokrycia
 * (dawne "Uptime 99.9%", "PageSpeed SEO 100").
 */

export interface TechStackDict {
  /** Nazwa paska dla czytników ekranu (sekcja bez widocznego nagłówka). */
  label: string;
  /** Kolejność = ikony ITEM_ICONS w components/sections/TechStack.tsx. */
  items: string[];
}

export const techStackDict: Record<Locale, TechStackDict> = {
  pl: {
    label: 'Co dostajesz',
    items: [
      'Wynik PageSpeed 98/100',
      'Projekt pod telefon od pierwszego szkicu',
      'Sklep z płatnościami BLIK i kartą',
      'Asystent AI, który zna Twoją ofertę',
      'Rezerwacje i zapisy online',
      'Panel do zarządzania firmą',
      'Bezpieczny hosting na Cloudflare',
      'Lokalne SEO w Google',
    ],
  },
  en: {
    label: 'What you get',
    items: [
      'PageSpeed score of 98/100',
      'Designed for phones from the first sketch',
      'An online store with BLIK and card payments',
      'An AI assistant that knows your offer',
      'Online bookings and sign-ups',
      'A panel to run your business',
      'Secure hosting on Cloudflare',
      'Local SEO on Google',
    ],
  },
};
