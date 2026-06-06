# CLAUDE.md — Avenly Web

> Pełna mapa projektu, danych i znanych pułapek: [project_context.md](./project_context.md).
> Marka / ton / anti-references: [PRODUCT.md](./PRODUCT.md).
> Co trzeba podmienić w `seo-data.ts` po rejestracji działalności: [INSTRUKCJA-SEO.md](./INSTRUKCJA-SEO.md).
> Blog content automation: `/new-post [temat]` (slash command). Style guide: [docs/blog-style-guide.md](./docs/blog-style-guide.md). Backlog pomysłów: [docs/blog-ideas.md](./docs/blog-ideas.md).

## Stack

- **Next.js 16.1.1** (App Router, `output: 'export'`, `trailingSlash: true`, static generation, Turbopack)
- **React 19.2.3** + **TypeScript 5**
- **Tailwind CSS v4** (PostCSS, CSS-first config w `app/globals.css` — `tailwind.config.ts` to legacy v3, **w v4 ignorowany**)
- **Framer Motion 12** — animacje komponentów, scroll triggers
- **GSAP 3** + ScrollTrigger — zaawansowane animacje scroll-based
- **Lenis** — smooth scrolling (`SmoothScrolling.tsx` provider, zintegrowany z GSAP)
- **Web3Forms** — wysyłanie formularza kontaktowego (bez backendu)
- **React Hook Form** — walidacja formularzy
- **Lucide React** + **React Icons** — ikony
- **Supabase REST** (anon) + **n8n webhook** — chatbot (klient-side, bez SSR)
- **Browserslist:** nowoczesne przeglądarki (Chrome/Edge/FF 100+, Safari 15+, iOS 15+) — bez polyfilli ES6+

**Wcześniej zainstalowane, usunięte (2026-05-22):** `three`, `@react-three/*`, `postprocessing`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, `@portabletext/react`, `@types/three` — usunięte bo nigdzie nie używane.

## Komendy

```bash
npm run dev       # localhost:3000
npm run build     # static export → /out (folder do uploadu na Hostinger)
npm run lint      # ESLint
```

## Routing

Plik-based routing via App Router. Wszystkie strony statyczne (`output: 'export'`).

```
app/
  layout.tsx                        # globalny layout + JSON-LD Organization/LocalBusiness/WebSite
  page.tsx                          # Homepage (10 sekcji)
  uslugi/
    page.tsx + ServicesHub.tsx
    strony-www/
      page.tsx (kategoria)
      one-page/                     (page.tsx + OnePageClient.tsx + ServicePageSchema)
      strona-firmowa/               (page.tsx + CorporateWebsiteClient.tsx + ServicePageSchema)
      strona-szyta-na-miare/        (page.tsx + DedicatedWebsiteClient.tsx + ServicePageSchema)
      sklep-internetowy/            (page.tsx + ShopClient.tsx + ServicePageSchema)
      system-crm/                   (page.tsx + AppWebClient.tsx + ServicePageSchema)
    design/
      page.tsx (kategoria)
      ui-ux/                        (page.tsx + layout.tsx z ServicePageSchema)
    automatyzacje-ai/
      chatboty-ai/                  (page.tsx + ChatbotsAIClient.tsx + ServicePageSchema)
    marketing/                      ⚠️ page.tsx zwraca null
      audyt-wydajnosci-seo/         ⚠️ page.tsx zwraca null
  blog/
    page.tsx
    [slug]/page.tsx                 (+ BlogPosting + Breadcrumb JSON-LD)
  realizacje/
    page.tsx + layout.tsx
    [slug]/page.tsx                 (+ CreativeWork + Breadcrumb JSON-LD)
  kontakt/page.tsx + layout.tsx
  o-nas/
    page.tsx + layout.tsx           (+ FAQPage + Breadcrumb JSON-LD)
    faq-data.ts                     (source of truth dla FAQ — UI + schema)
  polityka-prywatnosci/
    page.tsx + layout.tsx           (pełna Polityka prywatności i cookies — 12 sekcji RODO; dane z seo-data, NIP/adres warunkowo; layout dla metadata bo page 'use client')
  sitemap.ts, robots.ts             # force-static
```

## Konwencje

### Komponenty
- Sekcje strony głównej: `components/sections/`
- Komponenty layoutu: `components/layout/` (Navbar, Footer)
- Providery globalne: `components/providers/` (SmoothScrolling)
- Utility globalne: `components/utils/` (LifecycleManager, **DeferredClientWidgets**)
- Szablony stron: `components/templates/ServiceTemplate.tsx` (reusable, z `children` na customowe sekcje)
- Komponenty bloga / projektów: `components/blog/`, `components/projects/`
- Chatbot: `components/chatbot/Chatbot.tsx` (**lazy-loaded** przez DeferredClientWidgets)
- **Cookie consent (RODO)**: `components/cookie/CookieConsent.tsx` (baner zgody, lazy przez DeferredClientWidgets) + logika `lib/cookie-consent.ts`
- Reusable UI: `components/ui/` (button.tsx)
- **SEO**: `components/seo/JsonLd.tsx` + `components/seo/ServicePageSchema.tsx`

### Dane / Treści
- Usługi: `app/data/services.ts` (kategorie + cards)
- Projekty portfolio: `app/data/projects.ts`
- Posty bloga: `app/data/posts.ts` (treść jako **raw HTML string**)
- FAQ na /o-nas: `app/o-nas/faq-data.ts` (source of truth — używane w UI i FAQPage schema)
- **Dane firmy (SEO)**: `lib/seo-data.ts` (NIP, adres, social, Wizytówka Google)
- **Schema builders**: `lib/schemas.ts` (Organization, LocalBusiness, Service, BlogPosting, FAQ, Breadcrumb itp.)
- **Cookie consent**: `lib/cookie-consent.ts` (kategorie, `readConsent`/`saveConsent`, `hasConsent()`, eventy) — teksty banera w `components/cookie/CookieConsent.tsx`
- Zdjęcia publiczne: `public/` (głównie `public/portfolio/*.webp`)
- Favicon set: `public/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `manifest.webmanifest`
- OG fallback: `public/og-default.png` (1200×630)

### Style
- Globalne zmienne CSS i animacje: `app/globals.css` (`@theme inline` + `.blog-content` + glassmorphism + keyframes — w tym `pureBlob1/2/3` przeniesione z Hero.tsx dla cacheability; + utility `.no-scrollbar` = ukryty pasek przewijania, użyty w cookie banerze)
- Schemat kolorów: ciemne tło `#050505` / `#080808` / `#0a0a0a`, akcent niebieski blue-400/500/600 (`#2f5beb`), white text, `slate-300/400/500` dla podrzędnych
- Responsive: mobile-first, breakpoint `lg` (1024px) — desktop, `md` (768px) — tablet. **2K/4K (Sesja 26):** DEDYKOWANE breakpointy `3xl` = **2560px (2K)** + `4xl` = **3840px (4K)** w `@theme`. **FullHD (1920px) zostaje normalnie** (domyślny `2xl`=1536px). Szerszy `container` tylko od 2K (`≥2560→1920px`, `≥3840→2400px`). **Bez skalowania fontu** (chroni `vh`-based piny GSAP i pixel-perfect reveal makiet); makiety przeglądarki celowo wyśrodkowane (`max-w-[88rem]`). Kontakt: `lg:min-h-screen flex items-center` wypełnia wysokie ekrany.
- **Scrollbar:** globalny (dark tor `#0a0a0a` + kciuk niebieski), kolor kciuka per-pathname przez `components/utils/ScrollbarTheme.tsx` (CSS var `--sb-thumb`/`--sb-thumb-hover` z `getServiceTheme().hex`) — na podstronach usług scrollbar w main-color motywu (sklep amber, chatboty orange itd.).
- **Navbar theming per-podstrona (Sesja 27):** `getNavbarTheme(pathname)` w `Navbar.tsx` zwraca obiekt `NavTheme` (rekord `NAV_THEMES`, klasy verbatim — wymóg Tailwind v4 JIT). Motyw obejmuje kropkę przy `AVENLY` (Framer `motion.span` `animate={{color: dotHex}}` + `initial={false}` = płynny tween koloru między podstronami zamiast skoku), hover underline+glow linków desktop, hover hamburgera, blob menu mobile, hover linków/kropkę mobile, hover social i CTA. Kolory: one-page blue, strona-firmowa emerald, strona-szyta-na-miare rose, sklep-internetowy amber, system-crm sky, chatboty-ai orange, reszta blue. Spójne z `lib/service-theme.ts` (scrollbar/CTA/chatbot).
- Helper: `lib/utils.ts` → `cn()` do łączenia klas Tailwind (`clsx` + `tailwind-merge`)

