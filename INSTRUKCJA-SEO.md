# Instrukcja SEO — co już działa, co podmienić po rejestracji działalności

## TL;DR — aktualny stan (2026-06-01)

✅ **Wszystko techniczne jest zrobione i działa.** Strona jest cytowana przez Google AI Overviews z linkiem.

| Element | Status |
|---|---|
| Google Search Console | ✅ Zweryfikowane przez Cloudflare DNS |
| Robots.txt 2026-ready | ✅ Allow AI search bots, block training bots |
| Sitemap | ✅ Bez 404, zróżnicowane lastModified |
| JSON-LD Schema (8 typów) | ✅ Organization, ProfessionalService, WebSite, Service ×7, BlogPosting ×3, CreativeWork, FAQPage, AggregateRating |
| OG image (Twitter/FB/LinkedIn preview) | ✅ `/og-default.png` 1200×630 + per-page dla blog/realizacje |
| Favicon set + PWA manifest | ✅ Wszystkie rozmiary |
| Wizytówka Google | ✅ Wpięta jako `sameAs` w Organization schema |
| AI search visibility | ✅ Google AI Overviews aktywnie cytuje |
| .htaccess (cache + bezpieczeństwo) | ✅ Wgrane na Hostinger |
| Polityka prywatności i cookies (RODO) | ✅ Pełne 12 sekcji, dane administratora ciągnięte z `seo-data.ts` |
| System zgody na cookies (RODO) | ✅ Baner + `hasConsent()` helper (gotowy do bramkowania analytics) |

## Co musisz zrobić sam (jednorazowo, ~15 min)

Wszystko sprowadza się do **podmiany danych w jednym pliku**: `lib/seo-data.ts`. Po podmianie: `npm run build` → upload `out/`.

### Dane do podmiany TERAZ (jeśli masz)

Otwórz `lib/seo-data.ts`:

```ts
export const GOOGLE_BUSINESS = {
  profileUrl: 'https://share.google/YgHXGeqFgrSX4FEGs',  // ✅ wpięte
  reviewsCount: 2,  // ⚠️ aktualizuj gdy przybędą opinie
  ratingValue: 5.0, // ⚠️ aktualizuj średnią
} as const;
```

Aktualizuj `reviewsCount` i `ratingValue` regularnie — Google waży świeże dane w schema.

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

**Propaguje się też do Polityki Prywatności.** `app/polityka-prywatnosci/page.tsx` renderuje NIP/REGON/adres **warunkowo** — dziś puste pola się nie pokazują, a po uzupełnieniu `ADDRESS` + `COMPANY_IDS` w `seo-data.ts` dane automatycznie pojawią się w sekcji "Administrator danych" polityki (oprócz schema, OG i footera). E-mail i oba telefony są już ciągnięte z `CONTACT`.

Po zmianie: `npm run build` → upload `out/` → Cloudflare Purge.

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

8 typów schema wstrzykiwanych automatycznie:

| Schema | Gdzie | Co daje w SERP |
|---|---|---|
| **Organization** | Globalnie (każda strona) | Knowledge Panel signal, brand identity |
| **ProfessionalService** | Globalnie | Lokalne SEO (areaServed: Polska) |
| **WebSite + SearchAction** | Globalnie | Sitelinks searchbox w SERP |
| **BreadcrumbList** | Wszystkie podstrony | Rich breadcrumbs zamiast URL |
| **Service** | 7 podstron usług | Rich results dla "wycena strony one page" itp. |
| **BlogPosting** | Każdy post | Top Stories, Featured Snippet eligibility |
| **CreativeWork** | Każde case study | Portfolio rich result |
| **FAQPage** | `/o-nas` | Rozwijalne FAQ pod wynikiem (typ. +30% CTR) |
| **Review + AggregateRating** | Sekcja Testimonials | Gwiazdki 5.0 ★★★★★ w SERP |

Wszystko centralizowane w `lib/schemas.ts`. Dane firmy w `lib/seo-data.ts`.

**Drugi telefon kontaktowy:** w obiekcie `CONTACT` (`lib/seo-data.ts`) są dwa numery — `phone`/`phoneDisplay` (`+48 668 124 367`) oraz `phone2`/`phone2Display` (`+48 531 104 402`). Oba renderowane na `/kontakt` jako klikalne numery. Drugi numer jest też wykorzystywany w danych administratora na stronie Polityki Prywatności.

### 3. Metadata na każdej podstronie

- Tytuł SEO (60-70 znaków, słowa kluczowe na początku)
- Description 150-160 znaków
- Canonical URL
- Open Graph + Twitter Card
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

### 6. Performance (.htaccess)

Plik: `public/.htaccess` (wgrywany razem z `out/` na Hostinger).
- Cache 1 rok immutable dla `_next/static/*` (hash w nazwie = safe)
- Kompresja Brotli + Gzip
- Nagłówki bezpieczeństwa: HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Force HTTPS redirect

**WAŻNE:** Włącz "Pokaż ukryte pliki" w FTP — `.htaccess` zaczyna się od kropki.

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
3. (Alternatywnie) ręczna weryfikacja przez meta tag — dodaj do `app/layout.tsx`:
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
| **3-7 dni** | Rich snippets w SERP — gwiazdki opinii ★★★★★, breadcrumbs zamiast URL, FAQ snippet |
| **7-14 dni** | ChatGPT Search, Perplexity, Claude — explicit allow zaczyna dawać cytowania |
| **1-3 mies** | Knowledge panel dla samego "avenly" (gdy brand search urośnie) |

---

## Co RUSZAĆ jak najmniej (i dlaczego)

### `app/robots.ts`
Jeśli zmienisz — możesz przypadkiem zablokować Google AI Overviews. Aktualna konfiguracja jest **optimized 2026**.

### `lib/schemas.ts`
Schema buildery — jeśli zmienisz nazwy pól bez konsultacji z [schema.org docs](https://schema.org/), niektóre rich results mogą zniknąć.

### `next.config.ts` — `output: 'export'`
**Nie zmieniaj.** Strona jest statyczna. Zmiana = trzeba przepisać hosting.

---

## Workflow zmiany danych firmy (3 min)

```
1. Edytuj lib/seo-data.ts (NIP, adres, reviewsCount itp.)
2. npm run build                                        (~30s)
3. Upload `out/` na Hostinger                           (~1-3 min)
   ⚠️ Włącz "Pokaż ukryte pliki" — .htaccess też musi
4. Cloudflare → Caching → Purge Everything              (~30s)
5. Sprawdź validator.schema.org że dane się załapały
```
