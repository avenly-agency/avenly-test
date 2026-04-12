# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu).

## Sekcje strony głównej (kolejność)

1. **Hero** — animowany banner z efektami blur/blob
2. **TechStack** — showcase technologii
3. **Portfolio** — poziomy scroll z 4 projektami
4. **Process** — accordion z procesem realizacji
5. **Impact** — statystyki / wyniki
6. **Testimonials** — opinie klientów
7. **AiConsultant** — CTA dla chatbota AI
8. **Services** — taby (desktop) / accordion (mobile) z usługami
9. **BlogTeaser** — ostatnie artykuły
10. **CallToAction** — formularz kontaktowy

## Kategorie usług

| Kategoria | Podstrony |
|-----------|-----------|
| Strony WWW | One-page, Profesjonalna strona firmowa, Dedykowane strony WWW, Sklepy internetowe |
| Design | UI/UX |
| Marketing | Audyt wydajności SEO |
| Automatyzacja AI | Chatboty AI |

## Portfolio

Projekty zdefiniowane w `app/data/projects.ts`. Każdy projekt ma:
- `slug` — URL
- `title`, `description`, `category`
- `mainImage`, `mockupImage`, gallery
- `techStack[]`
- `stats` — wyniki (challenge/solution)
- `liveUrl` — link do realizacji

## Blog

Posty w `app/data/posts.ts`. Routing: `/blog/[slug]`. Treść renderowana przez Portable Text (Sanity-compatible format).

## Formularz kontaktowy

- Komponent: `components/sections/CallToAction.tsx`
- Integracja: **Web3Forms** (wysyła e-mail bez backendu)
- Walidacja: React Hook Form
- Pola: imię, email, telefon, temat, wiadomość, zgoda RODO
- Honeypot: zabezpieczenie przed botami

## Nawigacja

- Logo → home
- Usługi → dropdown z kategoriami
- Realizacje → `/realizacje`
- Blog → `/blog`
- O nas → `/o-nas`
- Kontakt → CTA w navbarze + `/kontakt`

## Branding

- **Nazwa:** Avenly
- **Kolory:** ciemne tło `#050505`, akcent `#2f5beb` (niebieski), white text
- **Ton:** profesjonalny, nowoczesny, technologiczny
- **Język:** polski (PL)

## Pliki kluczowe do edycji treści

| Co edytować | Plik |
|-------------|------|
| Usługi i opisy | `app/data/services.ts` |
| Projekty portfolio | `app/data/projects.ts` |
| Artykuły bloga | `app/data/posts.ts` |
| Sekcja Hero | `components/sections/Hero.tsx` |
| Testimoniale | `components/sections/Testimonials.tsx` |
| Statystyki | `components/sections/Impact.tsx` |
| Stopka | `components/layout/Footer.tsx` |
| Nawigacja | `components/layout/Navbar.tsx` |

## Znane ograniczenia

- Static export — brak API routes, brak server-side rendering
- Obrazy muszą być w `public/` lub z zewnętrznych hostów (unsplash skonfigurowany)
- Lenis + GSAP ScrollTrigger wymagają synchronizacji — nie modyfikuj scroll behavior globalnie
