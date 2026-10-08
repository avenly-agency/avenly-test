# Instrukcja SEO — co już działa, co podmienić po rejestracji działalności

## TL;DR — aktualny stan (2026-10-07)

✅ **Wszystko techniczne jest zrobione i działa.** Strona jest cytowana przez Google AI Overviews z linkiem.

| Element | Status |
|---|---|
| Google Search Console | ✅ Zweryfikowane przez Cloudflare DNS |
| Robots.txt 2026-ready | ✅ Allow AI search bots, block training bots |
| Sitemap | ✅ Bez 404, zróżnicowane lastModified; od 2026-10-01 bez `/uslugi/design*` (usługa UI/UX usunięta, 301 w `public/_redirects`) |
| JSON-LD Schema (9 typów) | ✅ Organization, ProfessionalService, WebSite, Service ×6, BlogPosting ×3, CreativeWork, ItemList (realizacje na stronie głównej), FAQPage (Review usunięty 2026-09-30 - patrz „Ocena Google”) |
| Wersja EN + hreflang | ✅ `/en/` z przetłumaczonymi slugami, `pl-PL` / `en` / `x-default` + canonical per język, sitemap z alternates (blog i polityka tylko PL) |
| OG image (Twitter/FB/LinkedIn preview) | ✅ `/og-default.png` 1200×630 + per-page dla blog/realizacje |
| Favicon set + PWA manifest | ✅ Wszystkie rozmiary |
| Wizytówka Google | ✅ Wpięta jako `sameAs` w Organization schema |
| AI search visibility | ✅ Google AI Overviews aktywnie cytuje |
| Hosting + nagłówki (cache + bezpieczeństwo) | ✅ Cloudflare Pages (od 2026-09-19): `public/_headers` + `public/_redirects`, `noindex` na adresach `*.pages.dev` |
| Polityka prywatności i cookies (RODO) | ✅ Pełne 12 sekcji, dane administratora ciągnięte z `seo-data.ts` |
| System zgody na cookies (RODO) | ✅ Baner + `hasConsent()` helper (gotowy do bramkowania analytics) |

## Co musisz zrobić sam (jednorazowo, ~15 min)

Wszystko sprowadza się do **podmiany danych w jednym pliku**: `lib/seo-data.ts`. Po podmianie: `npm run deploy` (build + wysyłka na Cloudflare Pages).

### Ocena Google (od 2026-09-28 nie jest pokazywana)

Decyzja właściciela: „5,0 na Google” z gwiazdkami to słaby social proof (przy dwóch opiniach). Ocena zniknęła z hero, sekcji Opinie, podstron usług i stopki, a razem z nią `AggregateRating` z JSON-LD (Google wymaga, żeby oceny w danych strukturalnych były widoczne na stronie; oceny wystawione firmie na jej własnej stronie i tak nie dają gwiazdek w wynikach od 2019 r.). Pola `reviewsCount` / `ratingValue` w `GOOGLE_BUSINESS` (`lib/seo-data.ts`) zostały jako dane archiwalne i nic ich nie używa.

**2026-09-30: znacznik Review też usunięty.** Search Console zgłosił błąd krytyczny „Wiele weryfikacji bez obiektu aggregateRating” (4 elementy na `/` i `/en/`): dwie opinie (Review) przy Organization bez AggregateRating to według Google nieprawidłowy element. AggregateRating nie wraca (ocena nie jest widoczna na stronie), a opinie o firmie na jej własnej stronie i tak nie dają gwiazdek, więc sekcja Opinie nie ma już JSON-LD - opinie zostają na stronie jako zwykła treść. **Nie przywracać Review ani AggregateRating.** Po wdrożeniu: Search Console → Ulepszenia → Fragmenty opinii → „Sprawdź poprawkę”.

### Dane do podmiany PO REJESTRACJI działalności

Schema jest **defensywna** — pomija puste pola. Bez działalności wszystko działa w trybie "virtual business / agencja online".

Po rejestracji NIP/REGON/adresu, otwórz `lib/seo-data.ts` i podmień:

