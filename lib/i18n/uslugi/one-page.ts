import type { Locale } from '@/lib/i18n/locale';

// Słownik podstrony usługi /uslugi/strony-www/one-page (PL + EN) - przebudowa 2026-10 (praca równoległa, etap 3,
// chat 7; podstrona ZAMKNIĘTA 2026-10-02). Dawny `onePageDict` i `OnePageClient.tsx` usunięte 2026-10-02 za zgodą
// właściciela.
// Zasady (PRODUCT.md, docs/podstrony/copy.md): głos korzyści, zdanie o kliencie i o tym, co ma z tego właściciel firmy,
// sentence case, bez myślników em / en, jedno CTA „Bezpłatna konsultacja”, tylko obronne fakty. Nazwa i chwyt usługi
// zgodne z Ofertą na stronie głównej (`servicesSectionDict.items` w lib/i18n/services.ts): „Jedna strona, jeden cel.”
// + „…pisze do Ciebie, zanim zdąży się rozmyślić”.
// Termin „Start w 3-5 dni” (jak w legendzie Oferty: „Startujesz w 3-5 dni”) - POTWIERDZONY przez właściciela 2026-10-02.
// PL: twarde spacje (U+00A0) po jednoliterowych słowach i między liczbą a jednostką dokłada `typo()`.
// Import w server page; słownik wędruje do klienta jako props. Opis: docs/podstrony/usluga-one-page.md.

