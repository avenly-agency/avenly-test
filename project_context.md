# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu).

## Stack technologiczny

| Warstwa | Technologie |
|---------|-------------|
| Framework | Next.js 16.1.1, React 19.2.3 |
| Stylowanie | Tailwind CSS v4 |
| Animacje | Framer Motion 12, GSAP + @gsap/react |
| Smooth scroll | Lenis 1.3 (przez `SmoothScrolling.tsx`) |
| 3D / efekty | Three.js + React Three Fiber + Drei |
| Formularze | React Hook Form + Web3Forms (bez backendu) |
| Ikony | Lucide React, React Icons |
| Treść bloga | Raw HTML string (NIE Portable Text) |
| CMS-ready | next-sanity + @portabletext/react gotowe, ale nie aktywne |

## Sekcje strony głównej (kolejność z page.tsx)

1. **Hero** — animowany banner z efektami blur/blob
2. **TechStack** — showcase technologii
3. **Portfolio** — poziomy scroll (teaser 3 projektów)
4. **Process** — accordion z procesem realizacji (anchor `#proces`)
5. **Impact** — statystyki / wyniki
6. **Testimonials** — opinie klientów (anchor `#opinie`)
7. **AiConsultant** — CTA dla chatbota AI
8. **Services** — taby (desktop) / accordion (mobile) z usługami (anchor `#oferta`)
9. **BlogTeaser** — ostatnie artykuły
10. **CallToAction** — formularz kontaktowy (anchor `#kontakt`)

Wszystkie sekcje (poza Hero) ładowane przez `next/dynamic` (lazy loading).

## Kategorie usług i routing

| Kategoria | Podstrony (aktywne) | Wkrótce |
|-----------|---------------------|---------|
| Strony WWW | One-page, Profesjonalna strona firmowa, Dedykowane strony WWW, Sklepy internetowe, Aplikacje Webowe | — |
| Design | UI/UX (`/uslugi/design/ui-ux`) | Identyfikacja Wizualna |
| Automatyzacja AI | Chatboty AI (`/uslugi/automatyzacje-ai/chatboty-ai`) | — |
| Marketing i Sprzedaż | — | Audyt SEO i Wydajności |

Strona `/uslugi/` to `ServicesHub.tsx` z filtrowaniem po kategoriach (Framer Motion AnimatePresence). Usługi nieaktywne (`isActive: false`) wyświetlają "Wkrótce dostępne".

### Wzorzec podstron usług

Każda podstrona = `page.tsx` (server, metadata) + `XxxClient.tsx` (client, animacje). Szablon wielokrotnego użytku: `components/templates/ServiceTemplate.tsx`.

## Portfolio

Projekty w `app/data/projects.ts`. Aktualnie **3 projekty**:

| slug | Klient | hasCaseStudy |
|------|--------|--------------|
| `mcentrumfizjoterapia` | Mcentrum Fizjoterapia | tak (case study + galeria) |
| `klub-sportowy` | Radzyński Klub Sportowy | nie (tylko external link) |
| `ai-law-bot` | Kancelaria Prawna | nie |

Każdy projekt: `slug`, `title`, `category`, `year`, `client`, `mainImage`, `mockupImage`, `gallery[]`, `hasCaseStudy`, `externalLink`, `techStack[]`, `stats[]`, `challenge`, `solution`.

## Blog

Posty w `app/data/posts.ts`. Routing: `/blog/[slug]`. Aktualnie 3 posty (o AI, szybkości strony, stronie WWW w 2026). **Treść to raw HTML string** (`content: string`), renderowany przez `dangerouslySetInnerHTML` lub podobne — NIE Portable Text.

## Formularz kontaktowy

- Komponent: `components/sections/CallToAction.tsx`
- Integracja: **Web3Forms** (wysyła e-mail bez backendu)
- Walidacja: React Hook Form
- Pola: imię, email, telefon, temat, wiadomość, zgoda RODO
- Honeypot: zabezpieczenie przed botami

## Pełna mapa routingu

