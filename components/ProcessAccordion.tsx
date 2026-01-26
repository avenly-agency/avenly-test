'use client'

import { useState } from 'react'

interface ProcessStep {
	title: string
	desc: string
}

export const ProcessAccordion = ({ category }: { category: string }) => {
	const [activeStep, setActiveStep] = useState(0)

	const stepsMap: Record<string, ProcessStep[]> = {
		// 1. DESIGN (UI/UX)
		design: [
			{ title: 'Brief & Inspiracje', desc: 'Zbieramy Twoje wymagania i ustalamy kierunek artystyczny marki.' },
			{ title: 'UX & Makiety', desc: 'Projektujemy szkice, dbając o intuicyjność i ścieżkę użytkownika.' },
			{ title: 'UI & Prototyping', desc: 'Tworzymy finalny, kolorowy projekt w Figmie.' },
			{ title: 'Finalizacja', desc: 'Przekazujemy końcowy efekt do potwierdzenia.' },
		],
		// 2. CHATBOT AI / AUTOMATYZACJA
		'automatyzacja-ai': [
			{
				title: 'Analiza & Baza Wiedzy',
				desc: 'Analizujemy Twoją stronę i dokumenty, aby zbudować bazę wiedzy. Definiujemy, czy AI ma sprzedawać, czy wspierać obsługę klienta.',
			},
			{
				title: 'Prompt Engineering',
				desc: "Projektujemy 'mózg' asystenta. Ustawiamy Rolę i instrukcje systemowe, aby chatbot brzmiał jak ekspert Twojej marki.",
			},
			{
				title: 'Integracja Webflow',
				desc: 'Wdrażamy chatbota na Twoją stronę dzięki Voiceflow. Stylizujemy okno czatu, aby idealnie pasowało do Twojego designu.',
			},
			{
				title: 'Leady & Automatyzacja',
				desc: 'Podpinamy zewnętrzne systemy i aplikacje, dzięki czemu chatbot nie tylko rozmawia, ale automatycznie zapisuje leady i umawia spotkania.',
			},
		],
		// 3. STRONY WWW (DEFAULT) - ZMIENIONE TEKSTY
		default: [
			{
				title: 'Strategia i Makiety',
				desc: 'Nie zgadujemy. Najpierw projektujemy ścieżkę użytkownika (UX) i układ treści, aby strona nie tylko wyglądała, ale skutecznie prowadziła klienta do zakupu lub kontaktu.',
			},
			{
				title: 'Kodowanie i CMS',
				desc: 'Wdrażamy technologię szytą na miarę (Next.js lub WordPress). Otrzymujesz ultra-szybką stronę z wygodnym panelem, dzięki któremu samodzielnie edytujesz treści.',
			},
			{
				title: 'Szybkość i Google',
				desc: 'Dbamy o techniczne SEO i parametry Core Web Vitals. Twoja witryna ładuje się w mgnieniu oka, jest bezpieczna i przygotowana do zdobywania wysokich pozycji.',
			},
			{
				title: 'Start i Wsparcie',
				desc: 'Zajmujemy się technicznym wdrożeniem, podpięciem domen i analityką. Na koniec szkolimy Twój zespół, abyście od pierwszego dnia mieli pełną kontrolę nad stroną.',
			},
		],
	}

	const getSteps = () => {
		if (
			category === 'automatyzacja-ai' ||
			category === 'konsultacje-ai' ||
			category === 'ai' ||
			category === 'chatbot'
		) {
			return stepsMap['automatyzacja-ai']
		}
		return stepsMap[category] || stepsMap['default']
	}

	const steps = getSteps()

	return (
		<div className="w-full">
			{/* MOBILE VIEW (Vertical Stack) */}
			<div className="flex flex-col gap-4 lg:hidden">
				{steps.map((step, i) => (
					<div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
						<div className="flex items-center gap-4 mb-3">
							<div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
								0{i + 1}
							</div>
							<h3 className="text-lg font-bold text-white">{step.title}</h3>
						</div>
						<p className="text-sm text-slate-400 pl-14">{step.desc}</p>
					</div>
				))}
			</div>

			{/* DESKTOP VIEW (Horizontal Accordion) */}
			<div className="hidden lg:flex h-[450px] gap-3 w-full">
				{steps.map((step, i) => {
					const isActive = activeStep === i
					return (
						<div
							key={i}
							onMouseEnter={() => setActiveStep(i)}
							className={`
                relative rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                border border-white/5
                ${
									isActive
										? 'flex-[3] bg-[#0a0a0a] border-blue-500/30 cursor-default'
										: 'flex-[1] bg-[#050505] hover:bg-white/[0.02] cursor-pointer'
								}
              `}>
							{/* TŁO AKTYWNE */}
							{isActive && (
								<div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-50" />
							)}

							{/* NUMER (WATERMARK) */}
							<div
								className={`
                absolute transition-all duration-700 flex items-center justify-center font-bold font-mono pointer-events-none select-none
                ${
									isActive
										? 'top-6 left-8 text-8xl text-blue-500/20 scale-100'
										: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-blue-600/40 scale-110'
								}
              `}>
								0{i + 1}
							</div>

							{/* CONTENT */}
							<div
								className={`
                absolute inset-0 flex flex-col justify-end p-10 
                transition-opacity ease-in-out
                ${
									isActive
										? 'opacity-100 duration-500 delay-300' // Opóźnione pojawienie
										: 'opacity-0 duration-150' // Szybkie znikanie
								}
              `}>
								{/* Blokada zwężania tekstu */}
								<div className="min-w-[400px]">
									<h3 className="text-3xl font-bold text-white mb-4 leading-tight">{step.title}</h3>
									<p className="text-slate-400 text-lg leading-relaxed max-w-lg">{step.desc}</p>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
