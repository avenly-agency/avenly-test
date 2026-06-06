# Project Context — Avenly Web

## Czym jest ten projekt

Strona internetowa agencji marketingowej **Avenly**. Prezentuje ofertę, portfolio, blog i umożliwia kontakt. Zbudowana jako statyczny export Next.js (hosting bez backendu, za Cloudflare CDN).

## Stan strony (2026-06-01)

| Metryka | Wartość |
|---|---|
| Copywriting | ✅ Sesja 27 — cała strona przepisana „głosem klienta" (value-first, mniej żargonu, mocniejsze CTA) |
| Cookie consent (RODO) | ✅ Sesja 27 — baner 4-kategoriowy (`lib/cookie-consent.ts` + `components/cookie/CookieConsent.tsx`), granularne ustawienia, montowany w DeferredClientWidgets |
| Polityka prywatności | ✅ Sesja 27 — pełne 12 sekcji RODO ("Polityka prywatności i cookies"), dark glassmorphism cards, dane z `lib/seo-data` |
| Navbar theming per podstrona | ✅ Sesja 27 — `getNavbarTheme()` zwraca pełny obiekt `NavTheme` (kropka AVENLY tween koloru + hover underline/glow/hamburger/blob menu/social/CTA per podstrona) |
| PageSpeed mobile | **85** / 100 (po Sesji 22 shadery na mobile — oczekiwany spadek 5-10pt do weryfikacji) |
| PageSpeed desktop | **99** / 100 |
| FCP / LCP / CLS / TBT (mobile) | 2.8s / 4.1s / 0 / 30ms |
| Accessibility issues | 0 (po wszystkich iteracjach) |
| SEO setup | 8 typów JSON-LD schema, OG image, favicon set, robots 2026-ready |
| AI search visibility | Google AI Overviews aktywnie cytuje z linkiem |
| WebGL shaders | **12 lokalizacji** (Sesja 24: dodany PortfolioFlowBackground — subtle aurora pod Portfolio sticky child) |
| Production navigation | ✅ Naprawione w Sesji 20 (Next.js 16 RSC bug — `scripts/flatten-rsc.mjs` post-build script) |
| Safari mobile compatibility | ✅ Sesja 21+22 — Chatbot dvh height, filter scroll, sticky piny dvh, **overflow-x-clip** (Sesja 22 cofnięte z hidden bo łamało sticky), backdrop-filter -webkit prefixes, viewportFit cover |
| Mobile UX bugs | ✅ Sesja 22 — 4 zgłoszone bugi naprawione (menu horizontal scroll, random scroll-to-top, ServicesHub filter UX, service subpages scroll-lock broken) |
| Service subpages shadery na mobile | ✅ Sesja 22 — 6 plików (5× strony-www + UI/UX), DPR mobile 1.0 / desktop 1.5/1.25, IO pause + 30fps zachowane |
| Scope cards layout | ✅ Sesja 23 — vertical stack (heading nad cards centered), max-w-2xl, mask 8%-92% (2 widoczne naraz), 5 podstron strony-www zsynchronizowane |
| Hero perf | ✅ Sesja 24 — Framer Motion intro (zamiast CSS animations które laggowały), `isolate` text container, aurora deferred z requestIdleCallback + motion fade-in 1.2s, SSR baseline gradient (no "pusty ekran"), notification stack state-driven z layout animation (newest na górze, push down) |
| Portfolio depth | ✅ Sesja 24 — 6 warstw głębi: aurora flow shader → grid dots → floor reflection → blobs → cards z baseline shadow + lift → LiquidGlass CTA |
| Bento corner fix | ✅ Sesja 24 — shader wrapper `inset-0` → `inset-px` w 7 plikach (eliminuje shader prześwitywanie przez border anti-aliasing) |

## Stack technologiczny

| Warstwa | Technologie |
|---------|-------------|
| Framework | Next.js 16.1.1 (Turbopack), React 19.2.3 |
| Stylowanie | Tailwind CSS v4 (PostCSS) |
| Animacje | Framer Motion 12, GSAP 3 + @gsap/react + ScrollTrigger |
| Smooth scroll | Lenis 1.3 (`SmoothScrolling.tsx` provider) |
| Formularze | React Hook Form + Web3Forms (klient-only, bez backendu) |
| Ikony | Lucide React, React Icons |
| Treść bloga | Raw HTML string (`dangerouslySetInnerHTML`) — NIE Portable Text |
| Hosting | Hostinger (Apache + `.htaccess`) za Cloudflare CDN |
| Browserslist | Chrome/Edge/FF 100+, Safari 15+, iOS 15+ (bez polyfilli ES6+) |

**Usunięte 2026-05-22** (były zainstalowane, ale nigdzie nieużywane): `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, `@portabletext/react`, `@types/three`. **Zaoszczędzone: 953 paczki z node_modules.**

## Sekcje strony głównej (kolejność z `app/page.tsx`)

1. **Hero** — split: nagłówek + makieta "powiadomień firmy" (3 karty z opóźnioną sekwencją spring). **WebGL Aurora shader** (`AuroraBackground` inline, 3-warstwowy domain-warped simplex noise) — **desktop only**, mobile fallback = 2 statyczne radial gradienty CSS (perf-critical, mobile TBT killer fix)
2. **TechStack** — marquee 7 metryk (CSS `animate-scroll`, 3× duplicate dla loopa)
3. **Portfolio** — desktop: horizontal scroll 300vh z `FocusCard` (płaskowyż ostrości z GPU caching); mobile: snap-x. **Ostatnia karta CTA na desktop ma `LiquidGlassBackground`** — WebGL shader symulujący wnętrze szkła (UV displacement, orbitujący specular highlight, rim glow). IntersectionObserver pauza gdy poza viewport
4. **Impact** — bento 4 karty z **WebGL contour shaders** (jedna rodzina wizualna, 4 warianty per kafel: TOPO_FS/ORBS_FS/VOLTAGE_FS/SCAN_FS — simplex noise + warstwice). Wspólny `ShaderCanvas` host (DPR clamp 1.25, **30fps throttle** zamiast 60). Dodatkowo `GlassEdge` per karta (iOS 26 Liquid Glass na bordzie: backdrop-filter blur(8px) saturate(150%) z 4-warstwowym linear gradient mask = ring shape bez hard edges). Animowany licznik (mutacja DOM) + bar chart `scaleY`. **(Sesja 26: przesunięty PRZED Process)**
5. **Process** — pionowy timeline z `scaleY` na pasku (GPU cached) (#proces)
6. **Testimonials** — 2 opinie Google (#opinie) + JSON-LD Review/AggregateRating (gwiazdki w SERP)
7. **AiConsultant** — fake-chat sekwencja + 2 CTA: „Zobacz chatboty AI" (→ `/uslugi/automatyzacje-ai/chatboty-ai/`, Sesja 26) + „Przetestuj Konsultanta" (otwiera chatbota)
8. **Services** — desktop taby / mobile accordion (#oferta + sekcja ma także id="uslugi")
9. **BlogTeaser** — top 3 najnowsze (useMemo, next/image lazy)
10. **CallToAction** — finalny CTA do `/kontakt` (#kontakt)

Wszystkie sekcje poza Hero ładowane przez `next/dynamic` (lazy loading). Wrapper `.render-optimize` istnieje (trzyma kotwice `#proces`/`#oferta`/...), ale **`content-visibility` zostało USUNIĘTE (Sesja 26)** — łamało piny GSAP ScrollTrigger ([#465](https://github.com/greensock/GSAP/issues/465)) + powodowało przeskakiwanie scrolla po F5. Perf zapewnia sam lazy-load + IO-pauza shaderów. NIE przywracać.

