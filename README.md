# Avenly Web

Strona internetowa agencji **Avenly** (avenly.pl) — wizytówka, portfolio i główne narzędzie sprzedaży (cel: rezerwacja bezpłatnej konsultacji). Statyczny export Next.js, dwujęzyczny (PL na roocie, EN pod `/en/`), hostowany na **Cloudflare Pages**.

## Stan strony (2026-10-08)

| Co | Status |
|---|---|
| **Hosting** | ✅ Cloudflare Pages od 2026-09-19 (migracja z Hostingera) — `npm run deploy`, konfiguracja w `public/_headers` + `public/_redirects`; poczta `@avenly.pl` zostaje na Hostingerze |
| **Wersja EN** | ✅ Sesja 28 — `/en/` z przetłumaczonymi slugami, hreflang + canonical per język, sitemap z alternates (blog i polityka tylko PL) |
| **Hero** | ✅ Sesja 29 — scena 12a: planeta WebGL, logotyp AVENLY, niebo z konstelacją 6 usług (prawdziwe linki), CTA „Bezpłatna konsultacja” + „Zobacz realizacje”; **2026-10-09** nowy logotyp z wejściem „chirurgiczne cięcie” (cząstki usunięte) - lokalnie |
| **Logo** | 🆕 2026-10-09 — nowe logo: AVENLY przecięte linią zakończoną gwiazdą (`public/logo/`, `lib/brand/logo.ts`, `components/ui/AvenlyLogo.tsx`); nawigacja, czat, ikony, `og-default.png` - lokalnie, niewdrożone |
| **Pasek pod hero (TechStack)** | ✅ 2026-09-24 — ikony w granatowym szkle, 8 faktów z oferty (bez metryk bez pokrycia) |
| **Realizacje na stronie głównej** | ✅ Sesje 30-31 + 2026-09-24 — mgławica WebGL w barwach projektu, kadr ze zrzutem, automat co 5 s bez scroll-locka, jednorazowa odsłona sekcji („wow”), osobny układ na telefony |
| **Sekcja „Dlaczego Avenly”** | ✅ 2026-09-26 — wybór właściciela: **Stos warstw + Konstelacje**; karty w głębokiej czerni z zakładką (numer + kategoria), teren z warstwic na całej karcie (jasno przy wizualizacji, czysto pod tekstem), konstelacja z historią krok po kroku (napis kroku na dole karty), karty 2 i 4 w lustrze, stos z efektami przewijania na każdej szerokości (także telefon), kształty tła w kolorze karty na ekranie. ✅ 2026-09-27: tło sekcji = **Mapa warstwic**, tekst w karcie = **U góry** (reszta wariantów i przełączniki usunięte) |
| **Sekcja „Proces”** | ✅ 2026-09-27 — wybory właściciela: **Wstęga** w materiale **Szkło** + tło **Głębia** (szklane wstęgi w oddali z paralaksą) - przezroczysta szklana wstęga rozwija się przy przewijaniu i prowadzi zygzakiem przez 4 etapy (także na telefonie: wzdłuż tekstu na przemian po lewej i prawej, między krokami łuk przez cały ekran) do „Bezpłatnej konsultacji”; WebGL (zapas canvas 2D), barwa etapu z akcentów Impactu; sekcja zamknięta |
| **Sekcja „Opinie”** | ✅ 2026-09-27 — wybór właściciela: **Redakcja** (rozkładówka magazynu, 2 prawdziwe opinie z Google cytowane słowo w słowo, rysowane cudzysłowy, zakreślone wspólne słowo „polecam”); od 2026-09-28 bez oceny „5,0” i gwiazdek |
| **Sekcja „Oferta”** | ✅ 2026-09-27 / 28 — wybór właściciela: **Plan** (teczka rysunków technicznych, które rysują się i ożywają scenkami z kamerą); uczciwe copy usług (bez WordPressa / CMS, bez obietnic kurierskich) |
| **Sekcja „Blog” i podstrony bloga** | ✅ 2026-09-29 — sekcja na stronie głównej: **Panorama** (przewijanie = jazda kamery w bok wzdłuż dużych okładek 3 najnowszych wpisów, nagłówek w scenie, wszystko przy krawędziach wrappera); `/blog` = **„Wierna”** (wersja z czerwca 2026 w nowym języku strony: linie w tle, kategorie, sortowanie, wyszukiwarka), wpis = „Okładka + Nagłówek na liniach” |
| **Podstrony (etap 2 pracy równoległej)** | ✅ katalog usług `/uslugi` + `/uslugi/strony-www` (2026-10-01: karty z rysunkami Oferty, tło Mgławica), `/kontakt` (2026-09-29: tło Opływ), `/realizacje` + case studies (2026-10-01: Plansze, strony klientów przewijane w kadrach; **case study przebudowane 2026-10-08** - wersja „Klasyczna”: opis obok nazwy, przyklejony kadr „Strona na żywo”, punkt wyjścia i rozwiązanie w dwóch kolumnach); 🔎 `/o-nas` przebudowana od zera 2026-10-09 (sceny SVG na nowym logo) - czeka na pierwszą ocenę właściciela |
| **Podstrony usług (etap 3)** | ✅ one-page (2026-10-02: film w trzech scenach, wspólny szkielet `_usluga/`); ✅ strona firmowa (zamknięta wg właściciela 2026-10-08); 🔧 w pracy: Strona interaktywna, sklep internetowy, system CRM, chatboty AI - stan w [PRACA-ROWNOLEGLA.md](./PRACA-ROWNOLEGLA.md) |
| **Usługi** | 7 usług w 3 kategoriach; „Projekt UI/UX” usunięty jako osobna usługa (2026-10-01), „Strona szyta na miarę” → **„Strona interaktywna”** (2026-10-06, adres bez zmian) |
| **Stopka** | ✅ 2026-09-28 — wybór właściciela: **Kropka „Nad i”** (tytuł „Postaw kropkę nad i”, kropka marki spada na „i”, wyraźne nagłówki kolumn, akcent w kolorze podstrony) |
| **Kolor marki** | ✅ 2026-09-28 — jeden niebieski = kropka logo `#3b82f6` (`--brand`; od 2026-10-09 linia z gwiazdą nowego logo), bez pastelowych błękitów w nagłówkach i etykietach |
| **Wdrożenie** | ✅ 2026-10-14 — avenly.pl, deploy `b349e699` (Cloudflare Pages, z profilu wranglera Avenly; podgląd linku z hero i `favicon.ico`, wcześniej tego dnia `e22e7cd0`) - cały stan repozytorium: nowe logo i hero z cięciem gwiazdą, O nas (sekcje 1-7 wybrane), przejście przez gwiazdę z logo (Realizacje strony głównej, menu na telefonie, case study, Kontakt), strona główna bez wyniku PageSpeed, NIP JDG w danych firmy; podstrony w pracy w wariantach domyślnych |
| **Git** | ✅ 2026-10-14 — commit `903f887` (2026-10-14, polecenie właściciela „na GitHuba też zpushuj”) na `main`, wypchnięty na GitHuba; poprzedni: `4baae40` z 2026-10-08; wcześniej cała praca od czerwca w commicie `4baae40` na `main`, wypchniętym na GitHuba (`avenly-agency/avenly-test`, repozytorium publiczne); GitHub nie bierze udziału we wdrożeniach (dawny projekt testowy na Vercelu usunięty) |
| **Etykiety sekcji** | ✅ 2026-09-26 — wybór właściciela: **Gwiazda** (gwiazdki jak w hero + cienkie linie), wspólny `SectionLabel` we wszystkich sekcjach strony głównej |
| **Czat** | ✅ 2026-09-24/25 — granatowe okno i bąbel, bez `backdrop-filter` |
| **PageSpeed** | ostatni pomiar PSI (Sesja 22): mobile 85 / desktop 99; lokalny Lighthouse po nowym hero: desktop 95-97, CLS 0 — **do ponownego pomiaru w PSI** |
| **SEO** | 9 typów JSON-LD (w tym ItemList realizacji), OG image, favicon set, manifest, robots 2026-ready, hreflang; tytuły i opisy stron odświeżone 2026-10-08 (lokalnie, wejdą przy następnym wdrożeniu); grafika `og-default.png` do zrobienia od nowa |
| **Google AI Overviews** | strona cytowana z linkiem |
| **WebGL shaders** | strona główna (planeta hero, mgławica Realizacji, Impact ×4, Proces ×2), `/kontakt`, `/blog`, `/uslugi`, `/realizacje`, 6 podstron usług (mgławica szkieletu + głębia kart), `/o-nas` (od 2026-10-13 jedna mgławica na całą podstronę - `page-sky.tsx`) - tabela w CLAUDE.md; żadne tło podstron nie reaguje na kursor (2026-10-05) |
| **Cookie consent (RODO)** | ✅ Sesja 27 — baner z kategoriami, `hasConsent()` gotowe do bramkowania GA/Meta |
| **Copywriting** | ✅ Sesja 27+ — głos korzyści, jeden CTA „Bezpłatna konsultacja”, zero fabrykowanych metryk, bez em-dashy i rozstrzelonych wersalików (PRODUCT.md) |
| **Production navigation** | ✅ Sesja 20 — `scripts/flatten-rsc.mjs` (workaround bugu RSC w Next.js 16) |

