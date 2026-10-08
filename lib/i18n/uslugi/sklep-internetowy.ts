import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik podstrony /uslugi/strony-www/sklep-internetowy.
 * Wzorzec jak lib/i18n/home/hero.ts:
 * - interface ShopDict = same stringi (JSX/ikony/klasy/shadery zostają w komponencie),
 * - PL = tekst 1:1 z ShopClient.tsx sprzed ekstrakcji (bajt w bajt),
 * - EN = benefit voice wg PRODUCT.md (sentence case, bez em/en dashes,
 *   zero fabrykowanych metryk, ceny/waluta w makiecie zostają w PLN).
 * Import WYŁĄCZNIE w server page - słownik wędruje do klienta jako props.
 */

export interface ShopDict {
  // ── HERO ──
  heroBadge: string;
  heroH1Line1: string;
  heroH1Accent: string;
  heroLead: string;

  // ── MAKIETA: pasek adresu przeglądarki (4 fazy) ──
  urlShop: string;
  urlCart: string;
  urlCheckout: string;
  urlConfirm: string;

  // ── MAKIETA: navbar sklepu ──
  navCart: string;

  // ── MAKIETA FAZA 1: produkty ──
  promoBanner: string;
  newBadge: string;
  collectionTitle: string;
  collectionDesc: string;
  shopNow: string;
  lookbook: string;
  bestsellers: string;
  seeAll: string;
  productLabel: string;
  addToCart: string;
  view: string;
  trustBadges: string[]; // 4

  // ── MAKIETA FAZA 2: koszyk ──
  yourCart: string;
  sizeQty: string;
  summary: string;
  total: string;
  goToCheckout: string;

  // ── MAKIETA FAZA 3: checkout ──
  delivery: string;
  cardPayment: string;
  pay: string;
  yourOrder: string;

  // ── MAKIETA FAZA 4: potwierdzenie ──
  thankYou: string;
  orderNumber: string;
  confirmRows: [string, string][]; // [label, value]
  trackShipment: string;

  // ── MAKIETA: wskaźnik scrolla ──
  scrollHint: string;

  // ── SEKCJA: dwa podejścia ──
  foundationBadge: string;
  scaleTitleLead: string;
  scaleTitleAccent: string;
  scaleDesc: string;
  headlessTitle: string;
  recommended: string;
  headlessChips: string[];
  wooTitle: string;
  wooChips: string[];
  askAiCta: string;

  // ── SEKCJA: bento ──
  bentoTitle: string;
  bentoDesc: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  card4Title: string;
  card4Desc: string;
  card4Link: string;

  // ── SEKCJA: zakres prac ──
  scopeBadge: string;
  scopeTitleLead: string;
  scopeTitleAccent: string;
  scopeDesc: string;
  scopeCards: { title: string; desc: string }[]; // 6

