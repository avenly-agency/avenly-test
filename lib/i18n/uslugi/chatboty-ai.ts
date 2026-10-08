import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik podstrony /uslugi/automatyzacje-ai/chatboty-ai.
 * Wzorzec jak lib/i18n/home/hero.ts:
 * - interface ChatbotsDict = same stringi (JSX/ikony/shadery/klasy zostają w komponencie),
 * - export chatbotsDict: Record<Locale, ChatbotsDict>,
 * - PL = tekst 1:1 z ChatbotsAIClient.tsx sprzed ekstrakcji (bajt w bajt,
 *   łącznie z sekwencją typewriter Q&A i etykietami mockupów),
 * - EN = copy wg PRODUCT.md (benefit voice, sentence case, bez em/en dashes,
 *   zero fabrykowanych metryk, "Bezpłatna konsultacja" -> "Free consultation").
 * Import wyłącznie w server page - słownik wędruje do klienta jako props.
 */

export interface QAItem {
  q: string;
  a: string;
  chip: string;
  src: string;
}

export interface ChatbotsDict {
  hero: {
    badge: string;
    h1Line1: string;
    h1Line2Accent: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  livingAsk: {
    qaList: QAItem[];
    sourceLabel: string;
  };
  marquee: {
    introLine1: string;
    introLine2: string;
    questionsRow1: string[];
    questionsRow2: string[];
  };
  capabilities: {
    badge: string;
    heading: string;
    /** Kolejność zgodna z CAP_META w komponencie: knowledge, always, leads, integrate. */
    caps: { title: string; body: string }[];
    visual: {
      knowledgeTags: string[];
      alwaysStatus: string;
      leadsEmails: string[];
      leadsStatus: string;
      leadsBadge: string;
      integrateTags: string[];
    };
  };
  impact: {
    heading: string;
    subtitle: string;
    statNumber: string;
    statUnit: string;
    statDescPre: string;
    statDescHighlight: string;
    changes: { title: string; desc: string }[];
  };
  why: {
    eyebrow: string;
    heading: string;
    /** Kolejność zgodna z WHY_ICONS w komponencie: CheckCircle2, Sparkles, TrendingUp. */
    rows: { title: string; body: string }[];
  };
}

export const chatbotsDict: Record<Locale, ChatbotsDict> = {
  pl: {
    hero: {
      badge: 'Wirtualny asystent',
      h1Line1: 'Rozmawia z klientem.',
      h1Line2Accent: 'Natychmiast.',
      lead: 'Asystent AI wbudowany w Twoją stronę - odpowiada, kwalifikuje potrzeby i przekazuje gotowe leady do CRM. Zobacz, jak to wygląda na żywo:',
      ctaPrimary: 'Bezpłatna konsultacja',
      ctaSecondary: 'Przetestuj na sobie',
    },
    livingAsk: {
      qaList: [
        { q: 'Ile kosztuje dostawa?', a: 'Kurier to 14,99 zł, a od 200 zł - gratis. Wysyłka w 24h.', chip: 'Sprawdź koszyk', src: 'cennik dostaw' },
        { q: 'Czy mogę zwrócić produkt?', a: 'Tak - masz 30 dni na zwrot bez podania przyczyny. Wygenerować etykietę?', chip: 'Zwróć produkt', src: 'regulamin' },
        { q: 'Jak szybko wdrożycie chatbota?', a: 'Zwykle 1 dzień roboczy od dostarczenia treści. Zostaw e-mail, wyślę plan.', chip: 'Zostaw e-mail', src: 'oferta' },
        { q: 'Pracujecie z klientami z UE?', a: 'Tak, obsługujemy całą Unię - faktury w EUR i PLN. Umówić rozmowę?', chip: 'Umów rozmowę', src: 'FAQ' },
      ],
      sourceLabel: 'źródło:',
    },
    marquee: {
      introLine1: 'Setki pytań, które Twoi klienci zadają każdego dnia,',
      introLine2: 'żadne nie zostaje bez odpowiedzi.',
      questionsRow1: ['Ile kosztuje dostawa?', 'Macie w rozmiarze M?', 'Jak zwrócić produkt?', 'Do kiedy promocja?', 'Czy wystawiacie faktury?', 'Jak długo trwa wysyłka?'],
      questionsRow2: ['Czy mogę zapłacić BLIKiem?', 'Pracujecie w weekendy?', 'Macie sklep stacjonarny?', 'Jak umówić wizytę?', 'Czy jest gwarancja?', 'Dowozicie za granicę?'],
    },
    capabilities: {
      badge: 'Możliwości',
      heading: 'Cztery rzeczy, w których jest lepszy od formularza',
      caps: [
        { title: 'Zna Twoją ofertę', body: 'Trenujemy go na Twoich cennikach, opisach i FAQ - zna asortyment lepiej niż nowy pracownik pierwszego dnia.' },
        { title: 'Pracuje 24/7', body: 'W nocy, w weekend i w święta - Twój klient nigdy nie trafia na zamknięte.' },
        { title: 'Zbiera leady', body: 'Kwalifikuje potrzeby i zapisuje gotowe kontakty prosto do Twojego CRM.' },
        { title: 'Integruje się', body: 'Łączy się z CRM, e-mailem, WhatsAppem, kalendarzem czy n8n.' },
      ],
      visual: {
        knowledgeTags: ['cennik', 'opisy produktów', 'FAQ', 'regulamin', 'case studies', 'dostawa', 'zwroty', 'gwarancja'],
        alwaysStatus: '● online · 02:47',
        leadsEmails: ['anna@firma.pl', 'biuro@xyz.pl'],
        leadsStatus: 'nowy lead · gorący',
        leadsBadge: '→ CRM',
        integrateTags: ['CRM', 'E-mail', 'WhatsApp', 'Slack', 'Kalendarz', 'n8n', 'Arkusze'],
      },
    },
    impact: {
      heading: 'Konkret, nie obietnice',
      subtitle: 'Co realnie zmienia się, gdy klient zawsze dostaje odpowiedź.',
      statNumber: '2',
      statUnit: 's',
      statDescPre: 'tyle średnio czeka klient na odpowiedź asystenta. Formularz kontaktowy?',
      statDescHighlight: 'Godziny - albo następny dzień.',
      changes: [
        { title: 'Łapie klienta, gdy jest gotowy', desc: 'Zamiast szukać odpowiedzi u konkurencji, dostaje ją od razu u Ciebie.' },
        { title: 'Zdejmuje rutynę z zespołu', desc: 'Dostawa, zwroty, dostępność - powtarzalne pytania nie lądują już na Twojej skrzynce.' },
        { title: 'Każdy klient obsłużony tak samo', desc: 'Pierwszy i setny dostają równie konkretną odpowiedź, bez gorszych dni i kolejek.' },
      ],
    },
    why: {
      eyebrow: 'Różnica',
      heading: 'Nie każdy chatbot jest taki sam',
      rows: [
        { title: 'Nie zmyśla.', body: 'Gdy pytanie wykracza poza jego wiedzę, mówi to wprost. Z pełnym kontekstem rozmowy przekazuje klienta Twojemu zespołowi - zamiast tracić zaufanie błędną informacją.' },
        { title: 'Brzmi jak Twoja marka.', body: 'Ton wypowiedzi, język i wygląd widgetu dopasowujemy do Twojego serwisu. Klient nie ma poczucia, że rozmawia z generycznym, sztampowym botem.' },
        { title: 'Mierzysz każdą rozmowę.', body: 'W panelu widzisz, o co realnie pytają klienci, gdzie się gubią i co domyka sprzedaż. Co miesiąc dostrajamy bota na podstawie tych danych.' },
      ],
    },
  },
  en: {
    hero: {
      badge: 'Virtual assistant',
      h1Line1: 'It talks to your customer.',
      h1Line2Accent: 'Instantly.',
      lead: 'An AI assistant built into your website - it answers, qualifies needs and passes ready leads to your CRM. See how it works live:',
      ctaPrimary: 'Free consultation',
      ctaSecondary: 'Try it yourself',
    },
    livingAsk: {
      qaList: [
        { q: 'How much is delivery?', a: 'Courier is 14.99 PLN, and free from 200 PLN. Shipping within 24h.', chip: 'Check your cart', src: 'delivery rates' },
        { q: 'Can I return a product?', a: 'Yes - you have 30 days to return it, no reason needed. Want me to generate a label?', chip: 'Return a product', src: 'terms' },
        { q: 'How fast can you deploy a chatbot?', a: 'Usually 1 business day after you send the content. Leave your email and I will send a plan.', chip: 'Leave your email', src: 'offer' },
        { q: 'Do you work with clients from the EU?', a: 'Yes, we serve the whole EU - invoices in EUR and PLN. Shall we book a call?', chip: 'Book a call', src: 'FAQ' },
      ],
      sourceLabel: 'source:',
    },
    marquee: {
      introLine1: 'Hundreds of questions your customers ask every day,',
      introLine2: 'not one goes unanswered.',
      questionsRow1: ['How much is delivery?', 'Do you have size M?', 'How do I return a product?', 'How long is the promo on?', 'Do you issue invoices?', 'How long is shipping?'],
      questionsRow2: ['Can I pay by card?', 'Are you open on weekends?', 'Do you have a physical store?', 'How do I book a visit?', 'Is there a warranty?', 'Do you deliver abroad?'],
    },
    capabilities: {
      badge: 'Capabilities',
      heading: 'Four things it does better than a form',
      caps: [
        { title: 'It knows your offer', body: 'We train it on your pricing, descriptions and FAQ - it knows your range better than a new hire on day one.' },
        { title: 'It works 24/7', body: 'At night, on weekends and holidays - your customer never finds the door closed.' },
        { title: 'It collects leads', body: 'It qualifies needs and saves ready contacts straight into your CRM.' },
        { title: 'It integrates', body: 'It connects with your CRM, email, WhatsApp, calendar or n8n.' },
      ],
      visual: {
        knowledgeTags: ['pricing', 'product descriptions', 'FAQ', 'terms', 'case studies', 'delivery', 'returns', 'warranty'],
        alwaysStatus: '● online · 02:47',
        leadsEmails: ['anna@company.com', 'office@xyz.com'],
        leadsStatus: 'new lead · hot',
        leadsBadge: '→ CRM',
        integrateTags: ['CRM', 'Email', 'WhatsApp', 'Slack', 'Calendar', 'n8n', 'Sheets'],
      },
    },
    impact: {
      heading: 'Facts, not promises',
      subtitle: 'What really changes when your customer always gets an answer.',
      statNumber: '2',
      statUnit: 's',
      statDescPre: 'that is the average wait for an answer from the assistant. A contact form?',
      statDescHighlight: 'Hours - or the next day.',
      changes: [
        { title: 'It catches the customer when they are ready', desc: 'Instead of looking for answers at a competitor, they get one right away from you.' },
        { title: 'It takes routine off your team', desc: 'Delivery, returns, availability - repeat questions no longer land in your inbox.' },
        { title: 'Every customer served the same way', desc: 'The first and the hundredth get an equally concrete answer, with no bad days or queues.' },
      ],
    },
    why: {
      eyebrow: 'Difference',
      heading: 'Not every chatbot is the same',
      rows: [
        { title: 'It never makes things up.', body: 'When a question goes beyond its knowledge, it says so. With the full context of the conversation it hands the customer to your team - instead of losing trust with wrong information.' },
        { title: 'It sounds like your brand.', body: 'We match the tone, language and widget look to your site. The customer never feels they are talking to a generic, off-the-shelf bot.' },
        { title: 'You measure every conversation.', body: 'In the panel you see what customers really ask, where they get stuck and what closes a sale. Every month we tune the bot based on that data.' },
      ],
    },
  },
};

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════
// NOWA PODSTRONA - praca równoległa, etap 3, chat 13 (od 2026-10-04). Chatboty to INNA usługa niż strony WWW:
// podstrona jest rozmową, a nie opisem rozmowy (PRACA-ROWNOLEGLA.md, „CRM i chatboty - inne usługi, inne podstrony”).
// RUNDA 2 (właściciel 2026-10-04: „rób od razu kilka wersji każdej sekcji i zrób więcej sekcji, ale też żeby
// dorównywało poziomowi i cinematic jak reszta podstron”): pięć sekcji, każda w trzech wersjach (przełączniki
// w panelu na dole ekranu, tylko dev). Słownik niesie teksty wszystkich wersji; po wyborach właściciela zostają
// teksty wybranych.
//   scene - scena główna (Noc / Przelot / Napisy),       asks  - pytania klientów (Napływ / Wyścig / Wszyscy naraz),
//   know  - wiedza (Konstelacja / Dokumenty / Granica),   voice - głos marki (Twoja branża / Pokrętło / Języki),
//   scope - zakres (Pokaz / Rozmowa / Plan).
// Źródło tekstów: `chatbotsDict` wyżej (pierwotna wersja - zostaje na dysku, nieimportowana) + chwyt i scenka z Oferty
// (`servicesSectionDict.items` w lib/i18n/services.ts). Zmienione tylko to, co musi: żargon („leady”, „kwalifikuje
// potrzeby”, „widget”) -> „zapytania”, „okno czatu”; myślniki; obietnice do decyzji właściciela (integracje, panel
// statystyk, termin wdrożenia) nie weszły. Tabela „było -> jest”: docs/podstrony/usluga-chatboty-ai.md.
// Rozmowy w scenach to PRZYKŁADY wymyślonych firm (bez nazw prawdziwych klientów, adresy w domenie przyklad.pl).
// PL: twarde spacje dokłada `typo()`. Import w server page; słownik wędruje do klienta jako props.

export interface ChatbotsCopy {
  /** Nagłówek: linie h1 bez końcowej kropki (kropkę w kolorze podstrony dokłada komponent). `tryIt` otwiera
      prawdziwego asystenta z rogu strony (zdarzenie avenly:open-chat). */
  head: { titleLines: string[]; lead: string; cta: string; tryIt: string; proof: string[] };
  /** Etykieta każdej rozmowy odgrywanej w scenie. */
  sample: string;
  /** Nazwy rozmówców dla czytników ekranu. */
  speakers: { client: string; assistant: string };
  /** Gotowe zapytanie w skrzynce właściciela firmy: tytuł i etykiety pól (wartości przy każdej rozmowie). */
  inbox: { title: string; labels: string[] };

