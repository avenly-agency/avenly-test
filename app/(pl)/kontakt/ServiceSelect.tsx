'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Check, ChevronDown, AlertCircle } from 'lucide-react'
import type { ServiceCategory, ServiceOption, ServiceSelectDict } from '@/lib/i18n/kontakt'

// Lista usług formularza kontaktu (własny combobox powiązany z react-hook-form).
// Restyling 2026-09-29 (praca równoległa, etap 2): wygląd jak pola formularza (czerń, ostra
// obwódka, fokus w kolorze marki), etykiety zwykłym Inter w pisowni zdaniowej, lista bez
// framer-motion (panel zawsze w DOM, przejście CSS). Działanie bez zmian: klik poza i Escape
// zamykają, wybór wraca fokusem na przycisk, lista ma wysokość pierwszej kategorii (reszta
// po przewinięciu), `value` opcji idzie do Web3Forms bez tłumaczenia. Style: kontakt.css (.kt-sel*).

/* Kolor kropki kategorii - kodowanie treści (jak kolory usług w Ofercie), klucz niezależny od języka. */
const CATEGORY_ACCENT: Record<string, string> = {
	'strony-www': '#60a5fa',
	'design': '#a3e635',
	'ai': '#fb923c',
}

export type ServiceSelectProps<T extends FieldValues> = {
	control: Control<T>
	name: Path<T>
	t: ServiceSelectDict
	id?: string
	required?: boolean
}

export function ServiceSelect<T extends FieldValues>({
	control,
	name,
	t,
	id: idProp,
	required = true,
}: ServiceSelectProps<T>) {
	const autoId = useId()
	const id = idProp ?? autoId

	return (
		<Controller
			control={control}
			name={name}
			rules={required ? { required: t.requiredMessage } : undefined}
			render={({ field, fieldState }) => (
				<ServiceSelectUI
					id={id}
					label={t.label}
					value={(field.value as string) || ''}
					onChange={field.onChange}
					placeholder={t.placeholder}
					categories={t.categories}
					auditOption={t.auditOption}
					otherOption={t.otherOption}
					error={fieldState.error?.message}
				/>
			)}
		/>
	)
}

function ServiceSelectUI({
	id,
	label,
	value,
	onChange,
	placeholder,
	categories,
	auditOption,
	otherOption,
	error,
}: {
	id: string
	label: string
	value: string
	onChange: (v: string) => void
	placeholder: string
	categories: ServiceCategory[]
	auditOption: ServiceOption
	otherOption: ServiceOption
	error?: string
}) {
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const triggerRef = useRef<HTMLButtonElement | null>(null)
	const listboxRef = useRef<HTMLUListElement | null>(null)
	const firstCategoryRef = useRef<HTMLLIElement | null>(null)

	// Po otwarciu lista ma wysokość pierwszej kategorii - reszta czeka pod spodem na przewinięcie.
	useLayoutEffect(() => {
		if (!open) return
		const cat = firstCategoryRef.current
		const list = listboxRef.current
		if (!cat || !list) return
		// 12 px = górny padding listy + oddech przy dolnej krawędzi
		list.style.maxHeight = `${cat.offsetHeight + 12}px`
	}, [open])

	// Klik poza listą zamyka
	useEffect(() => {
		if (!open) return
		const onDown = (e: MouseEvent | TouchEvent) => {
			const node = containerRef.current
			if (!node) return
			if (!node.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('mousedown', onDown)
		document.addEventListener('touchstart', onDown, { passive: true })
		return () => {
			document.removeEventListener('mousedown', onDown)
			document.removeEventListener('touchstart', onDown)
		}
	}, [open])

	// Escape zamyka i oddaje fokus przyciskowi
	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(false)
				triggerRef.current?.focus()
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [open])

	const select = (v: string) => {
		onChange(v)
		setOpen(false)
		// fokus wraca na przycisk (klawiatura)
		requestAnimationFrame(() => triggerRef.current?.focus())
	}

	// `value` jest niezależne od języka (idzie do Web3Forms) - w przycisku pokazujemy etykietę.
	const tailOptions = [auditOption, otherOption]
	const selectedLabel =
		[...categories.flatMap((c) => c.options), ...tailOptions].find((o) => o.value === value)?.label ?? value
	const errId = `${id}-error`

	const option = (o: ServiceOption) => {
		const selected = o.value === value
		return (
			<li key={o.value}>
				<button
					type="button"
					role="option"
					aria-selected={selected}
					tabIndex={open ? 0 : -1}
					onClick={() => select(o.value)}
					className="kt-sel-opt"
				>
					<span className="kt-sel-opt-t">{o.label}</span>
					{selected && <Check size={16} aria-hidden="true" />}
				</button>
			</li>
		)
	}

	return (
		<div className="kt-field kt-sel" ref={containerRef} data-open={open || undefined}>
			<label htmlFor={id} className="kt-label">{label}</label>

			<button
				ref={triggerRef}
				id={id}
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={`${id}-listbox`}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? errId : undefined}
				onClick={() => setOpen((o) => !o)}
				className="kt-input kt-sel-btn"
			>
				<span className={value ? 'kt-sel-val' : 'kt-sel-ph'}>{selectedLabel || placeholder}</span>
				<ChevronDown size={18} className="kt-sel-chev" aria-hidden="true" />
			</button>

			{error && (
				<span className="kt-err" id={errId}>
					<AlertCircle size={14} aria-hidden="true" /> {error}
				</span>
			)}

			<div className="kt-sel-panel">
				<ul
					ref={listboxRef}
					id={`${id}-listbox`}
					role="listbox"
					aria-label={label}
					data-lenis-prevent
					className="kt-sel-list"
				>
					{categories.map(({ key, name, options }, catIdx) => (
						<li
							key={key}
							ref={catIdx === 0 ? firstCategoryRef : undefined}
							role="group"
							aria-label={name}
							className="kt-sel-group"
						>
							<div className="kt-sel-cat" aria-hidden="true">
								<i style={{ background: CATEGORY_ACCENT[key] ?? '#94a3b8' }} />
								{name}
							</div>
							<ul className="kt-sel-opts">
								{options.map(option)}
							</ul>
						</li>
					))}

					{/* Audyt (uśpiony prefill z hero) + inne / jeszcze nie wiem */}
					<li className="kt-sel-group kt-sel-group--tail">
						<ul className="kt-sel-opts">
							{tailOptions.map(option)}
						</ul>
					</li>
				</ul>
			</div>
		</div>
	)
}
