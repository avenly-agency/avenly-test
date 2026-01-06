'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Mail,
	Phone,
	MapPin,
	Send,
	CheckCircle2,
	Loader2,
	AlertCircle,
	ArrowRight,
	Github,
	Twitter,
	Linkedin,
	Instagram, // <--- NOWE
	Facebook, // <--- NOWE
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils' // Zakładam, że masz ten utility, jak nie - usuń cn()

// --- TYPY DANYCH ---
type FormData = {
	name: string
	email: string
	phone?: string
	subject: string
	message: string
	privacy: boolean
	bot_field: string // HONEYPOT (Niewidoczne dla usera, pułapka na boty)
}

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>()

	// --- LOGIKA WYSYŁKI (Web3Forms) ---
	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true)
		setServerError(null)

		// 1. SECURITY: Sprawdzenie Honeypot (czy bot wypełnił ukryte pole)
		if (data.bot_field) {
			// Cichy sukces - oszukujemy bota, nie wysyłamy maila
			setIsSubmitting(false)
			setIsSuccess(true)
			return
		}

		try {
			// TUTAJ PODMIEŃ NA SWÓJ ACCESS KEY Z WEB3FORMS (Darmowy)
			const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					access_key: ACCESS_KEY,
					...data,
					from_name: 'Avenly Contact Form',
				}),
			})

			const result = await response.json()

			if (result.success) {
				setIsSuccess(true)
				reset() // Czyścimy formularz
			} else {
				setServerError('Wystąpił błąd po stronie serwera. Spróbuj ponownie.')
			}
		} catch (error) {
			setServerError('Błąd połączenia. Sprawdź internet.')
		} finally {
			setIsSubmitting(false)
		}
	}

	// --- ANIMACJE ---
	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 },
	}

	return (
		<div className="min-h-screen bg-[#050505] pt-32 pb-20 overflow-hidden relative selection:bg-blue-500/30">
			{/* TŁO AMBIENT (SEO friendly - nie wpływa na content) */}
			<div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0">
				<div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
				<div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 blur-[100px] rounded-full mix-blend-screen opacity-30"></div>
				<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				{/* --- HEADER --- */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
						<span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
						Dostępni 24/7
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight md:leading-[1.1]">
						Porozmawiajmy o <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
							Twoim Projekcie.
						</span>
					</h1>

					{/* --- TUTAJ ZMIANA --- */}
					<p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
						Masz pytania lub gotowy plan? <br /> Niezależnie od etapu, chętnie doradzimy i zamienimy Twoją wizję w działający
						produkt. Skontaktuj się z nami!
					</p>
					{/* ------------------- */}
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
					{/* --- LEWA KOLUMNA: KONTAKT INFO --- */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-12">
						{/* KARTY INFO */}
						<div className="space-y-6">
							<InfoCard
								icon={Mail}
								title="Email"
								value="kontakt@avenly.pl"
								href="mailto:kontakt@avenly.pl"
								sub="Odpowiadamy błyskawicznie."
							/>
							<InfoCard
								icon={Phone}
								title="Telefon"
								value="+48 123 456 789"
								href="tel:+48123456789"
								sub="Pon-Pt, 9:00 - 17:00"
							/>
							<InfoCard icon={MapPin} title="Biuro" value="Warszawa, Polska" sub="Pracujemy zdalnie globalnie." />
						</div>

						{/* SOCIAL PROOF / TRUST */}
						<div className="p-8 rounded-3xl bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-white/5 relative overflow-hidden group">
							<div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<h3 className="text-xl font-bold text-white mb-4 relative z-10">Dlaczego Avenly?</h3>
							<ul className="space-y-3 text-slate-400 text-sm relative z-10">
								<li className="flex items-center gap-3">
									<CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
									<span>Gwarancja dowiezienia projektu w terminie.</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
									<span>Przejrzysta umowa i przekazanie praw autorskich.</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
									<span>Wsparcie techniczne po wdrożeniu.</span>
								</li>
							</ul>
						</div>

						{/* SOCIALS */}
						<div className="flex gap-4">
							<SocialButton icon={Facebook} href="#" />
							<SocialButton icon={Instagram} href="#" />
							<SocialButton icon={Linkedin} href="#" />
							<SocialButton icon={Github} href="#" />
						</div>
					</motion.div>

					{/* --- PRAWA KOLUMNA: FORMULARZ --- */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="relative">
						<div
							className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-50"
							aria-hidden="true"></div>

						<div className="relative bg-[#080808]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
							<AnimatePresence mode="wait">
								{isSuccess ? (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className="flex flex-col items-center justify-center text-center py-20 min-h-[500px]">
										<div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 ring-4 ring-green-500/10">
											<CheckCircle2 size={40} />
										</div>
										<h3 className="text-3xl font-bold text-white mb-4">Wiadomość wysłana!</h3>
										<p className="text-slate-400 max-w-xs mx-auto mb-8">
											Dziękujemy za kontakt. Nasz zespół przeanalizuje Twoje zgłoszenie i odezwie się wkrótce.
										</p>
										<button
											onClick={() => setIsSuccess(false)}
											className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors border border-white/10">
											Wyślij kolejną
										</button>
									</motion.div>
								) : (
									<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
										{/* HONEYPOT (SECURITY) */}
										<input type="text" {...register('bot_field')} className="hidden" tabIndex={-1} autoComplete="off" />
										<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<InputGroup
												label="Imię i Nazwisko"
												id="name"
												error={errors.name}
												{...register('name', { required: 'To pole jest wymagane' })}
											/>
											<InputGroup
												label="Adres Email"
												id="email"
												type="email"
												error={errors.email}
												{...register('email', {
													required: 'Email jest wymagany',
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: 'Niepoprawny format email',
													},
												})}
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<InputGroup label="Telefon (opcjonalnie)" id="phone" {...register('phone')} />
											<InputGroup
												label="Temat"
												id="subject"
												error={errors.subject}
												{...register('subject', { required: 'Wybierz temat rozmowy' })}
											/>
										</div>

										<div className="space-y-2">
											<label htmlFor="message" className="text-sm font-bold text-slate-300 ml-1">
												Wiadomość
											</label>
											<textarea
												id="message"
												rows={5}
												className={cn(
													'w-full px-5 py-4 bg-[#050505] border rounded-xl text-white placeholder-slate-600 outline-none transition-all resize-none focus:ring-2 focus:ring-blue-500/50',
													errors.message
														? 'border-red-500 focus:border-red-500'
														: 'border-white/10 focus:border-blue-500'
												)}
												placeholder="Opisz krótko swój projekt..."
												{...register('message', {
													required: 'Wiadomość nie może być pusta',
													minLength: { value: 10, message: 'Minimum 10 znaków' },
												})}></textarea>
											{errors.message && (
												<span className="text-xs text-red-500 ml-1 flex items-center gap-1">
													<AlertCircle size={10} /> {errors.message.message}
												</span>
											)}
										</div>

										{/* RODO & LEGAL */}
										<div className="pt-2">
											<label className="flex items-start gap-3 cursor-pointer group">
												<div className="relative flex items-center">
													<input
														type="checkbox"
														className="peer sr-only"
														{...register('privacy', { required: 'Musisz zaakceptować politykę prywatności' })}
													/>
													<div className="w-5 h-5 border border-white/20 rounded bg-[#050505] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
														<CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
													</div>
												</div>
												<span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
													Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
													<Link href="/polityka-prywatnosci" className="text-blue-400 hover:underline">
														Polityką Prywatności
													</Link>
													. Rozumiem, że mogę wycofać zgodę w każdej chwili.
												</span>
											</label>
											{errors.privacy && (
												<span className="text-xs text-red-500 mt-2 block ml-1">{errors.privacy.message}</span>
											)}
										</div>

										{serverError && (
											<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
												<AlertCircle size={16} />
												{serverError}
											</div>
										)}

										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
											{isSubmitting ? (
												<>
													<Loader2 className="animate-spin" /> Wysyłanie...
												</>
											) : (
												<>
													Wyślij Wiadomość <Send size={18} />
												</>
											)}
										</button>
									</form>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}

// --- SUBKOMPONENTY (DLA CZYSTOŚCI KODU) ---

const InputGroup = ({ label, id, error, type = 'text', ...props }: any) => (
	<div className="space-y-2">
		<label htmlFor={id} className="text-sm font-bold text-slate-300 ml-1">
			{label}
		</label>
		<input
			id={id}
			type={type}
			className={cn(
				'w-full px-5 py-3.5 bg-[#050505] border rounded-xl text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/50',
				error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'
			)}
			{...props}
		/>
		{error && (
			<span className="text-xs text-red-500 ml-1 flex items-center gap-1">
				<AlertCircle size={10} /> {error.message}
			</span>
		)}
	</div>
)

const InfoCard = ({ icon: Icon, title, value, sub, href }: any) => (
	<div className="flex items-start gap-5 group">
		<div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-blue-900/20 shrink-0">
			<Icon size={24} />
		</div>
		<div>
			<h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
			{href ? (
				<a href={href} className="text-xl md:text-2xl font-bold text-white hover:text-blue-400 transition-colors">
					{value}
				</a>
			) : (
				<p className="text-xl md:text-2xl font-bold text-white">{value}</p>
			)}
			<p className="text-slate-500 text-sm mt-1">{sub}</p>
		</div>
	</div>
)

const SocialButton = ({ icon: Icon, href }: any) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300">
		<Icon size={20} />
	</a>
)