  /** 1. SCENA GŁÓWNA - scenka Oferty jako film: klient pyta w nocy -> asystent odpowiada -> rano zapytanie w skrzynce.
      `steps` = trzy zdania narratora (jedno naraz), `lines` = [pytanie, odpowiedź, pytanie, odpowiedź],
      `inbox` = wartości pól w kolejności `inbox.labels`, `big` = krótka wymiana do wersji „Napisy” (wielkie litery),
      `status` = [firma zamknięta, asystent czuwa]. */
  scene: {
    stepsAria: string; steps: string[];
    firm: string; status: string[];
    lines: string[]; inbox: string[];
    big: { q: string; a: string };
  };

  /** 2. PYTANIA - „Setki pytań… żadne bez odpowiedzi” i jedyna liczba podstrony: odpowiedź w ok. 2 s.
      `questions` = pytania klientów (12), `steps` = trzy zdania narratora, `race` = formularz kontra asystent
      (to samo pytanie o tej samej godzinie), `crowd` = sześć rozmów naraz. */
  asks: {
    title: string; titleAccent: string; lead: string;
    questions: string[]; answered: string;
    stepsAria: string; steps: string[];
    race: {
      question: string; answer: string;
      form: { title: string; steps: string[]; time: string };
      bot: { title: string; steps: string[]; time: string };
    };
    crowd: { q: string; a: string }[]; crowdNote: string;
  };

