'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Check, ChevronDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { contactServiceCategories } from '@/app/data/services'

type Theme = 'dark' | 'light'
type Variant = 'card' | 'underline' | 'mono'

/* Category accent colors - light dot beside each category header in panel */
const CATEGORY_ACCENT: Record<string, string> = {
	'Strony WWW': '#60a5fa', // blue-400
	'Design & UI/UX': '#a3e635', // lime-400
	'Automatyzacja AI': '#fb923c', // orange-400
}

const OTHER_VALUE = 'Inne / nie wiem jeszcze'

/* ─────────────────────────────────────────────────────────────
 * Visual tokens per theme + variant
 * ───────────────────────────────────────────────────────────── */

function getTokens(theme: Theme, variant: Variant, hasError: boolean) {
	// Trigger button shell
	let trigger = ''
	let triggerText = ''
	let placeholder = ''
	let chevron = ''
	let panel = ''
	let panelBg = ''
	let categoryLabel = ''
	let option = ''
	let optionHover = ''
	let optionSelected = ''
	let optionSelectedText = ''
	let divider = ''
	let label = ''

	if (theme === 'light') {
		trigger = cn(
			'bg-slate-50 border rounded-lg px-4 py-3 transition-colors focus:ring-2 focus:ring-slate-100',
			hasError ? 'border-red-400' : 'border-slate-200 hover:border-slate-300 data-[open=true]:border-slate-900'
		)
		triggerText = 'text-slate-900'
		placeholder = 'text-slate-400'
		chevron = 'text-slate-400'
		panelBg = 'bg-white'
		panel = 'border border-slate-200 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]'
		categoryLabel = 'text-slate-500'
		option = 'text-slate-700'
		optionHover = 'hover:bg-slate-50'
		optionSelected = 'bg-blue-50'
		optionSelectedText = 'text-blue-700'
		divider = 'border-slate-100'
		label = 'text-slate-500'
	} else {
		// dark - variant-specific trigger shell
		if (variant === 'underline') {
			trigger = cn(
				'bg-transparent border-0 border-b py-3 px-0 transition-colors text-lg',
				hasError ? 'border-red-500' : 'border-white/15 hover:border-white/30 data-[open=true]:border-white'
			)
			triggerText = 'text-white'
			placeholder = 'text-slate-700'
			chevron = 'text-slate-500'
			label = 'text-slate-500'
		} else if (variant === 'mono') {
			trigger = cn(
				'bg-transparent px-4 py-3 transition-colors font-mono text-sm',
				hasError ? 'text-red-400' : 'text-white'
			)
			triggerText = 'text-white font-mono text-sm'
			placeholder = 'text-slate-700 font-mono text-sm'
			chevron = 'text-slate-500'
			label = 'text-slate-500 font-mono'
		} else {
			// card (default - dark)
			trigger = cn(
				'bg-[#050505] border rounded-lg px-4 py-3 transition-colors focus:ring-2 focus:ring-blue-400/15',
				hasError
					? 'border-red-500'
					: 'border-white/10 hover:border-white/20 data-[open=true]:border-blue-400/60'
			)
			triggerText = 'text-white'
			placeholder = 'text-slate-600'
			chevron = 'text-slate-500'
			label = 'text-slate-500'
		}

		panelBg = 'bg-[#0c0c0c]'
		panel = 'border border-white/12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]'
		categoryLabel = 'text-slate-500'
		option = 'text-slate-200'
		optionHover = 'hover:bg-white/5'
		optionSelected = 'bg-blue-500/12'
		optionSelectedText = 'text-blue-300'
		divider = 'border-white/8'
	}

	return {
		trigger,
		triggerText,
		placeholder,
		chevron,
		panel,
		panelBg,
		categoryLabel,
		option,
		optionHover,
		optionSelected,
		optionSelectedText,
		divider,
		label,
	}
}

/* ─────────────────────────────────────────────────────────────
 * Service Select - custom combobox bound to react-hook-form
 * ───────────────────────────────────────────────────────────── */

export type ServiceSelectProps<T extends FieldValues> = {
	control: Control<T>
	name: Path<T>
	label: string
	id?: string
	theme?: Theme
	variant?: Variant
	required?: boolean
	requiredMessage?: string
	placeholder?: string
	hideLabel?: boolean
}

export function ServiceSelect<T extends FieldValues>({
	control,
	name,
	label,
	id: idProp,
	theme = 'dark',
	variant = 'card',
	required = true,
	requiredMessage = 'Wybierz usługę',
	placeholder = '- wybierz usługę -',
	hideLabel = false,
}: ServiceSelectProps<T>) {
	const autoId = useId()
	const id = idProp ?? autoId

	return (
		<Controller
			control={control}
			name={name}
			rules={required ? { required: requiredMessage } : undefined}
			render={({ field, fieldState }) => (
				<ServiceSelectUI
					id={id}
					label={label}
					hideLabel={hideLabel}
					value={(field.value as string) || ''}
					onChange={field.onChange}
					theme={theme}
					variant={variant}
					placeholder={placeholder}
					error={fieldState.error?.message}
				/>
			)}
		/>
	)
}

