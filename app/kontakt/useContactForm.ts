'use client'

import { useState } from 'react'
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

const ACCESS_KEY = 'ca77c076-e155-415a-b27d-7262de9fedb2'

export function useContactForm(): ContactFormShared {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)

	const form = useForm<ContactFormData>()

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
				setServerError(result.message || 'Wystąpił błąd po stronie serwera. Spróbuj ponownie.')
			}
		} catch {
			setServerError('Błąd połączenia. Sprawdź internet.')
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