export interface OnePageCopy {
  /** Nagłówek: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). */
  head: { title: string; lead: string; cta: string; proof: string[] };
  /** Zaprojektowana, przykładowa strona one-page klienta w kadrze („twojafirma.pl”). */
  site: {
    domain: string; brand: string; nav: string[]; navCta: string;
    eyebrow: string; heroTitle: string; heroText: string; heroCta: string; heroLink: string; perks: string[];
    offerTitle: string; offerLead: string;
    cards: { title: string; text: string; price: string }[];
    quote: string; quoteBy: string;
    contactTitle: string; contactText: string; contactLines: string[];
    fields: { label: string; value: string }[];
    submit: string; sent: string; foot: string;
  };
  /** Scena 1 (film): droga klienta przez gotową stronę - nazwy miejsc w pasku adresu (`states`, po jednej na akt),
      podpisy trzech aktów, powiadomienie o zapytaniu. Bez etapu „szkicu” (właściciel 2026-10-02: „nie zaczyna się
      strona od szkicu, więc trzeba przebudować logikę i opowieść”). */
  film: {
    states: string[]; stepsAria: string; steps: string[];
    noteTitle: string; noteTime: string; noteFrom: string; noteMsg: string;
  };
  /** Scena 2 (stos): kiedy wystarczy jedna strona - cztery karty z rysunkami. TEMATY kart z kafli „Dlaczego One-Page?”
      pierwotnej podstrony (kampanie, telefon, szybkość; karta „szybki test / błyskawiczna
      weryfikacja” odrzucona 2026-10-02 jako „chujowy koncept” i zastąpiona wizytówką w sieci), ale teksty przepisane
      2026-10-02 (właściciel: „każdy tekst pod względem copywritingu zoptymalizuj, bo niektóre są frajerskie”) - bez
      żargonu („laserowe skupienie”, „leady”, „pod mobile”, „ścieżka wizualna”) i bez obietnic bez pokrycia („obniża
      koszt reklam”, „ani sekundy”): zdanie o tym, co robi klient, i co z tego ma właściciel firmy. `tag` = hasło
      na zakładce karty, `caption` = podpis rysunku (animacja tłumaczy się sama). */
  cases: { title: string; titleAccent: string; lead: string; items: { tag: string; title: string; text: string; caption: string }[] };
  /** Scena 3 (zakres): lista + pokaz w kadrze. */
  scope: {
    title: string; titleAccent: string;
    items: { title: string; text: string }[];
    termLabel: string; termValue: string;
    chips: string[];
  };
  ending: { title: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd („i w”)
      .replace(/(\d) (h|s|dni|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_COPY: OnePageCopy = {
  head: {
    title: 'Jedna strona, jeden cel',
    lead: 'Klient od pierwszego ekranu wie, co oferujesz, i pisze do Ciebie, zanim zdąży się rozmyślić.',
    cta: 'Bezpłatna konsultacja',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
  },
  site: {
    domain: 'twojafirma.pl',
    brand: 'Twoja firma',
    nav: ['Oferta', 'Cennik', 'Opinie'],
    navCta: 'Umów termin',
    eyebrow: 'Twoja branża, Twoje miasto',
    heroTitle: 'Twoja oferta w jednym zdaniu.',
    heroText: 'Tu klient w kilka sekund dowiaduje się, co robisz i dla kogo.',
    heroCta: 'Umów termin',
    heroLink: 'Zobacz cennik',
    perks: ['Szybki kontakt', 'Jasne ceny', 'Opinie klientów'],
    offerTitle: 'Oferta',
    offerLead: 'Trzy usługi, każda z ceną.',
    cards: [
      { title: 'Usługa pierwsza', text: 'Krótko o tym, co klient zyskuje.', price: 'od 000 zł' },
      { title: 'Usługa druga', text: 'Krótko o tym, co klient zyskuje.', price: 'od 000 zł' },
      { title: 'Usługa trzecia', text: 'Krótko o tym, co klient zyskuje.', price: 'od 000 zł' },
    ],
    quote: 'Tu stanie opinia Twojego klienta, słowo w słowo.',
    quoteBy: 'Imię i nazwisko, Twoje miasto',
    contactTitle: 'Napisz, oddzwonimy.',
    contactText: 'Trzy pola i gotowe.',
    contactLines: ['ul. Twoja 1, Twoje miasto', 'pon-pt, 9:00-17:00'],
    fields: [
      { label: 'Imię', value: 'Marta' },
      { label: 'Telefon', value: '600 100 200' },
      { label: 'Wiadomość', value: 'Dzień dobry, proszę o wycenę.' },
    ],
    submit: 'Wyślij zapytanie',
    sent: 'Wysłane',
    foot: 'Adres, telefon i godziny zawsze pod ręką',
  },
  film: {
    states: ['Pierwszy ekran', 'Oferta', 'Kontakt'],
    stepsAria: 'Jak działa strona one-page',
    steps: [
      'Klient w kilka sekund wie, czym się zajmujesz i czy to coś dla niego.',
      'Przewija dalej i po kolei znajduje ofertę, ceny i opinie. Niczego nie musi szukać.',
      'Na końcu zostaje mu jeden krok: formularz. Zapytanie trafia prosto do Ciebie.',
    ],
    noteTitle: 'Nowe zapytanie',
    noteTime: 'przed chwilą',
    noteFrom: 'Marta, 600 100 200',
    noteMsg: 'Dzień dobry, proszę o wycenę.',
  },
  cases: {
    title: 'Kiedy wystarczy',
    titleAccent: 'jedna strona.',
    lead: 'Wtedy, gdy klient ma zrobić jedną rzecz: odezwać się do Ciebie.',
    items: [
      { tag: 'Reklamy', title: 'Z reklamy prosto do celu', text: 'Klient klika reklamę i trafia na stronę, która mówi dokładnie to samo. Nic go nie rozprasza po drodze do formularza.', caption: 'Reklama, strona i formularz w jednej linii.' },
      { tag: 'Wizytówka', title: 'Cała firma pod jednym adresem', text: 'Klient szuka Cię w sieci i od razu znajduje ofertę, opinie, godziny i dojazd. Nie musi dzwonić, żeby o to zapytać.', caption: 'Z wizytówki prosto na stronę z adresem i godzinami.' },
      { tag: 'Telefon', title: 'Cała oferta pod kciukiem', text: 'Większość klientów otworzy Twoją stronę w telefonie. Tu przewijają ofertę jednym ruchem, od pierwszego ekranu do formularza.', caption: 'Klient przewija i czyta ofertę po kolei.' },
      { tag: 'Szybkość', title: 'Klient nie czeka na ładowanie', text: 'Lekka strona otwiera się od razu, także na słabszym internecie. Klient zostaje, zamiast wrócić do wyników wyszukiwania.', caption: 'Strona jest gotowa, zanim klient zdąży się zniecierpliwić.' },
    ],
  },
  scope: {
    title: 'Wszystko, czego trzeba.',
    titleAccent: 'Nic ponad to.',
    items: [
      { title: 'Projekt od zera', text: 'Wygląd powstaje pod Twoją firmę i jeden cel: zapytanie od klienta.' },
      { title: 'Sekcje pod Twoją branżę', text: 'Cennik, galeria, opinie, mapa dojazdu albo FAQ. Na stronie jest to, czego szuka Twój klient.' },
      { title: 'Formularz prosto do Ciebie', text: 'Zapytanie trafia na Twój adres e-mail w chwili wysłania.' },
      { title: 'Wygodna na każdym telefonie', text: 'Każdy ekran dopasowany do telefonu i tabletu.' },
      { title: 'Szybkie ładowanie', text: 'Lekki kod i szybki hosting, więc klient nie czeka.' },
      { title: 'Wsparcie techniczne', text: 'Techniczne sprawy bierzemy na siebie, przy starcie i po nim.' },
    ],
    termLabel: 'Start',
    termValue: 'w 3-5 dni',
    chips: ['Cennik', 'Galeria', 'Opinie', 'Mapa dojazdu', 'FAQ'],
  },
  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy stronę do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_COPY: OnePageCopy = {
  head: {
    title: 'One page, one goal',
    lead: 'From the first screen your client knows what you offer and writes to you before they can change their mind.',
    cta: 'Free consultation',
    proof: ['Free', 'no strings attached', 'reply within 24 h'],
  },
  site: {
    domain: 'yourcompany.com',
    brand: 'Your company',
    nav: ['Offer', 'Pricing', 'Reviews'],
    navCta: 'Book a slot',
    eyebrow: 'Your industry, your city',
    heroTitle: 'Your offer in one sentence.',
    heroText: 'Here your client learns in seconds what you do and who it is for.',
    heroCta: 'Book a slot',
    heroLink: 'See pricing',
    perks: ['Fast contact', 'Clear prices', 'Client reviews'],
    offerTitle: 'Offer',
    offerLead: 'Three services, each with a price.',
    cards: [
      { title: 'Service one', text: 'A short line about what the client gains.', price: 'from 000' },
      { title: 'Service two', text: 'A short line about what the client gains.', price: 'from 000' },
      { title: 'Service three', text: 'A short line about what the client gains.', price: 'from 000' },
    ],
    quote: 'Your client’s review goes here, word for word.',
    quoteBy: 'Full name, your city',
    contactTitle: 'Write to us, we call back.',
    contactText: 'Three fields and done.',
    contactLines: ['1 Your Street, Your City', 'Mon-Fri, 9:00-17:00'],
    fields: [
      { label: 'Name', value: 'Martha' },
      { label: 'Phone', value: '600 100 200' },
      { label: 'Message', value: 'Hello, I would like a quote.' },
    ],
    submit: 'Send inquiry',
    sent: 'Sent',
    foot: 'Address, phone and hours always at hand',
  },
  film: {
    states: ['First screen', 'Offer', 'Contact'],
    stepsAria: 'How a one page website works',
    steps: [
      'Within seconds your client knows what you do and whether it is for them.',
      'They scroll on and find the offer, prices and reviews in order. Nothing to hunt for.',
      'At the end one step is left: the form. The inquiry goes straight to you.',
    ],
    noteTitle: 'New inquiry',
    noteTime: 'just now',
    noteFrom: 'Martha, 600 100 200',
    noteMsg: 'Hello, I would like a quote.',
  },
  cases: {
    title: 'When one page',
    titleAccent: 'is enough.',
    lead: 'When your client has one thing to do: get in touch with you.',
    items: [
      { tag: 'Ads', title: 'From the ad straight to the goal', text: 'A client clicks your ad and lands on a page that says exactly the same thing. Nothing distracts them on the way to the form.', caption: 'Ad, page and form in one line.' },
      { tag: 'Business card', title: 'Your whole business at one address', text: 'A client looks you up online and right away finds your offer, reviews, hours and directions. No need to call and ask.', caption: 'From the business card straight to a page with your address and hours.' },
      { tag: 'Phone', title: 'Your whole offer under one thumb', text: 'Most clients will open your page on a phone. Here they scroll through the offer in one motion, from the first screen to the form.', caption: 'Your client scrolls and reads the offer in order.' },
      { tag: 'Speed', title: 'No waiting for the page to load', text: 'A light page opens right away, even on a weak connection. Your client stays instead of going back to the search results.', caption: 'The page is ready before your client gets impatient.' },
    ],
  },
  scope: {
    title: 'Everything you need.',
    titleAccent: 'Nothing more.',
    items: [
      { title: 'A design from scratch', text: 'The look is built for your business and one goal: an inquiry from a client.' },
      { title: 'Sections for your industry', text: 'Pricing, gallery, reviews, directions or FAQ. The page has what your client looks for.' },
      { title: 'A form straight to you', text: 'The inquiry reaches your email address the moment it is sent.' },
      { title: 'Easy on every phone', text: 'Every screen is fitted to phones and tablets.' },
      { title: 'Fast loading', text: 'Light code and fast hosting, so your client does not wait.' },
      { title: 'Technical support', text: 'We take care of the technical side, at launch and after it.' },
    ],
    termLabel: 'Launch',
    termValue: 'in 3-5 days',
    chips: ['Pricing', 'Gallery', 'Reviews', 'Directions', 'FAQ'],
  },
  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the page to it.',
    cta: 'Free consultation',
  },
};

export const onePageCopy: Record<Locale, OnePageCopy> = { pl: typo(PL_COPY), en: EN_COPY };
