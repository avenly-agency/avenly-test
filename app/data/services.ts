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
		description: 'Od prostych wizytówek, przez wielostronicowe strony firmowe, aż po dedykowane systemy.',
		longDescription: 'Tworzymy oprogramowanie klasy enterprise...',
		cards: [
			{
				title: 'One-Page',
				desc: 'Jedna strona, jeden cel. Wszystkie najważniejsze informacje na jednej, szybkiej i przekonującej witrynie - idealna pod kampanie reklamowe i startujące projekty.',
				icon: Globe,
				href: '/uslugi/strony-www/one-page',
				fullDescription:
					'Idealne rozwiązanie dla startupów, freelancerów i kampanii reklamowych. Strona typu One-Page to skondensowana dawka informacji, która prowadzi klienta prostą ścieżką od zapoznania się z ofertą, przez zaufanie, aż do kontaktu. Kodujemy je w Next.js - ładują się w ułamku sekundy, świetnie wyglądają na telefonach i są zoptymalizowane pod konwersję.',
				features: [
					'Szybki czas realizacji (3-5 dni)',
					'Pełna responsywność (RWD)',
					'Sekcja formularza kontaktowego',
					'Podstawowa optymalizacja SEO',
					'Integracja z Google Maps',
				],
				techStack: ['Next.js', 'React', 'Tailwind CSS', 'Cloudflare'],
				iconColor: 'text-blue-400 bg-blue-500/[0.12]',
				gradient: 'from-blue-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(59,130,246,0.18)]',
			},
			{
				title: 'Strona firmowa',
				desc: 'Kompletna, wielostronicowa wizytówka biznesu. Sam dodajesz podstrony, blog i ofertę w prostym panelu CMS, bez pomocy programisty.',
				icon: Globe,
				href: '/uslugi/strony-www/strona-firmowa',
				fullDescription: `Profesjonalna, wielostronicowa strona firmowa na nowoczesnym, szybkim stacku. Sam edytujesz treści przez prosty panel CMS, a kod jest dostosowany pod Core Web Vitals i SEO. Dostajesz dopracowane moduły do układania podstron, integracje z mapami, opiniami Google, formularzami i wszystkim, czego potrzebujesz.`,
				features: [
					'Indywidualny projekt graficzny',
					'System zarządzania treścią (CMS)',
					'Integracja z Google Maps oraz opiniami Google',
					'Optymalizacja Core Web Vitals',
					'Wielojęzyczność',
					'Szkolenie z obsługi panelu',
				],
				techStack: ['Next.js', 'CMS', 'SEO', 'Cloudflare'],
				iconColor: 'text-emerald-400 bg-emerald-500/[0.12]',
				gradient: 'from-emerald-500/20 to-teal-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
			},
			{
				title: 'Strona Szyta na Miarę',
				desc: 'Najwyższa półka. Kodowana od zera w Next.js z Headless CMS - błyskawicznie szybka, w 100% autorski design, a treści nadal edytujesz sam.',
				icon: Globe,
				href: '/uslugi/strony-www/strona-szyta-na-miare',
				fullDescription: `Premium opcja dla marek, które chcą się wyróżniać. Frontend kodowany od zera w Next.js + Tailwind, content zasilany przez Headless CMS (Sanity, Strapi lub Payload - do wyboru). Łączymy maksymalną wydajność (PageSpeed 95-99), pełną swobodę projektową i komfort edycji przez nowoczesny panel CMS. Bez ograniczeń gotowych motywów, bez podatnych na ataki wtyczek, ze studyjnym panelem edycyjnym.`,
				features: [
					'Unikalny design kodowany od zera',
					'Ultra-szybkie ładowanie (PageSpeed 95-99)',
					'Headless CMS - edycja przez Sanity / Strapi / Payload',
					'Płynne animacje i efekty scroll-bound',
					'Maksymalne bezpieczeństwo (zero PHP, zero wtyczek)',
					'Pełna skalowalność i custom integracje',
				],
				techStack: ['Next.js', 'React', 'Tailwind CSS', 'Headless CMS (Sanity/Strapi/Payload)', 'Cloudflare'],
				iconColor: 'text-rose-400 bg-rose-500/[0.12]',
				gradient: 'from-rose-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(244,63,94,0.18)]',
			},
			{
				title: 'Sklep Internetowy',
				desc: 'WooCommerce lub Headless Commerce - do wyboru. Pełna integracja z BLIK, kartami, kurierami i panel zarządzania zamówieniami, w którym poradzi sobie każdy.',
				icon: Smartphone,
				href: '/uslugi/strony-www/sklep-internetowy',
				fullDescription: `Dwa równoległe podejścia do e-commerce, dobierane pod Twoje potrzeby. **WooCommerce** (default) - stabilny duet WordPress + WooCommerce + motyw Impreza, szybkie wdrożenie, intuicyjny panel WP Admin do zarządzania produktami. **Headless Commerce** (premium) - Next.js + Sanity + Stripe lub Medusa, 5× szybszy frontend, w pełni custom UX, idealny dla marek premium. Obie opcje mają pełną integrację z polskimi płatnościami i kurierami.`,
				features: [
					'Integracja z Przelewy24 / Stripe / BLIK',
					'Filtrowanie i warianty produktów',
					'Szybki koszyk zakupowy',
					'Integracja z kurierami (InPost, DPD)',
					'Panel zarządzania zamówieniami',
					'Opcjonalnie: Headless Commerce (premium)',
				],
				techStack: ['WordPress + WooCommerce', 'lub Next.js + Stripe + Headless CMS', 'Cloudflare'],
				iconColor: 'text-amber-400 bg-amber-500/[0.12]',
				gradient: 'from-amber-500/20 to-orange-500/20',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(217,119,6,0.18)]',
			},
			{
				title: 'System CRM i automatyzacje AI',
				desc: 'Dedykowane systemy CRM, portale klienta i panele B2B - z automatyzacjami AI, które przejmują żmudną, ręczną pracę. Szyte pod Twój proces, nie pod szablon.',
				icon: Layers,
				href: '/uslugi/strony-www/system-crm',
				fullDescription: `Dla firm które mają wewnętrzny proces wymagający digitalizacji - system CRM, portal klienta, panel zarządzania, narzędzie pracownicze. Budujemy frontend w React/Next.js, backend w Node.js + Supabase/Postgres, z pełną autentykacją (logowanie, role, permissions), własną logiką biznesową i integracjami (email, kalendarz, API zewnętrznych dostawców). To NIE jest gotowy SaaS - to system kodowany dokładnie pod Twoje procesy, w którym automatyzacje AI przejmują powtarzalną, ręczną pracę.`,
				features: [
					'Custom UI dopasowane do procesów firmy',
					'Autentykacja, role, uprawnienia',
					'Baza danych (Supabase / Postgres) z encrypted storage',
					'Integracje (email, kalendarz, API zewnętrzne)',
					'Panel admin dla operatorów',
					'Skalowalność i bezpieczeństwo enterprise-grade',
				],
				techStack: ['React', 'Next.js', 'Node.js', 'Supabase / Postgres', 'Tailwind CSS', 'Cloudflare'],
				iconColor: 'text-sky-400 bg-sky-500/[0.12]',
				gradient: 'from-sky-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(14,165,233,0.18)]',
			},
		],
	},
	{
		id: 'design',
		slug: 'design',
		label: 'Design & UI/UX',
		icon: Palette,
		description: 'Nie tylko ładne obrazki. Zyskujesz ścieżkę użytkownika, która prowadzi prosto do zakupu.',
		longDescription: 'Design to nie tylko estetyka, to funkcja...',
		cards: [
			{
				title: 'Design stron internetowych',
				desc: 'Otrzymasz projekt, który wygląda jak gotowa strona.',
				icon: Palette,
				href: '/uslugi/design/ui-ux',
				fullDescription:
					'Tworzymy kompleksowe projekty interfejsów dla aplikacji webowych i mobilnych. Skupiamy się na użyteczności (UX) i atrakcyjności wizualnej (UI), dostarczając gotowe makiety i systemy, które programiści mogą łatwo wdrożyć.',
				features: [
					'Badania potrzeb użytkowników',
					'Wireframing i makiety',
					'Testy użyteczności',
                    'Projektowanie responsywne',
				],
				iconColor: 'text-lime-400 bg-lime-500/[0.12]',
				gradient: 'from-lime-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(132,204,22,0.18)]',
			},
		],
	},
	{
		id: 'ai',
		slug: 'ai',
		label: 'Automatyzacja AI',
		icon: Bot,
		description: 'Zatrudnij technologię zamiast kolejnych pracowników. Powtarzalne zadania robią się same.',
		longDescription: 'Sztuczna inteligencja zmienia zasady gry...',
		cards: [
			{
				title: 'Chatboty AI',
				desc: 'Obsługa klienta 24/7 bez udziału człowieka.',
				icon: Bot,
				href: '/uslugi/automatyzacje-ai/chatboty-ai',
				fullDescription:
					'Wdrażamy inteligentne asystenty AI oparte o modele GPT, które rozumieją kontekst, odpowiadają na pytania klientów, umawiają spotkania i sprzedają Twoje produkty przez całą dobę, w każdym języku.',
				features: [
					'Obsługa klienta 24/7',
					'Integracja z bazą wiedzy firmy',
					'Wsparcie wielu języków',
					'Zbieranie leadów sprzedażowych',
					'Personalizacja odpowiedzi',
				],
				iconColor: 'text-orange-400 bg-orange-500/[0.12]',
				gradient: 'from-orange-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(249,115,22,0.18)]',
			},
		],
	},
	{
		id: 'marketing',
		slug: 'marketing',
		label: 'Marketing i Sprzedaż',
		icon: BarChart,
		description: 'Nawet najlepszy produkt potrzebuje widowni. Zyskujesz precyzyjny ruch, który zamienia się w klientów.',
		longDescription: 'Marketing oparty na danych to nasza specjalność...',
		cards: [
			{
				title: 'Audyt Wydajności & SEO',
				desc: '',
				icon: Search,
				href: '/uslugi/marketing/audyt-wydajnosci-seo',
				fullDescription:
					'Dogłębna analiza Twojej strony pod kątem widoczności w Google. Sprawdzamy błędy techniczne, strukturę treści, profil linków oraz szybkość ładowania, przygotowując gotowy plan naprawczy.',
				features: [
					'Audyt techniczny strony',
					'Analiza słów kluczowych',
					'Optymalizacja SEO oraz wydajności',
					'Strategia treści',
					'Raport wdrożeniowy',
				],
				iconColor: 'text-teal-400 bg-teal-500/[0.12]',
				gradient: 'from-teal-500/15 to-transparent',
				shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(20,184,166,0.18)]',
			},
		],
	},
]

/**
 * Flat list of service options for forms (kontakt page).
 * Derived from `services` so any addition/removal in /uslugi auto-syncs.
 * Skips marketing.audyt because the destination page returns null.
 */
export const contactServiceOptions = (() => {
	const flat: { value: string; label: string; category: string }[] = []
	for (const cat of services) {
		for (const card of cat.cards) {
			// Skip placeholder/null pages - keep option list in sync with what's actually live
			if (card.href === '/uslugi/marketing/audyt-wydajnosci-seo') continue
			flat.push({
				value: card.title,
				label: card.title,
				category: cat.label,
			})
		}
	}
	return flat
})()

export const contactServiceCategories = (() => {
	const grouped = new Map<string, { value: string; label: string }[]>()
	for (const opt of contactServiceOptions) {
		const arr = grouped.get(opt.category) ?? []
		arr.push({ value: opt.value, label: opt.label })
		grouped.set(opt.category, arr)
	}
	return Array.from(grouped.entries()).map(([category, options]) => ({ category, options }))
})()

