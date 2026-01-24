// app/data/services.ts

import {
    Code2,
    Palette,
    Bot,
    BarChart,
    Globe,
    Smartphone,
    Layers,
    Cpu,
    Search,
    Megaphone,
    CheckCircle2
} from 'lucide-react';

export const services = [
    {
        id: 'dev',
        slug: 'strony-www', 
        label: 'Strony WWW',
        icon: Code2,
        description: 'Solidny kod to fundament. Budujemy skalowalne aplikacje i strony, które działają błyskawicznie.',
        longDescription: "Tworzymy oprogramowanie klasy enterprise...", 
        cards: [
            { 
                title: 'Strona Wizytówka / One-Page', 
                desc: 'Prosta konstrukcja bez podstron. Wszystkie kluczowe informacje - oferta, o nas, kontakt - dostępne natychmiast po wejściu na stronę. Szybka i bardzo czytelna dla Twoich klientów.', 
                icon: Globe,
                href: '/uslugi/strony-www/one-page',
                // 👇 NOWE POLE
                fullDescription: "Idealne rozwiązanie dla małych firm i freelancerów. Strona typu One-Page to skondensowana dawka informacji, która prowadzi klienta prostą ścieżką od zapoznania się z ofertą, przez zaufanie, aż do kontaktu. Projektujemy je tak, aby ładowały się w ułamku sekundy i świetnie wyglądały na telefonach.",
                // 👇 NOWE POLE
                features: [
                    "Szybki czas realizacji (3-5 dni)",
                    "Pełna responsywność (RWD)",
                    "Sekcja formularza kontaktowego",
                    "Podstawowa optymalizacja SEO",
                    "Integracja z Google Maps",
                ]
            },
            { 
                title: 'Profesjonalna Strona Firmowa', 
                desc: 'WordPress w wydaniu Premium. Dzięki integracji z "IMPREZA" zyskujesz szybkość, dostępność i SEO bez utraty wygody edycji.', 
                icon: Globe,
                href: '/uslugi/strony-www/profesjonalna-strona-firmowa',
                fullDescription: `Tworzymy strony otwarte na każdego klienta. Projekt opieramy na systemie WordPress i zaawansowanym motywie "IMPREZA", co pozwala nam połączyć intuicyjną edycję z technologiczną doskonałością. Kod strony jest zoptymalizowany tak, aby zapewnić błyskawiczne działanie i wysokie pozycje w wyszukiwarkach, a jednocześnie spełniać standardy dostępności cyfrowej. Dzięki temu Twoja oferta dociera do szerszego grona odbiorców, nie wykluczając nikogo.`,
                features: [
                    "Indywidualny projekt graficzny",
                    "System zarządzania treścią (CMS)",
                    "Integracja z Google Maps oraz opiniami Google",
                    "Optymalizacja Core Web Vitals",
                    "Wielojęzyczność",
                    "Szkolenie z obsługi panelu"
                ]
            },
            { 
                title: 'Strony Szyte na Miarę', 
                desc: 'Dedykowane strony na React/Next.js. Wolność twórcza bez kompromisów, niesamowita wydajność i nowoczesne zarządzanie treścią (Headless CMS).', 
                icon: Globe,
                href: '/uslugi/strony-www/dedykowane-strony-www',
                fullDescription: `To propozycja dla firm, które nie mieszczą się w standardowych ramy. Rezygnujemy z gotowych motywów na rzecz stron kodowanych od zera ("custom") w technologii React, Next.js i Tailwind. Dzięki temu otrzymujesz witrynę wizualnie niepowtarzalną, pełną niestandardowych układów i płynnych animacji, które przykuwają uwagę klienta. Mimo zaawansowanej technologii, nie tracisz kontroli - wdrażamy lekki system Headless CMS, który pozwala Ci łatwo edytować teksty i zdjęcia, zachowując przy tym ultra-szybkie działanie strony.`,
                features: [
                    "Indywidualny projekt graficzny",
                    "System zarządzania treścią (CMS)",
                    "Integracja z Google Maps oraz opiniami Google",
                    "Optymalizacja Core Web Vitals",
                    "Wielojęzyczność",
                    "Szkolenie z obsługi panelu"
                ]
            },
            { 
                title: 'Sklepy E-commerce', 
                desc: 'Sprzedawaj skutecznie 24/7. Łączymy potężne możliwości WooCommerce z wydajnością motywu "IMPREZA". Otrzymujesz szybki, bezpieczny sklep, który jest łatwy w obsłudze i gotowy na duży ruch.', 
                icon: Smartphone,
                href: '/uslugi/strony-www/sklepy-internetowe',
                fullDescription: `Tworzymy sklepy, które realnie sprzedają. Całość opieramy na stabilnym duecie WordPress + WooCommerce, wspartym przez motyw "IMPREZA". To strategiczne połączenie gwarantuje, że Twój sklep ładuje się błyskawicznie (co jest kluczowe dla konwersji) i działa płynnie na każdym urządzeniu mobilnym. Wdrażamy pełną automatyzację: od szybkich płatności (BLIK, karty), przez integracje z kurierami, aż po intuicyjny panel, w którym samodzielnie dodasz produkty i obsłużysz zamówienia bez konieczności posiadania wiedzy informatycznej.`,
                features: [
                    "Integracja z Przelewy24 / Stripe",
                    "Filtrowanie i warianty produktów",
                    "Moduły Cross-selling i Up-selling",
                    "Szybki koszyk zakupowy",
                    "Integracja z kurierami (InPost, DPD)",
                    "Panel zarządzania zamówieniami"
                ]
            },
        ],
    },
    {
        id: 'design',
        slug: 'design',
        label: 'Design & UI/UX',
        icon: Palette,
        description: 'Nie tylko ładne obrazki. Projektujemy ścieżki użytkownika, które prowadzą prosto do zakupu.',
        longDescription: "Design to nie tylko estetyka, to funkcja...",
        cards: [
            { 
                title: 'Product Design', 
                desc: 'Makiety High-Fidelity i prototypowanie interakcji.', 
                icon: Palette,
                href: '/uslugi/design/product-design',
                fullDescription: "Tworzymy kompleksowe projekty interfejsów dla aplikacji webowych i mobilnych. Skupiamy się na użyteczności (UX) i atrakcyjności wizualnej (UI), dostarczając gotowe makiety i systemy, które programiści mogą łatwo wdrożyć.",
                features: [
                    "Badania potrzeb użytkowników",
                    "Wireframing i makiety Lo-Fi",
                    "Prototypy interaktywne (Figma)",
                    "Testy użyteczności",
                    "Dokumentacja dla deweloperów",
                    "Wsparcie podczas wdrożenia"
                ]
            },
            { 
                title: 'Rebranding', 
                desc: 'Nowa tożsamość wizualna, która wyróżni Cię z tłumu.', 
                icon: Layers,
                href: '/uslugi/design/rebranding',
                fullDescription: "Twoja marka potrzebuje odświeżenia? Pomożemy Ci zdefiniować na nowo Twój język wizualny. Od logo, przez dobór typografii i kolorystyki, aż po materiały marketingowe - stworzymy spójny wizerunek, który zapada w pamięć.",
                features: [
                    "Analiza obecnego wizerunku",
                    "Projektowanie logo i sygnetu",
                    "Księga znaku (Brand Book)",
                    "Materiały do social media",
                    "Wizytówki i papier firmowy",
                    "Strategia komunikacji wizualnej"
                ]
            },
            { 
                title: 'Design System', 
                desc: 'Spójność marki na każdym urządzeniu i kanale.', 
                icon: CheckCircle2,
                href: '/uslugi/design/design-system',
                fullDescription: "Dla dużych projektów tworzymy Design Systemy - biblioteki komponentów i zasad, które gwarantują spójność produktu i przyspieszają pracę zespołów deweloperskich o nawet 40%.",
                features: [
                    "Biblioteka komponentów UI",
                    "Zasady typografii i kolorów",
                    "Wytyczne dostępności (WCAG)",
                    "Tokeny projektowe",
                    "Dokumentacja online (np. Storybook)",
                    "Łatwe skalowanie produktu"
                ]
            },
        ],
    },
    {
        id: 'ai',
        slug: 'ai',
        label: 'Automatyzacja AI',
        icon: Bot,
        description: 'Zatrudnij technologię zamiast kolejnych pracowników. Automatyzujemy nudne procesy.',
        longDescription: "Sztuczna inteligencja zmienia zasady gry...",
        cards: [
            { 
                title: 'Chatboty Sprzedażowe', 
                desc: 'Obsługa klienta 24/7 bez udziału człowieka.', 
                icon: Bot,
                href: '/uslugi/ai/chatboty',
                fullDescription: "Wdrażamy inteligentne asystenty AI oparte o modele GPT, które rozumieją kontekst, odpowiadają na pytania klientów, umawiają spotkania i sprzedają Twoje produkty przez całą dobę, w każdym języku.",
                features: [
                    "Obsługa klienta 24/7",
                    "Integracja z bazą wiedzy firmy",
                    "Wsparcie wielu języków",
                    "Zbieranie leadów sprzedażowych",
                    "Integracja z Messenger/WhatsApp",
                    "Personalizacja odpowiedzi"
                ]
            },
            { 
                title: 'Workflow Automation', 
                desc: 'Łączymy Twoje CRM, maile i faktury w jeden organizm.', 
                icon: Cpu,
                href: '/uslugi/ai/automatyzacja-procesow',
                fullDescription: "Eliminujemy powtarzalne czynności biurowe. Łączymy systemy (Make.com/Zapier), automatyzujemy obieg dokumentów, generowanie raportów i powiadomienia, oszczędzając setki godzin pracy Twojego zespołu miesięcznie.",
                features: [
                    "Automatyzacja fakturowania",
                    "Synchronizacja danych między systemami",
                    "Automatyczne powiadomienia email/SMS",
                    "Zarządzanie leadami w CRM",
                    "Oszczędność czasu i redukcja błędów",
                    "Skalowalne scenariusze (Make.com)"
                ]
            },
            { 
                title: 'Analiza Danych AI', 
                desc: 'Wyciągamy wnioski z danych, których nie widzi ludzkie oko.', 
                icon: BarChart,
                href: '/uslugi/ai/analiza-danych',
                fullDescription: "Wykorzystujemy algorytmy uczenia maszynowego do analizy Twoich danych biznesowych. Przewidujemy trendy sprzedaży, segmentujemy klientów i wykrywamy anomalie, dając Ci przewagę konkurencyjną opartą na faktach.",
                features: [
                    "Predykcja sprzedaży",
                    "Segmentacja klientów",
                    "Analiza sentymentu opinii",
                    "Dashboardy decyzyjne",
                    "Optymalizacja stanów magazynowych",
                    "Raportowanie w czasie rzeczywistym"
                ]
            },
        ],
    },
    {
        id: 'marketing',
        slug: 'marketing',
        label: 'Marketing i Sprzedaż',
        icon: BarChart,
        description: 'Nawet najlepszy produkt potrzebuje widowni. Dostarczamy precyzyjny ruch.',
        longDescription: "Marketing oparty na danych to nasza specjalność...",
        cards: [
            { 
                title: 'Audyt SEO & Wydajności', 
                desc: 'Pozycjonowanie oparte na wydajności i Core Web Vitals.', 
                icon: Search,
                href: '/uslugi/marketing/audyt-seo-wydajnosci',
                fullDescription: "Dogłębna analiza Twojej strony pod kątem widoczności w Google. Sprawdzamy błędy techniczne, strukturę treści, profil linków oraz szybkość ładowania, przygotowując gotowy plan naprawczy.",
                features: [
                    "Audyt techniczny strony",
                    "Analiza słów kluczowych",
                    "Optymalizacja Core Web Vitals",
                    "Analiza konkurencji",
                    "Strategia contentowa",
                    "Raport wdrożeniowy"
                ]
            },
            
            { 
                title: 'Strategia Marketingowa', 
                desc: 'Treści, które budują autorytet i zaufanie.', 
                icon: Layers,
                href: '/uslugi/marketing/strategia-marketingowa',
                fullDescription: "Kompleksowy plan działania dla Twojej marki w internecie. Określamy grupy docelowe, kanały komunikacji (Social Media, Ads, Content) i budżety, aby zmaksymalizować zwrot z inwestycji (ROI).",
                features: [
                    "Analiza grupy docelowej (Persony)",
                    "Dobór kanałów komunikacji",
                    "Planowanie budżetu reklamowego",
                    "Lejek sprzedażowy",
                    "Harmonogram działań",
                    "Mierniki sukcesu (KPI)"
                ]
            },
        ],
    },
];