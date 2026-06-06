# Avenly Web

Strona internetowa agencji **Avenly** — pełni rolę wizytówki, portfolio i głównego narzędzia sprzedaży (cel: rezerwacja konsultacji). Zbudowana jako statyczny export Next.js, hostowana na Hostingerze za Cloudflare.

## Stan strony (2026-06-01)

| Co | Status |
|---|---|
| **PageSpeed mobile** | 85 / 100 (po Sesji 22 shadery na mobile — oczekiwany spadek 5-10pt do weryfikacji) |
| **PageSpeed desktop** | 99 / 100 |
| **Accessibility (a11y)** | wszystkie raportowane issues naprawione |
| **SEO** | pełen zestaw: 8 typów JSON-LD schema, OG image, favicon set, manifest, robots 2026-ready |
| **Google AI Overviews** | strona aktywnie cytowana z linkiem |
| **Wizytówka Google** | wpięta jako `sameAs` w Organization schema |
| **WebGL shaders** | **13 lokalizacji** (Sesja 26: chatboty-ai — Plasma tło hero + bento Dots ×4 per-seed) |
| **Production navigation** | ✅ Naprawione w Sesji 20 — `scripts/flatten-rsc.mjs` post-build script (workaround Next.js 16 RSC payload bug) |
| **Safari mobile compatibility** | ✅ Sesja 21+22 — full audit + 4 mobile UX bugi naprawione (Chatbot dvh, filter scroll, sticky piny, overflow-x-clip (cofnięte z hidden bo łamało sticky), -webkit prefixes, viewportFit cover, navbar lock, scroll-to-top fix) |
| **Service subpages shadery** | ✅ Sesja 22 — shadery aktywne na mobile na 6 podstronach (5× strony-www + UI/UX), DPR mobile 1.0 / desktop 1.5/1.25 |
| **Scope cards layout** | ✅ Sesja 23 — vertical stack (heading nad cards centered), 2 widoczne naraz, 5 podstron strony-www zsynchronizowane |
| **Hero performance** | ✅ Sesja 24 — Framer Motion intro (SSR-safe), `isolate` text, aurora deferred + motion fade-in 1.2s, SSR baseline gradient, notification stack state-driven z layout animation |
| **Portfolio depth** | ✅ Sesja 24 — 6 warstw głębi (aurora flow + grid dots + floor reflection + blobs + cards lift + LiquidGlass CTA) |
| **Bento corner fix** | ✅ Sesja 24 — shader wrapper `inset-px` w 7 plikach (eliminuje shader prześwitywanie na rounded corners) |
| **content-visibility usunięty** | ✅ Sesja 26 — `.render-optimize` to no-op (fix przeskakiwania scrolla po F5 + konflikt z pinami GSAP #465) |
| **chatboty-ai redesign** | ✅ Sesja 26 — „Living Ask" autoplay demo (zamiast scroll-locka) + bento Dots + theme **orange** + Plasma hero shader |
| **aplikacje-webowe makieta** | ✅ Sesja 26 — pełny reveal+scale+kursor (pulpit → klienci → zadania) |
| **Responsywność 2K/4K** | ✅ Sesja 26 — dedykowane breakpointy `3xl`=2560(2K)/`4xl`=3840(4K), **FullHD nietknięte**; szerszy `container` tylko od 2K; kontakt wypełnia wysokie ekrany |
| **Scrollbar** | ✅ Sesja 26 — dark + kciuk w main-color motywu podstrony (per-pathname przez `ScrollbarTheme.tsx`) |
| **Copywriting (głos klienta)** | ✅ Sesja 27 — pełny przegląd copy całej strony w głosie korzyści („Ty/zyskujesz/dostajesz"), wyjątek /o-nas (głos „my"); bez myślników em/en, jeden CTA „Bezpłatna konsultacja", zero fabrykowanych metryk, polski sentence case, „i" zamiast „&", realna ocena „★★★★★ 5,0 na Google" zamiast fake avatarów |
| **Cookie consent (RODO)** | ✅ Sesja 27 — baner zgody + granularne kategorie + zapis 12 mies. (localStorage + cookie `cookie_consent`) + reopen ze stopki + hook `hasConsent()` do bramkowania przyszłych GA/Meta |
| **Polityka prywatności** | ✅ Sesja 27 — przebudowana z 5 do pełnych 12 sekcji RODO („Polityka prywatności i cookies", dane z `lib/seo-data`, NIP/adres warunkowo) |
| **Navbar per-podstrona** | ✅ Sesja 27 — kropka przy AVENLY (Framer color tween) + hovery linków/mobile w kolorze motywu podstrony (`getNavbarTheme()` zwraca obiekt) |
| **Drugi telefon kontaktowy** | ✅ Sesja 27 — +48 531 104 402 (`phone2` w `lib/seo-data.ts`) |

> **Dokumenty kontekstowe:**
> - [CLAUDE.md](./CLAUDE.md) — zasady projektu, konwencje, pułapki (dla agentów AI i developerów)
> - [PRODUCT.md](./PRODUCT.md) — odbiorca, ton marki, anti-references, zasady designu
> - [project_context.md](./project_context.md) — pełna mapa funkcji, danych, plików
> - [progress.md](./progress.md) — log iteracji (chatbot, perf, SEO, a11y, blog automation)
> - [INSTRUKCJA-SEO.md](./INSTRUKCJA-SEO.md) — co trzeba podmienić w danych firmy po rejestracji działalności
> - [docs/blog-style-guide.md](./docs/blog-style-guide.md) — jak pisać posty w stylu Avenly
> - [docs/blog-ideas.md](./docs/blog-ideas.md) — backlog pomysłów na posty (auto-aktualizowany przez `/blog-research`)

## Stack

- Next.js 16.1.1 (App Router, `output: 'export'`, `trailingSlash: true`)
- React 19.2.3 + TypeScript 5
- Tailwind CSS v4 (PostCSS, CSS-first config w `app/globals.css`)
- Framer Motion 12, GSAP 3 + ScrollTrigger, Lenis 1.3 (smooth scrolling)
- React Hook Form + Web3Forms (formularz bez backendu)
- Chatbot: n8n webhook + Supabase REST (`chat_messages`, `chatbot_config`)
- Browserslist: nowoczesne przeglądarki (Chrome/Edge/FF 100+, Safari 15+, iOS 15+) — bez polyfilli ES6+

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → /out + post-build flatten-rsc.mjs (KRYTYCZNE — fix Next.js 16 RSC bug)
npm run lint
```

> ⚠️ **`npm run build` MUSI zawierać `node scripts/flatten-rsc.mjs`** — bez tego post-build kroku linki na produkcji nie działają (Next.js 16 generuje pliki RSC payload z slashami w nazwie które Apache interpretuje jako foldery, browser fetchuje flat name → 404 → router silent fail). Zob. [progress.md → Sesja 20](./progress.md) i [project_context.md → Znane ograniczenia](./project_context.md).

## Zmienne środowiskowe (`.env.local`)

```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Wszystkie wartości muszą zaczynać się od `NEXT_PUBLIC_*`, bo strona to static export — brak SSR, brak API routes w produkcji.

## Struktura kodu (skrót)

```
app/
  page.tsx                  # Home (10 sekcji, lazy-loaded poza Hero)
  layout.tsx                # SmoothScrolling + Navbar/Footer + DeferredClientWidgets
  data/                     # services, projects, posts (źródła treści)
  uslugi/                   # ServicesHub + 4 kategorie + podstrony usług
  realizacje/[slug]/        # case studies (generateStaticParams)
  blog/[slug]/              # posty (HTML string, NIE Portable Text)
  kontakt/, o-nas/, polityka-prywatnosci/
  sitemap.ts, robots.ts     # force-static
components/
  sections/                 # sekcje Home (Hero, Portfolio, Impact z WebGL shaders, ...)
  layout/                   # Navbar, Footer
  templates/ServiceTemplate # reusable szkielet podstrony usługi
  chatbot/Chatbot.tsx       # globalny widget (lazy-loaded)
  cookie/CookieConsent.tsx  # baner zgody RODO (lazy w DeferredClientWidgets)
  providers/SmoothScrolling # Lenis + GSAP integration
  utils/
    LifecycleManager        # pause Lenis w ukrytym tabie (lazy)
    DeferredClientWidgets   # wrapper lazy-load Chatbot + Lifecycle + CookieConsent
  seo/
    JsonLd.tsx              # reusable <script type="application/ld+json">
    ServicePageSchema.tsx   # Service + Breadcrumb dla podstron usług
lib/
  utils.ts                  # cn() helper
  seo-data.ts               # central source danych firmy (NIP, adres, social, phone2)
  schemas.ts                # buildery schema.org JSON-LD
  cookie-consent.ts         # logika zgody cookies (kategorie, zapis 12 mies., hasConsent())
public/
  .htaccess                 # Apache config: cache + kompresja + bezpieczeństwo
  og-default.png            # 1200×630 fallback OG image
  favicon-16/32, apple-touch-icon, icon-192/512, manifest.webmanifest
docs/
  blog-style-guide.md       # konwencja postów (1:1 z istniejącymi)
  blog-ideas.md             # backlog pomysłów (auto-aktualizowany)
scripts/
  flatten-rsc.mjs           # post-build fix Next.js 16 RSC payload bug (Sesja 20)
.claude/
  commands/
    new-post.md             # slash command /new-post — generuje post (+ research mode)
    blog-research.md        # slash command /blog-research — odświeża backlog
  settings.local.json
```

## Blog content automation

Dwa slash commands w Claude Code:

| Command | Co robi |
|---|---|
| `/new-post [temat]` | Pisze pełny blog post w stylu Avenly (400-600 słów, 2× h2 + 2-3× h3, lista, CTA) |
| `/new-post` (puste) | Multi-source research → 6 propozycji (HOT NOW/EVERGREEN/EMERGING/SEASONAL) → user wybiera → pisze |
| `/blog-research` | Odświeża `docs/blog-ideas.md` o 10-15 trending tematów (bez pisania) — raz w miesiącu |

Cel: 2-4 posty/miesiąc regularnie. Szczegóły workflow w [CLAUDE.md](./CLAUDE.md).

## Deploy na Hostinger

1. `npm run build` → `/out` zawiera kompletną stronę
   - `next build` generuje pliki statyczne
   - **`node scripts/flatten-rsc.mjs`** (Sesja 20 — KRYTYCZNE) — kopiuje nested RSC payloads (`__next.xxx/yyy.txt`) na flat names (`__next.xxx.yyy.txt`). Bez tego kroku linki na produkcji nie działają.
2. **Wgraj cały `out/` na Hostinger** (FTP / panel hostingowy)
   - **WAŻNE:** włącz "Pokaż ukryte pliki" w FTP — `.htaccess` zaczyna się od kropki i bywa ukryty
3. Po wgraniu: **Cloudflare → Caching → Purge Everything** (Cloudflare nadal serwuje stare wersje)
4. (Pierwsze deploy) Weryfikacja: F12 → Network → dowolny `.js` z `/_next/static/` → headers powinny pokazać `cache-control: public, max-age=31536000, immutable`

## Co warto wiedzieć

- **Zmiana treści** (`app/data/*.ts`) wymaga rebuildu i ponownego uploadu `out/`
- **Konfiguracja chatbota** (welcome message, quick replies) w Supabase tabeli `chatbot_config` — **NIE wymaga rebuildu**, zmiany od razu na live
- **Dane firmy** (NIP, adres, opinie Google, dwa numery telefonu — `phone` + `phone2` +48 531 104 402) — wszystko w jednym pliku [lib/seo-data.ts](lib/seo-data.ts), zmiana propaguje się do schema.org JSON-LD