> **Dokumenty kontekstowe:**
> - [CLAUDE.md](./CLAUDE.md) — zasady projektu, konwencje, decyzje właściciela, pułapki (dla agentów AI i developerów) — **źródło prawdy o szczegółach sekcji**
> - [PRODUCT.md](./PRODUCT.md) — odbiorca, ton marki, zasady copy i designu
> - [project_context.md](./project_context.md) — mapa funkcji, danych, plików
> - [progress.md](./progress.md) — log iteracji (sesje 1-31, wrzesień i październik 2026) i lista wdrożeń
> - [PRACA-ROWNOLEGLA.md](./PRACA-ROWNOLEGLA.md) — plan i stan pracy równoległej (etap 3: podstrony usług), zasady dla chatów; notatki chatów: `docs/podstrony/*.md` (podstrony) i `docs/sekcje/*.md` (sekcje strony głównej)
> - [INSTRUKCJA-SEO.md](./INSTRUKCJA-SEO.md) — co już działa w SEO i co podmienić w danych firmy po rejestracji działalności
> - [docs/blog-style-guide.md](./docs/blog-style-guide.md) — jak pisać posty w stylu Avenly
> - [docs/blog-ideas.md](./docs/blog-ideas.md) — backlog pomysłów na posty (auto-aktualizowany przez `/blog-research`)