### Animacje
- Proste reveal-on-scroll: wrapper `<Reveal>` (`components/Reveal.tsx`) — **CSS-only od Sesji 20**: IntersectionObserver + `transform: translate3d` + `opacity` z CSS transition (compositor-only, zero main thread cost). Poprzednio używał Framer Motion `whileInView` ale powodowało scroll lag gdy wiele elementów wjeżdżało równocześnie w viewport.
- Złożone animacje scroll: GSAP + ScrollTrigger bezpośrednio w komponentach (np. `/o-nas` zoom hero, `OnePageClient` makieta przeglądarki)
- Animacje wejścia/wyjścia: Framer Motion `variants` + `AnimatePresence` — **ALE NIE wewnątrz / wokół Linków** (zob. Pułapki) — preferuj CSS transitions lub Reveal
- Animowane liczniki: `useMotionValue` + `useSpring` + `springValue.on("change")` → **mutacja DOM bez re-renderu** (patrz `Impact.tsx`, `OnePageClient.tsx`)
- Smooth scroll: NIE używaj `window.scrollTo` na desktop — używaj `lenis.scrollTo()` lub `?target=` query param
- Mobile accordion height anim: **CSS grid-rows technique** `grid-rows-[0fr] ↔ grid-rows-[1fr]` + transition (zamiast Framer Motion height auto) — pure CSS, działa z Linkami bez konfliktów (zob. `Services.tsx` mobile view)