## Architektura warstwy globalnej

`app/layout.tsx` opakowuje treść w:
- **JSON-LD w `<head>`**: Organization + ProfessionalService + WebSite (zbudowane przez `lib/schemas.ts`)
- **Preconnect**: `https://kyfsjvgixmcmafvaiyak.supabase.co` (300ms LCP saving)
- **DNS prefetch**: `n8n.avenly.pl`, `images.unsplash.com` (używane po interakcji)
- **Favicon set** + `manifest.webmanifest` + `theme-color: #050505`
- **SmoothScrolling** (`components/providers/SmoothScrolling.tsx`):
  - `ReactLenis` z `duration: 1.2`, `syncTouch: true`
  - integracja `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`
  - **globalny reset scrolla** przy każdej zmianie `pathname` — odłożony do `requestAnimationFrame` (Sesja 20), bez `ScrollTrigger.refresh()` (refresh racował z unmountującymi się pinami homepage = race conditions + silent navigation fail)
  - `AnchorManager` — obsługa `?target=sectionId` z auto-korekcją w `onComplete` (retry x3)
- **Navbar** (sticky, dynamiczny motyw granicy per pathname)
- **Footer** (`dynamic` z SSR — osobny chunk, lazy hydration)
- **DeferredClientWidgets** (`'use client'` wrapper — ładuje teraz LifecycleManager + Chatbot + **CookieConsent**, wszystkie `dynamic` z `ssr: false`):
  - **LifecycleManager** — `lenis.stop()` gdy `document.hidden`, restart + resize po powrocie (lazy z `ssr: false`)
  - **Chatbot** — globalny widget z bubble (lazy z `ssr: false`, pojawia się ~500ms po hydration)
  - **CookieConsent** (Sesja 27) — baner RODO (`components/cookie/CookieConsent.tsx`, lazy z `ssr: false`)

## Kategorie usług i routing

| Kategoria | Slug | Podstrony (aktywne) | Wkrótce |
|-----------|------|---------------------|---------|
| Strony WWW | `strony-www` | One-page, Strona firmowa, Strona szyta na miarę, Sklep internetowy, System CRM i automatyzacje AI | — |
| Design | `design` | UI/UX (`/uslugi/design/ui-ux`) | Identyfikacja Wizualna, Materiały Marketingowe |
| Automatyzacja AI | `automatyzacje-ai` | Chatboty AI (`/uslugi/automatyzacje-ai/chatboty-ai`) | — |
| Marketing i Sprzedaż | `marketing` | — | Audyt SEO i Wydajności |

`/uslugi/` to `ServicesHub.tsx` z filtrowaniem po kategoriach (Framer Motion `AnimatePresence` + `layout`). Usługi `isActive: false` wyświetlają "Wkrótce dostępne" z `opacity-50`.

### Wzorzec podstron usług

Każda podstrona = `page.tsx` (server, eksportuje `metadata` + renderuje `ServicePageSchema`) + `*Client.tsx` (client, animacje).

Wspólny szablon: `components/templates/ServiceTemplate.tsx` (z `children` na customowe sekcje).
ALE — większość podstron stron-www NIE używa template'a, ma własne ambitne scroll-locki (np. `OnePageClient` ma makietę przeglądarki + scope cards; `AppWebClient` — makieta 800vh: pulpit→klienci→zadania, Sesja 26). `ChatbotsAIClient` po redesignie (Sesja 26) **NIE ma już scroll-locka** — hero z samogrającym demem „Living Ask" (typewriter Q&A), bento „Możliwości" (shader Dots per-seed + GlassEdge), „Liczby" (Editorial), „Różnica" (scroll-driven hover). Theme **orange**.

Każda aktywna podstrona usługi dostaje automatycznie:
- **Service JSON-LD** (rich result dla "wycena strony one page" itp.)
- **BreadcrumbList JSON-LD** (rich breadcrumbs w SERP)
- Pełne metadata z OG + Twitter Card + canonical + keywords

## Portfolio

Projekty w `app/data/projects.ts`. Aktualnie **3 projekty**:

| slug | Klient | hasCaseStudy | openChat |
|------|--------|--------------|----------|
| `mcentrumfizjoterapia` | Mcentrum Fizjoterapia | tak (case study + galeria) | — |
| `klub-sportowy` | Radzyński Klub Sportowy | nie (tylko external link) | — |
| `wirtualny-asystent-ai` | Avenly | nie | **tak** (kliknięcie otwiera chatbot przez `avenly:open-chat`) |

Pola projektu: `slug`, `title`, `category`, `year`, `client`, `description`, `mainImage`, `mockupImage`, `gallery[]`, `hasCaseStudy`, `externalLink`, `openChat?`, `techStack[]`, `stats[]`, `challenge`, `solution`.

`/realizacje/[slug]` ma `generateStaticParams` filtrujące po `hasCaseStudy: true`, generuje **CreativeWork** + **BreadcrumbList** JSON-LD oraz pełne OG (`mockupImage` jako preview).
`StatsSpotlight` (komponent stat-grid) ma efekt reflektora podążającego za myszką (CSS custom properties `--mouse-x/y`).

## Blog

Posty w `app/data/posts.ts`. Routing: `/blog/[slug]`. Aktualnie **3 posty** (wszystkie datowane styczeń 2026).

**Treść to raw HTML string** (`content: string`), renderowany przez `dangerouslySetInnerHTML` z klasami `prose prose-invert` + custom `blog-content` z `globals.css`. Pakiet `@portabletext/react` był zainstalowany — usunięty 2026-05-22 (nieużywany).

`BlogList` (komponent) obsługuje filtr kategorii (drag-scroll z `PointerEvents`, rozróżnia touch vs mouse), search po tytule/excerpcie, sort newest/oldest.

`/blog/[slug]` generuje **BlogPosting** + **BreadcrumbList** JSON-LD, używa `post.mainImage` jako OG image, dodaje `article:published_time`, `authors`, `articleSection`.

## Formularz kontaktowy

- Komponent: `app/kontakt/page.tsx` + `app/kontakt/ContactSection.tsx`
- Integracja: **Web3Forms** (`access_key: 'ca77c076-...'` zaszyte w kodzie)
- Walidacja: React Hook Form
- Pola: imię, email, telefon, temat, wiadomość, zgoda RODO
- Honeypot: ukryte pole `botcheck`
- **Dwa numery telefonu (Sesja 27)**: `lib/seo-data.ts` CONTACT ma `phone` + `phoneDisplay` (`+48 668 124 367`) oraz `phone2: '+48531104402'` + `phone2Display` (`+48 531 104 402`). `ContactSection.tsx` pokazuje oba jako klikalne linki `tel:`.