## Stack

- Next.js 16.1.1 (App Router, `output: 'export'`, `trailingSlash: true`, Turbopack)
- React 19.2.3 + TypeScript 5
- Tailwind CSS v4 (PostCSS, CSS-first config w `app/globals.css`)
- Framer Motion 12, Lenis 1.3 (smooth scrolling), GSAP 3 + ScrollTrigger (dziś tylko integracja z Lenisem i nawigacja - sceny przewijane to `position: sticky` + własny postęp przewijania)
- WebGL (własne shadery inline, bez bibliotek 3D) — hero, Realizacje, Impact, Proces, tła podstron (mgławice, linie bloga, Opływ) i głębia kart podstron usług
- React Hook Form + Web3Forms (formularz bez backendu)
- Chatbot: n8n webhook + Supabase REST (`chat_messages`, `chatbot_config`)
- Browserslist: nowoczesne przeglądarki (Chrome/Edge/FF 100+, Safari 15+, iOS 15+) — bez polyfilli ES6+

## Uruchomienie

```bash
npm install
npm run dev             # http://localhost:3000 (w pracy równoległej: npm run dev -- -p 3001, bo :3000 zajmuje inny projekt)
npm run build           # static export → /out + flatten-rsc.mjs + copy-404.mjs (oba KRYTYCZNE)
npm run deploy          # build + wysyłka out/ na Cloudflare Pages (produkcja avenly.pl)
npm run deploy:preview  # build + adres testowy preview.avenly-web.pages.dev (noindex)
npm run lint
```