  /** 3. WIEDZA - „Zna Twoją ofertę. Nie zmyśla.” Asystent odpowiada z materiałów firmy i pokazuje źródło;
      pytanie spoza wiedzy trafia do człowieka. `items` w kolejności źródeł: Cennik, Regulamin, Godziny otwarcia,
      a ostatnie = spoza wiedzy. `nodes` = pięć źródeł (kolejność: Cennik, Opisy produktów, Regulamin, Godziny
      otwarcia, FAQ), `sheets` = te same źródła jako dokumenty z dwiema linijkami treści. */
  know: {
    title: string; titleAccent: string; lead: string;
    askLabel: string; firm: string; center: string; team: string; nodes: string[];
    sourceLabel: string; handLabel: string;
    items: { q: string; a: string; src: string }[];
    stepsAria: string; steps: string[];
    sheets: { name: string; lines: string[] }[];
    /** Wersja „Przypisy”: odpowiedź na pytanie `q` wielkim pismem, pocięta na fragmenty (każdy ma własne spacje;
        `ref` = numer przypisu 1-n, czyli fragment wzięty wprost z materiałów), `notes` = przypisy (dokument + linijka).
        `miss` = pytanie spoza wiedzy: krótka odpowiedź, dopisek zamiast przypisu i zdanie o przekazaniu człowiekowi. */
    cite: {
      q: string; parts: { text: string; ref?: number }[]; notes: { doc: string; line: string }[];
      miss: { q: string; text: string; note: string; hand: string };
    };
    /** Wersja „Konkrety”: pytanie -> konkret WIELKIM pismem (`value` + `unit`), pod nim pełne zdanie odpowiedzi
        i źródło. Pytanie spoza wiedzy bierze teksty z `cite.miss`. */
    big: { q: string; value: string; unit: string; say: string; src: string }[];
    /** Wersja „Ściana”: materiały firmy jako pasy faktów, po jednym pasie na dokument (kolejność jak `sheets`;
        PIERWSZE DWA fakty pasa to dwie linijki tego dokumentu z `sheets` - na nich staje zakreślenie). */
    wall: { doc: string; facts: string[] }[];
  };

  /** 4. GŁOS - „Brzmi jak Twoja marka.” + „Rozmawia w wielu językach”.
      `trade` = wybór branży: rozmowa dla tej firmy (`lines` = [pytanie, odpowiedź, pytanie, odpowiedź], `inbox`
      w kolejności `inbox.labels`); `dial` = to samo pytanie w trzech tonach i czterech językach;
      `steps` = narrator wersji „Języki”. */
  voice: {
    title: string; titleAccent: string; lead: string;
    trade: {
      label: string; hint: string; toneLabel: string; replay: string;
      items: { name: string; firm: string; tone: string; lines: string[]; inbox: string[] }[];
    };
    dial: {
      toneLabel: string; question: string; tones: { name: string; answer: string }[];
      langLabel: string; langs: { name: string; q: string; a: string }[];
    };
    stepsAria: string; steps: string[];
  };

  /** 5. ZAKRES - co dostajesz i kiedy. Termin na linii wymiarowej jak na pozostałych podstronach usług
      (bez wymyślonego czasu wdrożenia: „Wycena i termin w 24 h” jak na podstronie sklepu - właściciel 2026-10-05: „? dni zastąp czymś”). `talk` = wersja „Rozmowa”: pytanie z listy,
      strona odpowiada treścią (`show` = napisy małej ilustracji, kolejność i znaczenie w zakres.tsx). */
  scope: {
    title: string; titleAccent: string; termLabel: string; termValue: string;
    items: { title: string; text: string }[];
    talk: {
      hello: string; askLabel: string; you: string; done: string;
      items: { q: string; title: string; text: string; show: string[] }[];
    };
  };