## Pełna mapa routingu

```
/                          — strona główna (Home)
/uslugi/                   — ServicesHub (katalog z filtrami)
/uslugi/strony-www/        — kategoria + 5 kart
  one-page/                — Service JSON-LD
  strona-firmowa/
  strona-szyta-na-miare/
  sklep-internetowy/
  system-crm/
/uslugi/design/            — kategoria + 1 aktywna karta
  ui-ux/                   — layout.tsx z ServicePageSchema (page jest 'use client')
/uslugi/automatyzacje-ai/
  chatboty-ai/
/uslugi/marketing/                       — ⚠️ return null (pusta strona kategorii)
/uslugi/marketing/audyt-wydajnosci-seo/  — ⚠️ return null (pusta podstrona)
/realizacje/               — lista projektów z filtrami
/realizacje/[slug]/        — case study (tylko gdy hasCaseStudy) + CreativeWork JSON-LD
/blog/                     — lista postów z filtrami
/blog/[slug]/              — post + BlogPosting JSON-LD
/o-nas/                    — GSAP zoom hero + stats + FAQ + FAQPage JSON-LD
/kontakt/
/polityka-prywatnosci/     — "Polityka prywatności i cookies" (12 sekcji RODO, dark glassmorphism); layout.tsx z metadata (page jest 'use client')
sitemap.xml + robots.txt   — force-static
manifest.webmanifest       — PWA-ready
.htaccess                  — Apache config (cache + kompresja + bezpieczeństwo)
```

## Nawigacja

- Logo → `/` (na home: scroll-to-top przez Lenis)
- Usługi → `/uslugi/`
- Proces → `#proces` (kotwica, na innych stronach → `/?target=proces`)
- O nas → `/o-nas`
- Realizacje → `/realizacje`
- Blog → `/blog`
- Kontakt → `/kontakt`

`Navbar` ma dynamiczny motyw zależny od pathname. **Sesja 27:** `getNavbarTheme(pathname)` zwraca teraz pełny obiekt `NavTheme` (rekord `NAV_THEMES`), NIE tylko string klas granicy. Motyw obejmuje: kropkę przy logo AVENLY (Framer `motion.span` z `animate={{ color: dotHex }}` + `initial={false}` = płynny tween koloru między podstronami), hover underline+glow linków desktop, hover hamburgera, blob menu mobile, hover linków+kropka mobile, hover social, hover CTA. Wszystkie klasy verbatim (Tailwind v4 JIT — zero concat dynamic). Kolory per podstrona:
- `/strony-www/sklep-internetowy` → amber (`#f59e0b`)
- `/strony-www/system-crm` → sky (`#0ea5e9`)
- `/strony-www/strona-szyta-na-miare` → **rose** (`#f43f5e`)
- `/strony-www/one-page` → blue (`#3b82f6`)
- `/strony-www/strona-firmowa` → emerald (`#10b981`)
- `/automatyzacje-ai/chatboty-ai` → orange (`#f97316`) (Sesja 26, był teal — Navbar + service-theme.ts + Chatbot widget + AvenlyAICta)
- domyślny → slate/blue (homepage, /uslugi/, /o-nas, /realizacje, /blog itp.)

## Branding

- **Nazwa:** Avenly (logo: `AVENLY.` z niebieską kropką)
- **Kolory:** ciemne tło `#050505` / `#080808` / `#0a0a0a`, akcent niebieski `#2f5beb` / blue-400/500/600, white text
- **Ton:** profesjonalny, nowoczesny, technologiczny (patrz [PRODUCT.md](./PRODUCT.md))
- **Język:** polski (PL)
- **Założenie:** 2026
- **Wizytówka Google:** `https://share.google/YgHXGeqFgrSX4FEGs` (wpięta jako `sameAs` w Organization schema)

## Pliki kluczowe do edycji treści

| Co edytować | Plik |
|-------------|------|
| Dane firmy (NIP, adres, social, Wizytówka Google) | `lib/seo-data.ts` |
| Schema.org buildery (Organization, Service, FAQ itp.) | `lib/schemas.ts` |
| Usługi i opisy (główna sekcja taby/accordion) | `components/sections/Services.tsx` + `app/data/services.ts` |
| Katalog usług `/uslugi/` (filtry, kafle) | `app/uslugi/ServicesHub.tsx` |
| Strony kategorii `/uslugi/strony-www/`, `/uslugi/design/` itp. | `app/uslugi/<kategoria>/page.tsx` |
| Podstrony konkretnych usług | `app/uslugi/<kategoria>/<slug>/page.tsx` + `*Client.tsx` |
| Projekty portfolio | `app/data/projects.ts` |
| Artykuły bloga | `app/data/posts.ts` |
| FAQ na /o-nas (też zasila FAQPage schema) | `app/o-nas/faq-data.ts` |
| Sekcja Hero | `components/sections/Hero.tsx` |
| Opinie (też zasila AggregateRating schema) | `components/sections/Testimonials.tsx` |
| Statystyki / kafle "Dlaczego Avenly" | `components/sections/Impact.tsx` |
| Stat cards na /o-nas (4× karty z layered fluid shader) | `app/o-nas/page.tsx` → `STATS` array (linia ~190) |
| Stopka | `components/layout/Footer.tsx` |
| Nawigacja | `components/layout/Navbar.tsx` |
| CTA do AI (wielokrotnie używane) | `components/AvenlyAICta.tsx` |
| Process Accordion (różne mapy per kategoria) | `components/ProcessAccordion.tsx` |
| Cookie consent (kategorie, teksty banera) | `lib/cookie-consent.ts` + `components/cookie/CookieConsent.tsx` |
| Polityka prywatności (treść 12 sekcji) | `app/polityka-prywatnosci/page.tsx` |

## Chatbot AI (`components/chatbot/Chatbot.tsx`)

Floating bubble (z-30, niżej niż mobile menu z-40) + okno czatu. **Lazy-loaded** przez `DeferredClientWidgets` (pojawia się ~500ms po hydration — nie blokuje LCP).

| Co | Jak |
|---|---|
| Endpoint | `NEXT_PUBLIC_N8N_CHATBOT_URL` (n8n webhook bezpośrednio, NIE przez `/api/chat`) |
| Autoryzacja | Header `x-chatbot-secret: NEXT_PUBLIC_CHATBOT_SECRET` |
| Historia in-progress | `sessionStorage: avenly_chat_current` |
| Historia ukończonych | `localStorage: avenly_chat_sessions` (max 15) |
| Zapis wiadomości do bazy | Supabase `chat_messages` (anon INSERT) — **sekwencyjny**: user → then assistant (gwarantuje kolejność `created_at`) |
| Konfiguracja z DB | Pobiera `welcome_message` + `quick_replies` z `chatbot_config` (Supabase, anon SELECT) |
| Otwarcie z innych miejsc | Dispatch `window.dispatchEvent(new Event("avenly:open-chat"))` (używane w: AiConsultant, AvenlyAICta, Portfolio karta AI, lista projektów) |
| A11y | `aria-label` dynamiczny (Otwórz/Zamknij czat), `aria-expanded`, `aria-haspopup="dialog"` |

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