```ts
// ADDRESS
streetAddress: 'ul. Twoja 1',       // pełna nazwa ulicy z numerem
addressLocality: 'Warszawa',         // miasto
postalCode: '00-001',                // kod pocztowy

// COMPANY_IDS
nip: '1234567890',                   // 10 cyfr bez kresek
```

**Propaguje się też do Polityki Prywatności.** `app/(pl)/polityka-prywatnosci/page.tsx` renderuje NIP/REGON/adres **warunkowo** — dziś puste pola się nie pokazują, a po uzupełnieniu `ADDRESS` + `COMPANY_IDS` w `seo-data.ts` dane automatycznie pojawią się w sekcji "Administrator danych" polityki (oprócz schema, OG i footera). E-mail i oba telefony są już ciągnięte z `CONTACT`.

Po zmianie: `npm run deploy`. Purge cache nie jest potrzebny (HTML na Cloudflare Pages ma `max-age=0, must-revalidate`).

---

## Co jest już wpięte i działa

### 1. Robots.txt — strategia 2026

Plik: `app/robots.ts` (generuje `/robots.txt` przy build).

**Pozwala (AI search):**
- Google-Extended → strona pojawia się w Google AI Overviews
- OAI-SearchBot → ChatGPT Search cytuje
- PerplexityBot → Perplexity cytuje
- ChatGPT-User → ChatGPT używa jako source
- Claude-SearchBot → Claude search cytuje
- Applebot-Extended → Apple Intelligence

**Blokuje (AI training):**
- GPTBot, CCBot, anthropic-ai, ClaudeBot, Bytespider, FacebookBot

Logika: **chcemy żeby strona była w AI search results, ale NIE chcemy żeby nasza treść była używana do trenowania modeli bez zgody**.

### 2. Structured Data (JSON-LD)

9 typów schema wstrzykiwanych automatycznie:

| Schema | Gdzie | Co daje w SERP |
|---|---|---|
| **Organization** | Globalnie (każda strona) | Knowledge Panel signal, brand identity |
| **ProfessionalService** | Globalnie | Lokalne SEO (areaServed: Polska) |
| **WebSite + SearchAction** | Globalnie | Sitelinks searchbox w SERP |
| **BreadcrumbList** | Wszystkie podstrony | Rich breadcrumbs zamiast URL |
| **Service** | 6 podstron usług (one-page, strona firmowa, Strona interaktywna, sklep internetowy, system CRM, chatboty AI; UI/UX usunięta 2026-10-01) | Rich results dla "wycena strony one page" itp. |
| **BlogPosting** | Każdy post | Top Stories, Featured Snippet eligibility |
| **CreativeWork** | Każde case study | Portfolio rich result |
| **ItemList** (4× CreativeWork) | Sekcja Realizacje na stronie głównej (`featuredWorkSchema`) | Spójne `@id` z case studies, lista realizacji dla wyszukiwarek |
| **FAQPage** | `/o-nas` (i `/en/about-us`) | Rozwijalne FAQ pod wynikiem (typ. +30% CTR) |

~~**Review**~~ w sekcji Opinie - usunięty 2026-09-30 (błąd „Wiele weryfikacji bez obiektu aggregateRating”, patrz „Ocena Google” wyżej).

Wszystko centralizowane w `lib/schemas.ts`. Dane firmy w `lib/seo-data.ts`.

**Drugi telefon kontaktowy:** w obiekcie `CONTACT` (`lib/seo-data.ts`) są dwa numery — `phone`/`phoneDisplay` (`+48 668 124 367`) oraz `phone2`/`phone2Display` (`+48 531 104 402`). Oba renderowane na `/kontakt` jako klikalne numery. Drugi numer jest też wykorzystywany w danych administratora na stronie Polityki Prywatności.

### 3. Metadata na każdej podstronie

- Tytuł SEO (60-70 znaków, słowa kluczowe na początku)
- Description 150-160 znaków
- Canonical URL
- Open Graph + Twitter Card
- **Open Graph na podstronie zawsze w całości** (`type`, `locale`, `siteName`, `url`, obrazek + własna karta Twittera): blok `openGraph` strony zastępuje blok z root layoutu, nie łączy się z nim. 2026-10-01 uzupełnione na Usługach, Realizacjach i Kontakcie (wcześniej bez obrazka).
- Keywords PL long-tail
- Globalny fallback OG image: `/og-default.png` (1200×630)
- `/blog/[slug]` — OG z `post.mainImage`, `article:published_time`, `authors`
- `/realizacje/[slug]` — OG z `project.mockupImage`

