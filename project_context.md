# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu).

## Stack technologiczny

| Warstwa | Technologie |
|---------|-------------|
| Framework | Next.js 16.1.1, React 19.2.3 |
| Stylowanie | Tailwind CSS v4 (PostCSS) |
| Animacje | Framer Motion 12, GSAP 3 + @gsap/react + ScrollTrigger |
| Smooth scroll | Lenis 1.3 (`SmoothScrolling.tsx` provider) |
| Formularze | React Hook Form + Web3Forms (klient-only, bez backendu) |
| Ikony | Lucide React, React Icons |
| Treść bloga | Raw HTML string (`dangerouslySetInnerHTML`) — NIE Portable Text |
| Zainstalowane, ale nieużywane (kandydaci do `npm uninstall`) | `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, `@portabletext/react` |

## Sekcje strony głównej (kolejność z `app/page.tsx`)

1. **Hero** — split: nagłówek + makieta "powiadomień firmy" (3 karty z opóźnioną sekwencją spring), animowane bloby CSS
2. **TechStack** — marquee 7 metryk (CSS `animate-scroll`)
3. **Portfolio** — desktop: horizontal scroll 300vh z `FocusCard` (płaskowyż ostrości); mobile: snap-x
4. **Process** — pionowy timeline z `scaleY` na pasku (#proces)
5. **Impact** — bento 4 karty + animowany licznik (mutacja DOM bez re-renderu)
6. **Testimonials** — 2 opinie Google (#opinie)
7. **AiConsultant** — fake-chat sekwencja + CTA otwierający chatbota
8. **Services** — desktop taby / mobile accordion (#oferta + sekcja ma także id="uslugi")
9. **BlogTeaser** — top 3 najnowsze
10. **CallToAction** — finalny CTA do `/kontakt` (#kontakt)

Wszystkie sekcje poza Hero ładowane przez `next/dynamic` (lazy loading) + wrapper `.render-optimize` (`content-visibility: auto` + `contain-intrinsic-size`).

## Architektura warstwy globalnej

`app/layout.tsx` opakowuje treść w:
- **SmoothScrolling** (`components/providers/SmoothScrolling.tsx`):
  - `ReactLenis` z `duration: 1.2`, `syncTouch: true`
  - integracja `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`
  - **globalny reset scrolla** przy każdej zmianie `pathname` (naprawia lądowanie w połowie strony po przejściu, ale wymaga `setTimeout(300)` w AnchorManager żeby nie kolidować z `?target=`)
  - `AnchorManager` — obsługa `?target=sectionId` z auto-korekcją w `onComplete` (retry x3 jeśli `rect.top - 80 > 5px`)
- **LifecycleManager** (`components/utils/LifecycleManager.tsx`): `lenis.stop()` gdy `document.hidden`, `lenis.start() + lenis.resize()` po powrocie (rozwiązuje znaną kombinację Lenis+ScrollTrigger zacinającą się po tab-switch)
- **Navbar** (sticky, dynamiczny motyw granicy per pathname)
- **Footer**
- **Chatbot** (globalny widget z bubble)

## Kategorie usług i routing

| Kategoria | Slug | Podstrony (aktywne) | Wkrótce |
|-----------|------|---------------------|---------|
| Strony WWW | `strony-www` | One-page, Profesjonalna strona firmowa, Dedykowane strony WWW, Sklepy internetowe, Aplikacje Webowe | — |
| Design | `design` | UI/UX (`/uslugi/design/ui-ux`) | Identyfikacja Wizualna, Materiały Marketingowe |
| Automatyzacja AI | `automatyzacje-ai` | Chatboty AI (`/uslugi/automatyzacje-ai/chatboty-ai`) | — |
| Marketing i Sprzedaż | `marketing` | — | Audyt SEO i Wydajności |

`/uslugi/` to `ServicesHub.tsx` z filtrowaniem po kategoriach (Framer Motion `AnimatePresence` + `layout`). Usługi `isActive: false` wyświetlają "Wkrótce dostępne" z `opacity-50`.

### Wzorzec podstron usług

Każda podstrona = `page.tsx` (server, eksportuje `metadata`) + `*Client.tsx` (client, animacje).
Wspólny szablon: `components/templates/ServiceTemplate.tsx` (z `children` na customowe sekcje).
ALE — większość podstron stron-www i `/chatboty-ai` NIE używa template'a, ma własne ambitne scroll-locki (np. `OnePageClient` ma makietę przeglądarki 400vh + scope cards 300vh; `ChatbotsAIClient` ma scroll-lock 700vh z animacją chat-window).

## Portfolio

Projekty w `app/data/projects.ts`. Aktualnie **3 projekty**:

| slug | Klient | hasCaseStudy | openChat |
|------|--------|--------------|----------|
| `mcentrumfizjoterapia` | Mcentrum Fizjoterapia | tak (case study + galeria) | — |
| `klub-sportowy` | Radzyński Klub Sportowy | nie (tylko external link) | — |
| `wirtualny-asystent-ai` | Avenly | nie | **tak** (kliknięcie otwiera chatbot przez `avenly:open-chat`) |

Pola projektu: `slug`, `title`, `category`, `year`, `client`, `description`, `mainImage`, `mockupImage`, `gallery[]`, `hasCaseStudy`, `externalLink`, `openChat?`, `techStack[]`, `stats[]`, `challenge`, `solution`.

`/realizacje/[slug]` ma `generateStaticParams` filtrujące po `hasCaseStudy: true`.
`StatsSpotlight` (komponent stat-grid) ma efekt reflektora podążającego za myszką (CSS custom properties `--mouse-x/y`).

## Blog

Posty w `app/data/posts.ts`. Routing: `/blog/[slug]`. Aktualnie **3 posty** (wszystkie datowane styczeń 2026).

**Treść to raw HTML string** (`content: string`), renderowany przez `dangerouslySetInnerHTML` z klasami `prose prose-invert` + custom `blog-content` z `globals.css`. Pakiet `@portabletext/react` jest zainstalowany, ale nieużywany.

`BlogList` (komponent) obsługuje filtr kategorii (drag-scroll z `PointerEvents`, rozróżnia touch vs mouse), search po tytule/excerpcie, sort newest/oldest.

## Formularz kontaktowy

- Komponent: `app/kontakt/page.tsx`
- Integracja: **Web3Forms** (`access_key: 'ca77c076-...'` zaszyte w kodzie)
- Walidacja: React Hook Form
- Pola: imię, email, telefon, temat, wiadomość, zgoda RODO
- Honeypot: ukryte pole `botcheck`

## Pełna mapa routingu

```
/                          — strona główna
/uslugi/                   — ServicesHub (katalog z filtrami)
/uslugi/strony-www/        — kategoria + 5 kart
  one-page/
  profesjonalna-strona-firmowa/
  dedykowane-strony-www/
  sklepy-internetowe/
  aplikacje-webowe/
