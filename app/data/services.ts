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
	CheckCircle2,
} from 'lucide-react'

export const services = [
	{
		id: 'dev',
		slug: 'strony-www',
		label: 'Strony WWW',
		icon: Code2,
		description: 'Od prostych wizytówek, przez wygodny WordPress, aż po dedykowane systemy.',
		longDescription: 'Tworzymy oprogramowanie klasy enterprise...',
		cards: [
			{
				title: 'Strona Wizytówka / One-Page',
				desc: 'Prosta konstrukcja bez podstron. Wszystkie kluczowe informacje - oferta, o nas, kontakt - dostępne natychmiast po wejściu na stronę. Szybka i bardzo czytelna dla Twoich klientów.',
				icon: Globe,
				href: '/uslugi/strony-www/one-page',
				// 👇 NOWE POLE
				fullDescription:
					'Idealne rozwiązanie dla małych firm i freelancerów. Strona typu One-Page to skondensowana dawka informacji, która prowadzi klienta prostą ścieżką od zapoznania się z ofertą, przez zaufanie, aż do kontaktu. Projektujemy je tak, aby ładowały się w ułamku sekundy i świetnie wyglądały na telefonach.',
				// 👇 NOWE POLE
				features: [
					'Szybki czas realizacji (3-5 dni)',
					'Pełna responsywność (RWD)',
					'Sekcja formularza kontaktowego',
					'Podstawowa optymalizacja SEO',
					'Integracja z Google Maps',
				],
				techStack: ['Html', 'SCSS', 'JavaScript', 'Cloudflare'],
			},
			{
				title: 'Profesjonalna Strona Firmowa',
				desc: 'WordPress w wydaniu Premium. Dzięki integracji z "IMPREZA" zyskujesz szybkość, dostępność i SEO bez utraty wygody edycji.',
				icon: Globe,
				href: '/uslugi/strony-www/profesjonalna-strona-firmowa',
				fullDescription: `Twoja strona będzie otwarta na każdego klienta. Projekt opieramy na systemie WordPress i zaawansowanym motywie "IMPREZA", co pozwala nam połączyć intuicyjną edycję z technologiczną doskonałością. Kod strony jest zoptymalizowany tak, aby zapewnić błyskawiczne działanie i wysokie pozycje w wyszukiwarkach, a jednocześnie spełniać standardy dostępności cyfrowej. Dzięki temu Twoja oferta dociera do szerszego grona odbiorców, nie wykluczając nikogo.`,
				features: [
					'Indywidualny projekt graficzny',
					'System zarządzania treścią (CMS)',
					'Integracja z Google Maps oraz opiniami Google',
					'Optymalizacja Core Web Vitals',
					'Wielojęzyczność',
					'Szkolenie z obsługi panelu',
				],
				techStack: ['WordPress', 'Impreza Theme', 'ALL in One SEO', 'Cloudflare'],
			},
			{
				title: 'Strony Szyte na Miarę',
				desc: 'Dedykowane strony na React/Next.js. Wolność twórcza bez kompromisów, niesamowita wydajność i nowoczesne zarządzanie treścią (Headless CMS).',
				icon: Globe,
				href: '/uslugi/strony-www/dedykowane-strony-www',
				fullDescription: `To propozycja dla firm, które nie mieszczą się w standardowych ramy. Rezygnujemy z gotowych motywów na rzecz stron kodowanych od zera ("custom") w technologii React, Next.js i Tailwind. Dzięki temu otrzymujesz witrynę pełną niestandardowych układów i płynnych animacji, które przykuwają uwagę klienta.`,
				features: [
					'Unikalny design', // Zamiast zwykłego "indywidualny"
					'Ultra-szybkie ładowanie', // Kluczowa zaleta Next.js
					'Płynne animacje i efekty', // To wyróżnia Reacta (Framer Motion/GSAP)
					'Maksymalne bezpieczeństwo', // Bezpieczeństwo statycznej strony
					'Perfekcyjne wyniki PageSpeed', // SEO techniczne
					'Pełna skalowalność projektu', // Gotowość na rozwój
				],
				techStack: ['React', 'Next.js', 'Tailwind CSS', 'Headless CMS', 'Cloudflare'],
			},
			{
				title: 'Sklepy E-commerce',
				desc: 'Sprzedawaj skutecznie 24/7. Łączymy potężne możliwości WooCommerce z wydajnością motywu "IMPREZA". Otrzymujesz szybki, bezpieczny sklep, który jest łatwy w obsłudze i gotowy na duży ruch.',
				icon: Smartphone,
				href: '/uslugi/strony-www/sklepy-internetowe',
				fullDescription: `Tworzymy sklepy, które realnie sprzedają. Całość opieramy na stabilnym duecie WordPress + WooCommerce, wspartym przez motyw "IMPREZA". To strategiczne połączenie gwarantuje, że Twój sklep ładuje się błyskawicznie (co jest kluczowe dla konwersji) i działa płynnie na każdym urządzeniu mobilnym. Wdrażamy pełną automatyzację: od szybkich płatności (BLIK, karty), przez integracje z kurierami, aż po intuicyjny panel, w którym samodzielnie dodasz produkty i obsłużysz zamówienia bez konieczności posiadania wiedzy informatycznej.`,
				features: [
					'Integracja z Przelewy24 / Stripe',
					'Filtrowanie i warianty produktów',
					'Szybki koszyk zakupowy',
					'Integracja z kurierami (InPost, DPD)',
					'Panel zarządzania zamówieniami',
				],
				techStack: ['WordPress', 'Impreza Theme', 'ALL in One SEO', 'WooCommerce', 'Cloudflare'],
			},
		],
	},
	{
		id: 'design',
		slug: 'design',
		label: 'Design & UI/UX',
		icon: Palette,
		description: 'Nie tylko ładne obrazki. Projektujemy ścieżki użytkownika, które prowadzą prosto do zakupu.',
		longDescription: 'Design to nie tylko estetyka, to funkcja...',
		cards: [
			{
				title: 'Design stron internetowych',
				desc: 'Makiety High-Fidelity i prototypowanie interakcji.',
				icon: Palette,
				href: '/uslugi/design/design-stron-internetowych',
				fullDescription:
					'Tworzymy kompleksowe projekty interfejsów dla aplikacji webowych i mobilnych. Skupiamy się na użyteczności (UX) i atrakcyjności wizualnej (UI), dostarczając gotowe makiety i systemy, które programiści mogą łatwo wdrożyć.',
				features: [
					'Badania potrzeb użytkowników',
					'Wireframing i makiety Lo-Fi',
					'Prototypy interaktywne (Figma)',
					'Testy użyteczności',
					'Dokumentacja dla deweloperów',
					'Wsparcie podczas wdrożenia',
				],
			},
		],
	},
	{
		id: 'ai',
		slug: 'ai',
		label: 'Automatyzacja AI',
		icon: Bot,
		description: 'Zatrudnij technologię zamiast kolejnych pracowników. Automatyzujemy nudne procesy.',
		longDescription: 'Sztuczna inteligencja zmienia zasady gry...',
		cards: [
			{
				title: 'Chatboty AI',
				desc: 'Obsługa klienta 24/7 bez udziału człowieka.',
				icon: Bot,
				href: '/uslugi/ai/chatboty',
				fullDescription:
					'Wdrażamy inteligentne asystenty AI oparte o modele GPT, które rozumieją kontekst, odpowiadają na pytania klientów, umawiają spotkania i sprzedają Twoje produkty przez całą dobę, w każdym języku.',
				features: [
					'Obsługa klienta 24/7',
					'Integracja z bazą wiedzy firmy',
					'Wsparcie wielu języków',
					'Zbieranie leadów sprzedażowych',
					'Personalizacja odpowiedzi',
				],
			},
		],
	},
	{
		id: 'marketing',
		slug: 'marketing',
		label: 'Marketing i Sprzedaż',
		icon: BarChart,
		description: 'Nawet najlepszy produkt potrzebuje widowni. Dostarczamy precyzyjny ruch.',
		longDescription: 'Marketing oparty na danych to nasza specjalność...',
		cards: [
			{
				title: 'Audyt SEO & Wydajności',
				desc: 'Pozycjonowanie oparte na wydajności i Core Web Vitals.',
				icon: Search,
				href: '/uslugi/marketing/audyt-seo-wydajnosci',
				fullDescription:
					'Dogłębna analiza Twojej strony pod kątem widoczności w Google. Sprawdzamy błędy techniczne, strukturę treści, profil linków oraz szybkość ładowania, przygotowując gotowy plan naprawczy.',
				features: [
					'Audyt techniczny strony',
					'Analiza słów kluczowych',
					'Optymalizacja SEo oraz wydajności',
					'Strategia treści',
					'Raport wdrożeniowy',
				],
			},
		],
	},
]