### 4. Favicon set + PWA

- `favicon-16.png`, `favicon-32.png`
- `apple-touch-icon.png` (180×180)
- `icon-192.png`, `icon-512.png` (Android Add to Home Screen)
- `manifest.webmanifest` z `theme_color: #050505`, `display: standalone`

### 5. Sitemap

Plik: `app/sitemap.ts` (generuje `/sitemap.xml` przy build).
- Bez 404-ek (hardcoded `SERVICE_PAGES`, omija niedokończone podstrony marketing)
- Zróżnicowane `lastModified` per typ contentu (Google ignoruje sitemapy gdzie wszystko "dzisiaj")
- Realne daty postów z `posts.ts`, realne lata projektów z `projects.ts`

### 6. Hosting i nagłówki (Cloudflare Pages)

Pliki: `public/_headers` i `public/_redirects` (trafiają do `out/` razem ze stroną; `.htaccess` usunięty - na Pages byłby publicznym plikiem).
- Cache 1 rok immutable dla `_next/static/*` (hash w nazwie = safe), 30 dni dla `/portfolio/*` i renderu planety hero
- HTML bez cache (`max-age=0, must-revalidate`) - po deployu świeża treść od razu, bez purge
- Nagłówki bezpieczeństwa: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `X-Robots-Tag: noindex` na adresach `*.pages.dev` (produkcyjny i preview) - zero duplicate content
- 301 ze starych adresów w `_redirects`: restrukturyzacja oferty, stare slugi EN, usunięta usługa UI/UX (`/uslugi/design*` → `/uslugi/strony-www/`, `/en/services/design*` → `/en/services/websites/`)
- HTTPS, Brotli / Gzip, trailing slash i `/404.html` robi Cloudflare Pages sam

---

## Narzędzia do weryfikacji (po każdym deploy)

| Co sprawdzić | URL | Co powinno być |
|---|---|---|
| Schema validator | https://validator.schema.org | ✓ Organization, ✓ ProfessionalService, ✓ WebSite — zero błędów |
| Rich Results Test | https://search.google.com/test/rich-results | ✓ FAQPage na /o-nas, ✓ Service na podstronach usług |
| OG preview | https://www.opengraph.xyz | Ładny preview z AVENLY OG image |
| Mobile-Friendly | https://search.google.com/test/mobile-friendly | ✓ Page is mobile-friendly |
| PageSpeed | https://pagespeed.web.dev | Mobile 85+, Desktop 99 |
| Robots.txt | https://avenly.pl/robots.txt | Allow Google-Extended + reszta AI search bots |
| Sitemap | https://avenly.pl/sitemap.xml | Wszystkie podstrony, valid XML |

---

## (Opcjonalnie) Google Analytics 4 + Microsoft Clarity

Aktualnie strona NIE ma żadnych analytics. Polecam dodać:

