export const projects = [
    {
        id: 5,
        slug: "grawerstwo-kardys",
        title: "Grawerstwo Józef Kardyś",
        category: "Sklep internetowy", // 'sklep' → filtr Sklepy
        year: "2026",
        client: "Grawerstwo Józef Kardyś",
        description: "Strona firmowa, sklep internetowy i panel do zarządzania stroną oraz sklepem dla pracowni grawerskiej działającej od 1990 roku.",
        mainImage: "/portfolio/grawerstwo-kardys.webp",
        mockupImage: "/portfolio/grawerstwo-kardys-full-screen.webp",
        gallery: ["/portfolio/galeria-grawerstwo-1.webp", "/portfolio/galeria-grawerstwo-2.webp"],

        hasCaseStudy: true,
        externalLink: "https://grawerstwomielec.pl",

        challenge: "Pracownia z Mielca z ponad 30-letnim doświadczeniem obsługuje dwa różne światy: przemysł (stemple, matryce, formy wtryskowe, cechowanie) i klientów indywidualnych (trofea, pamiątki, pieczątki). W sieci miała jednak przestarzałą stronę na WordPressie i sklep, który przestał działać i od dawna nie przynosił zamówień. Potrzebne było jedno miejsce, które pokaże skalę oferty, pozwoli zamawiać produkty online i nie dołoży właścicielowi pracy przy obsłudze.",
        solution: "Pracownia dostała trzy połączone elementy. Strona firmowa w wersji polskiej i angielskiej prowadzi osobno klienta przemysłowego i indywidualnego, pokazuje realizacje i zbiera zapytania o wycenę. Sklep internetowy pozwala wybrać produkt i zapłacić online (BLIK, karta, szybki przelew przez Przelewy24), z kontem klienta, historią zamówień i możliwością powtórzenia zamówienia. Całość spina panel, w którym pracownia sama zarządza produktami, zamówieniami i realizacjami, bez udziału programisty.",
        stats: [
            { label: "Strona, sklep i panel", value: "3 w 1" },
            { label: "Wersje językowe", value: "PL / EN" },
            { label: "Sprzedaż online", value: "24/7" }
        ],
        techStack: ["Next.js", "Supabase", "Przelewy24", "Cloudflare"]
    },
    {
        id: 4,
        slug: "mcentrumfizjoterapia", // To będzie w adresie URL
        title: "Gabinet Fizjoterapii Mcentrum",
        category: "Strona WWW", // Musi pasować do filtrów
        year: "2025",
        client: "Mcentrumfizjoterapia",
        description: "Start nowej marki gabinetu fizjoterapii: szybka strona zbudowana pod lokalne wyszukiwanie i rezerwacja wizyt przez Booksy.",
        mainImage: "/portfolio/mcentrumgabinet.webp", // Pamiętaj o folderze public
        mockupImage: "/portfolio/mcentrum-full-screen.webp",
        gallery: ["/portfolio/gaelria-mcentrum-1.webp", "/portfolio/galeria-mcentrum-2.webp"], // Dodatkowe zdjęcia
        
        // Logika linkowania
        hasCaseStudy: true, 
        externalLink: "https://mcentrumfizjoterapia.pl", // Opcjonalny link Live

        // Szczegóły Case Study
        challenge: "Wejście na rynek lokalny jako nowa marka. Gabinet potrzebował widoczności w wyszukiwarce i wizerunku, który od pierwszej wizyty na stronie buduje zaufanie.",
        solution: "Gabinet dostał szybką stronę zbudowaną pod lokalne wyszukiwanie. Dzięki błyskawicznemu ładowaniu i danym strukturalnym już po miesiącu zajęła 1. miejsce w lokalnych wynikach wyszukiwania, a rezerwacja przez Booksy ułatwiła umawianie wizyt nowym i stałym pacjentom.",
        stats: [
            { label: "Rezerwacja wizyt", value: "Booksy" },
            { label: "Czas ładowania", value: "<1s" },
            { label: "Pozycja w wyszukiwarce", value: "Nr 1" }
        ],
        techStack: ["CMS", "Booksy", "Cloudflare"]
    },
    {
        id: 2,
        slug: "klub-sportowy",
        title: "Klub Sportowy",
        category: "Strona WWW",
        year: "2025",
        client: "Radzyński Klub Sportowy",
        description: "Pełna modernizacja strony klubu siatkarskiego, aplikacja do zarządzania klubem i prowadzenie social mediów na co dzień.",
        mainImage: "/portfolio/klubsportowy.webp",
        mockupImage: "/portfolio/klubsportowy-full-screen.webp",

        hasCaseStudy: true,
        externalLink: "https://klubsportowyrks.pl",

        gallery: [],
        // Punkt wyjścia (poprawka właściciela 2026-10-08): klub MIAŁ już stronę na WordPressie - to modernizacja strony + aplikacja klubowa, nie pierwsza strona.
        challenge: "Klub z III ligi z własną akademią siatkówki miał już stronę na WordPressie, ale potrzebował takiej, która nadąża za sezonem: kibic szuka terminarza i składu, rodzic zapisów do akademii, a sponsor konkretnej oferty współpracy. Zarząd i trenerzy potrzebowali też jednego miejsca na składki, treningi i obecności, a klub chciał spójnej, regularnej komunikacji w mediach społecznościowych.",
        solution: "Klub dostał zmodernizowaną stronę w miejsce dotychczasowej na WordPressie: identyfikacja w barwach klubu, najbliższy mecz i terminarz na pierwszym ekranie, profile zawodników, zapisy do akademii z podziałem na cztery grupy wiekowe oraz osobna strefa dla sponsorów. Obok działa aplikacja klubowa, w której zarząd, trenerzy, zawodnicy i rodzice prowadzą składki, kalendarz treningów, obecności i komunikację. Na co dzień prowadzimy też social media klubu (Facebook, Instagram, TikTok): zapowiedzi i relacje z meczów, nabory do akademii i komunikację ze sponsorami, w jednym stylu ze stroną.",
        stats: [
            { label: "Strona i aplikacja klubowa", value: "WWW + app" },
            { label: "Prowadzone kanały", value: "3" },
            { label: "Grupy w akademii", value: "4" }
        ],
        techStack: ["Next.js", "Supabase", "Resend", "Cloudflare"]
    },
    {
        id: 3,
        slug: "wirtualny-asystent-ai",
        title: "Wirtualny Asystent AI",
        category: "AI & Boty",
        year: "2025",
        client: "Avenly",
        description: "Asystent AI na stronie Avenly - odpowiada na pytania o ofertę o każdej porze i przekazuje zespołowi gotowe zapytania.",
        mainImage: "/portfolio/avenly-chatbot.webp",

        hasCaseStudy: false,
        externalLink: "",
        openChat: true,

        challenge: "",
        solution: "",
        stats: [],
        techStack: ["Claude AI", "Next.js", "TypeScript"]
    }
];