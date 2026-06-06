'use client'

import { useContactForm } from './useContactForm'
import { ContactSection } from './ContactSection'

export default function ContactPage() {
	const ctx = useContactForm()
	return <ContactSection ctx={ctx} />
}