- **GA4** (https://analytics.google.com) — standard branżowy
- **Microsoft Clarity** (https://clarity.microsoft.com) — **free** heatmapy + session recordings

Dodanie ~10 minut. Daj znać gdy będziesz chciał.

**⚠️ RODO:** system zgody na cookies jest już wdrożony (baner + `lib/cookie-consent.ts`). Gdy dodacie GA4/Clarity, skrypty **MUSZĄ** być ładowane warunkowo — tylko po zgodzie. Bramkuj je przez `hasConsent('analytics')` z `lib/cookie-consent.ts` i nasłuchuj zdarzenia `avenly:cookie-consent-change` (gdy user zmieni zgodę, doładuj lub usuń skrypt). Bez tego ładowanie analytics przed zgodą łamie RODO.

---

## (Opcjonalnie) Bing Webmaster Tools

Bing ma ~5% rynku w PL + jest źródłem ChatGPT Search.

1. https://www.bing.com/webmasters → Sign in
2. **Import from Google Search Console** — jeden klik, gotowe.
3. (Alternatywnie) ręczna weryfikacja przez meta tag — dodaj do `metadata` w `app/(pl)/layout.tsx` (i `app/(en)/layout.tsx`):
```ts
verification: {
  other: { 'msvalidate.01': 'TWÓJ-KOD-BING' },
}
```

---

## Co zachodzi automatycznie w czasie (po deploy)

| Czas | Co się dzieje |
|---|---|
| **24-72h** | Google przeskanuje nową robots.txt → AI Overviews podchwyci świeże content |
| **3-7 dni** | Rich snippets w SERP — breadcrumbs zamiast URL, FAQ snippet (gwiazdek opinii nie będzie: Review i AggregateRating usunięte, patrz „Ocena Google”) |
| **7-14 dni** | ChatGPT Search, Perplexity, Claude — explicit allow zaczyna dawać cytowania |
| **1-3 mies** | Knowledge panel dla samego "avenly" (gdy brand search urośnie) |

---

## Zmiany w ofercie a SEO (2026-10)

- **„Projekt UI/UX” nie jest już osobną usługą (2026-10-01).** Podstrony `/uslugi/design` i `/uslugi/design/ui-ux` (PL i EN) usunięte, w `public/_redirects` są 301 na `/uslugi/strony-www/` i `/en/services/websites/`, sitemap ich nie zawiera. W Search Console stare adresy pojawią się jako „Strona z przekierowaniem” - to poprawne.
- **„Strona szyta na miarę” nazywa się „Strona interaktywna” (2026-10-06).** Zmienione: nazwa w metadanych i danych strukturalnych podstrony (PL „Strona interaktywna”, EN „Interactive website”), w Ofercie, stopce i formularzu. **Adres zostaje** `/uslugi/strony-www/strona-szyta-na-miare` (EN `/en/services/websites/custom-website`). Zmiana adresu jest planowana po zakończeniu pracy równoległej, jednym przejściem z 301 (folder trasy, `PL_TO_EN_SEGMENT` w `lib/i18n/locale.ts`, `app/sitemap.ts`, motywy, katalog, linki, `_redirects`) - do tego czasu nie zmieniać pojedynczych miejsc.
- **Podstrony usług są w przebudowie** (etap 3 pracy równoległej): metadane przebudowanych podstron są już bez „CMS”, „WooCommerce”, „Headless” i Title Case. W root layoutach zostały jeszcze słowa kluczowe „WooCommerce” i „UI/UX design” - do usunięcia przy porządkach.
- Po zamknięciu podstron: Rich Results Test na 6 podstronach usług i nowy pomiar PageSpeed (ostatni pomiar PSI pochodzi sprzed przebudowy strony).

---

## Co RUSZAĆ jak najmniej (i dlaczego)

### `app/robots.ts`
Jeśli zmienisz — możesz przypadkiem zablokować Google AI Overviews. Aktualna konfiguracja jest **optimized 2026**.

### `lib/schemas.ts`
Schema buildery — jeśli zmienisz nazwy pól bez konsultacji z [schema.org docs](https://schema.org/), niektóre rich results mogą zniknąć.

### `next.config.ts` — `output: 'export'`
**Nie zmieniaj.** Strona jest statyczna. Zmiana = trzeba przepisać hosting.

---

## Workflow zmiany danych firmy (2 min)

```
1. Edytuj lib/seo-data.ts (NIP, adres itp.)
2. npm run deploy                                       (~40 s: build + wysyłka na Cloudflare Pages)
   Uwaga: logowanie wranglera Avenly leży w osobnym profilu - pełne polecenie z XDG_CONFIG_HOME w CLAUDE.md („Deploy flow”)
   Test przed produkcją: npm run deploy:preview (adres preview.avenly-web.pages.dev, noindex)
3. Sprawdź validator.schema.org, że dane się załapały
```

Purge cache Cloudflare NIE jest potrzebny. Wyjątek: podmiana obrazu w `public/portfolio/` pod tą samą nazwą (cache 30 dni) - zmień nazwę pliku albo zrób purge.