### Performance patterns (wdrożone)
- **`will-change` + `translateZ(0)`** na scroll-bound elements (Portfolio FocusCard, Process progress bar, /o-nas GSAP zoom — wymuszają GPU layer)
- **`scaleY` zamiast `height` w animacjach** (Impact bar chart — eliminuje layout passes)
- **Lazy load below-the-fold:** sekcje Home przez `next/dynamic`, Footer/Chatbot/LifecycleManager przez `DeferredClientWidgets`
- ~~**`content-visibility: auto` + `contain-intrinsic-size`** (`.render-optimize`)~~ **USUNIĘTE (Sesja 26)** — `content-visibility: auto` na rodzeństwie pinów GSAP ScrollTrigger łamało pozycjonowanie (issue #465) + powodowało przeskakiwanie scrolla po F5 (intrinsic-size ≠ realna wysokość off-screen). `.render-optimize` to teraz **no-op** (NIE przywracać). Perf poniżej Hero zapewnia lazy-load (`next/dynamic`) + IO-pauza shaderów.
- **GPU layer hints** na sticky kontenerach z animacją (Portfolio horizontal scroll)
- **Inter font: `style: ['normal']`** — pomijamy italic (-66 KiB woff2)
- **Reveal CSS-only** (Sesja 20) — wyeliminowany scroll lag przy wielu reveal'ach jednocześnie
- **SmoothScrolling pathname reset** (Sesja 20) — `requestAnimationFrame` defer + brak `ScrollTrigger.refresh()` na nav (refresh racował z unmountującymi się pinami homepage)

### WebGL shaders (wdrożone w 13 lokalizacjach)
Inline shadery (w pliku swojej sekcji/podstrony, bez osobnego modułu — pasuje do skali projektu). Inspiracja patternów: [Paper Design Shaders](https://github.com/paper-design/shaders) — zero-dep library z 30+ presets (Mesh Gradient, Warp, Liquid Metal, Smoke Ring, Waves, Swirl, Voronoi, Neuro Noise, itd.). Aplikujemy patterny bezpośrednio w GLSL.

| Komponent | Plik | Pattern | Gate | Throttle | DPR clamp |
|---|---|---|---|---|---|
| `AuroraBackground` (Hero) | `Hero.tsx` | Aurora (3 noise layers) | **desktop only** + **requestIdleCallback defer** + IO pause z rAF defer + tab visibility pause + motion.canvas fade-in 1.2s delay 0.6s | **30fps** | **1.25** (precision highp, vignette `vig*0.45+0.55`) |
| `LiquidGlassBackground` (Portfolio CTA) | `Portfolio.tsx` | Liquid Glass (UV displacement + caustics + specular) | `!shouldReduceMotion` + IO pause | 60fps | 2.0 |
| `PortfolioFlowBackground` (Portfolio sticky bg) **Sesja 24** | `Portfolio.tsx` | Aurora flow (2-layer simplex, blue/indigo, slow drift `t*0.06`, opacity-40) | `isDesktop && !shouldReduceMotion` + IO pause z rAF defer | **30fps** | **1.0** (najlżejszy, precision mediump) |
| `ShaderCanvas` (Impact bento ×4) | `Impact.tsx` | Contour lines (Paper "Mesh Gradient" family) | `!shouldReduceMotion` + IO pause | 30fps | 1.25 |
| `AuroraBackground` (o-nas) | `app/o-nas/page.tsx` | Aurora (4 layers, navy/indigo/violet palette) | desktop only | 60fps | 2.0 |
| `HoverShader` (o-nas Stat Cards ×4) | `app/o-nas/page.tsx` | **Layered Fluid Waves** (3 stratified bands z falującymi krawędziami + foam crest + mouse bulge + halo) — SyncedShaderCanvas pattern z `u_offset`/`u_globalSize` + `u_mouse`/`u_hover` (Sesja 20) | desktop only + IO pause | 45fps | 1.25 |
| `RaysBackground` + bento `ShaderCanvas` ×4 | `app/uslugi/strony-www/one-page/OnePageClient.tsx` | God Rays + Radial Rings + Warp + Liquid Metal | **all devices** + IO pause (od Sesji 22) | rays 60fps, bento 30fps | **mobile 1.0** / desktop rays 1.5, bento 1.25 |
| `RaysBackground` + bento `ShaderCanvas` ×4 | `strona-firmowa/CorporateWebsiteClient.tsx` | Rays + bento (emerald "elegant calm" variant) | **all devices** + IO pause | 30fps | **mobile 1.0** / desktop 1.5/1.25 |
| `RaysBackground` + bento `ShaderCanvas` ×4 | `sklep-internetowy/ShopClient.tsx` | Rays + bento (amber "energetic commercial") | **all devices** + IO pause | 30fps | **mobile 1.0** / desktop 1.5/1.25 |
| `RaysBackground` + bento `ShaderCanvas` ×4 | `strona-szyta-na-miare/DedicatedWebsiteClient.tsx` | Rays + bento (rose "dramatic premium") | **all devices** + IO pause | 30fps | **mobile 1.0** / desktop 1.5/1.25 |
| `RaysBackground` + bento `ShaderCanvas` ×4 | `system-crm/AppWebClient.tsx` | Rays + bento (sky "technical precise") | **all devices** + IO pause | 30fps | **mobile 1.0** / desktop 1.5/1.25 |
| `MeshGradientBackground` (Hero) + `SyncedShaderCanvas` ×4 (bento) | `app/uslugi/design/ui-ux/page.tsx` | Iridescent Flow (5-octave domain warp + IQ palette + lime accent + dark navy peaks) hero; synced flow bento | **all devices** + IO pause | hero 60fps, bento 30fps | **mobile 1.0** / desktop hero 1.5, bento 1.25 |
| `HeroShader` (tło) + bento `ShaderCanvas` Dots ×4 **Sesja 26** | `automatyzacje-ai/chatboty-ai/ChatbotsAIClient.tsx` | **Plasma** (orange-only) tło hero z **fade-in opacity 1.4s** (zamiast snap visibility); bento **Dots** różnicowane per kafel przez `u_seed` (róg pulsu/prędkość/faza/kolor) — jednolita wielkość px-based `fract(gl_FragCoord.xy/18.0)` | **all devices** + IO pause | 30fps | **mobile 1.0** / desktop 1.5/1.25 |

**Wzorzec:** WebGL setup w `useEffect`, `ResizeObserver` na canvas dimensions, `IntersectionObserver` z `rootMargin: '100-200px'` do pauzowania rAF gdy poza viewport, pełen cleanup w return (`cancelAnimationFrame`, `disconnect()`, `gl.deleteProgram/Shader/Buffer`). Dla Hero dodatkowo `document.addEventListener('visibilitychange', ...)` aby pauzować przy nieaktywnej karcie.

**Krytyczne dla mobile:** Hero shader **MUSI** być desktop-only. WebGL `requestAnimationFrame` na mobile GPU saturuje pipeline → TBT 6800ms+ na PageSpeed mobile. Mobile fallback = 2 statyczne radial gradienty CSS (zero JS/GPU loop).

**Service subpage shadery na mobile (Sesja 22):** 5× strony-www Client + UI/UX mają shadery włączone na mobile z **DPR clamp 1.0** (vs desktop 1.5/1.25) — mobile GPU oszczędza ~2× mniej fragment invocations niż desktop. IO pause + 30fps throttle zostają. Trade-off: PageSpeed mobile spada o ~5-10 pt vs poprzedni desktop-only gate, ale visual parity między desktop a mobile została przywrócona (user request).

**Throttle pattern (Impact):** dla wolno-animowanych shaderów (kontury przy `t*0.04`) — manual frame interval check w `draw()`:
```ts
const FRAME_INTERVAL = 1000 / 30; // 30fps
let lastDrawTime = 0;
const draw = (now?: number) => {
  if (!runningRef.current) return;
  const ts = now ?? performance.now();
  if (ts - lastDrawTime >= FRAME_INTERVAL) {
    lastDrawTime = ts;
    /* render */
  }
  rafRef.current = requestAnimationFrame(draw); // rAF nadal 60Hz dla vsync, ale render co 2 klatki
};
```

**SyncedShaderCanvas pattern (UI/UX bento):**
- 4 osobne canvasy = 4 "okna" do **jednej wirtualnej kompozycji shadera** (cards wyglądają jak wycinki tego samego płótna)
- **Module-level `SHARED_T0 = performance.now()`** — wszystkie instancje używają tej samej linii czasu → animacje w lock-step
- Uniforms: `u_offset` (vec2 px) + `u_global_size` (vec2 px) — shader liczy `(gl_FragCoord + u_offset) / u_global_size` jako globalne UV
- Każdy canvas mierzy swoją pozycję względem `parentRef` (bento grid wrapper) — **cached** (update tylko na `ResizeObserver` callback + passive `scroll` listener), nie co frame → eliminuje 240 layout reads/s
- Gapy między kartami zostają **dark page bg** (shader niewidoczny tam) — efekt: tylko karty "świecą" wspólnym shaderem

**GlassEdge (iOS 26 Liquid Glass) — 3 tiery intensywności:**

| Tier | Blur | Saturate | Brightness | Contrast | Mask transparent | Lokalizacje |
|---|---|---|---|---|---|---|
| **Medium** (homepage Impact) | 16px | 170% | 110% | — | 15% | `components/sections/Impact.tsx` |
| **Strong** (service subpages) | 16px | 170% | 110% | — | 15% | one-page, strona-firmowa, sklep-internetowy, strona-szyta-na-miare, system-crm |
| **Dramatic** (UI/UX + /o-nas Stat Cards) | **32px** | **200%** | **120%** | **110%** | **28%** (szerszy soft ring) | `app/uslugi/design/ui-ux/page.tsx` (bento + hero mockup) + `app/o-nas/page.tsx` (4× stat cards z layered fluid shader pod spodem) |

- UI/UX dodatkowo: CSS `filter: blur(14px)` na canvas wrapper (`-inset-4`) — softens shader colors before they reach GlassEdge layer
- Highlight stack: `inset 0 1px 0 rgba(255,255,255,0.18-0.30)` (top edge) + `inset 0 -1px 0 rgba(0,0,0,0.20-0.35)` (bottom shadow) + opcjonalnie `inset 0 0 0 1px rgba(255,255,255,0.08)` (1px outline)
- Ring shape przez **4 linear gradient mask layers** + default composite `add` (NIE `mask-composite: exclude/xor` — tworzy widoczne hard edges)
- `z-5` (pod tekstem `z-10`+, nad shaderem `z-auto`) — blur działa na shader i dekoracje, NIE na tekst
- Karty bez own `z-10` wrappera wymagają dodania go (positioned `z-auto` shader/glass paint AFTER in-flow content w stacking order → glass zakryłby tekst)
- **Border kart: minimum `border-white/15`** (5% to za mało, shader przeświecał na rounded corners)

### SEO patterns (wdrożone — szczegóły w INSTRUKCJA-SEO.md)
- Globalne JSON-LD w `app/layout.tsx`: Organization + ProfessionalService (LocalBusiness) + WebSite
- Per-page JSON-LD wstrzykiwane przez `<JsonLd data={...}>` z builderami z `lib/schemas.ts`
- Server components nie mogą używać `dynamic` z `ssr: false` — używaj client wrapperów (przykład: `DeferredClientWidgets`)
- Reusable: `<ServicePageSchema>` (Service + Breadcrumb dla 7 podstron usług)
- `metadataBase` ustawiony, każda podstrona ma własne `metadata` z OG + Twitter Card + canonical
- Robots.txt 2026-ready: allow retrieval bots (Google-Extended, OAI-SearchBot, PerplexityBot, Claude-SearchBot, Applebot-Extended), block training bots (GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot)

### Cookie consent (RODO) — Sesja 27
- **Logika**: `lib/cookie-consent.ts` — 4 kategorie (`necessary`/`functional`/`analytics`/`marketing`), `readConsent()`/`saveConsent()` (localStorage `avenly-cookie-consent` + first-party cookie `cookie_consent`, wygaśnięcie 365 dni, wersjonowanie `CONSENT_VERSION` = bump żeby zapytać ponownie po zmianie polityki), `hasConsent(category)`, eventy `avenly:cookie-consent-change` + `avenly:open-cookie-settings`.
- **UI**: `components/cookie/CookieConsent.tsx` — baner (desktop bottom-left, mobile full-width bottom; nie koliduje z chatbotem bottom-right), compact + rozwijane granularne ustawienia (toggle per kategoria; `necessary` "Zawsze aktywne", reszta domyślnie **OFF** = RODO), równorzędne "Odrzuć/Akceptuj wszystkie" (równa waga = RODO) + "Dostosuj"/"Zapisz wybór", X-close tylko gdy zgoda już istnieje (pierwsza wizyta wymusza wybór). Bez widocznego paska (`.no-scrollbar`), responsywne `max-h` w dvh + `overscroll-contain`. Lazy przez `DeferredClientWidgets` (ssr:false).
- **Reopen**: link "Ustawienia cookies" w stopce (kolumna "Informacje prawne") dispatch'uje `avenly:open-cookie-settings`.
- **Bramkowanie skryptów**: gdy dodasz GA4/Meta, ładuj je warunkowo: `if (hasConsent('analytics')) { ... }` + nasłuchuj `window.addEventListener('avenly:cookie-consent-change', ...)`. Obecnie BRAK skryptów analytics → nic do bramkowania.

### Nawigacja cross-page
Żeby po przejściu na stronę główną przewinąć do sekcji, używaj query param:
```
href="/?target=sectionId"
```
`AnchorManager` w `SmoothScrolling.tsx` obsługuje ten parametr automatycznie (retry x15 jeśli element jeszcze nie istnieje + auto-korekcja x3 w `onComplete`).

### Cross-component events
Otwarcie chatbota z dowolnego miejsca:
```ts
window.dispatchEvent(new Event("avenly:open-chat"));
```
Używane w:
- `components/sections/AiConsultant.tsx` (homepage)
- `components/AvenlyAICta.tsx` (5 service subpages, ServicesHub, ChatbotsAIClient)
- `components/sections/Portfolio.tsx` (karta AI projektu na homepage)
- `app/realizacje/page.tsx` (karta projektu AI + CTA modal "Masz pytania?")
- `app/o-nas/page.tsx` (kafelek "Inne pytanie? Zapytaj Avenly AI" pod FAQ)

**Wzorzec modala chat-CTA** (`/o-nas` + `/realizacje`): outer blur halo (`bg-gradient-to-r from-blue-600 to-indigo-600 blur opacity-20`) + border gradient + inner card `bg-[#0a0a0a]/80 backdrop-blur-xl` z `Sparkles` ikoną (`animate-pulse-slow`) + button z `MessageSquare`. Style 1:1 między `/o-nas` i `/realizacje` dla spójności brandu.

## Ważne zasady

1. **Nie zmieniaj `output: 'export'`** — strona jest statyczna, bez API routes. Folder `app/api/` został usunięty (martwy kod przy static export).
2. **Dark mode tylko przez klasę `.dark`** na `<html>` — nie używaj `prefers-color-scheme`.
3. **Obrazy z `next/image`** — zawsze z `unoptimized: true` (wymagane przy static export, ustawione w `next.config.ts`). Zewnętrzne hosty muszą być w `remotePatterns` (obecnie tylko `images.unsplash.com`).
4. **Nie dodawaj nowych dużych bibliotek** bez potrzeby — projekt został wyczyszczony z nieużywanych deps (-953 paczek z node_modules).
5. **SEO**: każda strona ma własne `metadata` eksportowane z `page.tsx` (server component). `*Client.tsx` jest 'use client' — `metadata` musi być w `page.tsx` lub `layout.tsx` siostrzanym do client component.
6. **Treści po polsku** — cały content, etykiety, komunikaty. **Głos copy (Sesja 27)**: korzyść klienta ("Ty/zyskujesz/dostajesz"), wyjątek /o-nas (głos "my"); zero myślników em/en (pojedynczy "-"); jeden CTA "Bezpłatna konsultacja"; zero fabrykowanych metryk; sentence case (nie Title Case); "i" nie "&"; realna ocena "★★★★★ 5,0 na Google" zamiast fake avatarów. Pełne zasady: [PRODUCT.md](./PRODUCT.md).
7. **ServiceTemplate**: nowe podstrony usług MOGĄ używać template'a (`components/templates/ServiceTemplate.tsx`), ale większość istniejących ma własne, ambitne scroll-locki. Wybór zależy od skali animacji.
8. **Sitemap**: zaktualizuj `app/sitemap.ts` po dodaniu nowej kategorii/usługi/projektu — zawiera hardcoded listę `SERVICE_PAGES` (NIE iteruje już po `services.cards[].href` z powodu niezgodnych slug-ów).
9. **`.htaccess` MUSI być wgrany razem z `out/`** na Hostinger. Plik zaczyna się od kropki — włącz "Pokaż ukryte pliki" w FTP client.
10. **Cloudflare cache** — po każdym deploy zrób Purge Everything w dashboardzie (inaczej stara wersja wciąż serwowana z CDN).
11. **Schema.org JSON-LD** — używaj builderów z `lib/schemas.ts`. NIE pisz schema "od ręki" w komponencie — wszystko centralizowane.
12. **Dane firmy** — wszystko w `lib/seo-data.ts` (NIP, adres, dwa telefony `phone`/`phone2`, Wizytówka Google). Zmiana tam propaguje się do schema, OG, footer, **Polityki prywatności** (NIP/adres renderowane warunkowo) itp.

## Pułapki (sprawdzone, do uniknięcia)

- **`tailwind.config.ts`** to legacy v3 — Tailwind v4 ignoruje większość pól. Kolory `avenly.main/light` z config **nie działają** w klasach. Realny theming w `app/globals.css` (`@theme inline`).
- **`?target=` + reset scrolla**: `SmoothScrolling` resetuje scroll do (0,0) przy każdej zmianie `pathname`. `AnchorManager` celowo czeka `setTimeout(300)` zanim zacznie szukać kotwicy. Jeśli dodajesz własną logikę scroll przy nawigacji — uwzględnij ten reset.
- **Niespójności w danych** (pozostałe do naprawy):
  - `app/uslugi/marketing/page.tsx` + `audyt-wydajnosci-seo/page.tsx` zwracają `return null` (puste strony, ale Navbar/Footer się renderują).
  - `posts.ts` post #2 linkuje `/audyt` → 404. Powinno być `/kontakt`.
  - ~~`services.ts` design + marketing hrefs~~ — naprawione (2026-05-25): design = `/uslugi/design/ui-ux`, marketing = `/uslugi/marketing/audyt-wydajnosci-seo`.
- **Białe migotanie podczas Next.js route transition**: `<html>` bez explicit bg = browser default white. Podczas nav z homepage do `/uslugi/` (etc.) krótko widać biały bg między Hero unmount a nową stroną. **Fix:** `<html className="dark bg-[#050505]">` w `app/layout.tsx` (już ustawione 2026-05-25). Jeśli kiedyś usuniesz `bg-[#050505]` z html, white flash wraca.
- **Chatbot `sendMessage`**: przyjmuje opcjonalny `overrideText?: string`. Przycisk Send musi być `onClick={() => sendMessage()}`, NIE `onClick={sendMessage}` — inaczej `MouseEvent` ląduje jako `overrideText`.
- **Zapis do Supabase chat_messages musi być sekwencyjny** (user → then assistant), nie `Promise.all`, inaczej `created_at` w historii ma niewłaściwą kolejność.
- **Footer `#uslugi` vs Home `#oferta`**: sekcja Services w Home ma jednocześnie `id="oferta"` (wrapper `app/page.tsx`) i `id="uslugi"` (sama `<section>` w `Services.tsx`). Footer używa `#uslugi`, Navbar nie ma kotwicy do tej sekcji (linkuje do `/uslugi/`).
- **Lenis + tab-switch**: jeśli dodajesz nowe ScrollTriggery, sprawdź czy działają po powrocie z ukrytego tabu. `LifecycleManager` robi `lenis.resize()` + `start()`, ale `ScrollTrigger.refresh()` warto wywołać po cięższych zmianach układu.
- **`dynamic` z `ssr: false` w server component** — zablokowane w Next.js 15+. Musisz stworzyć client wrapper (przykład: `DeferredClientWidgets.tsx`). Bezpośrednio w `app/layout.tsx` (server) możesz użyć tylko `dynamic` BEZ `ssr: false`.
- **Heading hierarchy**: Lighthouse wymaga ścisłej kolejności h1 → h2 → h3 → h4. Hero notification titles to **mockup UI** — używaj `<p>`, nie `<h3>` (uniknięcie skoku h1 → h3). Imię autora opinii (Testimonials) to NIE heading — używaj `<cite>`.
- **A11y `aria-label` na ikon-only buttons**: Chatbot bubble, hamburger menu, social links — wszystkie muszą mieć `aria-label`. Dynamic content (np. otwórz/zamknij) → zmieniaj label per stan.
- **WebGL na mobile**: jakkolwiek by się nie chciało, **`AuroraBackground` w Hero MUSI** być desktop-only. Mobile WebGL rAF saturuje GPU → mobile TBT 6800ms. Pattern: `useLayoutEffect` + `matchMedia('(min-width: 1024px)')` + conditional render. Mobile fallback = statyczny CSS gradient. Inne shadery (Portfolio CTA, Impact bento) mogą zostać na mobile **TYLKO jeśli mają IntersectionObserver pauzę** + DPR clamp ≤ 1.25 + 30fps throttle.
- **`mask-composite: exclude/xor` dla ring shape**: tworzy widoczne hard edges (efekt "ramki w ramce"). Dla soft glass edge używaj **4 osobnych linear-gradient mask layers** (right/left/top/bottom) z domyślnym composite `add` — opaque na krawędziach, transparent w środku, smooth gradient.
- **`backdrop-filter` z `brightness()`**: drogi composite pass. Wytnij gdy nie ma efektu wizualnego. `blur()` jest **najdroższy** — każdy +1px radius znacząco zwiększa cost. Mobile: skip `backdrop-filter` całkowicie, gdy się da.
- **Perf tuning shaderów: NIE zmieniaj 3 rzeczy naraz.** Każda zmiana osobno + test PageSpeed (najlepiej **incognito** — extensions/devtools/cache zaburzają metryki). Jednoczesne dodanie shadera + gate + DPR/throttle change tankowało desktop 98 → 61.
- **WebGL cleanup**: zawsze pełen w `useEffect` return: `cancelAnimationFrame`, `ResizeObserver.disconnect()`, `IntersectionObserver.disconnect()`, `gl.deleteProgram/Shader/Buffer`. Inaczej context loss przy unmount.
- **Next.js 16 RSC payload bug (Sesja 20)**: `output: 'export'` generuje pliki RSC payload dla nested routes z **slashami** w nazwie (`__next.uslugi/strony-www/one-page.txt`) które Apache interpretuje jako foldery. Browser fetchuje URL z **kropkami** (`__next.uslugi.strony-www.one-page.txt`) → 404 → client-side router silent fail → **lewy klik nie nawiguje**, środkowy klik (browser default `<a>`) działa. **Fix**: `scripts/flatten-rsc.mjs` post-build kopiuje nested pliki na flat names (`npm run build` ma chain z tym scriptem). Bez tego — żaden `<Link>` w aplikacji nie zadziała na produkcji.
- **Framer Motion 12 + Next.js 16 production**: HISTORICAL pułapka — przed odkryciem RSC bug (Sesja 20), `motion.div` opakowujący `<Link>` był podejrzewany o blokowanie kliknięć. Po flatten-rsc fix Framer Motion znów działa OK, ale `Services.tsx`/`ServicesHub.tsx` zostały zrefaktorowane na CSS-only (Reveal CSS-only, plain div, CSS grid-rows mobile accordion) i to **zostaje** — eliminuje scroll lag + redukuje bundle size.
- **SmoothScrolling pathname reset (Sesja 20)**: NIE wołaj `ScrollTrigger.refresh()` w useEffect na zmianę pathname — racuje z unmountującymi się pinami GSAP (homepage ma 3 duże piny: Hero scale 50, Portfolio 300vh, Process timeline). Refresh na half-disposed pinach → glitche, race conditions, czasami silent navigation fail. Reset scroll odłóż do `requestAnimationFrame` (React kończy unmount → następny frame → Lenis scrollTo).

### Mobile UX bug fixes (Sesja 22)

4 zgłoszone bugi mobile naprawione + shadery włączone na 6 podstronach usług na mobile:

1. **Service subpages scroll-lock broken** — root cause: `overflow-x-hidden` na root container w 6 plikach (z Sesji 21 dla Safari 15 compat). Per CSS spec → tworzy scroll container → łamie sticky pinning → Framer Motion `useScroll` (window-based) nie widzi scrolla → zero animacji. **Fix**: cofnięte do `overflow-x-clip` we wszystkich 6 plikach (Safari 15 widzi fallback `visible` = drobny horizontal scroll dopuszczalny vs zero animacji).
2. **Mobile menu horizontal scroll** — `Navbar.tsx` ustawiał tylko `body.overflow=hidden`. **Fix**: dodane `html` overflow lock + `lenis.stop()/start()` + cleanup + `lenis` w deps.
3. **Random scroll-to-top na mobile** — `LifecycleManager` miał `window` `focus` listener który na mobile odpalał `lenis.resize()` mid-scroll (iOS app switcher, momentum scroll triggers). **Fix**: usunięty focus listener (tylko visibilitychange). Plus SmoothScrolling: dodany `prevPathnameRef` guard (pierwszy mount nie resetuje), `syncTouch: !isMobile` w Lenis options.
4. **ServicesHub + Realizacje filter UX** — `snap-x snap-mandatory`, edge fade gradient mobile-only, ikony schowane na <sm (`hidden sm:inline-block`), `px-3 sm:px-5`, inactive `text-slate-500 → text-slate-400` kontrast.

**Service subpages shadery na mobile (Sesja 22 — user request)**: 5× strony-www Client + UI/UX mają shadery włączone na mobile z **DPR clamp 1.0** (vs desktop 1.5/1.25). IO pause + 30fps throttle zachowane. Trade-off: PageSpeed mobile spadek ~5-10pt vs poprzedni desktop-only gate (akceptowalne dla visual parity).

### Scope cards layout pattern (5 strony-www subpages — Sesja 23)

Wszystkie 5 podstron strony-www używają identycznego wzorca dla sekcji "Zakres prac":
- **Layout**: vertical stack (heading nad cards centered, NIE 2-kolumnowy)
- **Sticky child**: `flex flex-col items-center justify-center px-6 py-12 md:py-16`
- **Heading**: `text-3xl md:text-4xl lg:text-5xl` + `max-w-2xl` centered + krótki opis
- **Cards container**: `max-w-2xl w-full flex-1 overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]` — 84% visible = 2 karty naraz
- **Section height**: `h-[400vh]` (vs poprzednie 300vh)
- **Spring**: `stiffness: 55, damping: 32` (wolny pływ)
- **Transform**: `['0vh', '-55%']` (pierwsza karta widoczna od początku, ostatnia nadal widoczna na końcu)
- **Card**: `p-7 md:p-10 rounded-3xl border-white/15 bg-[#080808]` + watermark big number bottom-0 right-0
- **Static brand glow** w prawym dolnym rogu: `radial-gradient(ellipse 80% 60% at 80% 100%, rgba(BRAND,0.18), rgba(BRAND,0.05) 40%, transparent 70%)` — daje glassmorphismowi co blurować, zero JS/GPU cost
- **Lightweight glass rim** (NIE `<GlassEdge />` — backdrop-filter na 6 cards w sticky pin z animowanym translateY = scroll lag): inline `boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)'` + `willChange: 'transform'` na motion.div containerze
- **Brand color per podstrona**: blue (one-page), emerald (corporate), rose (dedicated), amber (shop), sky (appweb)
- **Animacja wejścia kart (Sesja 27 — fix "clanky")**: per karta `whileInView` z `viewport={{ once: true, amount: 0.4 }}` (stagger sterowany scrollem, NIE jednoczesny pop na wejściu sekcji) + `initial={{ opacity: 0, scale: 0.96 }}` **BEZ `y` translate** (konkurował ze spring-translatem rodzica = szarpanie) + ease-out-expo `[0.16, 1, 0.3, 1]` 0.7s. Aplikowane na 5 podstronach strony-www.
- **CTA "Gotowy na cyfrową Dominację?"** (one-page + corporate): heading mobile fix `text-[2rem]` + `<br className="md:hidden">`, shader w tle (`MESH_GRADIENT_FS` / `WARP_FS`) z `opacity-60`, lekka vignette, GlassEdge, `rounded-3xl`, `bg-linear-to-r` canonical v4

### Bento corner fix (Sesja 24) — `inset-px` na shader wrappers

**Root cause**: Shader wrapper `<div absolute inset-0>` zaczynał się dokładnie na krawędzi karty = tym samym pixel co border. Przy `rounded-3xl` (24px radius) anti-aliasing rogu tworzy subpixel gradient od pełnego color border do transparent na zewnątrz. Animowane kolory shadera **prześwitują przez subpixel gaps w rogach**.

**Fix**: `absolute inset-0` → `absolute inset-px` na shader wrapper divs (offset 1px do wewnątrz = shader kończy się wewnątrz inner edge bordera, daje 1px ciemnego buffer w rogach). Aplikowane w 7 plikach (~22 wystąpień): Impact.tsx, Portfolio.tsx (LiquidGlass CTA), 5× service subpages. **Nie ruszone**: UI/UX bento (`-inset-4` + filter blur 14px), o-nas Stat Cards (HoverShader pattern).

### Hero performance pattern (Sesja 24 — multi-iteration overhaul)

Hero ma 6 osobnych mechanizmów żeby zapewnić płynny load + brak "pustego ekranu":

1. **SSR baseline gradient** (visible od pierwszej klatki paint, no JS):
   ```css
   background:
     radial-gradient(ellipse 60% 50% at 30% 35%, rgba(17,43,130,0.35), transparent 65%),
     radial-gradient(ellipse 50% 45% at 75% 65%, rgba(47,91,235,0.18), transparent 60%),
     radial-gradient(circle at 50% 100%, rgba(0,0,0,0.5), transparent 50%);
   ```
   Symuluje aurora rest state — visible przed hydration.

2. **AuroraBackground deferred mount**: `requestIdleCallback(setupShader, { timeout: 600 })` (fallback `setTimeout(200)`) — shader compile (100-300ms) wykonuje się PO React hydration, nie blokuje Framer Motion intro.

3. **AuroraBackground motion.canvas fade-in**: `opacity: 0 → 1` over 1.2s, `delay: 0.6s` — aurora subtelnie pojawia się PO text intro skończonym, nad SSR gradient baseline.

4. **`isolate` na text container** (`<div ... relative z-20 isolate>`) — tworzy nowy stacking context + GPU compositor layer. CSS animations text idą compositor-only, niezależnie od main thread (gdzie WebGL setup + React hydration blokuje).

5. **Tekst intro: Framer Motion** (NIE CSS animations które laggowały). Wszystkie 5 elementów z identycznym setup co modal: `initial: { opacity: 0, scale: 0.95 } → animate: { opacity: 1, scale: 1 } transition duration 0.6, delay X`. Framer automatically promote do compositor layer. Stagger 0.05/0.15/0.25/0.35/0.45s.

6. **Notification stack STATE-DRIVEN** (real phone behavior, Sesja 24):
   ```tsx
   const [visibleIds, setVisibleIds] = useState<number[]>([]);
   useEffect(() => {
     sorted.forEach(n => setTimeout(() => setVisibleIds(prev => [n.id, ...prev]), n.delay * 1000));
   }, []);
   ```
   `layout="position"` na motion.div = istniejące notifications **auto-shift w dół** gdy nowy element wjeżdża u góry. Slot z `overflow-hidden` ucina slide-from-top (`y: -80, scale: 0.92, opacity: 0`).
   **Min-h card**: `460px` → `540px` (stała wysokość od początku, nie rośnie gdy 3 notifications wpadają).

**Pułapka**: NIE używaj CSS animations (`tw-animate-css` `fade-in slide-in-from-bottom`) na text-heavy elements (text-8xl + bg-clip-text gradient) podczas React hydration — animations są visible ale laggują schodkowo bo paint na main thread. Framer Motion + `isolate` rozwiązuje to bo Framer eksplicit GPU-promotes.

### Portfolio depth pattern (Sesja 24)

Portfolio sticky child ma 5 warstw głębi (od najgłębszej do najbliższej):
1. **Dark base** `bg-[#050505]` (sticky child bg)
2. **PortfolioFlowBackground shader** — aurora flow opacity-40, najlżejszy shader w projekcie (mediump + 30fps + DPR 1.0)
3. **Grid dot pattern** — `radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px) 40px 40px` opacity-60 (CSS-only)
4. **Floor reflection** — `radial-gradient(ellipse at bottom, rgba(37,99,235,0.18), rgba(37,99,235,0.06) 40%, transparent 70%)` w `150vw × 55vh` (sugeruje "podłogę")
5. **Animated blobs** (blue + indigo, blur 120px, 12s + 15s loops)
6. **Cards z baseline shadow + lift hover**: `shadow-2xl shadow-black/60` baseline + `hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(37,99,235,0.45)]`

Plus mikro-stutter fix Hero → Portfolio: usunięty duplicate `contentVisibility: auto` w Portfolio (one source of truth w page.tsx z `containIntrinsicSize: '1px 2400px'` matching real height). Aurora IO callback wrapped w `requestAnimationFrame` (state change w idle moment, nie podczas scroll callback).

### Wireframe→Blueprint reveal pattern (Sesja 25 — strona-szyta-na-miare)

**Cel:** efekt jak w `strona-wordpress` (wireframe szare placeholdery → kolorowy reveal sliding diagonal mask BR→TL z beam scanline). Zastosowane do **wszystkich 4 faz** makiety szyta-na-miare (Home + Oferta + Login + Dashboard), nie tylko Home/Dashboard.

**KRYTYCZNY pattern dla 1:1 alignment** (kilka iteracji potrzebne — finalny insight):

Wireframe i blueprint **MUSZĄ mieć identyczną strukturę JSX**, różnicą jest tylko **kolor span'a w treści**, NIE wymiary placeholdera. Span jest `inline-block`, jego treść tekstowa **określa wymiary** — przez to oba warianty mają pixel-perfect identyczny layout.

```jsx
// Wireframe (gray placeholder, ten sam tekst — niewidoczny przez text-transparent)
<h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
  <span className="inline-block text-transparent bg-white/10 rounded-2xl">Twoja marka.</span>
</h1>

// Blueprint (colored, identyczny outer)
<h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
  <span className="inline-block text-white">Twoja marka.</span>
</h1>
```

**Anti-pattern (NIE rób tak):** próby z `<div className="w-1/2 h-4 bg-white/10 rounded">` w wireframe i `<p className="text-white text-sm">Tekst</p>` w blueprint — nawet z identycznym `mt-4` te elementy mają RÓŻNE wymiary (height liczone na innych zasadach: explicit h-4 vs line-height) i RÓŻNE pozycje pionowe → reveal nie pasuje. Zawsze identyczne tagi, identyczne klasy, różny tylko **span color**.

**Reveal mechanics:**
- `homeRevealStart/End`, `offerRevealStart/End`, `loginRevealStart/End`, `dashRevealStart/End` — osobne motion values per fazy z `useTransform(mainProgress, ...)`
- Mask: `useMotionTemplate` na `mask-image` linear-gradient z 7 stopami (transparent → black → transparent) sliding diagonal `to top left`
- Beam scanline overlay: cienka biała linia z `mix-blend-screen + blur-[1.5px]` follow'ująca front maski
- Wireframe layer: `opacity = 1 - reveal` (znika gdy blueprint się odsłania)
- Blueprint layer: `WebkitMaskImage = mask` + `maskImage = mask` (reveal odsłania kolor)
- Oba layer'y `position: absolute inset-0` w tym samym wrapperze, identyczna struktura wewnątrz

**Spring tightening (smoothness fix):**
- Initial: `stiffness: 80, damping: 25, restDelta: 0.001` → snap przy końcu wheel tick (Lenis już smoothuje, double-smoothing = artefakty)
- Final: `stiffness: 140, damping: 38, restDelta: 0.0005` mniej overshoot, mniej rubber-band
- **Scroll-precise transformy idą na raw `mainProgress`** (nie smoothMain): URL bar opacities, page Y/opacities, form widths, charts, dashboard, loader, cursor position. Spring tylko dla niektórych decorative (np. content fadeIn opacity). Lenis sam smoothuje raw scroll — spring na raw jest zbędne i powoduje "ucieczkę" elementu za kursorem przy końcu animacji.

**Panel Klienta → Panel Admina (Sesja 25):**
- Admin nie jest publiczny — usunięty z navbara makiety (został tylko Home + Oferta, klick'i kursora: 2 zamiast 3)
- URL `/portal` → `/admin` (secret URL pattern — wpisywany ręcznie, nie linkowany)
- Import `Lock` icon usunięty z `lucide-react` (nieużywany)
- Phase 4 LOGIN dalej jest, ale jako "dostęp przez ukryty URL" — flow narracyjny: makieta pokazuje że klient nie widzi panelu w nawigacji

**Dashboard `translateY` removed:**
- Wcześniej Phase 5 DASHBOARD miał `dashboardY = useTransform(... ['0%', '-15%'])` żeby przesunąć content do góry
- Bug: przy zoom-in content znikał pod navbarem (negative Y = pod fixed nav)
- Fix: usunięty całkowicie. Dashboard fade'uje się + animuje internal elementy (counters, charts) bez przesuwania container'a

**Cursor unification (Sesja 25):**
- Wcześniej: 2 cursory (desktop z `calc()` + mobile z osobnym `%`) → desync, complexity
- Final: **1 cursor** z `<motion.div>` + `useTransform` na `mainProgress` zwracającym `% pozycji` (X i Y) → jeden render path, identyczna logika cross-device
- Wygląd 1:1 z one-page/wordpress: `<MousePointer2 className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" fill="white" strokeWidth={1.5} />`

**Resize do parity z one-page/wordpress:**
- `max-w-6xl` → `max-w-[88rem]` (szerszy mockup)
- `h-[75vh] md:h-[85vh]` → `h-[78vh] md:h-[88vh]` (wyższy)
- `px-4 md:px-10` → `px-3 md:px-6` (mniej padding'u, content closer to edge)

### WebGL dev-mode resilience (Sesja 25)

**Problem:** Po kilku nawigacjach (~3-5) na podstronę z shaderem (`strona-szyta-na-miare`) pojawiał się white flash + console "Rays compile: null" + brak shadera. Worse w dev mode przez React 19 Strict Mode double-mount.

**Root causes:**
1. **Chrome WebGL context limit (~16)** — każde mount/unmount tworzyło nowy context, Chrome wyrzucał najstarszy gdy limit przekroczony → orphan canvases z lost contexts
2. **React 19 Strict Mode double-mount + `loseContext()` w cleanup** — Mount A: context created. Strict cleanup: `loseContext()` → canvas's context is lost. Mount B: re-uses SAME canvas (no key change) → `getContext('webgl')` zwraca lost context → `compileShader` zwraca null → "Rays compile: null"

**Fix (3 mechanizmy):**

1. **Canvas key bumping** (state-driven recovery):
   ```tsx
   const [canvasKey, setCanvasKey] = useState(0);
   // ...w setup:
   if (gl.isContextLost()) {
     setCanvasKey(k => k + 1); // forces new <canvas> DOM element
     return;
   }
   // ...w JSX:
   <canvas key={canvasKey} ref={canvasRef} ... />
   ```
   Zmiana `key` zmusza React do unmount/mount canvasa = nowy DOM element = nowy świeży context.

2. **Explicit context release w cleanup:**
   ```tsx
   return () => {
     // ...all the standard cleanup (rAF, observers, deleteProgram/Shader/Buffer)
     gl.getExtension('WEBGL_lose_context')?.loseContext();
   };
   ```
   Jawnie zwalnia GPU resources zamiast czekać na GC — pomaga nie wbić limit Chrome.

3. **Context loss event handlers** (recovery during runtime):
   ```tsx
   const onLost = (e: Event) => { e.preventDefault(); /* stop rAF */ };
   const onRestored = () => { /* re-init program + buffers */ };
   canvas.addEventListener('webglcontextlost', onLost);
   canvas.addEventListener('webglcontextrestored', onRestored);
   ```

4. **`console.error` → `console.warn`** w handled-state cases — Next.js 16 dev overlay zamienia każdy `console.error` na fullscreen error popup. Warningi (`Rays compile: null` przy znanym handled lost-context) nie powinny przerywać DX.

### Safari mobile quirks (Sesja 21 — sprawdzone)
- **`100vh` ≠ widoczny viewport na Safari mobile**: URL bar Safari wlicza się do `100vh`, ale visual viewport jest mniejszy. Skutek: `h-screen` w sticky pinach na mobile = content overflow'uje, fixed UI ucina się od góry (np. Chatbot header `h-140` + `bottom-24` nie mieścił się). **Fix**: `h-screen` → `h-dvh` (dynamic viewport height, respektuje URL bar). Dla modali/oken o stałej wysokości: `height: min(35rem, calc(100dvh - 7.5rem))`. **Uwaga**: `dvh` jest dynamic — nie używaj w scroll distance jak `h-[300vh]` (Portfolio pin) bo URL bar collapse/expand by powodował pin jump — tam zostaw `vh`.
- **`overflow-x-auto + w-max + mx-auto` blokuje horizontal scroll na Safari mobile**: gdy content szerszy niż viewport, `mx-auto` powoduje że Safari nie pozwala scrollować w lewo (negative margin centering nie kompatybilne z touch scroll). **Fix pattern**: `<nav overflow-x-auto overscroll-x-contain><div flex justify-center min-w-max px-6><content>` — `min-w-max` rezerwuje miejsce, `justify-center` centruje gdy się mieści, scroll działa gdy nie. Zastosowane w Realizacje filter + ServicesHub filter.
- **`overflow-x-hidden` ŁAMIE `position: sticky` na dzieciach (Sesja 22 — KRYTYCZNE)**: per [CSS Overflow spec](https://www.w3.org/TR/css-overflow-3/), ustawienie `overflow-x: hidden` z domyślnym `overflow-y: visible` computuje `overflow-y` do `auto` → element staje się scroll containerem → wszystkie `position: sticky` w dzieciach pinują się do tego kontenera zamiast viewportu → Framer Motion `useScroll` (window-based) nie widzi scrolla → animacje nie odpalają. **NIE używaj `overflow-x-hidden` na root container podstrony jeśli są w niej sticky piny.** Używaj **`overflow-x-clip`** (Safari 16+ — `clip` per modern spec NIE tworzy scroll containera, sticky działa). Safari 15 (~1-2% userów PL) zobaczy fallback `visible` = drobny horizontal scroll dopuszczalny vs zero animacji. Jeśli faktycznie coś wystaje horyzontalnie na Safari 15, clipnij TYLKO ten konkretny element lokalnie, nie cały rootcontainer. Historyczna pułapka: Sesja 21 zamieniła `overflow-x-clip` → `overflow-x-hidden` dla Safari 15 compat → złamało scroll-lock animacje na 6 service subpages — cofnięte w Sesji 22.
- **`flex-1` ≠ `w-full` w `flex-col` containerze**: w `flex flex-col items-center`, dziecko z `flex-1` zajmuje intrinsic width (nie 100%), bo flex grow działa na main axis (vertical). Cross axis (horizontal) wymaga `w-full`. **Fix pattern dla responsive cards (Impact "Stabilność")**: `className="w-full md:flex-1"` zamiast samo `flex-1` + zewn. `items-start md:items-center` (mobile content od lewej, desktop wycentrowany).
- **`backdropFilter` inline style ZAWSZE z `WebkitBackdropFilter` parą**: Tailwind utility `backdrop-blur-*` auto-prefix'uje, ale inline `style={{ backdropFilter: ... }}` nie. iOS WebView (apki firm trzecich z embed Safari) + Safari 14- ignoruje `backdrop-filter` bez `-webkit-` → blur nie renderuje. W Chatbot.tsx 3 miejsca brakowało prefiksu — dodane.
- **`viewportFit: 'cover'` w Next viewport config**: bez tego notch iPhone'a tworzy czarne marginesy po bokach (default `auto`). Z `cover` content wypełnia safe area. Plus `<main className="min-h-dvh">` (nie `min-h-screen`) zapewnia że footer nie chowa się pod URL barem iOS gdy content krótszy niż viewport.

## Zmienne środowiskowe (`.env.local`)

Wszystkie muszą być `NEXT_PUBLIC_*` (baked-in at build time przy static export):
```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Zmiana wymaga rebuildu + ponownego uploadu `out/`.

## Deploy flow

```
1. npm run build                              (~30s)
   - `next build` → static export do `out/`
   - automatycznie: `node scripts/flatten-rsc.mjs` (Sesja 20 — KRYTYCZNE)
     fixuje Next.js 16 bug: nested RSC payloads (__next.xxx/yyy/zzz.txt) → flat (__next.xxx.yyy.zzz.txt)
     bez tego kroku LINKI NIE DZIAŁAJĄ na produkcji (Apache serwuje 404 dla flat URL → client-side router silent fail)
2. Upload `out/` na Hostinger (FTP / panel)   (~1-3 min)
   ⚠️ Włącz "Pokaż ukryte pliki" — .htaccess musi się wgrać
3. Cloudflare → Caching → Purge Everything    (~30s propagacja)
4. (Opcjonalnie test) PageSpeed Insights z ?nocache=1
```

## Blog content workflow (automation)

### Dwa slash commands

| Command | Co robi | Kiedy używać |
|---|---|---|
| `/new-post [temat]` | Pisze pełny blog post w stylu Avenly | Gdy chcesz opublikować konkretny post |
| `/new-post` (puste) | **Research + pyta o wybór** z 6 propozycji (HOT NOW/EVERGREEN/EMERGING/SEASONAL), potem pisze | Gdy nie wiesz o czym pisać — chcesz świeże propozycje |
| `/blog-research` | **Tylko research** — odświeża backlog o 10-15 nowych trending tematów (NIE pisze posta) | Raz w miesiącu, po wydarzeniach branżowych, gdy backlog się kończy |

### Generowanie nowego posta — `/new-post`

Wywołuje `.claude/commands/new-post.md`:
1. **Jeśli brak argumentu:** robi multi-source research (4 WebSearch'e: HOT NOW newsy, EMERGING trendy, SEASONAL temat na teraz, EVERGREEN z backlog'a) → prezentuje 6 propozycji → user wybiera
2. **Jeśli argument podany:** od razu przechodzi do pisania
3. Czyta `docs/blog-style-guide.md` + `app/data/posts.ts` (referencja stylu)
4. Research dla wybranego tematu (konkurencja PL + statystyki)
5. Pokazuje outline do approval
6. Pisze content w **identycznym** stylu jak 3 istniejące posty (400-600 słów, 2× h2 + 2-3× h3, 1× lista, blockquote CTA do `/kontakt`)
7. Dodaje do `app/data/posts.ts` (Edit tool, TAB indentation, next available id)
8. Aktualizuje `docs/blog-ideas.md` (przesuwa wpis do OPUBLIKOWANE)
9. Pokazuje preview + instrukcję deploy

### Auto-research backlog'a — `/blog-research`

Wywołuje `.claude/commands/blog-research.md`:
1. Czyta istniejący `docs/blog-ideas.md` (żeby nie duplikować)
2. Multi-source research (5-7 WebSearch'e: HOT NOW + EMERGING + SEASONAL + konkurencja + long-tail)
3. Filtruje (wyrzuca ⭐⭐⭐⭐⭐ trudne + duplikaty + poza-niche)
4. Dodaje 10-15 nowych tematów do sekcji "🔥 Trending" w backlog'u (na górze sekcji, najnowszy research na górze)
5. Pokazuje breakdown + TOP 3 rekomendacje

### Style postów (1:1 z istniejącymi 3)
- **Długość:** 400-600 słów (5-6 min czytania) — NIE pillar 2000+
- **Struktura:** 2× `<h2>` + 2-3× `<h3>` + końcowe `<h2>Podsumowanie:</h2>` + `<blockquote>` CTA
- **Lista:** 1× `<ul>` lub `<ol>` z pattern `<li><strong>Etykieta:</strong> Wyjaśnienie</li>`
- **CTA:** zawsze `<blockquote>` z linkiem do `/kontakt` (NIGDY `/audyt` — bug post #2)
- **`<strong>`** w każdym akapicie (1-2× na akapit)
- **Brak FAQ, brak tabel, brak intro przed pierwszym h2** — nie wprowadzaj nowości

### Backlog pomysłów — `docs/blog-ideas.md`

Struktura:
1. **🔥 Trending (auto-found przez research)** — świeże tematy z dat research'u, najnowsze na górze
2. **TOP PRIORITY / COMPARISON / EVERGREEN / VERTICAL / DEVELOPER** — statyczny long-term backlog
3. **OPUBLIKOWANE** — historia z datami

### Workflow miesięczny (rekomendowany)

- **Raz w miesiącu** (1×): `/blog-research` — odświeża backlog o trending tematy
- **1-2× w tygodniu**: `/new-post [temat]` lub `/new-post` (z research mode)
- Review draft'u (5-10 min) → akceptacja
- `npm run build` → upload `out/` na Hostinger → Cloudflare Purge
- Cel: **2-4 posty miesięcznie** regularnie (consistency > velocity wg [Search Engine Land 2026](https://searchengineland.com/guide/content-strategy-in-2026))