> ⚠️ **`npm run build` MUSI zawierać `node scripts/flatten-rsc.mjs`** — bez tego linki na produkcji nie działają (Next.js 16 generuje pliki RSC payload ze slashami w nazwie, przeglądarka pobiera wersję z kropkami → 404 → router po cichu nie nawiguje). `scripts/copy-404.mjs` podmienia globalną stronę 404 na naszą (dwa root layouty). Szczegóły: [CLAUDE.md → Pułapki](./CLAUDE.md).

## Zmienne środowiskowe (`.env.local`)

```
NEXT_PUBLIC_N8N_CHATBOT_URL=https://n8n.avenly.pl/webhook/chatbot
NEXT_PUBLIC_CHATBOT_SECRET=avenly-chatbot-2026
NEXT_PUBLIC_SUPABASE_URL=https://kyfsjvgixmcmafvaiyak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Wszystkie wartości muszą zaczynać się od `NEXT_PUBLIC_*`, bo strona to static export — brak SSR, brak API routes. Zmiana = rebuild + `npm run deploy`.

## Struktura kodu (skrót)

```
app/
  (pl)/                     # root layout PL + wszystkie strony PL (URL-e bez prefiksu)
    page.tsx                # Home → components/home/HomeClient.tsx (10 sekcji, lazy poza Hero)
    uslugi/                 # katalog (_katalog/), szkielet podstron usług (_usluga/), kategoria strony-www + 6 podstron usług
                            #   (one-page i strona-firmowa zamknięte; strona-szyta-na-miare = „Strona interaktywna”, sklep, CRM,
                            #   chatboty w pracy; stare *Client.tsx nieimportowane)
    realizacje/             # lista (RealizacjeClient + _rl/: nagłówek, Plansze, mgławica) i [slug]/ case studies (generateStaticParams)
    blog/, blog/[slug]/     # lista („Wierna”) i wpisy (HTML string, NIE Portable Text) - tylko PL; komponenty w components/blog/
    kontakt/                # formularz (Web3Forms) + Backdrop.tsx (tło „Opływ”, WebGL) + kontakt.css
    o-nas/ (przebudowa od zera 2026-10-09; sekcje 1-2 zamknięte 2026-10-13: wejście „Panorama z cięciem” + „Plakat” i „Dla kogo pracujemy” = „Portal”; dalsze sekcje w propozycjach; jedna mgławica na całą podstronę - page-sky), polityka-prywatnosci/, nie-znaleziono/ (404)
  (en)/                     # root layout EN + mirror stron pod /en/ (przetłumaczone slugi)
  data/                     # services, projects, posts (źródła treści)
  sitemap.ts, robots.ts     # force-static