```
/                          — strona główna
/uslugi/                   — ServicesHub (katalog z filtrami)
/uslugi/strony-www/
  one-page/
  profesjonalna-strona-firmowa/
  dedykowane-strony-www/
  sklepy-internetowe/
  aplikacje-webowe/
/uslugi/design/
  ui-ux/
/uslugi/automatyzacje-ai/
  chatboty-ai/
/uslugi/marketing/
  audyt-wydajnosci-seo/
/realizacje/               — lista projektów
/realizacje/[slug]/        — case study
/blog/                     — lista postów
/blog/[slug]/              — post
/o-nas/
/kontakt/
/polityka-prywatnosci/
```

## Nawigacja

- Logo → `/`
- Usługi → `/uslugi/` (lub dropdown z kategoriami)
- Realizacje → `/realizacje`
- Blog → `/blog`
- O nas → `/o-nas`
- Kontakt → `/kontakt` + anchor `#kontakt` na stronie głównej

## Branding

- **Nazwa:** Avenly
- **Kolory:** ciemne tło `#050505`, akcent `#2f5beb` (niebieski), white text
- **Ton:** profesjonalny, nowoczesny, technologiczny
- **Język:** polski (PL)

## Pliki kluczowe do edycji treści

| Co edytować | Plik |
|-------------|------|
| Usługi i opisy (główna sekcja) | `components/sections/Services.tsx` |
| Usługi (podstrony, szczegóły) | `app/data/services.ts` |
| Katalog usług `/uslugi/` | `app/uslugi/ServicesHub.tsx` |
| Projekty portfolio | `app/data/projects.ts` |
| Artykuły bloga | `app/data/posts.ts` |
| Sekcja Hero | `components/sections/Hero.tsx` |
| Testimoniale | `components/sections/Testimonials.tsx` |
| Statystyki | `components/sections/Impact.tsx` |
| Stopka | `components/layout/Footer.tsx` |
| Nawigacja | `components/layout/Navbar.tsx` |
| CTA AI | `components/AvenlyAICta.tsx` |

## Chatbot AI (`components/chatbot/Chatbot.tsx`)

Floating bubble + okno chatu zintegrowane globalnie w `app/layout.tsx`.

| Co | Jak |
|---|---|
| Endpoint | `NEXT_PUBLIC_N8N_CHATBOT_URL` (n8n webhook bezpośrednio, NIE przez `/api/chat`) |
| Autoryzacja | Header `x-chatbot-secret: NEXT_PUBLIC_CHATBOT_SECRET` |
| Historia | localStorage: `avenly_chat_current` + `avenly_chat_sessions` (max 15) |
| Zapis wiadomości | Supabase `chat_messages` (anon INSERT) — sekwencyjny: user → then assistant |
| Konfiguracja z DB | Pobiera `welcome_message` + `quick_replies` z `chatbot_config` (Supabase, anon) |

### Quick Replies
- `triggers: ('start' | 'always' | 'keyword')[]` — multi-trigger per button
- `start` → pod wiadomością powitalną; `always` → nad inputem; `keyword` → po dopasowaniu w odpowiedzi bota
- Backward compat: stary format `trigger: string` obsługiwany przez `hasTrigger()` helper
- Zarządzane z CRM (Tab Konfiguracja w `/chatbot`)

### Zmienne środowiskowe (`.env.local`)
```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Znane ograniczenia / pułapki

- Static export — brak API routes, brak server-side rendering
- Obrazy muszą być w `public/` lub zewnętrznych hostach (unsplash skonfigurowany)
- Lenis + GSAP ScrollTrigger wymagają synchronizacji — nie modyfikuj scroll behavior globalnie (`SmoothScrolling.tsx` jest providerem)
- W `app/data/services.ts` href design card wskazuje na `/uslugi/design/design-stron-internetowych` (błąd), ale faktyczna strona jest pod `/uslugi/design/ui-ux` — `ServicesHub.tsx` ma poprawny link
- Blog: treść to HTML string, nie Portable Text — mimo że pakiet `@portabletext/react` jest zainstalowany
- Chatbot: static export → wszystkie callsy client-side przez `NEXT_PUBLIC_` zmienne; zmiana config wymaga rebuildu i ponownego uploadu `out/` na Hostinger
- `Chatbot.tsx` `sendMessage` przyjmuje opcjonalny `overrideText?: string` — używany przez quick reply buttons; onClick na przycisku send to `() => sendMessage()`, NIE `sendMessage` (inaczej MouseEvent przekazany jako string)
