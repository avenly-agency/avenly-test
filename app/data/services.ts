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
        slug: 'development', // Służy do generowania ścieżki /uslugi/development
        label: 'Development',
        icon: Code2,
        description: 'Solidny kod to fundament. Budujemy skalowalne aplikacje i strony, które działają błyskawicznie.',
        // Tutaj możesz dodać długi opis, który wyświetli się na podstronie usługi
        longDescription: "Tworzymy oprogramowanie klasy enterprise...", 
        cards: [
            { 
                title: 'Strony WWW Premium', 
                desc: 'Next.js, React, animacje 60fps. Zero szablonów.', 
                icon: Globe,
                href: '/uslugi/development/strony-internetowe' 
            },
            { 
                title: 'Sklepy E-commerce', 
                desc: 'Headless Shopify/WooCommerce. Konwersja first.', 
                icon: Smartphone,
                href: '/uslugi/development/sklepy-internetowe'
            },
            { 
                title: 'Web Applications', 
                desc: 'Systemy SaaS, CRM i dedykowane panele klienta.', 
                icon: Layers,
                href: '/uslugi/development/aplikacje-webowe'
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
                href: '/uslugi/design/product-design'
            },
            { 
                title: 'Rebranding', 
                desc: 'Nowa tożsamość wizualna, która wyróżni Cię z tłumu.', 
                icon: Layers,
                href: '/uslugi/design/rebranding'
            },
            { 
                title: 'Design System', 
                desc: 'Spójność marki na każdym urządzeniu i kanale.', 
                icon: CheckCircle2,
                href: '/uslugi/design/design-system'
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
                href: '/uslugi/ai/chatboty'
            },
            { 
                title: 'Workflow Automation', 
                desc: 'Łączymy Twoje CRM, maile i faktury w jeden organizm.', 
                icon: Cpu,
                href: '/uslugi/ai/automatyzacja-procesow'
            },
            { 
                title: 'Analiza Danych AI', 
                desc: 'Wyciągamy wnioski z danych, których nie widzi ludzkie oko.', 
                icon: BarChart,
                href: '/uslugi/ai/analiza-danych'
            },
        ],
    },
    {
        id: 'marketing',
        slug: 'marketing',
        label: 'Growth Marketing',
        icon: BarChart,
        description: 'Nawet najlepszy produkt potrzebuje widowni. Dostarczamy precyzyjny ruch.',
        longDescription: "Marketing oparty na danych to nasza specjalność...",
        cards: [
            { 
                title: 'SEO Techniczne', 
                desc: 'Pozycjonowanie oparte na wydajności i Core Web Vitals.', 
                icon: Search,
                href: '/uslugi/marketing/pozycjonowanie-seo'
            },
            { 
                title: 'Kampanie Performance', 
                desc: 'Google Ads & Meta Ads nastawione na ROI.', 
                icon: Megaphone,
                href: '/uslugi/marketing/google-ads'
            },
            { 
                title: 'Content Strategy', 
                desc: 'Treści, które budują autorytet i zaufanie.', 
                icon: Layers,
                href: '/uslugi/marketing/content-marketing'
            },
        ],
    },
];