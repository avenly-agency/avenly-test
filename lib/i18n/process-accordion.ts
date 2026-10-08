import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik akordeonu procesu (components/ProcessAccordion.tsx).
 *
 * Komponent WSPÓŁDZIELONY ('use client', renderowany na wielu podstronach
 * usług przez prop `category`). Locale wykrywa sam przez
 * localeFromPathname(usePathname()), słownik importuje bezpośrednio.
 *
 * Struktura: Record<klucz-kategorii, ProcessStep[]>. Klucze kategorii
 * ('design' | 'automatyzacja-ai' | 'marketing' | 'default') to
 * IDENTYFIKATORY - takie same w PL i EN, NIE tłumaczone (logika aliasów
 * i wybór kategorii zostają w komponencie). Tłumaczone są wyłącznie
 * title/desc każdego kroku.
 *
 * PL = 1:1 (bajt w bajt) z komponentu sprzed ekstrakcji.
 * EN = naturalny angielski wg PRODUCT.md (benefit voice, sentence case,
 * bez em/en dashes). Zero JSX.
 */

export interface ProcessStep {
  title: string;
  desc: string;
}

export type ProcessAccordionDict = Record<string, ProcessStep[]>;

export const processAccordionDict: Record<Locale, ProcessAccordionDict> = {
  pl: {
    // 1. DESIGN (UI/UX)
    'design': [
      { title: "Brief & Inspiracje", desc: "Zbieramy Twoje wymagania i ustalamy kierunek artystyczny marki." },
      { title: "UX & Makiety", desc: "Projektujemy szkice, dbając o intuicyjność i ścieżkę użytkownika." },
      { title: "UI & Prototyping", desc: "Tworzymy finalny, kolorowy projekt w Figmie." },
      { title: "Finalizacja", desc: "Przekazujemy końcowy efekt do potwierdzenia." }
    ],
    // 2. CHATBOT AI / AUTOMATYZACJA
    'automatyzacja-ai': [
      { title: "Analiza & Baza Wiedzy", desc: "Analizujemy Twoją stronę i dokumenty, aby zbudować bazę wiedzy. Definiujemy, czy AI ma sprzedawać, czy wspierać obsługę klienta." },
      { title: "Prompt Engineering", desc: "Projektujemy 'mózg' asystenta. Ustawiamy Rolę i instrukcje systemowe, aby chatbot brzmiał jak ekspert Twojej marki." },
      { title: "Integracja Webflow", desc: "Wdrażamy chatbota na Twoją stronę dzięki Voiceflow. Stylizujemy okno czatu, aby idealnie pasowało do Twojego designu." },
      { title: "Leady & Automatyzacja", desc: "Podpinamy zewnętrzne systemy i aplikacje, dzięki czemu chatbot nie tylko rozmawia, ale automatycznie zapisuje leady i umawia spotkania." }
    ],
    // 3. MARKETING I SPRZEDAŻ (ZMIENIONY 4 PUNKT)
    'marketing': [
      { title: "Audyt & Dane", desc: "Przeprowadzamy głęboką analizę widoczności (SEO), konkurencji i obecnego ruchu. Znajdujemy techniczne błędy, które blokują Twoje wzrosty." },
      { title: "Strategia & Content", desc: "Opracowujemy plan naprawczy oraz strategię treści opartą na słowach kluczowych, których realnie szukają Twoi klienci." },
      { title: "Optymalizacja", desc: "Wdrażamy zmiany w kodzie i treściach. Przyspieszamy stronę, poprawiamy indeksowanie i strukturę linków." },
      { title: "Skalowanie & Wyniki", desc: "Nie kończymy na wdrożeniu. Stale monitorujemy dane, optymalizujemy konwersję i zwiększamy zasięgi tam, gdzie przynoszą największy zysk." }
    ],
    // 4. STRONY WWW (DEFAULT)
    'default': [
      { title: "Strategia & UX", desc: "Nie zaczynamy od kodu. Najpierw projektujemy strukturę (Sitemap) i makiety, które prowadzą użytkownika prosto do celu (konwersji)." },
      { title: "Dev & CMS", desc: "Kodujemy stronę w Next.js lub wdrażamy na Webflow. Jest ultra-szybka, a Ty zarządzasz treścią przez intuicyjny panel." },
      { title: "SEO & Performance", desc: "Optymalizujemy Core Web Vitals. Twoja strona ładuje się błyskawicznie, jest bezpieczna i gotowa na wysokie pozycje w Google." },
      { title: "Wdrożenie & Analityka", desc: "Podpinamy domeny, konfigurujemy GA4 do śledzenia ruchu i szkolimy Twój zespół z obsługi strony." }
    ]
  },
  en: {
    // 1. DESIGN (UI/UX)
    'design': [
      { title: "Brief & inspiration", desc: "We gather your requirements and set the artistic direction for your brand." },
      { title: "UX & wireframes", desc: "We design the layouts, focusing on intuitive flow and the user journey." },
      { title: "UI & prototyping", desc: "We build the final, full-color design in Figma." },
      { title: "Handover", desc: "We hand the finished result over for your approval." }
    ],
    // 2. CHATBOT AI / AUTOMATYZACJA
    'automatyzacja-ai': [
      { title: "Analysis & knowledge base", desc: "We analyze your site and documents to build the knowledge base. We define whether the AI should sell or support your customer service." },
      { title: "Prompt engineering", desc: "We design the assistant's 'brain'. We set the role and system instructions so the chatbot sounds like an expert on your brand." },
      { title: "Website integration", desc: "We deploy the chatbot on your site with Voiceflow. We style the chat window so it fits your design perfectly." },
      { title: "Leads & automation", desc: "We connect external systems and apps, so the chatbot doesn't just talk, it automatically captures leads and books meetings." }
    ],
    // 3. MARKETING I SPRZEDAŻ (ZMIENIONY 4 PUNKT)
    'marketing': [
      { title: "Audit & data", desc: "We run a deep analysis of your visibility (SEO), competitors and current traffic. We find the technical issues holding your growth back." },
      { title: "Strategy & content", desc: "We build a recovery plan and a content strategy based on the keywords your customers actually search for." },
      { title: "Optimization", desc: "We implement changes in the code and content. We speed up your site and improve indexing and link structure." },
      { title: "Scaling & results", desc: "We don't stop at launch. We keep monitoring the data, optimizing conversion and growing reach where it brings the most profit." }
    ],
    // 4. STRONY WWW (DEFAULT)
    'default': [
      { title: "Strategy & UX", desc: "We don't start with code. First we design the structure (sitemap) and wireframes that guide users straight to the goal (conversion)." },
      { title: "Dev & CMS", desc: "We build your site in Next.js or deploy it on Webflow. It's ultra-fast, and you manage the content through an intuitive panel." },
      { title: "SEO & performance", desc: "We optimize Core Web Vitals. Your site loads instantly, stays secure and is ready to rank high in Google." },
      { title: "Launch & analytics", desc: "We connect the domains, configure GA4 to track traffic and train your team to run the site." }
    ]
  }
};