  // ── SEKCJA: CTA card ──
  ctaSlotBadge: string;
  ctaTitleLead: string;
  ctaTitleAccent: string;
  ctaDesc: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const shopDict: Record<Locale, ShopDict> = {
  pl: {
    heroBadge: 'Headless Commerce / WooCommerce',
    heroH1Line1: 'Sprzedawaj online',
    heroH1Accent: 'bez ograniczeń.',
    heroLead:
      'Sklep, w którym klient kupuje łatwo, a Ty rośniesz bez limitów. Dobierzemy rozwiązanie dokładnie pod Twój budżet i plany na przyszłość.',

    urlShop: 'twoj-sklep.pl',
    urlCart: 'twoj-sklep.pl/koszyk',
    urlCheckout: 'twoj-sklep.pl/checkout',
    urlConfirm: 'twoj-sklep.pl/zamowienie/ok',

    navCart: 'Koszyk',

    promoBanner: 'Darmowa dostawa od 200 zł • Zwroty 30 dni',
    newBadge: 'Nowość',
    collectionTitle: 'Letnia kolekcja 2026',
    collectionDesc: 'Odkryj nowości w niższych cenach - darmowa dostawa już dziś.',
    shopNow: 'Kupuj teraz',
    lookbook: 'Lookbook',
    bestsellers: 'Bestsellery',
    seeAll: 'Zobacz wszystkie →',
    productLabel: 'Produkt',
    addToCart: 'Do koszyka',
    view: 'Zobacz',
    trustBadges: ['Wysyłka 24h', 'Zwroty 30 dni', 'Płatność BLIK', 'Wsparcie 7/7'],

    yourCart: 'Twój koszyk',
    sizeQty: 'Rozmiar M • Ilość 1',
    summary: 'Podsumowanie',
    total: 'Razem',
    goToCheckout: 'Przejdź do kasy',

    delivery: 'Dostawa',
    cardPayment: 'Płatność kartą',
    pay: 'Zapłać 129 zł',
    yourOrder: 'Twoje zamówienie',

    thankYou: 'Dziękujemy za zakup!',
    orderNumber: 'Zamówienie #2026-0042',
    confirmRows: [
      ['Numer zamówienia', '#2026-0042'],
      ['Płatność', 'BLIK'],
      ['Dostawa', 'Paczkomat'],
    ],
    trackShipment: 'Śledź przesyłkę',

    scrollHint: 'Scrolluj, aby odkryć',

    foundationBadge: 'Fundament sklepu',
    scaleTitleLead: 'Gotowy na ',
    scaleTitleAccent: 'każdą skalę',
    scaleDesc:
      'Niezależnie od tego, jak szybko rośniesz, Twój sklep nadąża - ładuje się błyskawicznie i obsługuje każdy ruch.',
    headlessTitle: 'Headless E-commerce',
    recommended: 'Rekomendowane',
    headlessChips: [
      'Next.js + Stripe',
      'PageSpeed 95-99',
      'Sanity Studio',
      'Custom UX bez limitów',
      '5× szybszy frontend',
      'Skalowalność',
      'Headless API',
      'Premium design',
    ],
    wooTitle: 'WooCommerce',
    wooChips: [
      'Panel WP Admin',
      'Szybkie wdrożenie 3-4 tyg',
      'Setki wtyczek',
      'Niższy koszt startu',
      'BLIK / karty',
      'InPost / DPD',
      'Motyw + customizacja',
      'Sam edytujesz produkty',
      'Integracje z hurtowniami',
    ],
    askAiCta: 'Nie wiesz która opcja? Zapytaj Avenly AI',

    bentoTitle: 'Sklep, który nie gubi klienta',
    bentoDesc:
      'Od pierwszego kliknięcia po finalizację usuwamy każdą przeszkodę między klientem a zakupem.',
    card1Title: 'Płatność w jedno kliknięcie',
    card1Desc:
      'Twój klient płaci od razu - BLIK, karty, Apple Pay czy Google Pay, bez rejestracji i barier.',
    card2Title: 'Wysyłka pod kontrolą',
    card2Desc:
      'Klient wybiera sposób dostawy, a zamówienie z adresem od razu widzisz w panelu.',
    card3Title: 'Zakupy na telefonie',
    card3Desc:
      'Większość zakupów dzieje się na smartfonie. Zyskujesz ścieżkę dopasowaną pod kciuk - szybką i bezbłędną.',
    card4Title: 'Wiesz, co podnosi sprzedaż',
    card4Desc:
      'Śledzisz porzucone koszyki i odzyskujesz klientów automatycznymi mailami. Więcej danych, mniej strat.',
    card4Link: 'Zacznijmy',

    scopeBadge: 'Zakres prac',
    scopeTitleLead: 'Co dokładnie ',
    scopeTitleAccent: 'otrzymujesz?',
    scopeDesc: 'Sklep gotowy do sprzedaży od pierwszego dnia.',
    scopeCards: [
      {
        title: 'Projekt graficzny sklepu',
        desc: 'Spójny, markowy wygląd dopasowany do Twojego brandu - karty produktów, strona główna, checkout.',
      },
      {
        title: 'Konfiguracja katalogu',
        desc: 'Dodawanie produktów, kategorii, atrybutów (rozmiary, kolory), wariantów i zdjęć w wysokiej jakości.',
      },
      {
        title: 'Bramki płatności',
        desc: 'Pełna integracja Przelewy24 lub Stripe - BLIK, karty, Apple Pay, Google Pay, płatności odroczone.',
      },
      {
        title: 'Dostawa',
        desc: 'Kurier, paczkomat albo odbiór osobisty, z kosztem dostawy doliczanym w koszyku.',
      },
      {
        title: 'Optymalizacja konwersji',
        desc: 'Szybki checkout bez rejestracji, cross-sell, porzucone koszyki, promocje i kupony rabatowe.',
      },
      {
        title: 'Wdrożenie i szkolenie',
        desc: 'Publikacja sklepu, konfiguracja hostingu, SSL i panel administracyjny - prowadzisz sklep samodzielnie.',
      },
    ],

    ctaSlotBadge: 'Wolny termin w tym miesiącu',
    ctaTitleLead: 'Gotowy na cyfrową ',
    ctaTitleAccent: 'Dominację?',
    ctaDesc:
      'Zbudujmy sklep, który zarabia od pierwszego dnia. Darmowa konsultacja, zero zobowiązań.',
    ctaPrimary: 'Bezpłatna konsultacja',
    ctaSecondary: 'Napisz do nas',
  },
  en: {
    heroBadge: 'Headless Commerce / WooCommerce',
    heroH1Line1: 'Sell online',
    heroH1Accent: 'without limits.',
    heroLead:
      'A store where customers buy with ease and you grow without limits. We match the solution precisely to your budget and your plans for the future.',

    urlShop: 'your-store.com',
    urlCart: 'your-store.com/cart',
    urlCheckout: 'your-store.com/checkout',
    urlConfirm: 'your-store.com/order/ok',

    navCart: 'Cart',

    promoBanner: 'Free delivery over 200 zł • 30 day returns',
    newBadge: 'New',
    collectionTitle: 'Summer collection 2026',
    collectionDesc: 'Discover new arrivals at lower prices, with free delivery today.',
    shopNow: 'Shop now',
    lookbook: 'Lookbook',
    bestsellers: 'Bestsellers',
    seeAll: 'See all →',
    productLabel: 'Product',
    addToCart: 'Add to cart',
    view: 'View',
    trustBadges: ['24h shipping', '30 day returns', 'BLIK payment', 'Support 7/7'],

    yourCart: 'Your cart',
    sizeQty: 'Size M • Qty 1',
    summary: 'Summary',
    total: 'Total',
    goToCheckout: 'Go to checkout',

    delivery: 'Delivery',
    cardPayment: 'Card payment',
    pay: 'Pay 129 zł',
    yourOrder: 'Your order',

    thankYou: 'Thank you for your purchase!',
    orderNumber: 'Order #2026-0042',
    confirmRows: [
      ['Order number', '#2026-0042'],
      ['Payment', 'BLIK'],
      ['Delivery', 'Parcel locker'],
    ],
    trackShipment: 'Track shipment',

    scrollHint: 'Scroll to explore',

    foundationBadge: 'Store foundation',
    scaleTitleLead: 'Ready for ',
    scaleTitleAccent: 'any scale',
    scaleDesc:
      'No matter how fast you grow, your store keeps up. It loads instantly and handles every visit.',
    headlessTitle: 'Headless E-commerce',
    recommended: 'Recommended',
    headlessChips: [
      'Next.js + Stripe',
      'PageSpeed 95-99',
      'Sanity Studio',
      'Custom UX without limits',
      '5× faster frontend',
      'Scalability',
      'Headless API',
      'Premium design',
    ],
    wooTitle: 'WooCommerce',
    wooChips: [
      'WP Admin panel',
      'Fast launch in 3-4 weeks',
      'Hundreds of plugins',
      'Lower startup cost',
      'BLIK / cards',
      'InPost / DPD',
      'Theme + customization',
      'Edit products yourself',
      'Wholesaler integrations',
    ],
    askAiCta: 'Not sure which option? Ask Avenly AI',

    bentoTitle: 'A store that never loses a customer',
    bentoDesc:
      'From the first click to checkout, we remove every obstacle between the customer and the purchase.',
    card1Title: 'Payment in one click',
    card1Desc:
      'Your customer pays right away with BLIK, cards, Apple Pay or Google Pay, no registration and no barriers.',
    card2Title: 'Shipping under control',
    card2Desc:
      'The customer picks how to receive the order, and you see it with the delivery address right away in your panel.',
    card3Title: 'Shopping on mobile',
    card3Desc:
      'Most purchases happen on a smartphone. You get a thumb friendly path that is fast and flawless.',
    card4Title: 'You know what drives sales',
    card4Desc:
      'You track abandoned carts and win customers back with automatic emails. More data, fewer losses.',
    card4Link: "Let's start",

    scopeBadge: 'Scope of work',
    scopeTitleLead: 'What exactly ',
    scopeTitleAccent: 'do you get?',
    scopeDesc: 'A store ready to sell from day one.',
    scopeCards: [
      {
        title: 'Store visual design',
        desc: 'A consistent, on brand look tailored to your brand: product cards, home page, checkout.',
      },
      {
        title: 'Catalog setup',
        desc: 'Adding products, categories, attributes (sizes, colors), variants and high quality images.',
      },
      {
        title: 'Payment gateways',
        desc: 'Full Przelewy24 or Stripe integration: BLIK, cards, Apple Pay, Google Pay, deferred payments.',
      },
      {
        title: 'Delivery',
        desc: 'Courier, parcel locker or personal pickup, with the delivery cost added in the cart.',
      },
      {
        title: 'Conversion optimization',
        desc: 'Fast checkout without registration, cross sell, abandoned carts, promotions and discount coupons.',
      },
      {
        title: 'Launch and training',
        desc: 'Store launch, hosting setup, SSL and the admin panel, so you run the store yourself.',
      },
    ],

    ctaSlotBadge: 'A free slot this month',
    ctaTitleLead: 'Ready for digital ',
    ctaTitleAccent: 'Dominance?',
    ctaDesc:
      "Let's build a store that earns from day one. Free consultation, no obligations.",
    ctaPrimary: 'Free consultation',
    ctaSecondary: 'Message us',
  },
};

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════
// NOWA PODSTRONA (przebudowa 2026-10, praca równoległa etap 3 - chat 10; wzorzec: lib/i18n/uslugi/one-page.ts).
// `shopDict` wyżej = PIERWOTNA wersja podstrony - zostaje jako ŹRÓDŁO TEKSTÓW (decyzja właściciela 2026-10-02:
// „copywriting niech biorą z pierwotnych wersji stron”), nieimportowany; usuwa go koordynator po zamknięciu podstrony.
// Skąd teksty `shopCopy`:
//   - nagłówek, karty „Sklep, który nie gubi klienta”, „Gotowy na każdą skalę”, zakres - 1:1 ze `shopDict`,
//   - zmienione tylko to, co musi (tabela „było → jest” w docs/podstrony/usluga-sklep-internetowy.md): bez WooCommerce /
//     Headless, bez „InPost / DPD”, bez Apple Pay / Google Pay / płatności odroczonych (niepotwierdzone), bez
//     wymyślonych liczb, panel = zamówienia w jednym panelu (nie CMS), przycisk „Bezpłatna konsultacja”,
//   - podpisy kroków zakupu = scenka z Oferty na stronie głównej (zaakceptowane 2026-09-28),
//   - zakończenie = wspólne dla podstron usług (słowa właściciela), z jednym słowem zmienionym („sklep”).
// Przykładowy sklep w kadrze („twoj-sklep.pl”): napisy mówią, co stoi w danym miejscu - to przykład, nie obietnice
// Avenly (bez „Darmowa dostawa od 200 zł”, „Zwroty 30 dni”, „Wysyłka 24h” z pierwotnej makiety).
// TERMIN realizacji: do potwierdzenia przez właściciela - do tego czasu na linii wymiarowej stoi obronny fakt
// („wycena i termin w 24 h”), nie liczba dni.
// PL: twarde spacje dokłada `typo()`. Import w server page; słownik wędruje do klienta jako props.

export interface ShopBrandCopy {
  /** Nazwa branży na przełączniku marek. */
  name: string;
  wordmark: string; nav: string[]; eyebrow: string; product: string; text: string;
  colorLabel: string; colors: string[]; sizeLabel: string; sizes: string[];
  /** Cztery pozycje spisu kolekcji (pierwsza = produkt główny). */
  items: string[]; index: string;
}

export interface ShopCopy {
  /** Nagłówek: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). */
  head: { title: string; lead: string; cta: string; proof: string[] };
  /** Przykładowy sklep klienta w kadrze - mini sklep, który da się kliknąć (wariant, rozmiar, ilość, dostawa, płatność).
      `brands` = marka przykładowego sklepu (jedna: ceramika - decyzja właściciela 2026-10-02).
      `gate` = strona operatora płatności (Przelewy24 dla BLIK-a, Stripe dla karty) - klient płaci u operatora,
      nie w sklepie (właściciel 2026-10-02: „bezpośrednio w sklepie nie podaje się kodu, tylko przekierowuje”). */
  store: {
    domain: string; sample: string; cart: string; brands: ShopBrandCopy[];
    addToCart: string; inCart: string; seeAll: string;
    yourCart: string; qty: string; less: string; more: string; items: string; delivery: string; deliveryLater: string; total: string; goToCheckout: string;
    ship: { name: string; note: string }[]; payment: string; pays: string[]; payNote: string; pay: string;
    yourOrder: string; thankYou: string; order: string; rows: string[]; mail: string; back: string;
    coupon: string; couponCode: string; discount: string; pickup: string;
    gate: { secure: string; domains: string[]; operators: string[]; to: string; amount: string; blik: string; card: string[]; confirm: string; accepted: string; returning: string };
  };
  /** Panel właściciela sklepu („zamówienia w jednym panelu”). */
  panel: {
    domain: string; sample: string; brand: string; title: string; menu: string[]; newOrders: string; toShip: string;
    cols: string[]; statuses: string[]; customers: string[]; mark: string; address: string; older: string;
  };
  /** Scena 1 (zakup): nazwy miejsc w pasku adresu, podpisy kroków, podpowiedź o klikaniu, powiadomienie właściciela,
      podpisy dwóch ekranów (propozycja „Dwa ekrany”) i stacji (propozycja „Taśma”). */
  buy: {
    states: string[]; stepsAria: string; steps: string[]; hint: string; frameAria: string;
    noteTitle: string; noteTime: string; noteMsg: string;
    duo: string[]; stations: string[]; chips: string[];
  };
  /** Sekcja „Nie szablon. Twoja marka.” - pięć propozycji (runda 4): zdania narratora scen „Na tle szablonów” (crowd)
      i „Zbliżenia” (zoom), warstwy projektu („Warstwy”), zestaw marki do klikania („Zestaw marki”), suwak. */
  brand: { title: string; titleAccent: string; lead: string; stepsAria: string; crowd: string[] };
  /** Sekcja „Sklep, który nie gubi klienta”: stos czterech kart z rysunkami (wybór właściciela 2026-10-02). */
  cases: {
    title: string; titleAccent: string; lead: string;
    items: { tag: string; title: string; text: string; caption: string }[];
  };
  /** Scena panelu nocą: to samo zamówienie oczami właściciela sklepu. */
  night: { title: string; titleAccent: string; lead: string; stepsAria: string; steps: string[]; from: string; to: string; hint: string };
  /** Zakres: lista + pokaz w kadrze. */
  scope: { title: string; titleAccent: string; lead: string; items: { title: string; text: string }[]; termLabel: string; termValue: string };
  ending: { title: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd („i w”)
      .replace(/(\d) (h|s|g|kg|ml|zł|dni|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2')
      .replace(/ - /g, '\u00a0- ') /* wiersz nie zaczyna się od myślnika */ as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_COPY: ShopCopy = {
  head: {
    title: 'Sprzedawaj online bez ograniczeń',
    lead: 'Sklep, w którym klient kupuje łatwo, a Ty rośniesz bez limitów.',
    cta: 'Bezpłatna konsultacja',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
  },
  store: {
    domain: 'twoj-sklep.pl',
    sample: 'Przykładowy sklep',
    cart: 'Koszyk',
    brands: [
      {
        name: 'Ceramika', wordmark: 'Twoja marka', nav: ['Kolekcja', 'Pracownia', 'Kontakt'],
        eyebrow: 'Nowość w kolekcji', product: 'Wazon 01', text: 'Kamionka toczona ręcznie, szkliwo matowe.',
        colorLabel: 'Szkliwo', colors: ['Terakota', 'Oliwka', 'Kość'], sizeLabel: 'Rozmiar', sizes: ['S', 'M', 'L'],
        items: ['Wazon 01', 'Butla 02', 'Misa 03', 'Kubek 04'], index: 'Kolekcja',
      },
    ],
    addToCart: 'Do koszyka',
    inCart: 'W koszyku',
    seeAll: 'Zobacz wszystkie',
    yourCart: 'Twój koszyk',
    qty: 'Ilość',
    less: 'Mniej',
    more: 'Więcej',
    items: 'Produkty',
    delivery: 'Dostawa',
    deliveryLater: 'w następnym kroku',
    total: 'Razem',
    goToCheckout: 'Przejdź do kasy',
    ship: [
      { name: 'Kurier', note: 'pod drzwi' },
      { name: 'Paczkomat', note: 'odbiór w automacie' },
    ],
    payment: 'Płatność',
    pays: ['BLIK', 'Karta'],
    payNote: 'Zapłacisz na bezpiecznej stronie',
    pay: 'Zapłać',
    yourOrder: 'Twoje zamówienie',
    thankYou: 'Dziękujemy za zakup!',
    order: 'Zamówienie',
    rows: ['Numer zamówienia', 'Płatność', 'Dostawa'],
    mail: 'Potwierdzenie czeka w Twojej skrzynce.',
    back: 'Wróć do sklepu',
    coupon: 'Kod rabatowy',
    couponCode: 'LATO10',
    discount: 'Rabat',
    pickup: 'Odbiór osobisty',
    gate: {
      secure: 'Bezpieczna płatność',
      domains: ['secure.przelewy24.pl', 'checkout.stripe.com'],
      operators: ['Przelewy24', 'Stripe'],
      to: 'Odbiorca',
      amount: 'Do zapłaty',
      blik: 'Kod BLIK',
      card: ['Numer karty', 'Ważna do', 'CVV'],
      confirm: 'Płacę',
      accepted: 'Płatność przyjęta',
      returning: 'Wracasz do sklepu',
    },
  },
  panel: {
    domain: 'twoj-sklep.pl/panel',
    sample: 'Przykładowy panel',
    brand: 'Panel sklepu',
    title: 'Zamówienia',
    menu: ['Zamówienia', 'Płatności', 'Wysyłka'],
    newOrders: 'Nowe zamówienia',
    toShip: 'Do wysłania',
    cols: ['Numer', 'Godzina', 'Klient', 'Dostawa', 'Kwota', 'Status'],
    statuses: ['Opłacone', 'Spakowane', 'Wysłane'],
    customers: ['Marta K.', 'Piotr W.', 'Anna S.', 'Tomasz L.', 'Ewa M.'],
    mark: 'Oznacz jako wysłane',
    address: 'ul. Twoja 1, Twoje miasto',
    older: 'Wczoraj',
  },
  buy: {
    states: ['Produkt', 'Koszyk', 'Dostawa', 'Płatność', 'Zamówienie'],
    stepsAria: 'Jak klient kupuje w Twoim sklepie',
    // jedno zdanie na akt sceny (narrator: w danej chwili widać tylko bieżące) - akty 0-4 z buy.tsx
    steps: [
      'Klient wybiera produkt i wrzuca go do koszyka.',
      'Sprawdza koszyk i przechodzi do kasy.',
      'Wybiera dostawę i sposób płatności.',
      'Płaci na bezpiecznej stronie Przelewy24 albo Stripe.',
      'Wraca z potwierdzeniem, a Ty masz nowe zamówienie.',
    ],
    hint: 'Ten sklep działa. Wybierz szkliwo i dodaj do koszyka.',
    frameAria: 'Przykładowy sklep, który możesz wypróbować',
    noteTitle: 'Nowe zamówienie',
    noteTime: 'przed chwilą',
    noteMsg: 'opłacone',
    duo: ['Twój klient', 'Ty'],
    stations: ['Produkt', 'Koszyk', 'Dostawa', 'Płatność', 'Paczka', 'Twój panel'],
    chips: ['W koszyku', 'Opłacone', 'Wysłane'],
  },
  brand: {
    title: 'Nie szablon.',
    titleAccent: 'Twoja marka.',
    lead: 'Spójny, markowy wygląd dopasowany do Twojego brandu - karty produktów, strona główna, checkout.',
    stepsAria: 'Co odróżnia sklep szyty pod markę od szablonu',
    crowd: [
      'Sklep z szablonu wygląda jak tysiące innych.',
      'Twój od pierwszego spojrzenia wygląda jak Twoja marka.',
      'Krój, kolory i układ projektujemy pod Twój produkt.',
    ],
  },
  cases: {
    title: 'Sklep, który nie gubi',
    titleAccent: 'klienta.',
    lead: 'Od pierwszego kliknięcia po finalizację usuwamy każdą przeszkodę między klientem a zakupem.',
    items: [
      { tag: 'Płatność', title: 'Płatność w jedno kliknięcie', text: 'Twój klient płaci od razu - BLIK-iem lub kartą, bez rejestracji i barier.', caption: 'Klient płaci na stronie Przelewy24 albo Stripe i wraca z potwierdzeniem.' },
      { tag: 'Wysyłka', title: 'Wysyłka pod kontrolą', text: 'Klient wybiera sposób dostawy, a zamówienie z adresem od razu widzisz w panelu.', caption: 'Kurier albo paczkomat, a adres trafia prosto do panelu.' },
      { tag: 'Telefon', title: 'Zakupy na telefonie', text: 'Większość zakupów dzieje się na smartfonie. Zyskujesz ścieżkę dopasowaną pod kciuk - szybką i bezbłędną.', caption: 'Przycisk „Do koszyka” zawsze pod kciukiem.' },
      { tag: 'Sprzedaż', title: 'Wiesz, co podnosi sprzedaż', text: 'Śledzisz porzucone koszyki i odzyskujesz klientów automatycznymi mailami. Więcej danych, mniej strat.', caption: 'Porzucony koszyk wraca do klienta mailem.' },
    ],
  },
  night: {
    title: 'Gotowy na',
    titleAccent: 'każdą skalę.',
    lead: 'Niezależnie od tego, jak szybko rośniesz, Twój sklep nadąża - ładuje się błyskawicznie i obsługuje każdy ruch.',
    stepsAria: 'Jak wygląda sklep od strony właściciela',
    steps: [
      'Sklep sprzedaje także wtedy, gdy Ty odpoczywasz.',
      'Rano wszystkie zamówienia czekają w jednym panelu.',
      'Pakujesz paczkę i jednym kliknięciem oznaczasz wysyłkę.',
    ],
    from: '22:00',
    to: '8:00',
    hint: 'Kliknij status, żeby go zmienić.',
  },
  scope: {
    title: 'Co dokładnie',
    titleAccent: 'otrzymujesz?',
    lead: 'Sklep gotowy do sprzedaży od pierwszego dnia.',
    items: [
      { title: 'Projekt graficzny sklepu', text: 'Spójny, markowy wygląd dopasowany do Twojego brandu - karty produktów, strona główna, checkout.' },
      { title: 'Konfiguracja katalogu', text: 'Dodawanie produktów, kategorii, atrybutów (rozmiary, kolory), wariantów i zdjęć w wysokiej jakości.' },
      { title: 'Optymalizacja konwersji', text: 'Szybki checkout bez rejestracji, cross-sell, porzucone koszyki, promocje i kupony rabatowe.' },
      { title: 'Dostawa', text: 'Kurier, paczkomat albo odbiór osobisty, z kosztem dostawy doliczanym w koszyku.' },
      { title: 'Bramki płatności', text: 'Pełna integracja Przelewy24 lub Stripe - BLIK i karty.' },
      { title: 'Wdrożenie i szkolenie', text: 'Publikacja sklepu, konfiguracja hostingu, SSL i panel, w którym widzisz wszystkie zamówienia.' },
    ],
    termLabel: 'Wycena i termin',
    termValue: 'w 24 h',
  },
  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy sklep do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_COPY: ShopCopy = {
  head: {
    title: 'Sell online without limits',
    lead: 'A store where customers buy with ease and you grow without limits.',
    cta: 'Free consultation',
    proof: ['Free', 'no strings attached', 'reply within 24 h'],
  },
  store: {
    domain: 'your-store.com',
    sample: 'Sample store',
    cart: 'Cart',
    brands: [
      {
        name: 'Ceramics', wordmark: 'Your brand', nav: ['Collection', 'Studio', 'Contact'],
        eyebrow: 'New in the collection', product: 'Vase 01', text: 'Hand thrown stoneware with a matte glaze.',
        colorLabel: 'Glaze', colors: ['Terracotta', 'Olive', 'Bone'], sizeLabel: 'Size', sizes: ['S', 'M', 'L'],
        items: ['Vase 01', 'Bottle 02', 'Bowl 03', 'Cup 04'], index: 'Collection',
      },
    ],
    addToCart: 'Add to cart',
    inCart: 'In cart',
    seeAll: 'See all',
    yourCart: 'Your cart',
    qty: 'Qty',
    less: 'Less',
    more: 'More',
    items: 'Products',
    delivery: 'Delivery',
    deliveryLater: 'in the next step',
    total: 'Total',
    goToCheckout: 'Go to checkout',
    ship: [
      { name: 'Courier', note: 'to your door' },
      { name: 'Parcel locker', note: 'pick up at a locker' },
    ],
    payment: 'Payment',
    pays: ['BLIK', 'Card'],
    payNote: 'You will pay on the secure page of',
    pay: 'Pay',
    yourOrder: 'Your order',
    thankYou: 'Thank you for your purchase!',
    order: 'Order',
    rows: ['Order number', 'Payment', 'Delivery'],
    mail: 'The confirmation is waiting in your inbox.',
    back: 'Back to the store',
    coupon: 'Discount code',
    couponCode: 'SUMMER10',
    discount: 'Discount',
    pickup: 'Personal pickup',
    gate: {
      secure: 'Secure payment',
      domains: ['secure.przelewy24.pl', 'checkout.stripe.com'],
      operators: ['Przelewy24', 'Stripe'],
      to: 'Merchant',
      amount: 'To pay',
      blik: 'BLIK code',
      card: ['Card number', 'Valid thru', 'CVV'],
      confirm: 'Pay',
      accepted: 'Payment accepted',
      returning: 'Returning to the store',
    },
  },
  panel: {
    domain: 'your-store.com/panel',
    sample: 'Sample panel',
    brand: 'Store panel',
    title: 'Orders',
    menu: ['Orders', 'Payments', 'Shipping'],
    newOrders: 'New orders',
    toShip: 'To ship',
    cols: ['Number', 'Time', 'Customer', 'Delivery', 'Amount', 'Status'],
    statuses: ['Paid', 'Packed', 'Shipped'],
    customers: ['Martha K.', 'Peter W.', 'Anna S.', 'Thomas L.', 'Eve M.'],
    mark: 'Mark as shipped',
    address: '1 Your Street, Your City',
    older: 'Yesterday',
  },
  buy: {
    states: ['Product', 'Cart', 'Delivery', 'Payment', 'Order'],
    stepsAria: 'How a customer buys in your store',
    steps: [
      'Your customer picks a product and drops it into the cart.',
      'They check the cart and go to checkout.',
      'They choose delivery and a payment method.',
      'They pay on the secure Przelewy24 or Stripe page.',
      'They come back with a confirmation and you have a new order.',
    ],
    hint: 'This store works. Pick a glaze and add it to the cart.',
    frameAria: 'A sample store you can try out',
    noteTitle: 'New order',
    noteTime: 'just now',
    noteMsg: 'paid',
    duo: ['Your customer', 'You'],
    stations: ['Product', 'Cart', 'Delivery', 'Payment', 'Parcel', 'Your panel'],
    chips: ['In cart', 'Paid', 'Shipped'],
  },
  brand: {
    title: 'Not a template.',
    titleAccent: 'Your brand.',
    lead: 'A consistent, on brand look tailored to your brand: product cards, home page, checkout.',
    stepsAria: 'What sets a brand built store apart from a template',
    crowd: [
      'A template store looks like thousands of others.',
      'Yours looks like your brand from the first glance.',
      'We design the type, colors and layout around your product.',
    ],
  },
  cases: {
    title: 'A store that never loses',
    titleAccent: 'a customer.',
    lead: 'From the first click to checkout, we remove every obstacle between the customer and the purchase.',
    items: [
      { tag: 'Payment', title: 'Payment in one click', text: 'Your customer pays right away with BLIK or by card, no registration and no barriers.', caption: 'The customer pays on the Przelewy24 or Stripe page and comes back with a confirmation.' },
      { tag: 'Shipping', title: 'Shipping under control', text: 'The customer picks how to receive the order, and you see it with the delivery address right away in your panel.', caption: 'Courier or parcel locker, and the address goes straight to your panel.' },
      { tag: 'Phone', title: 'Shopping on mobile', text: 'Most purchases happen on a smartphone. You get a thumb friendly path that is fast and flawless.', caption: 'The “Add to cart” button always under the thumb.' },
      { tag: 'Sales', title: 'You know what drives sales', text: 'You track abandoned carts and win customers back with automatic emails. More data, fewer losses.', caption: 'An abandoned cart comes back to the customer by email.' },
    ],
  },
  night: {
    title: 'Ready for',
    titleAccent: 'any scale.',
    lead: 'No matter how fast you grow, your store keeps up. It loads instantly and handles every visit.',
    stepsAria: 'What the store looks like from the owner’s side',
    steps: [
      'The store sells even while you rest.',
      'In the morning every order waits in one panel.',
      'You pack the parcel and mark it shipped in one click.',
    ],
    from: '22:00',
    to: '8:00',
    hint: 'Click a status to change it.',
  },
  scope: {
    title: 'What exactly',
    titleAccent: 'do you get?',
    lead: 'A store ready to sell from day one.',
    items: [
      { title: 'Store visual design', text: 'A consistent, on brand look tailored to your brand: product cards, home page, checkout.' },
      { title: 'Catalog setup', text: 'Adding products, categories, attributes (sizes, colors), variants and high quality images.' },
      { title: 'Conversion optimization', text: 'Fast checkout without registration, cross sell, abandoned carts, promotions and discount coupons.' },
      { title: 'Delivery', text: 'Courier, parcel locker or personal pickup, with the delivery cost added in the cart.' },
      { title: 'Payment gateways', text: 'Full Przelewy24 or Stripe integration: BLIK and cards.' },
      { title: 'Launch and training', text: 'Store launch, hosting setup, SSL and a panel where you see every order.' },
    ],
    termLabel: 'Quote and timeline',
    termValue: 'in 24 h',
  },
  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the store to it.',
    cta: 'Free consultation',
  },
};

export const shopCopy: Record<Locale, ShopCopy> = { pl: typo(PL_COPY), en: EN_COPY };