## Cookie consent (RODO) — Sesja 27

System zgody na cookies zgodny z RODO, gotowy do bramkowania przyszłych skryptów analitycznych/marketingowych (GA, Meta Pixel).

### Logika — `lib/cookie-consent.ts`
- **4 kategorie zgody**: `necessary` (zawsze aktywne), `functional`, `analytics`, `marketing`
- `readConsent()` / `saveConsent(...)` — persystencja w `localStorage` (klucz `avenly-cookie-consent`) **oraz** cookie `cookie_consent` (wygaśnięcie **365 dni**), z wersjonowaniem przez `CONSENT_VERSION` (zmiana wersji → ponowna prośba o zgodę)
- `hasConsent('analytics')` — helper do warunkowego ładowania skryptów (np. `if (hasConsent('analytics')) loadGA()`)
- **Eventy**: `avenly:cookie-consent-change` (dispatch po zapisie — nasłuchują go przyszłe loadery skryptów) + `avenly:open-cookie-settings` (otwiera baner z poziomu Footera)

### UI — `components/cookie/CookieConsent.tsx`
- Baner RODO: **desktop bottom-left**, **mobile full-width bottom** — nie koliduje z bubble chatbota (z-index niżej / inny róg)
- Widok **compact** + rozwijane **granularne ustawienia** (toggle per kategoria; `necessary` = "Zawsze aktywne" disabled, reszta domyślnie **OFF** = privacy-first)
- Równorzędne przyciski "Odrzuć wszystkie" / "Akceptuj wszystkie" (RODO — odrzucenie tak samo łatwe jak akceptacja); przycisk **X tylko gdy zgoda już istnieje** (nie da się zamknąć banera bez decyzji za pierwszym razem)
- Bez widocznego paska scroll (`.no-scrollbar` w `globals.css`), responsywne `max-h` w `dvh`
- Montowany w **DeferredClientWidgets** (`dynamic`, `ssr: false`)
- Footer ma link **"Ustawienia cookies"** → `dispatchEvent(new Event('avenly:open-cookie-settings'))` (ponowne otwarcie banera w dowolnym momencie)

## SEO setup (kompletny — szczegóły w INSTRUKCJA-SEO.md)

### Structured Data (JSON-LD) — 8 typów
- **Organization** + **ProfessionalService** + **WebSite** — globalnie w `app/layout.tsx`
- **BreadcrumbList** — na wszystkich podstronach (blog, realizacje, usługi)
- **Service** — na 7 aktywnych podstronach usług
- **BlogPosting** — na każdym poście
- **CreativeWork** — na case studies (`/realizacje/[slug]`)
- **FAQPage** — na `/o-nas`
- **Review + AggregateRating** — w Testimonials (gwiazdki w SERP)

### Metadata
- Globalny OG + Twitter Card z fallback `/og-default.png` (1200×630, AVENLY brand)
- Każda podstrona: tytuł SEO (60-70 znaków), description 150-160 znaków, canonical, keywords PL long-tail
- `/blog/[slug]`: OG z `post.mainImage`, `article:published_time`, `authors`
- `/realizacje/[slug]`: OG z `project.mockupImage`

### Robots.txt — 2026-ready
- **Allow retrieval bots:** Google-Extended (AI Overviews), OAI-SearchBot (ChatGPT Search), PerplexityBot, ChatGPT-User, Claude-SearchBot, Applebot-Extended
- **Block training bots:** GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot
- Strategia: "Block AI training, allow AI search" — strona pojawia się w AI search results bez bycia trenowanym

### Favicon set + PWA
- favicon-16/32, apple-touch-icon (180×180), icon-192/512
- manifest.webmanifest z `theme_color: #050505`, `display: standalone`

### Performance hints
- Preconnect dla Supabase (300ms LCP saving), DNS prefetch dla n8n + Unsplash

## WebGL Shaders pipeline

