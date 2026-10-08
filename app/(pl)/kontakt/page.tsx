'use client'

import { useContactForm } from './useContactForm'
import { ContactSection } from './ContactSection'
import { kontaktDict } from '@/lib/i18n/kontakt'

export default function ContactPage() {
	const t = kontaktDict.pl
	const ctx = useContactForm(t.send, { subject: t.serviceSelect.auditOption.value, message: t.auditPrefill })
	return <ContactSection ctx={ctx} t={t} locale="pl" />
}