/uslugi/design/            — kategoria + 1 aktywna karta
  ui-ux/
/uslugi/automatyzacje-ai/
  chatboty-ai/
/uslugi/marketing/                       — ⚠️ return null (pusta strona kategorii)
/uslugi/marketing/audyt-wydajnosci-seo/  — ⚠️ return null (pusta podstrona)
/realizacje/               — lista projektów z filtrami
/realizacje/[slug]/        — case study (tylko gdy hasCaseStudy)
/blog/                     — lista postów z filtrami
/blog/[slug]/              — post
/o-nas/                    — GSAP zoom hero + stats + FAQ
/kontakt/
/polityka-prywatnosci/
sitemap.xml + robots.txt   — force-static
```

## Nawigacja

- Logo → `/` (na home: scroll-to-top przez Lenis)
- Usługi → `/uslugi/`
- Proces → `#proces` (kotwica, na innych stronach → `/?target=proces`)
- O nas → `/o-nas`
- Realizacje → `/realizacje`
- Blog → `/blog`
- Kontakt → `/kontakt`

`Navbar` ma dynamiczny motyw granicy zależny od pathname:
- `/strony-www/sklepy-internetowe` → amber
- `/strony-www/aplikacje-webowe` → sky
- `/strony-www/dedykowane-strony-www` → violet
- `/strony-www/one-page` → blue
- `/strony-www/profesjonalna-strona-firmowa` → emerald
- `/automatyzacje-ai/chatboty-ai` → teal
- domyślny → slate

