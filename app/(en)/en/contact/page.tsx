'use client'

import { useContactForm } from '../../../(pl)/kontakt/useContactForm'
import { ContactSection } from '../../../(pl)/kontakt/ContactSection'
import { kontaktDict } from '@/lib/i18n/kontakt'

export default function ContactPageEn() {
	const t = kontaktDict.en
	const ctx = useContactForm(t.send, { subject: t.serviceSelect.auditOption.value, message: t.auditPrefill })
	return <ContactSection ctx={ctx} t={t} locale="en" />
}
