export const projects = [
    {
        id: 4,
        slug: "mcentrumfizjoterapia", // To będzie w adresie URL
        title: "Gabinet Fizjoterapii Mcentrum",
        category: "Strona WWW", // Musi pasować do filtrów
        year: "2025",
        client: "Mcentrumfizjoterapia",
        description: "Start nowej marki i całkowita dominacja lokalnego rynku SEO.",
        mainImage: "/portfolio/mcentrumgabinet.webp", // Pamiętaj o folderze public
        mockupImage: "/portfolio/mcentrum-full-screen.webp",
        gallery: ["/portfolio/gaelria-mcentrum-1.webp", "/portfolio/galeria-mcentrum-2.webp"], // Dodatkowe zdjęcia
        
        // Logika linkowania
        hasCaseStudy: true, 
        externalLink: "https://mcentrumfizjoterapia.pl", // Opcjonalny link Live

        // Szczegóły Case Study
        challenge: "Wejście na rynek lokalny jako nowa marka. Klient potrzebował widoczności oraz umocnienia wizerunku.",
        solution: "Stworzyliśmy wydajną stronę zoptymalizowaną pod SEO. Dzięki błyskawicznemu ładowaniu i strukturze danych, strona zajęła 1. miejsce w lokalnych wynikach wyszukiwania już po jednym miesiącu, a wprowadzenie booksy ułatwiło rezerwacje nowym i starym klientom.",
        stats: [
            { label: "Wzrost rezerwacji", value: "Duży" },
            { label: "Czas ładowania", value: "<1s" },
            { label: "Pozycja w wyszukiwarce", value: "Nr 1" }
        ],
        techStack: ["CMS", "Booksy", "CloudFlare"]
    },
    {
        id: 2,
        slug: "klub-sportowy",
        title: "Klub Sportowy",
        category: "Strona WWW",
        year: "2025",
        client: "Radzyński Klub Sportowy",
        description: "Strona internetowa dla Radzyńskiego Klubu Sportowego.",
        mainImage: "/portfolio/klubsportowy.webp",
        
        hasCaseStudy: false, // TYLKO LINK ZEWNĘTRZNY
        externalLink: "https://klubsportowyrks.pl",
        
        // Te pola mogą być puste, bo hasCaseStudy = false
        gallery: [],
        challenge: "",
        solution: "",
        stats: [],
        techStack: ["CMS", "Cloudflare"]
    },
    {
        id: 3,
        slug: "wirtualny-asystent-ai",
        title: "Wirtualny Asystent AI",
        category: "AI & Boty",
        year: "2025",
        client: "Avenly",
        description: "Nasz własny asystent AI - odpowiada na pytania, kwalifikuje leady i pracuje za Ciebie 24/7.",
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