components/
  home/HomeClient.tsx       # kolejność i leniwe ładowanie sekcji strony głównej
  sections/                 # sekcje Home: Hero, TechStack, Realizacje, Impact, Process, ...
    hero/                   # scena hero (planeta, logotyp z cięciem gwiazdą - logo.ts, niebo) - vanilla TS, osobny chunk
    realizacje/             # scena Realizacji (scene.ts) + mgławica (nebula.ts)
    impact/                 # „Dlaczego Avenly”: stack.tsx (stos kart), shader.tsx (warstwice + konstelacja),
                            #   viz.tsx (konstelacje i historie), backdrop.tsx (tło sekcji - Mapa warstwic)
    process/                # sekcja „Proces” - szklana Wstęga: ribbon.tsx (wstęga + kroki), backdrop.tsx (tło Głębia), silk.ts (szkło GLSL, skręt, akcenty), process.css (style sekcji)
    testimonials/           # sekcja „Opinie” - Redakcja: editorial.tsx (układ, rysowane cudzysłowy), shared.tsx, testimonials.css
    services/               # sekcja „Oferta” - Plan: plan.tsx (deska, scenki, kamera), nav.tsx, drawings.tsx (rysunki usług - używa ich też katalog /uslugi), shared.tsx, services.css
    blog-teaser/            # sekcja „Blog” - Panorama: pan.tsx (scena, pomiar --x0 / --w), cards.tsx (karty przy ograniczonym ruchu), data.ts, shared.tsx, blog-teaser.css
  blog/                     # /blog i wpisy: BlogIndex.tsx, cards.tsx, BlogBackdrop.tsx (linie, WebGL), data.ts, blog.css
  layout/                   # AppShell (html/body/JSON-LD/providery), Navbar, Footer + footer/ (dot.tsx, shared.tsx) i footer.css - stopka „Kropka nad i”
  templates/ServiceTemplate # martwy kod po starych podstronach usług (nowe podstrony: app/(pl)/uslugi/_usluga/)
  ui/SectionLabel.tsx       # etykieta sekcji strony głównej (gwiazdki + cienkie linie)
  chatbot/Chatbot.tsx       # globalny widget (lazy)
  cookie/CookieConsent.tsx  # baner zgody RODO (lazy w DeferredClientWidgets)
  providers/SmoothScrolling # Lenis + GSAP integration
  utils/                    # LifecycleManager, DeferredClientWidgets, ScrollbarTheme, proposals (przełączniki propozycji w dev)
  seo/                      # JsonLd.tsx, ServicePageSchema.tsx
lib/
  i18n/                     # słowniki PL/EN (locale.ts = mapa slugów, home/*, uslugi/*, ...)
  seo-data.ts               # dane firmy (NIP, adres, social, 2 telefony, Wizytówka Google)
  schemas.ts                # buildery schema.org JSON-LD
  cookie-consent.ts         # logika zgody cookies
  service-theme.ts          # kolory motywów podstron (scrollbar, czat, CTA)
  fonts.ts                  # Geist Mono (hero)
public/
  _headers, _redirects      # konfiguracja Cloudflare Pages (cache, bezpieczeństwo, 301)
  portfolio/stage/          # kadry Realizacji AVIF + WebP (generowane skryptem)
  realizacje/               # plastry całych stron klientów dla /realizacje (AVIF + WebP)
  hero-planet-*.webp        # render planety hero (element LCP)
  impact/contours.svg       # kafel warstwic (maska): tło „Mapa warstwic” w „Dlaczego Avenly”
  og-default.png, favicony, manifest.webmanifest (ikony i og-default z nowym logo - scripts/brand-icons.mjs)
  logo/                     # nowe logo (SVG / PNG, konstrukcja, kafel) - od 2026-10-09
assets/screenshots/         # mastery zrzutów realizacji 3840×2160 (poza public/, nie idą na produkcję)
scripts/
  flatten-rsc.mjs           # post-build fix bugu RSC w Next.js 16 (KRYTYCZNE)
  copy-404.mjs              # post-build podmiana globalnej strony 404
  realizacje-images.mjs     # generuje kadry Realizacji z masterów
  impact-contours.mjs       # generuje public/impact/contours.svg (bez szwu, maska - kolor daje CSS)
  crm-bloom.mjs             # generuje maskę „rozejścia” podstrony CRM (bloom.css, bloom-layers.ts)