## Branding

- **Nazwa:** Avenly (logo: `AVENLY.` z niebieską kropką)
- **Kolory:** ciemne tło `#050505` / `#080808` / `#0a0a0a`, akcent niebieski `#2f5beb` / blue-400/500/600, white text
- **Ton:** profesjonalny, nowoczesny, technologiczny (patrz [PRODUCT.md](./PRODUCT.md))
- **Język:** polski (PL)

## Pliki kluczowe do edycji treści

| Co edytować | Plik |
|-------------|------|
| Usługi i opisy (główna sekcja taby/accordion) | `components/sections/Services.tsx` + `app/data/services.ts` |
| Katalog usług `/uslugi/` (filtry, kafle) | `app/uslugi/ServicesHub.tsx` |
| Strony kategorii `/uslugi/strony-www/`, `/uslugi/design/` itp. | `app/uslugi/<kategoria>/page.tsx` |
| Podstrony konkretnych usług | `app/uslugi/<kategoria>/<slug>/page.tsx` + `*Client.tsx` |
| Projekty portfolio | `app/data/projects.ts` |
| Artykuły bloga | `app/data/posts.ts` |
| Sekcja Hero | `components/sections/Hero.tsx` |
| Opinie | `components/sections/Testimonials.tsx` |
| Statystyki / kafle "Dlaczego Avenly" | `components/sections/Impact.tsx` |
| Stopka | `components/layout/Footer.tsx` |
| Nawigacja | `components/layout/Navbar.tsx` |
| CTA do AI (wielokrotnie używane) | `components/AvenlyAICta.tsx` |
| Process Accordion (różne mapy per kategoria) | `components/ProcessAccordion.tsx` |

## Chatbot AI (`components/chatbot/Chatbot.tsx`)

Floating bubble (z-30, niżej niż mobile menu z-40) + okno czatu. Zintegrowany globalnie w `app/layout.tsx`.

| Co | Jak |
|---|---|
| Endpoint | `NEXT_PUBLIC_N8N_CHATBOT_URL` (n8n webhook bezpośrednio, NIE przez `/api/chat`) |
| Autoryzacja | Header `x-chatbot-secret: NEXT_PUBLIC_CHATBOT_SECRET` |
| Historia in-progress | `sessionStorage: avenly_chat_current` |
| Historia ukończonych | `localStorage: avenly_chat_sessions` (max 15) |
| Zapis wiadomości do bazy | Supabase `chat_messages` (anon INSERT) — **sekwencyjny**: user → then assistant (gwarantuje kolejność `created_at`) |
| Konfiguracja z DB | Pobiera `welcome_message` + `quick_replies` z `chatbot_config` (Supabase, anon SELECT) |
| Otwarcie z innych miejsc | Dispatch `window.dispatchEvent(new Event("avenly:open-chat"))` (używane w: AiConsultant, AvenlyAICta, Portfolio karta AI, lista projektów) |

### Quick Replies
- `triggers: ('start' | 'always' | 'keyword')[]` — multi-trigger per button
- `start` → pod wiadomością powitalną; `always` → nad inputem; `keyword` → po dopasowaniu w odpowiedzi bota (case-insensitive `includes`)
- Backward compat: stary format `trigger: string` obsługiwany przez `hasTrigger()` helper
- Zarządzane z CRM (Tab Konfiguracja w `/chatbot` w projekcie `avenly-crm`)