Strona ma **12 lokalizacji z WebGL shaderami** (inline w plikach sekcji/podstron, bez osobnych modułów — wzorzec "inline w sekcji" pasuje do tej skali projektu). Inspiracja patternów: [Paper Design Shaders library](https://github.com/paper-design/shaders) — aplikowane bezpośrednio w GLSL (zero deps).

| Lokalizacja | Shader(y) | Typ pattern | Gate | Perf |
|---|---|---|---|---|
| **`components/sections/Hero.tsx`** | `AuroraBackground` | Aurora — 3-warstwowy domain-warped simplex noise | `(min-width: 1024px)` only + **requestIdleCallback defer** + **IO pause z rAF defer** + **visibility pause** + **motion.canvas fade-in 1.2s delay 0.6s** | **30fps**, **DPR 1.25**, **precision highp**, **vignette `vig*0.45+0.55`** (mniej dark) |
| **`components/sections/Portfolio.tsx`** (CTA card) | `LiquidGlassBackground` | Liquid Glass — UV displacement + caustics + orbital specular | `!shouldReduceMotion` + IO pause | 60fps, DPR 2 |
| **`components/sections/Portfolio.tsx`** (sticky bg) **NEW Sesja 24** | `PortfolioFlowBackground` | Aurora flow — 2-warstwowy simplex noise, blue/indigo palette, slow drift `t*0.06`, opacity-40 | `isDesktop && !shouldReduceMotion` + IO pause z rAF defer | **30fps, DPR 1.0, precision mediump** (najlżejszy shader w projekcie) |
| **`components/sections/Impact.tsx`** (×4) | `ShaderCanvas` z 4 FS: TOPO/ORBS/VOLTAGE/SCAN | Contour lines (Paper "Mesh Gradient" family) | `!shouldReduceMotion` + IO pause | 30fps, DPR 1.25 |
| **`app/o-nas/page.tsx`** (Hero AVENLY) | `AuroraBackground` (wariant) | Aurora — 4-warstwowy domain-warped noise, paleta navy/indigo/violet | desktop only | 60fps, DPR 2 |
| **`app/o-nas/page.tsx`** (Stat Cards ×4) | `HoverShader` (SyncedShaderCanvas pattern) | **Layered Fluid Waves** — 3 stratified bands z mouse-driven surface bulge + cyan halo | desktop only + IO pause | 45fps, DPR 1.25, lerp 0.08 hover smooth |
| **`app/uslugi/strony-www/one-page/OnePageClient.tsx`** | `RaysBackground` + `ShaderCanvas` ×4 | God Rays + Radial Rings + Warp + Liquid Metal | **all devices** + IO pause (od Sesji 22) | rays 60fps, bento 30fps, **mobile DPR 1.0 / desktop rays 1.5, bento 1.25** |
| **`strona-firmowa/CorporateWebsiteClient.tsx`** | Rays + bento ×4 + **CTA shader WARP_FS** (Sesja 23) | Emerald "elegant calm" variant | all devices + IO pause | 30fps, mobile DPR 1.0 / desktop 1.5/1.25 |
| **`sklep-internetowy/ShopClient.tsx`** | Rays + bento ×4 | Amber "energetic commercial" variant | all devices + IO pause | 30fps, mobile DPR 1.0 / desktop 1.5/1.25 |
| **`strona-szyta-na-miare/DedicatedWebsiteClient.tsx`** | Rays + bento ×4 | Rose "dramatic premium" variant | all devices + IO pause | 30fps, mobile DPR 1.0 / desktop 1.5/1.25 |
| **`system-crm/AppWebClient.tsx`** | Rays + bento ×4 | Sky "technical precise" variant | all devices + IO pause | 30fps, mobile DPR 1.0 / desktop 1.5/1.25 |
| **`app/uslugi/design/ui-ux/page.tsx`** | `MeshGradientBackground` (Hero) + **`SyncedShaderCanvas` ×4** (bento) | Iridescent Flow (5-octave warp + IQ palette + lime accent) hero; synced flow bento | all devices + IO pause | hero 60fps, bento 30fps, mobile DPR 1.0 / desktop hero 1.5, bento 1.25 (DPR `let` + `computeDpr()` w resize) |

### CTA shader na one-page + strona-firmowa (Sesja 23)
Sekcja CTA "Gotowy na cyfrową Dominację?" w `OnePageClient` (MESH_GRADIENT_FS) i `CorporateWebsiteClient` (WARP_FS) dostała shader w tle z `opacity-60` + lekka radial vignette `rgba(8,8,8,0.25→0.55→0.75)` + GlassEdge. CTA card teraz `rounded-3xl` + `border-white/15` (matching bento style).

### Wspólny wzorzec (host JS)

```ts
// Pattern: inline component per shader, useEffect setup, useEffect cleanup
const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    // compile VS + FS, link program, bind buffers
    // ResizeObserver dla canvas size
    // rAF loop z optional throttling
    // IntersectionObserver pauza gdy poza viewport
    return () => { /* full cleanup: cancelAnimationFrame, disconnect observers, deleteProgram/Shader/Buffer */ };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};
```

### Impact bento — paleta + strategia per kafel

| Kafel | Kolor | Layout | Strategia ochrony tekstu |
|---|---|---|---|
| **1. Inwestycja** | Blue `#2f5beb` | col-span-2 | Bias upper-right + text dim mask centered at `(-0.9, 0.35)` |
| **2. Wirtualny Asystent** | Indigo `#8c8cf2` | single | Edge bias (dim center, bright edges) |
| **3. Wydajność i SEO** | Yellow `#f2bf33` | single | **Linear opacity gradient** `smoothstep(0.0, 1.5, length(p))` (yellow ma najwyższą luminancję) |
| **4. Stabilność** | Green `#57c773` | col-span-2 | Bias right + text dim left (lustrzane odbicie kafel 1) |

Każdy ma inne `t * (0.04-0.05)` tempo, inne freq noise (1.2/1.4/1.6/1.8), inny period warstwic (2.5/2.8/3.0/3.2) — wizualna różnorodność w ramach jednej rodziny.

### /uslugi/strony-www/one-page/ bento — paleta + shader per kafel

Tu cała paleta blue brand (jednolita), ale **inne SHADER FAMILIES** per kafel (Paper Design patterns):

| Kafel | Theme | Shader pattern | Differentiator |
|---|---|---|---|
| **1. Laserowe skupienie** (col-span-2, Target) | Focus | **Radial Pulse Rings** | 4 koncentryczne pierścienie z biasem off-center, **sharp peaks** (powers 8/10/8/6) — laser-like |
| **2. Błyskawiczna weryfikacja** (single, FastForward) | Speed | **Warp** | Domain-warped color field, smooth fluid flow (Paper Design pattern) |
| **3. Idealne pod Mobile** (single, Smartphone) | Mobile | **Warp** | Ten sam shader co Card 2 (różny aspect → naturalna wariacja) |
| **4. Kompaktowa wydajność** (col-span-2, Zap) | Energy | **Liquid Metal** | Domain-warp + `pow 5` specular peaks + chromatic 2-color blend (Paper Design pattern) |

Plus identyczny `GlassEdge` co Impact ale `blur(16px) saturate(170%) brightness(110%)` (mocniej) i mask `transparent 15%` (węższy ring — blur **tylko na samych krawędziach**).

### SyncedShaderCanvas — single shader rozdystrybuowany na 4 karty (UI/UX)

Tylko w `app/uslugi/design/ui-ux/page.tsx`. Idea: 4 karty bento = 4 "okna" do jednej wirtualnej powierzchni shadera (gapy między kartami pozostają dark page bg, ale karty pokazują skoordynowane wycinki tego samego płótna).

**Mechanizm:**
- Każda karta zawiera własny `<SyncedShaderCanvas>` z `parentRef={bentoWrapperRef}` (ref na grid container)
- Module-level `SHARED_T0 = performance.now()` → wszystkie 4 instancje używają tej samej osi czasu (lock-step)
- Uniforms: `u_offset` (vec2 px) + `u_global_size` (vec2 px) — shader liczy `(gl_FragCoord + u_offset) / u_global_size` jako globalne UV
- Layout cache — pozycje canvas vs parent są cache'owane i odświeżane tylko na ResizeObserver + passive scroll listener (nie co frame, eliminuje 240 layout reads/s)
- Plus CSS `filter: blur(14px)` na canvas wrapper (`-inset-4`) — softens shader przed warstwą GlassEdge

### GlassEdge (iOS 26 Liquid Glass na obwodzie kart) — 3 tiery

| Tier | Blur | Saturate | Brightness | Contrast | Mask transparent | Lokalizacje |
|---|---|---|---|---|---|---|
| **Medium** | 16px | 170% | 110% | — | 15% | Impact (homepage) |
| **Strong** | 16px | 170% | 110% | — | 15% | 5 service subpages (one-page, strona-firmowa, strona-szyta-na-miare, sklep-internetowy, system-crm) |
| **Dramatic** | **32px** | **200%** | **120%** | **110%** | **28%** (szerszy soft ring) | UI/UX bento (4×) + UI/UX hero mockup (right side) + **/o-nas Stat Cards (4×)** — Sesja 20 |

- Ring shape przez **4 linear gradient mask layers** (right/left/top/bottom), domyślny composite `add` = opaque na krawędziach, transparent w środku, **brak hard edges** (XOR mask-composite robił widoczne "ramki w ramkach")
- Highlight stack: `inset 0 1-1.5px 0 rgba(255,255,255,0.18-0.30)` (top) + `inset 0 -1px 0 rgba(0,0,0,0.20-0.35)` (bottom), Dramatic + 1px white outline
- Border kart `border-white/15` minimum (było `/5` — niewidoczne, shader przeświecał na rounded corners)
- `z-5` (pod tekstem `z-10`+, nad shaderem `z-auto`) — blur działa na shader i dekoracje, NIE na tekst

### Perf budget shaderów

- **Hero shader (LCP-critical):** desktop only. Mobile = 2 statyczne radial gradienty CSS. Bez tego mobile TBT = 6800ms. **Od Sesji 19**: dodatkowo IO pause (gdy poza viewport — zero GPU work na pozostałych sekcjach), tab visibility pause (zero GPU gdy karta nieaktywna), 30fps throttle, DPR clamp 1.5 (było 2.0).
- **Impact shadery (4×):** 30fps throttle + DPR 1.25 = ~2.5× mniej fragment invocations niż 60fps@DPR2.
- **UI/UX SyncedShaderCanvas (4×):** ten sam pipeline (30fps, DPR 1.25, IO pause), plus **cached layout reads** — zero `getBoundingClientRect()` w draw loopie (refresh tylko na ResizeObserver/scroll).
- **IntersectionObserver pauza:** **wszystkie** shadery (od Sesji 19 Hero też) — gdy poza viewport, `cancelAnimationFrame`, zero GPU work.
- **`useReducedMotion`:** respektowany na shaderach Impact + Portfolio CTA + UI/UX bento.
- **WebGL cleanup:** każdy useEffect ma return z `gl.deleteProgram/Shader/Buffer` + `disconnect()` observers + `removeEventListener` (zapobiega context loss przy unmount, memory leaks).

## Blog content automation (2 slash commands)

Cały workflow w `.claude/commands/` + `docs/`:

```
.claude/commands/
  new-post.md           # /new-post [temat] — generuje post w stylu Avenly 1:1
                        # /new-post (puste) — multi-source research → 6 propozycji
  blog-research.md      # /blog-research — odświeża backlog o 10-15 trending tematów
docs/
  blog-style-guide.md   # konwencja: 400-600 słów, 2× h2 + 2-3× h3, 1× lista, CTA blockquote
  blog-ideas.md         # backlog: 🔥 Trending (auto-found) + TOP PRIORITY + OPUBLIKOWANE
```

### Workflow

| Command | Use case | Częstotliwość |
|---|---|---|
| `/new-post [temat]` | Konkretny temat z głowy | Co tydzień |
| `/new-post` | "Nie wiem o czym pisać — Claude, zaproponuj" | Co tydzień |
| `/blog-research` | Odświeżenie backlog'a o trending | Raz w miesiącu |

### Research mode (multi-source WebSearch)

Slash commands robią research z 4 źródeł:
- **HOT NOW** — newsy ostatnich 30 dni (Google updates, AI announcements, nowe frameworki) — spike 1-2 tyg
- **EMERGING** — trendy na fali (AI agents, server-side AI) — hot za 3-6 mies
- **SEASONAL** — pasujące do bieżącego kwartału (Q4 e-commerce, Q1 plany roczne)
- **EVERGREEN** — z backlog'a statycznego, długoterminowy traffic

Każdy znaleziony temat jest **auto-dopisywany** do `docs/blog-ideas.md` (sekcja "🔥 Trending") — historia research'u zachowana, najnowsze na górze.

### Style postów (gwarancja 1:1 z istniejącymi)

Wszystkie posty mają **identyczną** strukturę z 3 istniejącymi (post #1: Voiceflow, post #2: Szybkość, post #3: Strona WWW 2026):
- 400-600 słów (5-6 min)
- 2× `<h2>` (drugi zawsze "Podsumowanie: ...")
- 2-3× `<h3>` (sub-pytania)
- 1× lista `<ul>`/`<ol>` z `<strong>:</strong>` pattern
- `<blockquote>` CTA do `/kontakt` (NIGDY `/audyt`)
- "W Avenly..." w 1-2 miejscach
- TAB indentation w `app/data/posts.ts`, 6-space indent w `content`

Pełny style guide: [docs/blog-style-guide.md](./docs/blog-style-guide.md).

## Performance setup (wdrożone)

### .htaccess (Apache na Hostingerze)
- **Cache 1 rok immutable** dla `_next/static/*` (hash w nazwie = safe)
- **Cache 30 dni** dla obrazów
- **Cache 1h** dla HTML
- Kompresja Brotli + Gzip dla text/css/js
- **Nagłówki bezpieczeństwa**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Force HTTPS** redirect

### Code splitting
- Sekcje Home → `next/dynamic` (Hero sync, reszta lazy)
- Footer → `dynamic` z SSR (osobny chunk)
- Chatbot + LifecycleManager → `dynamic` z `ssr: false` przez `DeferredClientWidgets`

### GPU optimization
- `will-change: filter, opacity, transform` na Portfolio FocusCard (caching blur w teksturze)
- `translateZ(0)` na sticky kontenerach + scroll containers
- `backface-visibility: hidden` na /o-nas zoom hero + conic-gradient blobs
- `scaleY` zamiast `height` w Impact bar chart (zero layout passes)

### Bundle slim
- Inter font: pominięty italic (`style: ['normal']`) — **-66 KiB** woff2
- Browserslist nowoczesny — **-13 KiB** polyfilli (Next runtime nadal transpiluje swoje internals)
- 953 paczki usunięte z node_modules (unused 3D/Sanity deps)

### Marquee optimization
- TechStack: 4× → 3× duplikacja (oszczędność DOM nodes z hover handlerami)

## Heading hierarchy (zweryfikowane)

```
h1: AVENLY TWOJA FIRMA WYŻSZY POZIOM        (Hero)
├─ h2: sekcje Home (Services, Process, Impact, Testimonials, AiConsultant, BlogTeaser, CallToAction)
│  └─ h3: subsections + cards (4 steps Process, 4 cards Impact itp.)
│     └─ h4: nested cards w sekcjach z h3 (Services accordion, *Client cards)
└─ Footer: h3 Menu, h3 Legal
```

Naprawione w iteracji a11y (2026-05-23):
- Hero notifications: `<h4>` → `<p>` (mockup UI, nie sekcje dokumentu)
- Footer Menu/Legal: `<h4>` → `<h3>`
- Testimonials autor: `<h4>` → `<cite>` (semantyka cytatu)
- Polityka cookies sub-cards: `<h4>` → `<h3>`
- Kontakt InfoCard label: `<h4>` → `<p>` (etykieta pola, nie nagłówek)

## Scope cards layout pattern (5 strony-www subpages — Sesja 23)

Wszystkie 5 podstron strony-www (`one-page`, `strona-firmowa`, `strona-szyta-na-miare`, `sklep-internetowy`, `system-crm`) używają identycznego wzorca dla sekcji "Zakres prac":

```tsx
<section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
  <div className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center px-6 py-12 md:py-16">

    {/* HEADING — kompaktowy nad kartami, centered */}
    <div className="text-center max-w-2xl mb-6 md:mb-10 shrink-0">
      <div className="inline-flex items-center gap-2 ... mb-4">[Badge z ikoną/kropką brand color]</div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl ...">[Headline z brand gradient]</h2>
      <p className="text-slate-400 text-sm md:text-base ...">[Krótki opis]</p>
    </div>

    {/* CARDS MASK REGION — 2 karty widoczne naraz, centered horizontally */}
    <div className="relative w-full max-w-2xl flex-1 overflow-hidden
                    mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
      <motion.div style={{ y: scopeCardsY, willChange: 'transform' }}
                  className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]">
        {scopeItems.map((item, i) => (
          <motion.div className="group relative overflow-hidden p-7 md:p-10 rounded-3xl
                                 border border-white/15 bg-[#080808] ...">
            {/* Static brand glow radial gradient — daje glassmorphismowi co blurować */}
            <div style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 100%,
                            rgba(BRAND,0.18), rgba(BRAND,0.05) 40%, transparent 70%)' }} />
            {/* Big watermark number (bottom-0 right-0) */}
            {/* Content z-10 */}
            {/* Lightweight glass rim — box-shadow inset (zero GPU cost) */}
            <div style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15),
                                     inset 0 -1px 0 rgba(0,0,0,0.25)' }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</section>
```

**Kluczowe parametry**:
- `useSpring(scopeProgress, { stiffness: 55, damping: 32 })` — wolny pływ
- `useTransform(smoothScope, [0, 1], ['0vh', '-55%'])` — pierwsza karta widoczna od początku
- `h-[400vh]` — 33% więcej scrolla vs poprzednie 300vh
- Mask `8%-92%` (84% visible vs 60%) — 2 karty widoczne naraz
- Card: `rounded-3xl` + `border-white/15` + static brand glow + box-shadow inset rim (BEZ GlassEdge — backdrop-filter na 6 cards w sticky pin = scroll lag)
- Brand color per podstrona: blue (one-page), emerald (strona-firmowa), rose (strona-szyta-na-miare), amber (sklep-internetowy), sky (system-crm)
- **Animacja wejścia kart (Sesja 27)**: karty pojawiają się przez `whileInView` z `viewport={{ once: true, amount: 0.4 }}` (stagger per karta sterowany scrollem) + `initial={{ opacity: 0, scale: 0.96 }}` — **BEZ `y` translate** (żeby nie walczył ze spring-translatem rodzica `scopeCardsY`) + ease-out-expo `[0.16, 1, 0.3, 1]` 0.7s. Wcześniej był `y` + `viewport margin: '-10%'` = wejście "clanky" (szarpane).

## Wireframe→Blueprint reveal pattern (3 makiety — strona-firmowa, one-page, szyta-na-miare)

Trzy podstrony usług używają tego samego wzorca makiety przeglądarki ze scroll-driven reveal'em wireframe → kolorowy blueprint:

- `app/uslugi/strony-www/one-page/OnePageClient.tsx` (lane A/B/C narracja)
- `app/uslugi/strony-www/strona-firmowa/CorporateWebsiteClient.tsx` (4 fazy)
- `app/uslugi/strony-www/strona-szyta-na-miare/DedicatedWebsiteClient.tsx` (4 fazy z reveal na każdej — Sesja 25)

**Kluczowa zasada 1:1 alignment (zweryfikowana przez wiele iteracji w Sesji 25):**

Wireframe i blueprint **MUSZĄ mieć identyczną strukturę JSX** w obu warstwach. Różnica tylko w klasach color span'a w treści, NIE w wymiarach/typie elementów. Span jest `inline-block` z treścią tekstową która determinuje wymiary:

```jsx
// Wireframe (gray placeholder — text-transparent + bg-white/X)
<h1 className="text-3xl md:text-5xl font-black tracking-tight">
  <span className="inline-block text-transparent bg-white/10 rounded-2xl">Twoja marka.</span>
</h1>

// Blueprint (kolor) — IDENTYCZNY outer, różnica TYLKO w span'ie
<h1 className="text-3xl md:text-5xl font-black tracking-tight">
  <span className="inline-block text-white">Twoja marka.</span>
</h1>
```

**Anti-pattern (NIE rób):** próby z `<div w-1/2 h-4 bg-white/10 rounded>` w wireframe i `<p className="text-white text-sm">` w blueprint dają RÓŻNE wymiary (line-height vs explicit h-4) → reveal nie pasuje. Zawsze identyczne tagi/klasy, różnice ograniczone do **span color**.

**Reveal mechanics (per faza):**
- `<Phase>RevealStart/End` motion values z `useTransform(mainProgress, ...)` (raw, nie smoothed — Lenis już smoothuje)
- `useMotionTemplate` na `mask-image` z 7-stopowym linear-gradient (transparent → black → transparent) sliding diagonal `to top left`
- Wireframe layer: `opacity = 1 - reveal` (znika gdy blueprint pokrywa)
- Blueprint layer: `WebkitMaskImage` + `maskImage` z dynamic gradient
- Beam scanline overlay: cienka biała linia `mix-blend-screen + blur-[1.5px]` follow'ująca front maski
- Oba layery `position: absolute inset-0` w tym samym wrapperze

**Smoothness rules:**
- Spring: `stiffness: 140, damping: 38, restDelta: 0.0005` (tight, mało overshoot)
- **Scroll-precise transformy** (URL bar opacities, page Y, form widths, cursor X/Y, dashboard, charts) → **raw `mainProgress`**, NIE `smoothMain`. Lenis już smoothuje scroll wheel; double smoothing przez spring = snap przy końcu wheel-tick (element "ucieka" za kursorem).
- Decorative fadeins (np. content opacity gdy reveal się kończy) → smoothMain OK

**Cursor unification (Sesja 25):**
- Jeden `<motion.div>` z `%` positioning cross-device (zamiast 2 osobnych dla mobile/desktop z `calc()`)
- Wygląd 1:1 między 3 makietami: `<MousePointer2 className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" fill="white" strokeWidth={1.5} />`

**Wymiary parity (3 makiety):**
- `max-w-[88rem]` (nie `max-w-6xl`)
- `h-[78vh] md:h-[88vh]`
- Parent padding `px-3 md:px-6`

**Szczególne dla szyta-na-miare (Sesja 25):**
- Panel Admina NIE w nav makiety (tylko Home + Oferta + Zaloguj) — narracja: admin URL `/admin` jako "secret", wpisywany ręcznie
- 4 fazy z reveal (Home + Oferta + Login + Dashboard), wszystkie wordpress text-span pattern
- Dashboard BEZ `translateY` — wcześniej `-15%` powodowało że content znikał pod fixed navbarem
- Brand color: rose (`#f43f5e`) — applied do wszystkich blueprint accent'ów: buttons, links, charts, loader, glow

## WebGL dev-mode resilience pattern (Sesja 25)

Każdy długo-żyjący shader na stronie usług (Rays + 4× bento ShaderCanvas) musi handlować React 19 Strict Mode + Chrome ~16 WebGL context limit. Bez tego po 3-5 nawigacji: white flash + `console.error("Rays compile: null")` + brak shadera.

**Pattern (4 mechanizmy):**

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
const [canvasKey, setCanvasKey] = useState(0);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  // 1. Recovery: stale lost context (Strict Mode double-mount)
  if (gl.isContextLost()) {
    setCanvasKey(k => k + 1); // forces new <canvas> DOM element
    return;
  }

  // ... shader setup, compile, link, buffers, rAF loop ...

  // 3. Runtime context loss handlers
  const onLost = (e: Event) => { e.preventDefault(); /* stop rAF */ };
  const onRestored = () => { /* re-init program + buffers */ };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return () => {
    // ... cancelAnimationFrame, deleteProgram/Shader/Buffer, observers disconnect ...
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    // 2. Explicit context release (Chrome ~16 limit prevention)
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}, [canvasKey]);

return <canvas key={canvasKey} ref={canvasRef} ... />;
```

**4. `console.error` → `console.warn`** dla handled-state cases (np. `compileShader` returns null po zhandlowanym lost context). Next.js 16 dev overlay zamienia każdy `console.error` na fullscreen popup; warning nie przerywa DX.

## Deploy flow

```
1. npm run build                              (~30s)
2. Upload `out/` na Hostinger (FTP / panel)   (~1-3 min)
   ⚠️ Włącz "Pokaż ukryte pliki" — .htaccess musi się wgrać
3. Cloudflare → Caching → Purge Everything    (~30s propagacja)
4. (Opcjonalnie) PageSpeed Insights → wklej URL → Wait Lighthouse
```

## Znane ograniczenia / pułapki

### Architektura
- **Static export** — brak API routes, brak SSR. Chatbot strzela bezpośrednio do n8n po stronie klienta (martwy `app/api/chat/route.ts` został usunięty 2026-05-22).
- **Obrazy** muszą być w `public/` lub na hostach zdefiniowanych w `next.config.ts` (`images.unoptimized: true` + `remotePatterns` dla `images.unsplash.com`).
- **Lenis + GSAP ScrollTrigger** wymagają synchronizacji — `SmoothScrolling.tsx` jest providerem; nie modyfikuj scroll behavior globalnie.
- **Reset scrolla przy zmianie pathname** wymaga `setTimeout(300)` w `AnchorManager` żeby nie kolidować z `?target=`.
- **Tailwind v4** — `tailwind.config.ts` to legacy v3 config; większość pól ignorowana. Realna konfiguracja w `app/globals.css` (`@theme inline`).
- **`dynamic` z `ssr: false` w server component** zablokowane w Next 15+. Używaj client wrapperów (`DeferredClientWidgets`).
- **Next.js 16 RSC payload bug (KRYTYCZNE — Sesja 20)**: dla nested routes generowane są pliki RSC payload z **slashami** w nazwie (`__next.uslugi/strony-www/one-page.txt`) — Apache interpretuje to jako foldery. Browser jednak fetchuje URL z **kropkami** (flat name) → 404 → client-side router silent fail → wszystkie `<Link>` na produkcji nie działają na lewy klik (middle click bypassa router więc działa). **Fix**: `scripts/flatten-rsc.mjs` jako post-build script kopiuje nested pliki na flat names. Zintegrowane z `npm run build`. **BEZ TEGO ŻADEN LINK NIE ZADZIAŁA NA PRODUKCJI.**
- **Safari mobile quirks (Sesja 21)**: 6 osobnych pułapek znalezionych w pełnym audicie projektu:
  - `100vh` zawiera URL bar Safari → sticky `h-screen` overflow'uje. Fix: `h-dvh` w 7 plikach (Portfolio + 6 podstron usług). NIE zmieniaj `h-[300vh]` (scroll distance pinów) — dvh dynamic powoduje pin jumps.
  - `overflow-x-auto + w-max + mx-auto` blokuje touch scroll w lewo na Safari mobile. Fix pattern: `flex justify-center + min-w-max + px-6 wrapper`. Zastosowane w Realizacje + ServicesHub filter.
  - `overflow-x-clip` wymaga Safari 16+ (browserslist Safari 15+ → ignoruje, fallback to visible). Fix: `overflow-x-hidden` w 5 plikach client komponentów usług.
  - `flex-1` na dziecku `flex-col` nie daje pełnej szerokości (grow na main axis, nie cross). Fix dla responsive cards: `w-full md:flex-1` (Impact Stabilność karta).
  - Inline `backdropFilter` bez `WebkitBackdropFilter` → iOS WebView / Safari 14- ignoruje. Fix: para zawsze. Tailwind utility `backdrop-blur-*` auto-prefix'uje (te są OK).
  - Brak `viewportFit: 'cover'` → czarne marginesy notch. `<main min-h-screen>` → footer chowa się pod URL barem. Fix: `viewportFit: 'cover'` w viewport config + `min-h-dvh` na `<main>`.

### Bugi w danych (do naprawy w przyszłości)
- `app/data/services.ts` design card: `href: '/uslugi/design/design-stron-internetowych'` → **nie istnieje**. Sitemap omija (hardcoded `SERVICE_PAGES`), ale Services.tsx (taby Home) prowadzi w 404.
- `app/data/services.ts` marketing card: `href: '/uslugi/marketing/audyt-seo-wydajnosci'` → **niezgodny slug**, folder to `audyt-wydajnosci-seo`.
- `app/uslugi/marketing/page.tsx` i `app/uslugi/marketing/audyt-wydajnosci-seo/page.tsx` zwracają `return null` → pusta strona.
- `app/data/posts.ts` post #2 blockquote linkuje `/audyt` → strona nie istnieje (powinno być `/kontakt`).

### Chatbot
- Wszystkie callsy client-side przez `NEXT_PUBLIC_*` zmienne — baked-in at build time → zmiana endpointu lub secretu wymaga rebuildu i ponownego uploadu `out/` na Hostinger.
- `sendMessage` przyjmuje opcjonalny `overrideText?: string` — używany przez quick reply buttons; onClick na przycisku send to `() => sendMessage()`, NIE `sendMessage` (inaczej `MouseEvent` przekazany jako string).
- Wymaga w Supabase tabeli `chat_messages` z RLS policy `anon INSERT` oraz `chatbot_config` z `anon SELECT`.

### Deploy
- **`.htaccess` często ukryty w FTP** — włącz "Pokaż ukryte pliki" przed uploadem.
- **Cloudflare cache** serwuje stare wersje po deploy — zrób Purge Everything (lub Development Mode na 30 min do testów).

### Inne
- Footer ma `href: '#uslugi'` — sekcja `Services` ma jednocześnie `id="oferta"` (wrapper z page.tsx) i `id="uslugi"` (sama `<section>`). Dwa id na ten sam obszar — kompatybilność wsteczna, ale do uporządkowania.
- `OnePageClient.tsx` Counter animuje 0 → 3 obok napisu "3–5 dni" — wizualnie sugeruje że licznik dochodzi do 5; lepiej zmienić target lub usunąć counter.
- Wszystkie 3 posty bloga datowane styczeń 2026 — wygląda jak content seed; warto rozłożyć daty lub dodać świeżą treść.