  ending: { title: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd
      .replace(/(\d) (h|s|zł|cm|kg|cali|dni|minut|miesi[a-zęą]*|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_COPY: ChatbotsCopy = {
  head: {
    titleLines: ['Rozmawia', 'z klientem.', 'Natychmiast'],
    lead: 'Asystent AI zna Twoją ofertę, odpowiada klientom od razu i przekazuje Ci gotowe zapytania.',
    cta: 'Bezpłatna konsultacja',
    tryIt: 'Przetestuj na sobie',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'wycena w 24 h'],
  },
  sample: 'Przykładowa rozmowa',
  speakers: { client: 'Klient', assistant: 'Asystent' },
  inbox: { title: 'Rano w Twojej skrzynce', labels: ['Kto', 'Czego potrzebuje', 'Kiedy', 'Kontakt'] },

  scene: {
    stepsAria: 'Jedna noc krok po kroku',
    steps: [
      'Klient pyta o ofertę o drugiej w nocy.',
      'Asystent odpowiada w kilka sekund, konkretnie.',
      'Rano gotowe zapytanie czeka w Twojej skrzynce.',
    ],
    firm: 'Firma montująca klimatyzację',
    status: ['Firma śpi', 'Asystent czuwa'],
    lines: [
      'Ile kosztuje montaż klimatyzacji w mieszkaniu?',
      'Jedna jednostka z montażem to od 3400 zł. Dokładną wycenę firma przygotuje po krótkiej rozmowie. Zostawisz kontakt?',
      'Jasne. Tomek, tomek@przyklad.pl',
      'Dziękuję, Tomku. Firma odezwie się rano w sprawie wyceny.',
    ],
    inbox: ['Tomek', 'Wycena montażu klimatyzacji', 'Dziś, 02:07', 'tomek@przyklad.pl'],
    big: { q: 'Ile kosztuje montaż?', a: 'Od 3400 zł. Wycena rano.' },
  },

  asks: {
    title: 'Setki pytań każdego dnia.',
    titleAccent: 'Żadne bez odpowiedzi.',
    lead: 'Dostawa, zwroty, terminy, ceny. Asystent odpowiada na każde, a Ty zajmujesz się resztą.',
    questions: [
      'Ile kosztuje dostawa?', 'Macie w rozmiarze M?', 'Jak zwrócić produkt?', 'Do kiedy promocja?',
      'Czy wystawiacie faktury?', 'Jak długo trwa wysyłka?', 'Czy mogę zapłacić BLIK-iem?', 'Pracujecie w weekendy?',
      'Macie sklep stacjonarny?', 'Jak umówić wizytę?', 'Czy jest gwarancja?', 'Wysyłacie za granicę?',
    ],
    answered: 'odpowiedź w ok. 2 s',
    stepsAria: 'Co się zmienia',
    steps: [
      'Powtarzalne pytania nie lądują już w Twojej skrzynce.',
      'Klient dostaje odpowiedź od razu, zamiast szukać jej u konkurencji.',
      'Pierwszy i setny klient dostają równie konkretną odpowiedź, bez gorszych dni i kolejek.',
    ],
    race: {
      question: 'Ile kosztuje wymiana opon?',
      answer: 'Wymiana kompletu to 160 zł. Przekazać prośbę o termin?',
      form: {
        title: 'Formularz kontaktowy',
        steps: ['Klient wysyła pytanie o 21:40.', 'Wiadomość czeka w skrzynce do rana.', 'Odpowiedź przychodzi następnego dnia.'],
        time: 'godziny albo następny dzień',
      },
      bot: {
        title: 'Asystent AI',
        steps: ['Klient pyta o 21:40.', 'Odpowiedź dostaje od razu.', 'Zapytanie z kontaktem czeka na Ciebie.'],
        time: 'ok. 2 s',
      },
    },
    crowd: [
      { q: 'Macie w rozmiarze M?', a: 'Tak, M jest dostępne od ręki.' },
      { q: 'Jak zwrócić produkt?', a: 'Masz na to 30 dni. Podać, jak to zrobić?' },
      { q: 'Czy wystawiacie faktury?', a: 'Tak, fakturę dostaniesz na maila.' },
      { q: 'Pracujecie w weekendy?', a: 'W soboty od 9:00 do 14:00.' },
      { q: 'Jak umówić wizytę?', a: 'Podaj dzień, a przekażę prośbę.' },
      { q: 'Czy jest gwarancja?', a: 'Tak, 24 miesiące na każdy produkt.' },
    ],
    crowdNote: 'Wszystkie rozmowy toczą się w tej samej chwili.',
  },

  know: {
    title: 'Zna Twoją ofertę.',
    titleAccent: 'Nie zmyśla.',
    lead: 'Twoją ofertę zna lepiej niż nowy pracownik pierwszego dnia. A gdy czegoś nie wie, mówi to wprost.',
    askLabel: 'Zapytaj o coś',
    firm: 'Sklep rowerowy Szprycha',
    center: 'Asystent',
    team: 'Twój zespół',
    nodes: ['Cennik', 'Opisy produktów', 'Regulamin', 'Godziny otwarcia', 'FAQ'],
    sourceLabel: 'z Twoich materiałów:',
    handLabel: 'bez zgadywania:',
    items: [
      { q: 'Ile kosztuje dostawa?', a: 'Kurier to 14,99 zł, a od 200 zł dostawa jest gratis. Wysyłka w 24 h.', src: 'cennik dostaw' },
      { q: 'Czy mogę zwrócić produkt?', a: 'Tak, masz 30 dni na zwrot bez podania przyczyny.', src: 'regulamin' },
      { q: 'Pracujecie w weekendy?', a: 'Sklep stacjonarny działa w soboty od 9:00 do 14:00. Ja odpowiadam całą dobę.', src: 'godziny otwarcia' },
      {
        q: 'Czy ta rama pasuje przy 190 cm wzrostu?',
        a: 'Tego nie mam w swoich materiałach, więc nie będę zgadywać. Przekazuję pytanie zespołowi razem z całą rozmową. Zostawisz e-mail?',
        src: 'przekazane Twojemu zespołowi',
      },
    ],
    stepsAria: 'Skąd asystent wie, co odpowiedzieć',
    steps: [
      'Uczy się z Twoich cenników, opisów i FAQ.',
      'Odpowiada tym, co jest w Twoich materiałach. Każdy konkret ma swoje źródło.',
      'Gdy pytanie wykracza poza jego wiedzę, nie zmyśla. Przekazuje rozmowę Twojemu zespołowi.',
    ],
    sheets: [
      { name: 'Cennik', lines: ['Dostawa kurierem: 14,99 zł', 'Od 200 zł dostawa gratis'] },
      { name: 'Opisy produktów', lines: ['Rama aluminiowa, rozmiary S-XL', 'Gwarancja 24 miesiące'] },
      { name: 'Regulamin', lines: ['Zwrot w ciągu 30 dni', 'Bez podania przyczyny'] },
      { name: 'Godziny otwarcia', lines: ['Sobota: 9:00-14:00', 'Niedziela: zamknięte'] },
      { name: 'FAQ', lines: ['Czy wystawiacie faktury?', 'Tak, na życzenie'] },
    ],
    cite: {
      q: 'Ile kosztuje dostawa?',
      parts: [
        { text: 'Kurier to ' }, { text: '14,99 zł', ref: 1 }, { text: ', a ' },
        { text: 'od 200 zł dostawa jest gratis', ref: 2 }, { text: '.' },
      ],
      notes: [
        { doc: 'Cennik', line: 'Dostawa kurierem: 14,99 zł' },
        { doc: 'Cennik', line: 'Od 200 zł dostawa gratis' },
      ],
      miss: {
        q: 'Czy ta rama pasuje przy 190 cm wzrostu?',
        text: 'Tego nie mam w swoich materiałach. Nie będę zgadywać.',
        note: 'brak w materiałach',
        hand: 'Pytanie i cała rozmowa trafiają do Twojego zespołu.',
      },
    },
    big: [
      { q: 'Ile kosztuje dostawa?', value: '14,99', unit: 'zł', say: 'Kurier to 14,99 zł, a od 200 zł dostawa jest gratis.', src: 'cennik dostaw' },
      { q: 'Czy mogę zwrócić produkt?', value: '30', unit: 'dni', say: 'Masz 30 dni na zwrot, bez podania przyczyny.', src: 'regulamin' },
      { q: 'Czy jest gwarancja?', value: '24', unit: 'miesiące', say: 'Tak, każdy rower ma 24 miesiące gwarancji.', src: 'opisy produktów' },
    ],
    wall: [
      { doc: 'Cennik', facts: ['Dostawa kurierem: 14,99 zł', 'Od 200 zł dostawa gratis', 'Przegląd roweru: 120 zł', 'Wymiana dętki: 30 zł', 'Regulacja przerzutek: 40 zł'] },
      { doc: 'Opisy produktów', facts: ['Rama aluminiowa, rozmiary S-XL', 'Gwarancja 24 miesiące', 'Hamulce tarczowe hydrauliczne', 'Koła 28 cali', 'Waga 11,8 kg'] },
      { doc: 'Regulamin', facts: ['Zwrot w ciągu 30 dni', 'Bez podania przyczyny', 'Reklamację rozpatrujemy w 14 dni', 'Zwrot pieniędzy tą samą drogą'] },
      { doc: 'Godziny otwarcia', facts: ['Sobota: 9:00-14:00', 'Niedziela: zamknięte', 'Od poniedziałku do piątku: 10:00-18:00', 'Serwis czynny do 17:00'] },
      { doc: 'FAQ', facts: ['Czy wystawiacie faktury?', 'Tak, na życzenie', 'Czy można zapłacić BLIK-iem? Tak', 'Czy składacie rower przed wysyłką? Tak'] },
    ],
  },

  voice: {
    title: 'Brzmi jak',
    titleAccent: 'Twoja marka.',
    lead: 'Mówi Twoim tonem i w języku klienta, a okno czatu wygląda jak część Twojej strony. Klient nie ma poczucia, że rozmawia ze sztampowym botem.',
    trade: {
      label: 'Czym się zajmujesz?',
      hint: 'Wybierz branżę, a zobaczysz, jak asystent rozmawia z klientem Twojej firmy.',
      toneLabel: 'Ton:',
      replay: 'Odtwórz ponownie',
      items: [
        {
          name: 'Salon fryzjerski',
          firm: 'Salon Mila',
          tone: 'ciepło, po imieniu',
          lines: [
            'Hej, ile kosztuje koloryzacja?',
            'Cześć! Koloryzacja to od 280 zł, zależnie od długości włosów. Mam przekazać salonowi prośbę o termin?',
            'Tak, sobota rano. Anna, anna@przyklad.pl',
            'Gotowe, Anno. Salon potwierdzi godzinę zaraz po otwarciu.',
          ],
          inbox: ['Anna', 'Koloryzacja', 'Sobota rano', 'anna@przyklad.pl'],
        },
        {
          name: 'Warsztat samochodowy',
          firm: 'Garaż Północ',
          tone: 'krótko i rzeczowo',
          lines: [
            'Dzień dobry, ile kosztuje wymiana klocków w Golfie 7?',
            'Dzień dobry. Klocki na przedniej osi to od 220 zł z robocizną, zwykle godzina pracy. Przekazać warsztatowi prośbę o termin?',
            'Tak, czwartek rano. Marek, marek@przyklad.pl',
            'Zapisane: czwartek rano, klocki na przód, Golf 7. Warsztat potwierdzi godzinę.',
          ],
          inbox: ['Marek', 'Wymiana klocków, VW Golf 7', 'Czwartek rano', 'marek@przyklad.pl'],
        },
        {
          name: 'Sklep internetowy',
          firm: 'Palarnia Ziarno',
          tone: 'lekko, z pasją',
          lines: [
            'Do kiedy zamówić, żeby kawa doszła na piątek?',
            'Zamów do środy do 12:00, a paczka wyjdzie tego samego dnia. Kurierem lub do paczkomatu, zwykle w 1-2 dni.',
            'A co polecasz do przelewu? Mój mail: ola@przyklad.pl',
            'Do przelewu najlepiej Etiopia albo Kolumbia w jasnym paleniu. Przekazuję Twoje pytanie palarni, odpiszą Ci na maila.',
          ],
          inbox: ['Ola', 'Kawa do przelewu, dostawa na piątek', 'Dziś w nocy', 'ola@przyklad.pl'],
        },
        {
          name: 'Gabinet',
          firm: 'Gabinet Ruch',
          tone: 'spokojnie, z troską',
          lines: [
            'Od tygodnia boli mnie bark. Czy to do Was?',
            'Tak, zajmujemy się bólem barku. Diagnozy nie postawię na czacie, zrobi to fizjoterapeuta na pierwszej wizycie: 50 minut, 180 zł. Przekazać prośbę o termin?',
            'Tak, najlepiej po 17. Piotr, piotr@przyklad.pl',
            'Zapisane, Piotrze. Gabinet odezwie się rano z wolnymi terminami po 17.',
          ],
          inbox: ['Piotr', 'Ból barku, pierwsza wizyta', 'Po 17', 'piotr@przyklad.pl'],
        },
      ],
    },
    dial: {
      toneLabel: 'Ton',
      question: 'Do której macie otwarte w sobotę?',
      tones: [
        { name: 'Oficjalnie', answer: 'Dzień dobry. W soboty restauracja jest czynna do godziny 22:00. Czy mogę pomóc w czymś jeszcze?' },
        { name: 'Naturalnie', answer: 'W soboty mamy otwarte do 22:00. Pomóc w czymś jeszcze?' },
        { name: 'Na luzie', answer: 'W soboty siedzimy do 22:00. Wpadaj śmiało!' },
      ],
      langLabel: 'Język',
      langs: [
        { name: 'Polski', q: 'Do której macie otwarte w sobotę?', a: 'W soboty mamy otwarte do 22:00. Pomóc w czymś jeszcze?' },
        { name: 'English', q: 'How late are you open on Saturday?', a: 'We are open until 10 p.m. on Saturdays. Anything else I can help with?' },
        { name: 'Deutsch', q: 'Wie lange haben Sie am Samstag geöffnet?', a: 'Samstags haben wir bis 22 Uhr geöffnet. Kann ich sonst noch helfen?' },
        { name: 'Українська', q: 'До котрої ви працюєте в суботу?', a: 'У суботу ми працюємо до 22:00. Чим ще можу допомогти?' },
      ],
    },
    stepsAria: 'Rozmowy w wielu językach',
    steps: [
      'Klienci piszą po swojemu, każdy w innym języku.',
      'Asystent rozpoznaje język i odpowiada w nim od razu.',
      'A Ty masz w skrzynce gotowe zapytania.',
    ],
  },

  scope: {
    title: 'Co dokładnie',
    titleAccent: 'dostajesz.',
    termLabel: 'Wycena i termin',
    termValue: 'w 24 h',
    items: [
      { title: 'Asystent na Twojej stronie', text: 'Okno czatu w rogu każdej podstrony, na komputerze i na telefonie.' },
      { title: 'Wiedza o Twojej firmie', text: 'Zna Twoje cenniki, opisy i najczęstsze pytania klientów.' },
      { title: 'Ton i wygląd Twojej marki', text: 'Język, sposób mówienia i kolory okna dopasowane do Twojej strony.' },
      { title: 'Rozmowy w wielu językach', text: 'Klient pisze po swojemu, asystent odpowiada w jego języku.' },
      { title: 'Gotowe zapytania', text: 'Pytanie klienta, kontakt i to, czego potrzebuje, trafiają prosto do Ciebie.' },
      { title: 'Przekazanie człowiekowi', text: 'Gdy pytanie wykracza poza jego wiedzę, asystent nie zmyśla i oddaje rozmowę Twojemu zespołowi.' },
    ],
    talk: {
      hello: 'Ta część strony odpowiada jak asystent. Wybierz pytanie, a odpowiedź dostaniesz od razu.',
      askLabel: 'Zapytaj o coś',
      you: 'Ty',
      done: 'To wszystkie pytania z listy. O resztę zapytaj prawdziwego asystenta.',
      items: [
        {
          q: 'Skąd wie, co odpowiedzieć?',
          title: 'Zna Twoją ofertę',
          text: 'Uczy się z Twoich cenników, opisów i FAQ. Twoją ofertę zna lepiej niż nowy pracownik pierwszego dnia.',
          show: ['cennik', 'opisy produktów', 'FAQ', 'regulamin', 'dostawa', 'zwroty', 'gwarancja'],
        },
        {
          q: 'A jeśli klient napisze w nocy?',
          title: 'Pracuje całą dobę',
          text: 'W nocy, w weekend i w święta. Twój klient nigdy nie trafia na zamknięte, a na odpowiedź czeka ok. 2 s.',
          show: ['02:47', 'asystent odpowiada', 'formularz czeka do rana'],
        },
        {
          q: 'A jeśli czegoś nie wie?',
          title: 'Nie zmyśla',
          text: 'Gdy pytanie wykracza poza jego wiedzę, mówi to wprost. Z pełnym kontekstem rozmowy przekazuje klienta Twojemu zespołowi, zamiast tracić zaufanie błędną informacją.',
          show: ['Asystent', 'Twój zespół', 'razem z całą rozmową'],
        },
        {
          q: 'Będzie brzmiał jak moja firma?',
          title: 'Brzmi jak Twoja marka',
          text: 'Mówi Twoim tonem i w języku klienta, a okno czatu wygląda jak część Twojej strony. Klient nie ma poczucia, że rozmawia ze sztampowym botem.',
          show: ['Dzień dobry, w czym mogę pomóc?', 'Hej! Czego szukasz?', 'Witamy. Proszę opisać sprawę.'],
        },
        {
          q: 'Co z tego mam ja?',
          title: 'Gotowe zapytania w skrzynce',
          text: 'Klient dostaje odpowiedź od razu, a Ty rano masz w skrzynce jego pytanie, kontakt i to, czego potrzebuje.',
          show: ['Nowe zapytanie', 'Anna', 'Wycena montażu', 'anna@przyklad.pl'],
        },
      ],
    },
  },

  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy asystenta do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_COPY: ChatbotsCopy = {
  head: {
    titleLines: ['Talks to', 'your client.', 'Instantly'],
    lead: 'The AI assistant knows your offer, answers clients right away and hands you ready inquiries.',
    cta: 'Free consultation',
    tryIt: 'Try it yourself',
    proof: ['Free', 'no strings attached', 'quote within 24 h'],
  },
  sample: 'Example conversation',
  speakers: { client: 'Client', assistant: 'Assistant' },
  inbox: { title: 'In your inbox in the morning', labels: ['Who', 'What they need', 'When', 'Contact'] },

  scene: {
    stepsAria: 'One night, step by step',
    steps: [
      'A client asks about your offer at 2 a.m.',
      'The assistant answers in seconds, to the point.',
      'In the morning, a ready inquiry waits in your inbox.',
    ],
    firm: 'Air conditioning installer',
    status: ['The company sleeps', 'The assistant is on duty'],
    lines: [
      'How much is air conditioning for a flat?',
      'One unit with installation starts at 3400 PLN. The company will prepare an exact quote after a short call. Will you leave your contact details?',
      'Sure. Tom, tom@example.com',
      'Thank you, Tom. The company will get back to you in the morning about the quote.',
    ],
    inbox: ['Tom', 'Quote for air conditioning', 'Today, 02:07', 'tom@example.com'],
    big: { q: 'How much is it?', a: 'From 3400 PLN. Quote by morning.' },
  },

  asks: {
    title: 'Hundreds of questions every day.',
    titleAccent: 'Not one goes unanswered.',
    lead: 'Delivery, returns, dates, prices. The assistant answers every one, and you take care of the rest.',
    questions: [
      'How much is delivery?', 'Do you have size M?', 'How do I return a product?', 'How long is the promo on?',
      'Do you issue invoices?', 'How long is shipping?', 'Can I pay by card?', 'Are you open on weekends?',
      'Do you have a physical store?', 'How do I book a visit?', 'Is there a warranty?', 'Do you ship abroad?',
    ],
    answered: 'answered in about 2 s',
    stepsAria: 'What changes',
    steps: [
      'Repeat questions no longer land in your inbox.',
      'The client gets an answer right away, instead of looking for it at a competitor.',
      'The first client and the hundredth get an equally concrete answer, with no bad days or queues.',
    ],
    race: {
      question: 'How much is a tyre change?',
      answer: 'A full set is 160 PLN. Shall I pass a booking request?',
      form: {
        title: 'Contact form',
        steps: ['The client sends a question at 9:40 p.m.', 'The message waits in the inbox until morning.', 'The answer comes the next day.'],
        time: 'hours or the next day',
      },
      bot: {
        title: 'AI assistant',
        steps: ['The client asks at 9:40 p.m.', 'The answer comes right away.', 'An inquiry with contact details waits for you.'],
        time: 'about 2 s',
      },
    },
    crowd: [
      { q: 'Do you have size M?', a: 'Yes, M is in stock.' },
      { q: 'How do I return a product?', a: 'You have 30 days. Want the steps?' },
      { q: 'Do you issue invoices?', a: 'Yes, you will get it by email.' },
      { q: 'Are you open on weekends?', a: 'Saturdays from 9 a.m. to 2 p.m.' },
      { q: 'How do I book a visit?', a: 'Name the day and I will pass it on.' },
      { q: 'Is there a warranty?', a: 'Yes, 24 months on every product.' },
    ],
    crowdNote: 'All these conversations happen at the same moment.',
  },

  know: {
    title: 'It knows your offer.',
    titleAccent: 'It never makes things up.',
    lead: 'Better than a new hire on day one. And when it does not know something, it says so.',
    askLabel: 'Ask something',
    firm: 'Szprycha bike shop',
    center: 'Assistant',
    team: 'Your team',
    nodes: ['Pricing', 'Product descriptions', 'Terms', 'Opening hours', 'FAQ'],
    sourceLabel: 'from your materials:',
    handLabel: 'no guessing:',
    items: [
      { q: 'How much is delivery?', a: 'Courier is 14.99 PLN, and delivery is free from 200 PLN. Shipping within 24 h.', src: 'delivery rates' },
      { q: 'Can I return a product?', a: 'Yes, you have 30 days to return it, no reason needed.', src: 'terms' },
      { q: 'Are you open on weekends?', a: 'The shop is open on Saturdays from 9 a.m. to 2 p.m. I answer around the clock.', src: 'opening hours' },
      {
        q: 'Will this frame fit someone 190 cm tall?',
        a: 'That is not in my materials, so I will not guess. I am passing the question to the team with the whole conversation. Will you leave your email?',
        src: 'passed to your team',
      },
    ],
    stepsAria: 'How the assistant knows what to say',
    steps: [
      'It learns from your pricing, descriptions and FAQ.',
      'It answers with what is in your materials. Every fact has its source.',
      'When a question goes beyond its knowledge, it does not make things up. It hands the conversation to your team.',
    ],
    sheets: [
      { name: 'Pricing', lines: ['Courier delivery: 14.99 PLN', 'Free delivery from 200 PLN'] },
      { name: 'Product descriptions', lines: ['Aluminium frame, sizes S-XL', '24 month warranty'] },
      { name: 'Terms', lines: ['Returns within 30 days', 'No reason needed'] },
      { name: 'Opening hours', lines: ['Saturday: 9 a.m. to 2 p.m.', 'Sunday: closed'] },
      { name: 'FAQ', lines: ['Do you issue invoices?', 'Yes, on request'] },
    ],
    cite: {
      q: 'How much is delivery?',
      parts: [
        { text: 'Courier is ' }, { text: '14.99 PLN', ref: 1 }, { text: ', and ' },
        { text: 'delivery is free from 200 PLN', ref: 2 }, { text: '.' },
      ],
      notes: [
        { doc: 'Pricing', line: 'Courier delivery: 14.99 PLN' },
        { doc: 'Pricing', line: 'Free delivery from 200 PLN' },
      ],
      miss: {
        q: 'Will this frame fit someone 190 cm tall?',
        text: 'That is not in my materials. I will not guess.',
        note: 'not in the materials',
        hand: 'The question and the whole conversation go to your team.',
      },
    },
    big: [
      { q: 'How much is delivery?', value: '14.99', unit: 'PLN', say: 'Courier is 14.99 PLN, and delivery is free from 200 PLN.', src: 'delivery rates' },
      { q: 'Can I return a product?', value: '30', unit: 'days', say: 'You have 30 days to return it, no reason needed.', src: 'terms' },
      { q: 'Is there a warranty?', value: '24', unit: 'months', say: 'Yes, every bike comes with a 24 month warranty.', src: 'product descriptions' },
    ],
    wall: [
      { doc: 'Pricing', facts: ['Courier delivery: 14.99 PLN', 'Free delivery from 200 PLN', 'Bike check-up: 120 PLN', 'Inner tube change: 30 PLN', 'Gear adjustment: 40 PLN'] },
      { doc: 'Product descriptions', facts: ['Aluminium frame, sizes S-XL', '24 month warranty', 'Hydraulic disc brakes', '28 inch wheels', 'Weight 11.8 kg'] },
      { doc: 'Terms', facts: ['Returns within 30 days', 'No reason needed', 'Complaints handled within 14 days', 'Refund by the same method'] },
      { doc: 'Opening hours', facts: ['Saturday: 9 a.m. to 2 p.m.', 'Sunday: closed', 'Monday to Friday: 10 a.m. to 6 p.m.', 'Workshop open until 5 p.m.'] },
      { doc: 'FAQ', facts: ['Do you issue invoices?', 'Yes, on request', 'Can I pay by card? Yes', 'Do you assemble the bike before shipping? Yes'] },
    ],
  },

  voice: {
    title: 'It sounds like',
    titleAccent: 'your brand.',
    lead: 'It speaks in your tone and in your client’s language, and the chat window looks like part of your site. The client never feels they are talking to an off-the-shelf bot.',
    trade: {
      label: 'What do you do?',
      hint: 'Pick your line of work and see how the assistant talks to your client.',
      toneLabel: 'Tone:',
      replay: 'Play again',
      items: [
        {
          name: 'Hair salon',
          firm: 'Mila Salon',
          tone: 'warm, first names',
          lines: [
            'Hi, how much is a hair colour?',
            'Hi! Colouring starts at 280 PLN, depending on hair length. Shall I pass a booking request to the salon?',
            'Yes, Saturday morning. Anna, anna@example.com',
            'Done, Anna. The salon will confirm the time as soon as it opens.',
          ],
          inbox: ['Anna', 'Hair colouring', 'Saturday morning', 'anna@example.com'],
        },
        {
          name: 'Car workshop',
          firm: 'North Garage',
          tone: 'short and to the point',
          lines: [
            'Hello, how much is a brake pad change on a Golf 7?',
            'Hello. Front pads start at 220 PLN with labour, usually an hour of work. Shall I pass a booking request to the workshop?',
            'Yes, Thursday morning. Marek, marek@example.com',
            'Noted: Thursday morning, front pads, Golf 7. The workshop will confirm the time.',
          ],
          inbox: ['Marek', 'Brake pads, VW Golf 7', 'Thursday morning', 'marek@example.com'],
        },
        {
          name: 'Online store',
          firm: 'Ziarno Roastery',
          tone: 'light, with passion',
          lines: [
            'When do I need to order to get the coffee by Friday?',
            'Order by Wednesday noon and the parcel leaves the same day. By courier or to a parcel locker, usually 1-2 days.',
            'And what do you recommend for pour over? My email: ola@example.com',
            'For pour over, go for Ethiopia or Colombia, light roast. I am passing your question to the roastery, they will reply by email.',
          ],
          inbox: ['Ola', 'Coffee for pour over, delivery by Friday', 'Tonight', 'ola@example.com'],
        },
        {
          name: 'Practice',
          firm: 'Ruch Physio',
          tone: 'calm and caring',
          lines: [
            'My shoulder has hurt for a week. Is that something you treat?',
            'Yes, we treat shoulder pain. I will not diagnose it in a chat, a physiotherapist does that at the first visit: 50 minutes, 180 PLN. Shall I pass a booking request?',
            'Yes, after 5 p.m. if possible. Piotr, piotr@example.com',
            'Noted, Piotr. The practice will get back to you in the morning with free slots after 5 p.m.',
          ],
          inbox: ['Piotr', 'Shoulder pain, first visit', 'After 5 p.m.', 'piotr@example.com'],
        },
      ],
    },
    dial: {
      toneLabel: 'Tone',
      question: 'How late are you open on Saturday?',
      tones: [
        { name: 'Formal', answer: 'Good evening. On Saturdays the restaurant is open until 10 p.m. May I help you with anything else?' },
        { name: 'Natural', answer: 'We are open until 10 p.m. on Saturdays. Anything else I can help with?' },
        { name: 'Casual', answer: 'Saturdays we are around till 10. Come on over!' },
      ],
      langLabel: 'Language',
      langs: [
        { name: 'English', q: 'How late are you open on Saturday?', a: 'We are open until 10 p.m. on Saturdays. Anything else I can help with?' },
        { name: 'Polski', q: 'Do której macie otwarte w sobotę?', a: 'W soboty mamy otwarte do 22:00. Pomóc w czymś jeszcze?' },
        { name: 'Deutsch', q: 'Wie lange haben Sie am Samstag geöffnet?', a: 'Samstags haben wir bis 22 Uhr geöffnet. Kann ich sonst noch helfen?' },
        { name: 'Українська', q: 'До котрої ви працюєте в суботу?', a: 'У суботу ми працюємо до 22:00. Чим ще можу допомогти?' },
      ],
    },
    stepsAria: 'Conversations in many languages',
    steps: [
      'Clients write their own way, each in a different language.',
      'The assistant recognises the language and answers in it right away.',
      'And you have ready inquiries in your inbox.',
    ],
  },

  scope: {
    title: 'What exactly',
    titleAccent: 'you get.',
    termLabel: 'Quote and timeline',
    termValue: 'in 24 h',
    items: [
      { title: 'An assistant on your site', text: 'A chat window in the corner of every page, on desktop and on mobile.' },
      { title: 'Knowledge of your business', text: 'It knows your pricing, descriptions and your clients’ most common questions.' },
      { title: 'Your brand tone and look', text: 'The language, the way of speaking and the window colours matched to your site.' },
      { title: 'Conversations in many languages', text: 'The client writes their own way, the assistant answers in their language.' },
      { title: 'Ready inquiries', text: 'The client’s question, contact details and what they need go straight to you.' },
      { title: 'Handover to a person', text: 'When a question goes beyond its knowledge, the assistant does not make things up and hands the conversation to your team.' },
    ],
    talk: {
      hello: 'This part of the page answers like the assistant. Pick a question and you get the answer right away.',
      askLabel: 'Ask something',
      you: 'You',
      done: 'Those are all the questions on the list. Ask the real assistant about the rest.',
      items: [
        {
          q: 'How does it know what to say?',
          title: 'It knows your offer',
          text: 'It learns from your pricing, descriptions and FAQ. It knows your offer better than a new hire on day one.',
          show: ['pricing', 'product descriptions', 'FAQ', 'terms', 'delivery', 'returns', 'warranty'],
        },
        {
          q: 'What if a client writes at night?',
          title: 'It works around the clock',
          text: 'At night, on weekends and on holidays. Your client never finds the door closed and waits about 2 s for an answer.',
          show: ['02:47', 'the assistant answers', 'a form waits until morning'],
        },
        {
          q: 'What if it does not know?',
          title: 'It never makes things up',
          text: 'When a question goes beyond its knowledge, it says so. It hands the client to your team with the full conversation, instead of losing trust with wrong information.',
          show: ['Assistant', 'Your team', 'with the whole conversation'],
        },
        {
          q: 'Will it sound like my company?',
          title: 'It sounds like your brand',
          text: 'It speaks in your tone and in your client’s language, and the chat window looks like part of your site. The client never feels they are talking to an off-the-shelf bot.',
          show: ['Good morning, how can I help?', 'Hey! What are you looking for?', 'Welcome. Please describe your case.'],
        },
        {
          q: 'What is in it for me?',
          title: 'Ready inquiries in your inbox',
          text: 'The client gets an answer right away, and in the morning you have their question, contact details and what they need in your inbox.',
          show: ['New inquiry', 'Anna', 'Installation quote', 'anna@example.com'],
        },
      ],
    },
  },

  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the assistant to it.',
    cta: 'Free consultation',
  },
};

export const chatbotsCopy: Record<Locale, ChatbotsCopy> = { pl: typo(PL_COPY), en: EN_COPY };