### Zmienne środowiskowe (`.env.local`)
```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Znane ograniczenia / pułapki

### Architektura
- **Static export** — brak API routes, brak SSR. Chatbot strzela bezpośrednio do n8n po stronie klienta (martwy `app/api/chat/route.ts` został usunięty 2026-05-22).
- **Obrazy** muszą być w `public/` lub na hostach zdefiniowanych w `next.config.ts` (`images.unoptimized: true` + `remotePatterns` dla `images.unsplash.com`).
- **Lenis + GSAP ScrollTrigger** wymagają synchronizacji — `SmoothScrolling.tsx` jest providerem; nie modyfikuj scroll behavior globalnie (`window.scrollTo` jest OK tylko na mobile gdzie Lenis ma `syncTouch`).
- **Reset scrolla przy zmianie pathname** (`lenis.scrollTo(0, {immediate:true})`) — naprawia lądowanie w połowie strony, ale wymaga `setTimeout(300)` w `AnchorManager` żeby nie kolidować z `?target=`.
- **Tailwind v4** — `tailwind.config.ts` to legacy v3 config; większość pól (kolory `avenly`, `borderRadius`) jest **ignorowana**. Realna konfiguracja w `app/globals.css` (`@theme inline`).

### Bugi w danych (do naprawy)
- `app/data/services.ts` design card: `href: '/uslugi/design/design-stron-internetowych'` → **nie istnieje** (faktyczna strona pod `/uslugi/design/ui-ux`). `ServicesHub.tsx` ma poprawny link, ale `Services.tsx` (taby na Home) prowadzi w pustkę → 404.
- `app/data/services.ts` marketing card: `href: '/uslugi/marketing/audyt-seo-wydajnosci'` → **niezgodny slug**, folder to `audyt-wydajnosci-seo`.
- `app/uslugi/marketing/page.tsx` i `app/uslugi/marketing/audyt-wydajnosci-seo/page.tsx` zwracają `return null` → pusta strona z samym Navbarem/Footerem.
- `app/sitemap.ts` iteruje po `services.cards[].href` → wpisuje do sitemap powyższe nieistniejące URL-e.
- `app/data/posts.ts` post #2 blockquote linkuje `/audyt` → strona nie istnieje (powinno być `/kontakt`).

### Chatbot
- Wszystkie callsy client-side przez `NEXT_PUBLIC_*` zmienne — baked-in at build time → zmiana endpointu lub secretu wymaga rebuildu i ponownego uploadu `out/` na Hostinger.
- `sendMessage` przyjmuje opcjonalny `overrideText?: string` — używany przez quick reply buttons; onClick na przycisku send to `() => sendMessage()`, NIE `sendMessage` (inaczej `MouseEvent` przekazany jako string).
- Wymaga w Supabase tabeli `chat_messages` z RLS policy `anon INSERT` oraz `chatbot_config` z `anon SELECT`. SQL w `Desktop/progress.md` Sesja 3.

### Inne
- Footer ma `href: '#uslugi'` — sekcja `Services` ma jednocześnie `id="oferta"` (wrapper z page.tsx) i `id="uslugi"` (sama `<section>`). Dwa id na ten sam obszar — kompatybilność wsteczna, ale do uporządkowania.
- `Hero.tsx` używa `<style dangerouslySetInnerHTML>` z keyframes blob'ów — działa, ale czystsze byłoby przeniesienie do `globals.css`.
- `OnePageClient.tsx` Counter animuje 0 → 3 obok napisu "3–5 dni" — wizualnie sugeruje że licznik dochodzi do 5; lepiej zmienić target lub usunąć counter.
- Wszystkie 3 posty bloga datowane styczeń 2026 — wygląda jak content seed; warto rozłożyć daty lub dodać świeżą treść.
