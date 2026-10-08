'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'

export type ContactFormData = {
	name: string
	email: string
	phone?: string
	subject: string
	message: string
	privacy: boolean
	botcheck: boolean
}

export type ContactFormShared = {
	form: UseFormReturn<ContactFormData>
	isSubmitting: boolean
	isSuccess: boolean
	serverError: string | null
	resetSuccess: () => void
	onSubmit: (data: ContactFormData) => Promise<void>
}

/** Localized send-failure copy (translated per locale, passed from the page). */
export type ContactSendMessages = {
	serverError: string
	networkError: string
}

/** Prefill po przejściu z hero (`/kontakt/?audyt=<url>`): temat + treść z adresem strony. */
export type ContactAuditPrefill = {
	subject: string
	/** Szablon z `{url}`. */
	message: string
}

const ACCESS_KEY = 'ca77c076-e155-415a-b27d-7262de9fedb2'

export function useContactForm(messages: ContactSendMessages, audit?: ContactAuditPrefill): ContactFormShared {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)

	const form = useForm<ContactFormData>()

	// Hero homepage ("Zbadaj stronę") kieruje tu z `?audyt=<url>`. Czytamy window.location
	// zamiast useSearchParams - ten wymaga Suspense przy static export, a parametr jest
	// potrzebny tylko raz, po mount. Pola zostają edytowalne; użytkownik dopisuje kontakt.
	const auditSubject = audit?.subject
	const auditMessage = audit?.message
	const { setValue } = form
	useEffect(() => {
		if (!auditSubject || !auditMessage) return
		const url = new URLSearchParams(window.location.search).get('audyt')
		if (!url || url.length > 300 || !/^https?:\/\//i.test(url)) return
		setValue('subject', auditSubject)
		setValue('message', auditMessage.replace('{url}', url))
	}, [auditSubject, auditMessage, setValue])

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true)
		setServerError(null)

		if (data.botcheck) {
			setIsSubmitting(false)
			return
		}

		try {
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
					subject: `Nowa wiadomość od: ${data.name} - ${data.subject}`,
				}),
			})

			const result = await response.json()

			if (result.success) {
				setIsSuccess(true)
				form.reset()
			} else {
				setServerError(result.message || messages.serverError)
			}
		} catch {
			setServerError(messages.networkError)
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		form,
		isSubmitting,
		isSuccess,
		serverError,
		resetSuccess: () => setIsSuccess(false),
		onSubmit,
	}
}
