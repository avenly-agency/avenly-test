export const projects = [
    {
        id: 4,
        slug: "mcentrumfizjoterapia", // To będzie w adresie URL
        title: "Mcentrumfizjoterapia",
        category: "Strona WWW", // Musi pasować do filtrów
        year: "2024",
        client: "Estetic Dent",
        description: "Rebranding marki i wdrożenie systemu rezerwacji wizyt online. Skrócenie czasu obsługi recepcji o 40%.",
        mainImage: "/portfolio/mcentrumgabinet.webp", // Pamiętaj o folderze public
        gallery: ["/portfolio/dental-1.jpg", "/portfolio/dental-2.jpg"], // Dodatkowe zdjęcia
        
        // Logika linkowania
        hasCaseStudy: true, 
        externalLink: "https://mcentrumfizjoterapia.pl", // Opcjonalny link Live

        // Szczegóły Case Study
        challenge: "Klient tracił pacjentów przez przestarzałą stronę, która nie działała na telefonach. Recepcja była przeciążona telefonami.",
        solution: "Zaprojektowaliśmy nową identyfikację wizualną i wdrożyliśmy system rezerwacji (Calendly API). Strona ładuje się w 0.5s.",
        stats: [
            { label: "Wzrost rezerwacji", value: "+140%" },
            { label: "Czas ładowania", value: "0.5s" },
            { label: "Mniej telefonów", value: "-40%" }
        ],
        techStack: ["Wordpress", "IMPREZA", "Booksy"]
    },
    {
        id: 2,
        slug: "sklep-auto-parts",
        title: "E-commerce Auto Parts",
        category: "Sklepy",
        year: "2023",
        client: "AutoMaster",
        description: "Sklep z zaawansowaną wyszukiwarką części po numerze VIN. Integracja z hurtowniami.",
        mainImage: "/portfolio/autoparts.jpg",
        
        hasCaseStudy: false, // TYLKO LINK ZEWNĘTRZNY
        externalLink: "https://automaster-demo.pl",
        
        // Te pola mogą być puste, bo hasCaseStudy = false
        gallery: [],
        challenge: "",
        solution: "",
        stats: [],
        techStack: ["WooCommerce", "React", "Algolia"]
    },
    {
        id: 3,
        slug: "ai-law-bot",
        title: "AI Law Chatbot",
        category: "AI & Boty",
        year: "2024",
        client: "Kancelaria Prawna",
        description: "Inteligentny asystent wstępnie kwalifikujący klientów. Działa 24/7.",
        mainImage: "/portfolio/law-ai.jpg",
        
        hasCaseStudy: true,
        externalLink: "", 
        
        challenge: "Prawnicy tracili 3h dziennie na odpowiadanie na proste pytania.",
        solution: "Wdrożyliśmy bota opartego o OpenAI, który odpowiada na pytania z bazy wiedzy kancelarii i umawia spotkania.",
        stats: [
            { label: "Oszczędność czasu", value: "60h/msc" },
            { label: "Dostępność", value: "24/7" }
        ],
        techStack: ["Python", "OpenAI API", "Vector DB", "React"]
    }
];