docs/                       # blog-style-guide.md, blog-ideas.md, podstrony/ (notatki chatów pracy równoległej),
                            #   sekcje/ (notatki sekcji strony głównej), archiwum/ (usunięta usługa UI/UX, odrzucone
                            #   wersje sekcji CRM i case study realizacji), praca-rownolegla-etap-1.md / -etap-2.md
.claude/commands/           # /new-post, /blog-research
```

## Blog content automation

Dwa slash commands w Claude Code:

| Command | Co robi |
|---|---|
| `/new-post [temat]` | Pisze pełny blog post w stylu Avenly (400-600 słów, 2× h2 + 2-3× h3, lista, CTA) |
| `/new-post` (puste) | Multi-source research → 6 propozycji (HOT NOW/EVERGREEN/EMERGING/SEASONAL) → user wybiera → pisze |
| `/blog-research` | Odświeża `docs/blog-ideas.md` o 10-15 trending tematów (bez pisania) — raz w miesiącu |

Cel: 2-4 posty/miesiąc regularnie. Szczegóły workflow w [CLAUDE.md](./CLAUDE.md).

## Deploy (Cloudflare Pages)

1. Logowanie Avenly (kontakt@avenly.pl) leży w osobnym profilu wranglera `C:\Users\Start\.wrangler-avenly` (globalne logowanie należy do innego projektu). Wdrażaj z tą zmienną (Git Bash): `npm run build && XDG_CONFIG_HOME=C:/Users/Start/.wrangler-avenly npx wrangler@4 pages deploy out --project-name=avenly-web --branch=main --commit-dirty=true` (szczegóły: CLAUDE.md „Deploy flow”)
2. `npm run deploy` = `npm run build` + `npx wrangler@4 pages deploy out --project-name=avenly-web --branch=main` (wysyła tylko zmienione pliki) - działa tylko wtedy, gdy globalne logowanie wranglera jest na koncie Avenly
3. Purge cache **nie jest potrzebny** — HTML ma `max-age=0, must-revalidate`, chunki `_next/static` mają hash w nazwie. Wyjątek: podmiana obrazu w `public/portfolio/` pod tą samą nazwą (cache 30 dni) - zmień nazwę pliku albo zrób purge.
4. Test przed produkcją: `npm run deploy:preview`
5. Rollback: dashboard Cloudflare → Workers & Pages → avenly-web → Deployments → poprzedni deploy → „Rollback to this deployment”

## Co warto wiedzieć

- **Zmiana treści** (`app/data/*.ts`, słowniki `lib/i18n/`) wymaga rebuildu i `npm run deploy`
- **Konfiguracja chatbota** (welcome message, quick replies) w Supabase tabeli `chatbot_config` — **NIE wymaga rebuildu**, zmiany od razu na live
- **Dane firmy** (NIP, adres, dwa numery telefonu, opis firmy) — jeden plik [lib/seo-data.ts](lib/seo-data.ts), zmiana propaguje się do schema.org JSON-LD, stopki i polityki prywatności
- **Tytuły i opisy stron** — strona główna: `HOME_TITLE` / `HOME_DESCRIPTION` w `app/(pl)/layout.tsx` (EN: `app/(en)/layout.tsx`); podstrona usługi: obiekt `SERVICE` w jej `page.tsx`; zasady długości i pełnego bloku Open Graph w [CLAUDE.md → SEO patterns](./CLAUDE.md)
- **Nowa strona** = para PL + EN (checklist w [CLAUDE.md → i18n](./CLAUDE.md))
- **Propozycje projektu** (`components/utils/proposals.tsx`) - przełączniki wariantów widoczne tylko w `npm run dev` (panel na dole ekranu); produkcja dostaje wariant domyślny. Strona główna i zamknięte podstrony nie mają otwartych propozycji; otwarte są na podstronach w pracy (Strona interaktywna, sklep, chatboty - O nas od 2026-10-09 bez przełączników; na zamkniętej stronie firmowej został przełącznik wersji kart do sprzątnięcia) - lista w PRACA-ROWNOLEGLA.md