function ServiceSelectUI({
	id,
	label,
	hideLabel,
	value,
	onChange,
	theme,
	variant,
	placeholder,
	error,
}: {
	id: string
	label: string
	hideLabel: boolean
	value: string
	onChange: (v: string) => void
	theme: Theme
	variant: Variant
	placeholder: string
	error?: string
}) {
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const triggerRef = useRef<HTMLButtonElement | null>(null)
	const listboxRef = useRef<HTMLUListElement | null>(null)
	const firstCategoryRef = useRef<HTMLLIElement | null>(null)
	const t = getTokens(theme, variant, !!error)

	// On open: clamp listbox max-height to exactly first category height so the
	// rest of the list sits below the fold and requires scrolling.
	useLayoutEffect(() => {
		if (!open) return
		const cat = firstCategoryRef.current
		const list = listboxRef.current
		if (!cat || !list) return
		// 12px = py-1.5 top + small breathing room at the bottom edge.
		list.style.maxHeight = `${cat.offsetHeight + 12}px`
	}, [open])

	// Click-outside close
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

	// Escape to close
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
		// Return focus to trigger for keyboard users
		requestAnimationFrame(() => triggerRef.current?.focus())
	}

	const isMono = variant === 'mono'

	const labelClass = cn(
		'tracking-[0.25em] uppercase block mb-2',
		variant === 'mono' ? 'text-[11px] tracking-widest font-mono' : 'text-[11px]',
		variant === 'underline' ? 'mb-3' : 'mb-2',
		t.label
	)

	return (
		<div className="relative" ref={containerRef}>
			{hideLabel ? (
				<label htmlFor={id} className="sr-only">
					{label}
				</label>
			) : (
				<label htmlFor={id} className={labelClass}>
					{label}
				</label>
			)}

			<button
				ref={triggerRef}
				id={id}
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={`${id}-listbox`}
				data-open={open}
				onClick={() => setOpen((o) => !o)}
				className={cn(
					'group w-full flex items-center justify-between gap-3 outline-none cursor-pointer',
					t.trigger
				)}
			>
				<span
					className={cn(
						'truncate text-base',
						value ? t.triggerText : t.placeholder,
						isMono && 'font-mono text-sm'
					)}
				>
					{value || placeholder}
				</span>
				<ChevronDown
					size={variant === 'underline' ? 18 : 16}
					className={cn(
						'shrink-0 transition-transform duration-200',
						open && 'rotate-180',
						t.chevron
					)}
				/>
			</button>

			{error && (
				<span className={cn(
					'text-xs text-red-500 mt-1.5 flex items-center gap-1',
					isMono && 'font-mono'
				)}>
					<AlertCircle size={11} /> {error}
				</span>
			)}

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -4, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -4, scale: 0.98 }}
						transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
						className={cn(
							'absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50',
							t.panelBg,
							t.panel
						)}
						style={{ top: '100%' }}
					>
						<ul
							ref={listboxRef}
							id={`${id}-listbox`}
							role="listbox"
							aria-label={label}
							data-lenis-prevent
							className="max-h-[min(60vh,420px)] overflow-y-auto py-1.5 overscroll-contain"
						>
							{contactServiceCategories.map(({ category, options }, catIdx) => (
								<li
									key={category}
									ref={catIdx === 0 ? firstCategoryRef : undefined}
									role="group"
									aria-label={category}
								>
									{catIdx > 0 && <div className={cn('border-t mx-3 my-1', t.divider)} />}
									<div
										className={cn(
											'flex items-center gap-2 px-4 pt-3 pb-1.5 text-[11px] tracking-[0.28em] uppercase',
											isMono && 'font-mono',
											t.categoryLabel
										)}
									>
										<span
											className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
											style={{ backgroundColor: CATEGORY_ACCENT[category] ?? '#94a3b8' }}
										/>
										{category}
									</div>
									<ul className="px-1.5 py-0.5">
										{options.map((o) => {
											const selected = o.value === value
											return (
												<li key={o.value}>
													<button
														type="button"
														role="option"
														aria-selected={selected}
														onClick={() => select(o.value)}
														className={cn(
															'w-full text-left flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg text-sm sm:text-[15px] transition-colors cursor-pointer',
															selected ? t.optionSelected : t.optionHover,
															selected ? t.optionSelectedText : t.option,
															isMono && 'font-mono'
														)}
													>
														<span className="truncate">{o.label}</span>
														{selected && <Check size={15} className="shrink-0" />}
													</button>
												</li>
											)
										})}
									</ul>
								</li>
							))}

							{/* Other / undecided */}
							<li>
								<div className={cn('border-t mx-3 my-1', t.divider)} />
								<div className="px-1.5 py-0.5 pb-1.5">
									<button
										type="button"
										role="option"
										aria-selected={value === OTHER_VALUE}
										onClick={() => select(OTHER_VALUE)}
										className={cn(
											'w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer',
											value === OTHER_VALUE ? t.optionSelected : t.optionHover,
											value === OTHER_VALUE ? t.optionSelectedText : t.option,
											isMono && 'font-mono italic'
										)}
									>
										<span className="truncate">{OTHER_VALUE}</span>
										{value === OTHER_VALUE && <Check size={15} className="shrink-0" />}
									</button>
								</div>
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
