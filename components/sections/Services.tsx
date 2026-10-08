'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { localizeHref, type Locale } from '@/lib/i18n/locale'
import { servicesByLocale, type ServicesSectionDict } from '@/lib/i18n/services'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LOOK, OfferFoot, type OfferModel } from './services/shared'
import { PlanOffer } from './services/plan'
import './services/services.css' // style sekcji we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

interface ServicesProps {
    t: ServicesSectionDict
    locale?: Locale
}

// Linki "Zobacz wiecej" per kategoria. Slugi 'ai' i 'marketing' NIE maja
// wlasnych stron kategorii (/uslugi/ai = 404, /uslugi/marketing = pusta) -
// kierujemy w realne miejsca; dziala w obu jezykach przez localizeHref.
const CATEGORY_HREF: Record<string, string> = {
    'strony-www': '/uslugi/strony-www',
    design: '/uslugi/design',
    ai: '/uslugi/automatyzacje-ai/chatboty-ai',
    marketing: '/uslugi',
}
const categoryHref = (slug: string) => CATEGORY_HREF[slug] ?? `/uslugi/${slug}`
// Karta audytu SEO wskazuje pusta strone-placeholder (PL) / nieistniejaca (EN) -
// do czasu uzupelnienia oferty kierujemy w hub uslug.
const cardHref = (href: string) => (href.startsWith('/uslugi/marketing') ? '/uslugi' : href)

// Sekcja "Oferta" (#oferta na wrapperze w HomeClient, #uslugi na samej sekcji - obie kotwice
// muszą zostać). Układ PLAN (wybór właściciela 2026-09-27 z propozycji Plan / Stroik / Karta / Cel):
// oferta jako teczka rysunków technicznych, które rysują się i ożywają krótkimi scenkami
// (services/plan.tsx + services/drawings.tsx). Notatki: docs/sekcje/oferta.md.
// Ruch kinowy (kamera w scenkach, przysłona deski, światło na krawędzi, kaskada kart, nagłówek spod maski,
// napisy pośrodku) jest częścią sekcji (właściciel: "wprowadź te motion animacje do obecnej wersji").
// Tło sekcji: czysta czerń (wybór właściciela 2026-09-27: "Bez tła" z propozycji Promienie / Przepływ /
// Linie konstrukcyjne - reszta usunięta).

export const Services = ({ t, locale = 'pl' }: ServicesProps) => {
    const reduced = useReducedMotion() ?? false
    const secRef = useRef<HTMLElement>(null)

    // Wejście sekcji: nagłówek i karty wchodzą, gdy sekcja pojawia się na ekranie (data-seen, raz).
    useEffect(() => {
        const sec = secRef.current
        if (!sec) return
        sec.setAttribute('data-live', '') // stany "przed wejściem" tylko z JS - bez niego wszystko widać
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            sec.setAttribute('data-seen', '')
            io.disconnect()
        }, { threshold: 0.12 })
        io.observe(sec)
        return () => io.disconnect()
    }, [])

    // Model sekcji: kolejność, ikony i adresy z app/data/services.ts (wspólne z /uslugi),
    // teksty z pól słownika sekcji (pisownia zdaniowa, głos korzyści).
    const m = useMemo<OfferModel>(() => {
        const data = servicesByLocale[locale]
        let i = 0
        const cats = data.map((c) => {
            const items = c.cards.map((card) => {
                const copy = t.items[card.href]
                const look = LOOK[card.href] ?? { acc: '147 197 253', art: 'onepage' as const }
                return {
                    id: card.href,
                    i: i++,
                    cat: c.id,
                    catLabel: t.categories[c.id] ?? c.label,
                    name: copy?.name ?? card.title,
                    short: copy?.short ?? card.title,
                    line: copy?.line ?? card.desc,
                    points: copy?.points ?? card.features.slice(0, 3),
                    story: copy?.story ?? [],
                    href: localizeHref(cardHref(card.href), locale),
                    soon: card.href.startsWith('/uslugi/marketing'),
                    acc: look.acc,
                    art: look.art,
                }
            })
            return { id: c.id, label: t.categories[c.id] ?? c.label, href: localizeHref(categoryHref(c.slug), locale), items }
        })
        return {
            cats,
            items: cats.flatMap((c) => c.items),
            allHref: localizeHref('/uslugi', locale),
            ctaHref: localizeHref('/kontakt', locale),
        }
    }, [t, locale])

    return (
        // overflow-x-clip (nie hidden): nic nie wystaje w poziomie, a przyklejone elementy działają.
        <section ref={secRef} className="of" id="uslugi" aria-labelledby="of-title">
            <div className="container mx-auto px-6">
                <header className="of-head">
                    <p className="im-label"><SectionLabel>{t.label}</SectionLabel></p>
                    {/* Linijki tytułu w maskach (.of-rv) - wyjeżdżają od dołu, gdy sekcja pojawia się na ekranie. */}
                    <h2 className="im-title" id="of-title">
                        <span className="of-rv"><span className="of-rv-i">{t.title}</span></span>
                        <span className="im-accent of-rv"><span className="of-rv-i">{t.titleAccent}</span></span>
                    </h2>
                    <p className="im-lead">{t.intro}</p>
                </header>
            </div>
            <PlanOffer t={t} m={m} locale={locale} reduced={reduced} />
            <div className="container mx-auto px-6"><OfferFoot t={t} m={m} /></div>
        </section>
    )
}
