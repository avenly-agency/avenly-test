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
				desc: 'Szybki start dla Twojego biznesu. Zdobądź widoczność w sieci dzięki czytelnej wizytówce, która natychmiast odpowiada na pytania klientów i zachęca do kontaktu.',
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
				iconColor: 'text-indigo-400 bg-indigo-500/[0.12]',
				gradient: 'from-indigo-500/20 to-blue-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(99,102,241,0.18)]',
			},
			{
				title: 'Profesjonalna Strona Firmowa',
				desc: 'Zarządzaj swoją ofertą bez wiedzy technicznej. Otrzymujesz potężny system (CMS) zoptymalizowany pod wyszukiwarkę Google i otwarty na rozwój Twojego biznesu.',
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
				iconColor: 'text-emerald-400 bg-emerald-500/[0.12]',
				gradient: 'from-emerald-500/20 to-teal-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
			},
			{
				title: 'Strony Szyte na Miarę',
				desc: 'Zostaw konkurencję w tyle dzięki niesamowitej wydajności. Zyskujesz ultra-szybką, bezpieczną witrynę, która ładuje się natychmiast i drastycznie zwiększa konwersję.',
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
				iconColor: 'text-purple-400 bg-purple-500/[0.12]',
				gradient: 'from-purple-500/20 to-fuchsia-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(168,85,247,0.18)]',
			},
			{
				title: 'Sklepy E-commerce',
				desc: 'Zarabiaj na autopilocie 24/7. Otrzymujesz stabilny, gotowy do sprzedaży sklep, w pełni zintegrowany z płatnościami (BLIK, karty) i zautomatyzowany z kurierami.',
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
				iconColor: 'text-amber-400 bg-amber-500/[0.12]',
				gradient: 'from-amber-500/20 to-orange-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(217,119,6,0.18)]',
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
				desc: 'Otrzymasz projekt, który wygląda jak gotowa strona.',
				icon: Palette,
				href: '/uslugi/design/design-stron-internetowych',
				fullDescription:
					'Tworzymy kompleksowe projekty interfejsów dla aplikacji webowych i mobilnych. Skupiamy się na użyteczności (UX) i atrakcyjności wizualnej (UI), dostarczając gotowe makiety i systemy, które programiści mogą łatwo wdrożyć.',
				features: [
					'Badania potrzeb użytkowników',
					'Wireframing i makiety',
					'Testy użyteczności',
                    'Projektowanie responsywne',
				],
				iconColor: 'text-violet-400 bg-violet-500/[0.12]',
				gradient: 'from-violet-500/20 to-purple-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(139,92,246,0.18)]',
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
				iconColor: 'text-cyan-400 bg-cyan-400/[0.12]',
				gradient: 'from-cyan-400/20 to-teal-400/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.18)]',
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
				title: 'Audyt Wydajności & SEO',
				desc: '',
				icon: Search,
				href: '/uslugi/marketing/audyt-seo-wydajnosci',
				fullDescription:
					'Dogłębna analiza Twojej strony pod kątem widoczności w Google. Sprawdzamy błędy techniczne, strukturę treści, profil linków oraz szybkość ładowania, przygotowując gotowy plan naprawczy.',
				features: [
					'Audyt techniczny strony',
					'Analiza słów kluczowych',
					'Optymalizacja SEO oraz wydajności',
					'Strategia treści',
					'Raport wdrożeniowy',
				],
				iconColor: 'text-emerald-400 bg-emerald-500/[0.12]',
				gradient: 'from-emerald-500/20 to-teal-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
			},
		],
	},
]
