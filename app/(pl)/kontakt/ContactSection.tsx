'use client'

import { useEffect, useRef, type CSSProperties, type ComponentType } from 'react'
import { Check, Loader2, AlertCircle, ArrowRight, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { CONTACT } from '@/lib/seo-data'
import { ServiceSelect } from './ServiceSelect'
import { ContactBackdrop } from './Backdrop'
import type { ContactFormShared } from './useContactForm'
import type { KontaktDict } from '@/lib/i18n/kontakt'
import { type Locale } from '@/lib/i18n/locale'
import './kontakt.css'

/**
 * /kontakt i /en/contact - restyling istniejącego układu do designu strony głównej
 * (praca równoległa, etap 2, chat 4, 2026-09-29). Wybory właściciela: układ "Obok siebie"
 * (nagłówek i dane po lewej, formularz po prawej), tło "Opływ" (Backdrop.tsx - linie przepływu
 * opływają formularz), formularz "Bez karty" (wprost na czerni, pola na linii; kształt formularza
 * wyznacza sam strumień). Nagłówek jak w sekcjach strony głównej (SectionLabel + .im-title /
 * .im-lead), jeden kolor marki w drobnych akcentach, biały przycisk jak w hero i stopce. Ruch =
 * animacje CSS (bez framer-motion: dawny błąd hydratacji h1 przy ograniczonym ruchu). Dane firmy
 * tylko z lib/seo-data.ts. Style: kontakt.css (.kt-*).
 */

// CONTACT.hours w formacie schema.org ("Mo-Fr 09:00-17:00") → "pon-pt, 9:00-17:00" (jak w stopce).
type DayKey = keyof KontaktDict['info']['days']
const WORK_HOURS = (() => {
	const m = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?\s+(\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(CONTACT.hours)
	if (!m) return null
	return { from: m[1] as DayKey, to: (m[2] ?? m[1]) as DayKey, open: `${+m[3]}:${m[4]}`, close: `${+m[5]}:${m[6]}` }
})()
const hoursText = (t: KontaktDict) => {
	if (!WORK_HOURS) return ''
	const { from, to, open, close } = WORK_HOURS
	const days = from === to ? t.info.days[from] : `${t.info.days[from]}-${t.info.days[to]}`
	return `${days}, ${open}-${close}`
}

/** Kolejność wejścia (stagger animacji CSS). */
const d = (n: number) => ({ '--d': n }) as CSSProperties

export function ContactSection({
	ctx,
	t,
}: {
	ctx: ContactFormShared
	t: KontaktDict
	// locale przyjmowany dla spójności API (jedyny link - polityka prywatności - jest zawsze PL)
	locale?: Locale
}) {
	return (
		<div className="kt">
			<section className="kt-main" aria-labelledby="kt-title">
				<ContactBackdrop sent={ctx.isSuccess} />
				<div className="container mx-auto px-6">
					<div className="kt-grid">
						<header className="kt-head">
							<p className="im-label kt-rv" style={d(0)}>
								<SectionLabel align="start">{t.label}</SectionLabel>
							</p>
							{/* h1 wjeżdża spod maski (linijka tekstu wychodzi od dołu) */}
							<h1 className="im-title kt-title" id="kt-title">
								<span className="kt-mask"><span className="kt-mask-i" style={d(1)}>{t.title}<span className="im-accent">.</span></span></span>
							</h1>
							<p className="im-lead kt-lead kt-rv" style={d(2)}>{t.lead}</p>
						</header>

						<ContactInfo t={t} />
						<FormCard ctx={ctx} t={t} />
					</div>
				</div>
			</section>
		</div>
	)
}

/* ── Dane kontaktu (e-mail, telefony, godziny) ─────────────────────────── */

function ContactInfo({ t }: { t: KontaktDict }) {
	const hours = hoursText(t)
	return (
		<div className="kt-info">
			<h2 className="sr-only">{t.info.heading}</h2>
			<ul className="kt-info-list">
				<InfoItem icon={Mail} label={t.info.mailLabel} n={3}>
					<a href={`mailto:${CONTACT.email}`} className="kt-info-link">{CONTACT.email}</a>
				</InfoItem>
				<InfoItem icon={Phone} label={t.info.phoneLabel} n={4} row>
					<a href={`tel:${CONTACT.phone}`} className="kt-info-link">{CONTACT.phoneDisplay}</a>
					{CONTACT.phone2 && <a href={`tel:${CONTACT.phone2}`} className="kt-info-link">{CONTACT.phone2Display}</a>}
				</InfoItem>
				{hours && (
					<InfoItem icon={Clock} label={t.info.hoursLabel} n={5}>
						<span className="kt-info-text">{hours}</span>
					</InfoItem>
				)}
			</ul>
		</div>
	)
}

function InfoItem({
	icon: Icon,
	label,
	n,
	row = false,
	children,
}: {
	icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
	label: string
	n: number
	/** Wartości obok siebie na telefonie (dwa numery w jednym wierszu, zawijają się na wąskim ekranie). */
	row?: boolean
	children: React.ReactNode
}) {
	return (
		<li className="kt-info-item kt-rv" style={d(n)}>
			<span className="kt-info-ico"><Icon size={16} strokeWidth={1.7} aria-hidden /></span>
			<span className="kt-info-label">{label}</span>
			<span className={row ? 'kt-info-val kt-info-val--row' : 'kt-info-val'}>{children}</span>
		</li>
	)
}

/* ── Formularz ─────────────────────────────────────────────────────────── */

function FormCard({ ctx, t }: { ctx: ContactFormShared; t: KontaktDict }) {
	const { form, isSubmitting, isSuccess, serverError, resetSuccess, onSubmit } = ctx
	const { register, handleSubmit, control, setFocus, formState: { errors } } = form
	const doneRef = useRef<HTMLHeadingElement | null>(null)
	const wasSuccess = useRef(false)

	// Po wysłaniu fokus na potwierdzenie (czytnik ekranu je odczyta), po "Wyślij kolejną" - na pierwsze pole.
	useEffect(() => {
		if (isSuccess) doneRef.current?.focus()
		else if (wasSuccess.current) setFocus('name')
		wasSuccess.current = isSuccess
	}, [isSuccess, setFocus])

	const errProps = (name: string, has: boolean) =>
		has ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-err` } : {}

	return (
		<div className="kt-card kt-rv" style={d(2)} data-done={isSuccess || undefined}>
			<div className="kt-card-in" inert={isSuccess} aria-hidden={isSuccess || undefined}>
				<div className="kt-card-head">
					<h2 className="kt-card-title">{t.form.heading}</h2>
					<p className="kt-card-meta">{t.form.meta}</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="kt-form" noValidate>
					<input type="checkbox" className="hidden" style={{ display: 'none' }} tabIndex={-1} aria-hidden {...register('botcheck')} />

					<div className="kt-row">
						<Field id="name-c" label={t.form.nameLabel} error={errors.name?.message}>
							<input
								id="name-c"
								type="text"
								autoComplete="name"
								className="kt-input"
								{...errProps('name-c', !!errors.name)}
								{...register('name', { required: t.form.errors.required })}
							/>
						</Field>
						<Field id="email-c" label={t.form.emailLabel} error={errors.email?.message}>
							<input
								id="email-c"
								type="email"
								autoComplete="email"
								inputMode="email"
								className="kt-input"
								{...errProps('email-c', !!errors.email)}
								{...register('email', {
									required: t.form.errors.required,
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: t.form.errors.emailPattern,
									},
								})}
							/>
						</Field>
					</div>

					<div className="kt-row">
						<Field id="phone-c" label={t.form.phoneLabel}>
							<input id="phone-c" type="tel" autoComplete="tel" inputMode="tel" className="kt-input" {...register('phone')} />
						</Field>
						<ServiceSelect control={control} name="subject" t={t.serviceSelect} id="subject-c" />
					</div>

					<Field id="message-c" label={t.form.messageLabel} error={errors.message?.message}>
						<textarea
							id="message-c"
							rows={4}
							placeholder={t.form.messagePlaceholder}
							className="kt-input kt-textarea"
							{...errProps('message-c', !!errors.message)}
							{...register('message', {
								required: t.form.errors.required,
								minLength: { value: 10, message: t.form.errors.messageMin },
							})}
						/>
					</Field>

					<div className="kt-field">
						<label className="kt-check">
							<input
								type="checkbox"
								className="kt-check-in"
								{...errProps('privacy-c', !!errors.privacy)}
								{...register('privacy', { required: t.form.errors.privacyRequired })}
							/>
							<span className="kt-check-box" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
							<span className="kt-check-t">
								{t.form.privacyPrefix}{' '}
								{/* Polityka prywatności ma tylko wersję PL - zawsze /polityka-prywatnosci */}
								<Link href="/polityka-prywatnosci" className="kt-inline-link">{t.form.privacyLink}</Link>
								{t.form.privacySuffix}
							</span>
						</label>
						{errors.privacy && <ErrorText id="privacy-c-err">{errors.privacy.message}</ErrorText>}
					</div>

					{serverError && (
						<div className="kt-alert" role="alert">
							<AlertCircle size={16} aria-hidden="true" />
							<span>{serverError}</span>
						</div>
					)}

					<button type="submit" disabled={isSubmitting} className="kt-submit" aria-busy={isSubmitting || undefined}>
						{isSubmitting ? (
							<>
								<Loader2 className="kt-spin" size={18} aria-hidden="true" /> {t.form.submitting}
							</>
						) : (
							<>
								{t.form.submit}
								<ArrowRight size={18} aria-hidden="true" />
							</>
						)}
					</button>
				</form>
			</div>

			{isSuccess && (
				<div className="kt-done" role="status">
					<span className="kt-done-ico" aria-hidden="true"><Check size={26} strokeWidth={2.2} /></span>
					<h2 className="kt-done-title" ref={doneRef} tabIndex={-1}>{t.success.title}</h2>
					<p className="kt-done-body">{t.success.body}</p>
					<button type="button" onClick={resetSuccess} className="kt-again">{t.success.again}</button>
				</div>
			)}
		</div>
	)
}

function Field({
	id,
	label,
	error,
	children,
}: {
	id: string
	label: string
	error?: string
	children: React.ReactNode
}) {
	return (
		<div className="kt-field">
			<label htmlFor={id} className="kt-label">{label}</label>
			{children}
			{error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
		</div>
	)
}

const ErrorText = ({ id, children }: { id: string; children: React.ReactNode }) => (
	<span className="kt-err" id={id}>
		<AlertCircle size={14} aria-hidden="true" /> {children}
	</span>
)
